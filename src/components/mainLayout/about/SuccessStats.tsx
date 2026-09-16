"use client";

import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import Image from "next/image";

interface StatItem {
  count?: string;
  label?: string;
}

interface SuccessStatsProps {
  data: {
    heading?: string;
    stats?: StatItem[];
    successImage?: string;
  };
}

function convertBanglaToEnglish(str: string): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return str.replace(/[০-৯]/g, (digit) => String(banglaDigits.indexOf(digit)));
}

function convertEnglishToBangla(str: string): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return str.replace(/[0-9]/g, (digit) => banglaDigits[Number(digit)]);
}

function useCountUp(targetString: string | undefined) {
  const [count, setCount] = useState(0);

  if (!targetString) return "০";

  const englishTargetStr = convertBanglaToEnglish(targetString);
  const targetNumber =
    parseInt(englishTargetStr.replace(/[^0-9]/g, ""), 10) || 0;

  const suffix = targetString.replace(/[০-৯0-9]/g, "");

  useEffect(() => {
    if (targetNumber === 0) return;

    let startValue = 0;
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    const counterStep = targetNumber / totalFrames;
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      startValue += counterStep;

      if (currentFrame >= totalFrames) {
        setCount(targetNumber);
        clearInterval(timer);
      } else {
        setCount(Math.floor(startValue));
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [targetNumber]);

  if (targetNumber === 0) return targetString;

  return `${convertEnglishToBangla(String(count))}${suffix}`;
}

function StatCard({ item, index }: { item: StatItem; index: number }) {
  const animatedCount = useCountUp(item?.count);

  const gradients = [
    "from-[#E8FBF2] via-[#F4FEFA] to-[#C9F3E1]",
    "from-[#EBF7FF] via-[#F4FAFF] to-[#D2EDFF]",
    "from-[#E6FCFA] via-[#F3FFFE] to-[#C7F7F2]",
    "from-[#FFFBEA] via-[#FFFDF5] to-[#FFEBB5]",
  ];

  const currentGradient = gradients[index % gradients.length];

  return (
    <div
      className={`relative bg-gradient-to-br ${currentGradient} p-6 rounded-2xl shadow-md min-h-[120px] flex flex-col justify-center text-[#1E293B] overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
    >
      {index === 1 && (
        <div className="absolute top-4 right-4 text-blue-400 bg-white/60 p-1 rounded-lg">
          <Users className="w-4 h-4" />
        </div>
      )}
      <div className="text-3xl md:text-4xl font-extrabold tracking-tight transition-all duration-300">
        {animatedCount}
      </div>
      <div className="text-sm md:text-base font-semibold text-gray-700 mt-1">
        {item?.label || "তথ্য বিবরণী"}
      </div>
    </div>
  );
}

export default function SuccessStats({ data }: SuccessStatsProps) {
  const defaultStats = [
    { count: "২৫০০+", label: "শিক্ষার্থী" },
    { count: "৩৫+", label: "শিক্ষক" },
    { count: "১৫+", label: "শিক্ষিকা" },
    { count: "৭+", label: "স্টাফ" },
  ];

  console.log(data);

  const activeStats =
    data?.stats && data.stats.length > 0 ? data.stats : defaultStats;

  return (
    <section className="w-full bg-[#0B1315] text-white py-16 px-6 md:px-12 lg:px-24 font-sans relative overflow-hidden">
      <div className="absolute bottom-0 left-10 opacity-10 pointer-events-none w-64 h-64">
        <svg
          viewBox="0 0 100 100"
          fill="currentColor"
          className="text-amber-500 w-full h-full"
        >
          <path
            d="M50 15 C45 25 48 35 50 40 C52 35 55 25 50 15 Z M50 40 L50 100 M35 50 C30 55 32 70 35 75 M65 50 C70 55 68 70 65 75"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-2xl md:text-4xl font-bold tracking-wide text-center lg:text-left">
            {data?.heading || "একনজরে আমাদের সাফল্যসমূহ"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeStats.map((item, idx) => (
              <StatCard key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[360px] aspect-[4/5] p-2 border-2 border-dashed border-gray-400 rounded-t-[150px] rounded-b-lg flex items-center justify-center">
            <div className="w-full h-full rounded-t-[145px] rounded-b-md overflow-hidden bg-gray-800 relative">
              <Image
                src={data?.successImage || "/images/classroom-view.jpg"}
                alt="Madrasa Success View"
                className="w-full h-full object-cover object-center"
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 360px, 360px"
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}