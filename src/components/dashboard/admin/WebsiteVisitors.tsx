"use client";

import { useEffect, useState } from "react";

// ১. টাইপ ডেফিনিশন (TypeScript Interfaces)
interface VisitorStats {
  totalVisitors: number;
  todayVisitors: number;
  yesterdayVisitors: number;
  monthlyVisitors: number;
}

interface ApiResponse {
  success: boolean;
  data: VisitorStats;
  message?: string;
}

const WebsiteVisitors = () => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://darulislam-server-blond.vercel.app/api/visitors/stats",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch visitor statistics.");
        }

        const result: ApiResponse = await response.json();

        if (result.success) {
          setStats(result.data);
        } else {
          setError(result.message || "Something went wrong.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  // লোডিং স্টেট - Skeleton Loader
  if (loading) {
    return (
      <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 space-y-3 animate-pulse"
            >
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // এরর স্টেট
  if (error || !stats) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl">
        <p className="font-medium">{error || "Failed to load stats."}</p>
      </div>
    );
  }

  // স্ট্যাট ডেটা ফরম্যাট করার ফাংশন
  const statCards = [
    {
      title: "Total Visitors",
      value: stats.totalVisitors,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-100 dark:border-blue-900/50",
    },
    {
      title: "Today",
      value: stats.todayVisitors,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-100 dark:border-emerald-900/50",
    },
    {
      title: "Yesterday",
      value: stats.yesterdayVisitors,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-100 dark:border-amber-900/50",
    },
    {
      title: "This Month",
      value: stats.monthlyVisitors,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/40",
      border: "border-purple-100 dark:border-purple-900/50",
    },
  ];

  return (
    <section className="w-full p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      {/* হেডার */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Website Traffic Overview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time analytics for your platform
          </p>
        </div>
        <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Update
        </span>
      </div>

      {/* স্ট্যাট গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-md ${card.bg} ${card.border}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              {card.title}
            </p>
            <p className={`text-2xl font-extrabold ${card.color}`}>
              {card.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WebsiteVisitors;
