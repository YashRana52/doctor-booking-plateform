"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Users,
  UserCheck,
  Calendar,
  IndianRupee,
  UserCog,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Area,
  CartesianGrid,
  AreaChart,
} from "recharts";

import { MonthlyRevenue, ReportData, DashboardStats } from "@/lib/types";
import { getWithAuth } from "@/service/httpService";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/dateUtills";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await getWithAuth("admin/dashboard");
      const data = response.data;

      setStats({
        totalPatients: data.totalPatients,
        totalDoctors: data.totalDoctors,
        totalAppointments: data.totalAppointments,
        completedAppointments: data.completedAppointments,
        pendingAppointments: data.pendingAppointments,
        totalRevenue: data.totalRevenue,
      });

      setMonthlyRevenue(data.monthlyRevenue || []);
      setReport({
        userGrowth: data.userGrowth || [],
        appointmentStats: data.statusStats || [],
      });
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fixed data mapping
  const revenueData = monthlyRevenue.map((item) => ({
    month: new Date(item._id.year, item._id.month - 1).toLocaleString(
      "default",
      { month: "short" },
    ),
    revenue: item?.totalRevenue! || 0, // ← was 'revenue' before
  }));

  const appointmentData =
    report?.appointmentStats?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const userGrowthData =
    report?.userGrowth?.map((item) => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleString(
        "default",
        { month: "short" },
      ),
      patients: item.totalUsers || 0, // ← was 'patients' before
    })) || [];

  // Empty state component
  const EmptyChart = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-[300px] text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <TrendingUp className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">
        Data will appear here once available
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Doctors */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Total Doctors
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                {stats?.totalDoctors || 0}
              </h2>
            </div>

            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <UserCheck className="text-blue-600" size={22} />
            </div>
          </CardContent>
        </Card>

        {/* Total Patients */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Total Patients
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                {stats?.totalPatients || 0}
              </h2>
            </div>

            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
              <Users className="text-green-600" size={22} />
            </div>
          </CardContent>
        </Card>

        {/* Total Appointments */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Total Appointments
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                {stats?.totalAppointments || 0}
              </h2>
            </div>

            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <Calendar className="text-orange-600" size={22} />
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Total Revenue
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-purple-600">
                ₹{stats?.totalRevenue?.toLocaleString("en-IN") || 0}
              </h2>
            </div>

            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <IndianRupee className="text-purple-600" size={22} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Revenue - Area Chart */}
        <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-sm shadow-slate-200/70">
          <CardHeader className="border-b bg-gradient-to-r from-indigo-50 via-white to-cyan-50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Monthly Revenue
                </CardTitle>

                <CardDescription className="mt-1 text-slate-500">
                  Revenue trend for the current year
                </CardDescription>
              </div>

              <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-600">
                ↑ 12.4%
                <span className="ml-1 text-xs font-medium text-slate-400">
                  YoY
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Revenue
                </p>

                <h3 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                  ₹{stats?.totalRevenue?.toLocaleString("en-IN") || 0}
                </h3>
              </div>

              <div className="rounded-2xl bg-indigo-50 px-4 py-2 text-right">
                <p className="text-xs font-medium text-slate-500">Reports</p>
                <p className="text-lg font-bold text-indigo-600">
                  {revenueData.length}
                </p>
              </div>
            </div>

            <div className="h-[250px]">
              {revenueData.length === 0 ? (
                <EmptyChart title="No revenue data yet" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="modernRevenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#4f46e5"
                          stopOpacity={0.38}
                        />
                        <stop
                          offset="55%"
                          stopColor="#06b6d4"
                          stopOpacity={0.14}
                        />
                        <stop
                          offset="100%"
                          stopColor="#06b6d4"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      dy={10}
                    />

                    <YAxis
                      tickFormatter={formatCurrency}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      width={70}
                    />

                    <Tooltip
                      formatter={(value) => {
                        const amount = Number(value || 0);

                        return [
                          `₹${amount.toLocaleString("en-IN")}`,
                          "Revenue",
                        ];
                      }}
                      labelStyle={{
                        color: "#0f172a",
                        fontWeight: 700,
                      }}
                      contentStyle={{
                        borderRadius: "18px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
                        padding: "12px 14px",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4f46e5"
                      strokeWidth={4}
                      fill="url(#modernRevenueGradient)"
                      dot={{
                        r: 4,
                        strokeWidth: 3,
                        stroke: "#ffffff",
                        fill: "#4f46e5",
                      }}
                      activeDot={{
                        r: 7,
                        strokeWidth: 4,
                        stroke: "#ffffff",
                        fill: "#06b6d4",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Appointment Status - Pie Chart */}
        <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-sm shadow-slate-200/70">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-cyan-50/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Appointment Status
                </CardTitle>
                <CardDescription className="mt-1">
                  Current appointment distribution
                </CardDescription>
              </div>

              <div className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                Live
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="h-[250px]">
              {appointmentData.length === 0 ? (
                <EmptyChart title="No appointments yet" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appointmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={105}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {appointmentData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#ffffff"
                          strokeWidth={4}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value, name) => [`${value}`, name]}
                      contentStyle={{
                        borderRadius: "16px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {appointmentData.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {appointmentData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />

                      <span className="text-sm font-medium capitalize text-slate-600">
                        {item.name}
                      </span>
                    </div>

                    <span className="text-sm font-bold text-slate-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth - Bar Chart */}
        <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-sm shadow-slate-200/70">
          <CardHeader className="border-b bg-gradient-to-r from-violet-50 via-white to-cyan-50 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  User Growth
                </CardTitle>

                <CardDescription className="mt-1 text-slate-500">
                  New patients registered per month
                </CardDescription>
              </div>

              <div className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                This Year
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Patients
                </p>

                <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  {stats?.totalPatients || 0}
                </h3>
              </div>

              <div className="rounded-2xl bg-cyan-50 px-4 py-2 text-right">
                <p className="text-xs font-medium text-slate-500">Reports</p>
                <p className="text-lg font-bold text-cyan-600">
                  {userGrowthData.length}
                </p>
              </div>
            </div>

            <div className="h-[250px]">
              {userGrowthData.length === 0 ? (
                <EmptyChart title="No user growth data yet" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userGrowthData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="modernUserGrowthGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#06b6d4"
                          stopOpacity={0.72}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      dy={8}
                    />

                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      width={38}
                    />

                    <Tooltip
                      cursor={{ fill: "rgba(139, 92, 246, 0.08)" }}
                      formatter={(value) => {
                        const patients = Number(value ?? 0);
                        return [`${patients}`, "Patients"];
                      }}
                      labelStyle={{
                        color: "#0f172a",
                        fontWeight: 700,
                      }}
                      contentStyle={{
                        borderRadius: "16px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 14px 34px rgba(15, 23, 42, 0.12)",
                        padding: "10px 12px",
                      }}
                    />

                    <Bar
                      dataKey="patients"
                      fill="url(#modernUserGrowthGradient)"
                      radius={[14, 14, 0, 0]}
                      maxBarSize={38}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-sm shadow-slate-200/70">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 via-white to-cyan-50 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Quick Actions
                </CardTitle>

                <CardDescription className="mt-1 text-slate-500">
                  Manage your platform efficiently
                </CardDescription>
              </div>

              <div className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                Admin
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-4">
            {/* Manage Users */}
            <button
              onClick={() => router.push("/admin/users")}
              className="group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 transition-all group-hover:bg-cyan-500">
                  <UserCog className="h-5 w-5 text-cyan-600 transition-all group-hover:text-white" />
                </div>

                <div className="text-left">
                  <p className="font-semibold text-slate-900">Manage Users</p>

                  <p className="text-sm text-slate-500">
                    Doctors & patients control
                  </p>
                </div>
              </div>

              <ArrowUpRight className="h-5 w-5 text-slate-400 transition-all group-hover:text-cyan-600" />
            </button>

            {/* Payments */}
            <button
              onClick={() => router.push("/admin/payments")}
              className="group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 transition-all group-hover:bg-violet-500">
                  <IndianRupee className="h-5 w-5 text-violet-600 transition-all group-hover:text-white" />
                </div>

                <div className="text-left">
                  <p className="font-semibold text-slate-900">
                    Process Payments
                  </p>

                  <p className="text-sm text-slate-500">
                    Revenue & transaction reports
                  </p>
                </div>
              </div>

              <ArrowUpRight className="h-5 w-5 text-slate-400 transition-all group-hover:text-violet-600" />
            </button>

            {/* Extra Info */}
            <div className="rounded-2xl bg-gradient-to-r from-cyan-50 to-violet-50 p-4">
              <p className="text-sm font-semibold text-slate-800">
                Platform Status
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Everything looks stable and operational.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
