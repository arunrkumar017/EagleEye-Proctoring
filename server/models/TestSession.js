const mongoose = require('mongoose');

const testSessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  testName: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'terminated'],
    default: 'in-progress',
  },
  integrityScore: {
    type: Number,
    default: 100,
  },
}, { timestamps: true });

module.exports = mongoose.model('TestSession', testSessionSchema);