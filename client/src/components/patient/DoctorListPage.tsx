"use client";
import { DoctorFilters } from "@/lib/types";
import { useDoctorStore } from "@/store/doctorStore";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import { Filter, MapPin, Search, Star, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cities, healthcareCategories, specializations } from "@/lib/constant";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function DoctorListPage() {
  const searchParams = useSearchParams();
  const categoryParams = searchParams.get("category");

  const { doctors, loading, fetchDoctors } = useDoctorStore();

  const [filters, setFilters] = useState<DoctorFilters>({
    search: "",
    specialization: "",
    category: categoryParams || "",
    city: "",
    sortBy: "experience",
    sortOrder: "desc",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Convert "all" to empty string
  const handleFilterChange = (key: keyof DoctorFilters, value: string) => {
    const newValue = value === "all" ? "" : value;
    setFilters((prev) => ({ ...prev, [key]: newValue }));
  };

  useEffect(() => {
    fetchDoctors(filters);
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      search: "",
      specialization: "",
      category: categoryParams || "",
      city: "",
      sortBy: "experience",
      sortOrder: "desc",
    });
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v && !["experience", "desc"].includes(v as string),
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Find the Right Doctor
          </motion.h1>

          <p className="text-lg md:text-xl opacity-90">
            Book appointments with top specialists instantly
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        {/* Search & Filter Bar */}
        <Card className="relative border-0 rounded-3xl bg-white/80 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* subtle gradient border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-200/30 via-cyan-200/20 to-teal-200/30 pointer-events-none" />

          <CardContent className="relative p-6">
            {/* 🔍 SEARCH + FILTER */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition" />

                <Input
                  placeholder="Search doctors, specialties, conditions..."
                  className="pl-14 pr-4 h-14 text-base rounded-2xl border-0 bg-gray-50/80 focus:bg-white focus:ring-2 focus:ring-blue-500 shadow-inner transition-all"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />

                {/* subtle glow on focus */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 bg-blue-100/30 blur-xl transition pointer-events-none" />
              </div>

              {/* Filter Button */}
              <Button
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-white text-blue-600 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            {/* 🧩 CATEGORY PILLS */}
            <div className="mt-6 flex flex-wrap gap-3">
              {/* ALL */}
              <button
                onClick={() => handleFilterChange("category", "all")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all
        ${
          !filters.category
            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
              >
                All
              </button>

              {healthcareCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange("category", cat.title)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
          ${
            filters.category === cat.title
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-7 h-7 ${cat.color} rounded-full flex items-center justify-center`}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={cat.icon} />
                    </svg>
                  </div>

                  {cat.title}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="relative mt-6 rounded-3xl border-0 bg-white/80 backdrop-blur-2xl shadow-2xl overflow-hidden">
                {/* subtle gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-cyan-200/10 to-teal-200/20 pointer-events-none" />

                <CardContent className="relative p-7">
                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-7">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Refine Your Search
                      </h3>
                      <p className="text-sm text-gray-500">
                        Narrow down results with advanced filters
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFilters(false)}
                      className="rounded-full hover:bg-gray-100 transition"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </Button>
                  </div>

                  {/* FILTER GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Specialization */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Specialization
                      </label>

                      <Select
                        value={filters.specialization || "all"}
                        onValueChange={(v) =>
                          handleFilterChange("specialization", v)
                        }
                      >
                        <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-0 shadow-inner focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="All Specializations" />
                        </SelectTrigger>

                        <SelectContent className="rounded-xl">
                          <SelectItem value="all">
                            All Specializations
                          </SelectItem>
                          {specializations.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        City
                      </label>

                      <Select
                        value={filters.city || "all"}
                        onValueChange={(v) => handleFilterChange("city", v)}
                      >
                        <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-0 shadow-inner focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="All Cities" />
                        </SelectTrigger>

                        <SelectContent className="rounded-xl">
                          <SelectItem value="all">All Cities</SelectItem>
                          {cities.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Sort By
                      </label>

                      <Select
                        value={filters.sortBy}
                        onValueChange={(v) => handleFilterChange("sortBy", v)}
                      >
                        <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-0 shadow-inner focus:ring-2 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent className="rounded-xl">
                          <SelectItem value="experience">Experience</SelectItem>
                          <SelectItem value="fees">Consultation Fee</SelectItem>
                          <SelectItem value="name">Name A-Z</SelectItem>
                          <SelectItem value="createdAt">
                            Newest First
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* CLEAR BUTTON */}
                    <div className="flex items-end">
                      <Button
                        onClick={clearFilters}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white font-medium shadow-md hover:shadow-lg transition-all"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {/* ACTIVE FILTERS (optional premium touch) */}
                  {(filters.specialization ||
                    filters.city ||
                    filters.sortBy !== "experience") && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="text-xs text-gray-500">Active:</span>

                      {filters.specialization && (
                        <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {filters.specialization}
                        </span>
                      )}

                      {filters.city && (
                        <span className="px-3 py-1 text-xs bg-teal-100 text-teal-700 rounded-full">
                          {filters.city}
                        </span>
                      )}

                      {filters.sortBy && (
                        <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                          {filters.sortBy}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="mt-10 mb-6 flex justify-between items-center">
          <p className="text-gray-600 font-medium">
            {loading
              ? "Searching doctors..."
              : `${doctors.length} doctor${
                  doctors.length !== 1 ? "s" : ""
                } found`}
          </p>
        </div>

        {/* Doctor Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-7">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 mx-auto mb-4" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {doctors.map((doctor, idx) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.06,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="group"
              >
                <Card className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md z-10"
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    LIVE
                  </motion.div>
                  <CardContent className="p-6 flex-1 flex flex-col gap-5">
                    {/* ── Header ── */}
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center text-3xl">
                          👨‍⚕️
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>

                      {/* Name + Spec + Rating */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <h3 className="font-semibold text-slate-800 text-base leading-tight truncate">
                          {doctor.name}
                        </h3>
                        <p className="text-slate-500 text-sm mt-0.5 truncate">
                          {doctor.specialization}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-md px-2 py-0.5">
                            <svg
                              className="w-3 h-3 text-amber-400 fill-amber-400"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs font-semibold text-amber-600">
                              4.9
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">
                            {doctor.experience}+ yrs exp
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ── Category Tags ── */}
                    <div className="flex flex-wrap gap-1.5">
                      {doctor.category?.slice(0, 3).map((cat, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-slate-100 text-slate-500 border border-slate-200"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* ── Divider ── */}
                    <div className="border-t border-slate-100" />

                    {/* ── Fee + Location ── */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-0.5">
                          Consultation Fee
                        </p>
                        <p className="text-2xl font-semibold text-slate-800 tracking-tight">
                          ₹{doctor.fees}
                          <span className="text-xs font-normal text-slate-400 ml-1">
                            / session
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          Available
                        </span>
                        <div className="flex items-center justify-end gap-1 mt-1.5 text-slate-400 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>{doctor.hospitalInfo?.city || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* ── Book Button ── */}
                    <div className="mt-auto pt-1">
                      <Link href={`/patient/booking/${doctor._id}`}>
                        <Button className="w-full h-11 rounded-xl bg-blue-900 hover:bg-blue-700 text-white text-sm font-semibold shadow-none transition-all duration-200 group-hover:shadow-md active:scale-95">
                          Book Consultation
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="relative p-12 md:p-16 text-center rounded-3xl border-0 bg-white/70 backdrop-blur-2xl shadow-2xl overflow-hidden">
            {/* gradient glow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-cyan-100/20 to-teal-100/30 pointer-events-none" />

            <div className="relative z-10">
              {/* Icon with soft animation */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex justify-center mb-6"
              >
                <div className="w-24 h-24 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 shadow-inner">
                  <Search className="w-12 h-12 text-blue-400" />
                </div>
              </motion.div>

              {/* Heading */}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                No Doctors Found
              </h3>

              {/* Subtext */}
              <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm md:text-base">
                We couldn't find any doctors matching your search or filters.
                Try adjusting your criteria or explore all available doctors.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {/* Clear Filters */}
                <Button
                  size="lg"
                  onClick={clearFilters}
                  className="px-8 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-md hover:shadow-xl transition-all"
                >
                  Clear Filters
                </Button>

                {/* Optional secondary action */}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleFilterChange("category", "all")}
                  className="px-8 h-12 rounded-xl border-gray-300"
                >
                  View All Doctors
                </Button>
              </div>
            </div>

            {/* subtle bottom glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-24 bg-blue-200/30 blur-3xl rounded-full" />
          </Card>
        )}
      </div>
    </div>
  );
}

export default DoctorListPage;
