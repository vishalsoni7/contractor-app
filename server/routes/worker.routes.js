const express = require('express');
const Worker = require('../models/Worker');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all workers for contractor
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find({ contractorId: req.contractorId })
      .sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single worker
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findOne({
      _id: req.params.id,
      contractorId: req.contractorId
    });

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create worker
router.post('/', async (req, res) => {
  try {
    const workerData = {
      ...req.body,
      contractorId: req.contractorId
    };

    const worker = new Worker(workerData);
    await worker.save();

    res.status(201).json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update worker
router.put('/:id', async (req, res) => {
  try {
    const worker = await Worker.findOneAndUpdate(
      { _id: req.params.id, contractorId: req.contractorId },
      req.body,
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete worker
router.delete('/:id', async (req, res) => {
  try {
    const worker = await Worker.findOneAndDelete({
      _id: req.params.id,
      contractorId: req.contractorId
    });

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle worker status
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const worker = await Worker.findOne({
      _id: req.params.id,
      contractorId: req.contractorId
    });

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    worker.status = worker.status === 'active' ? 'inactive' : 'active';
    await worker.save();

    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
