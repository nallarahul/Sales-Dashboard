const mongoose = require('mongoose');

const salesMetricSchema = new mongoose.Schema({
  month: {
    type: String, 
    required: true
  },
  revenue: {
    type: Number,
    required: true
  },
  dealsClosed: {
    type: Number,
    required: true
  },
  // Human Touch: A calculated field often used in sales dashboards
  targetAchieved: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('SalesMetric', salesMetricSchema);