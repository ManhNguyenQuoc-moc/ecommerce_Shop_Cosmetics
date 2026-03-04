
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