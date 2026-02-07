const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for unique holiday per contractor per date
holidaySchema.index({ contractorId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Holiday', holidaySchema);
