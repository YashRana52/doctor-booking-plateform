import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 px-5">
      <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-gray-900 mb-6">
        404
      </h1>
      <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-6 text-center">
        Oops! The page you are looking for doesn’t exist.
      </p>
      <Link href="/">
        <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-lg sm:text-xl font-semibold rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}
