const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/available-slots', bookingController.getAvailableSlots);
router.post('/book', auth, bookingController.bookSlot);
router.get('/my-bookings', auth, bookingController.getMyBookings);
router.delete('/cancel/:bookingId', auth, bookingController.cancelBooking);
router.get('/all', auth, adminOnly, bookingController.getAllBookings);

module.exports = router;
