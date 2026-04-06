import { Appointment } from "@/store/appointmentStore";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Check, Copy, FileText, X } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface PrescriptionViewModalProps {
  appointment: Appointment;
  userType: "doctor" | "patient";
  trigger: React.ReactNode;
}
const PrescriptionViewModal = ({
  appointment,
  userType,
  trigger,
}: PrescriptionViewModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const formateDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const copyToClipboard = async (text: string | undefined) => {
    try {
      if (text) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("failed to copy", error);
    }
  };

  const otherUser =
    userType === "doctor" ? appointment?.patientId : appointment?.doctorId;

  return (
    <>
      <span onClick={openModal} className="cursor-pointer">
        {trigger}
      </span>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)]"
          >
            <div className="bg-white/90 backdrop-blur-2xl border border-white/60 rounded-3xl flex flex-col h-full">
              {/* HEADER */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Prescription
                    </h2>
                    <p className="text-xs text-gray-500">
                      Medical consultation details
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(appointment?.prescription)}
                    className="flex items-center gap-1 rounded-xl"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeModal}
                    className="rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="overflow-y-auto px-6 py-5 space-y-6">
                {/* USER INFO */}
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <p className="font-semibold text-gray-900 text-base">
                      {otherUser?.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {userType === "patient"
                        ? otherUser?.specialization
                        : `Age: ${otherUser?.age}`}
                    </p>
                  </div>

                  <div className="text-right text-sm text-gray-500">
                    <p>{formateDate(appointment?.slotStartIso)}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {appointment.consultationType}
                    </p>
                  </div>
                </div>

                {/* PRESCRIPTION */}
                <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-green-700 mb-3 uppercase tracking-wide">
                    Prescription
                  </h3>

                  <div className="bg-white border rounded-xl p-4 text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed shadow-inner">
                    {appointment?.prescription}
                  </div>
                </div>

                {/* NOTES */}
                {appointment.notes && (
                  <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Notes
                    </h3>

                    <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {appointment?.notes}
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white/70 backdrop-blur">
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="rounded-xl"
                >
                  Close
                </Button>

                <Button
                  onClick={() => window.print()}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl"
                >
                  Print
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default PrescriptionViewModal;
