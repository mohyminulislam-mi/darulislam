"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  Plus,
  Trash2,
  UploadCloud,
  Loader2,
  Edit,
  X,
  Layers,
  Link2,
  Eye,
} from "lucide-react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Image from "next/image";

export default function HomeHeroSliderPage() {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);

  // 🔍 1. Fetch Landing Page Sliders Only
  const { data: sliders = [], isLoading } = useQuery({
    queryKey: ["adminSliders", "landing"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/content/sliders`, {
        withCredentials: true,
      });
      const allSlides = res.data?.data || res.data || [];
      return allSlides.filter((slide: any) => slide.pageName === "landing");
    },
    staleTime: 1000 * 60 * 5,
  });

  // 🚀 2. Create Mutation
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosSecure.post(`/content/sliders`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["adminSliders", "landing"] });
      Swal.fire({
        title: "सফল!",
        text: res.data?.message || "নতুন হিরো স্লাইড সফলভাবে যুক্ত হয়েছে।",
        icon: "success",
        confirmButtonColor: "#0B5D3B",
        customClass: { popup: "rounded-[2rem]" },
      });
      closeFormHandler();
    },
  });

  // ⚡ 3. Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      return await axiosSecure.put(`/content/sliders/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["adminSliders", "landing"] });
      Swal.fire({
        title: "আপডেট সফল!",
        text: res.data?.message || "স্লাইডার কনফিগারেশন সফলভাবে আপডেট হয়েছে।",
        icon: "success",
        confirmButtonColor: "#0B5D3B",
        customClass: { popup: "rounded-[2rem]" },
      });
      closeFormHandler();
    },
    onError: (error: any) => {
      Swal.fire({
        title: "ত্রুটি",
        text: error?.response?.data?.message || "আপডেট করা সম্ভব হয়নি।",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    },
  });

  // 🗑️ 4. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosSecure.delete(`/content/sliders/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSliders", "landing"] });
      Swal.fire({
        title: "মুছে ফেলা হয়েছে!",
        text: "স্লাইডার রেকর্ডটি সফলভাবে মুছে ফেলা হয়েছে।",
        icon: "success",
        confirmButtonColor: "#0B5D3B",
        customClass: { popup: "rounded-[2rem]" },
      });
    },
  });

  // ⚙️ 5. Form Cleaners & File Parsers
  const closeFormHandler = () => {
    setIsOpenForm(false);
    setEditingSlide(null);
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleEditClick = (slide: any) => {
    setEditingSlide(slide);
    setIsOpenForm(true);
    setSelectedFile(null);
    setImagePreview(slide.image || null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile && !editingSlide) {
      return Swal.fire({
        text: "দয়া করে একটি স্লাইডার ব্যাকগ্রাউন্ড ছবি সিলেক্ট করুন।",
        icon: "warning",
        confirmButtonColor: "#0B5D3B",
      });
    }
    const formData = new FormData(e.currentTarget);
    formData.append("pageName", "landing");

    if (editingSlide) {
      updateMutation.mutate({ id: editingSlide._id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই স্লাইডটি হোম পেজ থেকে স্থায়ীভাবে মুছে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748b",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
      customClass: { popup: "rounded-[2rem]" },
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  return (
    <main className="space-y-8 max-w-7xl mx-auto">
      {/* Structural Minimal Header Block */}
      <section className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xs">
        <h1 className="text-2xl font-black text-neutral-800 flex items-center gap-2">
          <Layers className="text-[#0B5D3B]" size={28} /> হোম পেজ হিরো স্লাইডার
        </h1>
        <p className="text-xs md:text-sm font-semibold text-neutral-600 mt-1">
          ওয়েবসাইটের মূল হোম পেজের ব্যানার ইমেজ, শিরোনাম এবং
          অ্যাকশন বাটনসমূহ নিয়ন্ত্রণ করুন
        </p>
      </section>

      {/* Control Actions Row Layout */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <h2 className="text-xs md:text-sm font-black text-neutral-600 flex items-center gap-2">
          স্লাইডার তালিকা (
          {sliders.length})
        </h2>

        <button
          onClick={() => {
            if (isOpenForm) closeFormHandler();
            else setIsOpenForm(true);
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-black rounded-2xl shadow-sm transition-all cursor-pointer border ${
            isOpenForm
              ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
              : "bg-[#0B5D3B] hover:bg-green-800 border-[#0B5D3B] text-white"
          }`}
        >
          {isOpenForm ? <X size={14} /> : <Plus size={14} />}
          {isOpenForm ? "ফর্ম বন্ধ করুন" : "নতুন স্লাইড যোগ করুন"}
        </button>
      </div>

      {/* Roster Mutation Configuration Form Layout */}
      {isOpenForm && (
        <section className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm animate-in fade-in duration-300">
          <h3 className="text-sm font-black text-neutral-700 mb-4 uppercase tracking-wider">
            {editingSlide
              ? "✏️ স্লাইড এডিটর মোড"
              : "🚀 নতুন হোম স্লাইড কনফিগারেশন"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-neutral-400 uppercase tracking-wide">
                ব্যাজ টেক্সট
              </label>
              <input
                name="badgeText"
                key={
                  editingSlide
                    ? `edit-badge-${editingSlide._id}`
                    : "create-badge"
                }
                defaultValue={
                  editingSlide ? editingSlide.badgeText : "ভর্তি চলছে"
                }
                className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-[#0B5D3B] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-neutral-400 uppercase tracking-wide">
                মূল শিরোনাম (Title) *
              </label>
              <input
                name="title"
                required
                key={
                  editingSlide
                    ? `edit-title-${editingSlide._id}`
                    : "create-title"
                }
                defaultValue={editingSlide ? editingSlide.title : ""}
                placeholder="যেমন: শুদ্ধভাবে কুরআন শিক্ষা"
                className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-[#0B5D3B] transition-all"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-black text-neutral-400 uppercase tracking-wide">
                উপ-শিরোনাম (Subtitle)
              </label>
              <input
                name="subtitle"
                key={
                  editingSlide ? `edit-sub-${editingSlide._id}` : "create-sub"
                }
                defaultValue={editingSlide ? editingSlide.subtitle : ""}
                placeholder="যেমন: সহজ পদ্ধতিতে তাজবীদসহ কুরআন শিক্ষা মডিউল"
                className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-[#0B5D3B] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-neutral-400 uppercase tracking-wide">
                প্রথম বাটন টেক্সট
              </label>
              <input
                name="primaryBtnText"
                key={
                  editingSlide
                    ? `edit-btn1-txt-${editingSlide._id}`
                    : "create-btn1-txt"
                }
                defaultValue={
                  editingSlide
                    ? editingSlide.primaryBtnText
                    : "ভর্তি হতে ক্লিক করুন"
                }
                className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-[#0B5D3B] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-neutral-400 uppercase tracking-wide">
                First Button Link
              </label>
              <input
                name="primaryBtnLink"
                key={
                  editingSlide
                    ? `edit-btn1-lnk-${editingSlide._id}`
                    : "create-btn1-lnk"
                }
                defaultValue={
                  editingSlide ? editingSlide.primaryBtnLink : "/admission"
                }
                className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-[#0B5D3B] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-neutral-400 uppercase tracking-wide">
                দ্বিতীয় বাটন টেক্সট
              </label>
              <input
                name="secondaryBtnText"
                key={
                  editingSlide
                    ? `edit-btn2-txt-${editingSlide._id}`
                    : "create-btn2-txt"
                }
                defaultValue={
                  editingSlide
                    ? editingSlide.secondaryBtnText
                    : "কোর্সসমূহ দেখুন"
                }
                className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-[#0B5D3B] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-neutral-400 uppercase tracking-wide">
                Second Button Link
              </label>
              <input
                name="secondaryBtnLink"
                key={
                  editingSlide
                    ? `edit-btn2-lnk-${editingSlide._id}`
                    : "create-btn2-lnk"
                }
                defaultValue={
                  editingSlide ? editingSlide.secondaryBtnLink : "/education"
                }
                className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-[#0B5D3B] transition-all"
              />
            </div>

            {/* Media Dropzone and Reactive Live View Box Grid */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-center border border-neutral-200 rounded-2xl p-4 bg-neutral-50/50">
              <div className="md:col-span-2 border-2 border-dashed border-neutral-200 rounded-2xl p-6 bg-white flex flex-col items-center justify-center cursor-pointer relative hover:border-[#0B5D3B] transition-all group min-h-[140px]">
                <input
                  type="file"
                  name="image"
                  required={!editingSlide}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <UploadCloud
                  className="text-neutral-400 group-hover:text-[#0B5D3B] transition-colors"
                  size={32}
                />
                <span className="text-xs font-black text-neutral-500 mt-2 text-center">
                  {selectedFile
                    ? selectedFile.name
                    : "স্লাইডারের মূল ব্যাকগ্রাউন্ড ছবি আপলোড করতে ক্লিক করুন"}
                </span>
              </div>

              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Live Preview"
                    fill
                    className="object-cover animate-in fade-in"
                  />
                ) : (
                  <span className="text-[10px] font-black text-neutral-400">
                    ছবি প্রিভিউ বক্স
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="md:col-span-2 py-4 cursor-pointer bg-neutral-900 hover:bg-[#0B5D3B] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md transition-all flex justify-center items-center gap-2 active:scale-[0.99]"
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="animate-spin" size={14} />
              )}
              {editingSlide
                ? "আপডেট কন্টেন্ট সংরক্ষণ করুন"
                : "হিরো স্লাইড লাইভ করুন"}
            </button>
          </form>
        </section>
      )}

      {/* Visual Render Grid Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white border rounded-[2rem] overflow-hidden p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[16/10] w-full bg-neutral-200 rounded-2xl" />
              <div className="h-4 bg-neutral-200 rounded w-2/3" />
              <div className="h-3 bg-neutral-200 rounded w-full" />
              <div className="h-8 bg-neutral-200 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : sliders.length === 0 ? (
        <section className="bg-white text-center py-16 rounded-3xl border border-neutral-100 shadow-xs">
          <p className="text-neutral-400 text-xs md:text-sm font-black">
            হোম পেজের অধীনে কোনো স্লাইডার রেকর্ড পাওয়া যায়নি ভাই।
          </p>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map((slide: any) => (
            <article
              key={slide._id}
              className="bg-white border border-neutral-100 rounded-[2rem] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden shrink-0 border-b border-neutral-50">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#0B5D3B] text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-wider shadow-sm">
                  {slide.badgeText}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-neutral-800 line-clamp-1 leading-snug">
                    {slide.title}
                  </h4>
                  <p className="text-[11px] font-bold text-neutral-400 line-clamp-2 leading-relaxed">
                    {slide.subtitle || "কোনো উপ-শিরোনাম সংযুক্ত নেই"}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-[10px] font-bold text-neutral-500">
                  <span className="flex items-center gap-1 truncate font-black">
                    <Link2 size={12} className="text-emerald-600 shrink-0" />
                    <span className="text-neutral-400 font-bold">
                      {slide.primaryBtnText}:
                    </span>{" "}
                    {slide.primaryBtnLink}
                  </span>
                  <span className="flex items-center gap-1 truncate font-black">
                    <Link2 size={12} className="text-amber-500 shrink-0" />
                    <span className="text-neutral-400 font-bold">
                      {slide.secondaryBtnText}:
                    </span>{" "}
                    {slide.secondaryBtnLink}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                  <button
                    onClick={() => handleEditClick(slide)}
                    className="p-2 text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-xl transition-all cursor-pointer"
                    title="সম্পাদনা"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="p-2 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
