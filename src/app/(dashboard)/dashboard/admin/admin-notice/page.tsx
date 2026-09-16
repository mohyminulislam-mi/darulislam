"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Megaphone,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import GeneralNoticeModal from "@/src/components/shared/AdminNoticeModal";
import Swal from "sweetalert2";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";

const noticeCategoryBn: Record<string, string> = {
  holiday: "ছুটি সংক্রান্ত",
  class: "ক্লাস নোটিশ",
  exam: "পরীক্ষা সংক্রান্ত",
  admission: "ভর্তি বিজ্ঞপ্তি",
  event: "অনুষ্ঠান",
  others: "সাধারণ নোটিশ",
};

export default function AdminGeneralNotices() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const {
    data: noticeResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminGeneralNotices"],
    queryFn: async () => {
      const res = await axiosSecure.get("/general-notices");
      return res.data;
    },
  });

  const noticesList = noticeResponse?.data || [];

  const createNoticeMutation = useMutation({
    mutationFn: async (noticeData: any) => {
      return (
        await axiosSecure.post("/general-notices/admin/add-notice", noticeData)
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGeneralNotices"] });
      setIsModalOpen(false);
      Swal.fire("সফল!", "নতুন সাধারণ নোটিশটি প্রকাশিত হয়েছে।", "success");
    },
    onError: (err: any) => {
      Swal.fire(
        "এরর!",
        err?.response?.data?.message || "প্রকাশ করা যায়নি",
        "error",
      );
    },
  });

  const updateNoticeMutation = useMutation({
    mutationFn: async ({ id, noticeData }: { id: string; noticeData: any }) => {
      return (await axiosSecure.put(`/general-notices/admin/${id}`, noticeData))
        .data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGeneralNotices"] });
      setIsModalOpen(false);
      Swal.fire("সফল!", "নোটিশটি সফলভাবে সংশোধন করা হয়েছে।", "success");
    },
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await axiosSecure.delete(`/general-notices/admin/${id}`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGeneralNotices"] });
      if (paginatedNotices.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      Swal.fire("ডিলিট হয়েছে!", "নোটিশটি সফলভাবে মুছে ফেলা হয়েছে।", "success");
    },
  });

  const totalPages = Math.ceil(noticesList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedNotices = noticesList.slice(indexOfFirstItem, indexOfLastItem);

  const handleModalSubmit = (noticeData: any) => {
    if (editingNotice) {
      updateNoticeMutation.mutate({ id: editingNotice._id, noticeData });
    } else {
      createNoticeMutation.mutate(noticeData);
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই নোটিশটি ডিলিট করলে স্টুডেন্ট প্যানেল থেকেও চলে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0B5D3B",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) deleteNoticeMutation.mutate(id);
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] p-4 md:p-8 pt-20 lg:pt-24">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-50 text-[#0B5D3B] rounded-xl flex items-center justify-center shadow-inner">
            <Megaphone size={22} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-neutral-800">
              এডমিন নোটিশবোর্ড ম্যানেজমেন্ট
            </h1>
            <p className="text-xs text-neutral-400 font-medium">
              সাধারণ ও গ্লোবাল নোটিশবোর্ড কনফিগারেশন এরিয়া
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingNotice(null);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto hover:cursor-pointer px-4 py-2.5 bg-[#0B5D3B] hover:bg-[#0c462a] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>নতুন নোটিশ তৈরি করুন</span>
        </button>
      </div>

      {/* মেইন ডাটা টেবিল */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Loader2 className="animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-2">
            <AlertTriangle size={32} />
            <p className="text-xs font-bold">
              সার্ভার থেকে নোটিশ ডাটা পাওয়া যায়নি।
            </p>
          </div>
        ) : paginatedNotices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-2">
            <Bell size={40} className="stroke-[1.5]" />
            <p className="text-xs font-bold">
              এই মুহূর্তে কোনো নোটিশ বা ঘোষণা নেই।
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 text-[11px] font-black uppercase text-neutral-500 tracking-wider">
                    <th className="py-4 px-6">নোটিশের বিবরণ</th>
                    <th className="py-4 px-4">ক্যাটাগরি</th>
                    <th className="py-4 px-4">ধরন (Type)</th>
                    <th className="py-4 px-4">প্রকাশের তারিখ</th>
                    <th className="py-4 px-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 text-xs text-neutral-700 font-medium">
                  {paginatedNotices.map((notice: any) => {
                    const isUrgent = notice.type === "urgent";
                    const isImportant = notice.type === "important";

                    return (
                      <tr
                        key={notice._id}
                        className="hover:bg-neutral-50/50 transition-all"
                      >
                        {/* শিরোনাম ও বিবরণ */}
                        <td className="py-4 px-6 min-w-[300px] max-w-[450px]">
                          <div className="space-y-1">
                            <p className="font-black text-neutral-800 leading-snug">
                              {notice.title}
                            </p>
                            <p className="text-[11px] text-neutral-400 line-clamp-2 font-medium">
                              {notice.description}
                            </p>
                          </div>
                        </td>

                        {/* ক্যাটাগরি */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[10px] font-bold">
                            {noticeCategoryBn[notice.category] ||
                              notice.category}
                          </span>
                        </td>

                        {/* ধরন */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {isUrgent ? (
                            <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[9px] font-black italic animate-pulse">
                              জরুরী
                            </span>
                          ) : isImportant ? (
                            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded text-[9px] font-black">
                              গুরুত্বপূর্ণ
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-neutral-50 text-neutral-500 border border-neutral-200/60 rounded text-[9px] font-bold">
                              সাধারণ
                            </span>
                          )}
                        </td>

                        {/* তারিখ */}
                        <td className="py-4 px-4 text-neutral-400 font-bold whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Calendar size={12} />
                            <span>
                              {notice.createdAt
                                ? new Date(notice.createdAt).toLocaleDateString(
                                    "bn-BD",
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    },
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* অ্যাকশন বাটন */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingNotice(notice);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 hover:cursor-pointer hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(notice._id)}
                              className="p-1.5 hover:cursor-pointer hover:bg-red-50 text-red-500 rounded-lg transition-all"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* পেজিনেশন কন্ট্রোল */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50/50">
                <p className="text-[11px] font-bold text-neutral-400">
                  মোট {noticesList.length} এর মধ্যে {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, noticesList.length)} নম্বর নোটিশ
                  দেখানো হচ্ছে
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                          currentPage === page
                            ? "bg-[#0B5D3B] text-white border-[#0B5D3B]"
                            : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ডায়নামিক এনিমেশন মডাল */}
      <GeneralNoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingNotice={editingNotice}
        onSubmit={handleModalSubmit}
        isPending={
          createNoticeMutation.isPending || updateNoticeMutation.isPending
        }
      />
    </div>
  );
}
