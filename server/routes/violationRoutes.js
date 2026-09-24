const express = require('express');
const ViolationLog = require('../models/ViolationLog');
const TestSession = require('../models/TestSession');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// severity -> integrity score deduction mapping
const SEVERITY_DEDUCTIONS = {
  low: 2,
  medium: 5,
  high: 15,
};

// LOG a violation
router.post('/log', verifyToken, async (req, res) => {
  try {
    const { testSessionId, type, severity, snapshotUrl } = req.body;

    const session = await TestSession.findById(testSessionId);
    if (!session) {
      return res.status(404).json({ message: 'Test session not found' });
    }

    const violation = new ViolationLog({
      testSession: testSessionId,
      type,
      severity,
      snapshotUrl,
    });
    await violation.save();

    // deduct from integrity score, don't go below 0
    const deduction = SEVERITY_DEDUCTIONS[severity] || 0;
    session.integrityScore = Math.max(0, session.integrityScore - deduction);
    await session.save();

    res.status(201).json({ message: 'Violation logged', violation, newIntegrityScore: session.integrityScore });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all violations for a test session
router.get('/session/:sessionId', verifyToken, async (req, res) => {
  try {
    const violations = await ViolationLog.find({ testSession: req.params.sessionId }).sort({ timestamp: 1 });
    res.json(violations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;