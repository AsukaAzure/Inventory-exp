const Section = require('../models/Section');
const Counter = require('../models/Counter');

// Helper function to get next sequence value
const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
};

// Create a new section
const createSection = async (req, res) => {
  try {
    const { sectionname, desc } = req.body;
    
    if (!sectionname) {
      return res.status(400).json({ error: 'Section name is required' });
    }

    // Check if section already exists
    const existingSection = await Section.findOne({ sectionname });
    if (existingSection) {
      return res.status(400).json({ error: 'Section already exists' });
    }

    // Get next section ID
    const sectionId = await getNextSequenceValue('section_id');

    const section = new Section({
      _id: sectionId,
      sectionname,
      desc,
      itemsArray: []
    });

    await section.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sections
const getAllSections = async (req, res) => {
  try {
    const sections = await Section.find().sort({ _id: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get section by ID
const getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update section
const updateSection = async (req, res) => {
  try {
    const { sectionname, desc } = req.body;
    const section = await Section.findById(req.params.id);
    
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    if (sectionname) section.sectionname = sectionname;
    if (desc !== undefined) section.desc = desc;

    await section.save();
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete section
const deleteSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection
};