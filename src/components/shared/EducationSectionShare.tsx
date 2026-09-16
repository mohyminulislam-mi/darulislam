"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Course {
  id: number | string;
  title: string;
  image?: string;
  price?: number;
  oldPrice?: number;
  label?: string;
}

interface SectionProps {
  section: {
    categoryName: string; // 🔹 ক্যাটাগরির লাইভ নেম টাইপ ম্যাপিং
    type?: string;
    courses: Course[];
  };
}

const EducationSectionShare = ({ section }: SectionProps) => {
  if (!section || !section.courses || section.courses.length === 0) return null;

  const { categoryName, courses, type } = section;

  return (
    <div className="relative border-2 border-neutral-100 bg-white rounded-[2rem] p-6 md:p-10 shadow-sm">
      {/* 🔹 ফিক্স ৪: category এর জায়গায় জেনুইন categoryName ভ্যালু প্রিন্ট করা */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-8 py-2.5 border-2 border-neutral-50 rounded-2xl shadow-sm z-20">
        <h2 className="text-[#0B5D3B] font-black text-xs md:text-base whitespace-nowrap uppercase tracking-wider">
          {categoryName}
        </h2>
      </div>

      {type === "card" ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
            {courses.map((course, index) => (
              <Link
                href={`/education/${course.id}`}
                key={course.id || index}
                className="group bg-white border border-neutral-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                  {course.image ? (
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#0B5D3B]/10 flex items-center justify-center text-[10px] text-neutral-400 font-medium px-2 text-center">
                      {course.title}
                    </div>
                  )}
                </div>

                <div className="p-3 md:p-4 flex flex-col flex-grow">
                  <h3 className="text-[11px] md:text-sm font-bold text-neutral-700 line-clamp-1 mb-2">
                    {course.title}
                  </h3>
                  <div className="mt-auto flex items-center gap-2">
                    <span className="text-[#0B5D3B] font-black text-sm md:text-lg">
                      ৳ {course.price || 0}
                    </span>
                    {course.oldPrice && (
                      <span className="text-neutral-400 text-[10px] md:text-xs line-through font-medium">
                        ৳ {course.oldPrice}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button className="px-10 py-2 border-2 border-[#0B5D3B] text-[#0B5D3B] font-black rounded-xl hover:bg-[#0B5D3B] hover:text-white transition-all duration-300 text-sm md:text-base">
              আরো দেখুন
            </button>
          </div>
        </>
      ) : (
        /* গ্রিড স্টাইল সেকশন (Iconic Grid for Quran or Special categories) */
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 lg:gap-8 justify-items-center mt-2">
          {courses.map((course, cIdx) => (
            <Link
              href={`/education/${course.id}`}
              key={course.id || cIdx}
              className="w-full"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group cursor-pointer w-full aspect-square rounded-2xl overflow-hidden shadow-md transition-all duration-300"
              >
                <div className="absolute inset-0 bg-[#0B5D3B] bg-gradient-to-br from-[#0B5D3B] via-[#0d4d2e] to-black opacity-95" />
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="relative h-full flex items-center justify-center p-3">
                  <p className="text-white text-[10px] md:text-[13px] font-black text-center leading-tight drop-shadow-md">
                    {course.title}
                  </p>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationSectionShare;