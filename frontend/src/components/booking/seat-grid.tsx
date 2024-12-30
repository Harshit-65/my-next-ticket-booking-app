// src/components/booking/seat-grid.tsx
"use client";

import { Button } from "@/components/ui/button";

interface Seat {
  id: number;
  seat_number: number;
  row_number: number;
  is_booked: boolean;
}

interface SeatGridProps {
  seats: Seat[];
}

export const SeatGrid = ({ seats }: SeatGridProps) => {
  const rows = seats.reduce((acc, seat) => {
    if (!acc[seat.row_number]) {
      acc[seat.row_number] = [];
    }
    acc[seat.row_number].push(seat);
    return acc;
  }, {} as Record<number, Seat[]>);

  return (
    <div className="space-y-4">
      {Object.entries(rows).map(([rowNum, rowSeats]) => (
        <div key={rowNum} className="flex gap-2">
          <span className="w-8 flex items-center justify-center font-bold">
            R{rowNum}
          </span>
          <div className="grid grid-cols-7 gap-2">
            {rowSeats.map((seat) => (
              <Button
                key={seat.id}
                variant={seat.is_booked ? "secondary" : "default"}
                className={`w-12 h-12 ${
                  seat.is_booked
                    ? "bg-yellow-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                disabled={seat.is_booked}
              >
                {seat.seat_number}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
