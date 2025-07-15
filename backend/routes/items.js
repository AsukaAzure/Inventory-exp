const express = require('express');
const router = express.Router();
const {
  addItemToSection,
  getItemsFromSection,
  getItemById,
  updateItem,
  deleteItem,
  getAllItems
} = require('../controllers/itemController');

// @route   GET /api/items
// @desc    Get all items across all sections
// @access  Public
router.get('/', getAllItems);

// @route   POST /api/items/section/:sectionId
// @desc    Add item to section
// @access  Public
router.post('/section/:sectionId', addItemToSection);

// @route   GET /api/items/section/:sectionId
// @desc    Get all items from a section
// @access  Public
router.get('/section/:sectionId', getItemsFromSection);

// @route   GET /api/items/section/:sectionId/:itemId
// @desc    Get specific item from section
// @access  Public
router.get('/section/:sectionId/:itemId', getItemById);

// @route   PUT /api/items/section/:sectionId/:itemId
// @desc    Update item in section
// @access  Public
router.put('/section/:sectionId/:itemId', updateItem);

// @route   DELETE /api/items/section/:sectionId/:itemId
// @desc    Delete item from section
// @access  Public
router.delete('/section/:sectionId/:itemId', deleteItem);

module.exports = router;