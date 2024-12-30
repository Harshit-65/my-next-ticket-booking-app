// src/lib/utils.ts
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateNumberOfSeats(number: number) {
  if (isNaN(number) || number < 1 || number > 7) {
    throw new Error("Please select between 1 and 7 seats");
  }
  return true;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSeatLabel(row: number, seat: number) {
  return `R${row}-S${seat}`;
}
