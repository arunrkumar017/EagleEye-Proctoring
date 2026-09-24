require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const testSessionRoutes = require('./routes/testSessionRoutes');
const violationRoutes = require('./routes/violationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'EagleEye backend is running' });
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/test-session', testSessionRoutes);
app.use('/api/violation', violationRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));