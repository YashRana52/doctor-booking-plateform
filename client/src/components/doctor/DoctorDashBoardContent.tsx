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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mb-16"
          >
            <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/60 shadow-2xl p-10 lg:p-12">
              {/* Background Accents */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-sky-500/10 rounded-full blur-3xl" />

              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10 relative z-10">
                {/* LEFT SECTION */}
                <div className="flex items-start gap-8">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden ring-8 ring-white shadow-2xl">
                      <Avatar className="w-full h-full">
                        <AvatarImage
                          src={dashboardData?.user?.profileImage}
                          className="object-cover"
                        />

                        <AvatarFallback className="text-6xl font-bold bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white">
                          {dashboardData?.user?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Online */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white rounded-full pl-1 pr-3 py-1 shadow-lg">
                      <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
                      <span className="text-xs font-semibold text-emerald-600">
                        Online
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="pt-2">
                    <p className="text-lg text-slate-500 font-medium">
                      Good morning, Doctor
                    </p>

                    <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 tracking-tighter mt-1">
                      Dr. {dashboardData?.user?.name?.split(" ").pop()}
                    </h1>

                    <p className="text-xl text-slate-600 mt-2 font-medium">
                      {dashboardData?.user?.specialization}
                    </p>

                    {/* Info */}
                    <div className="flex items-center gap-6 mt-6 flex-wrap">
                      {/* Hospital */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>

                        <div>
                          <p className="text-sm text-slate-500">
                            Current Hospital
                          </p>

                          <p className="font-semibold text-slate-800">
                            {dashboardData?.user?.hospitalInfo?.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {dashboardData?.user?.hospitalInfo?.city}
                          </p>
                        </div>
                      </div>

                      <div className="h-12 w-px bg-slate-200 hidden sm:block" />

                      {/* Rating */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        </div>

                        <div>
                          <p className="text-3xl font-bold text-slate-800 leading-none">
                            {dashboardData?.stats?.averageRating || "4.9"}
                          </p>

                          <p className="text-xs text-slate-500 mt-0.5">
                            Patient Rating
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="w-full xl:max-w-[430px] flex flex-col gap-5">
                  {/* Main Button */}
                  <Link href="/doctor/profile">
                    <Button
                      size="lg"
                      className="group relative h-16 w-full text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <Plus className="w-6 h-6" />
                        Update Availability
                      </span>

                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                  </Link>

                  {/* PREMIUM STATS GRID */}
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.08 }}
                        whileHover={{ y: -4 }}
                        className="group"
                      >
                        <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300">
                          {/* Hover Glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-cyan-500/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="relative z-10 flex items-center justify-between">
                            {/* LEFT */}
                            <div>
                              <p className="text-xs font-medium text-slate-500">
                                {stat.title}
                              </p>

                              <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                                {stat.value}
                              </h3>
                            </div>

                            {/* ICON */}
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.bg} shadow-md group-hover:scale-110 transition-transform duration-300`}
                            >
                              <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "75%" }}
                              transition={{
                                duration: 1.2,
                                delay: index * 0.1,
                              }}
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

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
                          {dashboardData.upcomingAppointments?.length || 0}{" "}
                          scheduled
                        </p>
                      </div>
                    </div>

                    <Badge variant="outline">
                      {dashboardData.upcomingAppointments?.length || 0}
                    </Badge>
                  </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="p-5 max-h-[420px] overflow-y-auto">
                  {dashboardData.upcomingAppointments?.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.upcomingAppointments.map((apt: any) => (
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
