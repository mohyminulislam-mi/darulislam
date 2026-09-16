"use client";

interface RecentOrdersProps {
  ordersData: Array<{
    id: string;
    customer: string;
    product: string;
    amount: string;
    status: string;
    date: string;
    avatar: string;
  }>;
}

const statusStyle: Record<string, { bg: string; color: string; text: string }> =
  {
    Delivered: {
      bg: "rgba(27,67,50,0.1)",
      color: "#1B4332",
      text: "ডেলিভার্ড",
    },
    Processing: {
      bg: "rgba(212,160,23,0.12)",
      color: "#B45309",
      text: "প্রসেসিং",
    },
    Shipped: { bg: "rgba(59,130,246,0.1)", color: "#1D4ED8", text: "শিফট" },
    Pending: { bg: "rgba(239,68,68,0.1)", color: "#DC2626", text: "পেন্ডিং" },
  };

const avatarColors = ["#1B4332", "#2D6A4F", "#D4A017", "#52796F", "#B45309"];

export default function RecentOrders({ ordersData }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden h-full">
      <div className="px-6 py-5 border-b border-neutral-50 flex items-center justify-between">
        <div>
          <h3 className="font-black text-lg text-neutral-800">
            সাম্প্রতিক ট্রানজেকশন হিস্টোরি
          </h3>
          <p className="text-xs text-neutral-400 font-medium mt-0.5">
            শপ এবং বুক স্টোরের সর্বশেষ বিক্রয় রেকর্ড
          </p>
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[10px] font-black text-neutral-400 uppercase tracking-wider">
              <th className="px-6 py-3.5">অর্ডার আইডি</th>
              <th className="px-6 py-3.5">গ্রাহক</th>
              <th className="px-6 py-3.5">পণ্য / কিতাব</th>
              <th className="px-6 py-3.5">পরিমাণ</th>
              <th className="px-6 py-3.5">অবস্থা</th>
              <th className="px-6 py-3.5">তারিখ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50 font-bold text-neutral-700 text-xs">
            {ordersData.map((o, i) => {
              const s = statusStyle[o.status] || {
                bg: "rgba(100,116,139,0.1)",
                color: "#64748B",
                text: o.status,
              };
              return (
                <tr
                  key={o.id}
                  className="hover:bg-neutral-50/40 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-black text-[#1B4332]">
                    {o.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                        style={{
                          background: avatarColors[i % avatarColors.length],
                        }}
                      >
                        {o.avatar}
                      </div>
                      <span className="text-neutral-800 truncate max-w-[120px]">
                        {o.customer}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-400 max-w-[160px] truncate font-medium">
                    {o.product}
                  </td>
                  <td className="px-6 py-4 text-neutral-800 font-black">
                    {o.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wide"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {s.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-400 font-medium">
                    {o.date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}