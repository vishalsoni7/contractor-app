const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
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
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave', 'holiday'],
    required: true
  },
  overtimeHours: {
    type: Number,
    default: 0,
    min: 0
  },
  checkInTime: {
    type: String,
    default: null
  },
  checkOutTime: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for unique attendance per worker per day
attendanceSchema.index({ contractorId: 1, workerId: 1, date: 1 }, { unique: true });

// Index for faster date queries
attendanceSchema.index({ contractorId: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
