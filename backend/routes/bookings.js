const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Create a new booking
router.post("/", bookingController.createBooking);

// Get available seats
router.get("/seats/available", bookingController.getAvailableSeats); // Add this new route

// Get bookings for a user
router.get("/user", bookingController.getUserBookings);

// Cancel a booking
router.delete("/:id", bookingController.cancelBooking);

module.exports = router;
