const express = require('express');
const router = express.Router();
const {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection
} = require('../controllers/sectionController');
const authMiddleware = require('../middleware/auth');
const { requireNonViewer } = require('../middleware/auth');

// @route   POST /api/sections
// @desc    Create a new section
// @access  Private - Non-Viewer
router.post('/', authMiddleware, requireNonViewer, createSection);

// @route   GET /api/sections
// @desc    Get all sections
// @access  Public
router.get('/', getAllSections);

// @route   GET /api/sections/:id
// @desc    Get section by ID
// @access  Public
router.get('/:id', getSectionById);

// @route   PUT /api/sections/:id
// @desc    Update section
// @access  Private - Non-Viewer
router.put('/:id', authMiddleware, requireNonViewer, updateSection);

// @route   DELETE /api/sections/:id
// @desc    Delete section
// @access  Private - Non-Viewer
router.delete('/:id', authMiddleware, requireNonViewer, deleteSection);

module.exports = router;