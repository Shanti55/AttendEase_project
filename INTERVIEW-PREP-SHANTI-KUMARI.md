# AttendEase — Interview Preparation Document

**Candidate:** Shanti Kumari  
**Project:** Attendance + Task Management System (Full Stack)  
**Date:** June 2026  

> **PDF kaise banayein:** Is file ko VS Code / browser mein kholo → `Ctrl + P` → "Save as PDF" choose karo.  
> Ya Word mein paste karke Export PDF.

---

## 1. Project ek line mein (elevator pitch)


"Maine **AttendEase** banaya hai — employees apni daily **attendance** mark karte hain, **tasks** manage karte hain, aur **admin** dekh sakta hai kaun present/absent/late hai. Backend **Node + Express + Prisma + PostgreSQL**, frontend **React + Vite + Tailwind**. Deploy **Render** (API + DB) aur **Vercel** (website) par kiya."

---

## 2. Maine kya install kiya (step-by-step)

### System pe pehle se chahiye


| Software             | Kyon                    |
| -------------------- | ----------------------- |
| **Node.js** (v18+)   | Backend + frontend dono |
| **Git**              | GitHub par code push    |
| **VS Code / Cursor** | Code editor             |


### Backend folder (`backend/`)

```bash
cd backend
npm install
```

**Packages jo install hue:**


| Package                          | Kaam                 |
| -------------------------------- | -------------------- |
| express                          | API server           |
| @prisma/client + prisma          | Database ORM         |
| bcryptjs                         | Password hash        |
| jsonwebtoken                     | Login token (JWT)    |
| zod                              | Request validation   |
| helmet, cors, express-rate-limit | Security             |
| dotenv                           | `.env` se secrets    |
| nodemon (dev)                    | Auto restart on save |


```bash
npx prisma generate
npx prisma db push
npm run seed:admin
```

### Frontend folder (`frontend/`)

```bash
cd frontend
npm install
npm run dev
```


| Package          | Kaam            |
| ---------------- | --------------- |
| react, react-dom | UI              |
| react-router-dom | Pages / routes  |
| axios            | API calls       |
| vite             | Fast dev server |
| tailwindcss      | Styling         |


### Database

- **Neon.tech** — free PostgreSQL (cloud), local Postgres install nahi kiya
- Connection string → `backend/.env` → `DATABASE_URL`

---

## 3. Project structure — kahan se kya aaya

```
attendance-system/
├── backend/          → API (server)
│   ├── prisma/       → Database schema + migrations
│   ├── src/
│   │   ├── controllers/  → Business logic (auth, attendance, tasks, admin)
│   │   ├── routes/       → URL mapping (/api/auth, /api/attendance...)
│   │   ├── middlewares/  → JWT check, validation, errors
│   │   ├── validators/   → Zod schemas
│   │   └── utils/        → Date, office timing, notifications
│   └── server.js     → Entry point, PORT listen
│
├── frontend/         → Website (browser)
│   └── src/
│       ├── pages/    → Login, Register, Dashboard, Admin
│       ├── components/ → Navbar, TaskCard, Alerts...
│       └── api/axios.js → Backend se baat
│
└── README.md
```

**Pattern:** MVC jaisa — Routes → Controllers → Prisma → PostgreSQL.

---

## 4. Features jo maine banaye (interview mein bolna)


| #   | Feature            | Short explanation                                   |
| --- | ------------------ | --------------------------------------------------- |
| 1   | Register / Login   | JWT token, password bcrypt se hash                  |
| 2   | Mark attendance    | Ek din ek baar — DB mein `@@unique([userId, date])` |
| 3   | Check-out / Logout | Leave time save, admin ko dikhe                     |
| 4   | Tasks CRUD         | TODO → IN PROGRESS → DONE                           |
| 5   | Admin panel        | Hidden URL `/control-room`, sirf ADMIN role         |
| 6   | Manual mark        | Admin Present / Absent / Half-day set kar sakta hai |
| 7   | Office timing      | 9:30–6:30, 15 min grace, late minutes calculate     |
| 8   | Notifications      | Admin jab mark kare → employee ko in-app alert      |
| 9   | Security           | Helmet, CORS, rate limit, `.env` secrets            |


---

## 5. Database design (samjh kar bolna)

**User** — name, email, password (hash), role (ADMIN / EMPLOYEE)  
**Attendance** — userId, date, checkIn, checkOut, status, lateMinutes  
**Task** — title, status, dueDate, userId  
**OfficeSettings** — officeStart, officeEnd, graceMinutes (admin change kar sakta hai)  
**Notification** — employee ke liye admin messages  

**Important:** Duplicate attendance rokne ke liye Prisma mein:

```prisma
@@unique([userId, date])
```

Agar dobara mark kare → error `P2002` → message "Already marked today".

---

## 6. Problems jo MUJHE aayi + kaise solve ki (honest)


| Problem                             | Kya hua                                   | Solution                                        |
| ----------------------------------- | ----------------------------------------- | ----------------------------------------------- |
| **PostgreSQL local nahi tha**       | `P1001 Can't reach localhost:5432`        | Neon.tech free cloud DB use kiya                |
| **Port 5000**                       | Server turant band / crash                | Windows par 5000 conflict → **PORT=5001**       |
| **Registration fail**               | Frontend backend se connect nahi          | CORS + Vite **proxy** `/api` → `localhost:5001` |
| **Admin panel open nahi**           | `/control-room` par register kar rahi thi | Admin **seed script** se banta hai, login alag  |
| **Check-out admin mein nahi dikha** | Date timezone mismatch                    | `TZ=Asia/Kolkata` + same date helper            |
| **Prisma generate error**           | `EPERM` file lock                         | Backend band karke `npx prisma generate`        |
| **Vite port 5173 busy**             | App **5174** par chali                    | `.env` + browser sahi port                      |


**Interview mein honest bolo:**  
*"Pehle local Postgres try kiya, connect nahi hua. Phir Neon use kiya. Port aur CORS issues debug karke fix kiye — Postman aur browser Network tab se check kiya."*

---

## 7. Help kahan se li (AI wala natural jawab)

**Bina jhooth ke professional:**

- **Official docs** use kiye: [Prisma](https://www.prisma.io/docs), [Express](https://expressjs.com), [React Router](https://reactrouter.com), [Vite](https://vite.dev)
- **Neon** documentation — database connection string
- **Render / Vercel** deploy guides — hosting steps
- **Stack Overflow / Google** — specific errors jaise `P1001`, `EADDRINUSE`, CORS
- **Cursor / AI** — structure plan, boilerplate, error fix suggestions — **lekin har file khud trace karke samjhi, test kiya, apne hisaab se change kiya** (jaise office timing, notifications)

**Mat bolo:** "Poora AI ne likh diya."  
**Bolo:** "Mujhe architecture samajhni thi — maine features list banayi, docs padhe, code review kiya, aur locally test karke deploy kiya."

---

## 8. Interview Q&A — ready answers

**Q: Architecture?**  

> MVC pattern — routes alag, controllers mein logic, Prisma database layer. Frontend alag React app, REST API se JSON.

**Q: Security?**  

> bcrypt (12 rounds), JWT 7 days, helmet headers, rate limiting, role check admin routes par, admin register se nahi banta — seed se.

**Q: Duplicate attendance?**  

> Database unique constraint `[userId, date]`. App level par bhi check.

**Q: Admin ko student access na ho?**  

> JWT mein role, backend `restrictTo('ADMIN')`, frontend hidden path `/control-room`, register hamesha EMPLOYEE.

**Q: Late kaise?**  

> Office start + grace minutes (default 15). Uske baad check-in → `lateMinutes` calculate.

**Q: Deploy?**  

> Backend + PostgreSQL Render, frontend Vercel, env variables par credentials.

---

## 9. Live deploy — Render (Backend + API)

### Step A: GitHub

1. GitHub par repo banao: `attendance-system`
2. Code push (`.env` **mat** push karo — `.gitignore` mein hai)

### Step B: PostgreSQL on Render

1. [render.com](https://render.com) → Sign up → **New +** → **PostgreSQL**
2. Free plan → Create
3. **External Database URL** copy karo

### Step C: Web Service (Backend)

1. **New +** → **Web Service** → GitHub repo connect
2. Settings:


| Field          | Value                                                      |
| -------------- | ---------------------------------------------------------- |
| Root Directory | `backend`                                                  |
| Build Command  | `npm install && npx prisma generate && npx prisma db push` |
| Start Command  | `node server.js`                                           |


1. **Environment Variables:**


| Key            | Value                                               |
| -------------- | --------------------------------------------------- |
| DATABASE_URL   | (Render Postgres URL)                               |
| JWT_SECRET     | (32+ random characters)                             |
| JWT_EXPIRES_IN | 7d                                                  |
| NODE_ENV       | production                                          |
| FRONTEND_URL   | (Vercel URL — Step D ke baad update)                |
| TZ             | Asia/Kolkata                                        |
| ADMIN_EMAIL    | [admin@attendease.com](mailto:admin@attendease.com) |
| ADMIN_PASSWORD | (strong password)                                   |


1. Deploy → URL milega jaise:
  `**https://attendease-api.onrender.com`**
2. Test: `https://attendease-api.onrender.com/health` → `{"status":"OK"}`
3. Admin banane ke liye (Render Shell ya local with production DATABASE_URL):
  ```bash
   npm run seed:admin
  ```

**Live API base URL (README / resume par):**  
`https://YOUR-SERVICE.onrender.com/api`

---

## 10. Live deploy — Vercel (Frontend)

1. [vercel.com](https://vercel.com) → GitHub connect
2. **New Project** → same repo
3. Settings:


| Field          | Value           |
| -------------- | --------------- |
| Root Directory | `frontend`      |
| Framework      | Vite            |
| Build Command  | `npm run build` |
| Output         | `dist`          |


1. **Environment Variable:**


| Key             | Value                                   |
| --------------- | --------------------------------------- |
| VITE_API_URL    | `https://YOUR-SERVICE.onrender.com/api` |
| VITE_ADMIN_PATH | control-room                            |


1. Deploy → URL: `**https://attendease.vercel.app`** (example)
2. Wapas **Render** → `FRONTEND_URL` = Vercel URL (bina `/` ke end par)

**Live website (resume par):**  
`https://YOUR-APP.vercel.app`  
**Admin panel:**  
`https://YOUR-APP.vercel.app/control-room`

---

## 11. Submit karne se pehle checklist

- `https://xxx.onrender.com/health` → OK
- Vercel site khulti hai
- Register → Login → Mark attendance → Task create
- Admin login → attendance table + manual mark
- README mein **Live Demo** links update
- `.env` GitHub par nahi hai

---

## 12. Resume / Email ke liye sample lines

```
AttendEase — Attendance & Task Management (Full Stack)
Live: https://your-app.vercel.app
API:  https://your-api.onrender.com/health
Tech: React, Node.js, Express, Prisma, PostgreSQL, JWT, Tailwind
• Employee attendance with check-in/out and grace-period late tracking
• Admin dashboard with manual present/absent/half-day and notifications
• Deployed on Vercel (frontend) and Render (backend + Neon/Postgres DB)
```

---

## 13. Demo flow (interview screen share)

1. Employee register → login → Mark attendance → message (on time / late)
2. Task add + status change
3. Check-out ya Logout
4. Admin `/control-room` login → table mein employee + timing
5. Manual Half-day → employee login → **Alerts** notification
6. Office timing change (grace 15 → 20) → explain logic

---

**All the best for your interview, Shanti!**  
Yeh document tumhari apni journey dikhata hai — code samajh kar points yaad karo, PDF print karke revision karo.