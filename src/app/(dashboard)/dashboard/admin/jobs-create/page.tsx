"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure"; // Ensure correct path to your hook
import {
  Briefcase,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  FileText,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";

type JobFormInputs = {
  slug: string;
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string;
  deadline: string;
  postedDate: string;
  experience: string;
  vacancy: string;
  description: string;
  responsibilities: { value: string }[];
  requirements: { value: string }[];
  benefits: { value: string }[];
};

export default function CreateJobDashboard() {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<JobFormInputs>({
    defaultValues: {
      type: "Full-Time",
      department: "IT & Software",
      responsibilities: [{ value: "" }],
      requirements: [{ value: "" }],
      benefits: [{ value: "" }],
    },
  });

  const {
    fields: respFields,
    append: appendResp,
    remove: removeResp,
  } = useFieldArray({ control, name: "responsibilities" });

  const {
    fields: reqFields,
    append: appendReq,
    remove: removeReq,
  } = useFieldArray({ control, name: "requirements" });

  const {
    fields: benFields,
    append: appendBen,
    remove: removeBen,
  } = useFieldArray({ control, name: "benefits" });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    const generatedSlug = titleVal
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setValue("slug", generatedSlug, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<JobFormInputs> = async (data) => {
    setLoading(true);

    const formattedData = {
      ...data,
      responsibilities: data.responsibilities.map((r) => r.value).filter(Boolean),
      requirements: data.requirements.map((r) => r.value).filter(Boolean),
      benefits: data.benefits.map((b) => b.value).filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axiosSecure.post("/jobs", formattedData);

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "সফলভাবে পোস্ট করা হয়েছে!",
          text: "নতুন জব সার্কুলারটি সফলভাবে ডাটাবেজে যুক্ত হয়েছে।",
          confirmButtonColor: "#0B3D2E",
          confirmButtonText: "ঠিক আছে",
          customClass: {
            popup: "rounded-3xl",
            confirmButton: "rounded-xl px-6 py-2 font-bold",
          },
        });
        reset();
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "সার্কুলার পোস্ট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";

      Swal.fire({
        icon: "error",
        title: "পোস্ট করা ব্যর্থ হয়েছে",
        text: errorMessage,
        confirmButtonColor: "#EF4444",
        confirmButtonText: "আবার চেষ্টা করুন",
        customClass: {
          popup: "rounded-3xl",
          confirmButton: "rounded-xl px-6 py-2 font-bold",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#F7FBF7] p-4 sm:p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-[#0B3D2E]/10 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-black text-[#0B3D2E] uppercase tracking-wider bg-[#8FE3A9]/20 px-3 py-1 rounded-md">
              এডমিন ড্যাশবোর্ড
            </span>
            <h1 className="text-2xl font-black text-[#0B3D2E] mt-1">
              নতুন জব সার্কুলার পোস্ট করুন
            </h1>
          </div>
        </div>

        {status && (
          <div
            className={`p-4 rounded-2xl font-bold text-sm flex items-center gap-2 border ${
              status.type === "success"
                ? "bg-green-100 border-green-300 text-green-800"
                : "bg-red-100 border-red-300 text-red-800"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={18} className="text-green-700 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-red-700 shrink-0" />
            )}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3D2E]/10 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-[#0B3D2E] border-b pb-3 flex items-center gap-2">
              <Briefcase size={20} /> প্রাথমিক তথ্য
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  জব টাইটেল / পদের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", { required: "পদের নাম আবশ্যক" })}
                  onChange={(e) => {
                    register("title").onChange(e);
                    handleTitleChange(e);
                  }}
                  placeholder="যেমন: Senior Frontend Developer (Next.js)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  ইউআরএল স্লাগ (Slug) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("slug", { required: "স্লাগ আবশ্যক" })}
                  placeholder="যেমন: frontend-developer"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  বিভাগ / ডিপার্টমেন্ট
                </label>
                <select
                  {...register("department")}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                >
                  <option value="IT & Software">IT & Software</option>
                  <option value="শিক্ষা বিভাগ">শিক্ষা বিভাগ</option>
                  <option value="প্রশাসন বিভাগ">প্রশাসন বিভাগ</option>
                  <option value="মার্কেটিং & মিডিয়া">
                    মার্কেটিং & মিডিয়া
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  জবের ধরন (Job Type)
                </label>
                <select
                  {...register("type")}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  লোকেশন <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("location", { required: "লোকেশন আবশ্যক" })}
                  placeholder="যেমন: Dhaka, Bangladesh (Hybrid)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  বেতন (Salary Range)
                </label>
                <input
                  {...register("salary")}
                  placeholder="যেমন: ৳৬০,০০০ - ৳৮০,০০০ / মাস"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  অভিজ্ঞতা (Experience)
                </label>
                <input
                  {...register("experience")}
                  placeholder="যেমন: ৩+ বছর"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  পদসংখ্যা (Vacancy)
                </label>
                <input
                  {...register("vacancy")}
                  placeholder="যেমন: ০২ জন"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  আবেদনের শেষ তারিখ <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("deadline", { required: "শেষ তারিখ আবশ্যক" })}
                  placeholder="যেমন: ১৫ আগস্ট, ২০২৬"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                />
                {errors.deadline && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.deadline.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  প্রকাশের তারিখ
                </label>
                <input
                  {...register("postedDate")}
                  placeholder="যেমন: ১ আগস্ট, ২০২৬"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  পদের সংক্ষিপ্ত বিবরণ <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  {...register("description", { required: "বিবরণ আবশ্যক" })}
                  placeholder="আমরা দারুল ইসলাম আইটি সেন্টারের জন্য..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3D2E]/10 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-black text-[#0B3D2E] flex items-center gap-2">
                <FileText size={20} /> প্রধান দায়িত্বসমূহ (Responsibilities)
              </h2>
              <button
                type="button"
                onClick={() => appendResp({ value: "" })}
                className="bg-[#8FE3A9]/20 text-[#0B3D2E] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-[#8FE3A9]/40 transition"
              >
                <Plus size={16} /> নতুন দায়িত্ব
              </button>
            </div>

            <div className="space-y-3">
              {respFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    {...register(`responsibilities.${index}.value` as const)}
                    placeholder={`দায়িত্ব #${index + 1}`}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                  {respFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeResp(index)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3D2E]/10 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-black text-[#0B3D2E] flex items-center gap-2">
                <GraduationCap size={20} /> প্রয়োজনীয় যোগ্যতা (Requirements)
              </h2>
              <button
                type="button"
                onClick={() => appendReq({ value: "" })}
                className="bg-[#8FE3A9]/20 text-[#0B3D2E] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-[#8FE3A9]/40 transition"
              >
                <Plus size={16} /> নতুন যোগ্যতা
              </button>
            </div>

            <div className="space-y-3">
              {reqFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    {...register(`requirements.${index}.value` as const)}
                    placeholder={`যোগ্যতা #${index + 1}`}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                  {reqFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReq(index)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3D2E]/10 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-black text-[#0B3D2E] flex items-center gap-2">
                <Building2 size={20} /> অন্যান্য সুযোগ-সুবিধা (Benefits)
              </h2>
              <button
                type="button"
                onClick={() => appendBen({ value: "" })}
                className="bg-[#8FE3A9]/20 text-[#0B3D2E] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-[#8FE3A9]/40 transition"
              >
                <Plus size={16} /> নতুন সুবিধা
              </button>
            </div>

            <div className="space-y-3">
              {benFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    {...register(`benefits.${index}.value` as const)}
                    placeholder={`সুবিধা #${index + 1}`}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                  {benFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBen(index)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B3D2E] text-white py-4 rounded-2xl font-black text-base hover:bg-green-900 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> সাবমিট করা
                হচ্ছে...
              </>
            ) : (
              <>
                <Send size={18} /> জব সার্কুলার পোস্ট করুন
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}