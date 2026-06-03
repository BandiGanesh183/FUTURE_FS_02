const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');

const { connectDB } = require('./config/database');
const { apiLimiter } = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config();

const app = express();

/* =========================================
   SECURITY & GLOBAL MIDDLEWARE
========================================= */

// Security headers
app.use(helmet());

// Compress responses
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    credentials: true,
  })
);

// Parse JSON requests
app.use(express.json());

// Parse URL encoded requests
app.use(express.urlencoded({ extended: true }));

// Rate limiter for API routes
app.use('/api', apiLimiter);

/* =========================================
   API ROUTES
========================================= */

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
/* =========================================
   HEALTH CHECK ROUTES
========================================= */

// Backend health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString(),
    pid: process.pid,
    uptime: process.uptime(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Rishi CRM API',
    version: '1.0.0',
    status: 'running',
    server: `http://localhost:${process.env.PORT || 5000}`,
  });
});

/* =========================================
   GLOBAL ERROR HANDLER
========================================= */

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});

/* =========================================
   START SERVER
========================================= */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect MySQL Database
    await connectDB();

    // Start Express Server
    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📡 Process ID: ${process.pid}`);
      console.log('✅ Backend connected successfully');
      console.log('=================================');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Initialize server
startServer();