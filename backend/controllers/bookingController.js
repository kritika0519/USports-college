const Booking = require('../models/Booking');
const Facility = require('../models/Facility');
const User = require('../models/User');

// Get available slots for a sport on a specific date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { sport, date, collegeId } = req.query;

    if (!sport || !date || !collegeId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Get facilities for this sport and college
    const facilities = await Facility.find({ sport, college: collegeId });
    if (facilities.length === 0) {
      return res.status(404).json({ message: 'No facilities found for this sport' });
    }

    // Generate time slots (9 AM to 6 PM, 1 hour each)
    const timeSlots = [];
    for (let hour = 9; hour < 18; hour++) {
      timeSlots.push({
        startTime: hour,
        endTime: hour + 1,
        label: `${hour}:00 - ${hour + 1}:00`
      });
    }

    // For each facility, check which slots are booked
    const slotsWithAvailability = [];

    for (const facility of facilities) {
      for (let i = 1; i <= facility.quantity; i++) {
        const facilitySlots = [];

        for (const slot of timeSlots) {
          const booking = await Booking.findOne({
            facility: facility._id,
            date: new Date(date),
            startTime: slot.startTime,
            endTime: slot.endTime,
            facilityNumber: i,
            status: 'confirmed'
          });

          facilitySlots.push({
            ...slot,
            available: !booking,
            booked: !!booking
          });
        }

        slotsWithAvailability.push({
          facilityId: facility._id,
          facilityName: facility.name,
          facilityNumber: i,
          sport: sport,
          date: date,
          slots: facilitySlots
        });
      }
    }

    res.json(slotsWithAvailability);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Book a slot
exports.bookSlot = async (req, res) => {
  try {
    const { facilityId, date, startTime, endTime, facilityNumber, sport } = req.body;
    const userId = req.userId;

    // Check if slot already booked
    const existingBooking = await Booking.findOne({
      facility: facilityId,
      date: new Date(date),
      startTime,
      endTime,
      facilityNumber,
      status: 'confirmed'
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    // Create booking
    const booking = new Booking({
      user: userId,
      facility: facilityId,
      sport,
      date: new Date(date),
      startTime,
      endTime,
      facilityNumber,
      status: 'confirmed'
    });

    await booking.save();
    await booking.populate('user');

    res.status(201).json({
      message: 'Booking successful',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await Booking.find({ user: userId, status: 'confirmed' })
      .populate('facility')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;

    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user')
      .populate('facility')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
