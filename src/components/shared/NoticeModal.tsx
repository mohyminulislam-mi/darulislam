"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Loader2, Pin, X } from "lucide-react";
import { motion } from "framer-motion";

type NoticeType = "urgent" | "important" | "general";

interface ApiCourse {
  _id: string;
  name: string;
  category?: string;
}

interface Notice {
  _id: string;
  title: string;
  description: string;
  type: NoticeType;
  pinned: boolean;
  course: ApiCourse;
}

interface PostNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingNotice: Notice | null;
}

const TYPE_CONFIG: Record<
  NoticeType,
  { label: string; text: string; bg: string; border: string; dot: string }
> = {
  urgent: {
    label: "জরুরী",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-100",
    dot: "bg-red-500",
  },
  important: {
    label: "গুরুত্বপূর্ণ",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
    dot: "bg-amber-500",
  },
  general: {
    label: "সাধারণ",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    dot: "bg-emerald-500",
  },
};

export default function PostNoticeModal({
  isOpen,
  onClose,
  editingNotice,
}: PostNoticeModalProps) {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [type, setType] = useState<NoticeType>("general");
  const [pinned, setPinned] = useState(false);

  // Sync states when editingNotice changes
  useEffect(() => {
    if (editingNotice) {
      setTitle(editingNotice.title);
      setDescription(editingNotice.description);
      setCourseId(editingNotice.course?._id || "");
      setType(editingNotice.type);
      setPinned(editingNotice.pinned);
    } else {
      setTitle("");
      setDescription("");
      setCourseId("");
      setType("general");
      setPinned(false);
    }
  }, [editingNotice, isOpen]);

  // 🎯 Safely parse API payload response to ensure it falls back to an empty array
  const { data: teacherCourses = [] } = useQuery<any>({
    queryKey: ["teacherCourses"],
    queryFn: async () => {
      const res = await axiosSecure.get("/courses/teacher/my-courses");
      // Fallback matching various backend nested response conventions
      return res.data?.data || res.data || [];
    },
    enabled: isOpen,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { title, description, course: courseId, type, pinned };

    try {
      if (editingNotice) {
        await axiosSecure.put(`/notices/teacher/${editingNotice._id}`, payload);
      } else {
        await axiosSecure.post("/notices/teacher/add-notice", payload);
      }

      queryClient.invalidateQueries({ queryKey: ["teacherNotices"] });

      Swal.fire({
        icon: "success",
        title: `<span style='font-family: inherit; font-weight: 700; color: #059669;'>${editingNotice ? "আপডেট সফল!" : "প্রকাশিত হয়েছে!"}</span>`,
        html: `<p style='font-family: inherit; font-size: 13px; color: #4b5563;'>নোটিশটি সফলভাবে সংরক্ষণ করা হয়েছে।</p>`,
        confirmButtonColor: "#059669",
        confirmButtonText: "ঠিক আছে",
        customClass: { popup: "rounded-[24px]" },
      });
      onClose();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title:
          "<span style='font-family: inherit; font-weight: 700; color: #dc2626;'>দুঃখিত!</span>",
        html: `<p style='font-family: inherit; font-size: 13px; color: #4b5563;'>${error?.response?.data?.message || "একটি সমস্যা হয়েছে।"}</p>`,
        confirmButtonColor: "#dc2626",
        customClass: { popup: "rounded-[24px]" },
      });
    } finally {
      setLoading(false);
    }
  };

  // Convert potential nested object properties securely into flat array references
  const coursesArray = Array.isArray(teacherCourses) ? teacherCourses : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
        className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col relative z-10"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {editingNotice ? "নোটিশ আপডেট করুন" : "নতুন নোটিশ তৈরি করুন"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              শিক্ষার্থীদের নোটিশ বোর্ডে এটি তাৎক্ষণিক প্রদর্শিত হবে
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          {/* Course Select */}
          <div>
            <label className="text-[11px] font-semibold uppercase text-slate-600 ml-1">
              কোর্স সিলেক্ট করুন
            </label>
            <select
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
            >
              <option value="" className="text-slate-900 bg-white">
                কোর্স পছন্দ করুন
              </option>
              {coursesArray.map((c) => (
                <option
                  key={c._id || c.id}
                  value={c._id || c.id}
                  className="text-slate-900 bg-white py-2"
                >
                  {c.name || c.title} {c.category ? `(${c.category})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-semibold uppercase text-slate-600 ml-1">
              নোটিশের শিরোনাম
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="উদা: আগামীকালের লাইভ ক্লাসের সময় পরিবর্তন"
              className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Type Selector */}
          <div>
            <label className="text-[11px] font-semibold uppercase text-slate-600 ml-1">
              নোটিশের ধরণ
            </label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {(Object.keys(TYPE_CONFIG) as NoticeType[]).map((t) => {
                const cfg = TYPE_CONFIG[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2 cursor-pointer rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1.5
                        ${type === t ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-2 ring-offset-1 ring-slate-100` : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-semibold uppercase text-slate-600 ml-1">
              বিস্তারিত বিবরণ
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="এখানে নোটিশের বিস্তারিত লিখুন..."
              className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
            />
          </div>

          {/* Pin Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center gap-2">
              <Pin
                size={15}
                className={
                  pinned ? "text-amber-500 fill-amber-500" : "text-slate-400"
                }
              />
              <span className="text-xs font-bold text-slate-700">
                টপ নোটিশ হিসেবে পিন করুন
              </span>
            </div>
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="w-4 h-4 border-slate-300 rounded focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-70 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {loading && <Loader2 className="animate-spin" />}
              {editingNotice ? "আপডেট করুন" : "প্রকাশ করুন"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
