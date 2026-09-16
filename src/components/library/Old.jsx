"use client";

import { useState, useEffect } from "react";
import { MapPin, Bell, Search, Sun, Moon, Wind, Droplets, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ─────────────── DATA ─────────────── */

const bannerSlides = [
  {
    image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=900",
    tag: "জ্ঞান",
    title: "যাকাত ও ফিতরা",
    subtitle: "ইসলামের অন্যতম স্তম্ভ সম্পর্কে জানুন",
  },
  {
    image: "https://images.unsplash.com/photo-1564769610726-59cead6a6f8f?w=900",
    tag: "আমল",
    title: "ঈদের সুন্নাহ",
    subtitle: "ঈদের দিনের সঠিক আমলসমূহ",
  },
  {
    image: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=900",
    tag: "দু'আ",
    title: "রমাদানের বিশেষ দু'আ",
    subtitle: "প্রতিটি মুহূর্তের জন্য নির্বাচিত দু'আ",
  },
];

const prayerLabels: Record<string, string> = {
  Fajr: "ফজর",
  Sunrise: "সূর্যোদয়",
  Dhuhr: "যোহর",
  Asr: "আসর",
  Maghrib: "মাগরিব",
  Isha: "ইশা",
};

const ilmCategories = [
  { name: "কুরআন", emoji: "📖", color: "#1a4731", light: "#e8f5ee" },
  { name: "হাদীস", emoji: "🕌", color: "#2d3a1e", light: "#edf0e8" },
  { name: "কিতাব", emoji: "📚", color: "#3b2a0f", light: "#f5ede0" },
  { name: "প্রবন্ধ", emoji: "📝", color: "#0f2b3b", light: "#e0edf5" },
];

const amalCategories = [
  { name: "নামায", emoji: "🕋", color: "#1e2d3a", light: "#e0eaf5" },
  { name: "দু'আ", emoji: "🤲", color: "#2a1e3a", light: "#ede0f5" },
  { name: "তারাবীহ", emoji: "🌙", color: "#1a3a2a", light: "#e0f5ea" },
];

const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

/* ─────────────── COMPONENT ─────────────── */

export default function IslamicDashboard() {
  const [data, setData] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextPrayer, setNextPrayer] = useState<any>(null);
  const [countdown, setCountdown] = useState("");
  const [activePrayer, setActivePrayer] = useState<string | null>(null);
  const [notifOn, setNotifOn] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  /* Slider auto-advance */
  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % bannerSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* Fetch prayer & weather */
  useEffect(() => {
    fetch("https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=2")
      .then((r) => r.json())
      .then((r) => setData(r.data));
    if (API_KEY)
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=Dhaka&appid=${API_KEY}&units=metric`)
        .then((r) => r.json())
        .then((r) => setWeather(r));
  }, []);

  /* Next prayer + countdown */
  useEffect(() => {
    if (!data) return;
    const timings = data.timings;
    const now = new Date();
    let next: any = null;
    let active: string | null = null;

    for (let i = 0; i < prayerOrder.length; i++) {
      const p = prayerOrder[i];
      const [h, m] = timings[p].split(":");
      const t = new Date(); t.setHours(+h, +m, 0, 0);
      const prev = prayerOrder[i - 1];
      if (prev) {
        const [ph, pm] = timings[prev].split(":");
        const pt = new Date(); pt.setHours(+ph, +pm, 0, 0);
        if (now >= pt && now < t) active = prev;
      }
      if (t > now && !next) next = { name: p, date: t };
    }

    if (!next) {
      const [h, m] = timings.Fajr.split(":");
      const t = new Date(); t.setDate(t.getDate() + 1); t.setHours(+h, +m, 0, 0);
      next = { name: "Fajr", date: t };
    }

    setNextPrayer(next);
    setActivePrayer(active);

    const iv = setInterval(() => {
      const diff = next.date.getTime() - Date.now();
      if (diff <= 0) { clearInterval(iv); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(iv);
  }, [data]);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f4e8]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="w-10 h-10 border-4 border-[#1a4731] border-t-transparent rounded-full" />
    </div>
  );

  const hijri = data.date.hijri;
  const gregorian = data.date.gregorian;
  const timings = data.timings;

  return (
    <div className="bg-[#f8f4e8] min-h-screen font-sans pb-24 mt-16 lg:mt-18">
      <div className="max-w-7xl mx-auto px-4 pt-4 space-y-5">

        {/* ── MAIN PRAYER CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-[#1a4731] text-white shadow-2xl"
          style={{ minHeight: 220 }}
        >
          {/* Decorative geometric pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10 p-6 flex flex-col gap-5">

            {/* Date row */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-xs mb-0.5">{gregorian.weekday.en}</p>
                <p className="text-white/90 text-sm">{gregorian.date}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Moon size={14} className="text-amber-300" />
                  <span className="text-amber-300 font-bold text-sm">{hijri.day} {hijri.month.en}</span>
                </div>
                <p className="text-white/60 text-xs">{hijri.year} হিজরি</p>
              </div>
            </div>

            {/* Next prayer countdown */}
            {nextPrayer && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 text-center border border-white/20">
                <p className="text-white/70 text-xs mb-1">পরবর্তী নামাজ</p>
                <p className="text-2xl font-bold tracking-widest text-white mb-0.5">{countdown}</p>
                <p className="text-amber-300 font-bold text-base">{prayerLabels[nextPrayer.name]}</p>
              </div>
            )}

            {/* Weather row */}
            {weather && (
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Sun size={16} className="text-amber-300" />
                <span>{Math.round(weather.main?.temp ?? 0)}°C</span>
                <span className="capitalize">{weather.weather?.[0]?.description}</span>
                <span className="ml-auto flex items-center gap-1">
                  <Droplets size={12} /> {weather.main?.humidity}%
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── PRAYER TIMES SCROLL ROW ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-[#1a4731] text-base">নামাজের সময়সূচি</h3>
            <button className="text-xs text-[#1a4731]/60 flex items-center gap-0.5">সব দেখুন <ChevronRight size={12} /></button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {prayerOrder.map((p) => {
              const isNext = nextPrayer?.name === p;
              const isActive = activePrayer === p;
              return (
                <div key={p}
                  className={`flex-shrink-0 rounded-2xl px-4 py-3 text-center transition-all ${
                    isNext
                      ? "bg-[#1a4731] text-white shadow-lg scale-105"
                      : isActive
                      ? "bg-amber-100 border-2 border-amber-400"
                      : "bg-white border border-[#1a4731]/10"
                  }`}
                  style={{ minWidth: 72 }}
                >
                  <p className={`text-xs mb-1 ${isNext ? "text-white/70" : "text-gray-400"}`}>{prayerLabels[p]}</p>
                  <p className={`font-bold text-sm ${isNext ? "text-white" : isActive ? "text-amber-700" : "text-[#1a4731]"}`}>
                    {timings[p]}
                  </p>
                  {isActive && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mx-auto mt-1" />}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── SUNRISE / SUNSET ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400/20 rounded-full flex items-center justify-center">
              <Sun size={18} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">সূর্যোদয়</p>
              <p className="font-bold text-[#1a4731]">{timings.Sunrise}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/60 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-400/20 rounded-full flex items-center justify-center">
              <Moon size={18} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">সূর্যাস্ত</p>
              <p className="font-bold text-[#1a4731]">{timings.Sunset || timings.Maghrib}</p>
            </div>
          </div>
        </div>

        {/* ── BANNER SLIDER ── */}
        <div>
          <div className="relative h-44 rounded-2xl overflow-hidden shadow-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image src={bannerSlides[currentSlide].image} alt="banner" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="text-xs bg-amber-400 text-amber-900 font-bold px-2 py-0.5 rounded-full mb-2 inline-block">
                    {bannerSlides[currentSlide].tag}
                  </span>
                  <h3 className="text-white font-bold text-lg leading-tight">{bannerSlides[currentSlide].title}</h3>
                  <p className="text-white/70 text-xs mt-0.5">{bannerSlides[currentSlide].subtitle}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              {bannerSlides.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)}
                  className={`transition-all rounded-full ${i === currentSlide ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
                />
              ))}
            </div>
          </div>
        </div>

       

        {/* ── Daily Ayah Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1a4731] rounded-3xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-3 right-4 text-white/10 text-8xl font-bold select-none">"</div>
          <p className="text-xs text-amber-300 font-semibold mb-3 flex items-center gap-1.5">
            <Star size={12} className="fill-amber-300" /> আজকের আয়াত
          </p>
          <p className="text-right text-xl leading-loose text-white/90 mb-3" dir="rtl">
            إِنَّ مَعَ الْعُسْرِ يُسْرًا
          </p>
          <p className="text-sm text-white/70">
            "নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।" — সূরা ইনশিরাহ: ৬
          </p>
        </motion.div>

      </div>{/* end max-w container */}

      {/* ── FLOAT SEARCH ── */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-5 w-14 h-14 bg-[#1a4731] text-white rounded-full shadow-2xl flex items-center justify-center z-50"
        style={{ boxShadow: "0 8px 30px rgba(26,71,49,0.45)" }}
      >
        <Search size={20} />
      </motion.button>

    </div>
  );
}