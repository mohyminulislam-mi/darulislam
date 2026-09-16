"use client";

import {
  Star,
  Moon,
  BookOpen,
  Quote,
  Heart,
  Users,
  Download,
  Video,
  Mic,
  Image as ImageIcon,
  Calendar,
  MessageSquare,
  Phone,
  Send,
  Scroll,
  CircleDot,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const dawahTopics = [
  {
    title: "ইসলাম পরিচিতি",
    desc: "নতুনদের জন্য ইসলামের মৌলিক বিষয়",
    icon: Star,
    img: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400",
  },
  {
    title: "তাওহীদ",
    desc: "আল্লাহর একত্ববাদ ও ঈমান",
    icon: CircleDot,
    img: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&q=80&w=400",
  },
  {
    title: "নবুওয়াত",
    desc: "নবী-রাসূলগণের জীবন ও শিক্ষা",
    icon: Scroll,
    img: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=400",
  },
  {
    title: "আখিরাত",
    desc: "পরকাল, জান্নাত ও জাহান্নাম",
    icon: Moon,
    img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400",
  },
];

const resources = [
  { name: "বুকলেট", icon: FileText, color: "text-red-500", bg: "bg-red-50" },
  { name: "ভিডিও", icon: Video, color: "text-blue-500", bg: "bg-blue-50" },
  { name: "পডকাস্ট", icon: Mic, color: "text-purple-500", bg: "bg-purple-50" },
  {
    name: "ইনফোগ্রাফিক",
    icon: ImageIcon,
    color: "text-green-500",
    bg: "bg-green-50",
  },
];

export default function DawahPage() {
  return (
    <section className="flex flex-col min-h-screen bg-[#F7FBF7]">
      {/* Hero Section */}
      <div className="relative h-44 lg:h-56 bg-gradient-to-r from-emerald-800 to-teal-900 flex items-end p-6 lg:p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-repeat" />
        <div className="relative z-10 w-full max-w-screen-xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 bg-[#8FE3A9] rounded-2xl flex items-center justify-center text-[#0B3D2E] shadow-lg">
            <Users size={36} />
          </div>
          <div>
            <h1 className="text-2xl lg:text-4xl font-black">দাওয়াহ</h1>
            <p className="text-xs lg:text-sm font-bold text-[#F5EFE1]/80 uppercase tracking-widest mt-1">
              আল্লাহর পথে আহ্বান
            </p>
          </div>
        </div>
      </div>

      {/* Quran Verse */}
      <div className="px-4 py-12 max-w-screen-xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0B3D2E] rounded-[3rem] p-10 lg:p-16 text-center text-[#F5EFE1] relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 p-8 opacity-10">
            <Quote size={80} />
          </div>
          <div className="relative z-10 space-y-8">
            <span className="bg-white/10 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">
              সূরা ফুসসিলাত, ৪১:৩৩
            </span>
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-arabic leading-loose tracking-wide">
                وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ وَعَمِلَ
                صَالِحًا وَقَالَ إِنَّنِي مِنَ الْمُسْلِمِينَ
              </h2>
              <p className="text-lg lg:text-2xl font-bold max-w-3xl mx-auto leading-relaxed">
                "যে ব্যক্তি আল্লাহর দিকে আহ্বান জানায়, সৎকর্ম করে এবং বলে, 'আমি
                মুসলিম', তার চেয়ে উত্তম বক্তা আর কে?"
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 p-8 opacity-10 rotate-180">
            <Quote size={80} />
          </div>
        </motion.div>
      </div>

      <div className="max-w-screen-xl mx-auto w-full px-4 pb-20 space-y-20">
        {/* Dawah Topics */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
              <Heart size={24} />
            </div>
            <h3 className="text-2xl font-black text-[#0B3D2E]">
              দাওয়াহ বিষয় সমূহ
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dawahTopics.map((topic, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-[#0B3D2E]/5 group cursor-pointer"
              >
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={topic.img}
                    alt={topic.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D2E]/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-10 h-10 bg-[#F5EFE1] text-[#0B3D2E] rounded-xl flex items-center justify-center shadow-lg">
                    <topic.icon size={20} />
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-black text-[#0B3D2E] group-hover:text-amber-600 transition-colors">
                    {topic.title}
                  </h4>
                  <p className="text-xs font-bold text-[#0B3D2E]/40 mt-2">
                    {topic.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* New Muslim Support */}
        <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl flex flex-col lg:flex-row gap-12 border border-[#0B3D2E]/5">
          <div className="lg:w-1/2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                <Heart size={24} />
              </div>
              <h3 className="text-2xl font-black text-[#0B3D2E]">
                নতুন মুসলিমদের জন্য
              </h3>
            </div>
            <p className="font-bold text-[#0B3D2E]/60 leading-relaxed">
              আলহামদুলিল্লাহ, ইসলামের সুশীতল ছায়ায় আপনাকে স্বাগতম। আপনার ঈমানি
              সফরকে আরও সহজ করতে আমরা আছি আপনার পাশে।
            </p>
            <div className="space-y-4">
              {[
                {
                  t: "ইসলাম গ্রহণের পর করণীয়",
                  d: "গোসল, নামাজ ও মৌলিক বিষয়",
                  i: Heart,
                },
                {
                  t: "মুসলিম কমিউনিটি খুঁজুন",
                  d: "আপনার এলাকার মসজিদ ও সেন্টার",
                  i: Users,
                },
                {
                  t: "বিনামূল্যে কুরআন উপহার",
                  d: "অনুবাদ ও তাফসির সহ (বাংলা/ইংরেজি)",
                  i: BookOpen,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-[#F7FBF7] rounded-2xl group hover:bg-[#0B3D2E] transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#0B3D2E] group-hover:scale-110 transition-transform">
                    <item.i size={20} />
                  </div>
                  <div>
                    <h5 className="font-black text-[#0B3D2E] group-hover:text-[#F5EFE1] transition-colors">
                      {item.t}
                    </h5>
                    <p className="text-xs font-medium text-[#0B3D2E]/40 group-hover:text-[#F5EFE1]/60 transition-colors">
                      {item.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            {resources.map((res, i) => (
              <div
                key={i}
                className={`p-8 rounded-[2rem] ${res.bg} flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:-translate-y-2 transition-all`}
              >
                <div
                  className={`w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg ${res.color}`}
                >
                  <res.icon size={32} />
                </div>
                <div>
                  <h5 className="font-black text-[#0B3D2E]">{res.name}</h5>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0B3D2E]/40">
                    রিসোর্স ডাউনলোড
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div className="bg-[#0B3D2E] text-[#F5EFE1] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Calendar size={120} />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <Calendar className="text-amber-500" />
                <h3 className="text-2xl font-black">আসন্ন দাওয়াহ ইভেন্ট</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    d: "১৫",
                    m: "MAR",
                    t: "ওপেন ডে: ইসলাম পরিচিতি",
                    p: "বিকাল ৩টা · কেন্দ্রীয় মসজিদ",
                  },
                  {
                    d: "২২",
                    m: "MAR",
                    t: "অনলাইন প্রশ্নোত্তর সেশন",
                    p: "রাত ৯টা · জুম মিটিং",
                  },
                ].map((ev, i) => (
                  <div
                    key={i}
                    className="flex gap-6 p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="text-center bg-[#F5EFE1] text-[#0B3D2E] px-4 py-2 rounded-2xl shrink-0">
                      <span className="text-[10px] font-black uppercase">
                        {ev.m}
                      </span>
                      <p className="text-2xl font-black leading-tight">
                        {ev.d}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-black">{ev.t}</h5>
                      <p className="text-xs font-bold opacity-60 uppercase flex items-center gap-2">
                        <CircleDot size={10} /> {ev.p}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full bg-[#F5EFE1] text-[#0B3D2E] py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform">
                সকল ইভেন্ট দেখুন
              </button>
            </div>
          </div>

          {/* Ask a Question */}
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-[#0B3D2E]/5 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-2xl font-black text-[#0B3D2E]">
                  ইসলাম সম্পর্কে জানতে চান?
                </h3>
              </div>
              <p className="font-bold text-[#0B3D2E]/40 leading-relaxed">
                আপনার মনে কোনো কৌতূহল বা প্রশ্ন থাকলে সরাসরি আমাদের লিখুন। আমরা
                যথাসম্ভব দ্রুত উত্তর দেব ইনশাআল্লাহ।
              </p>
              <div className="space-y-4">
                <textarea
                  rows={4}
                  placeholder="আপনার প্রশ্ন এখানে লিখুন..."
                  className="w-full bg-[#0B3D2E]/5 p-5 rounded-3xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all resize-none"
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="আপনার ইমেইল (ঐচ্ছিক)"
                    className="flex-1 bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all"
                  />
                  <button className="bg-[#0B3D2E] text-[#F5EFE1] px-10 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:-translate-y-1 transition-all">
                    পাঠান <Send size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                <Phone size={18} className="text-green-600" />
                <div>
                  <p className="text-[10px] font-black uppercase text-green-600/60">
                    হটলাইন
                  </p>
                  <p className="text-xs font-black text-[#0B3D2E]">
                    ০১৭১২-৩৪৫৬৭৮
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <MessageSquare size={18} className="text-blue-600" />
                <div>
                  <p className="text-[10px] font-black uppercase text-blue-600/60">
                    হোয়াটসঅ্যাপ
                  </p>
                  <p className="text-xs font-black text-[#0B3D2E]">
                    ০১৭১২-৩৪৫৬৭৯
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
