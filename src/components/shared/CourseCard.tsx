"use client";

import React from "react";
import Image from "next/image";
import { Clock, Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface CourseData {
  _id: string;
  title: string;
  image?: string;
  courseType: string;
  price: string | number;
  oldPrice?: string | number;
  duration: string;
}

interface CourseCardProps {
  course: CourseData;
  idx: number;
  onEdit: (course: CourseData) => void;
  onDelete: (id: string) => void;
}

const CourseCard = ({ course, idx, onEdit, onDelete }: CourseCardProps) => {
  const hasDiscount =
    course.oldPrice && Number(course.oldPrice) > Number(course.price);

  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(course.oldPrice) - Number(course.price)) /
          Number(course.oldPrice)) *
          100,
      )
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-2xl md:rounded-3xl border border-neutral-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden group hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-neutral-200/60 transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Thumbnail সেকশন */}
      <div className="relative w-full h-36 md:h-48 overflow-hidden bg-neutral-50 shrink-0">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={idx < 3}
            loading={idx >= 3 ? "lazy" : undefined}
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
            <span className="text-emerald-500/30 text-4xl font-black select-none">
              {course.title?.[0] || "ক"}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90" />

        {/* ব্যাজেস লেআউট */}
        <div className="absolute top-2.5 left-2.5 md:top-4 md:left-4 flex gap-1.5 flex-wrap z-10">
          <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] md:text-[10px] px-2 py-0.5 md:py-1 rounded-md font-bold tracking-wide shadow-xs uppercase leading-none">
            {course.courseType}
          </span>
          {hasDiscount && (
            <span className="bg-rose-500 text-white text-[9px] md:text-[10px] px-2 py-0.5 md:py-1 rounded-md font-bold shadow-xs leading-none">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* ইমেজের উপর টাইটেল প্লেসমেন্ট */}
        <div className="absolute bottom-2.5 left-3 right-3 md:bottom-4 md:left-4 md:right-4 z-10 text-white">
          <h3 className="font-bold text-xs md:text-base leading-snug md:leading-snug line-clamp-2 drop-shadow-xs group-hover:text-emerald-300 transition-colors duration-200">
            {course.title}
          </h3>
        </div>
      </div>

      {/* ইনফরমেশন ও অ্যাকশন কনটেন্ট সেকশন */}
      <div className="p-3.5 md:p-5 flex flex-col flex-grow gap-4">
        {/* প্রাইস এবং সময়কাল রো */}
        <div className="flex items-center justify-between gap-2 border-b border-neutral-50 pb-3">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm md:text-lg font-black text-neutral-900 tracking-tight">
              ৳{Number(course.price).toLocaleString("bn-BD")}
            </span>
            {hasDiscount && (
              <span className="text-[11px] md:text-xs text-neutral-400 line-through decoration-neutral-300">
                ৳{Number(course.oldPrice).toLocaleString("bn-BD")}
              </span>
            )}
          </div>
          <span className="text-[11px] md:text-xs text-neutral-500 font-medium bg-neutral-50 px-2 py-1 rounded-md flex items-center gap-1 shrink-0 border border-neutral-100/50">
            <Clock size={12} className="text-neutral-400" />
            {course.duration}
          </span>
        </div>

        {/* এডিট এবং ডিলিট অ্যাকশন বাটন */}
        <div className="flex gap-2.5 mt-auto">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onEdit(course)}
            aria-label={`এডিট করুন: ${course.title}`}
            className="flex-1 py-2.5 bg-emerald-50/60 text-emerald-700 border border-emerald-100/50 rounded-xl font-bold text-[11px] md:text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200 cursor-pointer"
          >
            <Edit3 size={12} />
            <span>এডিট</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onDelete(course._id)}
            aria-label={`ডিলিট করুন: ${course.title}`}
            className="flex-1 py-2.5 bg-rose-50/60 text-rose-600 border border-rose-100/50 rounded-xl font-bold text-[11px] md:text-xs flex items-center justify-center gap-1.5 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-200 cursor-pointer"
          >
            <Trash2 size={12} />
            <span>ডিলিট</span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default CourseCard;
