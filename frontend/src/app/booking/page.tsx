"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { AuthGuard } from "@/components/auth/auth-guard";
// import { BookingLayout } from "@/components/booking/booking-layout";
// import { SeatGrid } from "@/components/booking/seat-grid";
// import { BookingSummary } from "@/components/booking/booking-summary";
import { BookingForm } from "@/components/booking/booking-form";
import { useBooking } from "@/hooks/use-booking";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Booking } from "@/types/booking";

export default function BookingPage() {
  const {
    userBookings,
    allBookedSeats,
    loading,
    loadAvailableSeats,
    loadUserBookings,
    loadAllBookedSeats,
    bookSeats,
    cancelBooking,
  } = useBooking();

  useEffect(() => {
    loadAvailableSeats();
    loadUserBookings();
    loadAllBookedSeats();
  }, [loadAvailableSeats, loadUserBookings, loadAllBookedSeats]);

  const handleBooking = async (numberOfSeats: number) => {
    try {
      await bookSeats(numberOfSeats);
      toast.success("Booking successful! Your seats have been reserved.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("failed to book tickets.");
      }
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Fail to cancel booking.");
      }
    }
  };

  const totalSeats = 80;
  const totalBookedSeats = allBookedSeats.length;
  const availableSeats = totalSeats - totalBookedSeats;

  return (
    <AuthGuard>
      <Navbar /> {/*  Navbar here */}
      {/* <BookingLayout title="Train Seat Booking"> */}
      <div className="h-[calc(100vh-120px)] overflow-hidden flex gap-6 p-4 w-full">
        {/* Left Column - Seats Grid */}
        <div className="w-2/3 flex flex-col">
          <div className="bg-white p-4 rounded-lg shadow h-full overflow-auto">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 80 }, (_, i) => {
                const seatId = i + 1;
                const isBooked = allBookedSeats.includes(seatId);
                const isUserBooked = userBookings.some((booking: Booking) =>
                  booking.seats.some(
                    (seat: { seat_number: number }) =>
                      seat.seat_number === seatId
                  )
                );

                return (
                  <Button
                    key={seatId}
                    variant="secondary"
                    className={`h-10 ${
                      isUserBooked
                        ? "bg-yellow-400"
                        : isBooked
                        ? "bg-red-400"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={isBooked}
                  >
                    {seatId}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Form, User Bookings, and Seat Summary */}
        <div className="w-1/3 flex flex-col gap-4">
          {/* Booking Form */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Book Seats
            </h3>
            <BookingForm onSubmit={handleBooking} isLoading={loading} />
          </div>

          {/* Seat Summary */}
          <div className="bg-white p-4 rounded-lg shadow flex justify-between text-sm">
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded">
              Available: {availableSeats}
            </span>
            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded">
              Booked: {totalBookedSeats}
            </span>
            <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded">
              Total: {totalSeats}
            </span>
          </div>

          {/* User Bookings - Scrollable */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Your Bookings
            </h3>
            <div
              className="overflow-y-auto flex-1 space-y-4"
              style={{ maxHeight: "200px" }}
            >
              {userBookings.length === 0 ? (
                <p className="text-gray-500 text-center">
                  You have no active bookings
                </p>
              ) : (
                userBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-gray-50 p-4 rounded border"
                  >
                    <p className="font-medium text-black">
                      Seats:{" "}
                      {booking.seats
                        .map(
                          (seat: { seat_number: number; row_number: number }) =>
                            seat.seat_number
                        )
                        .join(", ")}
                    </p>

                    <p className="text-sm text-gray-600">
                      Booked on:{" "}
                      {new Date(booking.booking_time).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Status: {booking.status}
                    </p>
                    {booking.status === "active" && (
                      <Button
                        variant="destructive"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={loading}
                        className="w-full mt-2"
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {/* </BookingLayout> */}
    </AuthGuard>
  );
}
