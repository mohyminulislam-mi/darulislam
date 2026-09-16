"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RevenueChartProps {
  timelineData: Array<{ month: string; courses: number; shop: number }>;
}

const monthBnMap: Record<string, string> = {
  Jan: "জানু",
  Feb: "ফেব্রু",
  Mar: "মার্চ",
  Apr: "এপ্রিল",
  May: "মে",
  Jun: "জুন",
  Jul: "জুল",
  Aug: "আগস্ট",
  Sep: "সেপ্টে",
  Oct: "অক্টো",
  Nov: "নভে",
  Dec: "ডিসে",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-neutral-100 shadow-xl rounded-2xl p-3 text-sm min-w-[160px]">
        <div className="font-black mb-2 text-[#1B4332]">
          {monthBnMap[label] || label} মাস
        </div>
        {payload.map((p: any) => (
          <div key={p.name} className="flex justify-between gap-4 font-bold">
            <span style={{ color: p.color }}>
              {p.name === "courses" ? "কোর্স ফি" : "শপ সেলস"}
            </span>
            <span className="text-neutral-800">
              ৳{p.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ timelineData }: RevenueChartProps) {
  const formattedTimelineData = timelineData.map((item) => ({
    ...item,
    month: monthBnMap[item.month] || item.month,
  }));

  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-lg text-neutral-800">
            মোট আয় ও রেভিনিউ বিবরণী
          </h3>
          <p className="text-xs text-neutral-400 font-medium mt-0.5">
            কোর্স এনরোলমেন্ট এবং শপ থেকে অর্জিত মোট আয়
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={formattedTimelineData}
          margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colCourses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1B4332" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#1B4332" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colShop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4A017" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#D4A017" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,67,50,0.07)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#9CA3AF", fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9CA3AF", fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(v) =>
              v === "courses" ? "অনলাইন কোর্স ফি" : "ই-কমার্স শপ সেলস"
            }
            wrapperStyle={{ fontSize: 12, fontWeight: 700 }}
          />
          <Area
            type="monotone"
            dataKey="courses"
            stroke="#1B4332"
            strokeWidth={2.5}
            fill="url(#colCourses)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="shop"
            stroke="#D4A017"
            strokeWidth={2.5}
            fill="url(#colShop)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}