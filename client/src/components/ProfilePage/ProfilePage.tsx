"use client";
import { healthcareCategories, specializations } from "@/lib/constant";
import { motion } from "framer-motion";
import { DoctorFormData } from "@/lib/types";
import { userAuthStore } from "@/store/authStore";
import {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Droplet,
  Edit3,
  FileText,
  GraduationCap,
  HeartPulse,
  Hospital,
  IndianRupee,
  Loader2,
  Mail,
  Map,
  MapPin,
  Pencil,
  Phone,
  Pill,
  Plus,
  Siren,
  Stethoscope,
  Tags,
  User,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import Header from "../landing/Header";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";

interface ProfileProps {
  userType: "doctor" | "patient";
}

function ProfilePage({ userType }: ProfileProps) {
  const { user, fetchProfile, updateProfile, loading } = userAuthStore();
  const [activeSection, setActiveSection] = useState("about");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    about: "",
    specialization: "",
    category: [],
    qualification: "",
    experience: 0,
    fees: 0,
    hospitalInfo: {
      name: "",
      address: "",
      city: "",
    },
    medicalHistory: {
      allergies: "",
      currentMedications: "",
      chronicConditions: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },

    availabilityRange: {
      startDate: "",
      endDate: "",
      excludedWeekdays: [],
    },
    dailyTimeRanges: [],
    slotDurationMinutes: 30,
  });

  useEffect(() => {
    fetchProfile(userType);
  }, [fetchProfile, userType]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "",
        bloodGroup: user.bloodGroup || "",
        about: user.about || "",
        specialization: user.specialization || "",
        category: user.category || [],
        qualification: user.qualification || "",
        experience: user.experience || 0,
        fees: user.fees || 0,
        hospitalInfo: {
          name: user.hospitalInfo?.name || "",
          address: user.hospitalInfo?.address || "",
          city: user.hospitalInfo?.city || "",
        },
        medicalHistory: {
          allergies: user.medicalHistory?.allergies || "",
          currentMedications: user.medicalHistory?.currentMedications || "",
          chronicConditions: user.medicalHistory?.chronicConditions || "",
        },
        emergencyContact: {
          name: user.emergencyContact?.name || "",
          phone: user.emergencyContact?.phone || "",
          relationship: user.emergencyContact?.relationship || "",
        },
        availabilityRange: {
          startDate: user.availabilityRange?.startDate || "",
          endDate: user.availabilityRange?.endDate || "",
          excludedWeekdays: user.availabilityRange?.excludedWeekdays || [],
        },
        dailyTimeRanges: user.dailyTimeRanges || [],
        slotDurationMinutes: user.slotDurationMinutes || 30,
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const handleArrayChnage = (
    field: string,
    index: number,
    subField: string,
    value: any,
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].map((item: any, i: number) =>
        i === index ? { ...item, [subField]: value } : item,
      ),
    }));
  };
  const handleCategorySelect = (category: any): void => {
    if (!formData.category.includes(category.title)) {
      handleInputChange("category", [...formData.category, category.title]);
    }
  };

  const handleCategoryDelete = (indexToDelete: number) => {
    const currentCategies = [...formData.category];
    const newCategories = currentCategies.filter(
      (_: any, i: number) => i !== indexToDelete,
    );
    setFormData((prev: any) => ({
      ...prev,
      category: newCategories,
    }));
  };

  const getAvailableCategories = () => {
    return healthcareCategories.filter(
      (cat) => !formData.category.includes(cat.title),
    );
  };

  const addTimeRange = () => {
    setFormData((prev: any) => ({
      ...prev,
      dailyTimeRanges: [
        ...prev.dailyTimeRanges,
        { start: "09:00", end: "17:00" },
      ],
    }));
  };

  const removeTimeRange = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      dailyTimeRanges: prev.dailyTimeRanges.filter(
        (_: any, i: number) => i !== index,
      ),
    }));
  };

  const handleWeekday = (weekday: number) => {
    const excludedWeekdays = [...formData.availabilityRange.excludedWeekdays];
    const index = excludedWeekdays.indexOf(weekday);
    if (index > -1) {
      excludedWeekdays.splice(index, 1);
    } else {
      excludedWeekdays.push(weekday);
    }
    handleInputChange("availabilityRange.excludedWeekdays", excludedWeekdays);
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return "";

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };
  const sidebarItems =
    userType === "doctor"
      ? [
          { id: "about", label: "About", icon: User },
          { id: "professional", label: "Professional Info", icon: Stethoscope },
          { id: "hospital", label: "Hospital Information", icon: MapPin },
          { id: "availability", label: "Availability", icon: Clock },
        ]
      : [
          { id: "about", label: "About", icon: User },
          { id: "contact", label: "Contact Information", icon: Phone },
          { id: "medical", label: "Medical History", icon: FileText },
          { id: "emergency", label: "Emergency Contact", icon: Phone },
        ];

  // About section
  const renderAboutSection = () => (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="flex items-start gap-5 pb-8 border-b border-gray-200">
        <div
          className={`p-4 rounded-2xl flex-shrink-0 ${userType === "doctor" ? "bg-blue-100" : "bg-indigo-100"}`}
        >
          {userType === "doctor" ? (
            <Stethoscope className="w-8 h-8 text-blue-700" />
          ) : (
            <User className="w-8 h-8 text-indigo-700" />
          )}
        </div>

        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
            {userType === "doctor"
              ? "Professional Profile"
              : "Personal Information"}
          </h2>
          <p className="text-gray-600 mt-3 text-[17px] leading-relaxed max-w-2xl">
            {isEditing
              ? "Make changes below and click 'Save Changes' when you're done."
              : userType === "doctor"
                ? "This information appears on your public doctor profile and helps patients know you better."
                : "Keep your personal details accurate and up to date."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Legal First Name */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4" />
            Legal First Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            disabled={!isEditing}
            placeholder="Enter your first name"
            className="h-14 text-base rounded-2xl border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent disabled:bg-gray-50 transition-all"
          />
        </div>

        {/* Patient-only Fields */}
        {userType === "patient" && (
          <>
            {/* Date of Birth */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </Label>
              <div className="relative">
                <Input
                  id="dob"
                  type="date"
                  value={
                    formData.dob
                      ? new Date(formData.dob).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  disabled={!isEditing}
                  className="h-14 pl-11 text-base rounded-2xl border-gray-300 focus-visible:ring-blue-600 disabled:bg-gray-50"
                />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-3 md:col-span-2">
              <Label className="text-sm font-semibold text-gray-700">
                Gender
              </Label>
              <RadioGroup
                value={formData.gender || ""}
                onValueChange={(value) => handleInputChange("gender", value)}
                disabled={!isEditing}
                className="flex flex-wrap gap-8"
              >
                {["Male", "Female", "Other"].map((option) => (
                  <div key={option} className="flex items-center gap-3">
                    <RadioGroupItem
                      value={option.toLowerCase()}
                      id={option.toLowerCase()}
                      className="w-5 h-5"
                    />
                    <Label
                      htmlFor={option.toLowerCase()}
                      className="text-base font-medium text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-red-500" />
                Blood Group
              </Label>
              <Select
                value={formData.bloodGroup || ""}
                onValueChange={(value) =>
                  handleInputChange("bloodGroup", value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger className="h-14 rounded-2xl border-gray-300 focus:ring-blue-600 text-base">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <SelectItem
                        key={group}
                        value={group}
                        className="text-base py-3"
                      >
                        {group}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Doctor: About You - Full Width Highlighted Card */}
        {userType === "doctor" && (
          <div className="md:col-span-2 bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-100 rounded-3xl p-8 lg:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-600 rounded-2xl">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  About You
                </h3>
                <p className="text-gray-600 mt-1">
                  Tell patients about your experience, specialties, and approach
                  to care
                </p>
              </div>
            </div>

            <Textarea
              id="about"
              placeholder="Introduce yourself professionally... (e.g., Board-certified cardiologist with 15+ years of experience...)"
              value={formData.about || ""}
              onChange={(e) => handleInputChange("about", e.target.value)}
              disabled={!isEditing}
              rows={7}
              className="resize-none text-base rounded-2xl border-gray-300 focus-visible:ring-blue-600 bg-white placeholder:text-gray-400"
            />

            <div className="flex items-center justify-between mt-4 text-sm">
              <p className="text-gray-500">
                {formData.about?.length || 0} / 1000 characters
              </p>
              {isEditing && (
                <p className="text-blue-600 font-medium">
                  This will be visible on your public profile
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  //profesional section
  const renderProfessionalSection = () => (
    <div className="space-y-8">
      {/* Specialization - Modern Select */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-600" />
          Specialization
        </Label>
        <Select
          value={formData.specialization}
          onValueChange={(value) => handleInputChange("specialization", value)}
          disabled={!isEditing}
        >
          <SelectTrigger
            className={`w-full h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all ${
              !isEditing ? "bg-gray-50" : ""
            }`}
          >
            <SelectValue placeholder="Select your specialization" />
          </SelectTrigger>
          <SelectContent>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>
                <span className="font-medium">{spec}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories - Chip Style with Color Dots */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Tags className="w-4 h-4 text-blue-600" />
          Practice Categories
        </Label>
        <div className="flex flex-wrap gap-3">
          {formData.category?.map((cat: string, index: number) => {
            const categoryObj = getAvailableCategories().find(
              (c) => c.title === cat,
            );
            return (
              <Badge
                key={index}
                variant="outline"
                className="px-4 py-2 text-sm font-medium border-gray-200 bg-white hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-2">
                  {categoryObj && (
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${categoryObj.color}`}
                    />
                  )}
                  <span>{cat}</span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCategoryDelete(index);
                      }}
                      className="ml-2 -mr-1 p-0.5 rounded-full hover:bg-gray-200 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </Badge>
            );
          })}

          {/* Add New Category */}
          {isEditing && getAvailableCategories().length > 0 && (
            <Select
              onValueChange={(value) => {
                const selected = getAvailableCategories().find(
                  (c) => c.id === value,
                );
                if (selected) handleCategorySelect(selected);
              }}
            >
              <SelectTrigger className="w-56 h-10 border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 transition">
                <SelectValue placeholder="+ Add category" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableCategories().map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${category.color}`}
                      />
                      <span className="font-medium">{category.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {isEditing && getAvailableCategories().length === 0 && (
            <p className="text-sm text-gray-500 italic">All categories added</p>
          )}
        </div>
      </div>

      {/* Qualification */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          Qualification
        </Label>
        <Input
          value={formData.qualification}
          onChange={(e) => handleInputChange("qualification", e.target.value)}
          disabled={!isEditing}
          placeholder="e.g., MBBS, MD (Internal Medicine), FACC"
          className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
        />
      </div>

      {/* Experience & Fees - Side by Side on Larger Screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Experience */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Experience
          </Label>
          <div className="relative">
            <Input
              type="number"
              value={formData.experience || ""}
              onChange={(e) =>
                handleInputChange("experience", parseInt(e.target.value) || 0)
              }
              disabled={!isEditing}
              placeholder="0"
              className="h-12 pl-10 text-base border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>

        {/* Consultation Fees */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-blue-600" />
            Consultation Fee
          </Label>
          <div className="relative">
            <Input
              type="number"
              value={formData.fees || ""}
              onChange={(e) =>
                handleInputChange("fees", parseInt(e.target.value) || 0)
              }
              disabled={!isEditing}
              placeholder="0"
              className="h-12 pl-12 text-base border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium pointer-events-none">
              ₹
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  //hospital info

  const renderHospitalSection = () => (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Hospital / Clinic Information
            </h3>
            <p className="text-sm text-gray-500">
              Details about your hospital or clinic
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Hospital Name */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Hospital className="w-4 h-4 text-blue-500" />
              Hospital / Clinic Name
            </Label>

            <Input
              value={formData.hospitalInfo?.name || ""}
              onChange={(e) =>
                handleInputChange("hospitalInfo.name", e.target.value)
              }
              disabled={!isEditing}
              placeholder={
                isEditing ? "Apollo Hospital, City Care Clinic..." : ""
              }
              className={`
              h-11 rounded-xl transition-all
              ${
                isEditing
                  ? "focus-visible:ring-2 focus-visible:ring-blue-500/30"
                  : "bg-muted/40"
              }
            `}
            />
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              Address
            </Label>

            <Textarea
              rows={3}
              value={formData.hospitalInfo?.address || ""}
              onChange={(e) =>
                handleInputChange("hospitalInfo.address", e.target.value)
              }
              disabled={!isEditing}
              placeholder={
                isEditing ? "Full address of the hospital or clinic" : ""
              }
              className={`
              rounded-xl resize-none transition-all
              ${
                isEditing
                  ? "focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                  : "bg-muted/40"
              }
            `}
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Map className="w-4 h-4 text-purple-500" />
              City
            </Label>

            <Input
              value={formData.hospitalInfo?.city || ""}
              onChange={(e) =>
                handleInputChange("hospitalInfo.city", e.target.value)
              }
              disabled={!isEditing}
              placeholder={isEditing ? "Mumbai, Delhi, Bangalore..." : ""}
              className={`
              h-11 rounded-xl transition-all
              ${
                isEditing
                  ? "focus-visible:ring-2 focus-visible:ring-purple-500/30"
                  : "bg-muted/40"
              }
            `}
            />
          </div>
        </div>
      </div>
    </div>
  );

  //availability

  const renderAvailability = () => {
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return (
      <div className="space-y-8">
        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="available-from">Available From</Label>
            <Input
              id="available-from"
              type="date"
              value={formatDateForInput(formData.availabilityRange?.startDate)}
              onChange={(e) =>
                handleInputChange("availabilityRange.startDate", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="available-until">Available Until</Label>
            <Input
              id="available-until"
              type="date"
              value={formatDateForInput(formData.availabilityRange?.endDate)}
              onChange={(e) =>
                handleInputChange("availabilityRange.endDate", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Excluded Weekdays */}
        <div className="space-y-3">
          <Label>Excluded Weekdays</Label>
          <div className="flex flex-wrap gap-4">
            {weekdays.map((day, index) => (
              <label
                key={day}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <Checkbox
                  checked={
                    formData.availabilityRange?.excludedWeekdays?.includes(
                      index,
                    ) ?? false
                  }
                  onCheckedChange={() => handleWeekday(index)}
                  disabled={!isEditing}
                />
                <span className="text-sm font-medium">{day}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Daily Time Ranges */}
        <div className="space-y-4">
          <Label>Daily Available Time Ranges</Label>
          <div className="space-y-3">
            {formData.dailyTimeRanges?.map((range: any, index: any) => (
              <div key={index} className="flex items-center gap-3">
                <Input
                  type="time"
                  value={range.start || ""}
                  onChange={(e) =>
                    handleArrayChnage(
                      "dailyTimeRanges",
                      index,
                      "start",
                      e.target.value,
                    )
                  }
                  disabled={!isEditing}
                  className="w-36"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={range.end || ""}
                  onChange={(e) =>
                    handleArrayChnage(
                      "dailyTimeRanges",
                      index,
                      "end",
                      e.target.value,
                    )
                  }
                  disabled={!isEditing}
                  className="w-36"
                />
                {isEditing && formData.dailyTimeRanges.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTimeRange(index)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            {isEditing && (
              <Button variant="outline" size="sm" onClick={addTimeRange}>
                <Plus className="w-4 h-4 mr-2" />
                Add Time Range
              </Button>
            )}
          </div>
        </div>

        {/* Slot Duration */}
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="slot-duration">Slot Duration</Label>
          <Select
            value={formData.slotDurationMinutes?.toString()}
            onValueChange={(value) =>
              handleInputChange("slotDurationMinutes", parseInt(value))
            }
            disabled={!isEditing}
          >
            <SelectTrigger id="slot-duration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {[15, 20, 30, 45, 60].map((minutes) => (
                <SelectItem key={minutes} value={minutes.toString()}>
                  {minutes} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const renderContactSection = () => (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-2xl">
            <Phone className="w-7 h-7 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
              Contact Information
            </h3>
            <p className="text-gray-600 mt-1 text-[15px]">
              How patients and the platform can reach you
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Phone Number */}
        <div className="space-y-3">
          <Label
            htmlFor="phone"
            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Phone Number
          </Label>

          <div className="relative">
            <Input
              id="phone"
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
              placeholder="+91 98765 43210"
              className="h-14 text-base rounded-2xl border-gray-300 
                     focus-visible:ring-2 focus-visible:ring-emerald-600 
                     focus-visible:border-transparent transition-all duration-200
                     disabled:bg-gray-50 disabled:text-gray-500"
            />

            {isEditing && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                <Phone className="w-5 h-5" />
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 pl-1">
            This number will be visible to patients for appointments
          </p>
        </div>

        {/* Email Address */}
        <div className="space-y-3">
          <Label
            htmlFor="email"
            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Email Address
          </Label>

          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            disabled
            className="h-14 text-base rounded-2xl bg-gray-50 border-gray-200 
                   text-gray-500 cursor-not-allowed font-medium"
          />

          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            Email cannot be changed as it is linked to your account
          </div>
        </div>
      </div>

      {/* Optional Help Text */}
      {isEditing && (
        <div className="pt-6 border-t border-gray-200 text-sm text-gray-500 bg-blue-50/50 p-5 rounded-2xl">
          <p>
            <span className="font-medium text-blue-700">Tip:</span> Make sure
            your phone number is active and WhatsApp-enabled for faster
            communication with patients.
          </p>
        </div>
      )}
    </div>
  );

  //medical section

  const renderMedicalSection = () => (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
          <Stethoscope className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Medical Information</h3>
          <p className="text-sm text-muted-foreground">
            Important health details for better diagnosis
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="grid gap-6">
        {/* Allergies */}
        <div className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition">
          <Label
            htmlFor="allergies"
            className="flex items-center gap-2 text-sm font-semibold mb-2"
          >
            <AlertCircle className="w-4 h-4 text-orange-500" />
            Allergies
          </Label>

          <Textarea
            id="allergies"
            rows={3}
            placeholder={
              isEditing
                ? "Penicillin, Peanuts, Dust, Latex..."
                : "No allergies mentioned"
            }
            value={formData.medicalHistory?.allergies || ""}
            onChange={(e) =>
              handleInputChange("medicalHistory.allergies", e.target.value)
            }
            disabled={!isEditing}
            className="resize-none text-base border-muted focus-visible:ring-2 focus-visible:ring-orange-500/30"
          />

          {isEditing && (
            <p className="text-xs text-muted-foreground mt-2">
              Mention any food, medicine or environmental allergies
            </p>
          )}
        </div>

        {/* Medications */}
        <div className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition">
          <Label
            htmlFor="medications"
            className="flex items-center gap-2 text-sm font-semibold mb-2"
          >
            <Pill className="w-4 h-4 text-blue-500" />
            Current Medications
          </Label>

          <Textarea
            id="medications"
            rows={3}
            placeholder={
              isEditing
                ? "Amlodipine 5mg daily, Metformin 500mg twice daily..."
                : "No medications listed"
            }
            value={formData.medicalHistory?.currentMedications || ""}
            onChange={(e) =>
              handleInputChange(
                "medicalHistory.currentMedications",
                e.target.value,
              )
            }
            disabled={!isEditing}
            className="resize-none text-base border-muted focus-visible:ring-2 focus-visible:ring-blue-500/30"
          />

          {isEditing && (
            <p className="text-xs text-muted-foreground mt-2">
              Include dosage and frequency if possible
            </p>
          )}
        </div>

        {/* Chronic Conditions */}
        <div className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition">
          <Label
            htmlFor="conditions"
            className="flex items-center gap-2 text-sm font-semibold mb-2"
          >
            <HeartPulse className="w-4 h-4 text-red-500" />
            Chronic Conditions
          </Label>

          <Textarea
            id="conditions"
            rows={3}
            placeholder={
              isEditing
                ? "Diabetes Type 2, Hypertension, Asthma..."
                : "No chronic conditions mentioned"
            }
            value={formData.medicalHistory?.chronicConditions || ""}
            onChange={(e) =>
              handleInputChange(
                "medicalHistory.chronicConditions",
                e.target.value,
              )
            }
            disabled={!isEditing}
            className="resize-none text-base border-muted focus-visible:ring-2 focus-visible:ring-red-500/30"
          />

          {isEditing && (
            <p className="text-xs text-muted-foreground mt-2">
              Long-term health conditions like Diabetes, Thyroid, Arthritis
            </p>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!isEditing &&
        !formData.medicalHistory?.allergies &&
        !formData.medicalHistory?.currentMedications &&
        !formData.medicalHistory?.chronicConditions && (
          <div className="text-center py-12 border rounded-xl bg-muted/30">
            <Stethoscope className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
            <p className="text-sm font-medium text-muted-foreground">
              No medical information added yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click edit to add medical history
            </p>
          </div>
        )}
    </div>
  );

  const renderEmergencySection = () => (
    <div className="relative overflow-hidden rounded-2xl border border-red-200/40 bg-white/70 backdrop-blur-xl shadow-lg p-6 space-y-6">
      {/* Soft Gradient Glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-red-400/20 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-pink-400/20 blur-3xl rounded-full"></div>

      {/* Header */}
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-red-100 p-3 shadow-sm">
            <Siren className="w-5 h-5 text-red-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Emergency Contact
            </h3>
            <p className="text-sm text-gray-500">
              Used in case of urgent medical situations
            </p>
          </div>
        </div>

        {/* Badge */}
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-600">
          Important
        </span>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 z-10 relative">
        {/* Name */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4 text-red-500" />
            Full Name
          </Label>
          <Input
            value={formData.emergencyContact?.name || ""}
            onChange={(e) =>
              handleInputChange("emergencyContact.name", e.target.value)
            }
            disabled={!isEditing}
            placeholder={isEditing ? "Enter full name" : "Not added"}
            className="h-11 bg-white/80 border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-all"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4 text-red-500" />
            Phone Number
          </Label>
          <Input
            type="tel"
            value={formData.emergencyContact?.phone || ""}
            onChange={(e) =>
              handleInputChange("emergencyContact.phone", e.target.value)
            }
            disabled={!isEditing}
            placeholder={isEditing ? "+91 XXXXX XXXXX" : "Not added"}
            className="h-11 bg-white/80 border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-all"
          />
        </div>
      </div>

      {/* Relationship */}
      <div className="space-y-1.5 z-10 relative">
        <Label className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4 text-red-500" />
          Relationship
        </Label>
        <Select
          value={formData.emergencyContact?.relationship || ""}
          onValueChange={(value) =>
            handleInputChange("emergencyContact.relationship", value)
          }
          disabled={!isEditing}
        >
          <SelectTrigger className="h-11 bg-white/80 border-gray-200 focus:ring-2 focus:ring-red-200">
            <SelectValue
              placeholder={isEditing ? "Select relationship" : "Not specified"}
            />
          </SelectTrigger>
          <SelectContent>
            {[
              "Spouse",
              "Parent",
              "Child",
              "Sibling",
              "Friend",
              "Guardian",
              "Other",
            ].map((rel) => (
              <SelectItem key={rel} value={rel}>
                {rel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {!isEditing &&
        !formData.emergencyContact?.name &&
        !formData.emergencyContact?.phone &&
        !formData.emergencyContact?.relationship && (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400 z-10 relative">
            <div className="bg-red-100 p-4 rounded-full mb-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-sm font-medium text-gray-600">
              No emergency contact added
            </p>
            <p className="text-xs mt-1 text-gray-400">
              Add a trusted person for safety
            </p>
          </div>
        )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "about":
        return renderAboutSection();
      case "professional":
        return renderProfessionalSection();
      case "hospital":
        return renderHospitalSection();
      case "availability":
        return renderAvailability();
      case "contact":
        return renderContactSection();
      case "medical":
        return renderMedicalSection();
      case "emergency":
        return renderEmergencySection();
      default:
        renderAboutSection();
    }
  };
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header showDashBoardNav={true} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pt-16">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* User Card + Avatar */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative"
            >
              {/* Top Accent Gradient with subtle animation */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 origin-left"
              />

              <div className="p-8 lg:p-12 flex flex-col lg:flex-row gap-12 items-center lg:items-center">
                {/* Left: Profile Info */}
                <div className="flex items-start gap-10 flex-1">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative flex-shrink-0"
                  >
                    <Avatar className="w-36 h-36 ring-8 ring-white shadow-xl transition-all duration-300 hover:scale-105">
                      <AvatarImage src={user?.profileImage} alt={user?.name} />
                      <AvatarFallback className="text-7xl font-bold bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Online Indicator with pulse animation */}
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute bottom-2 right-2 bg-emerald-500 w-10 h-10 rounded-2xl border-[6px] border-white shadow-md flex items-center justify-center"
                    >
                      <div className="w-4 h-4 bg-white rounded-full animate-ping absolute"></div>
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </motion.div>
                  </motion.div>

                  <div className="pt-2 space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <h1 className="text-4xl lg:text-5xl font-semibold tracking-tighter text-gray-900">
                        {user?.name}
                      </h1>
                      <p className="text-xl text-gray-600 mt-2 font-medium">
                        {user?.email}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex flex-wrap gap-3"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-semibold shadow-sm cursor-pointer"
                      >
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-emerald-200"></div>
                        Verified Doctor
                      </motion.div>

                      <div className="inline-flex items-center px-5 py-2 bg-gray-100 text-gray-600 rounded-2xl text-sm font-medium">
                        Member since {new Date().getFullYear()}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Right: Modern Doctor Illustration with gentle floating animation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="hidden lg:block flex-shrink-0"
                >
                  <div className="relative w-[260px] h-[260px]">
                    {/* Soft Glow Background with slow pulse */}
                    <motion.div
                      animate={{ opacity: [0.6, 0.85, 0.6] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-blue-100/80 via-sky-100/70 to-teal-100/60 rounded-[4rem] blur-3xl"
                    />

                    <motion.svg
                      animate={{
                        y: [-8, 8, -8],
                        rotate: [-2, 2, -2],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      width="260"
                      height="260"
                      viewBox="0 0 260 260"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="drop-shadow-2xl"
                    >
                      {/* Background Soft Circles */}
                      <circle cx="130" cy="130" r="110" fill="#F0F9FF" />
                      <circle cx="130" cy="130" r="85" fill="#E0F2FE" />

                      {/* Doctor's Body / Coat */}
                      <rect
                        x="92"
                        y="135"
                        width="76"
                        height="88"
                        rx="20"
                        fill="#1E3A8A"
                      />
                      <ellipse
                        cx="130"
                        cy="195"
                        rx="38"
                        ry="28"
                        fill="#1E3A8A"
                      />

                      {/* Head */}
                      <circle cx="130" cy="92" r="38" fill="#FED7AA" />

                      {/* Hair */}
                      <path d="M95 65 Q130 38 165 65" fill="#1E2937" />

                      {/* Eyes */}
                      <ellipse cx="115" cy="88" rx="6" ry="8" fill="#1E3A8A" />
                      <ellipse cx="145" cy="88" rx="6" ry="8" fill="#1E3A8A" />

                      {/* Smile */}
                      <path
                        d="M115 105 Q130 115 145 105"
                        stroke="#1E3A8A"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                      />

                      {/* Stethoscope Tube */}
                      <path
                        d="M130 125 L130 148"
                        stroke="#0369A1"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      <path
                        d="M130 148 Q100 175 88 195"
                        stroke="#0369A1"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      <path
                        d="M130 148 Q160 175 172 195"
                        stroke="#0369A1"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />

                      {/* Ear Tips */}
                      <circle cx="88" cy="197" r="13" fill="#EF4444" />
                      <circle cx="172" cy="197" r="13" fill="#EF4444" />

                      {/* Diaphragm */}
                      <circle cx="130" cy="122" r="18" fill="#1E2937" />
                      <circle cx="130" cy="122" r="11" fill="#94A3B8" />

                      {/* Medical Cross Badge */}
                      <circle cx="195" cy="68" r="26" fill="#14B8A6" />
                      <text
                        x="195"
                        y="80"
                        textAnchor="middle"
                        fill="white"
                        fontSize="34"
                        fontWeight="700"
                      >
                        ✚
                      </text>

                      {/* Decorative Elements */}
                      <circle
                        cx="65"
                        cy="75"
                        r="8"
                        fill="#22D3EE"
                        opacity="0.6"
                      />
                      <circle
                        cx="185"
                        cy="165"
                        r="10"
                        fill="#67E8F9"
                        opacity="0.5"
                      />
                    </motion.svg>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Main Grid: Sidebar + Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-24">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all duration-200 group ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 transition-colors ${
                          activeSection === item.id
                            ? "text-white"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                      {activeSection === item.id && (
                        <div className="ml-auto w-1.5 h-8 bg-white/30 rounded-l-full"></div>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
                  {/* Modern Header with Glassmorphism + Gradient */}
                  <CardHeader className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white pb-12 pt-10 overflow-hidden">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(at_30%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />

                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <CardTitle className="text-4xl font-semibold tracking-tight">
                          {
                            sidebarItems.find(
                              (item) => item.id === activeSection,
                            )?.label
                          }
                        </CardTitle>
                        <p className="text-blue-100 mt-2 text-lg">
                          Manage your professional information
                        </p>
                      </div>

                      {/* Edit / Save Buttons - Premium Style */}
                      <div className="flex gap-3">
                        {isEditing ? (
                          <>
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={() => setIsEditing(false)}
                              className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md font-medium px-6 transition-all duration-200"
                            >
                              Cancel
                            </Button>

                            <Button
                              size="lg"
                              onClick={handleSave}
                              disabled={loading}
                              className="bg-white text-indigo-700 hover:bg-white hover:shadow-xl font-semibold px-8 shadow-lg transition-all duration-200 active:scale-[0.985]"
                            >
                              {loading ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                  Saving Changes...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="lg"
                            onClick={() => setIsEditing(true)}
                            className="bg-white text-indigo-700 hover:bg-gray-50 hover:shadow-xl font-semibold px-8 shadow-lg transition-all duration-200 active:scale-[0.985] flex items-center gap-2"
                          >
                            <Pencil className="h-5 w-5" />
                            Edit Profile
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Bottom fade line */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </CardHeader>

                  {/* Content Area - Clean & Spacious */}
                  <CardContent className="pt-12 pb-14 px-10 lg:px-12 bg-white">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {renderContent()}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
