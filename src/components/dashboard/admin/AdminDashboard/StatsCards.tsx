"use client";
import {
  TrendingUp,
  GraduationCap,
  BookOpen,
  ShoppingBag,
  PackageCheck,
} from "lucide-react";

interface StatsProps {
  statsData: {
    totalStudents: string;
    activeCourses: string;
    grossRevenue: string;
    pendingOrders: string;
  };
}

export default function StatsCards({ statsData }: StatsProps) {
  const cardsConfig = [
    {
      label: "সর্বমোট শিক্ষার্থী",
      value: statsData?.totalStudents || "০",
      change: "+১২.৪%",
      up: true,
      sub: "সক্রিয় ছাত্র ড্যাশবোর্ড",
      icon: GraduationCap,
      color: "#1B4332",
      bg: "rgba(27,67,50,0.08)",
    },
    {
      label: "সক্রিয় কোর্সসমূহ",
      value: statsData?.activeCourses || "০",
      change: "চলমান",
      up: true,
      sub: "পাবলিশড কোর্স প্যানেল",
      icon: BookOpen,
      color: "#2D6A4F",
      bg: "rgba(45,106,79,0.08)",
    },
    {
      label: "মোট গ্রোস রেভিনিউ",
      value: statsData?.grossRevenue || "৳০",
      change: "+১৫.১%",
      up: true,
      sub: "সর্বমোট অর্জিত তহবিল",
      icon: ShoppingBag,
      color: "#D4A017",
      bg: "rgba(212,160,23,0.10)",
    },
    {
      label: "পেন্ডিং এনরোলমেন্ট",
      value: statsData?.pendingOrders || "০",
      change: "অপেক্ষমান",
      up: false,
      sub: "ভেরিফিকেশন প্রয়োজন",
      icon: PackageCheck,
      color: "#B45309",
      bg: "rgba(180,83,9,0.08)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cardsConfig.map((s) => {
        const IconComponent = s.icon;
        return (
          <div
            key={s.label}
            className="stat-card relative overflow-hidden bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm"
          >
            <div
              className="absolute top-0 right-0 w-20 h-20 opacity-5 pointer-events-none"
              style={{
                background: `radial-gradient(circle at top right, ${s.color}, transparent)`,
              }}
            />
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                style={{ background: s.bg, color: s.color }}
              >
                <IconComponent size={20} />
              </div>
              <span className="badge text-xs px-2.5 py-0.5 rounded-md font-bold text-green-700 bg-green-50 flex items-center">
                <TrendingUp size={11} className="mr-1" /> {s.change}
              </span>
            </div>
            <div className="text-2xl font-black text-neutral-800 tracking-tight mb-0.5">
              {s.value}
            </div>
            <div className="text-sm font-bold text-neutral-500">{s.label}</div>
            <div className="text-xs text-neutral-400 mt-0.5">{s.sub}</div>
          </div>
        );
      })}
    </div>
  );
}