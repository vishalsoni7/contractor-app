const express = require('express');
const Advance = require('../models/Advance');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all advances
router.get('/', async (req, res) => {
  try {
    const { workerId, month, year, status } = req.query;
    const query = { contractorId: req.contractorId };

    if (workerId) {
      query.workerId = workerId;
    }

    if (status) {
      query.status = status;
    }

    // Filter by month and year
    if (month !== undefined && year) {
      const startDate = `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`;
      const endMonth = parseInt(month) + 2;
      const endYear = endMonth > 12 ? parseInt(year) + 1 : year;
      const endDate = `${endYear}-${String(endMonth > 12 ? 1 : endMonth).padStart(2, '0')}-01`;
      query.date = { $gte: startDate, $lt: endDate };
    }

    const advances = await Advance.find(query)
      .populate('workerId', 'name')
      .sort({ date: -1 });

    res.json(advances);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create advance
router.post('/', async (req, res) => {
  try {
    const advanceData = {
      ...req.body,
      contractorId: req.contractorId
    };

    const advance = new Advance(advanceData);
    await advance.save();

    res.status(201).json(advance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update advance
router.put('/:id', async (req, res) => {
  try {
    const advance = await Advance.findOneAndUpdate(
      { _id: req.params.id, contractorId: req.contractorId },
      req.body,
      { new: true }
    );

    if (!advance) {
      return res.status(404).json({ message: 'Advance not found' });
    }

    res.json(advance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete advance
router.delete('/:id', async (req, res) => {
  try {
    const advance = await Advance.findOneAndDelete({
      _id: req.params.id,
      contractorId: req.contractorId
    });

    if (!advance) {
      return res.status(404).json({ message: 'Advance not found' });
    }

    res.json({ message: 'Advance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get total advances for a worker in a month
router.get('/worker/:workerId/monthly', async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`;
    const endMonth = parseInt(month) + 2;
    const endYear = endMonth > 12 ? parseInt(year) + 1 : year;
    const endDate = `${endYear}-${String(endMonth > 12 ? 1 : endMonth).padStart(2, '0')}-01`;

    const advances = await Advance.find({
      contractorId: req.contractorId,
      workerId: req.params.workerId,
      date: { $gte: startDate, $lt: endDate },
      status: { $ne: 'cancelled' }
    });

    const total = advances.reduce((sum, adv) => sum + adv.amount, 0);

    res.json({ total, advances });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
