const mongoose = require('mongoose');

const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tennis Court 1, Table Tennis Table 1, etc
  sport: { type: String, required: true }, // Tennis, Table Tennis, Basketball, etc
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  quantity: { type: Number, default: 1 }, // For table tennis - 5 tables
  operatingHours: {
    start: { type: Number, default: 9 }, // 9 AM
    end: { type: Number, default: 18 } // 6 PM
  },
  slotDuration: { type: Number, default: 60 }, // 60 minutes per slot
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Facility', FacilitySchema);
