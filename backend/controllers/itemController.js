const Section = require('../models/Section');
const Counter = require('../models/Counter');

// Helper function to get next sequence value for items
const getNextItemSequence = async (sectionname) => {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: `${sectionname}_item_counter` },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
};

// Add item to section
const addItemToSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { itemname, availableCount = 0 } = req.body;

    if (!itemname) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    // Check if item already exists in this section
    const existingItem = section.itemsArray.find(item => item.itemname === itemname);
    if (existingItem) {
      return res.status(400).json({ error: 'Item already exists in this section' });
    }

    // Generate item ID: sectionname + counter
    const itemCounter = await getNextItemSequence(section.sectionname);
    const itemId = `${section.sectionname}${itemCounter}`;

    const newItem = {
      itemId,
      itemname,
      availableCount
    };

    section.itemsArray.push(newItem);
    await section.save();

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all items from a section
const getItemsFromSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const section = await Section.findById(sectionId);
    
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.json(section.itemsArray);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific item from section
const getItemById = async (req, res) => {
  try {
    const { sectionId, itemId } = req.params;
    const section = await Section.findById(sectionId);
    
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    const item = section.itemsArray.find(item => item.itemId === itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update item in section
const updateItem = async (req, res) => {
  try {
    const { sectionId, itemId } = req.params;
    const { itemname, availableCount } = req.body;

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    const itemIndex = section.itemsArray.findIndex(item => item.itemId === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (itemname) section.itemsArray[itemIndex].itemname = itemname;
    if (availableCount !== undefined) section.itemsArray[itemIndex].availableCount = availableCount;

    await section.save();
    res.json(section.itemsArray[itemIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete item from section
const deleteItem = async (req, res) => {
  try {
    const { sectionId, itemId } = req.params;
    const section = await Section.findById(sectionId);
    
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    const itemIndex = section.itemsArray.findIndex(item => item.itemId === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    section.itemsArray.splice(itemIndex, 1);
    await section.save();

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all items across all sections
const getAllItems = async (req, res) => {
  try {
    const sections = await Section.find();
    let allItems = [];
    
    sections.forEach(section => {
      const sectionItems = section.itemsArray.map(item => ({
        ...item.toObject(),
        sectionName: section.sectionname,
        sectionId: section._id
      }));
      allItems = allItems.concat(sectionItems);
    });

    res.json(allItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addItemToSection,
  getItemsFromSection,
  getItemById,
  updateItem,
  deleteItem,
  getAllItems
};