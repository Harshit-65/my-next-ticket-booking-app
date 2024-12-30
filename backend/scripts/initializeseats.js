const pool = require("../config/db");

async function initializeSeats() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // First, delete existing seats
    await client.query("DELETE FROM seats");

    // Create 80 seats (11 rows, with 7 seats each except last row with 3)
    for (let row = 1; row <= 12; row++) {
      const seatsInRow = row === 11 ? 3 : 7; // Last row has 3 seats, others have 7
      for (let seat = 1; seat <= seatsInRow; seat++) {
        await client.query(
          "INSERT INTO seats (row_number, seat_number, is_booked) VALUES ($1, $2, $3)",
          [row, seat, false]
        );
      }
    }

    await client.query("COMMIT");
    console.log("Seats initialized successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error initializing seats:", error);
  } finally {
    client.release();
  }
}

// Execute the function
initializeSeats()
  .then(() => {
    console.log("Initialization complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to initialize seats:", err);
    process.exit(1);
  });
