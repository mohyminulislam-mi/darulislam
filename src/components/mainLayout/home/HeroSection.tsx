"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, PlayCircle, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
// 🎯 নেক্সট জেএস অপ্টিমাইজড ইমেজ কম্পোনেন্ট ইমপোর্ট ভাই
import Image from "next/image";

import useUser from "@/src/app/hooks/useUser";
import useUserRole from "@/src/app/hooks/useUserRole";

type SlideType = {
  _id: string;
  pageName: string;
  badgeText: string;
  title: string;
  subtitle: string;
  image: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  isActive: boolean;
};

const LOCAL_STORAGE_KEY = "fallback_hero_sliders";

const fetchHeroSliders = async (): Promise<SlideType[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/content/sliders`,
  );
  const filteredData = res.data.filter(
    (slide: SlideType) =>
      slide.pageName === "landing" && slide.isActive !== false,
  );

  // 🎯 ডাটা সফলভাবে ফেচ হলে লোকাল স্টোরেজে ব্যাকআপ রেখে দিচ্ছি ভাই
  if (typeof window !== "undefined" && filteredData.length > 0) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredData));
  }

  return filteredData;
};

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false); // 🎯 Hydration safety mount lock

  const { data: user } = useUser();
  const { role: userRole } = useUserRole();

  // 🎯 ব্রাউজার এনভায়রনমেন্টে ক্যাশড ডাটা রিড করার ইনিশিয়াল মেকানিজম ভাই
  const getCachedSlides = (): SlideType[] => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  };

  // 🎯 রিঅ্যাক্ট কুয়েরি মেগা পারফরম্যান্স টিউনিং লক ভাই
  const {
    data: fetchedSlides,
    isLoading,
    isError,
  } = useQuery<SlideType[]>({
    queryKey: ["publicHeroSliders"],
    queryFn: fetchHeroSliders,
    staleTime: 1000 * 60 * 30, // ⏳ ৩০ মিনিট ক্যাশ জেনারেশন লক ভাই
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🎯 HYDRATION GUARD: সার্ভার বা আনমাউন্টেড স্টেটে ক্যাশ চেক স্কিপ করে খালি অ্যারে রাখা হলো ভাই
  const slides = !isMounted
    ? []
    : isError || !fetchedSlides || fetchedSlides.length === 0
      ? getCachedSlides()
      : fetchedSlides;

  const nextSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // 🎯 শিমার স্কেলিটন লোডার ভাই (শুধুমাত্র তখনই দেখাবে যখন একদম প্রথমবার লোড হচ্ছে এবং ক্যাশেও কোনো ডাটা নেই)
  if (!isMounted || (isLoading && slides.length === 0)) {
    return (
      <section className="relative h-[220px] md:h-[300px] lg:h-[500px] mt-16 lg:mt-18 overflow-hidden bg-slate-900 animate-pulse max-w-11/12 mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D2E]/90 via-[#0b3d2e]/40 to-transparent z-10" />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-screen-xl mx-auto w-full px-3 lg:px-8 space-y-4">
            <div className="h-4 w-24 md:h-6 md:w-36 bg-white/10 rounded-full" />
            <div className="space-y-2">
              <div className="h-6 w-[65%] sm:h-8 lg:h-16 bg-white/20 rounded-xl" />
              <div className="h-6 w-[45%] sm:h-8 lg:h-12 bg-white/10 rounded-xl" />
            </div>
            <div className="h-3 w-[55%] lg:h-6 lg:w-[50%] bg-white/5 rounded-lg pt-1" />
            <div className="flex gap-3 pt-2">
              <div className="h-8 w-24 lg:h-14 lg:w-40 bg-white/20 rounded-md lg:rounded-xl" />
              <div className="h-8 w-24 lg:h-14 lg:w-40 bg-white/10 rounded-md lg:rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // যদি ক্যাশ এবং API দুইটাতেই কোনো ডাটা না থাকে, শুধু তখনই নাল রিটার্ন করবে
  if (slides.length === 0) {
    return null;
  }

  const getPrimaryButtonConfig = (slide: SlideType) => {
    if (user) {
      if (userRole === "admin") {
        return { text: "ড্যাশবোর্ডে যান", link: "/dashboard/admin" };
      }
      if (userRole === "teacher") {
        return { text: "ড্যাশবোর্ডে যান", link: "/dashboard/teacher" };
      }
      return { text: "ক্লাসে যোগ দিন", link: "/my-course" };
    }
    return {
      text: slide.primaryBtnText || "ভর্তি হতে ক্লিক করুন",
      link: slide.primaryBtnLink || "/auth/register",
    };
  };

  return (
    <section className="relative h-[220px] md:h-[300px] lg:h-[500px] mt-16 lg:mt-17 overflow-hidden bg-slate-950 max-w-11/12 mx-auto">
      {/* Slides */}
      {slides.map((slide, index) => {
        const primaryBtn = getPrimaryButtonConfig(slide);

        return (
          <div
            key={slide._id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D2E]/92 via-[#0B3D2E]/62 to-transparent z-10" />

            {/* 🎯 র-ইমেজ রিপ্লেস করে নেক্সট ইমেজ সিকিউর লক ভাই */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
                unoptimized={slide.image.includes(".svg")}
              />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-screen-xl mx-auto w-full px-3 lg:px-8">
                <div className="max-w-2xl space-y-2 lg:space-y-2">
                  {/* Tag */}
                  {slide.badgeText && (
                    <span className="inline-block bg-[#22c55e] text-white px-2 py-0.5 lg:px-4 lg:py-1 rounded-full font-full-black text-[10px] lg:text-base font-bold">
                      {slide.badgeText}
                    </span>
                  )}

                  {/* Title */}
                  <h1 className="text-2xl sm:text-base lg:text-7xl font-black text-white leading-tight">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  {slide.subtitle && (
                    <p className="text-[10px] sm:text-xs lg:text-2xl font-medium leading-tight lg:leading-relaxed text-[#F5EFE1] opacity-90">
                      {slide.subtitle}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-2 lg:gap-4 pt-1">
                    {slide.primaryBtnText && (
                      <Link
                        href={primaryBtn.link}
                        className="bg-[#0B5D3B] text-white px-3 py-1.5 lg:px-8 lg:py-4 rounded-md lg:rounded-xl font-bold flex items-center justify-center gap-1 lg:gap-2 text-[10px] lg:text-base transition-all hover:bg-[#0B3D2E] hover:translate-y-[-2px]"
                      >
                        {primaryBtn.text} <PlayCircle size={16} />
                      </Link>
                    )}

                    {slide.secondaryBtnText && (
                      <Link
                        href={slide.secondaryBtnLink || "/courses"}
                        className="bg-white/15 text-white border-2 border-white/30 px-3 py-1.5 lg:px-8 lg:py-4 rounded-md lg:rounded-xl font-bold flex items-center justify-center gap-1 lg:gap-2 text-[10px] lg:text-base transition-all hover:bg-white/25"
                      >
                        {slide.secondaryBtnText} <BookOpen size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Controls */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 lg:p-3 rounded-full text-white backdrop-blur-md transition-all hidden lg:block"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 lg:p-3 rounded-full text-white backdrop-blur-md transition-all hidden lg:block"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 lg:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-1 lg:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-2 lg:h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-[#22c55e] w-4 lg:w-8"
                  : "bg-white/30 w-2 lg:w-3"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
