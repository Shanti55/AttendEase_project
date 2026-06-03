# Database setup (fix P1001)

**Error `P1001: Can't reach database server at localhost:5432`** means PostgreSQL is not running on your PC (or not installed).

Pick **Option A** (fastest, no install) or **Option B** (local PostgreSQL).

---

## Option A — Free cloud DB (recommended, ~3 minutes)

1. Open **https://neon.tech** → Sign up (GitHub is fine).
2. **New Project** → name it `attendease` → Create.
3. On the dashboard, copy the **connection string** (starts with `postgresql://`).
4. Open `backend/.env` and replace `DATABASE_URL` with that string.

   Example (yours will differ):

   ```env
   DATABASE_URL="postgresql://neondb_owner:xxxx@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

5. In PowerShell:

   ```powershell
   cd C:\attendance-system\backend
   npx prisma migrate dev --name init
   npm run dev
   ```

---

## Option B — Install PostgreSQL on Windows

1. Download: **https://www.postgresql.org/download/windows/**
2. Run installer → remember the **password** you set for user `postgres`.
3. Keep port **5432** and database name optional (create `attendease` in pgAdmin or use default `postgres`).

4. Update `backend/.env`:

   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/attendease"
   ```

   Create database (pgAdmin or SQL Shell):

   ```sql
   CREATE DATABASE attendease;
   ```

5. Start PostgreSQL service (Services app → **postgresql** → Start), then:

   ```powershell
   cd C:\attendance-system\backend
   npx prisma migrate dev --name init
   npm run dev
   ```

---

## PowerShell tips

| Wrong | Correct |
|-------|---------|
| `\backend` | `cd backend` or `cd C:\attendance-system\backend` |
| Run from `attendance-system` without `cd backend` | Always `cd backend` before `npx prisma` / `npm run dev` |

---

## Verify backend

- API: http://localhost:5000/health → should show `{ "status": "OK", ... }`
- Frontend (separate terminal): `cd C:\attendance-system\frontend` → `npm run dev`
