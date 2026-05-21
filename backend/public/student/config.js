// API Configuration
// ==========================================
// LOCAL DEVELOPMENT:
//   const API_URL = 'http://localhost:5000/api';
//
// PRODUCTION (Vercel + Render):
//   const API_URL = 'https://your-backend-name.onrender.com/api';
//
// Replace "your-backend-name" with your actual Render deployment name
// ==========================================

const API_URL = localStorage.getItem('API_URL') || 
                (process.env.REACT_APP_API_URL) || 
                'http://localhost:5000/api';

// For Vercel production, update this:
// const API_URL = 'https://usports-backend.onrender.com/api';
