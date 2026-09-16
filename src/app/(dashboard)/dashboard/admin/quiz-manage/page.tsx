"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HelpCircle,
  Plus,
  Trash2,
  Volume2,
  Pause,
  Play,
  FileText,
  CheckCircle2,
  Layers,
  X,
  Loader2,
  UploadCloud,
} from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";

interface IQuestion {
  _id: string;
  category: "letter_recognition" | "pronunciation_tajweed" | "word_meaning";
  mediaType: "text" | "audio";
  questionText: string;
  mediaUrl: string | null;
  options: string[];
  correctAnswer: string;
  order: number;
}

const catBnMap = {
  letter_recognition: "হরফ/অক্ষর চেনা",
  pronunciation_tajweed: "সঠিক উচ্চারণ ও তাজবীদ",
  word_meaning: "শব্দার্থ ও জ্ঞান",
};

const optionMarkers = ["ক)", "খ)", "গ)", "ঘ)"];

// 🎯 কার্ডের ইনলাইন অডিও প্লেয়ার সাব-কম্পোনেন্ট
const CardAudioPlayer = ({ url }: { url: string }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wide border cursor-pointer transition-all ${
        playing
          ? "bg-amber-500 text-white border-amber-500 shadow-md animate-pulse"
          : "bg-emerald-50 text-[#0B5D3B] border-emerald-100 hover:bg-emerald-100"
      }`}
    >
      {playing ? (
        <Pause size={12} className="fill-white" />
      ) : (
        <Play size={12} className="fill-current" />
      )}
      {playing ? "প্লে হচ্ছে..." : "অডিও শুনুন"}
    </button>
  );
};

// 🎯 প্রফেশনাল স্কেলিটন লোডার কম্পোনেন্ট ভাই
const SkeletonCard = () => (
  <div className="bg-white border border-neutral-100 p-6 rounded-[2rem] shadow-2xs space-y-4 animate-pulse">
    <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
      <div className="h-6 w-28 bg-neutral-200 rounded-xl" />
      <div className="h-5 w-16 bg-neutral-200 rounded-lg" />
    </div>
    <div className="bg-neutral-50 p-4 rounded-2xl space-y-2">
      <div className="h-3 w-16 bg-neutral-200 rounded" />
      <div className="h-4 w-3/4 bg-neutral-200 rounded" />
    </div>
    <div className="space-y-2">
      <div className="h-3 w-14 bg-neutral-200 rounded" />
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 bg-neutral-100 rounded-xl border border-neutral-200/40"
          />
        ))}
      </div>
    </div>
    <div className="flex justify-end pt-2 border-t border-neutral-50">
      <div className="h-8 w-8 bg-neutral-100 rounded-xl" />
    </div>
  </div>
);

export default function AdminQuizManage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // ফর্ম স্টেটসমূহ
  const [category, setCategory] = useState("letter_recognition");
  const [mediaType, setMediaType] = useState("text");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswerIdx, setCorrectAnswerIdx] = useState<number | "">("");
  const [order, setOrder] = useState(1);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // ১. ট্যানস্ট্যাক কুয়েরি দিয়ে প্রশ্ন লোড
  const { data: questions = [], isLoading } = useQuery<IQuestion[]>({
    queryKey: ["adminQuizQuestionsList"],
    queryFn: async () => {
      const res = await axiosSecure.get("/quiz/admin/questions");
      return res.data?.data || [];
    },
  });

  // ২. নতুন প্রশ্ন তৈরীর মিউটেশন পাইপলাইন
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosSecure.post("/quiz/admin/questions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminQuizQuestionsList"] });
      Swal.fire({
        title: "ما شاء الله!",
        text: "প্রশ্নটি সফলভাবে যুক্ত হয়েছে।",
        icon: "success",
        confirmButtonColor: "#0B5D3B",
        customClass: { popup: "rounded-[2rem] font-sans" },
      });
      setIsOpen(false);
      resetForm();
    },
  });

  // ৩. প্রশ্ন ডিলিট করার মিউটেশন
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosSecure.delete(`/quiz/admin/questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminQuizQuestionsList"] });
      Swal.fire({
        title: "মুছে ফেলা হয়েছে!",
        text: "প্রশ্নটি ডাটাবেজ থেকে ডিলিট হয়েছে।",
        icon: "success",
        confirmButtonColor: "#0B5D3B",
        customClass: { popup: "rounded-[2rem] font-sans" },
      });
    },
  });

  const resetForm = () => {
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswerIdx("");
    setMediaFile(null);
    setMediaType("text");
  };

  const handleOptionChange = (idx: number, value: string) => {
    const updated = [...options];
    updated[idx] = value;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (correctAnswerIdx === "") {
      Swal.fire({
        title: "সঠিক উত্তর বাছুন!",
        text: "অপশনগুলোর মধ্য থেকে যেকোনো ১টিকে সঠিক উত্তর হিসেবে সিলেক্ট করুন ভাই।",
        icon: "warning",
        confirmButtonColor: "#B45309",
      });
      return;
    }

    const resolvedCorrectAnswer = options[correctAnswerIdx];
    if (!resolvedCorrectAnswer || !resolvedCorrectAnswer.trim()) {
      Swal.fire({
        title: "অপশন খালি!",
        text: "সরাসরি সিলেক্ট করার আগে সেই অপশন বক্সে কিছু টাইপ করুন ভাই।",
        icon: "warning",
        confirmButtonColor: "#B45309",
      });
      return;
    }

    const finalQuestionText =
      mediaType === "audio" ? "Audio Context Question" : questionText.trim();

    const fd = new FormData();
    fd.append("category", category);
    fd.append("mediaType", mediaType);
    fd.append("questionText", finalQuestionText);
    fd.append("options", JSON.stringify(options));
    fd.append("correctAnswer", resolvedCorrectAnswer);
    fd.append("order", order.toString());
    if (mediaFile) fd.append("mediaFile", mediaFile);

    createMutation.mutate(fd);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8 pt-24 font-sans antialiased text-neutral-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* হেডার ব্যানার */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200/50 p-6 rounded-[2rem] shadow-3xs">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-neutral-900 flex items-center gap-2">
              <HelpCircle className="text-[#0B5D3B]" /> কুইজ প্রশ্ন ব্যাংক
              মডারেশন
            </h1>
            <p className="text-xs text-neutral-500 font-bold mt-0.5">
              যোগ্যতা যাচাই টেস্টের প্রশ্নপত্র সাজান, অডিও কন্ট্রোল ট্র্যাক
              ইনপুট দিন এবং নিয়ন্ত্রণ করুন।
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center gap-1.5 px-6 py-3.5 bg-[#0B5D3B] hover:bg-[#074229] text-white text-xs font-black rounded-2xl cursor-pointer transition-all shadow-md shadow-emerald-950/10 active:scale-98 select-none"
          >
            <Plus size={14} /> নতুন প্রশ্ন যুক্ত করুন
          </button>
        </div>

        {/* 🎯 কুইজ লিস্ট গ্রিড উইথ স্কেলিটন লোডার */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white border p-16 rounded-[2rem] text-center text-xs font-bold text-neutral-400 shadow-3xs">
            কোনো প্রশ্ন পাওয়া যায়নি। কুইজ সচল করতে প্রশ্ন যুক্ত করুন।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.map((q) => (
              <div
                key={q._id}
                className="bg-white border border-neutral-100 p-6 rounded-[2rem] shadow-2xs flex flex-col justify-between relative overflow-hidden group hover:shadow-sm transition-shadow"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B5D3B] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-neutral-50 pb-3">
                    <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-100/60">
                      {catBnMap[q.category] || q.category}
                    </span>
                    <span className="text-[10px] font-mono font-black text-neutral-400 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-100">
                      ক্রম: #{q.order}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-neutral-100">
                    <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      {q.mediaType === "audio"
                        ? "অডিও ক্যুইজ টাইপ"
                        : "প্রশ্ন বাক্য"}
                    </h3>
                    <p
                      className={`text-slate-800 font-black tracking-tight ${q.mediaType === "audio" ? "text-xs text-neutral-500 italic" : "text-sm md:text-base font-serif"}`}
                    >
                      {q.mediaType === "audio"
                        ? "এই প্রশ্নের উচ্চারণ ফ্রন্টএন্ডে অডিওর সাহায্যে বাজানো হবে।"
                        : q.questionText}
                    </p>
                  </div>

                  {q.mediaType === "audio" && q.mediaUrl && (
                    <div className="flex items-center gap-2 bg-amber-50/40 p-3 rounded-xl border border-amber-100/40 w-fit">
                      <Volume2 size={14} className="text-amber-600 shrink-0" />
                      <CardAudioPlayer url={q.mediaUrl} />
                    </div>
                  )}

                  <div className="space-y-2 pt-1">
                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">
                      অপশনসমূহ
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                            opt === q.correctAnswer
                              ? "bg-emerald-50/70 border-emerald-500 text-emerald-950 font-black"
                              : "bg-white border-neutral-200 text-neutral-600"
                          }`}
                        >
                          <span className="text-neutral-400 text-[11px] font-black">
                            {optionMarkers[oIdx]}
                          </span>
                          <span className="truncate flex-1">{opt}</span>
                          {opt === q.correctAnswer && (
                            <CheckCircle2
                              size={13}
                              className="text-emerald-700 shrink-0"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-neutral-50 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      Swal.fire({
                        title: "আপনি কি নিশ্চিত?",
                        text: "এই প্রশ্নটি ডাটাবেজ থেকে স্থায়ীভাবে মুছে যাবে ভাই।",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        confirmButtonText: "হ্যাঁ, ডিলিট করুন",
                        cancelButtonText: "বাতিল",
                        customClass: { popup: "rounded-[2rem] font-sans" },
                      }).then(
                        (r) => r.isConfirmed && deleteMutation.mutate(q._id),
                      );
                    }}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 📋 মডার্ন সাইড ড্রয়ার মোডাল */}
        {isOpen && (
          <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-3xs z-50 flex justify-end">
            <div className="bg-white w-full max-w-lg h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between relative animate-in slide-in-from-right duration-200">
              <div>
                <div className="flex items-center justify-between border-b pb-4 mb-5 border-neutral-100">
                  <h2 className="text-lg font-black text-neutral-900 flex items-center gap-2">
                    <Layers size={18} className="text-[#0B5D3B]" /> নতুন প্রশ্ন
                    ফরম্যাট
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 bg-neutral-50 rounded-full text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-black text-neutral-700 uppercase mb-1.5">
                      প্রশ্নের ক্যাটাগরি
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-neutral-200 bg-neutral-50/50 p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-[#0B5D3B] cursor-pointer"
                    >
                      <option value="letter_recognition">
                        হরফ/অক্ষর চেনা (Letter)
                      </option>
                      <option value="pronunciation_tajweed">
                        সঠিক উচ্চারণ ও তাজবীদ (Pronunciation)
                      </option>
                      <option value="word_meaning">
                        কুরআনের শব্দার্থ (Meaning)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-neutral-700 uppercase mb-1.5">
                      মিডিয়া ফরম্যাট ধরণ
                    </label>
                    <select
                      value={mediaType}
                      onChange={(e) =>
                        setMediaType(e.target.value as "text" | "audio")
                      }
                      className="w-full border border-neutral-200 bg-neutral-50/50 p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-[#0B5D3B] cursor-pointer"
                    >
                      <option value="text">র-টেক্সট অনলি (Text)</option>
                      <option value="audio">
                        ছোট অডিও স্পিকার প্লে (Audio)
                      </option>
                    </select>
                  </div>

                  {mediaType === "text" && (
                    <div>
                      <label className="block text-xs font-black text-neutral-700 uppercase mb-1.5">
                        আরবি শব্দ / প্রশ্ন বাক্য
                      </label>
                      <input
                        type="text"
                        required
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="যেমন: كِتَابٌ অথবা ب"
                        className="w-full border border-neutral-200 p-3.5 rounded-xl text-xs font-bold focus:outline-none focus:border-[#0B5D3B] font-serif text-lg text-center"
                      />
                    </div>
                  )}

                  {mediaType === "audio" && (
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-neutral-700 uppercase">
                        অডিও ফাইল কন্ট্রোল
                      </label>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-200 hover:border-[#0B5D3B] bg-neutral-50/50 rounded-2xl cursor-pointer transition-all p-4 group text-center">
                        <div className="flex flex-col items-center justify-center space-y-1.5">
                          <UploadCloud
                            size={28}
                            className="text-neutral-400 group-hover:text-[#0B5D3B] transition-colors"
                          />
                          <p className="text-xs font-black text-neutral-600">
                            ক্বারী সাহেবের রেকর্ডকৃত অডিও বাছুন
                          </p>
                          <p className="text-[10px] text-neutral-400 font-bold">
                            MP3 বা WAV ফরম্যাট সাপোর্টেড
                          </p>
                        </div>
                        <input
                          type="file"
                          required
                          accept="audio/*"
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            setMediaFile(e.target.files[0])
                          }
                          className="hidden"
                        />
                      </label>
                      {mediaFile && (
                        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-[11px] font-bold text-emerald-800 animate-in fade-in">
                          <Volume2 size={14} /> ফাইল রেডি:{" "}
                          <span className="truncate max-w-[200px] font-mono">
                            {mediaFile.name}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 🎯 এমসিকিউ অপশনসমূহ ক), খ), গ), ঘ) মার্কার সহ */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-neutral-700 uppercase">
                      এমসিকিউ অপশনসমূহ
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {options.map((opt, idx) => (
                        <div key={idx} className="relative flex items-center">
                          <span className="absolute left-3.5 text-xs font-black text-neutral-400 select-none">
                            {optionMarkers[idx]}
                          </span>
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(idx, e.target.value)
                            }
                            placeholder={`অপশন ${idx + 1}`}
                            className="w-full border border-neutral-200 p-3.5 pl-10 rounded-xl text-xs font-bold focus:outline-none focus:border-[#0B5D3B]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 🎯 নতুন আপডেট: সঠিক উত্তরের জন্য ইজি ক্লিক ড্রপডাউন সিলেক্টর */}
                  <div>
                    <label className="block text-xs font-black text-neutral-700 uppercase mb-1.5">
                      সঠিক উত্তর নির্বাচন (Correct Answer)
                    </label>
                    <select
                      required
                      value={correctAnswerIdx}
                      onChange={(e) =>
                        setCorrectAnswerIdx(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      className="w-full border border-neutral-200 bg-neutral-50 p-3.5 rounded-xl text-xs font-black focus:outline-none focus:border-[#0B5D3B] cursor-pointer text-emerald-800"
                    >
                      <option value="">-- সঠিক অপশনটি বেছে নিন --</option>
                      {options.map((opt, idx) => (
                        <option key={idx} value={idx} disabled={!opt.trim()}>
                          {optionMarkers[idx]}{" "}
                          {opt.trim() || "(প্রথমে অপশন বক্সে লিখুন ভাই)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-neutral-700 uppercase mb-1.5">
                      প্রশ্ন ক্রম অবস্থান (Order No)
                    </label>
                    <input
                      type="number"
                      required
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      className="w-full border border-neutral-200 p-3.5 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#0B5D3B]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full py-4.5 bg-[#0B5D3B] hover:bg-[#074229] disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-black rounded-2xl text-xs md:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-6 shadow-md shadow-emerald-950/10 active:scale-[0.99]"
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <FileText size={14} /> ডাটাবেজে প্রশ্নটি সেভ করুন
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}