const mongoose = require('mongoose');

const violationLogSchema = new mongoose.Schema({
  testSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestSession',
    required: true,
  },
  type: {
    type: String,
    enum: ['no-face', 'multiple-faces', 'tab-switch', 'window-blur', 'gaze-away'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  snapshotUrl: {
    type: String, // optional - path/URL to a captured frame image
  },
}, { timestamps: true });

module.exports = mongoose.model('ViolationLog', violationLogSchema);