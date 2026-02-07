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

// Transform _id to id in JSON output
attendanceSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    // Handle both populated and non-populated workerId
    if (ret.workerId) {
      if (typeof ret.workerId === 'object' && ret.workerId._id) {
        // Populated: extract _id and keep worker name for display
        ret.workerName = ret.workerId.name;
        ret.workerId = ret.workerId._id.toString();
      } else {
        ret.workerId = ret.workerId.toString();
      }
    }
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
