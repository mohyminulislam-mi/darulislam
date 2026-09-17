import React from "react";
import Image from "next/image";

interface DeeniShikhkhaProps {
  data: {
    title?: string;
    highlightedText?: string;
    authorName?: string;
    authorDesignation?: string;
    paragraphs?: string[];
    profileImage?: string;
  };
}

export default function DeeniShikhkhaSection({ data }: DeeniShikhkhaProps) {
  const fallbackParagraphs = [
    "আদর্শ জাতি গঠনে মুসলিম উম্মাহর প্রত্যেক সদস্যকে দ্বীনি শিক্ষা গ্রহণ করা জরুরি। একজন মুসলিম হিসাবে ইসলামের হুকুম-আহকাম জানা ও মানা উভয় ফরজ। ইসলামী আদর্শ জাতি গঠনে রাসুল (সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম) প্রত্যেক সাহাবীর জন্য দ্বীন শেখার সুযোগ করে দিয়েছিলেন যার শিক্ষক ছিলেন তিনি নিজেই। হাদীস শরীফে বর্ণিত হয়েছে নবীজী (সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম) বলেন-",
    "দ্বীনি শিক্ষায় কোনো বয়সের সীমাবদ্ধতা থাকতে পারে না। শিশুদের যেমন শিক্ষা গ্রহণ জরুরি তেমনি যারা শৈশবে দ্বীনি শিক্ষা অর্জন করতে পারেন নি তারা বয়স্ক হলেও তাদের জন্য দ্বীনি শিক্ষা অর্জন করা জরুরি। ইমাম বুখারী (রহ.) বলেন- নবী করীম (সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম) এর অধিকাংশ সাহাবীগণ বয়স্ক অবস্থায় ইলম অর্জন করেছিলেন। (সহীহ বুখারী: ১/১৭)।",
    "এমনকি সাহাবায়ে কেরাম দুনিয়াবি বিভিন্ন দায়িত্ব পালনরত অবস্থাতেও দ্বীনি ইলম অর্জনের জন্য দিন ভাগ করে নিয়েছিলেন। একজন একদিন শিখে গিয়ে অপরজনকে শেখাতেন, পরদিন অন্যজন এসে শিখে গিয়ে অপরজনকে শেখাতেন (বুখারী ১/১৬)। এভাবে দ্বীনি এলেম চর্চা করতেন।",
    "এ থেকে প্রতীয়মান হয়—ইলম চর্চা ছিল সাহাবায়ে কেরামের জীবনের অবিচ্ছেদ্য অংশ, তা চাকরি-ব্যবসা বা কোনো দায়িত্ব পালনের পথে বাধা হয়ে দাঁড়াত না। আজকের মুসলিম সমাজ যদি নববী যুগের এ শিক্ষার পদ্ধতি ও গুরুত্বকে বুঝে নেয়, তাহলে আমাদের পরিবার, সমাজ ও জাতি হবে আলোকিত, आदर्शবান। দ্বীনি শিক্ষার আলোয় হৃদয় উদ্ভাসিত হলে দুনিয়া ও আখিরাতে সুন্দর, সাফল্যমণ্ডিত।",
  ];

  const activeParagraphs =
    data?.paragraphs && data.paragraphs.length > 0
      ? data.paragraphs
      : fallbackParagraphs;

  return (
    <section className="w-full bg-[#EBF4FA] py-16 px-6 md:px-12 lg:px-24 flex items-center justify-center font-sans relative overflow-hidden max-w-11/12 mx-auto">
      {/* Main Card Container */}
      <div className="max-w-6xl w-full bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-white/40 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start relative z-10">
        {/* Left Side: Profile Photo */}
        <div className="lg:col-span-4 flex justify-center lg:justify-start sticky top-6">
          <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg border-4 border-white transform -rotate-1">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0A4740]/20 to-transparent z-10"></div>
            <Image
              src={data?.profileImage || "/images/mufti-abdul-karim.jpg"}
              alt={data?.authorName || "Mufti Abdul Karim"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center scale-105"
              priority
            />
          </div>
        </div>

        {/* Right Side: Content Area */}
        <div
          className="lg:col-span-8 flex flex-col justify-between h-full space-y-6 text-right lg:text-left"
          dir="rtl"
          style={{ direction: "ltr" }}
        >
          <div className="text-left space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-[#1E293B] border-b-2 border-amber-400 pb-3 inline-block">
              {data?.title || "দ্বীনি শিক্ষার গুরুত্ব ও নববী যুগের নমুনা"}
            </h2>

            <div className="text-gray-700 text-sm md:text-base leading-relaxed space-y-4 font-normal text-justify">
              {activeParagraphs.map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                  {index === 0 && data?.highlightedText && (
                    <>
                      {" "}
                      <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-sm inline font-medium">
                        {data.highlightedText}
                      </span>
                    </>
                  )}
                </p>
              ))}
            </div>
          </div>

          {/* Bottom Designation Card */}
          <div className="w-full bg-amber-50/60 border border-amber-200 rounded-2xl p-4 md:p-6 text-left mt-6 shadow-inner">
            <h4 className="text-xl font-bold text-amber-600 mb-1">
              {data?.authorName || "মুফতী আব্দুল কারীম গুফিরালাহু"}
            </h4>
            <p className="text-sm font-semibold text-[#0A4740]">
              {data?.authorDesignation ||
                "চেয়ারম্যান: ইকরা দ্বীনি শিক্ষা ফাউন্ডেশন"}
            </p>
          </div>
        </div>
      </div>

      {/* Islamic Pattern Watermark */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="islamic-star-grid"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M40 0 L80 40 L40 80 L0 40 Z"
                fill="none"
                stroke="#0A4740"
                strokeWidth="1"
              />
              <circle
                cx="40"
                cy="40"
                r="10"
                fill="none"
                stroke="#0A4740"
                strokeWidth="0.75"
              />
              <path
                d="M40 20 L40 60 M20 40 L60 40"
                stroke="#0A4740"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-star-grid)" />
        </svg>
      </div>
    </section>
  );
}