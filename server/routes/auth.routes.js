const express = require('express');
const jwt = require('jsonwebtoken');
const Contractor = require('../models/Contractor');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Register new contractor
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, companyName } = req.body;

    // Validate required fields
    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ message: 'First name is required' });
    }
    if (!lastName || !lastName.trim()) {
      return res.status(400).json({ message: 'Last name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const existingContractor = await Contractor.findOne({ email: email.toLowerCase() });
    if (existingContractor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new contractor
    const contractor = new Contractor({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone ? phone.trim() : '',
      companyName: companyName ? companyName.trim() : ''
    });

    await contractor.save();

    // Generate JWT token
    const token = jwt.sign(
      { contractorId: contractor._id, email: contractor.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      contractor: {
        id: contractor._id,
        firstName: contractor.firstName,
        lastName: contractor.lastName,
        email: contractor.email,
        phone: contractor.phone,
        companyName: contractor.companyName,
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

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find contractor and include password for comparison
    const contractor = await Contractor.findOne({ email: email.toLowerCase() }).select('+password');
    if (!contractor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await contractor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { contractorId: contractor._id, email: contractor.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      contractor: {
        id: contractor._id,
        firstName: contractor.firstName,
        lastName: contractor.lastName,
        email: contractor.email,
        phone: contractor.phone,
        companyName: contractor.companyName,
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
    const contractor = await Contractor.findById(req.contractorId);
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }
    res.json({
      id: contractor._id,
      firstName: contractor.firstName,
      lastName: contractor.lastName,
      email: contractor.email,
      phone: contractor.phone,
      companyName: contractor.companyName,
      subscriptionPlan: contractor.subscriptionPlan,
      subscriptionStatus: contractor.subscriptionStatus,
      trialEndsAt: contractor.trialEndsAt,
      createdAt: contractor.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, companyName } = req.body;

    const updates = {};
    if (firstName) updates.firstName = firstName.trim();
    if (lastName) updates.lastName = lastName.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (companyName !== undefined) updates.companyName = companyName.trim();

    const contractor = await Contractor.findByIdAndUpdate(
      req.contractorId,
      updates,
      { new: true }
    );

    res.json({
      id: contractor._id,
      firstName: contractor.firstName,
      lastName: contractor.lastName,
      email: contractor.email,
      phone: contractor.phone,
      companyName: contractor.companyName,
      subscriptionPlan: contractor.subscriptionPlan,
      subscriptionStatus: contractor.subscriptionStatus,
      trialEndsAt: contractor.trialEndsAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
