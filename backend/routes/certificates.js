const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @route   GET /api/certificates
// @desc    Get user's certificates
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Mock certificates
    const certificates = [
      {
        id: 1,
        certificateNumber: 'IQ-CERT-2025-001',
        issuedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        Course: {
          id: 1,
          title: 'Introduction to React'
        }
      }
    ];
    
    res.json({
      success: true,
      data: certificates
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/certificates/:id
// @desc    Get certificate by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const certificate = {
      id: req.params.id,
      certificateNumber: 'IQ-CERT-2025-001',
      issuedAt: new Date(),
      Course: {
        id: 1,
        title: 'Introduction to React'
      },
      user: req.user
    };
    
    res.json({
      success: true,
      data: certificate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/certificates/generate/:courseId
// @desc    Generate certificate for completed course
// @access  Private
router.post('/generate/:courseId', protect, async (req, res) => {
  try {
    const certificateNumber = `IQ-CERT-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const certificate = {
      id: Date.now(),
      certificateNumber,
      courseId: req.params.courseId,
      userId: req.user.id,
      issuedAt: new Date()
    };
    
    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully',
      data: certificate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
