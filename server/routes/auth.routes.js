const express = require('express');
const jwt = require('jsonwebtoken');
const Contractor = require('../models/Contractor');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { companyName, email, password, phone } = req.body;

    // Check if email already exists
    const existingContractor = await Contractor.findOne({ email });
    if (existingContractor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new contractor
    const contractor = new Contractor({
      companyName,
      email,
      password,
      phone
    });

    await contractor.save();

    // Generate token
    const token = jwt.sign(
      { contractorId: contractor._id, email: contractor.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      contractor: {
        id: contractor._id,
        companyName: contractor.companyName,
        email: contractor.email,
        subscriptionPlan: contractor.subscriptionPlan,
        subscriptionStatus: contractor.subscriptionStatus,
        trialEndsAt: contractor.trialEndsAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find contractor
    const contractor = await Contractor.findOne({ email });
    if (!contractor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await contractor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { contractorId: contractor._id, email: contractor.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      contractor: {
        id: contractor._id,
        companyName: contractor.companyName,
        email: contractor.email,
        phone: contractor.phone,
        address: contractor.address,
        subscriptionPlan: contractor.subscriptionPlan,
        subscriptionStatus: contractor.subscriptionStatus,
        trialEndsAt: contractor.trialEndsAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current contractor profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.contractorId).select('-password');
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }
    res.json(contractor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { companyName, phone, address } = req.body;

    const contractor = await Contractor.findByIdAndUpdate(
      req.contractorId,
      { companyName, phone, address },
      { new: true }
    ).select('-password');

    res.json(contractor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
