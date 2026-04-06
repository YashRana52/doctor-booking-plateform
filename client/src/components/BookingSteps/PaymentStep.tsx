import { httpService } from "@/service/httpService";
import { userAuthStore } from "@/store/authStore";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Loader2,
  XCircle,
  Phone,
  Video,
  Calendar,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentStepInterface {
  selectedDate: Date | undefined;
  selectedSlot: string;
  consultationType: string;
  doctorName: string;
  slotDuration: number;
  consultationFee: number;
  isProcessing: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onPaymentSuccess?: (appointment: any) => void;
  loading: boolean;
  appointmentId?: string;
  patientName?: string;
}

const PaymentStep = ({
  selectedDate,
  selectedSlot,
  consultationType,
  doctorName,
  slotDuration,
  consultationFee,
  isProcessing,
  onBack,
  onConfirm,
  onPaymentSuccess,
  appointmentId,
  patientName,
  loading,
}: PaymentStepInterface) => {
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const { user } = userAuthStore();
  const [error, setError] = useState("");
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const modelCloseCountRef = useRef(0);

  const platformFees = Math.round(consultationFee * 0.1);
  const totalAmount = consultationFee + platformFees;
  const [shouldAutoOpen, setShouldAutoOpen] = useState(true);

  useEffect(() => {
    if (appointmentId && patientName && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [appointmentId, patientName]);

  useEffect(() => {
    if (
      appointmentId &&
      patientName &&
      paymentStatus === "idle" &&
      !isPaymentLoading &&
      shouldAutoOpen
    ) {
      const timer = setTimeout(() => handlePayment(), 800);
      return () => clearTimeout(timer);
    }
  }, [
    appointmentId,
    patientName,
    paymentStatus,
    isPaymentLoading,
    shouldAutoOpen,
  ]);

  const handlePayment = async () => {
    if (!appointmentId || !patientName) {
      onConfirm();
      return;
    }

    try {
      setIsPaymentLoading(true);
      setError("");
      setPaymentStatus("processing");

      const orderResponse = await httpService.postWithAuth(
        "payment/create-order",
        { appointmentId },
      );
      if (!orderResponse.success)
        throw new Error(orderResponse.message || "Failed to create order");

      const { orderId, amount, currency, key } = orderResponse.data;

      const options = {
        key,
        amount: amount * 100,
        currency,
        name: "MediConnect",
        description: `Consultation with Dr. ${doctorName}`,
        image: "/logo.png",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await httpService.postWithAuth(
              "payment/verify-payment",
              {
                appointmentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            );

            if (verifyResponse.success) {
              setPaymentStatus("success");
              if (onPaymentSuccess) onPaymentSuccess(verifyResponse.data);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err: any) {
            setPaymentStatus("failed");
            setError(err.message || "Payment failed. Please try again.");
          }
        },
        prefill: {
          name: patientName,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: "#3b82f6" },
        modal: {
          ondismiss: () => {
            modelCloseCountRef.current += 1;
            if (modelCloseCountRef.current === 1) {
              setTimeout(() => handlePayment(), 1500);
            } else {
              setShouldAutoOpen(false);
              setPaymentStatus("idle");
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setPaymentStatus("failed");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handlePayNow = () => {
    modelCloseCountRef.current = 0;
    handlePayment();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-900">
                Appointment Summary
              </h3>
              <p className="text-sm text-gray-500 mt-1">Dr. {doctorName}</p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Info Cards */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex items-center gap-4 p-5 rounded-2xl border bg-white hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date & Time</p>
                    <p className="font-semibold text-gray-900">
                      {selectedDate?.toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                    <p className="text-blue-600 font-bold">{selectedSlot}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 rounded-2xl border bg-white hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    {consultationType.includes("Video") ? (
                      <Video className="w-5 h-5 text-purple-600" />
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
              </div>

              {/* Pricing */}
              <div className="rounded-2xl border bg-gray-50 p-6 space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Consultation Fee</span>
                  <span className="font-medium">₹{consultationFee}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>
                    Platform Fee{" "}
                    <span className="text-xs text-gray-400">(incl. GST)</span>
                  </span>
                  <span className="font-medium">₹{platformFees}</span>
                </div>

                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">₹{totalAmount}</span>
                </div>
              </div>

              {/* Trust */}
              <div className="flex flex-wrap gap-6 justify-center text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <ShieldCheck className="w-4 h-4" />
                  Secure
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Lock className="w-4 h-4" />
                  Encrypted
                </div>
                <div className="flex items-center gap-2 text-purple-600">
                  <Sparkles className="w-4 h-4" />
                  Instant Confirmation
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24"
          >
            <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl p-6 overflow-hidden">
              {/* Gradient Top Glow */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-500" />

              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Payment Summary
              </h3>

              <AnimatePresence mode="wait">
                {/* 🟢 IDLE STATE */}
                {paymentStatus === "idle" && (
                  <motion.div
                    key="pay"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Amount Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-100 text-center">
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                        Total Payable
                      </p>
                      <p className="text-4xl font-bold text-gray-900 tracking-tight">
                        ₹{totalAmount}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Secure payment via gateway
                      </p>
                    </div>

                    {/* Pay Button */}
                    <Button
                      onClick={handlePayNow}
                      disabled={isPaymentLoading || loading}
                      className="w-full h-13 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                    >
                      {isPaymentLoading || loading ? (
                        <>
                          <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 w-5 h-5" />
                          Pay & Confirm
                        </>
                      )}
                    </Button>

                    {/* Back */}
                    <Button
                      variant="ghost"
                      onClick={onBack}
                      className="w-full text-gray-400 hover:text-gray-700 transition"
                    >
                      ← Go Back
                    </Button>
                  </motion.div>
                )}

                {/* 🔵 PROCESSING */}
                {paymentStatus === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-blue-50">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                      </div>
                    </div>
                    <p className="font-medium text-gray-700">
                      Processing your payment...
                    </p>
                    <p className="text-xs text-gray-400">
                      Please don’t close this window
                    </p>
                  </motion.div>
                )}

                {/* 🟢 SUCCESS */}
                {paymentStatus === "success" && (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-green-50">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                      </div>
                    </div>

                    <p className="text-lg font-semibold text-gray-900">
                      Appointment Confirmed 🎉
                    </p>
                    <p className="text-sm text-gray-500">
                      Your consultation has been successfully booked
                    </p>
                  </motion.div>
                )}

                {/* 🔴 FAILED */}
                {paymentStatus === "failed" && (
                  <motion.div
                    key="failed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-5 py-10"
                  >
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-red-50">
                        <XCircle className="w-12 h-12 text-red-500" />
                      </div>
                    </div>

                    <p className="text-sm text-gray-500">{error}</p>

                    <Button
                      onClick={handlePayNow}
                      className="w-full h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md"
                    >
                      Retry Payment
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentStep;
