"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { healthcareCategories } from "@/lib/constant";
import { useRouter } from "next/navigation";
import { userAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Stethoscope,
  Video,
  Sparkles,
  Clock,
  Shield,
} from "lucide-react";

function LandingHero() {
  const { isAuthenticated, user } = userAuthStore();
  const router = useRouter();

  const handleBookNow = () => {
    router.push(isAuthenticated ? "/doctor-list" : "/signup/patient");
  };

  const handleCategory = (title: string) => {
    router.push(
      isAuthenticated
        ? `/doctor-list?category=${encodeURIComponent(title)}`
        : "/signup/patient",
    );
  };

  return (
    <section className="relative flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(at_50%_30%,rgba(59,130,246,0.08),transparent_50%)]" />
      <motion.div
        animate={{ x: [0, 25, 0], y: [0, -15, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute top-10 left-4  md:left-10 lg:left-20 pointer-events-none w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-blue-200/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 25, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 20, repeat: Infinity, delay: 6 }}
        className="absolute bottom-10 right-4 md:right-10 lg:right-20 pointer-events-none w-64 h-64 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] bg-teal-200/30 rounded-full blur-3xl"
      />

      {/* Main Hero Container */}
      <div className="container mx-auto px-5 sm:px-6 lg:px-12 pt-16 pb-20 md:pt-24 md:pb-28 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center max-w-screen-2xl mx-auto">
          {/* Left Content */}
          <div
            className="lg:col-span-7 space-y-6 md:space-y-8 lg:space-y-10 
flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-md border border-white/80 shadow-sm px-5 py-2.5 rounded-2xl text-sm font-semibold text-blue-700 w-fit"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <Sparkles className="w-4 h-4" />
              50,000+ patients trust us
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-gray-900 leading-[1.05]"
            >
              Top doctors,
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                instantly online
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-600 
  max-w-md md:max-w-lg lg:max-w-xl mx-auto lg:mx-0"
            >
              Video consultation in minutes • Verified specialists • Instant
              prescription
            </motion.p>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-x-6 gap-y-3 text-sm md:text-base text-gray-600"
            >
              {[
                { icon: Video, text: "Instant Video Call" },
                { icon: Clock, text: "Avg. wait: 2 mins" },
                { icon: Shield, text: "Secure & Private" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <item.icon className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row lg:flex-row gap-4 pt-4 
  justify-center lg:justify-start items-center"
            >
              <Button
                onClick={handleBookNow}
                size="lg"
                className="h-14 sm:h-16 px-8 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group w-full sm:w-auto lg:w-auto"
              >
                Book Video Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              {!isAuthenticated && (
                <Link
                  href="/login/doctor"
                  className="w-full sm:w-auto lg:w-auto"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 sm:h-16 px-8 text-base sm:text-lg font-medium border-2 border-gray-800 hover:bg-gray-900 hover:text-white rounded-2xl transition-all w-full"
                  >
                    <Stethoscope className="w-5 h-5 mr-3" />
                    Doctor Login
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center pt-8 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[460px]"
            >
              {/* Main Consultation Card */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative">
                {/* Top Gradient Bar */}
                <div className="h-2 bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-500" />

                <div className="p-6 sm:p-8">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-5 mb-8">
                    {/* Doctor Avatar with Online Status */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl overflow-hidden ring-4 ring-white shadow-md">
                        {/* Placeholder for doctor image - replace with actual img if needed */}
                        <div className="w-full h-full bg-[radial-gradient(circle_at_30%_30%,#60a5fa_10%,#14b8a6_80%)] flex items-center justify-center">
                          <span className="text-3xl sm:text-4xl">👨‍⚕️</span>
                        </div>
                      </div>
                      {/* Online Indicator */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center ring-2 ring-white">
                        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                      </div>
                    </div>

                    {/* Doctor Details */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-lg sm:text-xl text-gray-900">
                        Dr. Ritik Gupta
                      </div>
                      <div className="text-teal-600 text-sm sm:text-base">
                        Cardiologist &amp; Internal Medicine
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-500">
                        <span>⭐ 4.98</span>
                        <span className="text-gray-300">•</span>
                        <span>12+ years</span>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Available Now
                      </div>
                    </div>
                  </div>

                  {/* Consultation Preview */}
                  <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                      Next Available
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-2xl font-semibold text-gray-900">
                          Today
                        </div>
                        <div className="text-sm text-gray-600">
                          in 8 minutes
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-teal-600">
                          ₹499
                        </div>
                        <div className="text-xs text-gray-500">15 min call</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full h-14 sm:h-16 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-base sm:text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.985]">
                    Start Video Consultation
                  </Button>
                </div>
              </div>

              {/* Floating Trust Badge */}
              <motion.div
                animate={{
                  rotate: [-8, 8, -8],
                  y: [0, -5, 0],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-6 -right-4 sm:-right-6 bg-white shadow-xl px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 border border-teal-100"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>98% Success Rate</span>
              </motion.div>

              {/* Small floating "Live" indicator */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-3 left-8 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                LIVE
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Specialties Section */}
      <div className="bg-white py-12 md:py-16 border-t border-b">
        <div className="container mx-auto px-5 sm:px-6 lg:px-12">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Consult specialists instantly
            </h2>
            <p className="text-gray-600 mt-3 text-base md:text-lg">
              30+ categories • Verified doctors
            </p>
          </div>

          <div className="overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-6 -mx-2 snap-x snap-mandatory">
            <div className="inline-flex gap-6 md:gap-8 lg:gap-10 px-2 lg:px-0">
              {healthcareCategories.map((cat, index) => (
                <motion.button
                  key={cat.id}
                  onClick={() => handleCategory(cat.title)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.4) }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.07, y: -6 }}
                  whileTap={{ scale: 0.96 }}
                  className="group flex-shrink-0 flex flex-col items-center text-center w-24 sm:w-28 snap-center cursor-pointer"
                >
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 ${cat.color} rounded-3xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                  >
                    <svg
                      className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={cat.icon} />
                    </svg>
                  </div>
                  <span className="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-blue-600 transition-colors leading-tight px-1">
                    {cat.title}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="py-8 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-5 sm:px-6 lg:px-12">
          <div className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 lg:gap-x-16 gap-y-4 text-xs sm:text-sm font-medium text-gray-500">
            {[
              "50,000+ Patients",
              "500+ Doctors",
              "24×7 Support",
              "Instant Rx",
              "100% Private",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingHero;
