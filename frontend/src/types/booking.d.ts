export interface Seat {
  id: number;
  seat_number: number;
  row_number: number;
  is_booked: boolean;
}

export interface Booking {
  id: number;
  seats: Array<{
    seat_number: number;
    row_number: number;
  }>;
  booking_time: string;
  status: string;
}
