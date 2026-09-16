"use client";
import React from "react";
import { Truck, Headset, RotateCcw, ShieldCheck } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      id: 1,
      icon: <Truck className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Fast Delivery",
      subtitle: "Order over ৳5,000",
      bgColor: "bg-red-50 text-red-600",
    },
    {
      id: 2,
      icon: <Headset className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Dedicated Support",
      subtitle: "24/7 Live assistance",
      bgColor: "bg-emerald-50 text-[#0B5D3B]",
    },
    {
      id: 3,
      icon: <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Easy Replace",
      subtitle: "If any problem found",
      bgColor: "bg-amber-50 text-amber-600",
    },
    {
      id: 4,
      icon: <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />,
      title: "100% Secure Pay",
      subtitle: "Fully safe payment method",
      bgColor: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <section className="px-4 py-8 md:py-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 bg-white border border-neutral-100 p-4 md:p-6 rounded-[2rem] shadow-sm">
        {badges.map((badge, index) => (
          <div
            key={badge.id}
            className={`flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-3 md:gap-4 p-4 rounded-2xl hover:bg-neutral-50/70 transition-all duration-300 relative ${
              index !== badges.length - 1
                ? "lg:after:content-[''] lg:after:absolute lg:after:right-[-12px] lg:after:top-1/4 lg:after:h-1/2 lg:after:w-[1px] lg:after:bg-neutral-200/60"
                : ""
            }`}
          >
            <div
              className={`w-10 h-10 md:w-12 md:h-12 ${badge.bgColor} rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner`}
            >
              {badge.icon}
            </div>

            <div className="flex flex-col text-center sm:text-left">
              <h3 className="text-xs md:text-sm font-black text-neutral-800 tracking-tight leading-tight">
                {badge.title}
              </h3>
              <p className="text-[10px] md:text-xs font-medium text-neutral-400 mt-1 leading-none">
                {badge.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;
