# AttendEase — Attendance & Task Management

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

Full-stack employee portal for daily attendance check-in and personal task tracking. Built as an interview trial project.

**Live Demo** _(update after deploy)_
- Frontend: `https://your-app.vercel.app`
- Admin panel: `https://your-app.vercel.app/control-room`
- Backend API: `https://your-api.onrender.com/api`
- Health check: `https://your-api.onrender.com/health`

📄 **Interview PDF guide:** see [`INTERVIEW-PREP-SHANTI-KUMARI.md`](./INTERVIEW-PREP-SHANTI-KUMARI.md) → Print to PDF  
🚀 **Deploy steps:** see [`DEPLOY-QUICK.md`](./DEPLOY-QUICK.md)

---

## Features

- User registration and JWT-based login
- One attendance mark per user per day (DB unique constraint)
- Monthly attendance stats
- CRUD tasks with status workflow (TODO → IN PROGRESS → DONE)
- Role-based user model (ADMIN / EMPLOYEE)
- Responsive dashboard UI (navy + gold theme)

---

## Tech Stack

| Layer      | Technology                          |
|-----------|--------------------------------------|
| Backend   | Node.js, Express.js, Prisma ORM      |
| Database  | PostgreSQL                           |
| Frontend  | React, Vite, Tailwind CSS            |
| Auth      | JWT, bcrypt (12 salt rounds)         |
| Validation| Zod                                  |
| Security  | Helmet, CORS, express-rate-limit     |
| Deploy    | Render (API + DB), Vercel (frontend) |

---

## Security

- Passwords hashed with bcrypt (`saltRounds: 12`)
- JWT expires in 7 days (`JWT_EXPIRES_IN`)
- No credentials in source — all via `.env`
- Helmet for HTTP security headers
- Rate limit: 100 requests / 15 min per IP
- Users can only access their own tasks and attendance

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│ User                                                        │
├─────────────────────────────────────────────────────────────┤
│ id (PK) │ name │ email (unique) │ password │ role │ created│
└─────────────────────────────────────────────────────────────┘
         │ 1                          │ 1
         │ has many                   │ has many
         ▼                            ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│ Attendance           │    │ Task                         │
├──────────────────────┤    ├──────────────────────────────┤
│ id (PK)              │    │ id (PK)                      │
│ userId (FK)          │    │ userId (FK)                  │
│ date (@db.Date)      │    │ title                        │
│ checkIn              │    │ description?                 │
│ status               │    │ status (TODO/IN_PROGRESS/DONE)│
│ UNIQUE(userId, date) │    │ dueDate?                     │
└──────────────────────┘    │ createdAt, updatedAt         │
                            └──────────────────────────────┘
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Server health check |
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Current user profile |
| POST | `/api/attendance/mark` | Yes | Mark today’s attendance |
| GET | `/api/attendance` | Yes | List my attendance records |
| GET | `/api/attendance/stats` | Yes | Monthly present-day count |
| GET | `/api/tasks` | Yes | List tasks (`?status=`) |
| POST | `/api/tasks` | Yes | Create task |
| GET | `/api/tasks/:id` | Yes | Get one task |
| PATCH | `/api/tasks/:id` | Yes | Update task |
| DELETE | `/api/tasks/:id` | Yes | Delete task |

All JSON responses: `{ success, message, data }`

---

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (local or Render)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd attendance-system
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit DATABASE_URL and JWT_SECRET in .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

API runs at `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing tokens (32+ chars) |
| `JWT_EXPIRES_IN` | Token expiry (default `7d`) |
| `PORT` | Server port (default `5000`) |
| `FRONTEND_URL` | CORS origin (e.g. `http://localhost:5173`) |
| `NODE_ENV` | `development` or `production` |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL (e.g. `http://localhost:5000/api`) |

---

## Deploy

### Backend (Render)

- Root Directory: `backend`
- Build: `npm install && npx prisma generate && npx prisma migrate deploy`
- Start: `node server.js`
- Set env vars: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`, `FRONTEND_URL`

### Frontend (Vercel)

- Root Directory: `frontend`
- Env: `VITE_API_URL=https://your-api.onrender.com/api`
- After deploy, set `FRONTEND_URL` on Render to your Vercel URL

---

## Folder Structure

```
attendance-system/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── prisma.js
│   │   └── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## Author

**Shanti Kumari** — Snowebs Interview Trial Project
