import AuthHero from "@/components/auth/AuthHero";
import AuthRedirect from "@/components/auth/AuthRedirect";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      {/* Client side redirect */}
      <AuthRedirect />

      <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Left Side - Form */}
        <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* Right Side Hero */}
        <AuthHero />
      </div>
    </>
  );
}
