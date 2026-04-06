"use client";

import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { userAuthStore } from "@/store/authStore";
import { DoctorFormData, HospitalInfo } from "@/lib/types";
import { healthcareCategoriesList, specializations } from "@/lib/constant";

import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { MotionConfig, motion } from "framer-motion";

function DoctorOnboardingForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<DoctorFormData>({
    specialization: "",
    categories: [],
    qualification: "",
    experience: "",
    fees: "",
    about: "",
    hospitalInfo: { name: "", address: "", city: "" },
    availabilityRange: {
      startDate: "",
      endDate: "",
      excludedWeekdays: [],
    },
    dailyTimeRanges: [
      { start: "09:00", end: "12:00" },
      { start: "14:00", end: "17:00" },
    ],
    slotDurationMinutes: 30,
  });

  const { updateProfile, loading } = userAuthStore();
  const router = useRouter();

  // Same logic handlers (unchanged)
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleHospitalInfo = (field: keyof HospitalInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      hospitalInfo: { ...prev.hospitalInfo, [field]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateProfile({
        ...formData,
        availabilityRange: {
          startDate: new Date(formData.availabilityRange.startDate),
          endDate: new Date(formData.availabilityRange.endDate),
          excludedWeekdays: formData.availabilityRange.excludedWeekdays,
        },
      });
      router.push("/doctor/dashboard");
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  const handleNext = () => currentStep < 3 && setCurrentStep(currentStep + 1);
  const handlePrevious = () =>
    currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleExcludedDaysChange = (dayValue: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availabilityRange: {
        ...prev.availabilityRange,
        excludedWeekdays: checked
          ? [...prev.availabilityRange.excludedWeekdays, dayValue]
          : prev.availabilityRange.excludedWeekdays.filter(
              (d) => d !== dayValue,
            ),
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Premium Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden border border-white/70 shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl">
            {/* Elegant Top Accent */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-blue-600 to-purple-600" />

            <CardContent className="p-8 lg:p-12">
              {/* Modern Premium Stepper */}
              <div className="mb-12">
                <div className="flex items-center justify-center gap-3 mb-8">
                  {[0, 1, 2].map((step, index) => (
                    <React.Fragment key={step}>
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: currentStep === step + 1 ? 1.08 : 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`w-11 h-11 flex items-center justify-center rounded-2xl font-semibold text-lg border-2 transition-all duration-300 ${
                          currentStep > step + 1
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-md"
                            : currentStep === step + 1
                              ? "bg-white border-indigo-600 text-indigo-600 shadow-lg ring-4 ring-indigo-100"
                              : "bg-white border-gray-200 text-gray-400"
                        }`}
                      >
                        {currentStep > step + 1 ? "✓" : step + 1}
                      </motion.div>

                      {index < 2 && (
                        <div className="flex-1 max-w-[140px] h-px bg-gray-200 relative">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{
                              width: currentStep > step + 1 ? "100%" : "0%",
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Step Labels */}
                <div className="flex justify-between text-sm font-medium text-gray-500 px-4">
                  <span
                    className={
                      currentStep === 1 ? "text-indigo-700 font-semibold" : ""
                    }
                  >
                    Professional Info
                  </span>
                  <span
                    className={
                      currentStep === 2 ? "text-indigo-700 font-semibold" : ""
                    }
                  >
                    Clinic Details
                  </span>
                  <span
                    className={
                      currentStep === 3 ? "text-indigo-700 font-semibold" : ""
                    }
                  >
                    Availability
                  </span>
                </div>

                <p className="text-center text-xs text-gray-400 mt-3 tracking-widest">
                  STEP {currentStep} OF 3
                </p>
              </div>

              <MotionConfig transition={{ duration: 0.4, ease: "easeOut" }}>
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  {/* Step 1 */}
                  {currentStep === 1 && (
                    <div className="space-y-7">
                      {/* Heading */}
                      <div>
                        <p className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase mb-1">
                          Step 1 of 3
                        </p>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
                          Professional Information
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                          Help patients understand your expertise and background
                        </p>
                      </div>

                      {/* Specialization + Experience */}
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                            Specialization
                          </Label>
                          <Select
                            value={formData.specialization}
                            onValueChange={(v) =>
                              setFormData((prev) => ({
                                ...prev,
                                specialization: v,
                              }))
                            }
                          >
                            <SelectTrigger className="h-11 bg-slate-50 border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all">
                              <SelectValue placeholder="Select your specialization" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                              {specializations.map((spec) => (
                                <SelectItem
                                  key={spec}
                                  value={spec}
                                  className="text-sm text-slate-700 focus:bg-slate-50"
                                >
                                  {spec}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                            Years of Experience
                          </Label>
                          <Input
                            name="experience"
                            type="number"
                            min={2}
                            value={formData.experience}
                            onChange={handleInputChange}
                            placeholder="e.g. 8"
                            className="h-11 bg-slate-50 border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-400 placeholder:text-slate-300 transition-all"
                          />
                        </div>
                      </div>

                      {/* Healthcare Categories */}
                      <div className="space-y-2.5">
                        <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                          Healthcare Categories
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                          {healthcareCategoriesList.map((cat) => {
                            const isSelected =
                              formData.categories.includes(cat);
                            return (
                              <motion.button
                                type="button"
                                key={cat}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleCategoryToggle(cat)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-150 cursor-pointer ${
                                  isSelected
                                    ? "bg-slate-900 border-slate-900"
                                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                                    isSelected
                                      ? "bg-white border-white"
                                      : "border-slate-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <svg
                                      className="w-2.5 h-2.5 text-slate-900"
                                      fill="none"
                                      viewBox="0 0 12 12"
                                      stroke="currentColor"
                                      strokeWidth={2.5}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2 6l3 3 5-5"
                                      />
                                    </svg>
                                  )}
                                </span>
                                <span
                                  className={`text-sm font-medium transition-colors ${
                                    isSelected ? "text-white" : "text-slate-600"
                                  }`}
                                >
                                  {cat}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Qualification + Fees */}
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                            Qualification
                          </Label>
                          <Input
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleInputChange}
                            placeholder="MBBS, MD, DM…"
                            className="h-11 bg-slate-50 border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-400 placeholder:text-slate-300 transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                            Consultation Fees (₹)
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">
                              ₹
                            </span>
                            <Input
                              name="fees"
                              type="number"
                              min={200}
                              value={formData.fees}
                              onChange={handleInputChange}
                              placeholder="800"
                              className="h-11 pl-8 bg-slate-50 border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-400 placeholder:text-slate-300 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* About */}
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                          About You
                        </Label>
                        <Textarea
                          name="about"
                          value={formData.about}
                          onChange={handleInputChange}
                          placeholder="Share your journey, approach, and passion for healing..."
                          rows={5}
                          className="bg-slate-50 border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-400 placeholder:text-slate-300 resize-none transition-all text-sm leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {currentStep === 2 && (
                    <div className="space-y-7">
                      {/* Heading */}
                      <div>
                        <p className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase mb-1">
                          Step 2 of 3
                        </p>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
                          Clinic / Hospital Details
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                          Where patients can find and meet you in person
                        </p>
                      </div>

                      {/* Fields */}
                      <div className="space-y-4">
                        {/* Clinic Name */}
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                            Hospital / Clinic Name
                          </Label>
                          <Input
                            value={formData.hospitalInfo.name}
                            onChange={(e) =>
                              handleHospitalInfo("name", e.target.value)
                            }
                            placeholder="e.g. Apollo Spectra Hospital"
                            className="h-11 bg-slate-50 border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-400 placeholder:text-slate-300 transition-all"
                          />
                        </div>

                        {/* Address */}
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                            Full Address
                          </Label>
                          <Textarea
                            value={formData.hospitalInfo.address}
                            onChange={(e) =>
                              handleHospitalInfo("address", e.target.value)
                            }
                            placeholder="Street, area, landmark…"
                            rows={3}
                            className="bg-slate-50 border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-400 placeholder:text-slate-300 resize-none transition-all text-sm leading-relaxed"
                          />
                        </div>

                        {/* City */}
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                            City
                          </Label>
                          <Input
                            value={formData.hospitalInfo.city}
                            onChange={(e) =>
                              handleHospitalInfo("city", e.target.value)
                            }
                            placeholder="e.g. Mumbai"
                            className="h-11 bg-slate-50 border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-400 placeholder:text-slate-300 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {currentStep === 3 && (
                    <div className="space-y-7">
                      {/* Heading */}
                      <div>
                        <p className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase mb-1">
                          Step 3 of 3
                        </p>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
                          Set Your Availability
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                          Manage your schedule effortlessly
                        </p>
                      </div>

                      {/* Date Range */}
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                            Available From
                          </Label>
                          <Input
                            type="date"
                            value={formData.availabilityRange.startDate}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                availabilityRange: {
                                  ...prev.availabilityRange,
                                  startDate: e.target.value,
                                },
                              }))
                            }
                            className="h-11 bg-slate-50 border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                            Available Until
                          </Label>
                          <Input
                            type="date"
                            value={formData.availabilityRange.endDate}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                availabilityRange: {
                                  ...prev.availabilityRange,
                                  endDate: e.target.value,
                                },
                              }))
                            }
                            className="h-11 bg-slate-50 border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all"
                          />
                        </div>
                      </div>

                      {/* Slot Duration */}
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                          Slot Duration
                        </Label>
                        <Select
                          value={formData?.slotDurationMinutes?.toString()}
                          onValueChange={(v) =>
                            setFormData((prev) => ({
                              ...prev,
                              slotDurationMinutes: parseInt(v),
                            }))
                          }
                        >
                          <SelectTrigger className="h-11 bg-slate-50 border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                            {[15, 20, 30, 45, 60].map((m) => (
                              <SelectItem
                                key={m}
                                value={m.toString()}
                                className="text-sm text-slate-700 focus:bg-slate-50"
                              >
                                {m} minutes
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Off Days */}
                      <div className="space-y-2.5">
                        <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                          Off Days
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Sun",
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                          ].map((day, i) => {
                            const isExcluded =
                              formData.availabilityRange.excludedWeekdays.includes(
                                i,
                              );
                            return (
                              <motion.button
                                type="button"
                                key={i}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleExcludedDaysChange(
                                    i,
                                    !formData.availabilityRange.excludedWeekdays.includes(
                                      i,
                                    ),
                                  )
                                }
                                className={`w-11 h-11 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                                  isExcluded
                                    ? "bg-red-50 border-red-200 text-red-500"
                                    : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100"
                                }`}
                              >
                                {day}
                              </motion.button>
                            );
                          })}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Tap a day to mark it as off
                        </p>
                      </div>

                      {/* Daily Sessions */}
                      <div className="space-y-2.5">
                        <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                          Daily Sessions
                        </Label>

                        <div className="space-y-2.5">
                          {formData.dailyTimeRanges.map((range, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-end gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg"
                            >
                              <div className="flex-1 space-y-1.5">
                                <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                                  Start
                                </Label>
                                <Input
                                  type="time"
                                  value={range.start}
                                  onChange={(e) => {
                                    const newR = [...formData.dailyTimeRanges];
                                    newR[idx].start = e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      dailyTimeRanges: newR,
                                    }));
                                  }}
                                  className="h-10 bg-white border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all text-sm"
                                />
                              </div>

                              <div className="flex-1 space-y-1.5">
                                <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                                  End
                                </Label>
                                <Input
                                  type="time"
                                  value={range.end}
                                  onChange={(e) => {
                                    const newR = [...formData.dailyTimeRanges];
                                    newR[idx].end = e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      dailyTimeRanges: newR,
                                    }));
                                  }}
                                  className="h-10 bg-white border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all text-sm"
                                />
                              </div>

                              {formData.dailyTimeRanges.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      dailyTimeRanges:
                                        prev.dailyTimeRanges.filter(
                                          (_, i) => i !== idx,
                                        ),
                                    }))
                                  }
                                  className="h-10 px-3 text-xs font-medium text-red-400 border border-red-100 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-500 transition-all"
                                >
                                  Remove
                                </button>
                              )}
                            </motion.div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              dailyTimeRanges: [
                                ...prev.dailyTimeRanges,
                                { start: "18:00", end: "21:00" },
                              ],
                            }))
                          }
                          className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-500 border border-dashed border-slate-300 rounded-lg px-4 py-2.5 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all"
                        >
                          + Add Session
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </MotionConfig>

              {/* Navigation */}
              <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-8"
                >
                  Previous
                </Button>

                {currentStep < 3 ? (
                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="px-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                  >
                    Next Step →
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-xl"
                  >
                    {loading ? "Saving Profile..." : "Complete Setup ✓"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default DoctorOnboardingForm;
