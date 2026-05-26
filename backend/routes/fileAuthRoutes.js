const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { isMongoReady } = require('../config/db');
const User = require('../models/User');

const usersFile = path.join(__dirname, '../data/users.json');

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function generateId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
}

function publicUser(user) {
  return {
    id: user.id || user._id?.toString(),
    name: user.name,
    email: user.email,
    rollNumber: user.rollNumber,
    role: user.role,
    department: user.department || '',
    courseYear: user.courseYear || '',
    contactNumber: user.contactNumber || '',
    sportsInterests: user.sportsInterests || [],
    profileImage: user.profileImage || ''
  };
}

function sanitizeText(value, maxLength = 120) {
  return String(value || '').trim().replace(/[<>]/g, '').slice(0, maxLength);
}

function sanitizeSportsInterests(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => sanitizeText(item, 40)).filter(Boolean).slice(0, 8);
}

async function findCurrentUser(userId) {
  if (isMongoReady()) {
    return User.findById(userId);
  }

  return readUsers().find((user) => user.id === userId);
}

function signToken(user) {
  return jwt.sign(
    { userId: user.id || user._id?.toString(), role: user.role },
    process.env.JWT_SECRET || 'demo_secret_key',
    { expiresIn: '7d' }
  );
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

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, rollNumber } = req.body;

    if (!name || !email || !password || !rollNumber) {
      return res.status(400).json({ message: 'All fields required' });
    }

    if (isMongoReady()) {
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { rollNumber }]
      });

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        rollNumber,
        role: 'student',
        college: process.env.COLLEGE_ID || 'college_001'
      });

      return res.status(201).json({
        message: 'Registration successful',
        token: signToken(user),
        user: publicUser(user)
      });
    }

    const users = readUsers();

    if (users.find((user) => user.email === email || user.rollNumber === rollNumber)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
      id: generateId(),
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      rollNumber,
      role: 'student',
      college: process.env.COLLEGE_ID || 'college_001'
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({
      message: 'Registration successful',
      token: signToken(newUser),
      user: publicUser(newUser)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    if (isMongoReady()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      const passwordMatches = user && bcrypt.compareSync(password, user.password);

      if (!passwordMatches) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      return res.json({
        message: 'Login successful',
        token: signToken(user),
        user: publicUser(user)
      });
    }

    const users = readUsers();
    const user = users.find((item) => item.email === email);
    const passwordMatches = user && (
      user.password?.startsWith('$2')
        ? bcrypt.compareSync(password, user.password)
        : user.password === password
    );

    if (!passwordMatches) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.password.startsWith('$2')) {
      user.password = bcrypt.hashSync(password, 10);
      writeUsers(users);
    }

    res.json({
      message: 'Login successful',
      token: signToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/users', verifyToken, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    if (isMongoReady()) {
      const users = await User.find().sort({ role: 1, name: 1 });
      return res.json(users.map(publicUser));
    }

    res.json(readUsers().map(publicUser));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await findCurrentUser(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(publicUser(user));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/profile', verifyToken, async (req, res) => {
  try {
    const updates = {
      name: sanitizeText(req.body.name),
      department: sanitizeText(req.body.department),
      courseYear: sanitizeText(req.body.courseYear),
      contactNumber: sanitizeText(req.body.contactNumber, 20),
      sportsInterests: sanitizeSportsInterests(req.body.sportsInterests),
      profileImage: String(req.body.profileImage || '').startsWith('data:image/')
        ? String(req.body.profileImage).slice(0, 250000)
        : ''
    };

    if (!updates.name) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    if (isMongoReady()) {
      const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({ message: 'Profile updated', user: publicUser(user) });
    }

    const users = readUsers();
    const user = users.find((item) => item.id === req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.assign(user, updates);
    writeUsers(users);

    res.json({ message: 'Profile updated', user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Current password and a 6+ character new password are required' });
    }

    if (isMongoReady()) {
      const user = await User.findById(req.userId);
      const passwordMatches = user && bcrypt.compareSync(currentPassword, user.password);

      if (!passwordMatches) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      user.password = bcrypt.hashSync(newPassword, 10);
      await user.save();
      return res.json({ message: 'Password changed' });
    }

    const users = readUsers();
    const user = users.find((item) => item.id === req.userId);
    const passwordMatches = user && (
      user.password?.startsWith('$2')
        ? bcrypt.compareSync(currentPassword, user.password)
        : user.password === currentPassword
    );

    if (!passwordMatches) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    writeUsers(users);

    res.json({ message: 'Password changed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
