
Backend
tao file env truoc 

DATABASE_URL=
PORT=

npm install
docker compose up -d
npx prisma migrate dev
npm run dev

khi thay doi db
npx prisma migrate dev --name ten_migration


reset khi chay lai db 
npx prisma migrate reset
# 1. migrate
npx prisma migrate dev --name init

# 2. generate
npx prisma generate

# 3. seed
npx prisma db seed

# 4. run backend
npm run dev

DEPLOY FULLSTACK (FRONTEND + BACKEND + DB) – HƯỚNG DẪN TÓM TẮT

========================

1. FRONTEND (Next.js – Vercel)
   ========================

* Login Vercel bằng GitHub
* Import repository

Cấu hình:

* Root Directory = Frontend-next

Environment Variables:

* NEXT_PUBLIC_API_URL=https://your-backend.onrender.com

Deploy:

* Nhấn Deploy
* Sau này mỗi lần git push → auto deploy

========================
2. BACKEND (Node.js – Render)
=============================

* Vào Render → New Web Service
* Connect GitHub repo

Cấu hình:

* Root Directory = backend-ts
* Build Command:
  npm install && npx prisma migrate deploy && npm run build
* Start Command:
  npm run start

Environment Variables:

* DATABASE_URL=... (Supabase hoặc Neon)
* PORT=10000
* JWT_SECRET=your_secret

Code cần có:

* const port = process.env.PORT || 3000;
* app.listen(port);

========================
3. DATABASE (Supabase)
======================

* Tạo project trên Supabase
* Vào: Settings → Database → Connection string

Dùng connection pooling (QUAN TRỌNG)

Format:
postgresql://user:pass@host:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require

Copy vào:

* DATABASE_URL (Render)

========================
4. PRISMA (BACKEND)
===================

schema.prisma:

datasource db {
provider = "postgresql"
url      = env("DATABASE_URL")
}

Chạy migration:

* npx prisma migrate deploy

========================
5. FLOW HOẠT ĐỘNG
=================

git push
↓
Vercel build frontend
Render build backend
↓
Backend connect DB
↓
Frontend gọi API backend

========================
6. LỖI THƯỜNG GẶP
=================

* Backend không connect DB → sai DATABASE_URL
* Prisma lỗi → chưa migrate
* Supabase lỗi connection → chưa dùng pgbouncer
* Frontend gọi API lỗi → sai NEXT_PUBLIC_API_URL
* Render chậm → do free tier sleep

========================
7. KIẾN TRÚC CUỐI
=================

Frontend (Vercel)
↓
Backend (Render)
↓
Database (Supabase)

=> Stack FREE + chạy production được

========================
END
===
