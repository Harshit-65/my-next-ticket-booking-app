# Train ticket Booking System

## Overview

This project is a train ticket booking system built using **Next.js**, **Node.js**, **Express.js**, and **PostgreSQL**. It allows users to register, log in, and book train seats. The system ensures that users can book up to 7 seats at a time, prioritizing booking seats in the same row.

## Screenshots

1. Ticket Booking Page

![alt text](<Screenshot 2024-12-31 101400.png>)

- Tickets booked by the current user (User 1) are highlighted in yellow.
- Available (unbooked) tickets are displayed in green.
- Tickets booked by other users (e.g., User 2, User 3) are shown in pink to User 1.

## Features

- User registration and login
- JWT-based authentication
- Book up to 7 seats at a time
- Seat allocation prioritizes same-row booking
- View and cancel bookings
- Responsive design

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL

---

## Setup Instructions

### Prerequisites

- Node.js
- PostgreSQL

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Create an `.env` file in the backend directory and add the following details:
   ```
   JWT_SECRET=silver9322
   PORT=3001
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up the database connection:  
   Open `config/db.js` and configure PostgreSQL with the following:

   ```javascript
   const { Pool } = require("pg");
   require("dotenv").config();

   const pool = new Pool({
     user: "postgres", // Replace with your PostgreSQL username
     host: "localhost", // Replace with your host if different
     database: "ticket_booking_db", // Database name
     password: "silver9322", // Replace with your PostgreSQL password
     port: 5432, // Default PostgreSQL port
   });

   module.exports = pool;
   ```

5. Initialize the database:
   - Ensure PostgreSQL is running.
   - Create a database named `ticket_booking_db`.
   - Run the database initialization script:
     ```
     node init-db.js //to create the tables as per schema
     node scripts/initializeSeats.js
     ```
6. Start the backend server:
   ```
   node server.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm run dev
   ```
   # OR
   ```
   npm run build
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

### **Authentication**

- **Register**:  
  `POST /api/auth/register`

- **Login**:  
  `POST /api/auth/login`

### **Bookings**

- **Create Booking**:  
  `POST /api/bookings`

- **Get Available Seats**:  
  `GET /api/bookings/seats/available`

- **Get User Bookings**:  
  `GET /api/bookings/user`

- **Get Booked Seats**:
  `GET /api/bookings/seats/booked`
- **Cancel Booking**:  
  `DELETE /api/bookings/:id`

---

## Testing with Postman

### 1. Register a New User

- **Method**: `POST`
- **URL**: `http://localhost:3001/api/auth/register`
- **Body**:
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```

### 2. Login

- **Method**: `POST`
- **URL**: `http://localhost:3001/api/auth/login`
- **Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

### 3. Create Booking

- **Method**: `POST`
- **URL**: `http://localhost:3001/api/bookings`
- **Headers**:
  ```
  Authorization: Bearer your_token_here
  ```
- **Body**:
  ```json
  {
    "numberOfSeats": 3
  }
  ```

### 4. Get Available Seats

- **Method**: `GET`
- **URL**: `http://localhost:3001/api/bookings/seats/available`
- **Headers**:
  ```
  Authorization: Bearer your_token_here
  ```

### 5. Cancel Booking

- **Method**: `DELETE`
- **URL**: `http://localhost:3001/api/bookings/:id`
- **Headers**:
  ```
  Authorization: Bearer your_token_here
  ```

### 6. Get Booked Seats

- **Method**: `GET`
- **URL**: `http://localhost:3001/api/bookings/seats/booked`
- **Headers**:
  ```
  Authorization: Bearer your_token_here
  ```

---

## Notes

- Ensure PostgreSQL is running and the database is set up correctly.
- Use the JWT token from the login response for authenticated requests.
- The backend server runs on port `3001`, and the frontend on port `3000`.
