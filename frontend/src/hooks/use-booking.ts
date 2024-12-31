import { create } from "zustand";
import { bookingService } from "@/services/booking";
import { Seat, Booking } from "@/types/booking";

interface BookingState {
  availableSeats: Seat[];
  userBookings: Booking[];
  allBookedSeats: number[];
  loading: boolean;
  totalSeats: number;
  bookedSeats: number;
  loadAllBookedSeats: () => Promise<void>;
  loadAvailableSeats: () => Promise<void>;
  loadUserBookings: () => Promise<void>;
  bookSeats: (numberOfSeats: number) => Promise<void>;
  cancelBooking: (bookingId: number) => Promise<void>;
}

export const useBooking = create<BookingState>((set, get) => ({
  availableSeats: [],
  userBookings: [],
  allBookedSeats: [],
  loading: false,
  totalSeats: 80,
  bookedSeats: 0,

  loadAvailableSeats: async () => {
    set({ loading: true });
    try {
      const { data } = await bookingService.getAvailableSeats();
      set({ availableSeats: data });

      // Calculating the booked seats
      const bookedSeats = get().userBookings.reduce((total, booking) => {
        return total + booking.seats.length;
      }, 0);
      set({ bookedSeats });
    } finally {
      set({ loading: false });
    }
  },
  loadAllBookedSeats: async () => {
    try {
      const { data } = await bookingService.getAllBookedSeats();
      // Assuming data is an array of seat iDs that are booked
      set({ allBookedSeats: data });
    } catch (error) {
      console.error("Error loading all booked seats:", error);
    }
  },

  loadUserBookings: async () => {
    set({ loading: true });
    try {
      const { data } = await bookingService.getUserBookings();
      set({ userBookings: data });
    } finally {
      set({ loading: false });
    }
  },

  bookSeats: async (numberOfSeats) => {
    await bookingService.bookSeats(numberOfSeats);
    await get().loadAvailableSeats();
    await get().loadUserBookings();
    await get().loadAllBookedSeats();
  },

  cancelBooking: async (bookingId) => {
    await bookingService.cancelBooking(bookingId);
    await get().loadAvailableSeats();
    await get().loadUserBookings();
    await get().loadAllBookedSeats();
  },
}));
