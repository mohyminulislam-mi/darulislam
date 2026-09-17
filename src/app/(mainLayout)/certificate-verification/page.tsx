"use client";

import { motion } from "framer-motion";
import {
  Award,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  BookOpen,
  Building2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function CertificateVerificationClient() {
  const [searchId, setSearchId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [certificateResult, setCertificateResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const axiosSecure = useAxiosSecure();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsLoading(true);
    setHasSearched(false);

    const cleanId = searchId.trim().toUpperCase();

    try {
      const res = await axiosSecure.get(`/certificates/${cleanId}`);

      // API Structure অনুযায়ী res.data.data এক্সেস করা হচ্ছে
      if (res.data && res.data.success) {
        setCertificateResult(res.data.data);
      } else {
        setCertificateResult(null);
      }
    } catch (error: any) {
      console.error("সার্টিফিকেট যাচাই করতে সমস্যা হয়েছে:", error);
      setCertificateResult(null);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  const handleReset = () => {
    setSearchId("");
    setCertificateResult(null);
    setHasSearched(false);
  };

  return (
    <section className="min-h-screen bg-[#F7FBF7] py-12 px-4 md:px-8 mt-12 max-w-11/12 mx-auto">
      {/* ব্যানার সেকশন */}
      <div className="max-w-4xl mx-auto text-center mb-10 space-y-4">
        <span className="bg-[#8FE3A9]/20 text-[#0B3D2E] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 justify-center">
          <ShieldCheck size={16} className="text-[#0B3D2E]" /> সনদ যাচাইকরণ
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-[#0B3D2E]">
          সার্টিফিকেট ভেরিফিকেশন
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto font-medium">
          আমাদের প্রতিষ্ঠান থেকে ইস্যুকৃত সকল সনদের সঠিকতা অনলাইনে যাচাই করতে
          নিচে সার্টিফিকেট আইডি অথবা রোল নম্বরটি প্রদান করুন।
        </p>
      </div>

      {/* সার্চ বক্স */}
      <div className="max-w-2xl mx-auto mb-10">
        <form
          onSubmit={handleSearch}
          className="bg-white p-3 md:p-4 rounded-3xl shadow-xl border border-[#0B3D2E]/5 flex flex-col md:flex-row gap-3"
        >
          <div className="relative flex-grow">
            <Award
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="সার্টিফিকেট নম্বর লিখুন (যেমন: CERT-2026-101)"
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#0B3D2E] outline-none transition font-semibold text-gray-800 uppercase"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#0B3D2E] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-green-900 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> যাচাই হচ্ছে...
              </>
            ) : (
              <>
                <Search size={18} /> যাচাই করুন
              </>
            )}
          </button>
        </form>
      </div>

      {/* সার্চ রেজাল্ট সেকশন */}
      {hasSearched && (
        <div className="max-w-3xl mx-auto">
          {certificateResult ? (
            /* ভেরিফাইড সার্টিফিকেট রেজাল্ট */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border-2 border-green-500/30 relative overflow-hidden print:shadow-none print:border-none"
            >
              {/* ভেরিফাইড ব্যাজ ওয়াটারমার্ক */}
              <div className="absolute top-0 right-0 -mt-6 -mr-6 bg-green-500/10 w-32 h-32 rounded-full blur-2xl pointer-events-none" />

              {/* টপ স্ট্যাটাস বার */}
              <div className="flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-green-700 uppercase tracking-wider bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                      অফিসিয়ালি ভেরিফাইড
                    </span>
                    <h3 className="text-lg font-black text-[#0B3D2E] mt-1">
                      সনদটি সঠিক ও বৈধ
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={handleReset}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl transition"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>

              {/* সার্টিফিকেট ডিটেইলস গ্রিড */}
              <div className="py-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <User size={14} /> শিক্ষার্থীর নাম
                    </span>
                    <p className="text-xl font-black text-[#0B3D2E]">
                      {certificateResult.studentName}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <User size={14} /> বাবার নাম
                    </span>
                    <p className="text-lg font-bold text-gray-800">
                      {certificateResult.fatherName}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <BookOpen size={14} /> কোর্সের নাম
                    </span>
                    <p className="text-lg font-bold text-[#0B3D2E]">
                      {certificateResult.courseName}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <Award size={14} /> অর্জিত গ্রেড / ফলাফল
                    </span>
                    <p className="text-lg font-black text-green-700">
                      {certificateResult.grade}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <Calendar size={14} /> ইস্যুর তারিখ
                    </span>
                    <p className="text-base font-bold text-gray-700">
                      {certificateResult.issueDate}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <Award size={14} /> সার্টিফিকেট আইডি
                    </span>
                    <p className="text-base font-bold text-gray-800 uppercase font-mono">
                      {certificateResult.certificateId || certificateResult.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* ফুটার ইস্যুয়ার তথ্য */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
                <span className="flex items-center gap-1">
                  <Building2 size={14} /> {certificateResult.issuedBy}
                </span>
                <span className="text-green-700">অনলাইন ডাটাবেজ ভেরিফাইড</span>
              </div>
            </motion.div>
          ) : (
            /* নট ফাউন্ড / ইনভ্যালিড সার্টিফিকেট */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-red-200 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <XCircle size={36} />
              </div>
              <h3 className="text-2xl font-black text-gray-800">
                কোনো তথ্য পাওয়া যায়নি!
              </h3>
              <p className="text-gray-600 font-medium text-sm max-w-md mx-auto">
                আপনার দেওয়া সার্টিফিকেট আইডি (
                <span className="font-bold text-red-600 uppercase">
                  {searchId}
                </span>
                ) টি আমাদের ডাটাবেজে রেকর্ড করা নেই। অনুগ্রহ করে আইডিটি পুনরায়
                দেখে সঠিক কোড প্রদান করুন।
              </p>
              <button
                onClick={handleReset}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-xl font-bold text-sm transition inline-flex items-center gap-2 mt-2 cursor-pointer"
              >
                <RefreshCw size={16} /> আবার চেষ্টা করুন
              </button>
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}