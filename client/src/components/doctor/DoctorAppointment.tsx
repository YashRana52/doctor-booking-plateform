"use client";

import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import { userAuthStore } from "@/store/authStore";
import { Appointment, useAppointmentStore } from "@/store/appointmentStore";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Calendar,
  Clock,
  FileText,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  Video,
  XCircle,
  CalendarCheck,
  CalendarX,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { emptyStates, getStatusColor } from "@/lib/constant";
import PrescriptionViewModel from "./PrescriptionViewModel";
import { motion } from "framer-motion";

const DoctorAppointmentContent = () => {
  const { user } = userAuthStore();
  const { appointments, fetchAppointments, loading, updateAppointmentStatus } =
    useAppointmentStore();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [tabCounts, setTabCounts] = useState({ upcoming: 0, past: 0 });

  useEffect(() => {
    if (user?.type === "doctor") {
      fetchAppointments("doctor", activeTab);
    }
  }, [user, activeTab, fetchAppointments]);

  useEffect(() => {
    setTabCounts({
      upcoming: upcomingAppointments.length,
      past: pastAppointments.length,
    });
  }, [appointments]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isToday = (date: string) =>
    new Date(date).toDateString() === new Date().toDateString();

  const canJoinCall = (apt: Appointment) => {
    const diff = (new Date(apt.slotStartIso).getTime() - Date.now()) / 60000;
    return (
      isToday(apt.slotStartIso) &&
      diff <= 15 &&
      diff >= -120 &&
      ["Scheduled", "In Progress"].includes(apt.status)
    );
  };

  const canCancel = (apt: Appointment) =>
    apt.status === "Scheduled" && new Date(apt.slotStartIso) > new Date();

  const handleCancel = async (id: string) => {
    if (confirm("Cancel this appointment?")) {
      await updateAppointmentStatus(id, "Cancelled");
      fetchAppointments("doctor", activeTab);
    }
  };

  if (!user) return null;

  const now = new Date();

  const upcomingAppointments = appointments.filter((apt) => {
    const start = new Date(apt.slotStartIso);

    return start > now && ["Scheduled", "In Progress"].includes(apt.status);
  });

  const pastAppointments = appointments.filter((apt) => {
    const start = new Date(apt.slotStartIso);

    return start <= now || ["Completed", "Cancelled"].includes(apt.status);
  });

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const PrescriptionModal = PrescriptionViewModel as any;

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <Avatar className="w-12 h-12">
                <AvatarImage src={appointment.patientId?.profileImage} />
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  {appointment.patientId?.name?.[0]}
                </AvatarFallback>
              </Avatar>

              {/* Main Content */}
              <div className="flex-1 space-y-3">
                {/* Top */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {appointment.patientId?.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Age {appointment.patientId?.age} •{" "}
                      {appointment.patientId?.gender}
                    </p>
                  </div>

                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>

                {/* Info Row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    {formatDate(appointment.slotStartIso)}
                  </span>

                  <span className="flex items-center gap-1">
                    {appointment.consultationType === "Video Consultation" ? (
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
                    ₹{appointment.doctorId?.fees}
                  </span>
                </div>

                {/* Symptoms */}
                <p className="text-sm text-gray-500 line-clamp-2">
                  {appointment.symptoms || "No symptoms mentioned"}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-3 border-t">
                  {canJoinCall(appointment) && (
                    <Link href={`/call/${appointment._id}`}>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Video className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    </Link>
                  )}

                  {canCancel(appointment) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleCancel(appointment._id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  )}

                  {appointment.status === "Completed" &&
                    appointment.prescription && (
                      <PrescriptionModal
                        appointment={appointment}
                        userType="doctor"
                        trigger={
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-300 text-green-700"
                          >
                            <Stethoscope className="w-4 h-4 mr-1" />
                            Prescription
                          </Button>
                        }
                      />
                    )}

                  {appointment.status === "Completed" && (
                    <div className="flex items-center gap-1 ml-auto">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const EmptyState = ({ tab }: { tab: string }) => {
    const state =
      tab === "upcoming"
        ? {
            icon: CalendarX,
            title: "No Upcoming Appointments",
            description: "Your schedule is free. Patients can book anytime!",
          }
        : {
            icon: CalendarCheck,
            title: "No Past Appointments",
            description: "Start consulting to see history here",
          };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-8">
          <state.icon className="w-16 h-16 text-blue-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-3">{state.title}</h3>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          {state.description}
        </p>
      </motion.div>
    );
  };

  return (
    <>
      <Header showDashBoardNav={true} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Left */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-100">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    My Appointments
                  </h1>

                  <p className="text-gray-500 mt-1 text-sm md:text-base">
                    Manage and consult with your patients
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <Link href="/doctor/profile">
                  <Button variant="outline" size="lg" className="rounded-xl">
                    <Calendar className="w-5 h-5 mr-2" />
                    Update Availability
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-10 flex flex-col items-center"
          >
            <TabsList
              className="
    bg-white/80 backdrop-blur-xl shadow-2xl 
    rounded-2xl p-2 
    w-full max-w-md 
    flex justify-between
  "
            >
              <TabsTrigger
                value="upcoming"
                className="
        flex items-center justify-center w-full
        data-[state=active]:bg-gradient-to-r 
        data-[state=active]:from-blue-600 
        data-[state=active]:to-indigo-700 
        data-[state=active]:text-white 
        rounded-xl text-lg py-4 font-semibold 
        transition-all
      "
              >
                <Clock className="w-5 h-5 mr-3" />
                Upcoming ({tabCounts.upcoming})
              </TabsTrigger>

              <TabsTrigger
                value="past"
                className="
        flex items-center justify-center w-full
        data-[state=active]:bg-gradient-to-r 
        data-[state=active]:from-purple-600 
        data-[state=active]:to-pink-600 
        data-[state=active]:text-white 
        rounded-xl text-lg py-4 font-semibold 
        transition-all
      "
              >
                <CalendarCheck className="w-5 h-5 mr-3" />
                Past ({tabCounts.past})
              </TabsTrigger>
            </TabsList>

            {/* UPCOMING */}
            <TabsContent value="upcoming" className="mt-10 w-full">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-64 bg-white/70 backdrop-blur rounded-3xl animate-pulse shadow-xl"
                    />
                  ))}
                </div>
              ) : appointments.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {upcomingAppointments.map((apt) => (
                    <AppointmentCard key={apt._id} appointment={apt} />
                  ))}
                </div>
              ) : (
                <EmptyState tab="upcoming" />
              )}
            </TabsContent>

            {/* PAST */}
            <TabsContent value="past" className="mt-10 w-full">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-64 bg-white/70 backdrop-blur rounded-3xl animate-pulse shadow-xl"
                    />
                  ))}
                </div>
              ) : appointments.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {pastAppointments.map((apt) => (
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

export default DoctorAppointmentContent;
