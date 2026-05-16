const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const bookingsFile = path.join(__dirname, '../data/bookings.json');
const usersFile = path.join(__dirname, '../data/users.json');
const facilitiesFile = path.join(__dirname, '../data/facilities.json');

// Helper functions
function readBookings() {
  try {
    const data = fs.readFileSync(bookingsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeBookings(bookings) {
  fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
}

function readUsers() {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function readFacilities() {
  try {
    const data = fs.readFileSync(facilitiesFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function generateId() {
  return 'booking_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Middleware to verify token
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
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Get available slots
router.get('/available-slots', (req, res) => {
  try {
    const { sport, date } = req.query;

    if (!sport || !date) {
      return res.status(400).json({ message: 'Sport and date required' });
    }

    const facilities = readFacilities().filter(f => f.sport === sport);
    const bookings = readBookings();
    const selectedDate = new Date(date).toDateString();

    const availableSlots = {};

    facilities.forEach(facility => {
      availableSlots[facility.id] = {};
      
      // Generate time slots (9 AM to 6 PM = 9 hours)
      for (let hour = 9; hour < 18; hour++) {
        const slotKey = `${hour}-${hour + 1}`;
        
        // Check if this slot is booked
        const isBooked = bookings.some(b => 
          b.facility === facility.id &&
          new Date(b.date).toDateString() === selectedDate &&
          b.startTime === hour &&
          b.endTime === hour + 1 &&
          b.status === 'confirmed'
        );

        availableSlots[facility.id][slotKey] = !isBooked ? 'available' : 'booked';
      }
    });

    res.json({
      sport,
      date: selectedDate,
      availableSlots,
      facilities
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book slot
router.post('/book', verifyToken, (req, res) => {
  try {
    const { facility, sport, date, startTime, endTime, facilityNumber } = req.body;

    if (!facility || !sport || !date || startTime === undefined || endTime === undefined) {
      return res.status(400).json({ message: 'All booking details required' });
    }

    const bookings = readBookings();
    const selectedDate = new Date(date).toDateString();

    // Check if slot is already booked
    const isBooked = bookings.some(b => 
      b.facility === facility &&
      new Date(b.date).toDateString() === selectedDate &&
      b.startTime === startTime &&
      b.endTime === endTime &&
      b.status === 'confirmed'
    );

    if (isBooked) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    // Create booking
    const newBooking = {
      id: generateId(),
      user: req.userId,
      facility,
      sport,
      date: new Date(date),
      startTime,
      endTime,
      facilityNumber: facilityNumber || 1,
      status: 'confirmed',
      createdAt: new Date()
    };

    bookings.push(newBooking);
    writeBookings(bookings);

    res.status(201).json({
      message: 'Booking confirmed',
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get my bookings
router.get('/my-bookings', verifyToken, (req, res) => {
  try {
    const bookings = readBookings();
    const users = readUsers();
    const facilities = readFacilities();

    const myBookings = bookings
      .filter(b => b.user === req.userId && b.status === 'confirmed')
      .map(b => ({
        ...b,
        facilityDetails: facilities.find(f => f.id === b.facility),
        userName: users.find(u => u.id === b.user)?.name
      }));

    res.json(myBookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking
router.delete('/cancel/:id', verifyToken, (req, res) => {
  try {
    const bookings = readBookings();
    const booking = bookings.find(b => b.id === req.params.id);

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

// Get all bookings (admin)
router.get('/all', verifyToken, (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    const bookings = readBookings();
    const users = readUsers();
    const facilities = readFacilities();

    const allBookings = bookings.map(b => ({
      ...b,
      facilityDetails: facilities.find(f => f.id === b.facility),
      userName: users.find(u => u.id === b.user)?.name
    }));

    res.json(allBookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
