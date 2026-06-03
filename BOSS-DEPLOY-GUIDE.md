# Boss ko Live Link Dena — Step by Step (Zero Knowledge)

**Time:** ~30–45 minute (pehli baar)  
**Kya chahiye:** GitHub account (free), Render account (free), Vercel account (free)

---

## PART 0 — Pehle yeh samjho (boss ko kya doge)

| Link | Example | Kaam |
|------|---------|------|
| **Website** | `https://attendease.vercel.app` | Employees login / register |
| **API Health** | `https://attendease-api.onrender.com/health` | Boss check kare server chal raha hai |
| **API Base** | `https://attendease-api.onrender.com/api` | Technical link (optional) |
| **Admin Panel** | `https://attendease.vercel.app/control-room` | Sirf admin login |

**Boss ko email / WhatsApp mein 2–3 link bhejo:** Website + Admin + Health OK screenshot.

---

## PART 1 — Code GitHub par daalo (5 min)

### 1.1 GitHub par naya repo
1. Browser → [github.com](https://github.com) → Login
2. **+** → **New repository**
3. Name: `attendance-system` (ya `attendease`)
4. **Public** rakho
5. **Create repository** (README mat add karo — code already hai)

### 1.2 Apne PC se code upload

PowerShell kholo:

```powershell
cd C:\attendance-system

git init
git add .
git commit -m "AttendEase full stack project"

git branch -M main
git remote add origin https://github.com/APNA-USERNAME/attendance-system.git
git push -u origin main
```

`APNA-USERNAME` = tumhara GitHub username.

> Agar `git` command nahi chalti → [git-scm.com](https://git-scm.com) install karo, PC restart, phir dubara try.

**Important:** `.env` files GitHub par **nahi** jayengi (`.gitignore` mein hain) — yeh safe hai.

---

## PART 2 — Database (Neon — tum pehle se use kar rahi ho)

Agar **Neon** pe database already hai:

1. [neon.tech](https://neon.tech) → Login → Project kholo
2. **Connection string** copy karo (PostgreSQL URL, `?sslmode=require` ke saath)
3. Isko save karo — Render mein `DATABASE_URL` banegi

**Naya database chahiye ho to:** Neon → New Project → copy connection string.

---

## PART 3 — Backend Render par (15 min)

### 3.1 Account
1. [render.com](https://render.com) → **Get Started** → **Sign up with GitHub**
2. GitHub se connect allow karo

### 3.2 Web Service banao
1. Dashboard → **New +** → **Web Service**
2. **Connect** apna `attendance-system` repo
3. Settings **exactly** aise bharo:

| Setting | Value |
|---------|--------|
| **Name** | `attendease-api` (kuch bhi) |
| **Region** | Singapore ya closest |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install && npx prisma generate && npx prisma db push` |
| **Start Command** | `node server.js` |
| **Instance Type** | Free |

### 3.3 Environment Variables (bahut important)

Scroll → **Environment Variables** → Add:

| Key | Value (example) |
|-----|-----------------|
| `DATABASE_URL` | (Neon wali poori string paste) |
| `JWT_SECRET` | koi bhi lamba random text 32+ chars, jaise `MySecretKeyForAttendEase2026Interview!!` |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `PORT` | `5001` (Render khud bhi set karta hai — optional) |
| `TZ` | `Asia/Kolkata` |
| `ADMIN_EMAIL` | `admin@attendease.com` |
| `ADMIN_PASSWORD` | strong password jo yaad rahe |
| `ADMIN_NAME` | `Shanti Admin` |
| `FRONTEND_URL` | abhi khali chhod do — **baad mein** Vercel URL daaloge |

4. **Create Web Service** → 5–10 min wait (Building… → Live)

### 3.4 API link copy karo

Upar URL dikhega jaise:

```
https://attendease-api.onrender.com
```

**Test browser mein:**

```
https://attendease-api.onrender.com/health
```

Dikhna chahiye: `{"status":"OK",...}`

**Boss ke liye API link:**

```
https://attendease-api.onrender.com/api
```

### 3.5 Admin account (ek baar)

**Option A — Apne PC se (easy):**

1. `backend/.env` kholo — `DATABASE_URL` = **wahi Neon production URL** (local wali)
2. PowerShell:

```powershell
cd C:\attendance-system\backend
npm run seed:admin
```

**Option B — Render Shell:**  
Service → **Shell** → `npm run seed:admin` (agar chale)

---

## PART 4 — Frontend Vercel par (10 min)

### 4.1 Account
1. [vercel.com](https://vercel.com) → **Sign up with GitHub**

### 4.2 Project import
1. **Add New** → **Project**
2. GitHub repo `attendance-system` select → **Import**
3. Settings:

| Setting | Value |
|---------|--------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` (Edit → `frontend` select) |
| **Build Command** | `npm run build` (default OK) |
| **Output Directory** | `dist` (default OK) |

### 4.3 Environment Variables

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://attendease-api.onrender.com/api` |
| `VITE_ADMIN_PATH` | `control-room` |

⚠️ `attendease-api` ki jagah **apna Render service name** use karo.

4. **Deploy** → 2–3 min wait

### 4.4 Website link

Milega jaise:

```
https://attendance-system-xxx.vercel.app
```

**Rename (optional):** Vercel → Project → Settings → change name → `attendease.vercel.app`

---

## PART 5 — Dono ko connect karo (2 min)

1. **Render** → Web Service → **Environment**
2. `FRONTEND_URL` add/update karo:

```
https://attendance-system-xxx.vercel.app
```

(apni Vercel URL, **bina** slash end par)

3. **Save Changes** → Render auto redeploy karega

4. **Vercel** → agar env change kiya ho to **Redeploy**

---

## PART 6 — Boss ko message (copy-paste)

```
Hi,

AttendEase (Attendance + Task Management) live hai:

🌐 App (Employee login): https://YOUR-VERCEL-URL.vercel.app
🔐 Admin panel: https://YOUR-VERCEL-URL.vercel.app/control-room
✅ API status: https://YOUR-RENDER-URL.onrender.com/health

Tech: React + Node.js + PostgreSQL
Features: Daily attendance, check-in/out, tasks, admin dashboard, late/grace tracking.

Demo admin login details shared separately / on request.

Thanks,
Shanti Kumari
```

---

## PART 7 — Final test checklist

- [ ] Health URL → OK
- [ ] Website → Register new user → Login
- [ ] Mark attendance works
- [ ] Admin `/control-room` → login → table dikhe
- [ ] README mein live links update

---

## Common problems

| Problem | Fix |
|---------|-----|
| Render build fail | Build log dekho — usually `DATABASE_URL` galat |
| Vercel blank / login fail | `VITE_API_URL` sahi Render URL + `/api` |
| CORS error | Render `FRONTEND_URL` = exact Vercel URL |
| Render slow first load | Free tier cold start — 30 sec wait normal |
| Admin login fail | `npm run seed:admin` dubara chalao |

---

## Free tier limits (interview ke liye bolo)

- Render free app **sleep** ho sakta hai — pehli request slow
- Neon + Render + Vercel sab free tier interview demo ke liye OK

**All the best!**
