CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seats table
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    seat_number INTEGER NOT NULL,
    row_number INTEGER NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    UNIQUE(seat_number, row_number)  
);


-- Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    CONSTRAINT valid_status CHECK (status IN ('active', 'cancelled'))
);

-- Booking details table
CREATE TABLE booking_details (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    seat_id INTEGER REFERENCES seats(id),
    UNIQUE(booking_id, seat_id)
);