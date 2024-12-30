# Train Booking System

## Overview

This project is a train booking system built using **Next.js**, **Node.js**, **Express.js**, and **PostgreSQL**. It allows users to register, log in, and book train seats. The system ensures that users can book up to 7 seats at a time, prioritizing booking seats in the same row.

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

2. Install dependencies:
   ```
   npm install
   ```
3. Set up the database:
   - Ensure PostgreSQL is running.
   - Create a database named `ticket_booking_db`.
   - Run the database initialization script:
     ```
     node scripts/initializeSeats.js
     ```
4. Start the backend server:
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

---

## Notes

- Ensure PostgreSQL is running and the database is set up correctly.
- Use the JWT token from the login response for authenticated requests.
- The backend server runs on port `3001`, and the frontend on port `3000`.
