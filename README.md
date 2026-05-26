# USports

USports is a full-stack university sports booking app. Students can register, choose a sport, reserve available slots, manage bookings, and update their profile. Admin users can view bookings, facilities, and registered users from the admin dashboard.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Storage: MongoDB when configured, with JSON files in `backend/data` as fallback
- Auth: JWT + bcryptjs

## Project Structure

```text
USports-main/
  backend/
    config/
      db.js
      seedMongo.js
    data/
      bookings.json
      facilities.json
      users.json
    models/
      Booking.js
      Facility.js
      User.js
    routes/
      fileAuthRoutes.js
      fileBookingRoutes.js
      fileFacilityRoutes.js
    .env.example
    package.json
    server.js
  frontend/
    src/
      lib/api.js
      main.jsx
      styles.css
    .env.example
    index.html
    package.json
  .gitignore
  README.md
```

## Local Setup

Install backend dependencies:

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example`, then start the API:

```bash
npm start
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

Create `frontend/.env` from `frontend/.env.example` if you want to override the API URL, then start Vite:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Environment Variables

Backend:

```env
MONGODB_URI=mongodb://localhost:27017/usports
DB_NAME=USports
JWT_SECRET=your_super_secret_key_12345
PORT=5000
COLLEGE_ID=college_001
COLLEGE_NAME=ABC Engineering College
NODE_ENV=development
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

## Seed Data

Seed facilities and users are stored in `backend/data`. If `MONGODB_URI` is set and the connection succeeds, the backend seeds MongoDB from those JSON files when collections are empty. If MongoDB is not configured or unavailable, the app falls back to JSON storage.

## GitHub Notes

Generated and local-only files are ignored:

- `node_modules/`
- `dist/`
- `.env`
- log files
- editor folders

Do not commit real `.env` files or secrets.
