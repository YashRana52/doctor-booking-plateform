"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userAuthStore } from "@/store/authStore";

export default function AuthRedirect() {
  const { user, loading } = userAuthStore();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (user?.type === "doctor") {
      router.replace("/doctor/dashboard");
    } else {
      setChecking(false);
    }
  }, [user, loading, router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="relative flex items-center justify-center">
          {/* Rotating Ring */}
          <div className="w-24 h-24 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />

          {/* Center Icon */}
          <div className="absolute bg-gradient-to-br from-blue-500 to-cyan-400 p-4 rounded-2xl shadow-xl">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 8h-3V5a3 3 0 10-6 0v3H7a3 3 0 00-3 3v5a3 3 0 003 3h12a3 3 0 003-3v-5a3 3 0 00-3-3zm-7-3a1 1 0 112 0v3h-2V5z" />
            </svg>
          </div>

          {/* Pulse Effect */}
          <span className="absolute w-32 h-32 bg-cyan-400/20 rounded-full animate-ping"></span>
        </div>
      </div>
    );
  }

  return null;
}
