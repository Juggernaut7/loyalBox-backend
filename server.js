// Load environment variables
require('dotenv').config();

// Core modules
const express = require('express');

// Custom modules
const connectDB = require('./config/db');
// app.use("/", (req, res)=> {
//   res.send("Welcome to the Rewards API");
// })

// Route files
const authRoutes = require('./routes/authRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json()); // Body parser for JSON

// Routes
app.use('/api/auth', authRoutes);              // Register & Login
app.use('/api/rewards', rewardRoutes);         // View / manage rewards
app.use('/api/transactions', transactionRoutes); // Earn / redeem points
app.use('/api/admin', adminRoutes);

// Optional: 404 handler for unknown routes
app.use((req, res) => {
  res.status(200).json('Viola, welcome to loyalbox');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
