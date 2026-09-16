"use client";
import { Star, Users, BookOpenCheck } from "lucide-react";

interface TopCoursesProps {
  coursesData: Array<{
    title: string;
    instructor: string;
    students: number;
    rating: number;
    revenue: string;
    level: string;
    emoji: string;
  }>;
}

const levelStyle: Record<string, { bg: string; color: string; text: string }> =
  {
    "All Levels": {
      bg: "rgba(27,67,50,0.09)",
      color: "#1B4332",
      text: "সকল স্তর",
    },
    Academic: {
      bg: "rgba(212,160,23,0.12)",
      color: "#B45309",
      text: "একাডেমিক",
    },
  };

export default function TopCourses({ coursesData }: TopCoursesProps) {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 h-full">
      <div className="mb-5">
        <h3 className="font-black text-lg text-neutral-800">
          শীর্ষ পারফর্মিং কোর্সসমূহ
        </h3>
        <p className="text-xs text-neutral-400 font-medium mt-0.5">
          সর্বোচ্চ ভর্তি ও অর্জিত রাজস্বের ভিত্তিতে
        </p>
      </div>
      <div className="space-y-3">
        {coursesData.map((c, i) => {
          const ls = levelStyle[c.level] || levelStyle["All Levels"];
          return (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-neutral-100 hover:border-emerald-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-neutral-50 border border-neutral-100 text-[#1B4332]">
                <BookOpenCheck size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black text-neutral-800 truncate">
                  {c.title}
                </div>
                <div className="text-[10px] font-bold text-neutral-400 mt-0.5">
                  {c.instructor}
                </div>
                <div className="flex items-center gap-3 mt-1.5 font-bold">
                  <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                    <Users size={11} />
                    {c.students} জন
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-amber-500">
                    <Star size={11} fill="#D4A017" stroke="none" />
                    {c.rating}
                  </span>
                  <span
                    className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{ background: ls.bg, color: ls.color }}
                  >
                    {ls.text}
                  </span>
                </div>
              </div>
              <div className="text-xs font-black text-[#1B4332] shrink-0">
                {c.revenue}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}