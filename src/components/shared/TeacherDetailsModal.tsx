"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, BookOpen, Clock, Mail, Phone, UserCheck } from "lucide-react";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";

interface TeacherDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  teacher: any;
}

const TeacherDetailsModal: React.FC<TeacherDetailsModalProps> = ({
  isOpen,
  onClose,
  loading,
  teacher,
}) => {
  if (!isOpen || !teacher) return null;

  const teacherName = teacher.name || teacher.profileData?.teacherNameBn;
  const isApproved = teacher.isApproved ?? teacher.profileData?.isApproved;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-neutral-100 relative z-10 max-h-[90vh] flex flex-col font-sans"
      >
        {/* Close Button */}
        <div className="absolute right-5 top-5 z-20">
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="p-20 flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-y-auto p-6 md:p-8 space-y-6">
            {/* Top Identity Block */}
            <div className="flex flex-col items-center text-center space-y-3 pt-4">
              <div className="relative w-24 h-24">
                <Image
                  src={
                    teacher.profileImage ||
                    teacher.user?.profileImage ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacherName || "Teacher"}`
                  }
                  alt={teacherName || "Teacher"}
                  width={96}
                  height={96}
                  className="rounded-[2rem] border-4 border-emerald-50 shadow-md object-cover w-24 h-24"
                  unoptimized={true}
                />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black text-neutral-800">
                  {teacherName}
                </h3>
                <p className="text-xs text-neutral-400 font-bold tracking-wide mt-0.5 uppercase text-emerald-700">
                  {teacher.designation || "শিক্ষক"}
                </p>
              </div>

              <span
                className={`text-[10px] font-black uppercase px-4 py-1 rounded-full ${
                  isApproved
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {isApproved ? "Verified Account" : "Pending Verification"}
              </span>
            </div>

            <hr className="border-neutral-100" />

            {/* Details Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                বিস্তারিত তথ্যাবলী
              </h4>

              <div className="grid grid-cols-1 gap-3.5">
                {/* Department */}
                <div className="flex items-center gap-3.5 bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-100">
                  <div className="p-2.5 bg-white text-emerald-600 rounded-xl shadow-sm shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">
                      বিভাগ / সাবজেক্ট
                    </p>
                    <p className="text-xs font-bold text-neutral-700 truncate">
                      {teacher.department?.name ||
                        teacher.profileData?.department?.name ||
                        "সাধারণ বিভাগ"}
                    </p>
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-3.5 bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-100">
                  <div className="p-2.5 bg-white text-amber-600 rounded-xl shadow-sm shrink-0">
                    <Clock size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">
                      অভিজ্ঞতা
                    </p>
                    <p className="text-xs font-bold text-neutral-700">
                      {teacher.experience ||
                        teacher.profileData?.experience ||
                        "তথ্য নেই"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3.5 bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-100">
                  <div className="p-2.5 bg-white text-blue-600 rounded-xl shadow-sm shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">
                      ইমেইল এড্রেস
                    </p>
                    <p className="text-xs font-bold text-neutral-700 truncate lowercase">
                      {teacher.email || teacher.user?.email || "তথ্য নেই"}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3.5 bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-100">
                  <div className="p-2.5 bg-white text-purple-600 rounded-xl shadow-sm shrink-0">
                    <Phone size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">
                      মোবাইল নম্বর
                    </p>
                    <p className="text-xs font-bold text-neutral-700">
                      {teacher.phone ||
                        teacher.profileData?.phone ||
                        "তথ্য নেই"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TeacherDetailsModal;
