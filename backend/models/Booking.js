const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
  sport: { type: String, required: true },
  date: { type: Date, required: true }, // YYYY-MM-DD
  startTime: { type: Number, required: true }, // 9, 10, 11, etc (hour)
  endTime: { type: Number, required: true }, // 10, 11, 12, etc
  facilityNumber: { type: Number, default: 1 }, // For multiple facilities like 5 tables
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now }
});

// Compound index - ek facility ka ek specific slot ek hi user le sakta hai
BookingSchema.index({ facility: 1, date: 1, startTime: 1, endTime: 1, facilityNumber: 1, status: 1 }, { unique: true });

module.exports = mongoose.model('Booking', BookingSchema);
