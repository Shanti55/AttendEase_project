# Quick Deploy — Render + Vercel

## Live links (deploy ke baad yahan likho)

| What | URL |
|------|-----|
| Website | `https://________________.vercel.app` |
| API Health | `https://________________.onrender.com/health` |
| API Base | `https://________________.onrender.com/api` |
| Admin Panel | `https://________________.vercel.app/control-room` |

---

## Render (Backend) — 5 steps

1. GitHub push repo
2. Render → PostgreSQL → copy `DATABASE_URL`
3. Render → Web Service → root `backend`
4. Build: `npm install && npx prisma generate && npx prisma db push`
5. Start: `node server.js` + env vars (see INTERVIEW-PREP doc)

## Vercel (Frontend) — 3 steps

1. Import repo → root `frontend`
2. `VITE_API_URL` = `https://YOUR-RENDER-URL.onrender.com/api`
3. Deploy → copy URL → update Render `FRONTEND_URL`

## Admin first time

```bash
cd backend
# DATABASE_URL = production URL
npm run seed:admin
```

Login: `ADMIN_EMAIL` / `ADMIN_PASSWORD` from env → `/control-room`
