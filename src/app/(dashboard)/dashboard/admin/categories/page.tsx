"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import {
  FolderPlus,
  FolderTree,
  Plus,
  Layers,
  X,
  Upload,
  Edit3,
  Star,
} from "lucide-react";
import Swal from "sweetalert2";
import CategoryCard from "@/src/components/dashboard/admin/categories/CategoryCard";

type TCategory = {
  _id: string;
  name: string;
  image: string;
  description?: string;
  isActive: boolean;
  isFeatured: boolean;
  subCategories: any[];
  courseCount?: number;
};

type CategoryFormData = {
  name: string;
  description: string;
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [isFormOpenMobile, setIsFormOpenMobile] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(
    null,
  );
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/categories");
      if (res.data) setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setEditPreviewUrl(URL.createObjectURL(file));
    }
  };

  // const handleToggleFeatured = async (
  //   id: string,
  //   currentStatus: boolean,
  //   name: string,
  // ) => {
  //   const nextStatus = !currentStatus;
  //   Swal.fire({
  //     icon: "question",
  //     title: nextStatus ? "হোমপেজে প্রদর্শন" : "হোমপেজ থেকে অপসারণ",
  //     text: nextStatus
  //       ? `আপনি কি "${name}" ক্যাটাগরিটিকে মূল হোমপেজে ফিচার্ড হিসেবে প্রদর্শন করতে চান?`
  //       : `আপনি কি "${name}" ক্যাটাগরিটিকে মূল হোমপেজের ফিচার্ড তালিকা থেকে বাদ দিতে চান?`,
  //     showCancelButton: true,
  //     confirmButtonText: nextStatus ? "হ্যাঁ, ফিচার্ড করুন" : "হ্যাঁ, বাদ দিন",
  //     cancelButtonText: "বাতিল",
  //     confirmButtonColor: "#0B5D3B",
  //     cancelButtonColor: "#d33",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         const res = await axiosSecure.patch(`/categories/featured/${id}`, {
  //           isFeatured: nextStatus,
  //         });
  //         if (res.status === 200) {
  //           Swal.fire({
  //             icon: "success",
  //             title: "সফল হয়েছে",
  //             text: nextStatus
  //               ? "ক্যাটাগরি সফলভাবে হোমপেজে ফিচার্ড করা হয়েছে।"
  //               : "ফিচার্ড স্ট্যাটাস বাতিল করা হয়েছে।",
  //             confirmButtonColor: "#0B5D3B",
  //           });
  //           fetchCategories();
  //         }
  //       } catch (error) {
  //         Swal.fire({
  //           icon: "error",
  //           title: "স্ট্যাটাস আপডেট করা সম্ভব হয়নি।",
  //         });
  //       }
  //     }
  //   });
  // };

  const onSubmit = async (data: CategoryFormData) => {
    if (!imageFile) {
      return Swal.fire({
        icon: "warning",
        title: "তথ্য প্রয়োজন",
        text: "দয়া করে একটি ইমেজ সিলেক্ট করুন।",
      });
    }

    try {
      setCreating(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("image", imageFile);
      formData.append("isActive", "true");

      const res = await axiosSecure.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "বিভাগ তৈরি হয়েছে!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
        reset({ name: "", description: "" });
        setImageFile(null);
        setPreviewUrl(null);
        setIsFormOpenMobile(false);
        fetchCategories();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ব্যর্থ হয়েছে",
        text: "বিভাগ তৈরি করা যায়নি।",
      });
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (category: TCategory) => {
    setEditingCategory(category);
    setEditPreviewUrl(category.image);
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = async (
    reqE: React.FormEvent<HTMLFormElement>,
  ) => {
    reqE.preventDefault();
    if (!editingCategory) return;

    const formData = new FormData();
    const nameValue = (
      document.getElementById("edit-cat-name") as HTMLInputElement
    ).value;
    const descValue = (
      document.getElementById("edit-cat-desc") as HTMLTextAreaElement
    ).value;

    if (!nameValue.trim())
      return Swal.fire({
        icon: "warning",
        title: "নাম প্রয়োজন",
        text: "বিভাগের নাম খালি রাখা যাবে না।",
      });

    try {
      setEditLoading(true);
      formData.append("name", nameValue);
      formData.append("isMainCategoryQuery", "true");
      formData.append("description", descValue);
      if (editImageFile) {
        formData.append("image", editImageFile);
      }

      const res = await axiosSecure.put(
        `/categories/${editingCategory._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "সফলভাবে আপডেট হয়েছে",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
        setIsEditModalOpen(false);
        fetchCategories();
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "আপডেট ব্যর্থ হয়েছে" });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই বিভাগের অধীনে থাকা সকল সাব-ক্যাটাগরিও মুছে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/categories/${id}`);
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "ডিলিট হয়েছে!",
              timer: 1500,
              showConfirmButton: false,
            });
            fetchCategories();
          }
        } catch (error) {
          Swal.fire({ icon: "error", title: "মুছে ফেলা যায়নি" });
        }
      }
    });
  };

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen selection:bg-[#0B5D3B] selection:text-white antialiased">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-emerald-50 rounded-xl text-[#0B5D3B]">
              <Layers className="h-7 w-7 shrink-0" />
            </span>
            বিভাগ ও কোর্স প্যানেল
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            প্রধান ক্যাটাগরি এবং উপ-ক্যাটাগরি নিয়ন্ত্রণ প্যানেল
          </p>
        </div>
        <button
          onClick={() => setIsFormOpenMobile(!isFormOpenMobile)}
          className="flex lg:hidden items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-[#0B5D3B] hover:bg-[#094731] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
        >
          {isFormOpenMobile ? <X size={16} /> : <Plus size={16} />}
          {isFormOpenMobile ? "ফর্ম বন্ধ করুন" : "নতুন ক্যাটাগরি"}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left Side Form Section */}
        <section
          className={`w-full lg:w-[38%] bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 shadow-sm lg:sticky lg:top-24 ${
            isFormOpenMobile ? "block" : "hidden lg:block"
          }`}
        >
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
            <FolderPlus size={20} className="text-[#0B5D3B]" />
            <h2 className="text-sm font-black text-slate-800">
              নতুন প্রধান বিভাগ যুক্ত করুন
            </h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                বিভাগের নাম (TITLE)
              </label>
              <input
                {...register("name", { required: true })}
                placeholder="যেমন: কুরআন বিভাগ"
                className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-[#0B5D3B] focus:bg-white focus:ring-2 focus:ring-[#0B5D3B]/10 transition-all text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                বিভাগের ইমেজ (THUMBNAIL)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-slate-200 rounded-2xl aspect-video flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-xs font-bold text-slate-400">
                    <Upload className="mx-auto mb-2.5 text-[#0B5D3B] h-6 w-6" />
                    ইমেজ সিলেক্ট করুন
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                সংক্ষিপ্ত বিবরণ (DESCRIPTION)
              </label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="বিভাগ সম্পর্কিত তথ্য দিন..."
                className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold outline-none focus:border-[#0B5D3B] focus:bg-white focus:ring-2 focus:ring-[#0B5D3B]/10 transition-all text-slate-800 resize-none"
              />
            </div>

            <button
              disabled={creating}
              className="w-full bg-[#0B5D3B] hover:bg-[#094731] text-white py-4.5 rounded-2xl font-black text-sm transition-all shadow-md shadow-green-900/10 active:scale-[0.98] disabled:opacity-60 cursor-pointer uppercase tracking-wider"
            >
              {creating ? "সংরখন হচ্ছে..." : "নতুন বিভাগ সংরক্ষণ করুন"}
            </button>
          </form>
        </section>

        {/* Right Side Grid Cards Section */}
        <section className="w-full lg:w-[62%] space-y-4">
          <div className="flex items-center gap-2 mb-3 px-1">
            <FolderTree size={18} className="text-slate-400" />
            <h2 className="text-xs font-black text-slate-700">
              বর্তমান বিভাগ তালিকা ({categories.length})
            </h2>
          </div>
          {loading ? (
            <div className="text-center py-24 text-sm font-bold text-slate-400">
              লোড হচ্ছে...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {categories.map((category) => {
                const isFeatured = category.isFeatured === true;
                return (
                  <div
                    key={category._id}
                    className="relative group/card-wrapper bg-white rounded-[2rem] flex items-center justify-between shadow-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <CategoryCard
                        key={category._id}
                        category={category}
                        refresh={fetchCategories}
                        onEdit={() => openEditModal(category)}
                        onDelete={handleDeleteCategory}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Edit Modal Component */}
      <AnimatePresence>
        {isEditModalOpen && editingCategory && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col"
            >
              <div className="bg-[#0B5D3B] p-6 text-white relative">
                <h3 className="text-lg font-black flex flex-col gap-0.5">
                  প্রধান বিভাগ এডিট করুন
                  <span className="text-[10px] font-medium opacity-75 uppercase tracking-wider">
                    FILL STANDARD VALIDATION FIELDS
                  </span>
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form
                onSubmit={handleUpdateCategory}
                className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[75vh]"
              >
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    বিভাগের নাম *
                  </label>
                  <input
                    id="edit-cat-name"
                    type="text"
                    defaultValue={editingCategory.name}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-[#0B5D3B] focus:bg-white focus:ring-2 focus:ring-[#0B5D3B]/10 transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    বিভাগের কভার ইমেজ
                  </label>
                  <div
                    onClick={() => editFileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-slate-200 rounded-2xl aspect-video flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-slate-50/50 group"
                  >
                    {editPreviewUrl ? (
                      <img
                        src={editPreviewUrl}
                        alt="Edit Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                      <Upload size={14} /> নতুন ছবি আপলোড
                    </div>
                    <input
                      type="file"
                      ref={editFileInputRef}
                      onChange={handleEditImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    সংক্ষিপ্ত বিবরণ
                  </label>
                  <textarea
                    id="edit-cat-desc"
                    rows={4}
                    defaultValue={editingCategory.description || ""}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold outline-none focus:border-[#0B5D3B] focus:bg-white focus:ring-2 focus:ring-[#0B5D3B]/10 transition-all text-slate-800 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-3 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-6 py-3 bg-[#0B5D3B] hover:bg-[#094731] text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {editLoading ? "আপডেট হচ্ছে..." : "পরিবর্তন সেভ করুন"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
