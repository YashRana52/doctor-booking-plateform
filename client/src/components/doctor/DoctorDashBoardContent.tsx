"use client";

import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import { useSearchParams } from "next/navigation";
import { userAuthStore } from "@/store/authStore";
import { useDoctorStore } from "@/store/doctorStore";
import { useAppointmentStore } from "@/store/appointmentStore";
import {
  Activity,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  IndianRupee,
  MapPin,
  Phone,
  Plus,
  Star,
  TrendingUp,
  User,
  Users,
  Video,
} from "lucide-react";
import PrescriptionModel from "./PrescriptionModel";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { getStatusColor } from "@/lib/constant";
import { motion } from "framer-motion";

export default function DoctorDashboardContent() {
  const searchParams = useSearchParams();
  const { user, loading } = userAuthStore();
  const { dashboard: dashboardData, fetchDashboard } = useDoctorStore();
  const { endConsultation, fetchAppointmentById, currentAppointment } =
    useAppointmentStore();

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [completingAppointmentId, setCompletingAppointmentId] = useState<
    string | null
  >(null);
  const [modelLoading, setModelLoading] = useState(false);

  useEffect(() => {
    if (!loading && user?.type === "doctor") {
      fetchDashboard(user?.type);
    }
  }, [user, loading, fetchDashboard]);

  useEffect(() => {
    const completedCallId = searchParams.get("completedCall");
    if (completedCallId) {
      setCompletingAppointmentId(completedCallId);
      fetchAppointmentById(completedCallId);
      setShowPrescriptionModal(true);
    }
  }, [searchParams, fetchAppointmentById]);

  const handleSavePrescription = async (
    prescription: string,
    notes: string,
  ) => {
    if (!completingAppointmentId) return;
    setModelLoading(true);
    try {
      await endConsultation(completingAppointmentId, prescription, notes);
      setShowPrescriptionModal(false);
      setCompletingAppointmentId(null);
      if (user?.type) {
        fetchDashboard(user?.type);
      }

      window.history.replaceState({}, "", window.location.pathname);
    } catch (error) {
      console.error("Failed to complete consultation", error);
    } finally {
      setModelLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowPrescriptionModal(false);
    setCompletingAppointmentId(null);
    window.history.replaceState({}, "", window.location.pathname);
  };

  const formatTime = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const canJoinCall = (apt: any) => {
    const diff = (new Date(apt.slotStartIso).getTime() - Date.now()) / 60000;
    return (
      diff <= 15 &&
      diff >= -120 &&
      ["Scheduled", "In Progress"].includes(apt.status)
    );
  };

  if (loading || !dashboardData) {
    return (
      <>
        <Header showDashBoardNav={true} />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
          <div className="container mx-auto px-6">
            <div className="animate-pulse space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 bg-gray-300 rounded-full"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-300 rounded w-96"></div>
                  <div className="h-6 bg-gray-200 rounded w-64"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-white/70 backdrop-blur rounded-3xl"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const stats = [
    {
      title: "Total Patients",
      value: dashboardData?.stats?.totalPatients?.toLocaleString() || "0",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      accent: "bg-blue-500",
    },
    {
      title: "Today's Appointments",
      value: dashboardData?.stats?.todayAppointments || "0",
      icon: Calendar,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      accent: "bg-emerald-500",
    },
    {
      title: "Total Revenue",
      value: `₹${(dashboardData?.stats?.totalRevenue || 0).toLocaleString()}`,
      icon: IndianRupee,
      color: "text-purple-600",
      bg: "bg-purple-50",
      accent: "bg-purple-500",
    },
    {
      title: "Completed Sessions",
      value: dashboardData?.stats?.completedAppointments || "0",
      icon: Activity,
      color: "text-orange-600",
      bg: "bg-orange-50",
      accent: "bg-orange-500",
    },
  ];

  return (
    <>
      <Header showDashBoardNav={true} />

      {/* Animated Gradient Background */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/5 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-14"
          >
            {/* Glass Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-xl p-8 flex flex-col lg:flex-row items-center justify-between gap-10">
              {/* Gradient Glow */}
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full" />

              {/* LEFT */}
              <div className="flex items-center gap-6 z-10">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-28 h-28 ring-4 ring-blue-100 shadow-xl">
                    <AvatarImage src={dashboardData?.user?.profileImage} />
                    <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                      {dashboardData?.user?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* Online Pulse */}
                  <span className="absolute bottom-2 right-2 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-white"></span>
                  </span>
                </div>

                {/* Info */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                    Welcome back,
                  </h1>

                  <h2 className="text-4xl md:text-5xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    Dr. {dashboardData?.user?.name?.split(" ").pop()}
                  </h2>

                  <p className="text-lg text-gray-500 mt-2 font-medium">
                    {dashboardData?.user?.specialization}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-5 mt-4 text-gray-600">
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">
                        {dashboardData?.user?.hospitalInfo?.name},{" "}
                        {dashboardData?.user?.hospitalInfo?.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-800">
                        {dashboardData?.stats?.averageRating || "4.9"}
                      </span>
                      <span className="text-xs text-gray-500">Rating</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT CTA */}
              <Link href="/doctor/profile" className="z-10">
                <Button className="group relative overflow-hidden px-8 h-14 rounded-2xl text-lg font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-xl transition-all">
                  <span className="relative z-10 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Update Availability
                  </span>

                  {/* Hover Glow */}
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition"></span>
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Grid - Glassmorphic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                <Card className="group border border-gray-200 bg-white hover:shadow-md transition-all duration-300 rounded-xl">
                  <CardContent className="flex items-center justify-between p-4">
                    {/* Left Content */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        {stat.title}
                      </p>

                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>

                    {/* Icon */}
                    <div
                      className={`p-2.5 rounded-lg ${stat.bg} group-hover:scale-105 transition`}
                    >
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Appointments Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card className="border border-gray-200 bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <CardHeader className="border-b bg-gray-50/60 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>

                      <div>
                        <CardTitle className="text-lg font-semibold">
                          Today's Schedule
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {dashboardData.todayAppointments?.length || 0}{" "}
                          appointments today
                        </p>
                      </div>
                    </div>

                    <Link href="/doctor/appointments">
                      <Button variant="outline" size="sm">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="p-5 max-h-[420px] overflow-y-auto">
                  {dashboardData.todayAppointments?.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.todayAppointments.map((apt: any) => (
                        <div
                          key={apt._id}
                          className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition"
                        >
                          {/* Left Info */}
                          <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                              {apt.patientId.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </div>

                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-gray-900">
                                  {apt.patientId.name}
                                </h3>

                                <Badge
                                  variant="outline"
                                  className={`${getStatusColor(apt.status)}`}
                                >
                                  {apt.status}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span>{formatTime(apt.slotStartIso)}</span>

                                <span>Age {apt.patientId.age}</span>

                                <span className="flex items-center gap-1">
                                  {apt.consultationType ===
                                  "Video Consultation" ? (
                                    <>
                                      <Video className="w-4 h-4 text-blue-600" />
                                      Video
                                    </>
                                  ) : (
                                    <>
                                      <Phone className="w-4 h-4 text-green-600" />
                                      Audio
                                    </>
                                  )}
                                </span>

                                <span className="font-medium text-gray-800">
                                  ₹{apt.doctorId.fees}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action */}
                          {canJoinCall(apt) && (
                            <Link href={`/call/${apt._id}`}>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Video className="w-4 h-4 mr-1" />
                                Start
                              </Button>
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-14">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>

                      <p className="font-medium text-gray-600">
                        No appointments today
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Your schedule is clear 🎉
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border border-gray-200 bg-white rounded-2xl shadow-sm">
                {/* Header */}
                <CardHeader className="border-b bg-gray-50/60 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>

                      <div>
                        <CardTitle className="text-lg font-semibold">
                          Upcoming Appointments
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {dashboardData.upcommingAppointments?.length || 0}{" "}
                          scheduled
                        </p>
                      </div>
                    </div>

                    <Badge variant="outline">
                      {dashboardData.upcommingAppointments?.length || 0}
                    </Badge>
                  </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="p-5 max-h-[420px] overflow-y-auto">
                  {dashboardData.upcommingAppointments?.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.upcommingAppointments.map((apt: any) => (
                        <div
                          key={apt._id}
                          className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition"
                        >
                          {/* Left */}
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                              {apt.patientId.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {apt.patientId.name}
                              </h4>

                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span>{formatTime(apt.slotStartIso)}</span>

                                <span className="flex items-center gap-1">
                                  {apt.consultationType ===
                                  "Video Consultation" ? (
                                    <>
                                      <Video className="w-4 h-4 text-blue-600" />
                                      Video
                                    </>
                                  ) : (
                                    <>
                                      <Phone className="w-4 h-4 text-green-600" />
                                      Audio
                                    </>
                                  )}
                                </span>
                              </div>

                              <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                {apt.symptoms}
                              </p>
                            </div>
                          </div>

                          {/* Right */}
                          <Badge variant="secondary">Upcoming</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-14">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Clock className="w-8 h-8 text-gray-400" />
                      </div>

                      <p className="font-medium text-gray-600">
                        No upcoming appointments
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Your future schedule is clear
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <PrescriptionModel
        isOpen={showPrescriptionModal}
        onClose={handleCloseModal}
        onSave={handleSavePrescription}
        patientName={currentAppointment?.patientId?.name || "Patient"}
        loading={modelLoading}
      />
    </>
  );
}
