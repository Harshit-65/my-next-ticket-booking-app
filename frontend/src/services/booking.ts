import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const bookingService = {
  async getAvailableSeats() {
    const response = await axios.get(`${API_URL}/bookings/seats/available`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },

  async bookSeats(numberOfSeats: number) {
    const response = await axios.post(
      `${API_URL}/bookings`,
      { numberOfSeats },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  },

  async getUserBookings() {
    const response = await axios.get(`${API_URL}/bookings/user`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },

  async cancelBooking(bookingId: number) {
    const response = await axios.delete(`${API_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },

  async getAllBookedSeats() {
    const response = await axios.get(`${API_URL}/bookings/seats/booked`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },
};
