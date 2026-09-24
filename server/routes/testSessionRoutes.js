const express = require('express');
const TestSession = require('../models/TestSession');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// START a new test session
router.post('/start', verifyToken, async (req, res) => {
  try {
    const { testName } = req.body;

    const newSession = new TestSession({
      student: req.user.id,
      testName,
    });

    await newSession.save();

    res.status(201).json({ message: 'Test session started', session: newSession });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// END a test session
router.patch('/end/:sessionId', verifyToken, async (req, res) => {
  try {
    const session = await TestSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.endTime = new Date();
    session.status = 'completed';
    await session.save();

    res.json({ message: 'Test session ended', session });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all test sessions (instructors see everyone, students see only their own)
router.get('/all', verifyToken, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'instructor') {
      query.student = req.user.id;
    }

    const sessions = await TestSession.find(query)
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;