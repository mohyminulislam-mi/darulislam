"use client";

import { House } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 flex items-center justify-center px-6">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 border border-amber-300 rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-amber-300 rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] border border-amber-300 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Crescent Moon */}
      <div className="absolute top-20 right-20 hidden md:block">
        <div className="relative w-24 h-24 rounded-full bg-amber-300">
          <div className="absolute top-0 left-5 w-24 h-24 rounded-full bg-emerald-950" />
        </div>
      </div>

      {/* Mosque Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 opacity-10">
        <svg
          viewBox="0 0 1200 250"
          className="w-full h-auto fill-amber-300"
        >
          <path d="M0 250V200H80V120H120V200H180V90H250V200H350V140H420V200H520V60H600V200H700V120H760V200H880V90H950V200H1050V140H1120V200H1200V250Z" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-[32px] p-10 md:p-14 shadow-2xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-300 text-sm font-semibold mb-6">
            ☪ ৪০৪ ত্রুটি
          </div>

          {/* 404 */}
          <h1 className="text-7xl md:text-8xl font-black text-amber-300 mb-4 drop-shadow-lg">
            404
          </h1>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
          </h2>

          {/* Arabic */}
          <p className="text-amber-200 text-xl mb-4">﷽</p>

          {/* Description */}
          <p className="text-gray-200 leading-relaxed max-w-xl mx-auto mb-10">
            আপনি যে পৃষ্ঠাটি খুঁজছেন তা হয়তো সরিয়ে ফেলা হয়েছে,
            পরিবর্তন করা হয়েছে অথবা বর্তমানে উপলব্ধ নয়।
            অনুগ্রহ করে ঠিকানাটি পুনরায় যাচাই করুন অথবা
            মূল পাতায় ফিরে যান।
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/");
                }
              }}
              className="px-8 py-3 cursor-pointer rounded-2xl border border-amber-300 text-amber-300 font-semibold hover:bg-amber-300 hover:text-emerald-950 transition-all duration-300"
            >
              ← পূর্ববর্তী পাতায় ফিরুন
            </button>

            <Link
              href="/"
              className=" flex items-center gap-2 px-8 py-3 rounded-2xl bg-amber-400 text-emerald-950 font-bold hover:bg-amber-300 transition-all duration-300 shadow-lg"
            >
              <House /> হোম পেজে যান
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-emerald-100/70 text-sm mt-6">
          “যে ব্যক্তি আল্লাহর উপর ভরসা করে, তাঁর জন্য তিনিই যথেষ্ট।”
        </p>
      </div>
    </div>
  );
}