"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle2, Volume2, Pause } from "lucide-react";

interface QuizCardProps {
  question : {
    _id: string;
    category: "letter_recognition" | "pronunciation_tajweed" | "word_meaning";
    mediaType: "text" | "audio";
    questionText: string;
    mediaUrl: string | null;
    options: string[];
  };
  onNext: (selected: string | null) => void;
}

export default function QuizCard({ question, onNext }: QuizCardProps) {
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setSelectedOpt(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [question._id]);

  const toggleAudio = () => {
    if (!question.mediaUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(question.mediaUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // 🎯 ক্যাটাগরি অনুযায়ী ডাইনামিক বাংলা প্রশ্ন জেনারেটর (স্ক্রিনশটের হুবহু সিঙ্ক)
  const getQuestionTitle = (category: string) => {
    switch (category) {
      case "letter_recognition":
        return "নিচের অক্ষরটি কী?";
      case "pronunciation_tajweed":
        return "সঠিক উচ্চারণ কোনটি?";
      case "word_meaning":
        return "শব্দটির অর্থ কী?";
      default:
        return "সঠিক উত্তরটি নির্বাচন করুন";
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question._id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full bg-white rounded-[2.5rem] border border-neutral-100 shadow-[0_20px_50px_rgba(11,93,59,0.02)] p-6 md:p-10 flex flex-col justify-between min-h-[460px] relative"
      >
        <div className="space-y-6 flex-1 flex flex-col justify-center">
          
          {/* 🎯 ক্যাটাগরি ভিত্তিক ডাইনামিক বাংলা হেডিং প্রশ্ন */}
          <h3 className="text-base md:text-lg font-bold text-slate-500 text-center leading-relaxed max-w-xl mx-auto select-none">
            {getQuestionTitle(question.category)}
          </h3>

          {/* Core Focus Window: Adaptive Audio Player or Arabic Typography Scale */}
          <div className="w-full max-w-2xl mx-auto">
            {question.mediaType === "audio" && question.mediaUrl ? (
              <div className="w-full bg-[#EAF7F4] rounded-3xl border border-[#D1EDE4] py-8 flex flex-col items-center justify-center gap-3 shadow-3xs">
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                    isPlaying
                      ? "bg-[#0B5D3B] text-white border-[#0B5D3B] shadow-lg shadow-emerald-950/20 animate-pulse"
                      : "bg-white text-[#0B5D3B] border-[#D1EDE4] hover:bg-neutral-50"
                  }`}
                >
                  {isPlaying ? <Pause size={24} className="fill-white" /> : <Volume2 size={26} />}
                </button>
                <span className="text-xs font-black text-[#0B5D3B] tracking-wide select-none">
                  {isPlaying ? "অডিও প্লে হচ্ছে..." : "অডিও শুনুন"}
                </span>
              </div>
            ) : (
              /* 🎯 ব্যাকএন্ড থেকে আসা রিয়াল-টাইম আরবি শব্দ বা হরফ রেন্ডারিং বক্স */
              <div className="w-full bg-[#EAF7F4] rounded-3xl border border-[#D1EDE4] py-6 flex items-center justify-center shadow-3xs min-h-[140px]">
                <span 
                  className={`text-slate-800 text-center font-extrabold select-text text-4xl md:text-6xl font-serif tracking-normal leading-normal`}
                  dir="rtl"
                >
                  {question.questionText}
                </span>
              </div>
            )}
          </div>

          {/* Interactive MCQ Choice Matrix Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto pt-2">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOpt === opt;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOpt(opt)}
                  className={`p-5 rounded-2xl border text-base font-black transition-all duration-200 flex items-center justify-between text-left cursor-pointer select-none active:scale-[0.99] ${
                    isSelected
                      ? "bg-[#EAF7F4] border-2 border-[#0B5D3B] text-[#0B5D3B] shadow-xs"
                      : "bg-white border-neutral-200/80 text-slate-700 hover:bg-neutral-50/80 hover:border-neutral-300"
                  }`}
                >
                  <span className="truncate pr-2">{opt}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <CheckCircle2
                        size={18}
                        className="text-[#0B5D3B] shrink-0 fill-[#EAF7F4]"
                      />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls Footer Segment */}
        <div className="flex items-center justify-between gap-4 border-t border-neutral-100/70 pt-5 mt-8 max-w-2xl w-full mx-auto h-14">
          <button
            type="button"
            onClick={() => onNext(null)}
            className="text-xs font-black text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer select-none"
          >
            স্কিপ করুন
          </button>

          <AnimatePresence>
            {selectedOpt && (
              <motion.button
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                type="button"
                onClick={() => onNext(selectedOpt)}
                className="px-6 py-3 bg-[#0B5D3B] hover:bg-[#074229] text-white text-xs sm:text-sm font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-950/10 active:scale-97"
              >
                পরবর্তী <ChevronRight size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}