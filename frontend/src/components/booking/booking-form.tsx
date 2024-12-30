import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateNumberOfSeats } from "@/lib/utils";

interface BookingFormProps {
  onSubmit: (numberOfSeats: number) => Promise<void>;
  isLoading: boolean;
}

export const BookingForm = ({ onSubmit, isLoading }: BookingFormProps) => {
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      validateNumberOfSeats(numberOfSeats);
      await onSubmit(numberOfSeats);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumberOfSeats(value ? parseInt(value) : 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Number of Seats (1-7)
        </label>
        <Input
          type="number"
          min={1}
          max={7}
          value={numberOfSeats}
          onChange={handleInputChange}
          className="mt-1"
          required
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full font-normal text-black bg-green-500"
      >
        {isLoading ? "Booking..." : "Book Seats"}
      </Button>
    </form>
  );
};
