"use client";
import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import { userAuthStore } from "@/store/authStore";
import { Appointment, useAppointmentStore } from "@/store/appointmentStore";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Calendar,
  Clock,
  FileText,
  MapPin,
  Phone,
  Star,
  Video,
  CalendarDays,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { getStatusColor } from "@/lib/constant";
import PrescriptionViewModal from "../doctor/PrescriptionViewModel";
import { format } from "date-fns";
import { motion } from "framer-motion";

const PatientDashboardContent = () => {
  const { user } = userAuthStore();
  const { appointments, fetchAppointments, loading } = useAppointmentStore();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [tabCounts, setTabCounts] = useState({ upcoming: 0, past: 0 });

  useEffect(() => {
    if (user?.type === "patient") {
      fetchAppointments("patient", activeTab);
    }
  }, [user, activeTab, fetchAppointments]);

  useEffect(() => {
    const now = new Date();
    const upcoming = appointments.filter((apt) => {
      const aptDate = new Date(apt.slotStartIso);
      return (
        (aptDate >= now || apt.status === "In Progress") &&
        (apt.status === "Scheduled" || apt.status === "In Progress")
      );
    });

    const past = appointments.filter((apt) => {
      const aptDate = new Date(apt.slotStartIso);
      return (
        aptDate < now ||
        apt.status === "Completed" ||
        apt.status === "Cancelled"
      );
    });

    setTabCounts({ upcoming: upcoming.length, past: past.length });
  }, [appointments]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy 'at' h:mm a");
  };

  const isToday = (dateString: string) => {
    return (
      format(new Date(dateString), "yyyy-MM-dd") ===
      format(new Date(), "yyyy-MM-dd")
    );
  };

  const canJoinCall = (appointment: Appointment) => {
    const appointmentTime = new Date(appointment.slotStartIso);
    const now = new Date();
    const diffMinutes =
      (appointmentTime.getTime() - now.getTime()) / (1000 * 60);
    return (
      isToday(appointment.slotStartIso) &&
      diffMinutes <= 15 &&
      diffMinutes >= -120 &&
      (appointment.status === "Scheduled" ||
        appointment.status === "In Progress")
    );
  };

  if (!user) return null;

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 via-teal-400 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />

      <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Top Bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-teal-500 to-purple-600" />

        <div className="p-8 sm:p-10">
          {/* HEADER */}
          <div className="flex gap-6 mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24 ring-4 ring-white shadow-xl">
                <AvatarImage
                  src={appointment.doctorId?.profileImage}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-600 text-white text-4xl font-bold">
                  {appointment.doctorId?.name?.charAt(0) || "D"}
                </AvatarFallback>
              </Avatar>

              {/* Live Pulse */}
              {canJoinCall(appointment) && (
                <div className="absolute -bottom-1 -right-1">
                  <span className="absolute inline-flex h-5 w-5 rounded-full bg-green-400 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex h-5 w-5 rounded-full bg-green-500"></span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Dr. {appointment.doctorId?.name}
                  </h3>
                  <p className="text-teal-600 font-medium mt-1">
                    {appointment.doctorId?.specialization}
                  </p>

                  {appointment.doctorId?.hospitalInfo?.name && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {appointment.doctorId.hospitalInfo.name}
                    </div>
                  )}
                </div>

                <Badge
                  className={`px-4 py-1.5 text-xs rounded-full font-semibold shadow-sm ${getStatusColor(
                    appointment.status,
                  )}`}
                >
                  {appointment.status === "In Progress"
                    ? "🔴 LIVE"
                    : appointment.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* INFO GRID */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Date */}
            <div className="group/card bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-5 hover:shadow-md transition">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <CalendarDays className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-semibold text-lg">
                    {formatDate(appointment.slotStartIso)}
                  </p>
                </div>
              </div>

              {isToday(appointment.slotStartIso) && (
                <span className="mt-3 inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                  TODAY
                </span>
              )}
            </div>

            {/* Type */}
            <div className="bg-gradient-to-br from-gray-50 to-white border rounded-2xl p-5 hover:shadow-md transition">
              <div className="flex gap-4 items-center mb-4">
                <div
                  className={`p-3 rounded-xl ${
                    appointment.consultationType.includes("Video")
                      ? "bg-purple-100"
                      : "bg-green-100"
                  }`}
                >
                  {appointment.consultationType.includes("Video") ? (
                    <Video className="w-6 h-6 text-purple-600" />
                  ) : (
                    <Phone className="w-6 h-6 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="font-medium">{appointment.consultationType}</p>
                </div>
              </div>

              <div className="flex justify-between border-t pt-4">
                <span className="text-sm text-gray-500">Fee</span>
                <span className="font-bold text-xl">
                  ₹{appointment.doctorId?.fees || "--"}
                </span>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          {appointment.symptoms && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase mb-2 tracking-wider">
                Symptoms
              </p>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
                {appointment.symptoms}
              </div>
            </div>
          )}

          {/* ACTION */}
          <div className="flex flex-col sm:flex-row gap-4">
            {canJoinCall(appointment) && (
              <Link href={`/call/${appointment._id}`} className="flex-1">
                <Button className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition">
                  <Video className="w-5 h-5 mr-2" />
                  Join Call
                </Button>
              </Link>
            )}

            {appointment.status === "Completed" && appointment.prescription && (
              <PrescriptionViewModal
                appointment={appointment}
                userType="patient"
                trigger={
                  <Button
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl border-2"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Prescription
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating Badge */}
      {isToday(appointment.slotStartIso) && (
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-4 py-2 rounded-xl shadow-lg"
        >
          TODAY
        </motion.div>
      )}
    </motion.div>
  );

  const EmptyState = ({ tab }: { tab: string }) => {
    const config = {
      upcoming: {
        icon: Stethoscope,
        title: "No Upcoming Appointments",
        description:
          "You're all caught up! Book your next consultation when needed.",
        gradient: "from-blue-500 to-purple-600",
      },
      past: {
        icon: FileText,
        title: "No Past Appointments Yet",
        description:
          "Your completed consultations and prescriptions will appear here.",
        gradient: "from-gray-400 to-gray-600",
      },
    };

    const {
      icon: Icon,
      title,
      description,
      gradient,
    } = config[tab as keyof typeof config];

    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div
          className={`p-8 rounded-full bg-gradient-to-br ${gradient} shadow-2xl mb-8`}
        >
          <Icon className="w-16 h-16 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-lg text-gray-600 max-w-md text-center mb-10">
          {description}
        </p>
        {tab === "upcoming" && (
          <Link href="/doctor-list">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-10 py-7 shadow-xl"
            >
              <Calendar className="w-6 h-6 mr-3" />
              Book Your First Appointment
            </Button>
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      <Header showDashBoardNav={true} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/70 to-indigo-50/60 pt-16 pb-20 mt-10">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 mb-16">
            {/* Left Side - Title & Description */}
            <div className="space-y-6 max-w-3xl">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-3xl border border-white/80 shadow-sm">
                <div className="relative flex items-center justify-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-5 h-5 bg-emerald-500/20 rounded-full animate-ping" />
                </div>
                <span className="uppercase tracking-[3px] text-xs font-semibold text-emerald-700">
                  Live Health Dashboard
                </span>
              </div>
            </div>

            {/* Right Side - Action Button */}
            <div className="flex-shrink-0">
              <Link href="/doctor-list">
                <Button
                  size="lg"
                  className="group h-16 px-9 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white font-semibold rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 text-lg"
                >
                  <Calendar className="w-6 h-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                  Book New Appointment
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="inline-flex h-16 bg-white/80 backdrop-blur-2xl border border-white shadow-xl rounded-3xl p-2 mx-auto mb-12">
              <TabsTrigger
                value="upcoming"
                className="rounded-2xl px-10 py-3 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 flex items-center gap-3"
              >
                <Clock className="w-5 h-5" />
                Upcoming
                <span className="ml-1 bg-white/20 px-3 py-0.5 rounded-full text-sm">
                  {tabCounts.upcoming}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="past"
                className="rounded-2xl px-10 py-3 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-700 data-[state=active]:to-slate-800 data-[state=active]:text-white transition-all duration-300 flex items-center gap-3"
              >
                <CalendarDays className="w-5 h-5" />
                Past
                <span className="ml-1 bg-white/20 px-3 py-0.5 rounded-full text-sm">
                  {tabCounts.past}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Tab Content */}
            {tabCounts.upcoming > 0 && (
              <TabsContent value="upcoming" className="mt-4">
                {loading ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-3xl p-8 animate-pulse border border-gray-100"
                      >
                        <div className="flex gap-6">
                          <div className="w-24 h-24 bg-gray-200 rounded-2xl" />
                          <div className="flex-1 space-y-5 pt-2">
                            <div className="h-7 bg-gray-200 rounded-xl w-3/4" />
                            <div className="h-5 bg-gray-100 rounded-lg w-1/2" />
                            <div className="h-28 bg-gray-100 rounded-2xl mt-6" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : tabCounts.upcoming === 0 ? (
                  <EmptyState tab="upcoming" />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {appointments
                      .filter((apt) => new Date(apt.date) >= new Date())
                      .map((apt) => (
                        <AppointmentCard key={apt._id} appointment={apt} />
                      ))}
                  </div>
                )}
              </TabsContent>
            )}

            {/* Past Tab Content */}
            <TabsContent value="past" className="mt-4">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-3xl p-8 animate-pulse border border-gray-100"
                    >
                      <div className="flex gap-6">
                        <div className="w-24 h-24 bg-gray-200 rounded-2xl" />
                        <div className="flex-1 space-y-4 pt-2">
                          <div className="h-7 bg-gray-200 rounded-xl w-3/4" />
                          <div className="h-5 bg-gray-100 rounded-lg w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : tabCounts.past > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {appointments.map((apt) => (
                    <AppointmentCard key={apt._id} appointment={apt} />
                  ))}
                </div>
              ) : (
                <EmptyState tab="past" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default PatientDashboardContent;
