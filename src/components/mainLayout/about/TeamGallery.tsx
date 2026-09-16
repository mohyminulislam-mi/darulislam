"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface TeamGalleryProps {
  data: {
    title?: string;
    description?: string;
    images?: string[];
  };
}

export default function TeamGallery({ data }: TeamGalleryProps) {
  const fallbackImages = [
    "/images/team-main.jpg",
    "/images/team-1.jpg",
    "/images/team-2.jpg",
    "/images/team-3.jpg",
    "/images/team-4.jpg",
    "/images/team-5.jpg",
  ];

  const activeImages =
    data?.images && data.images.length > 0 ? data.images : fallbackImages;
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? activeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === activeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full bg-[#0B1315] text-white py-16 px-4 md:px-12 lg:px-24 font-sans text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold tracking-wide">
            {data?.title || "দারুল ইসলাম ইনস্টিটিউট মাদ্রাসা"}{" "}
            <span className="text-amber-500">গ্যালারী</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-4">
            {data?.description ||
              "ইখলাস আর আস্থার উপর আমাদের পথচলা। সকল স্তরের দায়িত্বশীলদের একনিষ্ঠ পরিশ্রমের মাধ্যমে মাত্র কয়েক বছরেই আমরা একটি বিশাল পরিবারের ভালোবাসায় সিক্ত হয়েছি।"}
          </p>
        </div>

        <div className="relative w-full aspect-[16/10] md:aspect-[16/9] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          <Image
            src={activeImages[activeIndex]}
            alt={`Team Group ${activeIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="object-cover transition-all duration-500 ease-in-out"
            priority
          />

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors z-20 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors z-20 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 overflow-x-auto py-2 px-4 no-scrollbar">
          {activeImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative flex-shrink-0 w-20 md:w-28 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                activeIndex === index
                  ? "border-amber-500 scale-105 shadow-lg shadow-amber-500/20"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 20vw, 10vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
