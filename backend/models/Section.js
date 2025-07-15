const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  sectionname: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    default: null
  },
  items: {
    type: Number,
    default: 0
  },
  itemsArray: [{
    itemId: {
      type: String,
      required: true
    },
    itemname: {
      type: String,
      required: true
    },
    availableCount: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true,
  _id: false
});

// Pre-save middleware to update items count
sectionSchema.pre('save', function(next) {
  this.items = this.itemsArray.length;
  next();
});

module.exports = mongoose.model('Section', sectionSchema);