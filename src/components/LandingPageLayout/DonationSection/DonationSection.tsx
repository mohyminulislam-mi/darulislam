import React from "react";
import { Heart, Droplets, ArrowRight } from "lucide-react";
import Link from "next/link";

const DonationSection = () => {
  const donationCards = [
    {
      title: "ব্লাড ডোনেশন",
      description: "মানবতার সেবায় রক্ত দান করুন।",
      icon: <Droplets className="text-red-500" size={28} />,
      btnText: "বিস্তারিত",
      btnColor: "bg-red-500 hover:bg-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "সাধারণ ডোনেশন",
      description: "মাদরাসা ও এতিমখানায় সহায়তা করুন।",
      icon: <Heart className="text-green-600" size={28} />, // ছোট স্ক্রিনের জন্য আইকন সাইজ কমানো হয়েছে
      btnText: "ডোনেট",
      btnColor: "bg-green-600 hover:bg-green-700",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <section className="py-12 px-2 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
            ডোনেশন ও সহায়তা
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
            দারুল ইসলাম ইন্সটিটিউটের আত্মউন্নয়নমূলক কাজে আপনিও অংশ নিন।
          </p>
          <div className="w-16 h-1 bg-green-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Cards Grid: মোবাইলে পাশাপাশি দেখানোর জন্য grid-cols-2 ব্যবহার করা হয়েছে */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-8 mt-6">
          {donationCards.map((card, index) => (
            <div
              key={index}
              className="group relative p-4 md:p-8 rounded-2xl border border-gray-100 bg-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Background Accent */}
              <div
                className={`absolute top-0 right-0 w-16 h-16 md:w-32 md:h-32 ${card.bgColor} rounded-bl-full -z-0 opacity-40`}
              ></div>

              {/* Icon Circle */}
              <div
                className={`relative z-10 w-12 h-12 md:w-20 md:h-20 rounded-xl ${card.bgColor} flex items-center justify-center mb-3 md:mb-6`}
              >
                {card.icon}
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center">
                <h3 className="text-base md:text-2xl font-bold text-gray-800 mb-1 md:mb-3">
                  {card.title}
                </h3>
                <p className="text-[10px] md:text-sm text-gray-500 mb-4 md:mb-8 line-clamp-2 md:line-clamp-none">
                  {card.description}
                </p>

                <Link
                  href="/donation"
                  className={`inline-flex items-center cursor-pointer gap-1 md:gap-2 px-3 py-2 md:px-8 md:py-3 rounded-lg md:xl text-white text-xs md:text-base font-semibold transition-all active:scale-95 ${card.btnColor}`}
                >
                  {card.btnText}
                  <ArrowRight size={14} className="hidden md:block" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
