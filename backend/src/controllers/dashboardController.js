const { query } = require('../config/database');
const { asyncHandler, CustomError } = require('../middleware/errorMiddleware');

// @desc    Get admin dashboard statistics
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminDashboard = asyncHandler(async (req, res) => {
  try {
    // Get total counts
    const [
      totalStudents,
      totalFaculty,
      totalAdmissions,
      totalRevenue
    ] = await Promise.all([
      query('SELECT COUNT(*) as count FROM students WHERE status = $1', ['active']),
      query('SELECT COUNT(*) as count FROM faculty'),
      query('SELECT COUNT(*) as count FROM admissions'),
      query('SELECT COALESCE(SUM(paid_amount), 0) as total FROM fee_payments WHERE payment_status = $1', ['success'])
    ]);

    // Get recent admissions (last 30 days)
    const recentAdmissions = await query(`
      SELECT COUNT(*) as count 
      FROM admissions 
      WHERE application_date >= CURRENT_DATE - INTERVAL '30 days'
    `);

    // Get fee collection statistics
    const feeStats = await query(`
      SELECT 
        COUNT(*) as total_students,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_students,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_students,
        SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue_students,
        SUM(total_amount) as total_fees,
        SUM(paid_amount) as collected_fees,
        SUM(due_amount) as pending_fees
      FROM student_fees
    `);

    // Get hostel occupancy
    const hostelStats = await query(`
      SELECT 
        COUNT(h.id) as total_hostels,
        SUM(h.total_rooms) as total_rooms,
        SUM(h.occupied_rooms) as occupied_rooms,
        COUNT(ha.id) as current_allocations
      FROM hostels h
      LEFT JOIN hostel_allocations ha ON ha.status = 'active'
      WHERE h.is_active = true
    `);

    // Get monthly admission trends (last 6 months)
    const admissionTrends = await query(`
      SELECT 
        TO_CHAR(application_date, 'Mon YYYY') as month,
        COUNT(*) as admissions,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved
      FROM admissions 
      WHERE application_date >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY TO_CHAR(application_date, 'Mon YYYY'), DATE_TRUNC('month', application_date)
      ORDER BY DATE_TRUNC('month', application_date)
    `);

    // Get fee collection trends (last 6 months)
    const feeCollectionTrends = await query(`
      SELECT 
        TO_CHAR(payment_date, 'Mon YYYY') as month,
        SUM(amount) as amount
      FROM fee_payments 
      WHERE payment_status = 'success' 
        AND payment_date >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY TO_CHAR(payment_date, 'Mon YYYY'), DATE_TRUNC('month', payment_date)
      ORDER BY DATE_TRUNC('month', payment_date)
    `);

    // Get course-wise student distribution
    const courseDistribution = await query(`
      SELECT 
        course,
        COUNT(*) as student_count
      FROM students 
      WHERE status = 'active'
      GROUP BY course
      ORDER BY student_count DESC
    `);

    res.json({
      success: true,
      data: {
        overview: {
          totalStudents: parseInt(totalStudents.rows[0].count),
          totalFaculty: parseInt(totalFaculty.rows[0].count),
          totalAdmissions: parseInt(totalAdmissions.rows[0].count),
          totalRevenue: parseFloat(totalRevenue.rows[0].total),
          recentAdmissions: parseInt(recentAdmissions.rows[0].count)
        },
        feeStatistics: feeStats.rows[0],
        hostelStatistics: hostelStats.rows[0],
        trends: {
          admissions: admissionTrends.rows,
          feeCollection: feeCollectionTrends.rows
        },
        distributions: {
          courses: courseDistribution.rows
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    throw new CustomError('Failed to fetch dashboard data', 500);
  }
});

// @desc    Get faculty dashboard
// @route   GET /api/dashboard/faculty
// @access  Private/Faculty
const getFacultyDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    // Get faculty details
    const facultyResult = await query(
      'SELECT id, department, designation FROM faculty WHERE user_id = $1',
      [userId]
    );

    if (facultyResult.rows.length === 0) {
      throw new CustomError('Faculty profile not found', 404);
    }

    const faculty = facultyResult.rows[0];

    // Get subjects taught by faculty
    const subjects = await query(`
      SELECT s.id, s.code, s.name, s.course, s.semester, s.credits
      FROM subjects s
      WHERE s.faculty_id = $1 AND s.is_active = true
    `, [faculty.id]);

    // Get student counts for each subject
    const subjectStats = await Promise.all(
      subjects.rows.map(async (subject) => {
        const studentCount = await query(`
          SELECT COUNT(DISTINCT st.id) as count
          FROM students st
          WHERE st.course = $1 AND st.semester = $2 AND st.status = 'active'
        `, [subject.course, subject.semester]);

        return {
          ...subject,
          studentCount: parseInt(studentCount.rows[0].count)
        };
      })
    );

    // Get recent exam results
    const recentExams = await query(`
      SELECT 
        e.name as exam_name,
        e.exam_date,
        e.max_marks,
        s.name as subject_name,
        COUNT(ser.id) as total_students,
        AVG(ser.marks_obtained) as average_marks
      FROM exams e
      JOIN subjects s ON e.subject_id = s.id
      LEFT JOIN student_exam_results ser ON e.id = ser.exam_id
      WHERE s.faculty_id = $1 AND e.exam_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY e.id, e.name, e.exam_date, e.max_marks, s.name
      ORDER BY e.exam_date DESC
      LIMIT 5
    `, [faculty.id]);

    // Get attendance summary
    const attendanceSummary = await query(`
      SELECT 
        s.name as subject_name,
        COUNT(a.id) as total_classes,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_count
      FROM subjects s
      LEFT JOIN attendance a ON s.id = a.subject_id
      WHERE s.faculty_id = $1 AND a.date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY s.id, s.name
    `, [faculty.id]);

    res.json({
      success: true,
      data: {
        profile: {
          department: faculty.department,
          designation: faculty.designation
        },
        subjects: subjectStats,
        recentExams: recentExams.rows,
        attendanceSummary: attendanceSummary.rows,
        overview: {
          totalSubjects: subjects.rows.length,
          totalStudents: subjectStats.reduce((sum, subject) => sum + subject.studentCount, 0)
        }
      }
    });
  } catch (error) {
    console.error('Faculty dashboard error:', error);
    throw error;
  }
});

// @desc    Get student dashboard
// @route   GET /api/dashboard/student
// @access  Private/Student
const getStudentDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    // Get student details
    const studentResult = await query(`
      SELECT s.*, ha.room_id, hr.room_number, h.name as hostel_name
      FROM students s
      LEFT JOIN hostel_allocations ha ON s.id = ha.student_id AND ha.status = 'active'
      LEFT JOIN hostel_rooms hr ON ha.room_id = hr.id
      LEFT JOIN hostels h ON hr.hostel_id = h.id
      WHERE s.user_id = $1
    `, [userId]);

    if (studentResult.rows.length === 0) {
      throw new CustomError('Student profile not found', 404);
    }

    const student = studentResult.rows[0];

    // Get fee summary
    const feeSummary = await query(`
      SELECT 
        SUM(total_amount) as total_fees,
        SUM(paid_amount) as paid_fees,
        SUM(due_amount) as due_fees,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count,
        MIN(CASE WHEN status IN ('pending', 'partial') THEN due_date END) as next_due_date
      FROM student_fees
      WHERE student_id = $1
    `, [student.id]);

    // Get recent exam results
    const recentResults = await query(`
      SELECT 
        e.name as exam_name,
        e.exam_date,
        e.max_marks,
        s.name as subject_name,
        ser.marks_obtained,
        ser.grade,
        ser.is_absent
      FROM student_exam_results ser
      JOIN exams e ON ser.exam_id = e.id
      JOIN subjects s ON e.subject_id = s.id
      WHERE ser.student_id = $1
      ORDER BY e.exam_date DESC
      LIMIT 5
    `, [student.id]);

    // Get attendance summary
    const attendanceSummary = await query(`
      SELECT 
        s.name as subject_name,
        COUNT(a.id) as total_classes,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
        ROUND(
          (COUNT(CASE WHEN a.status = 'present' THEN 1 END)::float / 
           COUNT(a.id)::float * 100), 2
        ) as attendance_percentage
      FROM subjects s
      LEFT JOIN attendance a ON s.id = a.subject_id
      WHERE a.student_id = $1 AND s.course = $2 AND s.semester = $3
      GROUP BY s.id, s.name
    `, [student.id, student.course, student.semester]);

    // Get upcoming exam schedule
    const upcomingExams = await query(`
      SELECT 
        e.name as exam_name,
        e.exam_date,
        e.duration_minutes,
        s.name as subject_name,
        s.code as subject_code
      FROM exams e
      JOIN subjects s ON e.subject_id = s.id
      WHERE s.course = $1 AND s.semester = $2 
        AND e.exam_date >= CURRENT_DATE
      ORDER BY e.exam_date
      LIMIT 5
    `, [student.course, student.semester]);

    res.json({
      success: true,
      data: {
        profile: {
          studentId: student.student_id,
          course: student.course,
          semester: student.semester,
          academicYear: student.academic_year,
          hostel: student.hostel_name ? {
            name: student.hostel_name,
            roomNumber: student.room_number
          } : null
        },
        feeSummary: feeSummary.rows[0],
        recentResults: recentResults.rows,
        attendanceSummary: attendanceSummary.rows,
        upcomingExams: upcomingExams.rows,
        overview: {
          overallAttendance: attendanceSummary.rows.length > 0 
            ? attendanceSummary.rows.reduce((sum, item) => sum + parseFloat(item.attendance_percentage || 0), 0) / attendanceSummary.rows.length
            : 0
        }
      }
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    throw error;
  }
});

module.exports = {
  getAdminDashboard,
  getFacultyDashboard,
  getStudentDashboard
};
