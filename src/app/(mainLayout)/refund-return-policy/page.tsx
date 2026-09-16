"use client";

import React from "react";
import {
  RotateCcw,
  Banknote,
  CalendarCheck,
  ArrowLeftRight,
} from "lucide-react";

// আইকন ডাইনামিক্যালি রেন্ডার করার জন্য ম্যাপ
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } =
  {
    Banknote: Banknote,
    CalendarCheck: CalendarCheck,
    ArrowLeftRight: ArrowLeftRight,
  };

// ছবি থেকে নেওয়া রিফান্ড পলিসির JSON ডাটা
const refundData = {
  title: "রিফান্ড ও রিটার্ন পলিসি (Refund & Return Policy)",
  institution: "দারুল ইসলাম ইনস্টিটিউট মাদ্রাসা",
  intro:
    "দারুল ইসলাম ইনস্টিটিউট মাদ্রাসার সকল কোর্সে ভর্তির ক্ষেত্রে নিম্নোক্ত রিফান্ড পলিসি প্রযোজ্য হবে:",
  lastUpdated: "জুলাই ২০২৬",
  sections: [
    {
      id: 1,
      iconName: "Banknote",
      heading: "ভর্তি ফি",
      text: "আমাদের যেকোনো কোর্সে ভর্তির জন্য প্রদেয় 'ভর্তি ফি' সম্পূর্ণরূপে অফেরতযোগ্য (Non-refundable)। ভর্তির আবেদন করার আগে কোর্স কারিকুলাম এবং সময়সূচী ভালোমতো দেখে নেওয়ার অনুরোধ রইল।",
    },
    {
      id: 2,
      iconName: "CalendarCheck",
      heading: "মাসিক ফি",
      text: "আমাদের মাদ্রাসার মাসিক ফি মূলত 'পোস্ট-পেইড' পদ্ধতিতে নেওয়া হয় (অর্থাৎ আপনি পড়ার পর ফি প্রদান করেন)। যেহেতু সেবা গ্রহণের পর এই ফি প্রদান করা হয়, তাই মাসিক ফি কোনোভাবেই অফেরতযোগ্য।",
    },
    {
      id: 3,
      iconName: "ArrowLeftRight",
      heading: "কোর্স পরিবর্তন",
      text: "বিশেষ বিবেচনায় ভর্তি হওয়ার নির্দিষ্ট সময়ের মধ্যে কোর্স পরিবর্তনের সুযোগ থাকতে পারে, তবে এটি সম্পূর্ণ কর্তৃপক্ষের সিদ্ধান্তের ওপর নির্ভরশীল।",
    },
  ],
};

export default function RefundPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans leading-relaxed">
      {/* Hero Header Section */}
      <div className="bg-emerald-800 text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {refundData.title}
        </h1>
        <p className="text-emerald-100 max-w-2xl mx-auto text-base md:text-lg">
          {refundData.intro}
        </p>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 space-y-8">
          {/* Loop through sections */}
          {refundData.sections.map((section) => {
            // ডাইনামিক আইকন অ্যাসাইন এবং ফলব্যাক হিসেবে RotateCcw আইকন সেট করা
            const IconComponent = iconMap[section.iconName] || RotateCcw;

            return (
              <section
                key={section.id}
                className="group p-4 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Icon Wrapper */}
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200 shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">
                      {section.heading}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      {section.text}
                    </p>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer Info */}
        <p className="text-center text-sm text-gray-400 mt-8">
          সর্বশেষ পরিমার্জিত: {refundData.lastUpdated}
        </p>
      </div>
    </div>
  );
}
