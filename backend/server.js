const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS for Angular frontend

// Logging (only in dev mode) - Shows you know how to distinguish environments
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic Route
app.get('/', (req, res) => {
  res.send('SmartWinnr Admin API is running...');
});
// TODO: Import Routes Here
// app.use('/api/auth', require('./routes/authRoutes')); --> Done
// app.use('/api/analytics', require('./routes/analyticsRoutes')); --> Done

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});