// src/lib/api.ts
import axios from "axios";

const API_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API interfaces
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  username: string;
}

interface Seat {
  id: number;
  seat_number: number;
  row_number: number;
}

interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    bookingId: number;
    seats: {
      row_number: number;
      seat_number: number;
    }[];
  };
}

// API functions
export const apiClient = {
  // Auth endpoints
  auth: {
    login: async (data: LoginData) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    register: async (data: RegisterData) => {
      const response = await api.post("/auth/register", data);
      return response.data;
    },
  },

  // Booking endpoints
  bookings: {
    getAvailableSeats: async () => {
      const response = await api.get("/bookings/seats/available");
      return response.data;
    },
    createBooking: async (numberOfSeats: number): Promise<BookingResponse> => {
      const response = await api.post("/bookings", { numberOfSeats });
      return response.data;
    },
    getUserBookings: async () => {
      const response = await api.get("/bookings/user");
      return response.data;
    },
    cancelBooking: async (bookingId: number) => {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    },
  },
};

export type { LoginData, RegisterData, Seat, BookingResponse };
