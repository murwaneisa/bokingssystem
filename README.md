# 📆 Bokningssystem för Mötesrum

A fullstack room booking system built with **Next.js** (frontend & API), **SQLite + Prisma** for the database, and a fully documented Swagger UI.

This app allows users to:
- View available meeting rooms and time slots
- Filter by room and date
- Book available slots
- Confirm bookings
- Manage everything through a REST API

---

## 🔧 Backend Overview

This project uses **Next.js API Routes** as the backend. Each route is defined under:


Prisma is used to manage a local SQLite database (`dev.db`), including migrations, seeding, and querying.

---

## 🛠 Technologies Used

| Tool / Library         | Purpose                          |
|------------------------|----------------------------------|
| **Next.js**            | Fullstack framework (frontend + API) |
| **TypeScript**         | Type safety                      |
| **Prisma**             | ORM for SQLite                   |
| **SQLite**             | Lightweight database             |
| **Swagger UI**         | API documentation                |
| **Jest + Supertest**   | API testing                      |
| **Tailwind CSS**       | Styling frontend (optional)      |

---

## 🚀 Getting Started

### 1. Clone the Project


git clone https://github.com/murwaneisa/bokingssystem.git

cd bokningssystem

### 2. Install Dependence
 npm install


### 3. Setup the Database
 npx prisma migrate dev --name init

### 3. add the environment variables
in the  .env file in the root directory add :
DATABASE_URL="file:./[your database file]" for example "dev.db"
NEXT_PUBLIC_API_URL="http://yourlocalhot/api"  for example http://localhost:3000/api
 
#### seed the database with data 

 npx prisma db seed

#### View the seeded data in Prisma Ui

 npx prisma studio

### 4. Start the Dev Server
 npm run dev

## 📘API Documentation
Swagger UI is available at:


http://localhost:3000/swagger

This includes routes for:

- [`GET /api/rooms`](#)
- [`GET /api/timeslots/filter`](#)
- [`POST /api/bookings`](#)
- [`GET /api/users`](#)

## 🧪 Running Tests
### Tests are located in:
 src/__tests__/
### Run the tests
  npm test
### Run the tests coverage 
  npm run test:coverage
### Or run tests in watch mode:
  npm run test:watch  
