const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const facilitiesFile = path.join(__dirname, '../data/facilities.json');

// Helper functions
function readFacilities() {
  try {
    const data = fs.readFileSync(facilitiesFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeFacilities(facilities) {
  fs.writeFileSync(facilitiesFile, JSON.stringify(facilities, null, 2));
}

function generateId() {
  return 'facility_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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

// Get all facilities
router.get('/all', (req, res) => {
  try {
    const facilities = readFacilities();
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add facility (admin)
router.post('/add', verifyToken, (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    const { name, sport, quantity } = req.body;

    if (!name || !sport || !quantity) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const facilities = readFacilities();

    const newFacility = {
      id: generateId(),
      name,
      sport,
      quantity,
      college: 'college_001'
    };

    facilities.push(newFacility);
    writeFacilities(facilities);

    res.status(201).json({
      message: 'Facility added',
      facility: newFacility
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete facility (admin)
router.delete('/:id', verifyToken, (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    let facilities = readFacilities();
    const facility = facilities.find(f => f.id === req.params.id);

    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    facilities = facilities.filter(f => f.id !== req.params.id);
    writeFacilities(facilities);

    res.json({ message: 'Facility deleted', facility });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
