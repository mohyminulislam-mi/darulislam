"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, FileText } from "lucide-react";
import LoadingSpinner from "./spinner/LoadingSpinner";

interface GeneralNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingNotice: any;
  onSubmit: (data: {
    title: string;
    description: string;
    type: string;
    category: string;
  }) => void;
  isPending: boolean;
}

export default function GeneralNoticeModal({
  isOpen,
  onClose,
  editingNotice,
  onSubmit,
  isPending,
}: GeneralNoticeModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("normal");
  const [category, setCategory] = useState("others");

  useEffect(() => {
    if (editingNotice) {
      setTitle(editingNotice.title || "");
      setDescription(editingNotice.description || "");
      setType(editingNotice.type || "normal");
      setCategory(editingNotice.category || "others");
    } else {
      setTitle("");
      setDescription("");
      setType("normal");
      setCategory("others");
    }
  }, [editingNotice, isOpen]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, type, category });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white w-full max-w-lg rounded-2xl border border-neutral-100 shadow-xl overflow-hidden flex flex-col max-h-[90vh] relative z-10"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div>
                <h3 className="text-sm font-black text-neutral-800">
                  {editingNotice
                    ? "মাদরাসা নোটিশ সংশোধন"
                    : "নতুন গ্লোবাল নোটিশ তৈরি"}
                </h3>
                <p className="text-[10px] text-neutral-400 font-medium">
                  পুরো মাদরাসার সাধারণ নোটিশবোর্ডের জন্য তথ্য দিন
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-neutral-200/60 rounded-lg text-neutral-400 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleFormSubmit}
              className="p-5 space-y-4 overflow-y-auto flex-1 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-neutral-600">
                  নোটিশের শিরোনাম (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="উদা: রমজানুল মোবারক উপলক্ষে মাদরাসার সময়সূচী পরিবর্তন"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all"
                />
              </div>

              {/* টাইপ এবং ক্যাটাগরি */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600">
                    নোটিশের ধরন (Type) *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all"
                  >
                    <option value="normal">সাধারণ (Normal)</option>
                    <option value="important">গুরুত্বপূর্ণ (Important)</option>
                    <option value="urgent">জরুরী (Urgent)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-600">
                    ক্যাটাগরি (Category) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all"
                  >
                    <option value="others">সাধারণ নোটিশ</option>
                    <option value="holiday">ছুটি সংক্রান্ত</option>
                    <option value="class">ক্লাস নোটিশ</option>
                    <option value="exam">পরীক্ষা সংক্রান্ত</option>
                    <option value="admission">ভর্তি বিজ্ঞপ্তি</option>
                    <option value="event">অনুষ্ঠান</option>
                  </select>
                </div>
              </div>

              {/* নোটিশ বিবরণ */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-600">
                  নোটিশের বিস্তারিত বিবরণ (Description) *
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="নোটিশের বিস্তারিত কন্টেন্ট এখানে লিখুন..."
                  rows={5}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all resize-none font-medium leading-relaxed"
                />
              </div>

              {/* অ্যাকশন বাটন */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 hover:cursor-pointer py-2 bg-neutral-100 hover:bg-neutral-200/70 text-neutral-600 font-bold rounded-xl transition-all"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 hover:cursor-pointer bg-[#0B5D3B] hover:bg-[#0c462a] text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  {isPending && <Loader2 className="animate-spin" />}
                  <span>{editingNotice ? "সংশোধন করুন" : "প্রকাশ করুন"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
