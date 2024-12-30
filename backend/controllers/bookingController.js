const pool = require("../config/db");
const bookingModel = require("../models/booking");

const bookingController = {
  createBooking: async (req, res) => {
    const client = await pool.connect();
    try {
      const { numberOfSeats } = req.body;
      const userId = req.userId;

      // Validate number of seats
      if (!numberOfSeats || numberOfSeats <= 0 || numberOfSeats > 7) {
        return res.status(400).json({
          message: "Please select between 1 and 7 seats",
        });
      }

      await client.query("BEGIN");

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

      const singleRowSeats = await client.query(singleRowQuery, [
        numberOfSeats,
      ]);

      let selectedSeats;
      if (singleRowSeats.rows.length > 0) {
        // Found enough seats in a single row
        selectedSeats = singleRowSeats.rows[0].seat_ids.slice(0, numberOfSeats);
      } else {
        // If no single row has enough seats, find nearest available seats
        const nearestSeatsQuery = `
                    SELECT id, row_number, seat_number
                    FROM seats
                    WHERE NOT is_booked
                    ORDER BY row_number, seat_number
                    LIMIT $1
                `;
        const availableSeats = await client.query(nearestSeatsQuery, [
          numberOfSeats,
        ]);

        if (availableSeats.rows.length < numberOfSeats) {
          throw new Error("Not enough seats available");
        }

        selectedSeats = availableSeats.rows.map((seat) => seat.id);
      }

      const bookingResult = await client.query(
        "INSERT INTO bookings (user_id) VALUES ($1) RETURNING id",
        [userId]
      );
      const bookingId = bookingResult.rows[0].id;

      for (const seatId of selectedSeats) {
        await client.query(
          "INSERT INTO booking_details (booking_id, seat_id) VALUES ($1, $2)",
          [bookingId, seatId]
        );
        await client.query("UPDATE seats SET is_booked = true WHERE id = $1", [
          seatId,
        ]);
      }

      const bookedSeatsQuery = `
                SELECT s.row_number, s.seat_number
                FROM seats s
                WHERE s.id = ANY($1)
                ORDER BY s.row_number, s.seat_number
            `;
      const bookedSeats = await client.query(bookedSeatsQuery, [selectedSeats]);

      await client.query("COMMIT");

      res.status(201).json({
        success: true,
        message: "Booking successful",
        data: {
          bookingId: bookingId,
          seats: bookedSeats.rows,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Booking error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Error processing booking",
      });
    } finally {
      client.release();
    }
  },

  getAvailableSeats: async (req, res) => {
    try {
      const query = `
            SELECT id, row_number, seat_number, is_booked
            FROM seats
            ORDER BY row_number, seat_number;
        `;

      const result = await pool.query(query);

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("Error getting available seats:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving available seats",
      });
    }
  },

  getUserBookings: async (req, res) => {
    try {
      const userId = req.userId;
      const query = `
                SELECT b.id, b.booking_time, b.status,
                    json_agg(
                        json_build_object(
                            'seat_number', s.seat_number,
                            'row_number', s.row_number
                        )
                    ) as seats
                FROM bookings b
                JOIN booking_details bd ON b.id = bd.booking_id
                JOIN seats s ON bd.seat_id = s.id
                WHERE b.user_id = $1 AND b.status = 'active'
                GROUP BY b.id, b.booking_time, b.status
                ORDER BY b.booking_time DESC
            `;

      const bookings = await pool.query(query, [userId]);
      res.json({
        success: true,
        data: bookings.rows,
      });
    } catch (error) {
      console.error("Error retrieving user bookings:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving bookings",
      });
    }
  },

  getAllBookedSeats: async (req, res) => {
    try {
      const query = `
        SELECT DISTINCT s.seat_number
        FROM seats s
        JOIN booking_details bd ON s.id = bd.seat_id
        JOIN bookings b ON bd.booking_id = b.id
        WHERE b.status = 'active' AND s.is_booked = true
        ORDER BY s.seat_number;
      `;

      const result = await pool.query(query);
      const bookedSeats = result.rows.map((row) => row.seat_number);

      res.json({
        success: true,
        data: bookedSeats,
      });
    } catch (error) {
      console.error("Error getting booked seats:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving booked seats",
      });
    }
  },

  cancelBooking: async (req, res) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const userId = req.userId;

      await client.query("BEGIN");

      const bookingCheck = await client.query(
        "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
        [id, userId]
      );

      if (bookingCheck.rows.length === 0) {
        throw new Error("Booking not found or unauthorized");
      }

      // Get seats to free up
      const seatsToUpdate = await client.query(
        "SELECT seat_id FROM booking_details WHERE booking_id = $1",
        [id]
      );

      // Free up seats
      for (const row of seatsToUpdate.rows) {
        await client.query("UPDATE seats SET is_booked = false WHERE id = $1", [
          row.seat_id,
        ]);
      }

      // Delete booking details first (due to foreign key constraint)
      await client.query("DELETE FROM booking_details WHERE booking_id = $1", [
        id,
      ]);

      // Delete the booking
      // await client.query("DELETE FROM bookings WHERE id = $1", [id]);
      await client.query(
        "UPDATE bookings SET status = 'cancelled' WHERE id = $1",
        [id]
      );

      await client.query("COMMIT");

      res.json({
        success: true,
        message: "Booking cancelled and deleted successfully",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error cancelling booking:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } finally {
      client.release();
    }
  },
};

module.exports = bookingController;
