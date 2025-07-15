const express = require('express');
const router = express.Router();
const {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection
} = require('../controllers/sectionController');

// @route   POST /api/sections
// @desc    Create a new section
// @access  Public
router.post('/', createSection);

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
// @access  Public
router.put('/:id', updateSection);

// @route   DELETE /api/sections/:id
// @desc    Delete section
// @access  Public
router.delete('/:id', deleteSection);

module.exports = router;