const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const contractorSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'standard', 'premium'],
    default: 'free'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'expired', 'trial'],
    default: 'trial'
  },
  trialEndsAt: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days trial
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
contractorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
contractorSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Contractor', contractorSchema);
