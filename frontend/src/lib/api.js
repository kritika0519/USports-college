const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const isBackendHost = isLocalhost && window.location.port === '5000';

const fallbackApi = isLocalhost
  ? isBackendHost
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api'
  : 'https://usports-api.onrender.com/api';

export const API_URL = import.meta.env.VITE_API_URL || fallbackApi;

async function request(path, options = {}) {
  const token = options.token;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('adminUser');
    }

    const localDetail = isLocalhost && data?.message === 'Server error' && data?.error
      ? `Server error: ${data.error}`
      : data?.message;

    throw new Error(localDetail || 'Request failed');
  }

  return data;
}

export const api = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  facilities: () => request('/facilities/all'),
  availableSlots: (sport, date) =>
    request(`/bookings/available-slots?sport=${encodeURIComponent(sport)}&date=${encodeURIComponent(date)}`),
  createBooking: (payload, token) =>
    request('/bookings/book', {
      method: 'POST',
      token,
      body: JSON.stringify(payload)
    }),
  myBookings: (token) => request('/bookings/my-bookings', { token }),
  allBookings: (token) => request('/bookings/all', { token }),
  cancelBooking: (id, token) =>
    request(`/bookings/cancel/${id}`, {
      method: 'DELETE',
      token
    }),
  addFacility: (payload, token) =>
    request('/facilities/add', {
      method: 'POST',
      token,
      body: JSON.stringify(payload)
    }),
  deleteFacility: (id, token) =>
    request(`/facilities/${id}`, {
      method: 'DELETE',
      token
    }),
  users: (token) => request('/auth/users', { token })
  ,
  me: (token) => request('/auth/me', { token }),
  updateProfile: (payload, token) =>
    request('/auth/profile', {
      method: 'PUT',
      token,
      body: JSON.stringify(payload)
    }),
  changePassword: (payload, token) =>
    request('/auth/change-password', {
      method: 'POST',
      token,
      body: JSON.stringify(payload)
    })
};
