// API Configuration - Auto-detect environment
const API_URL = 
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://usports-api.onrender.com/api';
