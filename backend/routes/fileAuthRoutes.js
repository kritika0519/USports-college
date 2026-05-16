const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const usersFile = path.join(__dirname, '../data/users.json');

// Helper functions
function readUsers() {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function generateId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Register
router.post('/register', (req, res) => {
  try {
    const { name, email, password, rollNumber } = req.body;

    if (!name || !email || !password || !rollNumber) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const users = readUsers();
    
    // Check if user exists
    if (users.find(u => u.email === email || u.rollNumber === rollNumber)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = {
      id: generateId(),
      name,
      email,
      password, // Stored as plain text (OK for demo, use bcrypt in production)
      rollNumber,
      role: 'student',
      college: 'college_001'
    };

    users.push(newUser);
    writeUsers(users);

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'demo_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'demo_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
