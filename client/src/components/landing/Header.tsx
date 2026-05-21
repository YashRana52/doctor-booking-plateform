"use client";

import { Bell, Calendar, HeartPulse, Shield, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { userAuthStore } from "@/store/authStore";

interface HeaderProps {
  showDashBoardNav?: boolean;
}

interface NavigationItem {
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  active: boolean;
}

const Header: React.FC<HeaderProps> = ({ showDashBoardNav = false }) => {
  const { user, isAuthenticated } = userAuthStore();

  const pathname = usePathname();
  const router = useRouter();

  const getDashboardNavigation = (): NavigationItem[] => {
    if (!user || !showDashBoardNav) return [];

    if (user.type === "patient") {
      return [
        {
          label: "Appointments",
          icon: Calendar,
          href: "/patient/dashboard",
          active: pathname?.includes("/patient/dashboard") || false,
        },
      ];
    } else if (user.type === "doctor") {
      return [
        {
          label: "Dashboard",
          icon: Calendar,
          href: "/doctor/dashboard",
          active: pathname?.includes("/doctor/dashboard") || false,
        },
        {
          label: "Appointments",
          icon: Calendar,
          href: "/doctor/appointments",
          active: pathname?.includes("/doctor/appointments") || false,
        },
      ];
    }
    return [];
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 ">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-[1.35rem] bg-slate-950 p-[2px] shadow-xl shadow-cyan-500/20">
            <div className="absolute inset-0 rounded-[1.35rem] bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 opacity-90 blur-[2px]" />

            <div className="relative h-full w-full rounded-[1.2rem] bg-slate-950 flex items-center justify-center overflow-hidden">
              <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-cyan-400/30 blur-xl" />
              <div className="absolute -bottom-4 -left-4 h-8 w-8 rounded-full bg-emerald-400/30 blur-xl" />

              <div className="relative flex items-center justify-center rotate-[-18deg]">
                <div className="h-7 w-4 rounded-full bg-gradient-to-b from-cyan-300 to-emerald-400" />
                <div className="absolute h-1.5 w-7 rounded-full bg-white" />
                <div className="absolute h-7 w-1.5 rounded-full bg-white" />
              </div>
            </div>
          </div>

          <div className="leading-none">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Medi
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                Care
              </span>
            </h1>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
              Smart Health
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        {isAuthenticated && showDashBoardNav && (
          <nav className="hidden md:flex items-center space-x-6">
            {getDashboardNavigation().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
                  item.active
                    ? "text-blue-600 font-semibold bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 hover:bg-red-600">
                  3
                </Badge>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-3 px-2 py-1 hover:bg-gray-100 rounded-md transition"
                  >
                    <Avatar className="w-9 h-9">
                      {user.profileImage ? (
                        <AvatarImage src={user.profileImage} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="hidden md:flex flex-col text-left">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.type}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-60 bg-white border border-gray-200 shadow-lg rounded-lg p-2"
                >
                  <DropdownMenuLabel className="p-2 cursor-default">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-11 h-11">
                        {user.profileImage ? (
                          <AvatarImage
                            src={user.profileImage}
                            alt={user.name}
                          />
                        ) : (
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {user?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col text-sm">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-gray-500 capitalize">
                          {user.type}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {user.type === "admin" ? (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center space-x-2 hover:bg-gray-100 rounded-md p-2 transition"
                      >
                        <User className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${user.type}/profile`}
                        className="flex items-center space-x-2 hover:bg-gray-100 rounded-md p-2 transition"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onSelect={() => {
                      userAuthStore.getState().logout();
                      router.push("/"); // redirect to home
                    }}
                    className="flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 rounded-md p-2 cursor-pointer transition"
                  >
                    <User className="w-4 h-4 text-red-500" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Login / Signup buttons only if not authenticated */}
              <Link href="/login/patient">
                <Button
                  className="text-blue-900 font-medium hover:text-blue-700"
                  variant="ghost"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button
                  className="text-gray-600 font-medium hover:text-gray-800 flex items-center"
                  variant="ghost"
                >
                  <Shield className="w-4 h-4 mr-1 text-gray-500" />
                  Admin
                </Button>
              </Link>
              <Link href="/signup/patient" className="hidden md:block">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 font-medium hover:from-blue-800 rounded-full text-white"
                  variant="ghost"
                >
                  Book Consultation
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
