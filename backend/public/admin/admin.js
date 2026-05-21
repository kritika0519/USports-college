// API URL - defined in config.js or use default
// const API_URL is loaded from config.js
if (typeof API_URL === 'undefined') {
  window.API_URL = 'http://localhost:5000/api';
}

const COLLEGE_ID = 'college_001';
let token = localStorage.getItem('adminToken');
let currentSection = 'dashboard';

// Check if admin is logged in
function checkAuth() {
  if (!token) {
    window.location.href = 'login.html';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadDashboard();
  setupEventListeners();
  loadUsername();
});

// Setup Event Listeners
function setupEventListeners() {
  // Navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.id !== 'logout') {
        e.preventDefault();
        const section = link.dataset.section;
        switchSection(section);
      }
    });
  });

  // Logout
  document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
  });

  // Add Facility Button
  document.getElementById('add-facility-btn').addEventListener('click', openFacilityModal);

  // Facility Modal
  const facilityModal = document.getElementById('facility-modal');
  const closeBtn = facilityModal.querySelector('.close');
  closeBtn.addEventListener('click', closeFacilityModal);
  window.addEventListener('click', (e) => {
    if (e.target === facilityModal) {
      closeFacilityModal();
    }
  });

  // Facility Form
  document.getElementById('facility-form').addEventListener('submit', addFacility);

  // Bookings Section
  document.getElementById('booking-filter-date').addEventListener('change', loadBookings);

  // Settings Form
  document.getElementById('settings-form').addEventListener('submit', saveSettings);
}

// Switch Sections
function switchSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(section).classList.add('active');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === section) {
      link.classList.add('active');
    }
  });

  // Update title
  const titles = {
    dashboard: 'Dashboard',
    facilities: 'Manage Facilities',
    bookings: 'All Bookings',
    users: 'Registered Users',
    settings: 'Settings'
  };
  document.getElementById('section-title').textContent = titles[section];

  currentSection = section;

  // Load data based on section
  if (section === 'facilities') loadFacilities();
  if (section === 'bookings') loadBookings();
  if (section === 'users') loadUsers();
  if (section === 'settings') loadSettings();
}

// Load Dashboard
async function loadDashboard() {
  try {
    const bookings = await fetch(`${API_URL}/bookings/all`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());

    const facilities = await fetch(`${API_URL}/facilities?collegeId=${COLLEGE_ID}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());

    document.getElementById('total-bookings').textContent = bookings.length;
    document.getElementById('total-facilities').textContent = Object.values(facilities).flat().length;
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Load Facilities
async function loadFacilities() {
  try {
    const response = await fetch(`${API_URL}/facilities?collegeId=${COLLEGE_ID}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const facilitiesData = await response.json();
    const tableBody = document.getElementById('facilities-table');
    tableBody.innerHTML = '';

    let facilities = [];
    for (const sport in facilitiesData) {
      facilities = facilities.concat(facilitiesData[sport]);
    }

    if (facilities.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No facilities found</td></tr>';
      return;
    }

    facilities.forEach(facility => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${facility.name}</td>
        <td>${facility.sport}</td>
        <td>${facility.quantity}</td>
        <td>${facility.operatingHours.start}:00 - ${facility.operatingHours.end}:00</td>
        <td>
          <button class="btn btn-danger" onclick="deleteFacility('${facility._id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading facilities:', error);
  }
}

// Load Bookings
async function loadBookings() {
  try {
    const response = await fetch(`${API_URL}/bookings/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const bookings = await response.json();
    const tableBody = document.getElementById('bookings-table');
    tableBody.innerHTML = '';

    if (bookings.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No bookings found</td></tr>';
      return;
    }

    bookings.forEach(booking => {
      const date = new Date(booking.date).toLocaleDateString();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${booking.user.name}</td>
        <td>${booking.sport}</td>
        <td>${booking.facility.name}</td>
        <td>${date}</td>
        <td>${booking.startTime}:00 - ${booking.endTime}:00</td>
        <td><span class="badge badge-${booking.status}">${booking.status}</span></td>
        <td>
          <button class="btn btn-danger" onclick="cancelBooking('${booking._id}')">Cancel</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading bookings:', error);
  }
}

// Load Users
async function loadUsers() {
  try {
    // This would need a users endpoint - for now showing placeholder
    const response = await fetch(`${API_URL}/bookings/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const bookings = await response.json();
    const users = [...new Set(bookings.map(b => b.user))];
    const tableBody = document.getElementById('users-table');
    tableBody.innerHTML = '';

    if (users.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No users found</td></tr>';
      return;
    }

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.rollNumber}</td>
        <td>${user.role}</td>
        <td>-</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

// Add Facility
async function addFacility(e) {
  e.preventDefault();

  const facility = {
    name: document.getElementById('facility-name').value,
    sport: document.getElementById('facility-sport').value,
    quantity: parseInt(document.getElementById('facility-quantity').value),
    collegeId: COLLEGE_ID
  };

  try {
    const response = await fetch(`${API_URL}/facilities/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(facility)
    });

    if (response.ok) {
      alert('Facility added successfully!');
      closeFacilityModal();
      loadFacilities();
    } else {
      alert('Error adding facility');
    }
  } catch (error) {
    console.error('Error adding facility:', error);
  }
}

// Delete Facility
async function deleteFacility(facilityId) {
  if (!confirm('Are you sure?')) return;

  try {
    const response = await fetch(`${API_URL}/facilities/${facilityId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      alert('Facility deleted!');
      loadFacilities();
    }
  } catch (error) {
    console.error('Error deleting facility:', error);
  }
}

// Cancel Booking
async function cancelBooking(bookingId) {
  if (!confirm('Cancel this booking?')) return;

  try {
    const response = await fetch(`${API_URL}/bookings/cancel/${bookingId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      alert('Booking cancelled!');
      loadBookings();
    }
  } catch (error) {
    console.error('Error cancelling booking:', error);
  }
}

// Modal Functions
function openFacilityModal() {
  document.getElementById('facility-modal').classList.add('show');
}

function closeFacilityModal() {
  document.getElementById('facility-modal').classList.remove('show');
  document.getElementById('facility-form').reset();
}

// Load Settings
function loadSettings() {
  document.getElementById('college-name').value = 'ABC Engineering College';
  document.getElementById('college-id').value = COLLEGE_ID;
}

// Save Settings
function saveSettings(e) {
  e.preventDefault();
  alert('Settings saved!');
}

// Load Username
function loadUsername() {
  const user = localStorage.getItem('adminUser');
  if (user) {
    document.getElementById('username').textContent = JSON.parse(user).name;
  }
}
