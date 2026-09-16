"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Moon, CalendarDays } from "lucide-react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import CoursePieChart from "@/src/components/dashboard/admin/AdminDashboard/CoursePieChart";
import RecentOrders from "@/src/components/dashboard/admin/AdminDashboard/RecentOrders";
import RevenueChart from "@/src/components/dashboard/admin/AdminDashboard/RevenueChart";
import StatsCards from "@/src/components/dashboard/admin/AdminDashboard/StatsCards";
import TopCourses from "@/src/components/dashboard/admin/AdminDashboard/TopCourses";
import WeeklyBar from "@/src/components/dashboard/admin/AdminDashboard/WeeklyBar";
import WebsiteVisitors from "@/src/components/dashboard/admin/WebsiteVisitors";

const AdminPanelSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50/30 p-5 md:p-6 space-y-6 animate-pulse w-full">
      <div className="h-32 w-full bg-neutral-200 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 bg-white border border-neutral-100 rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const axiosSecure = useAxiosSecure();
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken;

  const { data: dashboardPayload, isLoading } = useQuery({
    queryKey: ["adminDashboardOverviewMetrics", token],
    queryFn: async () => {
      const response = await axiosSecure.get("/admin/dashboard-overview");
      return response.data?.data || null;
    },
    enabled: status === "authenticated" && !!token,
  });

  if (status === "loading" || isLoading || !dashboardPayload) {
    return <AdminPanelSkeleton />;
  }

  return (
    <div className="min-h-screen geometric-bg">
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-5 md:p-6 space-y-5 md:space-y-6">
          {/* Islamic greeting banner */}
          <div
            className="rounded-2xl px-5 md:px-6 py-5 flex items-center justify-between relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #163828 100%)",
            }}
          >
            <div className="relative z-10">
              <div className="text-white/60 text-sm mb-1 font-medium tracking-wide">
                بِسْمِ ٱللهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </div>
              <h2 className="text-white text-lg md:text-xl font-bold">
                আসসালামু আলাইকুম, অ্যাডমিন ম্যানেজার
              </h2>
              <p className="text-white/65 text-sm mt-1">
                দারুল ইসলামের আজকের সামগ্রিক কার্যক্রমের বিবরণী।
              </p>
            </div>

            <div className="relative z-10 hidden sm:flex flex-col items-end gap-2">
              <div
                className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5"
                style={{
                  background: "rgba(212,160,23,0.22)",
                  color: "#F0C040",
                }}
              >
                <Moon size={14} /> সিস্টেম সক্রিয় আছে
              </div>
              <div className="text-white/45 text-xs flex items-center gap-1">
                <CalendarDays size={12} />
                {new Date().toLocaleDateString("bn-BD", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <StatsCards statsData={dashboardPayload.stats} />
          <WebsiteVisitors />

          {/* Charts Layout Container */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2">
              <RevenueChart
                timelineData={dashboardPayload.charts?.timelineData || []}
              />
            </div>
            <CoursePieChart
              pieData={dashboardPayload.charts?.pieChartData || []}
            />
          </div>

          <WeeklyBar />

          {/* Core Telemetry Display Matrices */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
            <div className="xl:col-span-2">
              <TopCourses coursesData={dashboardPayload.topCourses || []} />
            </div>
            <div className="xl:col-span-3">
              <RecentOrders ordersData={dashboardPayload.recentOrders || []} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
