"use client";
import DoctorProfile from "@/components/BookingSteps/DoctorProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Video,
  Phone,
  Calendar,
  CreditCard,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppointmentStore } from "@/store/appointmentStore";
import { useDoctorStore } from "@/store/doctorStore";
import CalenderStep from "@/components/BookingSteps/CalenderStep";
import ConsultationStep from "@/components/BookingSteps/ConsultationStep";
import PayementStep from "@/components/BookingSteps/PaymentStep";
import { toLocalYMD, convertTo24Hour, minutesToTime } from "@/lib/dateUtills";
import { postWithAuth } from "@/service/httpService";

interface SymptomSuggestions {
  suggestions: string[];
}

const steps = [
  { id: 1, name: "Select Slot", icon: Calendar },
  { id: 2, name: "Patient Details", icon: Clock },
  { id: 3, name: "Payment", icon: CreditCard },
];

const BookingPage = () => {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.doctorId as string;

  const { currentDoctor, fetchDoctorById } = useDoctorStore();
  const { bookAppointment, loading, fetchBookedSlots, bookedSlots } =
    useAppointmentStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [consultationType, setConsultationType] =
    useState("Video Consultation");
  const [symptoms, setSymptoms] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [hasFetchedSuggestion, setHasFetchedSuggestion] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [createdAppointmentId, setCreatedAppointmentId] = useState<
    string | null
  >(null);
  const [patientName, setPatientName] = useState("");

  //ai suggestion
  useEffect(() => {
    if (hasFetchedSuggestion) return;
    if (!symptoms.trim() || symptoms.trim().length < 3) {
      setAiSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setIsAiLoading(true);

        const res = await postWithAuth<SymptomSuggestions>(
          "patient/symptom-suggestions",
          { message: symptoms },
        );

        setAiSuggestions(res.data?.suggestions ?? []);
        setHasFetchedSuggestion(true);
      } catch (error) {
        console.error("AI suggestion error:", error);
        setAiSuggestions([]);
      } finally {
        setIsAiLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [symptoms]);

  useEffect(() => {
    if (doctorId) fetchDoctorById(doctorId);
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate && doctorId) {
      fetchBookedSlots(doctorId, toLocalYMD(selectedDate));
    }
  }, [selectedDate, doctorId]);

  // Generate available dates
  useEffect(() => {
    if (!currentDoctor?.availabilityRange) return;
    const { startDate, endDate } = currentDoctor.availabilityRange;
    const start = new Date(
      Math.max(new Date().setHours(0, 0, 0, 0), new Date(startDate).getTime()),
    );
    const end = new Date(endDate);
    const dates: string[] = [];

    for (
      let d = new Date(start);
      d <= end && dates.length < 90;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(toLocalYMD(d));
    }
    setAvailableDates(dates);
  }, [currentDoctor]);

  // Generate slots
  useEffect(() => {
    if (!selectedDate || !currentDoctor?.dailyTimeRanges) return;
    const slotDuration = currentDoctor.slotDurationMinutes || 30;
    const slots: string[] = [];

    currentDoctor.dailyTimeRanges.forEach((range: any) => {
      const startMins = timeToMinutes(range.start);
      const endMins = timeToMinutes(range.end);

      for (let m = startMins; m < endMins; m += slotDuration) {
        slots.push(minutesToTime(m));
      }
    });
    setAvailableSlots(slots);
  }, [selectedDate, currentDoctor]);

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || symptoms.trim().length === 0)
      return alert("Fill all fields");

    setIsPaymentProcessing(true);
    const dateStr = toLocalYMD(selectedDate);
    const start = new Date(`${dateStr}T${convertTo24Hour(selectedSlot)}`);
    const end = new Date(
      start.getTime() + (currentDoctor!.slotDurationMinutes || 30) * 60000,
    );

    const baseFee = currentDoctor!.fees || 0;
    const fee = consultationType === "Voice Call" ? baseFee - 100 : baseFee;
    const platformFee = Math.round(fee * 0.1);
    const total = fee + platformFee;

    try {
      const appointment = await bookAppointment({
        doctorId,
        slotStartIso: start.toISOString(),
        slotEndIso: end.toISOString(),
        consultationType,
        symptoms,
        date: dateStr,
        consultationFees: fee,
        platformFees: platformFee,
        totalAmount: total,
      });

      if (appointment?._id) {
        setCreatedAppointmentId(appointment._id);
        setPatientName(appointment.patientId?.name || "You");
      }
    } catch (err) {
      console.error(err);
      setIsPaymentProcessing(false);
    }
  };

  const progress = (currentStep / 3) * 100;

  if (!currentDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg text-gray-700">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 🔙 Back Button */}
            <Link
              href="/doctor-list"
              className="flex items-center text-gray-600 hover:text-blue-600 transition font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>

            {/* 🔥 STEPPER */}
            <div className="flex-1 max-w-3xl mx-auto">
              {/* Steps */}
              <div className="flex items-center justify-between relative">
                {/* Progress line background */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2 z-0" />

                {/* Active progress line */}
                <div
                  className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-blue-600 to-cyan-500 -translate-y-1/2 z-0 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />

                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="relative z-10 flex flex-col items-center"
                  >
                    {/* Circle */}
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all
                  ${
                    currentStep > step.id
                      ? "bg-green-500 text-white shadow-md"
                      : currentStep === step.id
                        ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-md"
                        : "bg-white border border-gray-300 text-gray-400"
                  }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        step.id
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`mt-2 text-xs font-medium hidden sm:block transition
                  ${
                    currentStep >= step.id ? "text-gray-800" : "text-gray-400"
                  }`}
                    >
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right spacer */}
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Doctor Card (Sticky) */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="sticky top-28"
            >
              <div className="rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-xl">
                {/* Gradient Header */}
                <div className="h-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500" />

                {/* Content */}
                <div className="px-6 pb-6 -mt-16">
                  {/* Doctor Profile */}
                  <div className="rounded-2xl bg-white border shadow-md p-5">
                    <DoctorProfile doctor={currentDoctor} />
                  </div>

                  {/* Info Section */}
                  <div className="mt-6 space-y-4">
                    {/* Consultation Type */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border">
                          {consultationType === "Video Consultation" ? (
                            <Video className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Phone className="w-5 h-5 text-green-600" />
                          )}
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Consultation</p>
                          <p className="font-semibold text-gray-900">
                            {consultationType}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-white border text-gray-600">
                        {consultationType === "Voice Call"
                          ? "₹100 less"
                          : "Popular"}
                      </span>
                    </div>

                    {/* Appointment Card */}
                    {selectedDate && selectedSlot && (
                      <div className="p-5 rounded-2xl border bg-white shadow-sm">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                          Appointment Details
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Date */}
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(selectedDate).toLocaleDateString(
                                "en-IN",
                                {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                },
                              )}
                            </p>
                          </div>

                          {/* Divider */}
                          <div className="h-10 w-[1px] bg-gray-200" />

                          {/* Time */}
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-semibold text-blue-600">
                              {selectedSlot}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CTA / Hint */}
                    {!selectedSlot && (
                      <div className="text-sm text-gray-400 text-center py-3">
                        Select a slot to continue →
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Steps */}
          <div className="lg:col-span-8">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
              <CardContent className="p-10">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="calendar"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Choose Date & Time
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Select a convenient slot for your consultation
                      </p>
                      <CalenderStep
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedSlot={selectedSlot}
                        setSelectedSlot={setSelectedSlot}
                        availableDates={availableDates}
                        availableSlots={availableSlots}
                        excludedWeekdays={
                          currentDoctor.availabilityRange?.excludedWeekdays ||
                          []
                        }
                        bookedSlots={bookedSlots}
                        onContinue={() => setCurrentStep(2)}
                      />
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Tell us about your concern
                      </h2>
                      <p className="text-gray-600 mb-8">
                        This helps the doctor prepare better
                      </p>
                      <ConsultationStep
                        consultationType={consultationType}
                        setConsultationType={setConsultationType}
                        symptoms={symptoms}
                        setSymptoms={setSymptoms}
                        doctorFees={currentDoctor.fees}
                        onBack={() => setCurrentStep(1)}
                        onContinue={() => setCurrentStep(3)}
                        aiSuggestions={aiSuggestions}
                        setIsSuggestionSelected={setIsSuggestionSelected}
                        isAiLoading={isAiLoading}
                      />
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Header */}
                      <div className="mb-8 flex items-start justify-between gap-4">
                        {/* Left Content */}
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-blue-100">
                              <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>

                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                              Review & Confirm
                            </h2>

                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                              Final Step
                            </span>
                          </div>

                          <p className="text-gray-500 text-sm md:text-base max-w-xl">
                            Double-check your appointment details and complete
                            your secure payment to confirm your booking
                            instantly.
                          </p>
                        </div>

                        {/* Right Side (Trust Indicator) */}
                        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border">
                          <Lock className="w-4 h-4 text-green-600" />
                          Secure Payment
                        </div>
                      </div>

                      {/* Subtle Divider */}
                      <div className="mb-8 h-[1px] w-full bg-gradient-to-r from-blue-100 via-gray-200 to-transparent" />

                      <PayementStep
                        selectedDate={selectedDate}
                        selectedSlot={selectedSlot}
                        consultationType={consultationType}
                        doctorName={currentDoctor.name}
                        slotDuration={currentDoctor.slotDurationMinutes}
                        consultationFee={
                          consultationType === "Voice Call"
                            ? currentDoctor.fees - 100
                            : currentDoctor.fees
                        }
                        isProcessing={isPaymentProcessing}
                        onBack={() => setCurrentStep(2)}
                        onConfirm={handleBooking}
                        onPaymentSuccess={() =>
                          router.push("/patient/dashboard")
                        }
                        loading={loading}
                        appointmentId={createdAppointmentId || undefined}
                        patientName={patientName}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
