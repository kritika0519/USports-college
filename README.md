# 🏟️ USports - College Sports Booking System

**Complete web application for managing college sports facility bookings** with Student Portal and Admin Dashboard.

> 📚 **NOTE**: This is an improved version with full backend, database, and booking system. The old frontend is in `FEE-II-2024-master/` folder.

---

## 🎯 **START HERE** 👈

### 🚀 New? Pick Your Path:

**Option 1: Run Locally (Test First)**

- 📖 See: [START_HERE.md](START_HERE.md) ← Start with this!
- Takes 10 minutes
- Test everything locally

**Option 2: Deploy Live (Get URLs)**

- 📋 See: [DEPLOYMENT_CHEATSHEET.md](DEPLOYMENT_CHEATSHEET.md)
- Takes 15 minutes
- Get live URLs to share

**Option 3: Need Help?**

- 🔴 [LOGIN_ERROR_FIX.md](LOGIN_ERROR_FIX.md) - Fixing errors
- 🗄️ [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md) - Database setup
- 📖 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Full deployment guide

---

## ⚡ Quick Start (5 Minutes)

```bash
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Frontend
cd frontend && python -m http.server 8000

# Terminal 3: Admin
cd admin && python -m http.server 8001
```

Visit:

- 🎓 **Student Portal**: http://localhost:8000
- 👨‍💼 **Admin Dashboard**: http://localhost:8001/login.html
- 🔌 **Backend API**: http://localhost:5000

---

## ✨ Features

### 🎓 Student Portal

- ✅ Sign up & Login with roll number
- ✅ Browse available sports facilities
- ✅ Book time slots (9 AM - 6 PM)
- ✅ View & Cancel bookings
- ✅ Real-time availability check
- ✅ Dark mode support
- ✅ Responsive design

### 👨‍💼 Admin Dashboard

- ✅ Dashboard with statistics
- ✅ Add/Delete facilities
- ✅ View all bookings
- ✅ Manage users
- ✅ Settings panel
- ✅ Beautiful UI

---

## 🛠️ Tech Stack

| Layer        | Technology                                |
| ------------ | ----------------------------------------- |
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla)         |
| **Backend**  | Node.js, Express.js                       |
| **Database** | MongoDB                                   |
| **Auth**     | JWT, bcryptjs                             |
| **Security** | Password hashing, CORS, Role-based access |

---

## 📦 Project Structure

```
Usports-main/
├── backend/                  # Node.js Express API
│   ├── config/db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── College.js
│   │   ├── Facility.js
│   │   └── Booking.js
│   ├── controllers/
│   ├── routes/
│   ├── middleware/auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/                 # Student Portal
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── admin/                    # Admin Dashboard
│   ├── index.html
│   ├── login.html
│   ├── admin.css
│   └── admin.js
│
├── FEE-II-2024-master/       # Old frontend (archive)
│
├── SETUP_GUIDE.md           # Detailed setup
├── QUICK_START.md           # 5-minute setup
└── MONGODB_SEED.js          # Database seeding
```

---

## 🚀 Available Sports & Facilities

| Sport           | Courts/Tables | Hours       |
| --------------- | ------------- | ----------- |
| 🎾 Tennis       | 2 Courts      | 9 AM - 6 PM |
| 🏓 Table Tennis | 5 Tables      | 9 AM - 6 PM |
| 🏀 Basketball   | 1 Court       | 9 AM - 6 PM |
| 🏸 Badminton    | 2 Courts      | 9 AM - 6 PM |
| 🏐 Volleyball   | 1 Court       | 9 AM - 6 PM |

---

## 🔑 Test Credentials

### Student Portal

- **Sign up** to create account with Roll Number
- Use email and password for login

### Admin Dashboard

```
Email: admin@college.com
Password: admin123
```

---

## 📖 Documentation

1. **[QUICK_START.md](QUICK_START.md)** - Get running in 5 minutes
2. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup & API docs
3. **[MONGODB_SEED.js](MONGODB_SEED.js)** - Database seed data

---

## 🔄 Workflow

```
Student Signs Up
    ↓
Selects Sport & Date
    ↓
Views Available Slots
    ↓
Books Slot (if available)
    ↓
Confirmation & Email
    ↓
Can Cancel Anytime
    ↓
Admin Views All Bookings
```

**Key Feature**: ⚡ **Prevents Double-Booking** - Once a slot is taken, no one else can book it!

---

## 📊 API Endpoints

### Auth

- `POST /api/auth/register` - Register student
- `POST /api/auth/login` - Login

### Bookings

- `GET /api/bookings/available-slots` - Get available slots
- `POST /api/bookings/book` - Book a slot
- `GET /api/bookings/my-bookings` - My bookings
- `DELETE /api/bookings/cancel/:id` - Cancel booking
- `GET /api/bookings/all` - All bookings (admin)

### Facilities

- `GET /api/facilities` - Get facilities
- `POST /api/facilities/add` - Add facility (admin)
- `DELETE /api/facilities/:id` - Delete facility (admin)

---

## 🔐 Security

- ✅ JWT-based authentication
- ✅ Password hashing (bcryptjs)
- ✅ Role-based access control
- ✅ CORS enabled
- ✅ Input validation
- ✅ Protected routes

---

## 🐛 Troubleshooting

| Problem                  | Solution                                      |
| ------------------------ | --------------------------------------------- |
| Backend won't start      | Check MongoDB running: `mongod`               |
| Port 5000 in use         | Update PORT in `.env`                         |
| CORS errors              | Make sure backend is running                  |
| Can't access admin       | Use credentials: admin@college.com / admin123 |
| Database not initialized | Visit: http://localhost:5000/api/initialize   |

---

## 📱 Responsive

- ✅ Desktop (Full features)
- ✅ Tablet (Optimized layout)
- ✅ Mobile (Touch-friendly)

---

## 🚀 Deployment

Ready to deploy? See **[SETUP_GUIDE.md](SETUP_GUIDE.md)** section on Deployment.

**Recommended Platforms:**

- Backend: Heroku, Railway, Render
- Frontend: Netlify, Vercel
- Database: MongoDB Atlas

---

## 📄 License

MIT License - See LICENSE file

---

## 👥 Team

Created for college sports management system.

---

**🎉 Ready to book sports? Start now!**
