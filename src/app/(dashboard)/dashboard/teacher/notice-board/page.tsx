"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  Loader2,
  Megaphone,
  Pin,
  Trash2,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PostNoticeModal from "@/src/components/shared/NoticeModal";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";

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
  viewsCount: number;
  course: ApiCourse;
  createdAt?: string;
}

interface NoticeStats {
  totalNotice: number;
  urgent: number;
  pinned: number;
}

interface ApiResponse {
  stats: NoticeStats;
  data: Notice[];
}

const TYPE_CONFIG: Record<
  NoticeType,
  {
    label: string;
    text: string;
    bg: string;
    border: string;
    dot: string;
    accent: string;
  }
> = {
  urgent: {
    label: "জরুরী",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-100",
    dot: "bg-red-500",
    accent: "border-l-red-500",
  },
  important: {
    label: "গুরুত্বপূর্ণ",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
    dot: "bg-amber-500",
    accent: "border-l-amber-500",
  },
  general: {
    label: "সাধারণ",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    dot: "bg-emerald-500",
    accent: "border-l-emerald-500",
  },
};

export default function NoticePage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [selectedType, setSelectedType] = useState<NoticeType | "all">("all");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Fetch Stats and Notices
  const { data: serverData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["teacherNotices"],
    queryFn: async () => {
      const res = await axiosSecure.get("/notices/teacher/my-notices");
      return res.data;
    },
  });

  const { data: filterCourses } = useQuery<ApiCourse[]>({
    queryKey: ["teacherFilterCourses"],
    queryFn: async () => {
      const res = await axiosSecure.get("/courses/teacher/my-courses");
      return res.data;
    },
  });

  const pinMutation = useMutation({
    mutationFn: async ({ id, pinned }: { id: string; pinned: boolean }) => {
      return await axiosSecure.put(`/notices/teacher/${id}`, { pinned });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherNotices"] });
    },
  });

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "ডিলিট করার পর নোটিশটি আর ফিরে পাওয়া যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
      customClass: { popup: "rounded-[24px]" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/notices/teacher/delete-notice/${id}`);
          queryClient.invalidateQueries({ queryKey: ["teacherNotices"] });
          Swal.fire(
            "ডিলিট হয়েছে!",
            "নোটিশটি সফলভাবে মুছে ফেলা হয়েছে।",
            "success",
          );
        } catch (error) {
          Swal.fire("দুঃখিত", "নোটিশটি ডিলিট করা যায়নি।", "error");
        }
      }
    });
  };

  const handleEditInit = (notice: Notice) => {
    setEditingNotice(notice);
    setModalOpen(true);
  };

  const handleCreateInit = () => {
    setEditingNotice(null);
    setModalOpen(true);
  };

  const noticesList = serverData?.data || [];
  const stats = serverData?.stats || { totalNotice: 0, urgent: 0, pinned: 0 };

  const filteredNotices = noticesList.filter((notice) => {
    const matchType = selectedType === "all" || notice.type === selectedType;
    const matchCourse =
      selectedCourse === "all" || notice.course?._id === selectedCourse;
    return matchType && matchCourse;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotices = filteredNotices.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleTypeChange = (type: NoticeType | "all") => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/40 p-3 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
        {/* Top Sticky/Responsive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <Megaphone size={22} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                শিক্ষক নোটিশ বোর্ড
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                শিক্ষার্থীদের গুরুত্বপূর্ণ ক্লাসের আপডেট বা নোটিশ প্রদান করুন।
              </p>
            </div>
          </div>

          {/* Green Premium Gradient Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateInit}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold px-4 py-2.5 sm:py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 shrink-0 text-center w-full sm:w-auto"
          >
            <Plus size={16} strokeWidth={2.5} />
            নতুন নোটিশ তৈরি
          </motion.button>
        </div>

        {/* Responsive Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {[
            {
              label: "মোট নোটিশ",
              value: stats.totalNotice,
              bg: "from-indigo-50/50 to-indigo-50/10",
              border: "border-indigo-100/70",
              text: "text-indigo-600",
            },
            {
              label: "জরুরী নোটিশ",
              value: stats.urgent,
              bg: "from-red-50/50 to-red-50/10",
              border: "border-red-100/70",
              text: "text-red-600",
            },
            {
              label: "পিনড্ নোটিশ",
              value: stats.pinned,
              bg: "from-amber-50/50 to-amber-50/10",
              border: "border-amber-100/70",
              text: "text-amber-600",
            },
          ].map((s, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${s.bg} ${s.border} border p-3.5 sm:p-5 rounded-2xl shadow-sm`}
            >
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 block tracking-tight">
                {s.label}
              </span>
              <span
                className={`text-xl sm:text-2xl font-black ${s.text} block mt-0.5 sm:mt-1`}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Filters Panel Control */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          {/* Scrollable on Mobile View */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl overflow-x-auto no-scrollbar max-w-full">
            {(["all", "urgent", "important", "general"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                  ${selectedType === t ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                {t === "all" ? "সবগুলো" : TYPE_CONFIG[t].label}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Cards List Area with Framer Motion Layout Transitions */}
        <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout">
            {currentNotices.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-dashed border-slate-200 text-center py-16 rounded-3xl"
              >
                <Megaphone size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs sm:text-sm font-bold text-slate-400">
                  কোনো নোটিশ পাওয়া যায়নি
                </p>
              </motion.div>
            ) : (
              currentNotices.map((notice) => {
                const cfg = TYPE_CONFIG[notice.type];
                return (
                  <motion.div
                    layout
                    key={notice._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                    className={`group relative bg-white rounded-2xl border p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow border-l-4 ${cfg.accent} ${cfg.border}`}
                  >
                    {/* Header Details */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {notice.pinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                            <Pin size={10} className="fill-amber-600" /> পিন করা
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full max-w-[180px] sm:max-w-xs truncate">
                          {notice.course?.name || "কোর্স লোড হচ্ছে"}
                        </span>
                      </div>

                      {/* Floating Control Panel */}
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() =>
                            pinMutation.mutate({
                              id: notice._id,
                              pinned: !notice.pinned,
                            })
                          }
                          className={`p-1.5 rounded-lg border transition-colors ${notice.pinned ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"}`}
                        >
                          <Pin
                            size={12}
                            className={notice.pinned ? "fill-amber-600" : ""}
                          />
                        </button>
                        <button
                          onClick={() => handleEditInit(notice)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(notice._id)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Context Details */}
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight mb-1">
                      {notice.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed whitespace-pre-line">
                      {notice.description}
                    </p>

                    {/* Views & Timestamp Metrics */}
                    <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                      <span>দেখা হয়েছে: {notice.viewsCount || 0} বার</span>
                      {notice.createdAt && (
                        <span>
                          {new Date(notice.createdAt).toLocaleDateString(
                            "bn-BD",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pagination Controls UI */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Isolated Modal Render with Framer Motion Exit Capabilities */}
        <AnimatePresence>
          {modalOpen && (
            <PostNoticeModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              editingNotice={editingNotice}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
