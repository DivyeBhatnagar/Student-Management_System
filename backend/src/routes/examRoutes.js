const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Placeholder routes - to be implemented
router.get('/', protect, adminOnly, (req, res) => {
  res.json({ success: true, message: 'Exam routes coming soon' });
});

module.exports = router;
