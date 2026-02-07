const mongoose = require('mongoose');

const advanceSchema = new mongoose.Schema({
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    required: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  reason: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'deducted', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
advanceSchema.index({ contractorId: 1, workerId: 1 });
advanceSchema.index({ contractorId: 1, date: 1 });

module.exports = mongoose.model('Advance', advanceSchema);
