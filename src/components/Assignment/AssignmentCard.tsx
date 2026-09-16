"use client";

import React from "react";
import {
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  FileText,
  BarChart4,
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { SubmissionType } from "@/src/app/(dashboard)/dashboard/teacher/assignment/submissions/page";
import Image from "next/image";

interface CardProps {
  submission: SubmissionType;
  idx: number;
  onEvaluate: (submission: SubmissionType) => void;
}

const AssignmentCard = ({ submission, idx, onEvaluate }: CardProps) => {
  // Trigger modern modal containing rendered student page documents
  const viewImages = (images: string[]) => {
    if (!images || images.length === 0) {
      Swal.fire({
        text: "কোনো ইমেজ ফাইল জমা দেওয়া হয়নি।",
        icon: "info",
        customClass: { popup: "rounded-[2rem]" },
      });
      return;
    }

    Swal.fire({
      title: `<span class="text-base font-black text-slate-800">শিক্ষার্থীর খাতার ছবিসমূহ</span>`,
      html: `
        <div class="flex flex-col gap-4 max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 text-left">
          ${images
            .map(
              (img, i) => `
            <div class="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 shadow-sm">
              <p class="text-[10px] text-slate-400 font-bold py-1.5 bg-slate-100 text-center uppercase tracking-wide">পৃষ্ঠা নম্বর: ${i + 1}</p>
              <img src="${img}" class="w-full object-contain h-auto max-h-[500px]" alt="Page ${i + 1}"/>
            </div>
          `,
            )
            .join("")}
        </div>
      `,
      confirmButtonText: "বন্ধ করুন",
      confirmButtonColor: "#64748B",
      customClass: { popup: "rounded-[2rem] max-w-xl w-full p-4 sm:p-6" },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="bg-white border border-slate-100 p-4 sm:p-5 rounded-[2rem] shadow-xl shadow-slate-100/30 relative overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:border-emerald-100/50 transition-all duration-300"
    >
      {/* Status Ribbon Indicator Badge */}
      <div
        className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[9px] font-black uppercase tracking-wider shadow-sm ${
          submission.status === "pending"
            ? "bg-orange-50 text-orange-600 border-l border-b border-orange-100/60"
            : "bg-emerald-50 text-emerald-700 border-l border-b border-emerald-100/60"
        }`}
      >
        {submission.status === "pending" ? "রিভিউ বাকি" : "মূল্যায়িত"}
      </div>

      {/* Student Profile Metadata Section */}
      <div className="flex items-start gap-3.5">
        <div className="shrink-0 mt-0.5">
          <div className="w-10 h-10 bg-slate-50 border border-slate-200/60 rounded-full flex items-center justify-center text-emerald-700 overflow-hidden shadow-sm">
            {submission.student?.profilePicture ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${submission.student.profilePicture}`}
                alt="student profile"
                className="w-full h-full object-cover"
                width={40}
                height={40}
                unoptimized
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                }}
              />
            ) : (
              <User size={18} />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider inline-block">
            {submission.course?.name || "জেনারেল কোর্স"}
          </span>
          <h3 className="font-black text-slate-800 text-sm md:text-base leading-snug truncate">
            {submission.assignment?.title}
          </h3>
          <p className="text-[11px] text-slate-400 font-bold">
            শিক্ষার্থী:{" "}
            <span className="font-black text-slate-600">
              {submission.student?.name}
            </span>
          </p>
        </div>
      </div>

      {/* Student Attached Notes Panel */}
      {submission.studentNotes && (
        <div className="mt-4 bg-slate-50/60 rounded-2xl p-3 border border-dashed border-slate-200">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wide">
            <FileText size={12} className="text-slate-400" />
            <span>শিক্ষার্থীর নোট:</span>
          </div>
          <p
            className="text-xs text-slate-600 mt-1 font-semibold leading-relaxed line-clamp-2"
            title={submission.studentNotes}
          >
            "{submission.studentNotes}"
          </p>
        </div>
      )}

      {/* Graded Evaluation Metrics Panel */}
      {submission.status === "reviewed" && (
        <div className="mt-4 bg-emerald-50/30 rounded-2xl p-3.5 border border-emerald-100/50 flex flex-col gap-1 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
            <BarChart4 size={14} className="text-emerald-600" />
            <span>
              প্রাপ্ত স্কোর:{" "}
              <span className="text-emerald-600 text-sm font-black">
                {submission.marksObtained}
              </span>{" "}
              / {submission.assignment?.totalMarks}
            </span>
          </div>
          {submission.instructorFeedback && (
            <p className="text-[11px] text-slate-500 font-medium italic mt-0.5 pl-5">
              "<b>মন্তব্য:</b> {submission.instructorFeedback}"
            </p>
          )}
        </div>
      )}

      {/* Timeline Metadata Footer Section */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100/80">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-bold">
          <Clock size={12} className="text-slate-400" />
          <span>জমা দেওয়া হয়েছে</span>
        </div>

        <div className="flex items-center gap-1.5">
          {submission.status === "pending" ? (
            <span className="text-[10px] sm:text-xs text-orange-500 font-black bg-orange-50 px-2.5 py-0.5 rounded-lg flex items-center gap-1 border border-orange-100/40">
              <AlertCircle size={12} /> পেন্ডিং
            </span>
          ) : (
            <span className="text-[10px] sm:text-xs text-emerald-600 font-black bg-emerald-50 px-2.5 py-0.5 rounded-lg flex items-center gap-1 border border-emerald-100/40">
              <CheckCircle size={12} /> পাসড
            </span>
          )}
        </div>
      </div>

      {/* Component Structural Form Actions Controls */}
      <div className="grid grid-cols-2 gap-2.5 mt-4">
        <button
          onClick={() => viewImages(submission.submittedImages)}
          className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-slate-900/5"
        >
          <Eye size={14} />
          <span>ফাইল দেখুন ({submission.submittedImages?.length || 0})</span>
        </button>
        <button
          onClick={() => onEvaluate(submission)}
          className={`h-10 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-200 cursor-pointer shadow-md ${
            submission.status === "pending"
              ? "bg-[#0B5D3B] text-white hover:bg-emerald-700 shadow-emerald-700/5"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100/80 border border-blue-200/50"
          }`}
        >
          <span>
            {submission.status === "pending" ? "মূল্যায়ন করুন" : "আপডেট করুন"}
          </span>
          {submission.status === "pending" && <ArrowRight size={14} />}
        </button>
      </div>
    </motion.div>
  );
};

export default AssignmentCard;