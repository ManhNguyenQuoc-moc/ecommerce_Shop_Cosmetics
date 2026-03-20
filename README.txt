
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