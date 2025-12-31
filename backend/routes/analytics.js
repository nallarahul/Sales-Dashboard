const express = require('express');
const router = express.Router();
const User = require('../models/user');
const SalesMetric = require('../models/SalesMetric');
const { protect, admin } = require('../middleware/authMiddleware'); // Import your bouncers

// @desc    Get Admin Dashboard Data
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    // 1. Fetch Summary Card Data
    const totalUsers = await User.countDocuments();
    // Assuming 'sales_rep' is the standard role
    const activeReps = await User.countDocuments({ role: 'sales_rep' }); 
    
    // 2. Fetch Chart Data (Sorted by Month logic or ID)
    // Note: Since we inserted dummy data in order, we can just fetch all.
    const metrics = await SalesMetric.find({});

    // 3. Transform Data for Chart.js
    // We need separate arrays for Labels (Months) and Data (Revenue/Deals)
    const months = metrics.map(m => m.month);
    const revenueData = metrics.map(m => m.revenue);
    const dealsData = metrics.map(m => m.dealsClosed);

    // 4. Calculate Total Revenue (just for a summary card)
    const totalRevenue = metrics.reduce((acc, curr) => acc + curr.revenue, 0);

    // 5. Send Response
    res.json({
      cards: {
        totalUsers,
        activeReps,
        totalRevenue,
        latestMonthRevenue: metrics[metrics.length - 1]?.revenue || 0
      },
      charts: {
        salesConfig: {
          labels: months,
          data: revenueData
        },
        dealsConfig: {
          labels: months,
          data: dealsData
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching analytics' });
  }
});

module.exports = router;