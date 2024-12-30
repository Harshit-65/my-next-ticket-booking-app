// models/booking.js
const pool = require("../config/db");

const bookingModel = {
  create: async (userId, seatIds, client) => {
    const bookingQuery = `
            INSERT INTO bookings (user_id)
            VALUES ($1)
            RETURNING id
        `;
    const booking = await client.query(bookingQuery, [userId]);
    const bookingId = booking.rows[0].id;

    // Insert booking details
    for (const seatId of seatIds) {
      await client.query(
        `INSERT INTO booking_details (booking_id, seat_id)
                 VALUES ($1, $2)`,
        [bookingId, seatId]
      );

      // Update seat status
      await client.query(
        `UPDATE seats SET is_booked = true
                 WHERE id = $1`,
        [seatId]
      );
    }

    return bookingId;
  },

  getUserBookings: async (userId) => {
    const query = `
            SELECT b.id, b.booking_time, b.status,
                   json_agg(json_build_object(
                       'seat_id', s.id,
                       'seat_number', s.seat_number,
                       'row_number', s.row_number
                   )) as seats
            FROM bookings b
            JOIN booking_details bd ON b.id = bd.booking_id
            JOIN seats s ON bd.seat_id = s.id
            WHERE b.user_id = $1
            GROUP BY b.id, b.booking_time, b.status
            ORDER BY b.booking_time DESC
        `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  cancel: async (bookingId, client) => {
    // Update booking status
    await client.query(
      `UPDATE bookings SET status = 'cancelled'
             WHERE id = $1`,
      [bookingId]
    );

    // Get seats associated with this booking
    const seatsResult = await client.query(
      `SELECT seat_id FROM booking_details
             WHERE booking_id = $1`,
      [bookingId]
    );

    // Free up the seats
    for (const row of seatsResult.rows) {
      await client.query(
        `UPDATE seats SET is_booked = false
                 WHERE id = $1`,
        [row.seat_id]
      );
    }
  },

  getAvailableSeats: async () => {
    const query = `
        SELECT row_number, 
               COUNT(CASE WHEN NOT is_booked THEN 1 END) as available_seats,
               array_agg(CASE WHEN NOT is_booked 
                        THEN json_build_object('id', id, 'seat_number', seat_number)
                        END) FILTER (WHERE NOT is_booked) as seats
        FROM seats
        GROUP BY row_number
        ORDER BY row_number;
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  findBestAvailableSeats: async (client, numberOfSeats) => {
    // First try to find seats in a single row
    const singleRowQuery = `
        SELECT row_number, array_agg(id) as seat_ids
        FROM (
            SELECT id, row_number, seat_number
            FROM seats
            WHERE NOT is_booked
            ORDER BY row_number, seat_number
        ) s
        GROUP BY row_number
        HAVING count(*) >= $1
        ORDER BY row_number
        LIMIT 1
    `;

    const singleRowResult = await client.query(singleRowQuery, [numberOfSeats]);

    if (singleRowResult.rows.length > 0) {
      return singleRowResult.rows[0].seat_ids.slice(0, numberOfSeats);
    }

    // If no single row available, get nearest available seats
    const nearestSeatsQuery = `
        SELECT id
        FROM seats
        WHERE NOT is_booked
        ORDER BY row_number, seat_number
        LIMIT $1
    `;

    const nearestSeatsResult = await client.query(nearestSeatsQuery, [
      numberOfSeats,
    ]);
    if (nearestSeatsResult.rows.length < numberOfSeats) {
      throw new Error("Not enough seats available");
    }

    return nearestSeatsResult.rows.map((row) => row.id);
  },
};

module.exports = bookingModel;
