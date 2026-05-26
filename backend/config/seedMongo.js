const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Facility = require('../models/Facility');

const usersFile = path.join(__dirname, '../data/users.json');
const facilitiesFile = path.join(__dirname, '../data/facilities.json');

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

async function seedMongoIfNeeded() {
  const [userCount, facilityCount] = await Promise.all([
    User.countDocuments(),
    Facility.countDocuments()
  ]);

  if (userCount === 0) {
    const users = readJson(usersFile).map((user) => ({
      name: user.name,
      email: user.email,
      password: user.password?.startsWith('$2') ? user.password : bcrypt.hashSync(user.password, 10),
      rollNumber: user.rollNumber,
      role: user.role,
      college: user.college || 'college_001',
      department: user.department || '',
      courseYear: user.courseYear || '',
      contactNumber: user.contactNumber || '',
      sportsInterests: user.sportsInterests || [],
      profileImage: user.profileImage || ''
    }));

    if (users.length) {
      await User.insertMany(users);
      console.log(`Seeded ${users.length} users into MongoDB.`);
    }
  }

  if (facilityCount === 0) {
    const facilities = readJson(facilitiesFile).map((facility) => ({
      name: facility.name,
      sport: facility.sport,
      quantity: facility.quantity || 1,
      college: facility.college || 'college_001'
    }));

    if (facilities.length) {
      await Facility.insertMany(facilities);
      console.log(`Seeded ${facilities.length} facilities into MongoDB.`);
    }
  }
}

module.exports = seedMongoIfNeeded;
