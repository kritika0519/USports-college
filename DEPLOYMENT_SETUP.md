# 🚀 USports Deployment Guide - Vercel (Frontend) + Render (Backend)

## Architecture
```
Frontend: Vercel (https://u-sports-new.vercel.app)
  ├── HTML, CSS, JavaScript
  ├── Makes API calls to Render backend
  └── Auto-deploys on git push

Backend: Render (https://usports-backend.onrender.com)
  ├── Node.js Express server
  ├── File-based JSON storage
  ├── API endpoints
  └── Auto-deploys on git push
```

---

## 📋 PRE-REQUISITES
- GitHub account (already have)
- Vercel account (free): https://vercel.com
- Render account (free): https://render.com

---

## 🔧 STEP 1: Deploy Backend to Render

### 1.1 Create Render Account
- Go to https://render.com
- Sign up with GitHub
- Authorize GitHub access

### 1.2 Create New Web Service
1. Click **New +** → **Web Service**
2. Select your **usports-main** GitHub repository
3. Configure:
   - **Name**: `usports-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or paid for better performance)

### 1.3 Add Environment Variables
Click **Environment** and add:
```
JWT_SECRET = your_super_secret_key_12345
NODE_ENV = production
PORT = 3000
```

### 1.4 Deploy
- Click **Create Web Service**
- Wait for deployment to complete (~2-3 minutes)
- Copy your Render URL: `https://usports-backend.onrender.com`

---

## 🌐 STEP 2: Update Frontend Config

### 2.1 Update API URL in config.js
Open `backend/public/student/config.js` and update:
```javascript
const API_URL = 'https://usports-backend.onrender.com/api';
```

Do the same for `backend/public/admin/config.js`

### 2.2 Commit Changes
```bash
git add .
git commit -m "Update API URL to Render backend"
git push origin main
```

---

## 📤 STEP 3: Deploy Frontend to Vercel

### 3.1 Connect Vercel to GitHub
1. Go to https://vercel.com/new
2. Select your **usports-main** repository
3. Click **Import**

### 3.2 Configure Project
- **Framework**: Suggest: Static Site
- **Root Directory**: `frontend/` (for frontend-only) OR `backend/public/student/` (if keeping current structure)
- **Build Command**: Leave empty (static site)
- **Output Directory**: Leave empty

### 3.3 Environment Variables (Optional)
You can add if Vercel asks:
```
REACT_APP_API_URL = https://usports-backend.onrender.com/api
```

### 3.4 Deploy
- Click **Deploy**
- Wait for build to complete
- You'll get a URL like: `https://u-sports-new.vercel.app`

---

## ✅ STEP 4: Test Live Deployment

### 4.1 Test Student Portal
1. Open https://u-sports-new.vercel.app
2. CSS should load properly (gradient backgrounds, colored buttons)
3. Click **Sign In**
4. Enter credentials:
   - Email: `test@college.com`
   - Password: `test123`
5. Should redirect to portal and show "Test Student"

### 4.2 Test Admin Dashboard
1. Open https://u-sports-new.vercel.app/admin/login.html
2. Enter credentials:
   - Email: `admin@college.com`
   - Password: `admin123`
3. Should show admin dashboard with statistics

### 4.3 Test Full Booking Flow
1. Login as student
2. Select Tennis sport
3. Pick a date
4. Should see 9 available slots (9 AM - 6 PM)
5. Click a time slot
6. Click Confirm Booking
7. Booking should appear in "My Bookings"

---

## 🔄 STEP 5: Enable Auto-Deployment

Both platforms automatically deploy when you push to GitHub!

**Workflow:**
1. Make code changes locally
2. Commit: `git commit -m "Description"`
3. Push: `git push origin main`
4. Render deploys backend (2-3 min)
5. Vercel deploys frontend (1-2 min)
6. Check live URLs to verify

---

## ❌ TROUBLESHOOTING

### CSS Not Loading on Vercel
**Issue**: Plain unstyled page on Vercel, styled on localhost
**Solution**: This means static files aren't being served. Ensure:
1. `frontend/` folder has CSS files
2. Vercel root directory is set correctly
3. CSS file paths are relative (e.g., `href="style.css"`)

### Login Fails
**Issue**: "Invalid credentials" or spinning loader
**Solution**: Check:
1. Backend is running on Render (check https://usports-backend.onrender.com/api/health)
2. API_URL in config.js is correct
3. JWT_SECRET matches between frontend config and Render env var

### CORS Errors
**Issue**: "Access-Control-Allow-Origin" error in browser console
**Solution**:
1. Ensure backend has CORS enabled: `app.use(cors())`
2. Add Vercel domain to Render whitelist (if implemented)

### Files/Data Not Persisting
**Issue**: Bookings disappear after refresh
**Solution**:
1. Ensure backend is on Render (has persistent filesystem)
2. Check `backend/data/` folder exists on Render
3. Render filesystem is persistent, so this should work

---

## 📝 QUICK REFERENCE

| Service | URL | Purpose |
|---------|-----|---------|
| Vercel Frontend | https://u-sports-new.vercel.app | Student & Admin UI |
| Render Backend | https://usports-backend.onrender.com | API & Storage |
| Health Check | https://usports-backend.onrender.com/api/health | Verify backend running |

## 🎯 CREDENTIALS

**Student:**
- Email: `test@college.com`
- Password: `test123`

**Admin:**
- Email: `admin@college.com`
- Password: `admin123`

---

## 🚀 YOU'RE LIVE!
Your USports application is now deployed and accessible worldwide! 🌍

Questions? Check logs:
- **Vercel**: Vercel Dashboard → Deployments → Logs
- **Render**: Render Dashboard → Logs
