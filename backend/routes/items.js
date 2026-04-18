const express = require('express');
const router = express.Router();
const {
  addItemToSection,
  getItemsFromSection,
  getItemById,
  updateItem,
  deleteItem,
  getAllItems,
  getLowStockItems
} = require('../controllers/itemController');
const authMiddleware = require('../middleware/auth');
const { requireNonViewer } = require('../middleware/auth');

// @route   GET /api/items
// @desc    Get all items across all sections
// @access  Public
router.get('/', getAllItems);

// @route   POST /api/items/section/:sectionId
// @desc    Add item to section
// @access  Private - Non-Viewer
router.post('/section/:sectionId', authMiddleware, requireNonViewer, addItemToSection);

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
// @access  Private - Non-Viewer
router.put('/section/:sectionId/:itemId', authMiddleware, requireNonViewer, updateItem);

// @route   DELETE /api/items/section/:sectionId/:itemId
// @desc    Delete item from section
// @access  Private - Non-Viewer
router.delete('/section/:sectionId/:itemId', authMiddleware, requireNonViewer, deleteItem);

router.get('/low-stock', getLowStockItems);

module.exports = router;