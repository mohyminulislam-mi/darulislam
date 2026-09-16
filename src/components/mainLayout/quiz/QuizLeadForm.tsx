"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, Play, ShieldCheck, Heart } from "lucide-react";

interface LeadFormProps {
  onSubmit: (name: string, phone: string) => void;
}

export default function QuizLeadForm({ onSubmit }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      onSubmit(name.trim(), phone.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto bg-white border border-neutral-100 rounded-[2.5rem] p-6 md:px-10 md:py-14 shadow-[0_15px_50px_rgba(11,93,59,0.04)] text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600" />
      
      <div className="space-y-4 mb-8">
        {/* <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#0B5D3B] mx-auto border border-emerald-100">
          <Heart size={24} className="fill-[#0B5D3B]" />
        </div> */}
        <h2 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">আপনার তথ্য দিন</h2>
        <p className="text-xs md:text-sm text-neutral-500 font-medium max-w-sm mx-auto">
          যোগ্যতা যাচাই টেস্টটি শুরু করার আগে আপনার নাম ও মোবাইল নম্বরটি প্রদান করুন ভাই।
        </p>
      </div>

      <form onSubmit={handleStart} className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-black text-neutral-700 uppercase mb-2">আপনার নাম</label>
          <div className="relative flex items-center">
            <User size={16} className="absolute left-4 text-neutral-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পূর্ণ নাম লিখুন"
              className="w-full border border-neutral-200 bg-neutral-50/50 p-4 pl-12 rounded-2xl text-sm font-bold focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all text-neutral-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-neutral-700 uppercase mb-2">মোবাইল নাম্বার</label>
          <div className="relative flex items-center">
            <Phone size={16} className="absolute left-4 text-neutral-400" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full border border-neutral-200 bg-neutral-50/50 p-4 pl-12 rounded-2xl text-sm font-mono font-bold focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all text-neutral-800 tracking-wide"
            />
          </div>
          <p className="text-[10px] text-amber-600 font-medium mt-1.5">* সঠিক ফলাফল সংরক্ষণের জন্য ১১ ডিজিটের নম্বরটি দিন ভাই।</p>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#0B5D3B] hover:bg-[#074229] text-white text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/10 active:scale-[0.99] mt-6"
        >
          <Play size={14} className="fill-white" /> টেস্ট শুরু করুন
        </button>
      </form>
    </motion.div>
  );
}