"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  Users,
  GraduationCap,
  Star,
  Medal,
  Building2,
} from "lucide-react";

// ১. মূল পরিসংখ্যান ডাটা
const STATS = [
  {
    id: 1,
    title: "মোট শিক্ষার্থী",
    value: "৫,০০০+",
    icon: Users,
    description: "সাফল্যের সাথে দ্বীনি ও আধুনিক শিক্ষায় যুক্ত",
  },
  {
    id: 2,
    title: "উত্তীর্ণ ক্বারী ও হাফেজ",
    value: "১,২০০+",
    icon: GraduationCap,
    description: "বিশুদ্ধ তাজবীদ সহ কুরআন হিফজ সম্পন্ন",
  },
  {
    id: 3,
    title: "জাতীয় ও আন্তর্জাতিক পুরস্কার",
    value: "২৫+",
    icon: Trophy,
    description: "কুরআন তেলাওয়াত ও প্রতিযোগিতায় স্থান",
  },
  {
    id: 4,
    title: "অভিজ্ঞ শিক্ষক মণ্ডলী",
    value: "৫০+",
    icon: Award,
    description: "দেশ-বিদেশের বিখ্যাত মাদরাসার গ্র্যাজুয়েট",
  },
];

// ২. টাইমলাইন বা অর্জনের পথচলা
const MILESTONES = [
  {
    year: "২০১৬",
    title: "প্রতিষ্ঠা ও যাত্রা শুরু",
    description:
      "মাত্র ৩০ জন শিক্ষার্থী ও ২ জন শিক্ষক নিয়ে দারুল ইসলাম মাদরাসার প্রথম যাত্রা শুরু হয়।",
  },
  {
    year: "২০১৯",
    title: "বোর্ড পরীক্ষায় ১ম স্থান অর্জন",
    description:
      "আঞ্চলিক হিফজুল কুরআন প্রতিযোগিতায় আমাদের শিক্ষার্থীরা ১ম ও ২য় স্থান অধিকার করে।",
  },
  {
    year: "২০২২",
    title: "ডিজিটাল ল্যাব ও আধুনিক ক্যাম্পাস",
    description:
      "দ্বীনি শিক্ষার পাশাপাশি আধুনিক আইটি ল্যাব ও ই-লার্নিং প্ল্যাটফর্ম চালু করা হয়।",
  },
  {
    year: "২০২৫",
    title: "জাতীয় হিফজ অ্যাওয়ার্ড",
    description:
      "জাতীয় কুরআন প্রতিযোগিতায় আমাদের ২ জন শিক্ষার্থী গোল্ড মেডেল অর্জন করে।",
  },
  {
    year: "২০২৬",
    title: "৫,০০০ শিক্ষার্থী ও অনলাইন উইং",
    description:
      "সারাদেশে ৫,০০০+ শিক্ষার্থীর মাইলফলক স্পর্শ এবং আন্তর্জাতিক অনলাইন কোর্স চালু।",
  },
];

// ৩. সম্মাননা ও অ্যাওয়ার্ডের তালিকা
const AWARDS = [
  {
    id: 1,
    title: "সেরা শিক্ষাপ্রতিষ্ঠান সম্মাননা ২০২৫",
    issuer: "জাতীয় ইসলামিক শিক্ষা বোর্ড",
    year: "২০২৫",
    details: "গুণগত দ্বীনি শিক্ষা ও সুশৃঙ্খল পরিবেশের জন্য শ্রেষ্ঠ সম্মাননা।",
  },
  {
    id: 2,
    title: "আন্তর্জাতিক কুরআন তেলাওয়াত অ্যাওয়ার্ড",
    issuer: "গ্লোবাল কেরাত অ্যাসোসিয়েশন",
    year: "২০২৪",
    details: "আমাদের শিক্ষার্থী তাজবীদ ক্যাটাগরিতে ১ম স্থান অর্জন করে।",
  },
  {
    id: 3,
    title: "আইটি ও আধুনিক শিক্ষা ট্রফি",
    issuer: "ইসলামিক টেকনোলজি ফোরাম",
    year: "২০২৩",
    details: "মাদরাসা শিক্ষায় আধুনিক প্রযুক্তির সেরা বাস্তবায়নের স্বীকৃতি।",
  },
];

export default function AchievementsClient() {
  return (
    <section className="min-h-screen bg-[#F7FBF7] py-8 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden max-w-11/12 mx-auto">
      {/* ব্যানার সেকশন */}
      <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16 space-y-3 md:space-y-4">
        <span className="bg-[#8FE3A9]/20 text-[#0B3D2E] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 justify-center">
          <Trophy size={14} className="text-[#0B3D2E]" /> আমাদের সাফল্য
        </span>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B3D2E] leading-tight">
          আমাদের অর্জন ও পথচলা
        </h1>
        <p className="text-gray-600 text-xs sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
          প্রতিষ্ঠালগ্ন থেকে নিরবচ্ছিন্ন সেবা, দ্বীনি দাওয়াত এবং শিক্ষার্থীদের
          মেধা বিকাশে আমাদের অর্জিত কিছু গুরুত্বপূর্ণ মাইলফলক।
        </p>
      </div>

      {/* ১. পরিসংখ্যান কার্ডসমূহ (Responsive Grid) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 md:mb-24">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm border border-[#0B3D2E]/5 hover:shadow-md transition text-center space-y-2 md:space-y-3"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#8FE3A9]/20 text-[#0B3D2E] rounded-2xl flex items-center justify-center mx-auto">
                <Icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B3D2E]">
                {stat.value}
              </h3>
              <h4 className="font-bold text-gray-800 text-sm md:text-base">
                {stat.title}
              </h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ২. অর্জনের সময়ক্রম (Fully Responsive Timeline) */}
      <div className="max-w-4xl mx-auto mb-16 md:mb-24">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl sm:text-3xl font-black text-[#0B3D2E]">
            সাফল্যের মাইলফলকসমূহ
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1">
            বছরের পর বছর আমাদের অগ্রগতির ইতিহাস
          </p>
        </div>

        <div className="relative border-l-2 border-[#0B3D2E]/20 ml-4 sm:ml-28 md:ml-32 space-y-8 md:space-y-10">
          {MILESTONES.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-6 sm:pl-8 md:pl-10"
            >
              {/* ইয়ার ব্যাজ এবং টাইমলাইন ডট */}
              <div className="absolute -left-[13px] top-1.5 w-6 h-6 bg-[#0B3D2E] text-white rounded-full flex items-center justify-center shadow-md">
                <Star size={12} className="fill-current text-[#8FE3A9]" />
              </div>

              {/* সাল (স্মার্টফোন ও ডেস্কটপের জন্য মানানসই অবস্থান) */}
              <div className="absolute -left-28 md:-left-34 top-1 text-xs sm:text-sm font-black text-[#0B3D2E] bg-[#8FE3A9]/30 px-2.5 py-1 rounded-md inline-block mb-2 sm:mb-0">
                {item.year}
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-[#0B3D2E]/5 space-y-1.5">
                <h3 className="text-base sm:text-lg font-black text-[#0B3D2E]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ৩. সম্মাননা ও সার্টিফিকেট সেকশন */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl sm:text-3xl font-black text-[#0B3D2E]">
            স্বীকৃতি ও সম্মাননা
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1">
            বিভিন্ন সংস্থা থেকে প্রাপ্ত আমাদের অর্জিত স্বীকৃতি
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {AWARDS.map((award) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 shadow-sm border border-[#0B3D2E]/5 space-y-3 hover:border-[#8FE3A9] transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 text-amber-700 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <Medal className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-xs font-black bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {award.year}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0B3D2E] mb-1">
                    {award.title}
                  </h3>
                  <p className="text-xs font-bold text-green-700 flex items-center gap-1">
                    <Building2 size={12} /> {award.issuer}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600 font-medium leading-relaxed pt-3 border-t border-gray-100">
                {award.details}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
