import { Doctor } from "@/lib/types";
import React from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  MapPin,
  Star,
  Award,
  HeartHandshake,
  Stethoscope,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

interface DoctorProfileProps {
  doctor: Doctor;
  showRating?: boolean;
}

function DoctorProfile({ doctor, showRating = false }: DoctorProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative rounded-[28px] overflow-hidden border border-white/20 bg-white/70 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        {/* Gradient Header */}
        <div className="h-36 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="relative px-7 pb-8 -mt-20">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative group">
              <Avatar className="w-32 h-32 ring-[6px] ring-white shadow-2xl border-4 border-white transition-transform duration-300 group-hover:scale-105">
                <AvatarImage
                  src={doctor.profileImage}
                  alt={doctor.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-cyan-500 text-white text-4xl font-bold">
                  {doctor.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Online Indicator */}
              <div className="absolute bottom-2 right-2 w-7 h-7 bg-emerald-500 rounded-full ring-4 ring-white flex items-center justify-center shadow">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="text-center mt-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              Dr. {doctor.name}
              {doctor.isVerified && (
                <span className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-600 text-white rounded-full shadow">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </h2>

            <p className="text-base font-semibold text-indigo-600 mt-2 flex items-center justify-center gap-2">
              <Stethoscope className="w-4 h-4" />
              {doctor.specialization}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {doctor.qualification} • {doctor.experience}+ yrs exp
            </p>
          </div>

          {/* Rating */}
          {showRating && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex items-center px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100">
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                <span className="ml-1 text-sm font-semibold text-orange-600">
                  5.0
                </span>
              </div>
              <span className="text-xs text-gray-400">200+ reviews</span>
            </div>
          )}

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {doctor.category?.slice(0, 3).map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-indigo-50 to-cyan-50 text-indigo-600 border border-indigo-100"
              >
                {cat}
              </span>
            ))}
            {doctor.category?.length > 3 && (
              <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-500">
                +{doctor.category.length - 3}
              </span>
            )}
          </div>

          {/* About */}
          <div className="mt-7 p-5 rounded-2xl bg-white/60 backdrop-blur border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-indigo-600" />
              About
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {doctor.about ||
                "Experienced doctor providing modern and personalized care."}
            </p>
          </div>

          {/* Clinic */}
          {doctor.hospitalInfo && (
            <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <p className="text-sm font-semibold text-gray-800">
                {doctor.hospitalInfo.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {doctor.hospitalInfo.address}
              </p>

              <div className="flex items-center gap-1 mt-2 text-emerald-700 text-sm">
                <MapPin className="w-4 h-4" />
                {doctor.hospitalInfo.city}
              </div>
            </div>
          )}

          {/* Fees */}
          <div className="mt-7 p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg flex justify-between items-center">
            <div>
              <p className="text-xs text-green-100">Consultation</p>
              <p className="text-3xl font-bold">₹{doctor.fees}</p>
              <p className="text-xs mt-1 text-green-100">
                {doctor.slotDurationMinutes || 30} min session
              </p>
            </div>

            <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
              <HeartHandshake className="w-6 h-6" />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-indigo-50 text-center">
              <p className="text-xl font-bold text-indigo-600">500+</p>
              <p className="text-xs text-gray-500">Patients</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 text-center">
              <p className="text-xl font-bold text-purple-600">98%</p>
              <p className="text-xs text-gray-500">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DoctorProfile;
