"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  GraduationCap,
  CheckCircle2,
  CloudUpload,
  Star,
  Percent,
  ShoppingBag,
} from "lucide-react"

const weekData = [
  { day: "সোম", enrollments: 142, sales: 38 },
  { day: "মঙ্গল", enrollments: 98, sales: 52 },
  { day: "বুধ", enrollments: 176, sales: 61 },
  { day: "বৃহস্পতি", enrollments: 234, sales: 44 },
  { day: "শুক্র", enrollments: 312, sales: 87 },
  { day: "শনি", enrollments: 189, sales: 73 },
  { day: "রবি", enrollments: 156, sales: 65 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div
        className="bg-white border border-neutral-100 shadow-md p-2.5 rounded-xl text-xs"
        style={{ minWidth: 120 }}
      >
        <div className="font-bold mb-1 text-[#1B4332]">{label}বার</div>
        <div className="flex justify-between gap-3 font-medium">
          <span style={{ color: "#1B4332" }}>ভর্তি:</span>
          <b>{payload[0]?.value} জন</b>
        </div>
        <div className="flex justify-between gap-3 font-medium">
          <span style={{ color: "#D4A017" }}>বিক্রয়:</span>
          <b>{payload[1]?.value}টি</b>
        </div>
      </div>
    );
  }
  return null;
};

// ইমোজির পরিবর্তে আইকন ম্যাপিং ডিকশনারি
const iconFeedMap: Record<string, any> = {
  "🎓": GraduationCap,
  "✅": CheckCircle2,
  "📤": CloudUpload,
  "⭐": Star,
  "🏷️": Percent,
  "🛍️": ShoppingBag,
};

const feed = [
  {
    text: "তাজবীদ কোর্সে নতুন শিক্ষার্থী ভর্তি হয়েছে",
    time: "২ মিনিট আগে",
    icon: "🎓",
    color: "#1B4332",
  },
  {
    text: "অর্ডার #৪৮২১ সফলভাবে ডেলিভারি সম্পন্ন",
    time: "১৪ মিনিট আগে",
    icon: "✅",
    color: "#163828",
  },
  {
    text: "শায়খ আব্দুল্লাহ নতুন লেকচার আপলোড করেছেন",
    time: "১ ঘণ্টা আগে",
    icon: "📤",
    color: "#D4A017",
  },
  {
    text: "আজ সকালে ৫টি নতুন কোর্স রিভিউ পাওয়া গেছে",
    time: "২ ঘণ্টা আগে",
    icon: "⭐",
    color: "#B45309",
  },
  {
    text: "RAMADAN24 কুপনটি ১৮ বার ব্যবহৃত হয়েছে",
    time: "৩ ঘণ্টা আগে",
    icon: "🏷️",
    color: "#52796F",
  },
  {
    text: "নতুন পণ্য: জমজম ওয়াটার শপে যুক্ত করা হয়েছে",
    time: "৫ ঘণ্টা আগে",
    icon: "🛍️",
    color: "#2D6A4F",
  },
];

export default function WeeklyBar() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
        <h3 className="font-bold text-base mb-1 text-neutral-800">
          এই সপ্তাহের কর্মতৎপরতা
        </h3>
        <p className="text-xs mb-5 text-neutral-400 font-medium">
          দৈনিক কোর্স ভর্তি ও শপ বিক্রয়ের গ্রাফিকাল চার্ট
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weekData} barGap={4}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(27,67,50,0.07)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#9CA3AF", fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="enrollments"
              fill="#1B4332"
              radius={[5, 5, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="sales"
              fill="#D4A017"
              radius={[5, 5, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
        <div
          className="flex gap-4 mt-3 text-xs font-bold"
          style={{ color: "#52796F" }}
        >
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ background: "#1B4332" }}
            />
            কোর্স ভর্তি
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ background: "#D4A017" }}
            />
            শপ বিক্রয়
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
        <h3 className="font-bold text-base mb-1 text-neutral-800">
          লাইভ কার্যক্রম বিবরণী
        </h3>
        <p className="text-xs mb-5 text-neutral-400 font-medium">
          প্লাটফর্মে রিয়েল-টাইমে ঘটে যাওয়া ঘটনাবলী
        </p>
        <div className="space-y-3 max-h-[210px] overflow-y-auto pr-1">
          {feed.map((f, i) => {
            const IconComponent = iconFeedMap[f.icon] || GraduationCap;
            return (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-neutral-50 border border-neutral-100"
                  style={{ color: f.color }}
                >
                  <IconComponent size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neutral-700 tracking-tight leading-tight">
                    {f.text}
                  </p>
                  <p className="text-[11px] mt-0.5 text-neutral-400 font-medium">
                    {f.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}