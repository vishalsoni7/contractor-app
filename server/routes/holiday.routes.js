const express = require('express');
const Holiday = require('../models/Holiday');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all holidays
router.get('/', async (req, res) => {
  try {
    const { year } = req.query;
    const query = { contractorId: req.contractorId };

    if (year) {
      query.date = { $regex: `^${year}` };
    }

    const holidays = await Holiday.find(query).sort({ date: 1 });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create holiday
router.post('/', async (req, res) => {
  try {
    const holidayData = {
      ...req.body,
      contractorId: req.contractorId
    };

    const holiday = new Holiday(holidayData);
    await holiday.save();

    res.status(201).json(holiday);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Holiday already exists for this date' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update holiday
router.put('/:id', async (req, res) => {
  try {
    const holiday = await Holiday.findOneAndUpdate(
      { _id: req.params.id, contractorId: req.contractorId },
      req.body,
      { new: true }
    );

    if (!holiday) {
      return res.status(404).json({ message: 'Holiday not found' });
    }

    res.json(holiday);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete holiday
router.delete('/:id', async (req, res) => {
  try {
    const holiday = await Holiday.findOneAndDelete({
      _id: req.params.id,
      contractorId: req.contractorId
    });

    if (!holiday) {
      return res.status(404).json({ message: 'Holiday not found' });
    }

    res.json({ message: 'Holiday deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
