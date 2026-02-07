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

// Transform _id to id in JSON output
holidaySchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Holiday', holidaySchema);
