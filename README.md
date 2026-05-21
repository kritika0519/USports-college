# � USports - Eliminate Wasted Time, Book Your Court!

> **Smart College Sports Facility Booking System**  
> *Stop wasting time checking if courts are free. Book your slot online and play on time!*

---

## 🎯 **THE PROBLEM WE SOLVE**

### ❌ **Before USports:**
Students want to play sports during free time, but:
- ❌ Rush to the court → **Equipment is already taken**
- ❌ Wait around → **30-45 mins wasted** just checking availability
- ❌ No transparency → Can't plan their schedule
- ❌ Conflicts → Multiple students booking same slot
- ❌ Chaos → First-come, first-served madness

### ✅ **With USports:**
Students can now:
- ✅ **Book online** in advance with exact time slots
- ✅ **Plan their day** knowing exactly when they can play
- ✅ **Zero wasted time** - equipment is reserved just for them
- ✅ **Fair system** - anyone can book any time
- ✅ **Faculty oversight** - admins can manage and prevent abuse

---

## 🚀 **LIVE NOW! TRY IT TODAY**

| 👥 Role | 🔗 Link | 🔑 Login | Status |
|---------|---------|---------|--------|
| **Student** | [🌐 USports Portal](https://usports-frontend-git-main-kritika0519s-projects.vercel.app/) | `test@college.com` / `test123` | ✅ Live |
| **Faculty/Admin** | [📊 Admin Dashboard](https://usports-api.onrender.com/admin) | `admin@college.com` / `admin123` | ✅ Live |
| **Backend API** | [🔌 API Server](https://usports-api.onrender.com) | `GET /api/facilities` | ✅ Live |

---

## ✨ **KEY FEATURES**

### 🎓 **Student Portal**
- ✅ One-click sign up with email
- ✅ Browse all 10+ college sports facilities
- ✅ Pick date and see **available time slots in real-time**
- ✅ Book slots instantly (9 AM - 6 PM, 1-hour slots)
- ✅ **"My Bookings"** - see all your upcoming bookings
- ✅ **Cancel anytime** if plans change
- ✅ Beautiful dark mode UI
- ✅ Fully responsive (mobile, tablet, desktop)

### 👨‍💼 **Admin Dashboard**
- ✅ View all student bookings
- ✅ Add/remove facilities
- ✅ Manage time slots per facility
- ✅ User management & role control
- ✅ Analytics & statistics
- ✅ Faculty approval system

---

## 📊 **WHAT'S INCLUDED**

### 🎮 Pre-Loaded Demo Data
- **10 Sports Facilities**: Tennis, Basketball, Badminton, Volleyball, Football, Table Tennis, etc.
- **2 Test Bookings**: See how the system works
- **Multiple Slots**: 9 one-hour slots per facility daily
- **Test Users**: Student & Admin accounts ready to go

---

## 🛠️ **TECH STACK**

```
Frontend → HTML/CSS/JavaScript (Vanilla) → Vercel CDN
    ↓
API Gateway → Node.js + Express.js → Render Cloud
    ↓
Database → JSON Files (file-based) → No MongoDB needed!
    ↓
Auth → JWT Tokens + bcrypt passwords
```

| Component | Technology |
|-----------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js 24, Express.js |
| **Database** | File-based JSON (production-ready) |
| **Authentication** | JWT + bcrypt |
| **Hosting** | Vercel (Frontend) + Render (Backend) |
| **Security** | CORS, Password hashing, Role-based access |

---

## 📁 **PROJECT STRUCTURE**

```
USports-main/
│
├── 📦 backend/                          # Node.js Express API
│   ├── server.js                        # Main entry point
│   ├── package.json                     # Dependencies
│   │
│   ├── routes/
│   │   ├── fileAuthRoutes.js           # Login/Signup endpoints
│   │   ├── fileBookingRoutes.js        # Booking management
│   │   └── fileFacilityRoutes.js       # Sports facilities list
│   │
│   ├── data/                            # File-based storage (NO MongoDB!)
│   │   ├── users.json                  # Student & admin accounts
│   │   ├── bookings.json               # All reservations
│   │   └── facilities.json             # Sports facilities config
│   │
│   └── public/                          # Static files (served by Express)
│       ├── student/                    # 🎓 Student Portal (Vercel)
│       │   ├── index.html              # Main page
│       │   ├── script.js               # Booking logic
│       │   ├── style.css               # Beautiful UI
│       │   └── config.js               # API URL config
│       │
│       └── admin/                       # 👨‍💼 Admin Dashboard (Render)
│           ├── index.html              # Admin page
│           ├── admin.js                # Dashboard logic
│           ├── style.css               # Admin styling
│           └── config.js               # API URL config
│
├── .env                                 # Environment variables
├── .gitignore                          # Git ignore file
└── package.json                        # Root dependencies
```

---

## ⚡ **QUICK START (5 MINUTES)**

### **Run Backend Locally**
```bash
cd backend
npm install
node server.js
# ✅ Server running on http://localhost:5000
```

### **Run Student Portal**
```bash
# Open in browser or start a web server
cd backend/public/student
# Option 1: Double-click index.html
# Option 2: python -m http.server 8000
# ✅ Visit http://localhost:8000
```

### **Test Credentials**
```
Student: test@college.com / test123
Admin: admin@college.com / admin123
```

### **Test Booking Flow**
1. Login as `test@college.com`
2. Select "Tennis" sport
3. Pick date: `2026-05-22` or any future date
4. See 9 available time slots
5. Click one slot (e.g., 11:00 AM)
6. Click "Confirm Booking"
7. Go to "My Bookings" → See your booking! ✅

---

## 📱 **HOW IT WORKS**

### **Student Flow:**
```
Sign Up → Login → Browse Sports → Select Facility & Date 
  → Pick Time Slot → Confirm Booking → See in My Bookings
```

### **Admin Flow:**
```
Login (Admin Account) → View Dashboard → See All Bookings
  → Manage Facilities → User Management
```

### **Behind the Scenes:**
```
Frontend (Vercel) 
  ↓ (HTTPS)
Config.js (Auto-detects API URL)
  ↓ (JWT Token)
Backend API (Render)
  ↓ (Queries)
File-based Database (JSON)
  ↓ (Response)
Frontend (Shows Results)
```

---

## 🚀 **DEPLOYMENT LINKS**

### **LIVE NOW:**
- 🎓 **Student Portal**: https://usports-frontend-git-main-kritika0519s-projects.vercel.app/
- 👨‍💼 **Admin Dashboard**: https://usports-api.onrender.com/admin
- 🔌 **Backend API**: https://usports-api.onrender.com

### **Architecture:**
- **Frontend**: Deployed on **Vercel** (free tier)
- **Backend**: Deployed on **Render** (free tier)
- **Database**: **File-based JSON** (stored on Render)
- **CI/CD**: Auto-deploys from GitHub on every push

---

## 📊 **API ENDPOINTS**

```javascript
// Authentication
POST   /api/auth/login          // Student/Admin login
POST   /api/auth/signup         // New student registration

// Facilities
GET    /api/facilities          // Get all sports facilities

// Bookings (requires JWT token)
GET    /api/bookings/available-slots?sport=Tennis&date=2026-05-22
POST   /api/bookings/book       // Create booking
GET    /api/bookings/my-bookings  // Get user's bookings
DELETE /api/bookings/cancel/:id   // Cancel booking
```

---

## 🔐 **TEST CREDENTIALS**

| User Type | Email | Password | Access |
|-----------|-------|----------|--------|
| **Student** | `test@college.com` | `test123` | Student Portal |
| **Admin** | `admin@college.com` | `admin123` | Admin Dashboard |
| **New User** | Any email | Any password | Sign up anytime |

---

## 📈 **WHAT'S WORKING**

✅ Student registration & login  
✅ Browse sports facilities  
✅ Real-time availability checking  
✅ Book time slots  
✅ View my bookings  
✅ Cancel bookings  
✅ Admin login  
✅ Admin dashboard  
✅ Responsive design (mobile + desktop)  
✅ Production deployment  
✅ Zero downtime deployment  

---

## 🎓 **LEARNING FROM THIS PROJECT**

This project demonstrates:
- Full-stack web development (Frontend + Backend)
- RESTful API design
- JWT authentication
- File-based database (alternative to MongoDB)
- Cloud deployment (Vercel + Render)
- Responsive web design
- Security best practices
- Production-ready code

---

## 👨‍💻 **BUILT BY**

**Kritika** - College Sports Booking System  
Making sports accessible, one booking at a time! ⚽🏀🎾

---

## 📞 **HAVE QUESTIONS?**

- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Start a discussion
- 📧 **Contact**: Email the maintainer

---

**⭐ If you find this useful, please star the repo! It helps others discover the project. ⭐**

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
