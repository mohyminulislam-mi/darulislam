"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users2,
  Calendar,
  ClipboardList,
  Award,
  Phone,
  User,
  Eye,
  Loader2,
  ArrowUpRight,
  X,
  Sparkles,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";

interface IAnswer {
  questionId: {
    _id: string;
    questionText: string;
    category: string;
  };
  selectedAnswer: string | null;
  isCorrect: boolean;
}

interface ISubmission {
  _id: string;
  visitorDetails: {
    name: string;
    phone: string;
  };
  answers: IAnswer[];
  scoreSummary: {
    letterScore: number;
    pronunciationScore: number;
    meaningScore: number;
    totalScore: number;
  };
  surveyResponses: {
    knowsReading: string;
    namazFocus: string;
    userFacingProblems: string;
  };
  suggestedCourse: string;
  createdAt: string;
}

const SkeletonLeads = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white border border-neutral-100 p-6 rounded-3xl h-28"
        />
      ))}
    </div>
    <div className="bg-white border border-neutral-100 rounded-3xl h-96 w-full" />
  </div>
);

export default function AdminQuizLeads() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedLead, setSelectedLead] = useState<ISubmission | null>(null);

  // ১. সাবমিশন ডাটা লোড কুয়েরি
  const { data: submissions = [], isLoading } = useQuery<ISubmission[]>({
    queryKey: ["adminQuizSubmissionsLeads"],
    queryFn: async () => {
      const res = await axiosSecure.get("/quiz/admin/submissions");
      return res.data?.data || [];
    },
  });

  // ২. সাবমিশন ডিলিট করার ট্যানস্ট্যাক মিউটেশন
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosSecure.delete(`/quiz/admin/submissions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminQuizSubmissionsLeads"],
      });
      Swal.fire({
        title: "মুছে ফেলা হয়েছে!",
        text: "ভিজিটরের সাবমিশনটি সফলভাবে ডিলিট করা হয়েছে ভাই।",
        icon: "success",
        confirmButtonColor: "#0B5D3B",
        customClass: { popup: "rounded-[2rem] font-sans" },
      });
    },
  });

  const handleDeleteClick = (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই কুইজ সাবমিশন ডাটাটি স্থায়ীভাবে মুছে যাবে।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
      customClass: { popup: "rounded-[2rem] font-sans" },
    }).then((r) => {
      if (r.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const totalLeads = submissions.length;
  const standardPassLeads = submissions.filter(
    (s) => s.scoreSummary.totalScore >= 6,
  ).length;
  const baseNeedLeads = totalLeads - standardPassLeads;

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8 pt-24 font-sans antialiased text-neutral-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* হেডার ব্যানার */}
        <div>
          <h1 className="text-xl md:text-2xl font-black text-neutral-900 flex items-center gap-2">
            <Users2 className="text-[#0B5D3B]" /> কুইজ লিড ও ভিজিটর সাবমিশন
          </h1>
          <p className="text-xs text-neutral-500 font-bold mt-0.5 tracking-wide">
            ওয়েবসাইটের যোগ্যতা যাচাই কুইজে অংশগ্রহণকারীদের তালিকা ও লিড ডাটাবেজ
          </p>
        </div>

        {isLoading ? (
          <SkeletonLeads />
        ) : (
          <>
            {/* অ্যানালিটিক্স স্ট্যাটাস কার্ড গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white border border-neutral-200/60 p-5 rounded-3xl shadow-3xs">
                <p className="text-[11px] text-neutral-400 font-black uppercase tracking-wider">
                  সর্বমোট লিড সংখ্যা
                </p>
                <p className="text-3xl font-mono font-black text-neutral-900 mt-2">
                  {totalLeads}
                </p>
              </div>
              <div className="bg-white border border-neutral-200/60 p-5 rounded-3xl shadow-3xs">
                <p className="text-[11px] text-neutral-400 font-black uppercase tracking-wider">
                  উন্নত স্তরের শিক্ষার্থী
                </p>
                <p className="text-3xl font-mono font-black text-amber-600 mt-2">
                  {standardPassLeads}
                </p>
              </div>
              <div className="bg-white border border-neutral-200/60 p-5 rounded-3xl shadow-3xs">
                <p className="text-[11px] text-neutral-400 font-black uppercase tracking-wider">
                  প্রাথমিক স্তরের প্রয়োজন
                </p>
                <p className="text-3xl font-mono font-black text-[#0B5D3B] mt-2">
                  {baseNeedLeads}
                </p>
              </div>
            </div>

            {/* ডাটা টেবিল কন্টেইনার */}
            <div className="bg-white border border-neutral-200/50 rounded-3xl shadow-3xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-neutral-50/70 border-b border-neutral-200/70 text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-5">অংশগ্রহণকারী / তারিখ</th>
                      <th className="py-4 px-5">মোবাইল নাম্বার</th>
                      <th className="py-4 px-5">প্রাপ্ত মোট স্কোর</th>
                      <th className="py-4 px-5">সার্ভে: পাঠ / নামাজ</th>
                      <th className="py-4 px-5 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs md:text-sm font-bold text-neutral-700">
                    {submissions.map((lead) => (
                      <tr
                        key={lead._id}
                        className="hover:bg-neutral-50/40 transition-colors"
                      >
                        <td className="py-4 px-5">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-800 flex items-center gap-1">
                              <User size={12} className="text-neutral-400" />{" "}
                              {lead.visitorDetails.name}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono mt-0.5 flex items-center gap-1">
                              <Calendar size={10} />{" "}
                              {new Date(lead.createdAt).toLocaleDateString(
                                "bn-BD",
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-mono text-slate-600">
                          <a
                            href={`tel:${lead.visitorDetails.phone}`}
                            className="flex items-center gap-1 hover:text-[#0B5D3B]"
                          >
                            <Phone size={12} className="text-neutral-400" />{" "}
                            {lead.visitorDetails.phone}
                          </a>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-1.5">
                            <Award size={14} className="text-[#0B5D3B]" />
                            <span className="font-mono font-black text-[#0B5D3B] text-base">
                              {lead.scoreSummary.totalScore}
                            </span>
                            <span className="text-neutral-400 font-mono text-xs">
                              /১২
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] text-slate-600 bg-neutral-100 px-2 py-0.5 rounded-md w-fit font-medium">
                              কুরআন: {lead.surveyResponses.knowsReading}
                            </span>
                            <span className="text-[11px] text-slate-600 bg-neutral-100 px-2 py-0.5 rounded-md w-fit font-medium mt-1">
                              নামাজ: {lead.surveyResponses.namazFocus}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedLead(lead)}
                              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-neutral-50 hover:bg-emerald-50 text-neutral-500 hover:text-[#0B5D3B] text-[11px] font-black rounded-lg border border-neutral-200/60 hover:border-emerald-200 transition-all cursor-pointer select-none"
                            >
                              <Eye size={12} /> বিবরণ দেখুন
                            </button>

                            {/* 🎯 নতুন আপডেট: ডিলিট বাটন ট্র্যাক উপাদান */}
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(lead._id)}
                              className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {submissions.length === 0 && (
                <div className="p-12 text-center text-xs font-bold text-neutral-400">
                  কোনো ভিজিটর লিড ডাটাবেজে রেকর্ড পাওয়া যায়নি ভাই।
                </div>
              )}
            </div>
          </>
        )}

        {/* 📋 সেন্ট্রাল মোডাল পপআপ */}
        <AnimatePresence>
          {selectedLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedLead(null)}
                className="absolute inset-0 bg-neutral-950/60 backdrop-blur-3xs"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="bg-white w-full max-w-xl rounded-[1.75rem] shadow-2xl overflow-hidden relative z-10 border border-neutral-100"
              >
                {/* সলিড গ্রিন হেডার */}
                <div className="bg-[#0B5D3B] text-white p-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-base md:text-lg font-black flex items-center gap-2">
                      <ClipboardList size={18} /> বিস্তারিত কুইজ ও সার্ভে
                      রিপোর্ট
                    </h2>
                    <p className="text-[10px] text-emerald-100/80 font-bold mt-0.5 tracking-wide">
                      শিক্ষার্থীর যোগ্যতা যাচাই পরীক্ষার তথ্য বিবরণী কার্ড
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-emerald-50 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* মোডাল বডি এরিয়া */}
                <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                  {/* শিক্ষার্থীর সাধারণ প্রোফাইল */}
                  <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-2">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">
                      শিক্ষার্থীর প্রোফাইল
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm font-bold text-slate-800">
                      <p className="flex items-center gap-1.5">
                        <User size={14} className="text-neutral-400 shrink-0" />{" "}
                        নাম: {selectedLead.visitorDetails.name}
                      </p>
                      <p className="flex items-center gap-1.5 font-mono">
                        <Phone
                          size={14}
                          className="text-neutral-400 shrink-0"
                        />{" "}
                        মোবাইল: {selectedLead.visitorDetails.phone}
                      </p>
                    </div>
                  </div>

                  {/* স্কোর ব্রেকডাউন ম্যাট্রিক্স */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">
                      বিষয়ভিত্তিক স্কোর ব্রেকডাউন
                    </p>
                    <div className="grid grid-cols-3 gap-2.5 bg-emerald-50/30 p-3 rounded-2xl border border-emerald-100/40 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-neutral-100/50">
                        <p className="text-[9px] text-neutral-400 font-black uppercase">
                          হরফ জ্ঞান
                        </p>
                        <p className="text-sm font-mono font-black text-emerald-950 mt-0.5">
                          {selectedLead.scoreSummary.letterScore} / ৪
                        </p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-neutral-100/50">
                        <p className="text-[9px] text-neutral-400 font-black uppercase">
                          উচ্চারণ
                        </p>
                        <p className="text-sm font-mono font-black text-emerald-950 mt-0.5">
                          {selectedLead.scoreSummary.pronunciationScore} / ৪
                        </p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-neutral-100/50">
                        <p className="text-[9px] text-neutral-400 font-black uppercase">
                          শব্দার্থ
                        </p>
                        <p className="text-sm font-mono font-black text-emerald-950 mt-0.5">
                          {selectedLead.scoreSummary.meaningScore} / ৪
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* সার্ভে ও ওপেন প্রবলেম টেক্সট */}
                  <div className="bg-amber-50/20 p-4 rounded-2xl border border-amber-100/30 space-y-3">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">
                      ভিজিটর সার্ভে রেসপন্স
                    </p>
                    <div className="space-y-2 text-xs text-slate-700 font-bold">
                      <p className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
                        <span className="font-medium">
                          ১. কুরআন তিলাওয়াত লেভেল:
                        </span>
                        <span className="text-[#0B5D3B]">
                          {selectedLead.surveyResponses.knowsReading}
                        </span>
                      </p>
                      <p className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
                        <span className="font-medium">
                          ২. নামাজে মনোযোগ ট্র্যাকিং:
                        </span>
                        <span className="text-[#0B5D3B]">
                          {selectedLead.surveyResponses.namazFocus}
                        </span>
                      </p>
                      <div className="pt-1.5">
                        <span className="font-medium">
                          ৩. শিক্ষার্থীর নিজস্ব মন্তব্য ও সমস্যা:
                        </span>
                        <div className="bg-white border mt-3 border-neutral-100 p-3 rounded-xl italic text-slate-800 leading-relaxed font-bold">
                          {selectedLead.surveyResponses.userFacingProblems ||
                            "(কোনো সুনির্দিষ্ট মন্তব্য লিখেননি ভাই)"}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
