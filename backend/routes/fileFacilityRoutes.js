const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { isMongoReady } = require('../config/db');
const Facility = require('../models/Facility');

const facilitiesFile = path.join(__dirname, '../data/facilities.json');

function readFacilities() {
  try {
    return JSON.parse(fs.readFileSync(facilitiesFile, 'utf8'));
  } catch {
    return [];
  }
}

function writeFacilities(facilities) {
  fs.writeFileSync(facilitiesFile, JSON.stringify(facilities, null, 2));
}

function generateId() {
  return 'facility_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
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

async function getAllFacilities(req, res) {
  try {
    if (isMongoReady()) {
      const facilities = await Facility.find({ active: true }).sort({ sport: 1, name: 1 });
      return res.json(facilities.map(publicFacility));
    }

    res.json(readFacilities());
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

router.get('/', getAllFacilities);
router.get('/all', getAllFacilities);

router.post('/add', verifyToken, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    const { name, sport, quantity } = req.body;

    if (!name || !sport || !quantity) {
      return res.status(400).json({ message: 'All fields required' });
    }

    if (isMongoReady()) {
      const facility = await Facility.create({
        name,
        sport,
        quantity,
        college: process.env.COLLEGE_ID || 'college_001'
      });

      return res.status(201).json({
        message: 'Facility added',
        facility: publicFacility(facility)
      });
    }

    const facilities = readFacilities();
    const newFacility = {
      id: generateId(),
      name,
      sport,
      quantity,
      college: process.env.COLLEGE_ID || 'college_001'
    };

    facilities.push(newFacility);
    writeFacilities(facilities);

    res.status(201).json({ message: 'Facility added', facility: newFacility });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    if (isMongoReady()) {
      const facility = await Facility.findByIdAndUpdate(
        req.params.id,
        { active: false },
        { new: true }
      );

      if (!facility) {
        return res.status(404).json({ message: 'Facility not found' });
      }

      return res.json({ message: 'Facility deleted', facility: publicFacility(facility) });
    }

    let facilities = readFacilities();
    const facility = facilities.find((item) => item.id === req.params.id);

    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    facilities = facilities.filter((item) => item.id !== req.params.id);
    writeFacilities(facilities);

    res.json({ message: 'Facility deleted', facility });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
