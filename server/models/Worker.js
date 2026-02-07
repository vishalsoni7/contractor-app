const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 70
  },
  dailyWage: {
    type: Number,
    required: true,
    min: 0
  },
  workStartTime: {
    type: String,
    default: '09:00'
  },
  workEndTime: {
    type: String,
    default: '18:00'
  },
  photo: {
    type: String, // Base64 encoded image with GPS overlay
    default: null
  },
  photoLocation: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    timestamp: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
workerSchema.index({ contractorId: 1, status: 1 });

// Transform _id to id in JSON output
workerSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Worker', workerSchema);
