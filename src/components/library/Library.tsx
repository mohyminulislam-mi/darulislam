"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Sun,
  CloudSun,
  Moon,
  CloudMoon,
  Sunrise,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

// সময়গুলো ২৪ ঘণ্টা ফরম্যাটেই রাখা ভালো ক্যালকুলেশনের সুবিধার জন্য
const PRAYER_CONFIG = [
  { id: "fajr", name: "ফজর", icon: Sunrise, time: "04:01" },
  { id: "dhuhr", name: "যুহর", icon: Sun, time: "13:00" },
  { id: "asr", name: "আসর", icon: CloudSun, time: "17:00" },
  { id: "maghrib", name: "মাগরিব", icon: Moon, time: "18:29" },
  { id: "isha", name: "ইশা", icon: CloudMoon, time: "19:50" },
];

const toBn = (str: string) =>
  str.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

// ২৪ ঘণ্টা থেকে ১২ ঘণ্টা ফরম্যাটে রূপান্তর করার ফাংশন
const formatTo12Hr = (timeStr: string) => {
  let [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "" : ""; // আপনি চাইলে এখানে 'পিএম/এএম' যোগ করতে পারেন
  h = h % 12 || 12; // ০ হলে ১২ হবে, আর ১২ এর বেশি হলে বিয়োগ হবে
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}${period}`;
};

const parseTime = (t: string, nextDay = false) => {
  const [h, m] = t.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  if (nextDay) d.setDate(d.getDate() + 1);
  return d;
};

export default function PrayerTimesResponsive() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const data = useMemo(() => {
    const times = PRAYER_CONFIG.map((p) => ({ ...p, date: parseTime(p.time) }));
    const nowMs = now.getTime();
    let idx = times.findIndex((t) => t.date.getTime() > nowMs);

    let currentId, nextId, target, start;
    if (idx === -1) {
      currentId = "isha";
      nextId = "fajr";
      target = parseTime(PRAYER_CONFIG[0].time, true);
      start = times[4].date;
    } else {
      nextId = times[idx].id;
      currentId = idx === 0 ? "isha" : times[idx - 1].id;
      target = times[idx].date;
      start =
        idx === 0
          ? parseTime(PRAYER_CONFIG[4].time, false)
          : times[idx - 1].date;
    }

    const diff = target.getTime() - nowMs;
    const total = target.getTime() - start.getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    return {
      currentId,
      next: PRAYER_CONFIG.find((p) => p.id === nextId),
      countdown: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
      progress: Math.max(0, Math.min(((total - diff) / total) * 100, 100)),
    };
  }, [now]);

  return (
    <div className=" bg-[#F4F7F5] px-4 md:px-8 lg:px-12 pt-20 pb-5 md:pt-25 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-5xl font-black text-emerald-900 mb-2">
              সালাত টাইমস
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-emerald-700/70 font-medium">
              <span className="flex items-center gap-1.5 bg-emerald-100/50 border border-emerald-200 px-3 py-1 rounded-full text-sm">
                <MapPin size={16} /> ঢাকা, বাংলাদেশ
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full text-sm shadow-sm border border-emerald-50">
                <Calendar size={16} />{" "}
                {toBn(
                  now.toLocaleDateString("bn-BD", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }),
                )}
              </span>
            </div>
          </motion.div>

          <div className="hidden lg:block bg-white p-5 rounded-3xl shadow-sm border border-emerald-100 min-w-[200px]">
            <p className="text-[10px] text-emerald-600/50 uppercase font-black tracking-widest mb-1">
              বর্তমান সময়
            </p>
            <p className="text-3xl font-mono font-bold text-emerald-900 leading-none">
              {toBn(
                now.toLocaleTimeString("bn-BD", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                }),
              )}
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-emerald-900 rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <span className="inline-block bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-4 py-2 rounded-2xl text-xs font-bold tracking-widest uppercase">
                  পরবর্তী ওয়াক্ত: {data.next?.name}
                </span>
                <div>
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-mono font-black tracking-tighter">
                    {toBn(data.countdown)}
                  </h2>
                  <p className="text-emerald-300/60 text-lg font-medium">
                    শুরু হতে বাকি আছে
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/3 lg:w-1/4 space-y-4">
                <div className="h-3 w-full bg-emerald-950 rounded-full overflow-hidden border border-emerald-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${data.progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className="flex justify-between text-xs font-black text-emerald-400 uppercase tracking-widest opacity-70">
                  <span>
                    {PRAYER_CONFIG.find((p) => p.id === data.currentId)?.name}
                  </span>
                  <span>{data.next?.name}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* প্রধান কন্টেইনার পরিবর্তন করুন */}
          <div className="grid grid-cols-5 gap-4 lg:gap-6 items-start">
            {/* ইনার গ্রিড পরিবর্তন করুন */}
            <div className="col-span-5 grid grid-cols-5 gap-4">
              {PRAYER_CONFIG.map((prayer) => {
                const isActive = data.currentId === prayer.id;
                return (
                  <motion.div
                    key={prayer.id}
                    whileHover={{ y: -4 }}
                    // মোবাইল রেসপনসিভ করার জন্য padding ও টেক্সট সাইজ কিছুটা অ্যাডজাস্ট করা হয়েছে
                    className={`p-3 rounded-[1.5rem] md:rounded-[2.2rem] flex flex-col sm:flex-row items-center justify-between transition-all duration-300 ${
                      isActive
                        ? "bg-white ring-4 ring-emerald-500/10 border-2 border-emerald-500 shadow-xl"
                        : "bg-white border border-emerald-100 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-2 text-center sm:text-left">
                      <div
                        className={`p-3 md:p-1 rounded-2xl ${
                          isActive
                            ? "bg-emerald-600 text-white"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        <prayer.icon size={20} className="md:w-6 md:h-6" />
                      </div>
                      <div>
                        <p
                          className={`font-bold text-sm md:text-xl ${isActive ? "text-emerald-900" : "text-gray-700"}`}
                        >
                          {prayer.name}
                        </p>
                        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                          {isActive ? "চলমান ওয়াক্ত" : "শুরু"}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`text-base md:text-2xl font-black mt-2 sm:mt-0 ${isActive ? "text-emerald-600" : "text-gray-900"}`}
                    >
                      {toBn(formatTo12Hr(prayer.time))}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
