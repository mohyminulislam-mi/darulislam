"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  Briefcase,
  Edit,
  Trash2,
  Plus,
  Search,
  Eye,
  X,
  Send,
  FileText,
  GraduationCap,
  Building2,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Job {
  _id: string;
  title: string;
  slug: string;
  department: string;
  type: string;
  location: string;
  salary: string;
  deadline: string;
  postedDate: string;
  experience: string;
  vacancy: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  isActive: boolean;
}

type JobFormInputs = {
  title: string;
  slug: string;
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

// 🎯 Professional Skeleton Loader Component
function JobTableSkeleton() {
  return (
    <div className="animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="p-4 border-b border-gray-100 flex items-center justify-between gap-4"
        >
          <div className="space-y-2 w-1/3">
            <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded-md w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-md w-24"></div>
          <div className="space-y-1 w-1/5">
            <div className="h-3 bg-gray-200 rounded-md w-20"></div>
            <div className="h-3 bg-gray-100 rounded-md w-14"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded-md w-20"></div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminJobList() {
  const axiosSecure = useAxiosSecure();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormInputs>();

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

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get("/jobs");
      if (response.data?.success && Array.isArray(response.data.data)) {
        setJobs(response.data.data);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      Swal.fire({
        icon: "error",
        title: "এরর!",
        text: "জব সার্কুলার তালিকা লোড করা সম্ভব হয়নি।",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleEditClick = (job: Job) => {
    setEditingJobId(job._id);

    reset({
      title: job.title || "",
      slug: job.slug || "",
      department: job.department || "IT & Software",
      type: job.type || "Full-Time",
      location: job.location || "",
      salary: job.salary || "",
      deadline: job.deadline || "",
      postedDate: job.postedDate || "",
      experience: job.experience || "",
      vacancy: job.vacancy || "",
      description: job.description || "",
      responsibilities: job.responsibilities?.map((r) => ({ value: r })) || [
        { value: "" },
      ],
      requirements: job.requirements?.map((req) => ({ value: req })) || [
        { value: "" },
      ],
      benefits: job.benefits?.map((b) => ({ value: b })) || [{ value: "" }],
    });

    setIsEditModalOpen(true);
  };

  const onUpdateSubmit: SubmitHandler<JobFormInputs> = async (data) => {
    if (!editingJobId) return;

    setUpdating(true);
    const updatedJobData = {
      ...data,
      responsibilities: data.responsibilities
        .map((r) => r.value)
        .filter(Boolean),
      requirements: data.requirements.map((r) => r.value).filter(Boolean),
      benefits: data.benefits.map((b) => b.value).filter(Boolean),
    };

    try {
      const response = await axiosSecure.put(
        `/jobs/${editingJobId}`,
        updatedJobData,
      );

      if (response.status === 200 || response.data?.success) {
        setJobs((prev) =>
          prev.map((job) =>
            job._id === editingJobId
              ? ({ ...job, ...updatedJobData } as Job)
              : job,
          ),
        );

        setIsEditModalOpen(false);

        Swal.fire({
          icon: "success",
          title: "আপডেট সফল হয়েছে!",
          text: "জব সার্কুলার তথ্য সফলভাবে আপডেট করা হয়েছে।",
          confirmButtonColor: "#0B3D2E",
          customClass: { popup: "rounded-3xl" },
        });
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      Swal.fire({
        icon: "error",
        title: "ব্যর্থ হয়েছে!",
        text: errorMessage,
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `"${title}" সার্কুলারটি সম্পূর্ণ মুছে ফেলা হবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
      customClass: { popup: "rounded-3xl" },
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.delete(`/jobs/${id}`);
        if (response.status === 200 || response.data?.success) {
          setJobs((prev) => prev.filter((job) => job._id !== id));
          Swal.fire({
            icon: "success",
            title: "ডিলিট সম্পন্ন!",
            text: "জব সার্কুলারটি সফলভাবে মুছে ফেলা হয়েছে।",
            confirmButtonColor: "#0B3D2E",
            customClass: { popup: "rounded-3xl" },
          });
        }
      } catch (error) {
        console.error("Delete job error:", error);
        Swal.fire({
          icon: "error",
          title: "ডিলিট ব্যর্থ হয়েছে!",
          text: "সার্ভার থেকে জব সার্কুলার মুছে ফেলা সম্ভব হয়নি।",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <section className="min-h-screen bg-[#F7FBF7] p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-[#0B3D2E]/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-black text-[#0B3D2E] uppercase tracking-wider bg-[#8FE3A9]/20 px-3 py-1 rounded-md">
              এডমিন ড্যাশবোর্ড
            </span>
            <h1 className="text-2xl font-black text-[#0B3D2E] mt-1">
              সকল জব সার্কুলার ম্যানেজমেন্ট
            </h1>
          </div>

          <Link
            href="/admin/jobs/create"
            className="bg-[#0B3D2E] text-white px-5 py-3 rounded-2xl font-bold text-sm hover:bg-green-900 transition flex items-center gap-2 shadow-md shrink-0"
          >
            <Plus size={18} /> নতুন জব পোস্ট করুন
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#0B3D2E]/10 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="জব টাইটেল বা বিভাগ দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B3D2E] font-medium"
            />
          </div>
          <span className="text-xs font-bold text-gray-500">
            মোট সার্কুলার:{" "}
            <span className="text-[#0B3D2E] text-sm font-black">
              {filteredJobs.length}
            </span>{" "}
            টি
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-[#0B3D2E]/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-600 uppercase">
                  <th className="p-4 pl-6">জব টাইটেল & তথ্য</th>
                  <th className="p-4">ডিপার্টমেন্ট</th>
                  <th className="p-4">বেতন & টাইপ</th>
                  <th className="p-4">শেষ তারিখ</th>
                  <th className="p-4 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={5}>
                      <JobTableSkeleton />
                    </td>
                  </tr>
                ) : filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-gray-50/80 transition"
                    >
                      <td className="p-4 pl-6">
                        <p className="font-bold text-[#0B3D2E] text-base">
                          {job.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {job.location}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-[#8FE3A9]/20 text-[#0B3D2E] text-xs font-bold px-2.5 py-1 rounded-md">
                          {job.department}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-gray-800 text-xs">
                          {job.salary}
                        </p>
                        <span className="text-[11px] text-gray-500">
                          {job.type}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-bold text-red-600">
                        {job.deadline}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/jobs/${job.slug}`}
                            target="_blank"
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            title="লাইভ দেখুন"
                          >
                            <Eye size={18} />
                          </Link>

                          <button
                            onClick={() => handleEditClick(job)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(job._id, job.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="ডিলিট করুন"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-gray-500 font-medium"
                    >
                      কোনো জব সার্কুলার পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col my-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h2 className="text-xl font-black text-[#0B3D2E]">
                  জব তথ্য এডিট করুন
                </h2>
                <p className="text-xs text-gray-500 font-semibold">
                  পরিবর্তন শেষে "আপডেট করুন" বাটনে চাপ দিন
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <form
                id="edit-job-form"
                onSubmit={handleSubmit(onUpdateSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      পদের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("title", { required: "পদের নাম আবশ্যক" })}
                      className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      URL Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("slug", { required: "স্লাগ আবশ্যক" })}
                      className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                    {errors.slug && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ডিপার্টমেন্ট
                    </label>
                    <select
                      {...register("department")}
                      className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E]"
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
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      জবের ধরন
                    </label>
                    <select
                      {...register("type")}
                      className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contractual">Contractual</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      লোকেশন
                    </label>
                    <input
                      {...register("location")}
                      className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      বেতন
                    </label>
                    <input
                      {...register("salary")}
                      className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      অভিজ্ঞতা
                    </label>
                    <input
                      {...register("experience")}
                      className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      পদসংখ্যা
                    </label>
                    <input
                      {...register("vacancy")}
                      className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      শেষ তারিখ
                    </label>
                    <input
                      {...register("deadline")}
                      className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      প্রকাশের তারিখ
                    </label>
                    <input
                      {...register("postedDate")}
                      className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      বিবরণ
                    </label>
                    <textarea
                      rows={3}
                      {...register("description")}
                      className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <FileText size={16} /> দায়িত্বসমূহ
                    </label>
                    <button
                      type="button"
                      onClick={() => appendResp({ value: "" })}
                      className="text-xs font-bold text-[#0B3D2E] hover:underline cursor-pointer"
                    >
                      + যোগ করুন
                    </button>
                  </div>
                  {respFields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`responsibilities.${idx}.value` as const)}
                        className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeResp(idx)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <GraduationCap size={16} /> যোগ্যতা
                    </label>
                    <button
                      type="button"
                      onClick={() => appendReq({ value: "" })}
                      className="text-xs font-bold text-[#0B3D2E] hover:underline cursor-pointer"
                    >
                      + যোগ করুন
                    </button>
                  </div>
                  {reqFields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`requirements.${idx}.value` as const)}
                        className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeReq(idx)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Building2 size={16} /> সুবিধা
                    </label>
                    <button
                      type="button"
                      onClick={() => appendBen({ value: "" })}
                      className="text-xs font-bold text-[#0B3D2E] hover:underline cursor-pointer"
                    >
                      + যোগ করুন
                    </button>
                  </div>
                  {benFields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`benefits.${idx}.value` as const)}
                        className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeBen(idx)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </form>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-3xl sticky bottom-0">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                form="edit-job-form"
                disabled={updating}
                className="bg-[#0B3D2E] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-green-900 transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> আপডেট
                    হচ্ছে...
                  </>
                ) : (
                  <>
                    <Send size={14} /> আপডেট করুন
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}