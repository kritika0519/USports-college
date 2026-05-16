const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
  collegeId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  address: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('College', CollegeSchema);
