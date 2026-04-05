
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
1️⃣ Cấu trúc môi trường

Local / Dev
.env.local
DATABASE_URL="postgresql://postgres:localpassword@localhost:5432/devdb"
NODE_ENV=development
Production (Render / Supabase)
.env.production
DATABASE_URL="postgresql://postgres:<prod-password>@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
NODE_ENV=production
Trên Render, thêm environment variables tương ứng (DATABASE_URL, NODE_ENV).

2️⃣ Prisma config
Với Prisma 7, không dùng directUrl trong schema. Thay vào đó dùng prisma.config.ts.
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx src/scripts/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
Schema Prisma chỉ cần provider:
datasource db {
  provider = "postgresql"
}
generator client {
  provider = "prisma-client-js"
}
3️⃣ Scripts trong package.json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "prisma generate && tsc",
    "postinstall": "prisma generate",
    "migrate:prod": "prisma migrate deploy",
    "seed": "npx tsx src/scripts/seed.ts",
    "start": "node dist/index.js",
    "dev:db": "prisma migrate dev --name init && npm run seed"
  }
}
dev:db → dev local: migrate + seed
migrate:prod → deploy production: apply migration (không seed mặc định)
4️⃣ Seed dữ liệu
src/scripts/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  if (process.env.NODE_ENV === "production") {
    console.log("Production mode: only minimal seed (brands, categories)...");
    await seedProd();
  } else {
    console.log("Development mode: full seed (brands, categories, products)...");
    await seedDev();
  }
}
async function seedProd() {
  await prisma.brand.upsert({ where: { name: "The Ordinary" }, update: {}, create: { name: "The Ordinary" } });
  await prisma.category.upsert({ where: { name: "Skincare" }, update: {}, create: { name: "Skincare" } });
}
async function seedDev() {
  await seedProd();
  await prisma.product.upsert({ where: { name: "Niacinamide Serum" }, update: {}, create: { name: "Niacinamide Serum", price: 15 } });
}
main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
✅ Phân biệt dev vs production:
Dev: full seed, fake data để test.
Production: chỉ seed dữ liệu quan trọng, tránh ghi đè dữ liệu người dùng.
5️⃣ Tự chạy khi deploy
Trên Render / Vercel:
Build phase:
npm install
npm run build
Deploy phase:
npm run migrate:prod
npm run seed # tùy chọn nếu muốn auto seed dữ liệu mặc định
Đảm bảo DATABASE_URL đúng.
Luôn backup Supabase trước khi seed production.
6️⃣ Tại dev local
Chạy DB local (Docker hoặc Postgres local)
Migrate + seed:
npm run dev:db
Chạy server:
npm run dev
7️⃣ Backup dữ liệu Supabase
Supabase → Database → Backups → Export SQL
Lưu SQL + migrate + seed → có thể restore khi cần.
8️⃣ Tips an toàn
Không bao giờ seed production full dữ liệu dev.
Luôn check NODE_ENV trong seed.
Test kết nối DB trước khi seed.
Dùng upsert thay vì create để tránh duplicate / crash.
