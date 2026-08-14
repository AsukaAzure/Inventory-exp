const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/sections', require('./routes/sections'));
app.use('/api/items', require('./routes/items'));
app.use('/api/auth', require('./routes/auth'));
app.use("/api/logs", require("./routes/logRoutes"));
// Basic route
const employeesRouter = require('./routes/employees')
app.use('/api/employees', employeesRouter)
app.get('/', (req, res) => {
  res.json({ message: 'Inventory Management System API' });
});

// Health check endpoint for uptime monitoring (cron-job.org, UptimeRobot, etc.)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});




// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});