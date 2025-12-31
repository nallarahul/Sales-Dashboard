const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load Models
const User = require('./models/user');
const SalesMetric = require('./models/SalesMetric');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// --- DUMMY DATA ---

// 1. Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@smartwinnr.com',
    password: 'password123', // We will hash this before saving
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@smartwinnr.com',
    password: 'password123',
    role: 'sales_rep'
  },
  {
    name: 'Jane Smith',
    email: 'jane@smartwinnr.com',
    password: 'password123',
    role: 'manager'
  }
];

// 2. Dashboard Data (Sales Metrics for Charts)
const salesData = [
  { month: 'Jan', revenue: 12000, dealsClosed: 5, targetAchieved: false },
  { month: 'Feb', revenue: 15000, dealsClosed: 8, targetAchieved: false },
  { month: 'Mar', revenue: 22000, dealsClosed: 12, targetAchieved: true }, // End of Q1 push
  { month: 'Apr', revenue: 18000, dealsClosed: 9, targetAchieved: true },
  { month: 'May', revenue: 25000, dealsClosed: 14, targetAchieved: true },
  { month: 'Jun', revenue: 30000, dealsClosed: 18, targetAchieved: true }, // Mid-year peak
  { month: 'Jul', revenue: 28000, dealsClosed: 15, targetAchieved: true },
  { month: 'Aug', revenue: 15000, dealsClosed: 7, targetAchieved: false }, // Summer slump
  { month: 'Sep', revenue: 21000, dealsClosed: 11, targetAchieved: true },
  { month: 'Oct', revenue: 26000, dealsClosed: 13, targetAchieved: true },
  { month: 'Nov', revenue: 35000, dealsClosed: 20, targetAchieved: true },
  { month: 'Dec', revenue: 42000, dealsClosed: 25, targetAchieved: true }  // Holiday rush
];

// --- LOGIC ---

const importData = async () => {
  try {
    // Clear existing data to avoid duplicates
    await User.deleteMany();
    await SalesMetric.deleteMany();

    console.log('Data Destroyed...'.red.inverse);

    // Hash passwords for users
    // Human Note: Usually we do this in a "pre-save" hook in the model, 
    // but doing it here explicitly ensures our seed data is 100% correct.
    const usersWithHashedPasswords = await Promise.all(users.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      return user;
    }));

    await User.insertMany(usersWithHashedPasswords);
    await SalesMetric.insertMany(salesData);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await SalesMetric.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}