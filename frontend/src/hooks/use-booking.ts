import { create } from "zustand";
import { bookingService } from "@/services/booking";

interface BookingState {
  availableSeats: any[];
  userBookings: any[];
  loading: boolean;
  totalSeats: number;
  bookedSeats: number;
  loadAvailableSeats: () => Promise<void>;
  loadUserBookings: () => Promise<void>;
  bookSeats: (numberOfSeats: number) => Promise<void>;
  cancelBooking: (bookingId: number) => Promise<void>;
}

export const useBooking = create<BookingState>((set, get) => ({
  availableSeats: [],
  userBookings: [],
  loading: false,
  totalSeats: 80, // Total number of seats
  bookedSeats: 0, // Initial booked seats

  loadAvailableSeats: async () => {
    set({ loading: true });
    try {
      const { data } = await bookingService.getAvailableSeats();
      set({ availableSeats: data });

      // Calculate the booked seats
      const bookedSeats = get().userBookings.reduce((total, booking) => {
        return total + booking.seats.length;
      }, 0);
      set({ bookedSeats });
    } finally {
      set({ loading: false });
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
  },

  cancelBooking: async (bookingId) => {
    await bookingService.cancelBooking(bookingId);
    await get().loadAvailableSeats();
    await get().loadUserBookings();
  },
}));
