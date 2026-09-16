"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface PieProps {
  pieData: Array<{ name: string; value: number; color: string }>;
}

const RADIAN = Math.PI / 180;
const renderLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={900}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function CoursePieChart({ pieData }: PieProps) {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 flex flex-col justify-between">
      <div>
        <h3 className="font-black text-lg text-neutral-800">
          কোর্স ক্যাটাগরিসমূহ
        </h3>
        <p className="text-xs text-neutral-400 font-medium mt-0.5">
          শিক্ষার্থী ভর্তির শতকরা অনুপাত
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={85}
            dataKey="value"
            labelLine={false}
            label={renderLabel}
          >
            {pieData.map((entry, i) => (
              <Cell key={i} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip formatter={(v: any, n: any) => [`${v}%`, n]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2 max-h-[120px] overflow-y-auto pr-1">
        {pieData.map((d) => (
          <div
            key={d.name}
            className="flex items-center justify-between text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: d.color }}
              />
              <span className="text-neutral-500 truncate max-w-[150px]">
                {d.name}
              </span>
            </div>
            <span className="text-neutral-800">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}