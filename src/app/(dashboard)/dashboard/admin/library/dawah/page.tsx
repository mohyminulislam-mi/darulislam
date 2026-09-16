"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  Plus,
  Trash2,
  Loader2,
  Edit3,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Eye,
} from "lucide-react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import TiptapEditor from "@/src/components/TiptapEditor/TiptapEditor";

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
      <div className="h-10 bg-neutral-100 rounded-xl border border-neutral-200/40" />
    </div>
    <div className="flex justify-end pt-2 border-t border-neutral-50">
      <div className="h-8 w-8 bg-neutral-100 rounded-xl" />
    </div>
  </div>
);

export default function DawahManagementPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [viewingContent, setViewingContent] = useState<{
    title: string;
    html: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "neighbor",
    subType: "",
    textContent: "",
  });

  const categoryMap: Record<string, string> = useMemo(
    () => ({
      neighbor: "অমুসলিম প্রতিবেশী",
      new_muslim: "নবমুসলিম গাইড",
      society: "ইসলাম ও সমাজ",
      qa: "প্রশ্নোত্তর জোন",
    }),
    [],
  );

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["dawah-resources", selectedCategory, searchQuery, currentPage],
    queryFn: async () => {
      let url = `/library/resources?section=dawah&page=${currentPage}&limit=8`;
      if (selectedCategory !== "all") url += `&category=${selectedCategory}`;
      if (searchQuery.trim() !== "")
        url += `&search=${encodeURIComponent(searchQuery)}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  const resources = apiResponse?.data || [];
  const totalPages = apiResponse?.totalPages || 1;

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editId) {
        return (
          await axiosSecure.put(`/library/admin/update/${editId}`, payload)
        ).data;
      }
      return (await axiosSecure.post("/library/admin/add", payload)).data;
    },
    onSuccess: async () => {
      Swal.fire(
        "আলহামদুলিল্লাহ্‌!",
        editId
          ? "দাওয়াহ কন্টেন্ট আপডেট সম্পন্ন হয়েছে।"
          : "নতুন দাওয়াহ বার্তা সফলভাবে প্রকাশ করা হয়েছে।",
        "success",
      );

      if (!editId) setCurrentPage(1);

      await queryClient.invalidateQueries({ queryKey: ["dawah-resources"] });
      await queryClient.refetchQueries({ queryKey: ["dawah-resources"] });

      resetForm();
    },
    onError: (err: any) => {
      Swal.fire(
        "ব্যর্থ!",
        err?.response?.data?.message || "রিকোয়েস্ট প্রসেস করা যায়নি।",
        "error",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await axiosSecure.delete(`/library/admin/delete/${id}`)).data;
    },
    onSuccess: async () => {
      Swal.fire(
        "রিমুভড!",
        "দাওয়াহ রেকর্ডটি স্থায়ীভাবে মুছে ফেলা হয়েছে।",
        "success",
      );
      await queryClient.invalidateQueries({ queryKey: ["dawah-resources"] });
      await queryClient.refetchQueries({ queryKey: ["dawah-resources"] });
    },
  });

  const handleEditClick = (item: any) => {
    setEditId(item._id);
    setFormData({
      title: item.title,
      category: item.category,
      subType: item.subType,
      textContent: item.textContent || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "নিশ্চিত তো?",
      text: "এই দাওয়াহ কন্টেন্টটি লাইব্রেরি থেকে স্থায়ীভাবে মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
      customClass: { popup: "rounded-[2rem] font-sans" },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "neighbor",
      subType: "",
      textContent: "",
    });
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.subType.trim() ||
      !formData.textContent.trim()
    ) {
      return Swal.fire(
        "তথ্য প্রয়োজন",
        "দয়া করে শিরোনাম, শ্রেণী এবং বিস্তারিত বার্তা কন্টেন্ট লিখুন।",
        "warning",
      );
    }

    const payload = {
      title: formData.title.trim(),
      section: "dawah",
      category: formData.category,
      subType: formData.subType.trim(),
      contentType: "text",
      textContent: formData.textContent.trim(),
    };

    saveMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl">
        {/* প্রিমিয়াম টপ ব্যানার */}
        <div className="bg-[#0B3D2E] rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              দাওয়াহ কন্ট্রোল প্যানেল
            </h1>
            <p className="mt-1.5 text-xs md:text-sm text-slate-300 font-medium">
              দাওয়াহ কন্টেন্ট ও প্রশ্নোত্তর আর্কাইভ পরিচালনা করুন।
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-emerald-500 hover:bg-emerald-600 font-bold text-sm px-6 py-3.5 rounded-2xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-5 h-5 inline mr-1" /> নতুন কন্টেন্ট যোগ করুন
          </button>
        </div>

        {/* সার্চবার এবং ফিল্টার এরিয়া কন্ট্রোল প্যানেল */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 flex flex-wrap gap-2">
            {[
              { label: "সকল কন্টেন্ট", value: "all" },
              { label: "প্রতিবেশী", value: "neighbor" },
              { label: "নবমুসলিম গাইড", value: "new_muslim" },
              { label: "সমাজ ও সমসাময়িক", value: "society" },
              { label: "প্রশ্নোত্তর", value: "qa" },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setCurrentPage(1);
                }}
                className={`rounded-xl border px-5 py-2.5 text-xs font-black transition-all cursor-pointer ${
                  selectedCategory === cat.value
                    ? "bg-[#0B3D2E] text-white border-[#0B3D2E]"
                    : "bg-white text-slate-800 border-slate-200 hover:border-emerald-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="দাওয়াহ আর্টিকেলের নামে সার্চ করুন..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* ৪-কলাম রেসপন্সিভ কার্ড গ্রিড লেআউট */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((item: any, index: number) => {
              const plainText = item.textContent?.replace(/<[^>]*>/g, "") || "";
              const shortText =
                plainText.length > 60
                  ? `${plainText.substring(0, 60)}...`
                  : plainText;

              return (
                <div
                  key={item._id}
                  className="bg-white border border-neutral-100 p-6 rounded-[2rem] shadow-2xs flex flex-col justify-between relative overflow-hidden group hover:shadow-sm transition-shadow"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B5D3B] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 border-b border-neutral-50 pb-3">
                      <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-100/60">
                        {categoryMap[item.category] || item.category}
                      </span>
                      <span className="text-[10px] font-mono font-black text-neutral-400 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-100">
                        ক্র. নং: #
                        {String((currentPage - 1) * 8 + index + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </div>

                    <div className="bg-slate-50/70 p-4 rounded-2xl border border-neutral-100">
                      <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                        {item.subType || "দাওয়াহ শিরোনাম"}
                      </h3>
                      <p className="text-slate-800 font-black text-sm tracking-tight line-clamp-2">
                        {item.title}
                      </p>
                    </div>

                    <div className="space-y-2 pt-1">
                      <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">
                        বার্তা প্রিভিউ
                      </h4>
                      <p className="text-xs font-bold text-neutral-600 leading-relaxed bg-neutral-50/50 p-3 rounded-xl border border-neutral-100 min-h-[4.5rem] line-clamp-3">
                        {shortText || "কোনো টেক্সট নেই"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-50 mt-6">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setViewingContent({
                            title: item.title,
                            html: item.textContent || "",
                          })
                        }
                        className="p-2 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all cursor-pointer border border-transparent"
                        title="সম্পূর্ণ কন্টেন্ট দেখুন"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditClick(item)}
                        className="p-2 text-neutral-400 hover:text-[#0B3D2E] hover:bg-emerald-50/50 rounded-xl transition-all cursor-pointer border border-transparent"
                        title="সম্পূর্ণ কন্টেন্ট এডিট করুন"
                      >
                        <Edit3 size={15} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 text-center py-16 rounded-[2rem] text-sm font-black text-slate-900">
            কোনো দাওয়াহ কন্টেন্ট খুঁজে পাওয়া যায়নি।
          </div>
        )}

        {/* পেজিনের ফুটার */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> পূর্ববর্তী
            </button>
            <span className="text-xs font-black text-slate-900">
              পৃষ্ঠা {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              পরবর্তী <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ক্রিয়েট ও এডিট ইউনিফাইড পপআপ মোডাল উইজেট */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-xl rounded-3xl shadow-xl overflow-hidden border border-slate-100"
              >
                <div className="bg-[#0B3D2E] text-white p-5 flex items-center justify-between">
                  <h3 className="text-base font-black flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />{" "}
                    {editId
                      ? "দাওয়াহ কন্টেন্ট তথ্য এডিট করুন"
                      : "নতুন দাওয়াহ কন্টেন্ট ফর্ম"}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
                >
                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1.5 uppercase">
                      আর্টিকেলের শিরোনাম / প্রশ্ন
                    </label>
                    <input
                      type="text"
                      placeholder="উদা: মুসলিম সমাজে অমুসলিমের অধিকার / ঈমানের শাখা কয়টি?"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-extrabold text-slate-950 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-900 mb-1.5 uppercase">
                        প্রধান ক্যাটাগরি
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-extrabold text-slate-950 focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="neighbor">অমুসলিম প্রতিবেশী</option>
                        <option value="new_muslim">নবমুসলিম গাইড</option>
                        <option value="society">ইসলাম ও সমাজ</option>
                        <option value="qa">প্রশ্নোত্তর জোন</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-900 mb-1.5 uppercase">
                        শ্রেণী / সাবটাইপ
                      </label>
                      <input
                        type="text"
                        placeholder="উদা: সামাজিক শিষ্টাচার / আকীদা ও ফিকহ"
                        value={formData.subType}
                        onChange={(e) =>
                          setFormData({ ...formData, subType: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-extrabold text-slate-950 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-2 uppercase tracking-wider">
                      বিস্তারিত দাওয়াহ বার্তা
                    </label>
                    <TiptapEditor
                      value={formData.textContent}
                      onChange={(value: string) =>
                        setFormData({ ...formData, textContent: value })
                      }
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-1/3 py-3 font-bold border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs transition-all cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={saveMutation.isPending}
                      className="w-2/3 py-3 bg-[#0B3D2E] hover:bg-[#072a20] text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {saveMutation.isPending ? (
                        <>
                          প্রসেস হচ্ছে...{" "}
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          {editId ? "আপডেট করুন" : "সংরক্ষণ করুন"}{" "}
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* লার্জ কন্টেন্ট ফুল স্ক্রিন রিড মোডাল পপআপ */}
        <AnimatePresence>
          {viewingContent && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
              >
                <div className="bg-[#0B3D2E] text-white p-5 flex items-center justify-between">
                  <h3 className="text-base font-black flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />{" "}
                    {viewingContent.title} (বিস্তারিত ভিউ)
                  </h3>
                  <button
                    onClick={() => setViewingContent(null)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 max-h-[75vh] min-h-[400px] overflow-y-auto bg-slate-50 text-slate-950 font-medium text-sm leading-relaxed">
                  <div
                    className="prose max-w-none text-slate-950 break-words whitespace-pre-wrap
      [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-slate-950 [&_h1]:mb-3
      [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-slate-950 [&_h2]:mb-3
      [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-950 [&_h3]:mb-2
      [&_p]:text-sm [&_p]:text-slate-900 [&_p]:mb-3 [&_p]:font-bold [&_p]:leading-7
      [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-emerald-50/60 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:my-3 [&_blockquote]:rounded-r-lg [&_blockquote_p]:text-slate-950
      [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-3 
      [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words
      shadow-inner p-6 bg-white rounded-2xl border border-slate-200 min-h-[350px]"
                    dangerouslySetInnerHTML={{ __html: viewingContent.html }}
                  />
                </div>

                <div className="bg-slate-100 px-6 py-4 flex justify-end">
                  <button
                    onClick={() => setViewingContent(null)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
