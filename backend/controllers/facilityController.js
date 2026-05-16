const Facility = require('../models/Facility');
const College = require('../models/College');

// Admin: Add facility
exports.addFacility = async (req, res) => {
  try {
    const { name, sport, quantity, collegeId } = req.body;

    const college = await College.findOne({ collegeId });
    if (!college) {
      return res.status(400).json({ message: 'College not found' });
    }

    const facility = new Facility({
      name,
      sport,
      quantity: quantity || 1,
      college: college._id
    });

    await facility.save();

    res.status(201).json({
      message: 'Facility added successfully',
      facility
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all facilities for a college
exports.getFacilities = async (req, res) => {
  try {
    const { collegeId } = req.query;

    const college = await College.findOne({ collegeId });
    if (!college) {
      return res.status(400).json({ message: 'College not found' });
    }

    const facilities = await Facility.find({ college: college._id });

    // Group by sport
    const groupedByYour = {};
    facilities.forEach(facility => {
      if (!groupedByYour[facility.sport]) {
        groupedByYour[facility.sport] = [];
      }
      groupedByYour[facility.sport].push(facility);
    });

    res.json(groupedByYour);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all facilities (admin)
exports.getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find().populate('college');
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Delete facility
exports.deleteFacility = async (req, res) => {
  try {
    const { facilityId } = req.params;

    const facility = await Facility.findByIdAndDelete(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    res.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
