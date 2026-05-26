const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { isMongoReady } = require('../config/db');
const Booking = require('../models/Booking');
const Facility = require('../models/Facility');
const User = require('../models/User');

const bookingsFile = path.join(__dirname, '../data/bookings.json');
const usersFile = path.join(__dirname, '../data/users.json');
const facilitiesFile = path.join(__dirname, '../data/facilities.json');

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function writeBookings(bookings) {
  fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
}

function generateId() {
  return 'booking_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
}

function isValidSlot(startTime, endTime) {
  return Number.isInteger(startTime) && Number.isInteger(endTime) && startTime >= 9 && endTime <= 18 && endTime === startTime + 1;
}

function parseBookingDate(date) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function isPastDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isMongoId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ''));
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo_secret_key');
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

function publicFacility(facility) {
  return {
    id: facility.id || facility._id?.toString(),
    name: facility.name,
    sport: facility.sport,
    quantity: facility.quantity || 1,
    college: facility.college
  };
}

function publicBooking(booking) {
  const raw = booking.toObject ? booking.toObject() : booking;
  const facility = raw.facility;
  const user = raw.user;

  return {
    id: raw.id || raw._id?.toString(),
    user: typeof user === 'object' ? user._id?.toString() : user,
    facility: typeof facility === 'object' ? facility._id?.toString() : facility,
    sport: raw.sport,
    date: raw.date,
    startTime: raw.startTime,
    endTime: raw.endTime,
    facilityNumber: raw.facilityNumber,
    status: raw.status,
    createdAt: raw.createdAt,
    facilityDetails: typeof facility === 'object' ? publicFacility(facility) : undefined,
    userName: typeof user === 'object' ? user.name : undefined
  };
}

router.get('/available-slots', async (req, res) => {
  try {
    const { sport, date } = req.query;

    if (!sport || !date) {
      return res.status(400).json({ message: 'Sport and date required' });
    }

    const requestedDate = parseBookingDate(date);
    if (!requestedDate || isPastDate(requestedDate)) {
      return res.status(400).json({ message: 'Choose a valid upcoming date' });
    }

    if (isMongoReady()) {
      const facilities = await Facility.find({ sport, active: true }).sort({ name: 1 });
      const bookings = await Booking.find({
        facility: { $in: facilities.map((facility) => facility._id) },
        date: requestedDate,
        status: 'confirmed'
      });

      const availableSlots = {};

      facilities.forEach((facility) => {
        const facilityId = facility._id.toString();
        availableSlots[facilityId] = {};

        for (let hour = 9; hour < 18; hour += 1) {
          const slotKey = `${hour}-${hour + 1}`;
          const isBooked = bookings.some((booking) =>
            booking.facility.toString() === facilityId &&
            booking.startTime === hour &&
            booking.endTime === hour + 1
          );

          availableSlots[facilityId][slotKey] = isBooked ? 'booked' : 'available';
        }
      });

      return res.json({
        sport,
        date: requestedDate.toDateString(),
        availableSlots,
        facilities: facilities.map(publicFacility)
      });
    }

    const facilities = readJson(facilitiesFile).filter((facility) => facility.sport === sport);
    const bookings = readJson(bookingsFile);
    const selectedDate = requestedDate.toDateString();
    const availableSlots = {};

    facilities.forEach((facility) => {
      availableSlots[facility.id] = {};

      for (let hour = 9; hour < 18; hour += 1) {
        const slotKey = `${hour}-${hour + 1}`;
        const isBooked = bookings.some((booking) =>
          booking.facility === facility.id &&
          new Date(booking.date).toDateString() === selectedDate &&
          booking.startTime === hour &&
          booking.endTime === hour + 1 &&
          booking.status === 'confirmed'
        );

        availableSlots[facility.id][slotKey] = isBooked ? 'booked' : 'available';
      }
    });

    res.json({ sport, date: selectedDate, availableSlots, facilities });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/book', verifyToken, async (req, res) => {
  try {
    const { facility, sport, date, startTime, endTime, facilityNumber } = req.body;

    if (!facility || !sport || !date || startTime === undefined || endTime === undefined) {
      return res.status(400).json({ message: 'All booking details required' });
    }

    if (!isValidSlot(startTime, endTime)) {
      return res.status(400).json({ message: 'Invalid time slot' });
    }

    const requestedDate = parseBookingDate(date);
    if (!requestedDate || isPastDate(requestedDate)) {
      return res.status(400).json({ message: 'Choose a valid upcoming date' });
    }

    if (isMongoReady()) {
      if (!isMongoId(req.userId)) {
        return res.status(401).json({ message: 'Session expired. Please login again.' });
      }

      if (!isMongoId(facility)) {
        return res.status(400).json({ message: 'Invalid facility for this sport' });
      }

      const currentUser = await User.findById(req.userId);
      if (!currentUser) {
        return res.status(401).json({ message: 'Session expired. Please login again.' });
      }

      const selectedFacility = await Facility.findOne({ _id: facility, active: true });
      if (!selectedFacility || selectedFacility.sport !== sport) {
        return res.status(400).json({ message: 'Invalid facility for this sport' });
      }

      const existingBooking = await Booking.findOne({
        facility,
        date: requestedDate,
        startTime,
        endTime,
        status: 'confirmed'
      });

      if (existingBooking) {
        return res.status(400).json({ message: 'Slot already booked' });
      }

      const booking = await Booking.create({
        user: req.userId,
        facility,
        sport,
        date: requestedDate,
        startTime,
        endTime,
        facilityNumber: facilityNumber || 1,
        status: 'confirmed'
      });

      return res.status(201).json({
        message: 'Booking confirmed',
        booking: publicBooking(await booking.populate(['facility', 'user']))
      });
    }

    const facilities = readJson(facilitiesFile);
    const selectedFacility = facilities.find((item) => item.id === facility);
    if (!selectedFacility || selectedFacility.sport !== sport) {
      return res.status(400).json({ message: 'Invalid facility for this sport' });
    }

    const bookings = readJson(bookingsFile);
    const selectedDate = requestedDate.toDateString();
    const isBooked = bookings.some((booking) =>
      booking.facility === facility &&
      new Date(booking.date).toDateString() === selectedDate &&
      booking.startTime === startTime &&
      booking.endTime === endTime &&
      booking.status === 'confirmed'
    );

    if (isBooked) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    const newBooking = {
      id: generateId(),
      user: req.userId,
      facility,
      sport,
      date: requestedDate,
      startTime,
      endTime,
      facilityNumber: facilityNumber || 1,
      status: 'confirmed',
      createdAt: new Date()
    };

    bookings.push(newBooking);
    writeBookings(bookings);

    res.status(201).json({ message: 'Booking confirmed', booking: newBooking });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/my-bookings', verifyToken, async (req, res) => {
  try {
    if (isMongoReady()) {
      if (!isMongoId(req.userId)) {
        return res.status(401).json({ message: 'Session expired. Please login again.' });
      }

      const bookings = await Booking.find({ user: req.userId, status: 'confirmed' })
        .populate('facility')
        .populate('user')
        .sort({ date: 1, startTime: 1 });

      return res.json(bookings.map(publicBooking));
    }

    const bookings = readJson(bookingsFile);
    const users = readJson(usersFile);
    const facilities = readJson(facilitiesFile);

    const myBookings = bookings
      .filter((booking) => booking.user === req.userId && booking.status === 'confirmed')
      .map((booking) => ({
        ...booking,
        facilityDetails: facilities.find((facility) => facility.id === booking.facility),
        userName: users.find((user) => user.id === booking.user)?.name
      }));

    res.json(myBookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/cancel/:id', verifyToken, async (req, res) => {
  try {
    if (isMongoReady()) {
      if (!isMongoId(req.userId)) {
        return res.status(401).json({ message: 'Session expired. Please login again.' });
      }

      if (!isMongoId(req.params.id)) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (booking.user.toString() !== req.userId && req.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      booking.status = 'cancelled';
      await booking.save();

      return res.json({
        message: 'Booking cancelled',
        booking: publicBooking(await booking.populate(['facility', 'user']))
      });
    }

    const bookings = readJson(bookingsFile);
    const booking = bookings.find((item) => item.id === req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user !== req.userId && req.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    writeBookings(bookings);

    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/all', verifyToken, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    if (isMongoReady()) {
      const bookings = await Booking.find()
        .populate('facility')
        .populate('user')
        .sort({ createdAt: -1 });

      return res.json(bookings.map(publicBooking));
    }

    const bookings = readJson(bookingsFile);
    const users = readJson(usersFile);
    const facilities = readJson(facilitiesFile);

    const allBookings = bookings.map((booking) => ({
      ...booking,
      facilityDetails: facilities.find((facility) => facility.id === booking.facility),
      userName: users.find((user) => user.id === booking.user)?.name
    }));

    res.json(allBookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
