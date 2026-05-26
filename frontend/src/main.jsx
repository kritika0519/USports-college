import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './lib/api';
import './styles.css';

const sports = [
  {
    name: 'Tennis',
    icon: 'TN',
    accent: '#20a76b',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Table Tennis',
    icon: 'TT',
    accent: '#0d9488',
    image: 'https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Basketball',
    icon: 'BK',
    accent: '#ea580c',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Badminton',
    icon: 'BD',
    accent: '#7c3aed',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Volleyball',
    icon: 'VB',
    accent: '#2563eb',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Football',
    icon: 'FT',
    accent: '#15803d',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=700&q=80'
  }
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function initialPage() {
  if (window.location.pathname.startsWith('/admin')) return 'admin';
  return localStorage.getItem('userToken') ? 'dashboard' : 'home';
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function App() {
  const [page, setPage] = useState(initialPage());
  const [token, setToken] = useState(localStorage.getItem('userToken') || '');
  const [user, setUser] = useState(readJson('currentUser'));
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [adminUser, setAdminUser] = useState(readJson('adminUser'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  function notify(message, type = 'success') {
    setToast({ message, type });
  }

  function go(nextPage) {
    setPage(nextPage);
    window.history.replaceState({}, '', nextPage === 'admin' ? '/admin' : '/');
  }

  function handleStudentAuth(data) {
    localStorage.setItem('userToken', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    notify('Welcome to your booking dashboard.');
    go('dashboard');
  }

  function updateStoredUser(nextUser) {
    localStorage.setItem('currentUser', JSON.stringify(nextUser));
    setUser(nextUser);
  }

  function handleAdminAuth(data) {
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminUser', JSON.stringify(data.user));
    setAdminToken(data.token);
    setAdminUser(data.user);
    notify('Admin session started.');
  }

  function logoutStudent() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    setToken('');
    setUser(null);
    notify('Logged out safely.');
    go('home');
  }

  function logoutAdmin() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminToken('');
    setAdminUser(null);
  }

  if (page === 'admin') {
    return (
      <>
        <AdminPortal token={adminToken} user={adminUser} onAuth={handleAdminAuth} onLogout={logoutAdmin} />
        {toast && <Toast toast={toast} />}
      </>
    );
  }

  return (
    <div className="app-shell">
      <Header
        page={page}
        token={token}
        user={user}
        go={go}
        onLogout={logoutStudent}
        theme={theme}
        onTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <div className="page-transition">
        {page === 'login' && <AuthPage mode="login" onAuth={handleStudentAuth} switchMode={() => go('signup')} notify={notify} />}
        {page === 'signup' && <AuthPage mode="signup" onAuth={handleStudentAuth} switchMode={() => go('login')} notify={notify} />}
        {page === 'profile' && token && (
          <ProfilePage token={token} user={user} setUser={updateStoredUser} go={go} notify={notify} />
        )}
        {page === 'dashboard' && token && (
          <StudentDashboard token={token} user={user} go={go} notify={notify} />
        )}
        {(page === 'home' || (page === 'dashboard' && !token)) && <Landing go={go} token={token} />}
      </div>
      {toast && <Toast toast={toast} />}
    </div>
  );
}

function Header({ page, token, user, go, onLogout, theme, onTheme }) {
  return (
    <header className="topbar premium-nav">
      <button className="brand" onClick={() => go(token ? 'dashboard' : 'home')} aria-label="USports home">
        <span className="brand-mark">U</span>
        <span>
          <strong>USports</strong>
          <small>University sports booking</small>
        </span>
      </button>

      <nav className="nav-actions" aria-label="Primary navigation">
        <button className={page === 'home' ? 'active' : ''} onClick={() => go('home')}>Home</button>
        {token ? (
          <>
            <button className={page === 'dashboard' ? 'active' : ''} onClick={() => go('dashboard')}>Dashboard</button>
            <button className={page === 'profile' ? 'active' : ''} onClick={() => go('profile')}>Profile</button>
            <button className="avatar-button" onClick={() => go('profile')} title="Profile">
              {user?.profileImage ? <img src={user.profileImage} alt="" /> : <span>{(user?.name || 'S').slice(0, 1)}</span>}
            </button>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className={page === 'login' ? 'active' : ''} onClick={() => go('login')}>Login</button>
            <button className={page === 'signup' ? 'active' : ''} onClick={() => go('signup')}>Sign up</button>
          </>
        )}
        <button className="theme-toggle" onClick={onTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <span>{theme === 'dark' ? '☀' : '☾'}</span>
        </button>
      </nav>
    </header>
  );
}

function Landing({ go, token }) {
  return (
    <main>
      <section className="hero premium-hero">
        <div className="hero-copy">
          <span className="eyebrow">Book before your free lecture starts</span>
          <h1>Reserve your game before the sports area gets crowded.</h1>
          <p>
            USports turns the old register-and-ID-card queue into a quick online reservation flow for students and a
            clean oversight dashboard for faculty.
          </p>
          <div className="hero-actions">
            <button className="btn primary glow" onClick={() => go(token ? 'dashboard' : 'login')}>Book a slot</button>
            <button className="btn secondary" onClick={() => go('signup')}>Create student account</button>
          </div>
        </div>
        <div className="hero-panel campus-panel floating-panel" aria-label="Campus booking benefits">
          <div>
            <span>For students</span>
            <strong>Book anywhere</strong>
            <small>No more walking over just to check availability.</small>
          </div>
          <div>
            <span>For faculty</span>
            <strong>Digital register</strong>
            <small>Live bookings, cancellations, and facility usage in one place.</small>
          </div>
          <div>
            <span>For campus</span>
            <strong>Fair slots</strong>
            <small>Each confirmed booking blocks the slot for everyone else.</small>
          </div>
        </div>
      </section>

      <section className="panel story-panel glass-section">
        <div className="section-heading">
          <span>Why this exists</span>
          <h2>Built around the actual college sports routine</h2>
        </div>
        <div className="story-grid">
          <article>
            <strong>Before</strong>
            <p>Students rush during free lectures, submit ID cards, and still may not get their preferred game.</p>
          </article>
          <article>
            <strong>Now</strong>
            <p>They log in, choose a sport, reserve an available facility, and show up at the booked time.</p>
          </article>
          <article>
            <strong>Faculty</strong>
            <p>The admin team can monitor bookings digitally instead of maintaining a physical register.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

function AuthPage({ mode, onAuth, switchMode, notify }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const isSignup = mode === 'signup';

  async function submitAuth(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const form = new FormData(event.currentTarget);

    try {
      const data = isSignup
        ? await api.register({
            name: form.get('name'),
            rollNumber: form.get('rollNumber'),
            email: form.get('email'),
            password: form.get('password')
          })
        : await api.login(form.get('email'), form.get('password'));
      onAuth(data);
    } catch (error) {
      setMessage(error.message);
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="panel auth-card auth-premium" onSubmit={submitAuth}>
        <span className="eyebrow">Student access</span>
        <h1>{isSignup ? 'Create your USports account' : 'Welcome back'}</h1>
        <p>{isSignup ? 'Use your university email and roll number to start booking campus sports facilities.' : 'Login first, then choose your sport and available slot from the dashboard.'}</p>
        {isSignup && (
          <>
            <input name="name" placeholder="Full name" autoComplete="name" required />
            <input name="rollNumber" placeholder="Roll number" autoComplete="off" required />
          </>
        )}
        <input name="email" type="email" placeholder="University email" autoComplete="email" required />
        <input name="password" type="password" placeholder="Password" autoComplete={isSignup ? 'new-password' : 'current-password'} required />
        <button className="btn primary full" disabled={busy}>{busy ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}</button>
        <button className="text-button" type="button" onClick={switchMode}>
          {isSignup ? 'Already have an account? Login' : 'New student? Create account'}
        </button>
        {message && <p className="notice">{message}</p>}
      </form>
    </main>
  );
}

function StudentDashboard({ token, user, go, notify }) {
  const [selectedSport, setSelectedSport] = useState(user?.sportsInterests?.[0] || 'Tennis');
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [slots, setSlots] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadSlots();
  }, [selectedSport, selectedDate]);

  useEffect(() => {
    loadBookings();
  }, [token]);

  async function loadSlots() {
    setSelectedSlot(null);
    try {
      setSlots(await api.availableSlots(selectedSport, selectedDate));
    } catch (error) {
      setMessage(error.message);
      notify(error.message, 'error');
    }
  }

  async function loadBookings() {
    try {
      setBookings(await api.myBookings(token));
    } catch (error) {
      setMessage(error.message);
      notify(error.message, 'error');
    }
  }

  async function bookSlot() {
    if (!selectedSlot) {
      notify('Choose one available slot first.', 'error');
      return;
    }

    setBusy(true);
    try {
      await api.createBooking(
        {
          facility: selectedSlot.facility.id,
          sport: selectedSport,
          date: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          facilityNumber: 1
        },
        token
      );
      setMessage('Slot booked. Carry your ID card and arrive on time.');
      notify('Booking successful. Your slot is reserved.');
      await loadSlots();
      await loadBookings();
    } catch (error) {
      notify(error.message || 'Slot unavailable', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function cancelBooking(id) {
    setBusy(true);
    try {
      await api.cancelBooking(id, token);
      setMessage('Booking cancelled. The slot is available again.');
      notify('Booking cancelled.');
      await loadSlots();
      await loadBookings();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  const filteredSports = sports.filter((sport) => sport.name.toLowerCase().includes(search.toLowerCase()));
  const selectedSportMeta = sports.find((sport) => sport.name === selectedSport) || sports[0];
  const bookingHistory = bookings.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcoming = bookingHistory.slice(0, 3);
  const recentActivity = bookingHistory.slice(-4).reverse();
  const recommended = (user?.sportsInterests?.length ? user.sportsInterests : [selectedSport, 'Basketball', 'Badminton'])
    .slice(0, 3)
    .map((sport, index) => ({
      sport,
      time: `${10 + index}:00`,
      date: selectedDate
    }));

  const totalSlots = useMemo(() => {
    if (!slots?.availableSlots) return 0;
    return Object.values(slots.availableSlots).reduce((sum, facilitySlots) => {
      return sum + Object.values(facilitySlots).filter((status) => status === 'available').length;
    }, 0);
  }, [slots]);

  return (
    <main className="dashboard-page premium-dashboard">
      <section className="dashboard-hero panel gradient-hero-card">
        <div className="profile-greeting">
          <button className="profile-orb" onClick={() => go('profile')}>
            {user?.profileImage ? <img src={user.profileImage} alt="" /> : <span>{(user?.name || 'S').slice(0, 1)}</span>}
          </button>
          <div>
            <span className="eyebrow">Student dashboard</span>
            <h1>Hi {user?.name || 'student'}, ready for your next game?</h1>
            <p>Pick a sport, filter facilities, and confirm a slot that fits your timetable.</p>
            <div className="quick-actions">
              <button className="btn primary" onClick={() => document.getElementById('booking')?.scrollIntoView()}>Book now</button>
              <button className="btn secondary dark-safe" onClick={() => go('profile')}>Edit profile</button>
            </div>
          </div>
        </div>
        <div className="analytics-grid">
          <AnalyticsWidget label="Available slots" value={totalSlots || '--'} bars={[55, 82, 38, 74]} />
          <AnalyticsWidget label="My bookings" value={bookings.length} bars={[20, 45, 68, 90]} />
          <AnalyticsWidget label="Favorite sport" value={user?.sportsInterests?.[0] || selectedSport} bars={[60, 40, 72, 51]} />
        </div>
      </section>

      <section className="dashboard-panels">
        <div className="panel booking-workspace premium-booking" id="booking">
          <div className="section-heading split-heading">
            <div>
              <span>Book sport</span>
              <h2>Choose your game and time</h2>
            </div>
            <label className="search-pill">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sports" />
            </label>
          </div>

          <div className="sport-gallery">
            {filteredSports.map((sport) => (
              <button
                key={sport.name}
                className={`sport-tile ${selectedSport === sport.name ? 'active' : ''}`}
                style={{ '--accent': sport.accent, backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.68)), url(${sport.image})` }}
                onClick={() => setSelectedSport(sport.name)}
              >
                <span>{sport.icon}</span>
                <strong>{sport.name}</strong>
              </button>
            ))}
          </div>

          <div className="calendar-strip">
            {[0, 1, 2, 3, 4].map((offset) => {
              const date = new Date();
              date.setDate(date.getDate() + offset);
              const iso = date.toISOString().slice(0, 10);
              return (
                <button key={iso} className={selectedDate === iso ? 'active' : ''} onClick={() => setSelectedDate(iso)}>
                  <span>{date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                  <strong>{date.getDate()}</strong>
                </button>
              );
            })}
            <input type="date" min={todayIso()} value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
          </div>

          <div className="slot-list premium-slots">
            {slots?.facilities?.map((facility) => (
              <div className="facility-row" key={facility.id}>
                <div className="facility-meta">
                  <strong>{facility.name}</strong>
                  <span>{facility.sport} facility</span>
                </div>
                <div className="time-grid">
                  {Object.entries(slots.availableSlots[facility.id] || {}).map(([slotKey, status]) => {
                    const [start, end] = slotKey.split('-').map(Number);
                    const isSelected =
                      selectedSlot?.facility.id === facility.id &&
                      selectedSlot.startTime === start &&
                      selectedSlot.endTime === end;
                    return (
                      <button
                        key={`${facility.id}-${slotKey}`}
                        className={`time-chip ${status === 'booked' ? 'booked' : ''} ${isSelected ? 'active' : ''}`}
                        disabled={status === 'booked'}
                        onClick={() => setSelectedSlot({ facility, startTime: start, endTime: end })}
                      >
                        {start}:00
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="dashboard-sidebar">
          <div className="panel booking-summary glass-card">
            <span>Booking summary</span>
            <h3>{selectedSportMeta.name}</h3>
            <p>{formatDate(selectedDate)}</p>
            <p>{selectedSlot ? `${selectedSlot.facility.name}, ${selectedSlot.startTime}:00 - ${selectedSlot.endTime}:00` : 'Select an available slot'}</p>
            <button className="btn primary full" disabled={busy || !selectedSlot} onClick={bookSlot}>Confirm booking</button>
            {message && <p className="notice">{message}</p>}
          </div>

          <ActivityPanel title="Recommended slots" items={recommended.map((item) => `${item.sport} - ${formatDate(item.date)} at ${item.time}`)} />
          <ActivityPanel title="Recent activity" items={recentActivity.length ? recentActivity.map((item) => `${item.sport} at ${item.startTime}:00 on ${formatDate(item.date)}`) : ['No recent bookings yet']} />
        </aside>
      </section>

      <section className="panel bookings-panel glass-section">
        <div className="section-heading split-heading">
          <div>
            <span>Personal schedule</span>
            <h2>Upcoming games and history</h2>
          </div>
          <strong className="count-badge">{bookings.length} total bookings</strong>
        </div>
        {bookings.length ? (
          <div className="booking-cards">
            {upcoming.map((booking) => (
              <article className="booking-card interactive-card" key={booking.id}>
                <span className="status">{booking.status}</span>
                <h3>{booking.sport}</h3>
                <p>{booking.facilityDetails?.name || booking.facility}</p>
                <p>{formatDate(booking.date)} - {booking.startTime}:00 to {booking.endTime}:00</p>
                <button className="btn danger" disabled={busy} onClick={() => cancelBooking(booking.id)}>Cancel</button>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">No bookings yet. Pick a slot above.</p>
        )}
      </section>
    </main>
  );
}

function ProfilePage({ token, user, setUser, go, notify }) {
  const [profile, setProfile] = useState(user || {});
  const [bookings, setBookings] = useState([]);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [freshUser, myBookings] = await Promise.all([api.me(token), api.myBookings(token)]);
        setProfile(freshUser);
        setUser(freshUser);
        setBookings(myBookings);
      } catch (error) {
        notify(error.message, 'error');
      }
    }
    loadProfile();
  }, [token]);

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function handleImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 180000) {
      notify('Use an image below 180 KB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateField('profileImage', reader.result);
    reader.readAsDataURL(file);
  }

  async function saveProfile(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const payload = {
        name: profile.name,
        department: profile.department,
        courseYear: profile.courseYear,
        contactNumber: profile.contactNumber,
        sportsInterests: String(profile.sportsInterestsText || profile.sportsInterests?.join(',') || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        profileImage: profile.profileImage || ''
      };
      const data = await api.updateProfile(payload, token);
      setUser(data.user);
      setProfile(data.user);
      notify('Profile updated.');
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await api.changePassword(passwords, token);
      setPasswords({ currentPassword: '', newPassword: '' });
      notify('Password changed.');
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="profile-page">
      <section className="panel profile-shell glass-section">
        <div className="profile-cover">
          <button className="btn secondary dark-safe" onClick={() => go('dashboard')}>Back to dashboard</button>
        </div>
        <div className="profile-layout">
          <aside className="profile-summary">
            <div className="profile-avatar-large">
              {profile.profileImage ? <img src={profile.profileImage} alt="" /> : <span>{(profile.name || 'S').slice(0, 1)}</span>}
            </div>
            <label className="upload-button">
              Upload picture
              <input type="file" accept="image/*" onChange={handleImage} />
            </label>
            <h2>{profile.name || 'Student'}</h2>
            <p>{profile.email}</p>
            <div className="profile-stat-row">
              <Metric label="Bookings" value={bookings.length} />
              <Metric label="Interests" value={profile.sportsInterests?.length || 0} />
            </div>
          </aside>

          <div className="profile-forms">
            <form className="profile-form" onSubmit={saveProfile}>
              <div className="section-heading">
                <span>Edit profile</span>
                <h2>Academic and sports details</h2>
              </div>
              <div className="form-grid">
                <input value={profile.name || ''} onChange={(event) => updateField('name', event.target.value)} placeholder="Full name" required />
                <input value={profile.rollNumber || ''} placeholder="Roll number" disabled />
                <input value={profile.email || ''} placeholder="Email address" disabled />
                <input value={profile.department || ''} onChange={(event) => updateField('department', event.target.value)} placeholder="Department" />
                <input value={profile.courseYear || ''} onChange={(event) => updateField('courseYear', event.target.value)} placeholder="Course / year" />
                <input value={profile.contactNumber || ''} onChange={(event) => updateField('contactNumber', event.target.value)} placeholder="Contact number optional" />
                <input
                  className="wide-field"
                  defaultValue={profile.sportsInterests?.join(', ') || ''}
                  onChange={(event) => updateField('sportsInterestsText', event.target.value)}
                  placeholder="Sports interests, comma separated"
                />
              </div>
              <button className="btn primary" disabled={busy}>Save profile</button>
            </form>

            <form className="profile-form" onSubmit={changePassword}>
              <div className="section-heading">
                <span>Account settings</span>
                <h2>Change password</h2>
              </div>
              <div className="form-grid">
                <input type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} placeholder="Current password" />
                <input type="password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} placeholder="New password" />
              </div>
              <button className="btn primary" disabled={busy}>Update password</button>
            </form>

            <ActivityPanel title="Booking history" items={bookings.length ? bookings.map((booking) => `${booking.sport} - ${formatDate(booking.date)} at ${booking.startTime}:00`) : ['No booking history yet']} />
          </div>
        </div>
      </section>
    </main>
  );
}

function AdminPortal({ token, user, onAuth, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [users, setUsers] = useState([]);
  const [section, setSection] = useState('overview');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) loadAdminData();
  }, [token]);

  async function adminLogin(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const data = await api.login(form.get('email'), form.get('password'));
      if (data.user.role !== 'admin') throw new Error('This account is not an admin.');
      onAuth(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadAdminData() {
    try {
      const [nextBookings, nextFacilities, nextUsers] = await Promise.all([
        api.allBookings(token),
        api.facilities(),
        api.users(token)
      ]);
      setBookings(nextBookings);
      setFacilities(nextFacilities);
      setUsers(nextUsers);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function addFacility(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api.addFacility(
        {
          name: form.get('name'),
          sport: form.get('sport'),
          quantity: Number(form.get('quantity') || 1)
        },
        token
      );
      event.currentTarget.reset();
      await loadAdminData();
      setMessage('Facility added.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function cancelBooking(id) {
    try {
      await api.cancelBooking(id, token);
      await loadAdminData();
      setMessage('Booking cancelled.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!token) {
    return (
      <main className="admin-login">
        <form className="panel auth-card admin-auth" onSubmit={adminLogin}>
          <span className="eyebrow">Restricted faculty access</span>
          <h1>Admin login</h1>
          <p>Use the faculty credentials assigned by the college administrator.</p>
          <input name="email" type="email" placeholder="Faculty email" autoComplete="email" required />
          <input name="password" type="password" placeholder="Password" autoComplete="current-password" required />
          <button className="btn primary full">Login as admin</button>
          {message && <p className="notice">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-layout">
      <aside className="admin-nav">
        <strong>{user?.name || 'Admin'}</strong>
        {['overview', 'bookings', 'facilities', 'users'].map((item) => (
          <button key={item} className={section === item ? 'active' : ''} onClick={() => setSection(item)}>
            {item}
          </button>
        ))}
        <button onClick={onLogout}>Logout</button>
      </aside>

      <section className="admin-main panel">
        {section === 'overview' && (
          <>
            <div className="section-heading">
              <span>Faculty dashboard</span>
              <h2>Today at a glance</h2>
            </div>
            <div className="metric-grid">
              <Metric label="Bookings" value={bookings.filter((b) => b.status === 'confirmed').length} />
              <Metric label="Facilities" value={facilities.length} />
              <Metric label="Students" value={users.filter((item) => item.role === 'student').length} />
            </div>
          </>
        )}

        {section === 'bookings' && (
          <DataTable
            title="Bookings"
            columns={['Student', 'Sport', 'Facility', 'Date', 'Time', 'Status', 'Action']}
            rows={bookings.map((booking) => [
              booking.userName || booking.user,
              booking.sport,
              booking.facilityDetails?.name || booking.facility,
              formatDate(booking.date),
              `${booking.startTime}:00 - ${booking.endTime}:00`,
              booking.status,
              booking.status === 'confirmed' ? (
                <button className="btn danger compact" onClick={() => cancelBooking(booking.id)}>Cancel</button>
              ) : (
                '-'
              )
            ])}
          />
        )}

        {section === 'facilities' && (
          <>
            <form className="facility-form" onSubmit={addFacility}>
              <input name="name" placeholder="Facility name" required />
              <select name="sport" defaultValue="Tennis">
                {sports.map((sport) => <option key={sport.name}>{sport.name}</option>)}
              </select>
              <input name="quantity" type="number" min="1" defaultValue="1" />
              <button className="btn primary">Add</button>
            </form>
            <DataTable
              title="Facilities"
              columns={['Name', 'Sport', 'Quantity']}
              rows={facilities.map((facility) => [facility.name, facility.sport, facility.quantity || 1])}
            />
          </>
        )}

        {section === 'users' && (
          <DataTable
            title="Registered users"
            columns={['Name', 'Email', 'Roll number', 'Role']}
            rows={users.map((item) => [item.name, item.email, item.rollNumber, item.role])}
          />
        )}

        {message && <p className="notice">{message}</p>}
      </section>
    </main>
  );
}

function AnalyticsWidget({ label, value, bars }) {
  return (
    <div className="analytics-widget">
      <span>{label}</span>
      <strong>{value}</strong>
      <div className="mini-chart">
        {bars.map((bar, index) => <i key={index} style={{ height: `${bar}%` }} />)}
      </div>
    </div>
  );
}

function ActivityPanel({ title, items }) {
  return (
    <div className="panel activity-panel glass-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
      </ul>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DataTable({ title, columns, rows }) {
  return (
    <div className="table-wrap">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>No records yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Toast({ toast }) {
  return <div className={`toast ${toast.type}`}>{toast.message}</div>;
}

createRoot(document.getElementById('root')).render(<App />);
