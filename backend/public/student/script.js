// Relative API URL - works on any domain (localhost or production)
const API_URL = '/api';

const COLLEGE_ID = 'college_001';

let token = localStorage.getItem('userToken');
let currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
let selectedSlot = null;
let selectedSport = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupUI();
  setupEventListeners();
  loadMyBookings();
  setMinDate();

  if (token) {
    showLoggedIn();
  }
});

// Setup UI
function setupUI() {
  if (token) {
    document.getElementById('user-btn').textContent = `${currentUser?.name || 'User'}`;
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Theme Toggle
  document.querySelector('.btn-theme').addEventListener('click', toggleTheme);

  // Auth
  document.getElementById('user-btn').addEventListener('click', handleUserClick);
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('signup-form').addEventListener('submit', handleSignup);
  document.querySelector('.close').addEventListener('click', closeAuthModal);
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('auth-modal');
    if (e.target === modal) closeAuthModal();
  });

  // Sport Selection
  document.querySelectorAll('.sport-btn').forEach(btn => {
    btn.addEventListener('click', selectSport);
  });

  // Date Selection
  document.getElementById('booking-date').addEventListener('change', loadAvailableSlots);

  // Booking Confirmation
  document.getElementById('confirm-booking').addEventListener('click', confirmBooking);

  // Toggle Auth Tabs
  document.querySelectorAll('.toggle-auth a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAuthTab();
    });
  });

  // User Menu
  document.getElementById('menu-logout').addEventListener('click', handleLogout);
}

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Auth Modal
function handleUserClick(e) {
  e.preventDefault();
  if (token) {
    document.getElementById('user-menu').classList.toggle('show');
  } else {
    openAuthModal();
  }
}

function openAuthModal() {
  document.getElementById('auth-modal').classList.add('show');
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.remove('show');
}

function toggleAuthTab() {
  document.getElementById('login-tab').classList.toggle('active');
  document.getElementById('signup-tab').classList.toggle('active');
}

// Login
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      token = data.token;
      currentUser = data.user;
      localStorage.setItem('userToken', token);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      showLoggedIn();
      closeAuthModal();
      loadMyBookings();
      alert('Login successful!');
    } else {
      alert('Login failed: ' + data.message);
    }
  } catch (error) {
    alert('Error: Server not running');
  }
}

// Signup
async function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById('signup-name').value;
  const rollNumber = document.getElementById('signup-roll').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        rollNumber,
        collegeId: COLLEGE_ID
      })
    });

    const data = await response.json();

    if (response.ok) {
      token = data.token;
      currentUser = data.user;
      localStorage.setItem('userToken', token);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      showLoggedIn();
      closeAuthModal();
      alert('Signup successful!');
    } else {
      alert('Signup failed: ' + data.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Show Logged In
function showLoggedIn() {
  document.getElementById('user-btn').textContent = currentUser?.name || 'User';
  document.getElementById('menu-username').textContent = currentUser?.name || 'User';
  document.getElementById('confirm-booking').disabled = false;
}

// Sport Selection
function selectSport(e) {
  document.querySelectorAll('.sport-btn').forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  selectedSport = e.target.dataset.sport;
  document.getElementById('summary-sport').textContent = selectedSport;
  
  // Load slots if date is selected
  if (document.getElementById('booking-date').value) {
    loadAvailableSlots();
  }
}

// Set Min Date
function setMinDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('booking-date').min = today;
}

// Load Available Slots
async function loadAvailableSlots() {
  if (!selectedSport) {
    document.getElementById('slots-container').innerHTML = '<p>Select a sport first</p>';
    return;
  }

  const date = document.getElementById('booking-date').value;
  if (!date) {
    document.getElementById('slots-container').innerHTML = '<p>Select a date</p>';
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/bookings/available-slots?sport=${selectedSport}&date=${date}&collegeId=${COLLEGE_ID}`
    );
    const slots = await response.json();

    if (slots.length === 0) {
      document.getElementById('slots-container').innerHTML = '<p>No facilities available for this sport</p>';
      return;
    }

    // Group by facility
    const grouped = {};
    slots.forEach(slot => {
      const key = `${slot.facilityName} #${slot.facilityNumber}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(slot);
    });

    let html = '';
    for (const facility in grouped) {
      html += `<div class="facility-slots"><h4>${facility}</h4>`;
      grouped[facility][0].slots.forEach(slot => {
        const disabled = !slot.available;
        html += `
          <button class="slot-btn" ${disabled ? 'disabled' : ''} 
                  onclick="selectSlot(this, '${grouped[facility][0].facilityId}', '${slot.startTime}', '${slot.endTime}', '${facility}')">
            ${slot.label} ${disabled ? '❌' : '✓'}
          </button>
        `;
      });
      html += '</div>';
    }
    document.getElementById('slots-container').innerHTML = html;
  } catch (error) {
    document.getElementById('slots-container').innerHTML = '<p>Error loading slots</p>';
    console.error(error);
  }
}

// Select Slot
function selectSlot(btn, facilityId, startTime, endTime, facilityName) {
  document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  selectedSlot = {
    facilityId,
    startTime: parseInt(startTime),
    endTime: parseInt(endTime),
    facilityName
  };

  document.getElementById('summary-date').textContent = document.getElementById('booking-date').value;
  document.getElementById('summary-time').textContent = `${startTime}:00 - ${endTime}:00`;
  document.getElementById('summary-facility').textContent = facilityName;

  if (!token) {
    alert('Please login to book');
  }
}

// Confirm Booking
async function confirmBooking() {
  if (!token) {
    alert('Please login first');
    openAuthModal();
    return;
  }

  if (!selectedSlot || !selectedSport) {
    alert('Please select a sport and time slot');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/bookings/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        facilityId: selectedSlot.facilityId,
        date: document.getElementById('booking-date').value,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        facilityNumber: 1,
        sport: selectedSport
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('✅ Booking successful!');
      // Reset form
      document.querySelectorAll('.sport-btn').forEach(btn => btn.classList.remove('active'));
      selectedSlot = null;
      selectedSport = null;
      document.getElementById('booking-date').value = '';
      document.getElementById('slots-container').innerHTML = '';
      Object.keys(document.querySelectorAll('#summary-*')).forEach(key => {
        document.getElementById(key).textContent = '-';
      });
      loadMyBookings();
    } else {
      alert('Booking failed: ' + data.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Load My Bookings
async function loadMyBookings() {
  if (!token) {
    document.getElementById('my-bookings-list').innerHTML = '<p>Sign in to view your bookings</p>';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/bookings/my-bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const bookings = await response.json();

    if (bookings.length === 0) {
      document.getElementById('my-bookings-list').innerHTML = '<p>No bookings yet</p>';
      return;
    }

    let html = '';
    bookings.forEach(booking => {
      const date = new Date(booking.date).toLocaleDateString();
      html += `
        <div class="booking-card">
          <h3>${booking.sport}</h3>
          <p><strong>Facility:</strong> ${booking.facility.name}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${booking.startTime}:00 - ${booking.endTime}:00</p>
          <span class="badge ${booking.status}">${booking.status}</span>
          ${booking.status === 'confirmed' ? `<button class="btn-small" onclick="cancelBooking('${booking._id}')">Cancel</button>` : ''}
        </div>
      `;
    });
    document.getElementById('my-bookings-list').innerHTML = html;
  } catch (error) {
    console.error('Error loading bookings:', error);
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
      alert('Booking cancelled');
      loadMyBookings();
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Logout
function handleLogout(e) {
  e.preventDefault();
  token = null;
  currentUser = null;
  localStorage.removeItem('userToken');
  localStorage.removeItem('currentUser');
  document.getElementById('user-btn').textContent = 'Sign In';
  document.getElementById('user-menu').classList.remove('show');
  loadMyBookings();
  alert('Logged out');
}
