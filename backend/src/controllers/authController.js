const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { asyncHandler, CustomError } = require('../middleware/errorMiddleware');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Generate student ID
const generateStudentId = async () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const result = await query(
    'SELECT COUNT(*) as count FROM students WHERE student_id LIKE $1',
    [`${year}%`]
  );
  const count = parseInt(result.rows[0].count) + 1;
  return `${year}${count.toString().padStart(4, '0')}`;
};

// Generate employee ID
const generateEmployeeId = async () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const result = await query(
    'SELECT COUNT(*) as count FROM faculty WHERE employee_id LIKE $1',
    [`EMP${year}%`]
  );
  const count = parseInt(result.rows[0].count) + 1;
  return `EMP${year}${count.toString().padStart(4, '0')}`;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    role,
    first_name,
    last_name,
    phone,
    // Student specific fields
    date_of_birth,
    gender,
    address,
    course,
    semester,
    academic_year,
    emergency_contact_name,
    emergency_contact_phone,
    // Faculty specific fields
    department,
    designation,
    qualification,
    experience_years,
    salary
  } = req.body;

  // Validation
  if (!email || !password || !role || !first_name || !last_name) {
    throw new CustomError('Please provide all required fields', 400);
  }

  if (password.length < 6) {
    throw new CustomError('Password must be at least 6 characters', 400);
  }

  const validRoles = ['student', 'faculty', 'admin'];
  if (!validRoles.includes(role)) {
    throw new CustomError('Invalid role specified', 400);
  }

  // Check if user already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new CustomError('User already exists with this email', 400);
  }

  try {
    await query('BEGIN');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userResult = await query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, role, first_name, last_name`,
      [email, hashedPassword, role, first_name, last_name, phone]
    );

    const user = userResult.rows[0];

    // Create role-specific profile
    if (role === 'student') {
      const studentId = await generateStudentId();
      await query(
        `INSERT INTO students (
          user_id, student_id, date_of_birth, gender, address, course, 
          semester, academic_year, emergency_contact_name, emergency_contact_phone,
          admission_date, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE, 'active')`,
        [
          user.id, studentId, date_of_birth, gender, address, course,
          semester, academic_year, emergency_contact_name, emergency_contact_phone
        ]
      );
      user.student_id = studentId;
    } else if (role === 'faculty') {
      const employeeId = await generateEmployeeId();
      await query(
        `INSERT INTO faculty (
          user_id, employee_id, department, designation, qualification,
          experience_years, joining_date, salary
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, $7)`,
        [user.id, employeeId, department, designation, qualification, experience_years, salary]
      );
      user.employee_id = employeeId;
    }

    await query('COMMIT');

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          student_id: user.student_id,
          employee_id: user.employee_id
        },
        token
      }
    });
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new CustomError('Please provide email and password', 400);
  }

  // Check for user
  const result = await query(
    'SELECT id, email, password_hash, role, first_name, last_name, is_active FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new CustomError('Invalid credentials', 401);
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw new CustomError('Account is deactivated', 401);
  }

  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new CustomError('Invalid credentials', 401);
  }

  // Get role-specific information
  let roleSpecificData = {};
  if (user.role === 'student') {
    const studentResult = await query(
      'SELECT student_id, course, semester, academic_year FROM students WHERE user_id = $1',
      [user.id]
    );
    if (studentResult.rows.length > 0) {
      roleSpecificData = studentResult.rows[0];
    }
  } else if (user.role === 'faculty') {
    const facultyResult = await query(
      'SELECT employee_id, department, designation FROM faculty WHERE user_id = $1',
      [user.id]
    );
    if (facultyResult.rows.length > 0) {
      roleSpecificData = facultyResult.rows[0];
    }
  }

  // Update last login
  await query(
    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
    [user.id]
  );

  // Generate token
  const token = generateToken(user.id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        ...roleSpecificData
      },
      token
    }
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get user details
  const userResult = await query(
    'SELECT id, email, role, first_name, last_name, phone, created_at, last_login FROM users WHERE id = $1',
    [userId]
  );

  if (userResult.rows.length === 0) {
    throw new CustomError('User not found', 404);
  }

  const user = userResult.rows[0];

  // Get role-specific details
  let profile = { ...user };

  if (user.role === 'student') {
    const studentResult = await query(
      `SELECT s.*, ha.room_id, hr.room_number, h.name as hostel_name
       FROM students s
       LEFT JOIN hostel_allocations ha ON s.id = ha.student_id AND ha.status = 'active'
       LEFT JOIN hostel_rooms hr ON ha.room_id = hr.id
       LEFT JOIN hostels h ON hr.hostel_id = h.id
       WHERE s.user_id = $1`,
      [userId]
    );

    if (studentResult.rows.length > 0) {
      profile = { ...profile, ...studentResult.rows[0] };
    }

    // Get fee status
    const feeResult = await query(
      `SELECT 
         SUM(total_amount) as total_fees,
         SUM(paid_amount) as paid_fees,
         SUM(due_amount) as due_fees,
         COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count
       FROM student_fees sf
       JOIN students s ON sf.student_id = s.id
       WHERE s.user_id = $1`,
      [userId]
    );

    if (feeResult.rows.length > 0) {
      profile.fee_summary = feeResult.rows[0];
    }

  } else if (user.role === 'faculty') {
    const facultyResult = await query(
      'SELECT * FROM faculty WHERE user_id = $1',
      [userId]
    );

    if (facultyResult.rows.length > 0) {
      profile = { ...profile, ...facultyResult.rows[0] };
    }

    // Get subjects taught
    const subjectsResult = await query(
      'SELECT id, code, name, course, semester FROM subjects WHERE faculty_id = (SELECT id FROM faculty WHERE user_id = $1)',
      [userId]
    );

    profile.subjects = subjectsResult.rows;
  }

  res.json({
    success: true,
    data: profile
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { first_name, last_name, phone, ...roleSpecificData } = req.body;

  try {
    await query('BEGIN');

    // Update user table
    await query(
      'UPDATE users SET first_name = $1, last_name = $2, phone = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      [first_name, last_name, phone, userId]
    );

    // Update role-specific data
    const userRole = req.user.role;

    if (userRole === 'student') {
      const {
        date_of_birth,
        gender,
        address,
        emergency_contact_name,
        emergency_contact_phone
      } = roleSpecificData;

      await query(
        `UPDATE students SET 
         date_of_birth = COALESCE($1, date_of_birth),
         gender = COALESCE($2, gender),
         address = COALESCE($3, address),
         emergency_contact_name = COALESCE($4, emergency_contact_name),
         emergency_contact_phone = COALESCE($5, emergency_contact_phone),
         updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $6`,
        [date_of_birth, gender, address, emergency_contact_name, emergency_contact_phone, userId]
      );
    } else if (userRole === 'faculty') {
      const { department, designation, qualification, experience_years } = roleSpecificData;

      await query(
        `UPDATE faculty SET 
         department = COALESCE($1, department),
         designation = COALESCE($2, designation),
         qualification = COALESCE($3, qualification),
         experience_years = COALESCE($4, experience_years),
         updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $5`,
        [department, designation, qualification, experience_years, userId]
      );
    }

    await query('COMMIT');

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    throw new CustomError('Please provide current and new password', 400);
  }

  if (newPassword.length < 6) {
    throw new CustomError('New password must be at least 6 characters', 400);
  }

  // Get current password hash
  const result = await query(
    'SELECT password_hash FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new CustomError('User not found', 404);
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, result.rows[0].password_hash);

  if (!isValidPassword) {
    throw new CustomError('Current password is incorrect', 400);
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  await query(
    'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [hashedPassword, userId]
  );

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  logout
};
