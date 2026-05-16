# 🚀 USports - SINGLE APPLICATION DEPLOYMENT

## 📋 Overview

**USports** is a complete college sports booking system - **ALL IN ONE PLACE:**

- ✅ **Backend API** - Node.js + Express (Port 5000)
- ✅ **Student Portal** - Served at `/` (http://localhost:5000)
- ✅ **Admin Dashboard** - Served at `/admin` (http://localhost:5000/admin)
- ✅ **File-Based Storage** - No database setup needed!
- ✅ **Zero Vulnerabilities** - npm audit: clean

---

## 🏗️ PROJECT STRUCTURE

```
USports/
├── backend/
│   ├── public/
│   │   ├── student/       (Student Portal - served at /)
│   │   ├── admin/         (Admin Dashboard - served at /admin)
│   │   └── data/          (File-based storage)
│   ├── routes/            (API endpoints)
│   ├── package.json
│   └── server.js          (Main Express app)
├── README.md
└── DEPLOY.md
```

---

## 📦 LOCAL SETUP (Development)

### Prerequisites

- Node.js v18+ (download from nodejs.org)
- Any code editor (VS Code recommended)

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start Single Server

```bash
cd backend
npm run dev
```

### 3. Access Everything on Port 5000

- **Student Portal**: http://localhost:5000
- **Admin Login**: http://localhost:5000/admin/login.html
- **Admin Dashboard**: http://localhost:5000/admin/index.html
- **API Endpoints**: http://localhost:5000/api/*

### 4. Test Credentials

```
Admin:
  Email: admin@college.com
  Password: admin123

Student:
  Email: test@college.com
  Password: test123
```

---

## 🌐 DEPLOY TO LIVE (Production)

### Single Step: Deploy to Railway

#### 1. Create Railway Account

- Go to **railway.app**
- Sign up with GitHub
- Connect your GitHub account

#### 2. Create New Project

- Click "New Project"
- Select "GitHub Repo"
- Choose your USports repository

#### 3. Configure Backend Service

- Click "New Service" → "GitHub Repository"
- Select the repo
- **Set root directory**: `backend/`

#### 4. Add Environment Variables

- Go to "Variables" tab
- Add these variables:
  ```
  JWT_SECRET=your_super_secret_key_here
  PORT=5000
  NODE_ENV=production
  ```

#### 5. Deploy

- Railway auto-deploys on git push
- Go to "Deployments" tab
- Copy the generated URL
- **Example URL**: `https://usports-backend-xyz.railway.app`

#### 6. Done! Your Live URLs:

```
Student Portal:   https://usports-backend-xyz.railway.app
Admin Login:      https://usports-backend-xyz.railway.app/admin/login.html
Admin Dashboard:  https://usports-backend-xyz.railway.app/admin/index.html
API:              https://usports-backend-xyz.railway.app/api
```

---

## ✅ DEPLOYMENT VERIFICATION CHECKLIST

After deployment, verify:

- [ ] Student Portal loads: `https://your-domain/`
- [ ] Admin Login page loads: `https://your-domain/admin/login.html`
- [ ] Admin can login with credentials
- [ ] Student can login and book sports
- [ ] Bookings appear in admin panel
- [ ] All pages are responsive

---

## 📝 HOW IT WORKS

### Architecture

```
SINGLE EXPRESS SERVER (Port 5000)
├── Middleware (CORS, JSON parsing)
├── Static Files Serving
│   ├── / → serves public/student/ (Student Portal)
│   └── /admin → serves public/admin/ (Admin Dashboard)
└── API Routes
    ├── /api/auth/* (Login/Signup)
    ├── /api/bookings/* (Booking operations)
    └── /api/facilities/* (Facility management)
```

### File-Based Storage

- **Location**: `backend/data/`
- **Files**:
  - `users.json` - All user accounts
  - `bookings.json` - All bookings
  - `facilities.json` - All sports facilities
- **Advantage**: No database setup, no connection strings, instant deployment

### API URL Detection

- **Locally**: Uses relative paths (`/api`)
- **Production**: Works automatically on any domain
- **Why**: Both frontend and backend on same origin = no CORS issues

---

## 🔧 TROUBLESHOOTING

### Q: Admin/Student portal not loading?

**A**: Check that Railway deployment includes the `backend/public/` folder

- Solution: Verify git includes all files: `git status`

### Q: Login failing after deployment?

**A**: JWT_SECRET environment variable not set

- Solution: Add `JWT_SECRET=your_secret` to Railway Variables

### Q: API calls getting 404?

**A**: Server not including CORS middleware

- Solution: Verify `server.js` has `app.use(cors())`

### Q: Changes not showing after git push?

**A**: Railway may need manual redeploy

- Solution: Go to Railway → Deployments → Click redeploy button

---

## 📊 DEPLOYMENT COMPARISON

| Factor | Before | After |
| --- | --- | --- |
| Servers | 3 (Backend, Frontend, Admin) | 1 (Backend serving all) |
| Domains | 3 different URLs | 1 unified domain |
| Setup | Complex deployment | Single deployment |
| Cost | Higher | Lower |
| Maintenance | Multiple services | Single service |
| CORS Issues | Yes | No |

---

## 🎉 NEXT STEPS

1. **Push to GitHub**: `git add . && git commit -m "Single application deployment" && git push`
2. **Create Railway Project**: Connect GitHub repo
3. **Deploy**: Railway auto-builds and deploys
4. **Get URL**: Copy from Railway dashboard
5. **Share**: Your system is live! 🚀

---

## 📞 SUPPORT

- **Local Issues**: Check terminal output from `npm run dev`
- **Deployment Issues**: Check Railway dashboard logs
- **API Issues**: Check browser console (F12) for errors

---

## ✨ You're All Set!

**Everything runs on ONE server, ONE domain, ONE deployment!**
