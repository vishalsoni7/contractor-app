const express = require('express');
const Attendance = require('../models/Attendance');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const { month, year, workerId, date } = req.query;
    const query = { contractorId: req.contractorId };

    // Filter by specific date
    if (date) {
      query.date = date;
    }
    // Filter by month and year
    else if (month !== undefined && year) {
      const startDate = `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`;
      const endMonth = parseInt(month) + 2;
      const endYear = endMonth > 12 ? parseInt(year) + 1 : year;
      const endDate = `${endYear}-${String(endMonth > 12 ? 1 : endMonth).padStart(2, '0')}-01`;
      query.date = { $gte: startDate, $lt: endDate };
    }

    // Filter by worker
    if (workerId) {
      query.workerId = workerId;
    }

    const attendance = await Attendance.find(query)
      .populate('workerId', 'name')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark attendance (create or update)
router.post('/', async (req, res) => {
  try {
    const { workerId, date, status, overtimeHours = 0 } = req.body;

    // Upsert: update if exists, create if not
    const attendance = await Attendance.findOneAndUpdate(
      {
        contractorId: req.contractorId,
        workerId,
        date
      },
      {
        contractorId: req.contractorId,
        workerId,
        date,
        status,
        overtimeHours
      },
      { new: true, upsert: true }
    );

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bulk mark attendance
router.post('/bulk', async (req, res) => {
  try {
    const { records } = req.body; // Array of { workerId, date, status, overtimeHours }

    const operations = records.map(record => ({
      updateOne: {
        filter: {
          contractorId: req.contractorId,
          workerId: record.workerId,
          date: record.date
        },
        update: {
          $set: {
            contractorId: req.contractorId,
            workerId: record.workerId,
            date: record.date,
            status: record.status,
            overtimeHours: record.overtimeHours || 0
          }
        },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(operations);

    res.json({ message: 'Attendance marked successfully', count: records.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get attendance for a specific date
router.get('/date/:date', async (req, res) => {
  try {
    const attendance = await Attendance.find({
      contractorId: req.contractorId,
      date: req.params.date
    }).populate('workerId', 'name dailyWage');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete attendance record
router.delete('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findOneAndDelete({
      _id: req.params.id,
      contractorId: req.contractorId
    });

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
