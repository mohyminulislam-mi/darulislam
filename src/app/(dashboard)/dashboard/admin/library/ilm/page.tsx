"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Plus,
  Trash2,
  FileText,
  UploadCloud,
  Link2,
  Loader2,
  ArrowRight,
  Edit3,
  Search,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
} from "lucide-react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function IlmManagementPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"file" | "link">("file");

  const [formData, setFormData] = useState({
    title: "",
    category: "quran",
    subType: "",
    pdfUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const categoryMap: Record<string, string> = useMemo(
    () => ({
      quran: "কুরআন",
      hadith: "হাদীস",
      kitab: "কিতাব",
      probondho: "প্রবন্ধ",
    }),
    [],
  );

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["ilm-resources", selectedCategory, searchQuery, currentPage],
    queryFn: async () => {
      let url = `/library/resources?section=ilm&page=${currentPage}&limit=8`;
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
    mutationFn: async (payload: FormData) => {
      if (editId) {
        return (
          await axiosSecure.put(`/library/admin/update/${editId}`, payload)
        ).data;
      }
      return (await axiosSecure.post("/library/admin/add", payload)).data;
    },
    onSuccess: () => {
      Swal.fire(
        "আলহামদুলিল্লাহ্‌!",
        editId
          ? "কন্টেন্ট আপডেট সম্পন্ন হয়েছে।"
          : "নতুন কন্টেন্ট যোগ করা হয়েছে।",
        "success",
      );
      queryClient.invalidateQueries({ queryKey: ["ilm-resources"] });
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
    onSuccess: () => {
      Swal.fire("রিমুভড!", "বইটি স্থায়ীভাবে মুছে ফেলা হয়েছে।", "success");
      queryClient.invalidateQueries({ queryKey: ["ilm-resources"] });
    },
  });

  const handleEditClick = (item: any) => {
    setEditId(item._id);
    setFormData({
      title: item.title,
      category: item.category,
      subType: item.subType,
      pdfUrl: item.pdfUrl || "",
    });
    setUploadMethod(
      item.pdfUrl && !item.pdfUrl.includes("cloudinary") ? "link" : "file",
    );
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "নিশ্চিত তো?",
      text: "এই ইসলামিক বইটি লাইব্রেরি থেকে স্থায়ীভাবে মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const resetForm = () => {
    setFormData({ title: "", category: "quran", subType: "", pdfUrl: "" });
    setSelectedFile(null);
    setCoverFile(null);
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subType.trim()) {
      return Swal.fire(
        "정보 প্রয়োজন",
        "দয়া করে শিরোনাম ও শ্রেনী টাইপ করুন।",
        "warning",
      );
    }

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("section", "ilm");
    payload.append("category", formData.category);
    payload.append("subType", formData.subType.trim());
    payload.append("contentType", "pdf");

    if (coverFile) payload.append("coverImage", coverFile);

    if (uploadMethod === "file" && selectedFile) {
      payload.append("file", selectedFile);
    } else if (uploadMethod === "link" && formData.pdfUrl.trim()) {
      payload.append("pdfUrl", formData.pdfUrl.trim());
    } else if (!editId) {
      return Swal.fire(
        "ফাইল প্রয়োজন",
        "পিডিএফ ফাইল বা লিংক ইনপুট দিন।",
        "warning",
      );
    }

    saveMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="bg-[#0B3D2E] rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-emerald-400" /> ইলম ডিজিটাল
              লাইব্রেরি
            </h1>
            <p className="mt-1.5 text-xs md:text-sm text-slate-300 font-medium">
              ইলম সেকশনের সকল বই এবং পিডিএফ কন্টেন্ট ম্যানেজ করুন
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-emerald-500 hover:bg-emerald-600 font-bold text-sm px-6 py-3.5 rounded-2xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-5 h-5 inline mr-1" /> নতুন বই যোগ করুন
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 flex flex-wrap gap-2">
            {[
              { label: "সকল কন্টেন্ট", value: "all" },
              { label: "কুরআন", value: "quran" },
              { label: "হাদীস", value: "hadith" },
              { label: "কিতাব", value: "kitab" },
              { label: "প্রবন্ধ", value: "probondho" },
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
              placeholder="বইয়ের নামে সার্চ করুন..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b bg-slate-50 border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-900 uppercase">
                    কভার
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-900 uppercase">
                    বইয়ের শিরোনাম ও নাম
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-900 uppercase">
                    প্রধান বিভাগ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-900 uppercase">
                    টাইপ / শ্রেণী
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-900 uppercase">
                    পিডিএফ ভিউ
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-black text-slate-900 uppercase">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 2 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-10">
                        <div className="h-16 bg-slate-100 rounded-2xl w-full" />
                      </td>
                    </tr>
                  ))
                ) : resources.length > 0 ? (
                  resources.map((item: any) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-6 py-4 shrink-0">
                        <div className="relative w-14 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
                          {item.coverImage ? (
                            <Image
                              src={item.coverImage}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <h3 className="font-black text-slate-950 text-base tracking-tight leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          ID: {item._id}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900 capitalize">
                        {categoryMap[item.category] || item.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-50 border border-emerald-100 text-[#0B3D2E] font-black text-xs px-3 py-1 rounded-lg">
                          {item.subType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`https://docs.google.com/gview?url=${encodeURIComponent(item.pdfUrl)}&embedded=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 hover:text-emerald-900 underline"
                        >
                          <FileText className="w-4 h-4" /> ফাইল ভিউ করুন{" "}
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl transition-all cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 text-center text-sm font-black text-slate-900"
                    >
                      কোনো ডেটা খুঁজে পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

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
              নভেম্বর <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

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
                    <BookOpen className="w-5 h-5 text-emerald-400" />{" "}
                    {editId
                      ? "বইয়ের তথ্য এডিট করুন"
                      : "নতুন ইলম কন্টেন্ট ফর্ম"}
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
                      বইয়ের নাম / শিরোনাম
                    </label>
                    <input
                      type="text"
                      placeholder="উদা: বুখারী শরীফ (১ম খণ্ড)"
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
                        <option value="quran">কুরআন</option>
                        <option value="hadith">হাদীস</option>
                        <option value="kitab">কিতাব</option>
                        <option value="probondho">প্রবন্ধ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-900 mb-1.5 uppercase">
                        কন্টেন্ট টাইপ / শ্রেণী
                      </label>
                      <input
                        type="text"
                        placeholder="উদা: তাফসীর, অনুবাদ"
                        value={formData.subType}
                        onChange={(e) =>
                          setFormData({ ...formData, subType: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-extrabold text-slate-950 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1.5 uppercase">
                      বইয়ের কভার ইমেজ (ঐচ্ছিক)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-50 relative group cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setCoverFile(e.target.files?.[0] || null)
                        }
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center gap-1">
                        <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                        <span className="text-xs font-extrabold text-slate-700">
                          {coverFile
                            ? coverFile.name
                            : "জেপিজি বা পিএনজি ফরম্যাটে কভার ফটো আপলোড করুন"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1.5 uppercase">
                      পিডিএফ সংযুক্তি মেথড
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setUploadMethod("file")}
                        className={`py-2 text-xs font-extrabold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          uploadMethod === "file"
                            ? "bg-white text-emerald-800 shadow-xs"
                            : "text-slate-600"
                        }`}
                      >
                        <UploadCloud className="w-4 h-4" /> ডিভাইস আপলোড
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMethod("link")}
                        className={`py-2 text-xs font-extrabold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          uploadMethod === "link"
                            ? "bg-white text-emerald-800 shadow-xs"
                            : "text-slate-600"
                        }`}
                      >
                        <Link2 className="w-4 h-4" /> এক্সটার্নাল লিংক
                      </button>
                    </div>
                  </div>

                  {uploadMethod === "file" ? (
                    <div>
                      <label className="block text-xs font-black text-slate-900 mb-1.5 uppercase">
                        পিডিএফ ফাইল আপলোড{" "}
                        {editId && "(পরিবর্তন না করতে চাইলে খালি রাখুন)"}
                      </label>
                      <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-50 relative group cursor-pointer transition-colors">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) =>
                            setSelectedFile(e.target.files?.[0] || null)
                          }
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center gap-1">
                          <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                          <span className="text-xs font-extrabold text-slate-800">
                            {selectedFile
                              ? selectedFile.name
                              : "আপনার কম্পিউটার বা মোবাইল থেকে মূল বইয়ের পিডিএফ সিলেক্ট করুন"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-black text-slate-900 mb-1.5 uppercase">
                        পিডিএফ এর সরাসরি লিংক
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={formData.pdfUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, pdfUrl: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-extrabold text-slate-950 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  )}

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
                      className="w-2/3 py-3 bg-[#0B3D2E] hover:bg-[#072a20] text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-none"
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
      </div>
    </div>
  );
}
