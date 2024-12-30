const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ticket_booking_db",
  password: "silver9322",
  port: 5432,
});

module.exports = pool;
