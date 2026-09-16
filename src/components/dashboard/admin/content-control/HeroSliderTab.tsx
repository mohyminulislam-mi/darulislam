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
} from "lucide-react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";

export default function HeroSliderTab({ pageName }: { pageName: string }) {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);

  const { data: sliders = [], isLoading } = useQuery({
    queryKey: ["adminSliders", pageName],
    queryFn: async () => {
      const res = await axiosSecure.get(`/content/sliders`, {
        withCredentials: true,
      });
      return res.data.filter((slide: any) => slide.pageName === pageName);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosSecure.post(`/content/sliders`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSliders"] });
      Swal.fire("সফল!", "নতুন স্লাইড যুক্ত হয়েছে।", "success");
      closeFormHandler();
    },
  });

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSliders"] });
      Swal.fire("সফল!", "স্লাইডারটি সফলভাবে আপডেট হয়েছে।", "success");
      closeFormHandler();
    },
    onError: (error: any) => {
      Swal.fire(
        "ত্রুটি",
        error?.response?.data?.message || "আপডেট করা সম্ভব হয়নি।",
        "error",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosSecure.delete(`/content/sliders/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSliders"] });
      Swal.fire(
        "ডিলিট হয়েছে!",
        "স্লাইডারটি সফলভাবে মুছে ফেলা হয়েছে।",
        "success",
      );
    },
  });

  const closeFormHandler = () => {
    setIsOpenForm(false);
    setEditingSlide(null);
    setSelectedFile(null);
  };

  const handleEditClick = (slide: any) => {
    setEditingSlide(slide);
    setIsOpenForm(true);
    setSelectedFile(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile && !editingSlide) {
      return Swal.fire(
        "ত্রুটি",
        "একটি ব্যাকগ্রাউন্ড ছবি সিলেক্ট করুন",
        "error",
      );
    }
    const formData = new FormData(e.currentTarget);
    formData.append("pageName", pageName);

    if (editingSlide) {
      updateMutation.mutate({ id: editingSlide._id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই স্লাইডটি ওয়েবসাইট থেকে মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-50 pb-3">
        <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Layers size={16} className="text-[#0B5D3B]" />{" "}
          {pageName === "landing"
            ? "হোম পেজ"
            : pageName === "shop"
              ? "শপ পেজ"
              : "আবাউট"}{" "}
          স্লাইডার সমূহ
        </h3>
        <button
          onClick={() => {
            if (isOpenForm) closeFormHandler();
            else setIsOpenForm(true);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-xl shadow-md transition-all cursor-pointer ${
            isOpenForm
              ? "bg-red-800 hover:bg-red-700 text-white"
              : "bg-[#0B5D3B] hover:bg-green-800 text-white"
          }`}
        >
          {isOpenForm ? <X size={14} /> : <Plus size={14} />}
          {isOpenForm ? "ফর্ম বন্ধ করুন" : "নতুন স্লাইড যোগ করুন"}
        </button>
      </div>

      {isOpenForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500">
              ব্যাজ টেক্সট
            </label>
            <input
              name="badgeText"
              key={
                editingSlide ? `edit-badge-${editingSlide._id}` : "create-badge"
              }
              defaultValue={
                editingSlide ? editingSlide.badgeText : "ভর্তি চলছে"
              }
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500">
              মূল শিরোনাম (Title) *
            </label>
            <input
              name="title"
              required
              key={
                editingSlide ? `edit-title-${editingSlide._id}` : "create-title"
              }
              defaultValue={editingSlide ? editingSlide.title : ""}
              placeholder="যেমন: শুদ্ধভাবে কুরআন শিক্ষা"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold outline-none"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-black text-slate-500">
              উপ-শিরোনাম (Subtitle)
            </label>
            <input
              name="subtitle"
              key={editingSlide ? `edit-sub-${editingSlide._id}` : "create-sub"}
              defaultValue={editingSlide ? editingSlide.subtitle : ""}
              placeholder="যেমন: সহজ পদ্ধতিতে তাজবীদসহ কুরআন শিক্ষা"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500">
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
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500">
              প্রথম বাটন লিংক
            </label>
            <input
              name="primaryBtnLink"
              key={
                editingSlide
                  ? `edit-btn1-lnk-${editingSlide._id}`
                  : "create-btn1-lnk"
              }
              defaultValue={
                editingSlide ? editingSlide.primaryBtnLink : "/auth/register"
              }
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500">
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
                editingSlide ? editingSlide.secondaryBtnText : "কোর্সসমূহ দেখুন"
              }
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500">
              দ্বিতীয় বাটন লিংক
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
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none"
            />
          </div>

          <div className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-xl p-5 bg-white flex flex-col items-center justify-center cursor-pointer relative hover:border-[#0B5D3B] transition-all group">
            <input
              type="file"
              name="image"
              required={!editingSlide}
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <UploadCloud
              className="text-slate-400 group-hover:text-[#0B5D3B] transition-colors"
              size={32}
            />
            <span className="text-xs font-bold text-slate-500 mt-2">
              {selectedFile
                ? selectedFile.name
                : "স্লাইডারের ব্যাকগ্রাউন্ড ছবি আপলোড করুন"}
            </span>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="md:col-span-2 py-3.5 cursor-pointer bg-slate-900 hover:bg-[#0B5D3B] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex justify-center items-center gap-2"
          >
            {(createMutation.isPending || updateMutation.isPending) && (
              <Loader2 className="animate-spin" size={14} />
            )}
            <span>
              {editingSlide ? "আপডেট সংরক্ষণ করুন" : "স্লাইড সাবমিট করুন"}
            </span>
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-[#0B5D3B]" size={32} />
        </div>
      ) : sliders.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs font-bold">
          কোনো স্লাইডার রেকর্ড পাওয়া যায়নি ভাই।
        </div>
      ) : (
        /* Visual Card Grid Section View Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map((slide: any) => (
            <div
              key={slide._id}
              className="bg-slate-50 border border-slate-100 rounded-[2rem] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/10] w-full bg-slate-200 overflow-hidden shrink-0 border-b border-slate-100">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#0B5D3B] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wide">
                  {slide.badgeText}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-800 line-clamp-1 leading-snug">
                    {slide.title}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-400 line-clamp-2 leading-relaxed">
                    {slide.subtitle || "কোনো উপ-শিরোনাম নেই"}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 bg-white p-2.5 rounded-xl border border-slate-200/40 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1 truncate">
                    <Link2 size={12} className="text-emerald-600" />{" "}
                    {slide.primaryBtnText}: {slide.primaryBtnLink}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <Link2 size={12} className="text-amber-500" />{" "}
                    {slide.secondaryBtnText}: {slide.secondaryBtnLink}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/40">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
