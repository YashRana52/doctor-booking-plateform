"use client";

import { motion } from "framer-motion";
import { Shield, Clock, Users, Zap } from "lucide-react";

export default function AuthHero() {
  return (
    <div className="hidden lg:flex w-1/2 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 opacity-80" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl" />
      </div>

      {/* Floating Orbs */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-20 left-20 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-16 text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 max-w-2xl"
        >
          <h2 className="text-6xl font-extrabold">
            MediCare <br /> That Cares
          </h2>

          <p className="text-xl text-gray-200">
            Connect with verified doctors instantly.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-12">
            {[
              { icon: Shield, title: "Secure" },
              { icon: Clock, title: "24/7" },
              { icon: Users, title: "10K+ Patients" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <item.icon className="w-10 h-10 mx-auto mb-3" />
                <p>{item.title}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 mt-8">
            {["Verified Doctors", "Encrypted Data", "Instant Booking"].map(
              (text, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">{text}</span>
                </div>
              ),
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
