require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDatabase, isMongoReady } = require('./config/db');
const seedMongoIfNeeded = require('./config/seedMongo');

const authRoutes = require('./routes/fileAuthRoutes');
const bookingRoutes = require('./routes/fileBookingRoutes');
const facilityRoutes = require('./routes/fileFacilityRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://usports-frontend.vercel.app',
  'https://usports-frontend-git-main-kritika0519s-projects.vercel.app'
];

app.use(cors({
  origin(origin, callback) {
    const isLocalDev = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '');

    if (!origin || isLocalDev || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());

const frontendDist = path.join(__dirname, '../frontend/dist');

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

app.use('/admin', express.static('public/admin'));
app.use('/student', express.static('public/student'));

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/facilities', facilityRoutes);

app.get('/', (req, res) => {
  const reactIndex = path.join(frontendDist, 'index.html');
  res.sendFile(fs.existsSync(reactIndex) ? reactIndex : path.join(__dirname, 'public/student/index.html'));
});

app.post('/api/initialize', (req, res) => {
  res.json({
    message: isMongoReady() ? 'System ready - using MongoDB Atlas' : 'System ready - using file-based storage',
    college: { collegeId: process.env.COLLEGE_ID || 'college_001', name: process.env.COLLEGE_NAME || 'ABC Engineering College' }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    database: isMongoReady() ? 'mongodb' : 'json'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Route not found' });
  }

  const reactIndex = path.join(frontendDist, 'index.html');
  const legacyIndex = path.join(__dirname, 'public/student/index.html');

  if (fs.existsSync(reactIndex)) {
    return res.sendFile(reactIndex);
  }

  if (fs.existsSync(legacyIndex)) {
    return res.sendFile(legacyIndex);
  }

  res.status(404).json({ message: 'Page not found' });
});

const PORT = process.env.PORT || 5000;
let server;

async function startServer() {
  const connected = await connectDatabase();

  if (connected) {
    await seedMongoIfNeeded();
  }

  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API: http://localhost:${PORT}`);
    console.log(`Storage: ${isMongoReady() ? 'MongoDB Atlas' : 'JSON files'}`);
  });
}

startServer();

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server?.close(() => {
    console.log('Server closed');
  });
});
