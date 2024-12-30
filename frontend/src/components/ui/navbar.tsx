"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Train Seat Booking</div>
      <Button variant="destructive" onClick={handleLogout}>
        Logout
      </Button>
    </nav>
  );
};
