require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// File-based routes (no MongoDB!)
const authRoutes = require('./routes/fileAuthRoutes');
const bookingRoutes = require('./routes/fileBookingRoutes');
const facilityRoutes = require('./routes/fileFacilityRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (Frontend & Admin)
app.use('/student', express.static('public/student'));
app.use('/admin', express.static('public/admin'));

// Admin SPA fallback
app.get('/admin/*', (req, res) => {
  const adminPath = path.join(__dirname, 'public/admin/index.html');
  if (fs.existsSync(adminPath)) {
    res.sendFile(adminPath);
  } else {
    res.status(404).json({ message: 'Admin page not found' });
  }
});

app.use('/', express.static('public/student'));  // Default to student portal

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/facilities', facilityRoutes);

// Initialize - file-based system ready
app.post('/api/initialize', (req, res) => {
  res.json({
    message: 'System ready - using file-based storage',
    college: { collegeId: 'college_001', name: 'ABC Engineering College' }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Server error',
    error: process.env.NODE_ENV === 'production' ? {} : err 
  });
});

// 404 handler - Serve index.html for SPA routes
app.use((req, res) => {
  // If request is for API or admin, return 404 JSON
  if (req.path.startsWith('/api/') || req.path.startsWith('/admin/')) {
    return res.status(404).json({ message: 'Route not found' });
  }
  // For frontend routes, serve index.html (SPA fallback)
  const indexPath = path.join(__dirname, 'public/student/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ message: 'Page not found' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log('🚀 Using file-based storage (no MongoDB needed!)');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
  });
});
