# Production-Ready Cosmetics E-commerce Platform

A production-ready full-stack cosmetics e-commerce platform built with **Next.js**, **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**. The system supports secure authentication, online payments, inventory management, order processing, AI-powered features, and an administrative dashboard.

**Live Demo:** https://ecommerce-shop-cosmetics.vercel.app

---

# 📖 Overview

This project was developed to simulate a real-world B2C e-commerce platform following modern software engineering practices.

The system focuses on:

* Secure authentication & authorization
* ACID-compliant order processing
* FEFO inventory allocation
* Real-time inventory synchronization
* Payment gateway integration
* AI-powered customer experience
* Responsive UI
* Production deployment

---

# Features

## Customer

* User Registration & Login
* Google OAuth Login
* JWT Authentication
* Refresh Token Authentication
* Browse Products
* Product Search
* Product Filtering
* Product Categories
* Product Details
* Shopping Cart
* Wishlist
* Checkout
* Order History
* Review Products
* AI Review Sentiment Analysis
* User Profile Management

---

## Admin

* Dashboard
* Product Management
* Category Management
* Brand Management
* Inventory Management
* Order Management
* Customer Management
* Review Moderation
* Revenue Analytics

---

## Payment

Integrated payment gateways:

* MoMo
* ZaloPay
* SEPay

Features:

* HMAC SHA256 Signature Verification
* Webhook Handling
* Payment Confirmation
* Failed Payment Recovery

---

## Inventory

Production-style inventory implementation:

* FEFO (First Expired First Out)
* Stock Reservation
* Transaction-safe Inventory Update
* Inventory Synchronization
* Automatic Stock Deduction

---

## AI Features

* Gemini AI Integration
* Review Sentiment Analysis

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Ant Design
* React Query
* Axios

---

## Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Google OAuth
* Socket.IO

---

## Database

* PostgreSQL
* Prisma ORM

---

## DevOps

* Docker
* Docker Compose
* GitHub Actions
* Vercel
* Render
* Supabase

---

# Project Structure

```
Ecommerce-Shop-Cosmetics
│
├── Frontend-next/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── ...
│
├── backend-ts/
│   ├── prisma/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   └── ...
│
└── README.md
```

---

#  Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/ecommerce-shop-cosmetics.git

cd ecommerce-shop-cosmetics
```

---

# 🛠 Backend Setup

## 1. Create Environment File

Create a `.env` file inside `backend-ts`.

```env
DATABASE_URL=

PORT=3000

JWT_SECRET=
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start PostgreSQL

```bash
docker compose up -d
```

---

## 4. Run Database Migration

```bash
npx prisma migrate dev
```

---

## 5. Generate Prisma Client

```bash
npx prisma generate
```

---

## 6. Seed Database

```bash
npx prisma db seed
```

---

## 7. Run Backend

```bash
npm run dev
```

Backend runs at:

```
http://localhost:3000
```

---

#  Database Commands

## Create New Migration

```bash
npx prisma migrate dev --name migration_name
```

---

## Reset Database

```bash
npx prisma migrate reset
```

---

## Apply Existing Migrations

```bash
npx prisma migrate deploy
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

# 💻 Frontend Setup

Inside:

```
Frontend-next
```

Install packages

```bash
npm install
```

Create

```
.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Run

```bash
npm run dev
```

Frontend runs at

```
http://localhost:3001
```

---

#  Environment Configuration

## Development

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/devdb

NODE_ENV=development
```

---

## Production

```env
DATABASE_URL=postgresql://user:password@host:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require

NODE_ENV=production
```

---

#  Deployment

## Frontend

Platform:

* Vercel

Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

Deployment Flow

```
Git Push

↓

Vercel Build

↓

Production
```

---

## Backend

Platform:

* Render

Build Command

```bash
npm install && npx prisma migrate deploy && npm run build
```

Start Command

```bash
npm run start
```

Environment Variables

```env
DATABASE_URL=

JWT_SECRET=

PORT=10000
```

---

## Database

Platform:

* Supabase PostgreSQL

Use connection pooling:

```
postgresql://user:password@host:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
```

---

# Deployment Architecture

```
                GitHub
                   │
        ┌──────────┴──────────┐
        │                     │
     Vercel                Render
   (Next.js)           (Express API)
        │                     │
        └──────────┬──────────┘
                   │
             Supabase PostgreSQL
```

---

#  Testing

Run tests

```bash
npm test
```

The project includes unit tests for:

* Business Logic
* API Services
* Frontend Components
* Utility Functions

---

# 📸 Screenshots

You can include screenshots here.

```
Home Page

Product Detail

Checkout

Admin Dashboard

Order Management
```

---

#  Future Improvements

* Recommendation System
* Email Notifications
* Loyalty Program
* Product Recommendation AI
* Elasticsearch
* Redis Cache
* Microservices Architecture
* Kubernetes Deployment

---

#  Author

**Nguyen Quoc Manh**

Software Engineering Student

Interested in:

* Full-stack Development
* Backend Engineering
* Enterprise Software
* AI Integration
* Cloud Deployment

---

#  License

This project is developed for educational purposes and portfolio demonstration.
