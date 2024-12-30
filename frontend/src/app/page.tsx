import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Train Booking System
      </h1>
      <div className="space-x-4">
        <Link
          href="/auth/login"
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
