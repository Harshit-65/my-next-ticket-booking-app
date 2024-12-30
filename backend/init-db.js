const fs = require("fs");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ticket_booking_db",
  password: "silver9322",
  port: 5432,
});

const schema = fs.readFileSync("../database/schema.sql", { encoding: "utf-8" });

pool.query(schema, (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Tables created successfully");
  }
  pool.end();
});
