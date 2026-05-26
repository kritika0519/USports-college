const mongoose = require('mongoose');
const dns = require('dns');

let mongoReady = false;

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.log('MongoDB URI not set. Using JSON file storage.');
    return false;
  }

  try {
    if (process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'USports',
      serverSelectionTimeoutMS: 10000
    });
    mongoReady = true;
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    return true;
  } catch (error) {
    mongoReady = false;
    console.error('MongoDB connection failed. Falling back to JSON storage:', error.message);
    return false;
  }
}

function isMongoReady() {
  return mongoReady && mongoose.connection.readyState === 1;
}

module.exports = {
  connectDatabase,
  isMongoReady
};
