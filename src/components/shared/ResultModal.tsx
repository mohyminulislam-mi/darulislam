"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  X,
  Award,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  MessageSquare,
  BookOpen,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import LoadingSpinner from "./spinner/LoadingSpinner";

interface StudentAssignmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string;
  token: string;
}

const StudentAssignmentDetailsModal: React.FC<
  StudentAssignmentDetailsModalProps
> = ({ isOpen, onClose, submissionId, token }) => {
  const {
    data: submission,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["studentSubmissionDetails", submissionId],
    queryFn: async () => {
      if (!submissionId) return null;

      const response = await axios.get(
        `https://darulislam-server-v2.vercel.app/api/assignments/teacher/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const allSubmissions = response.data;
      const specificSubmission = allSubmissions.find(
        (item: any) => item._id === submissionId,
      );
      return specificSubmission || null;
    },
    enabled: isOpen && !!submissionId && !!token,
    staleTime: 1000 * 60 * 5,
  });

  if (!isOpen) return null;

  const totalMarks = submission?.assignment?.totalMarks || 0;
  const marksObtained = submission?.marksObtained;
  const isReviewed = submission?.status === "reviewed";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-sans">
        {/* Backdrop Blur Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white w-full max-w-2xl rounded-[1.5rem] lg:rounded-[2rem] shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[90vh] relative z-10"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-neutral-100 flex justify-between items-center bg-gradient-to-r from-emerald-50/30 to-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0B5D3B] flex items-center justify-center shadow-sm">
                <BookOpen size={18} />
              </div>
              <div>
                <h3 className="font-black text-neutral-800 text-sm sm:text-base lg:text-lg">
                  অ্যাসাইনমেন্টের বিবরণ ও ফলাফল
                </h3>
                <p className="text-[10px] sm:text-xs text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                  {submission?.course?.name || "লোড হচ্ছে..."}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-100 rounded-xl text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
            {/* Loading View */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-3 text-neutral-400">
                <LoadingSpinner />
              </div>
            )}

            {/* Error View */}
            {(isError || (!isLoading && !submission)) && (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 className="font-black text-neutral-800 text-sm sm:text-base">
                    ডাটা লোড করতে সমস্যা হয়েছে
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    অনুগ্রহ করে আবার চেষ্টা করুন বা শিক্ষকের সাথে যোগাযোগ করুন।
                  </p>
                </div>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl transition-all"
                >
                  আবার চেষ্টা করুন
                </button>
              </div>
            )}

            {/* Main Content */}
            {!isLoading && submission && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5 lg:space-y-6"
              >
                {/* Status & Marks Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Status Card */}
                  <div
                    className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
                      isReviewed
                        ? "bg-emerald-50/40 border-emerald-100 text-emerald-800"
                        : "bg-amber-50/40 border-amber-100 text-amber-800"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isReviewed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isReviewed ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Clock size={20} />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block tracking-wider">
                        অবস্থা
                      </span>
                      <h4 className="text-sm font-black mt-0.5">
                        {isReviewed ? "মূল্যায়ন সম্পন্ন" : "রিভিউ বাকি আছে"}
                      </h4>
                    </div>
                  </div>

                  {/* Marks Card */}
                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
                      <Award size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block tracking-wider">
                        প্রাপ্ত নম্বর
                      </span>
                      <h4 className="text-sm font-black mt-0.5 text-neutral-800">
                        {isReviewed ? (
                          <span className="text-base sm:text-lg font-black text-[#0B5D3B]">
                            {marksObtained}{" "}
                            <span className="text-xs text-neutral-400 font-medium">
                              / {totalMarks}
                            </span>
                          </span>
                        ) : (
                          <span className="text-neutral-500 font-bold">
                            এখনো দেওয়া হয়নি
                          </span>
                        )}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Assignment Title */}
                <div className="bg-neutral-50/60 p-3.5 rounded-xl border border-neutral-100">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    অ্যাসাইনমেন্ট এর বিষয়
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-neutral-700 mt-1">
                    {submission.assignment?.title}
                  </h4>
                </div>

                {/* Teacher Feedback */}
                {isReviewed && submission.instructorFeedback && (
                  <div className="space-y-2">
                    <h5 className="text-[11px] sm:text-xs font-black text-neutral-500 flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-[#0B5D3B]" />{" "}
                      শিক্ষকের মন্তব্য:
                    </h5>
                    <div className="text-xs sm:text-sm text-neutral-700 bg-emerald-50/20 p-4 rounded-xl border border-emerald-100/50 leading-relaxed font-medium italic">
                      "{submission.instructorFeedback}"
                    </div>
                  </div>
                )}

                {/* Student Notes */}
                {submission.studentNotes && (
                  <div className="space-y-2">
                    <h5 className="text-[11px] sm:text-xs font-black text-neutral-500 flex items-center gap-1.5">
                      <FileText size={14} className="text-neutral-400" /> আপনার
                      পাঠানো নোট:
                    </h5>
                    <p className="text-xs text-neutral-600 bg-neutral-50 p-3.5 rounded-xl border border-neutral-100 leading-relaxed">
                      {submission.studentNotes}
                    </p>
                  </div>
                )}

                {/* Submitted Images Gallery */}
                {submission.submittedImages?.length > 0 && (
                  <div className="space-y-2.5">
                    <h5 className="text-[11px] sm:text-xs font-black text-neutral-500 flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-neutral-400" /> আপনার
                      আপলোড করা ফাইলসমূহ ({submission.submittedImages.length}{" "}
                      টি):
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {submission.submittedImages.map(
                        (imgUrl: string, idx: number) => (
                          <a
                            key={idx}
                            href={imgUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 block hover:shadow-md transition-all duration-300"
                          >
                            <img
                              src={imgUrl}
                              alt={`Submitted page ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="bg-white/95 px-2.5 py-1 text-[10px] font-bold text-neutral-800 rounded-lg shadow-sm">
                                বড় করে দেখুন
                              </span>
                            </div>
                          </a>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 sm:py-2.5 bg-neutral-800 hover:bg-neutral-900 rounded-xl text-white text-xs font-bold transition-all shadow-sm hover:shadow"
            >
              বন্ধ করুন
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentAssignmentDetailsModal;
