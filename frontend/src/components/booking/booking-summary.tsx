"use client";

interface BookingSummaryProps {
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
}

export const BookingSummary = ({
  totalSeats,
  availableSeats,
  bookedSeats,
}: BookingSummaryProps) => {
  return (
    <div className="flex gap-4 justify-center mt-6">
      <div className="bg-green-500 text-white px-4 py-2 rounded">
        Available: {availableSeats}
      </div>
      <div className="bg-yellow-400 text-black px-4 py-2 rounded">
        Booked: {bookedSeats}
      </div>
      <div className="bg-gray-200 text-black px-4 py-2 rounded">
        Total: {totalSeats}
      </div>
    </div>
  );
};
