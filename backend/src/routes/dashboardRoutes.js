const express = require('express');
const {
  getAdminDashboard,
  getFacultyDashboard,
  getStudentDashboard
} = require('../controllers/dashboardController');
const { 
  protect, 
  adminOnly, 
  facultyOnly, 
  studentOnly 
} = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/dashboard/admin
// @desc    Get admin dashboard with statistics
// @access  Private/Admin
router.get('/admin', protect, adminOnly, getAdminDashboard);

// @route   GET /api/dashboard/faculty
// @desc    Get faculty dashboard
// @access  Private/Faculty
router.get('/faculty', protect, facultyOnly, getFacultyDashboard);

// @route   GET /api/dashboard/student
// @desc    Get student dashboard
// @access  Private/Student
router.get('/student', protect, studentOnly, getStudentDashboard);

module.exports = router;
