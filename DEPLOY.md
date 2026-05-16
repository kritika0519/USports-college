# 🚀 USports - DEPLOYMENT GUIDE

## 📋 Overview
**USports** is a complete college sports booking system with:
- ✅ **Admin Dashboard** - Manage facilities, bookings, users
- ✅ **Student Portal** - Book sports facilities
- ✅ **File-Based Storage** - No database setup needed!
- ✅ **Zero Vulnerabilities** - npm audit: clean

---

## 🏗️ PROJECT STRUCTURE

```
USports/
├── backend/          (Node.js + Express API)
├── frontend/         (Student Portal)
├── admin/            (Admin Dashboard)
└── README.md
```

---

## 📦 LOCAL SETUP (Development)

### Prerequisites
- Node.js v18+ (download from nodejs.org)
- Any code editor (VS Code recommended)

### 1. Install Dependencies
```bash
cd backend
npm install
cd ../frontend
npm install
cd ../admin
npm install
```

### 2. Start Servers
Open 3 terminals and run in each:

**Terminal 1 - Backend (Port 5000)**
```bash
cd backend
npm run dev
```

**Terminal 2 - Student Portal (Port 8000)**
```bash
cd frontend
npm start
```

**Terminal 3 - Admin Panel (Port 8001)**
```bash
cd admin
npm start
```

### 3. Access Locally
- **Student Portal**: http://localhost:8000
- **Admin Panel**: http://localhost:8001
- **API**: http://localhost:5000/api

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

### OPTION A: RAILWAY (Recommended for Backend)

#### Deploy Backend to Railway

1. **Create Railway Account**
   - Go to railway.app
   - Sign up with GitHub
   - Connect your GitHub repo

2. **Create New Project**
   - Click "New Project"
   - Select "GitHub Repo"
   - Choose your USports repo

3. **Configure Backend Service**
   - Click "New Service" → "GitHub Repository"
   - Select the repo and connect
   - Set root directory: `backend`

4. **Add Environment Variables**
   - Go to Variables tab
   - Add: `JWT_SECRET=your_super_secret_key_here`
   - Add: `PORT=5000`

5. **Deploy**
   - Railway auto-deploys on git push
   - Get URL from "Deployments" tab
   - **Copy this URL** - you'll need it for frontend!

**Example Backend URL**: `https://usports-backend.railway.app`

---

### OPTION B: NETLIFY (Frontend + Admin)

#### Deploy Student Portal to Netlify

1. **Create Netlify Account**
   - Go to netlify.com
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "New site from Git"
   - Select your GitHub repo
   - **Build settings:**
     - Build command: `npm install && npm run build` (if no build command, just `npm install`)
     - Publish directory: `frontend` (or `.`)
   - Click Deploy

3. **Update API URL**
   - Before deployment, edit `frontend/script.js`:
   ```javascript
   const API_URL = 'https://usports-backend.railway.app/api'  // Your Railway URL
   ```
   - Commit and push to GitHub
   - Netlify auto-redeploys

4. **Get Netlify URL**
   - Copy from Site Settings → Site details
   - **Example**: `https://usports-portal.netlify.app`

#### Deploy Admin Panel to Netlify
   - Repeat same process for `admin/` folder
   - Update API URL in `admin/admin.js`
   - **Example**: `https://usports-admin.netlify.app`

---

## ✅ FINAL DEPLOYMENT CHECKLIST

- [ ] Backend running on Railway
- [ ] Backend URL copied
- [ ] Frontend API URL updated in `script.js`
- [ ] Admin API URL updated in `admin.js`
- [ ] Frontend deployed to Netlify
- [ ] Admin deployed to Netlify
- [ ] Test login with provided credentials
- [ ] Test booking flow
- [ ] Test admin functions

---

## 📊 LIVE URLS (After Deployment)

```
Backend API:  https://usports-backend.railway.app
Student:      https://usports-portal.netlify.app
Admin:        https://usports-admin.netlify.app
```

---

## 🔧 TROUBLESHOOTING

**Q: Deployment failed**
- Check logs in Railway/Netlify dashboard
- Verify all dependencies in package.json

**Q: Login not working after deploy**
- Verify API URLs are correct in frontend/admin code
- Check CORS settings in backend `server.js`
- Verify JWT_SECRET env variable is set

**Q: Data not saving**
- Verify `backend/data/` folder exists with JSON files
- Check file permissions
- Restart backend service

---

## 📝 QUICK REFERENCE

| Service | Port | Tech | Deploy |
|---------|------|------|--------|
| Backend | 5000 | Node.js + Express | Railway |
| Student Portal | 8000 | HTML/CSS/JS | Netlify |
| Admin Panel | 8001 | HTML/CSS/JS | Netlify |

---

## 🎉 YOU'RE DONE!

Your USports system is production-ready! Share the live URLs with your team! 🚀
