"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  UploadCloud,
  FileText,
  Send,
  CheckCircle2,
  X,
  ArrowLeft,
  Check,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { axiosSecure } from "@/src/app/hooks/useAxiosSecure";

interface JobDetails {
  _id: string;
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
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  isActive?: boolean;
}

function JobDetailsSkeleton() {
  return (
    <section className="min-h-screen bg-[#F7FBF7] py-10 px-4 md:px-8 animate-pulse max-w-11/12 mx-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="h-5 w-40 bg-gray-200 rounded-lg"></div>

        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100 space-y-6">
          <div className="flex gap-2">
            <div className="h-7 w-24 bg-gray-200 rounded-lg"></div>
            <div className="h-7 w-20 bg-gray-200 rounded-lg"></div>
          </div>

          <div className="h-9 w-3/4 bg-gray-200 rounded-xl"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-2">
            <div className="h-6 w-48 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>

            <div className="h-6 w-56 bg-gray-200 rounded-lg pt-4"></div>
            <div className="space-y-2">
              <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100 space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="h-14 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    </section>
  );
}

export default function JobDetailsAndApplyClient() {
  const params = useParams();
  const jobSlug = (params?.slug as string) || "";

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery<JobDetails>({
    queryKey: ["job-details", jobSlug],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await axios.get(`${baseUrl}/jobs/${jobSlug}`);
      return res.data?.data;
    },
    enabled: !!jobSlug,
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    portfolioUrl: "",
    linkedinUrl: "",
    expectedSalary: "",
    coverLetter: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeFile) {
      Swal.fire({
        icon: "warning",
        title: "সিভি আবশ্যক!",
        text: "অনুগ্রহ করে আপনার রেজুমে/সিভি ফাইল আপলোড করুন।",
        confirmButtonColor: "#0B3D2E",
        confirmButtonText: "ঠিক আছে",
        customClass: { popup: "rounded-3xl" },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const submitData = new FormData();

      submitData.append("jobId", job?._id || "");
      submitData.append("jobSlug", jobSlug);
      submitData.append("jobTitle", job?.title || "");
      submitData.append("fullName", formData.fullName);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("expectedSalary", formData.expectedSalary);
      submitData.append("portfolioUrl", formData.portfolioUrl);
      submitData.append("linkedinUrl", formData.linkedinUrl);
      submitData.append("coverLetter", formData.coverLetter);
      submitData.append("resume", resumeFile);

      await axios.post(`${baseUrl}/jobs/apply`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsSubmitted(true);

      Swal.fire({
        icon: "success",
        title: "আবেদন সফল হয়েছে!",
        text: "আপনার আবেদনপত্রটি সফলভাবে জমা নেওয়া হয়েছে।",
        confirmButtonColor: "#0B3D2E",
        confirmButtonText: "ধন্যবাদ",
        customClass: { popup: "rounded-3xl" },
      });
    } catch (error: unknown) {
      console.error("Application Submission Error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "আবেদন পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";

      Swal.fire({
        icon: "error",
        title: "ব্যর্থ হয়েছে!",
        text: errorMessage,
        confirmButtonColor: "#EF4444",
        confirmButtonText: "আবার চেষ্টা করুন",
        customClass: { popup: "rounded-3xl" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <JobDetailsSkeleton />;
  }

  if (isError || !job) {
    return (
      <section className="min-h-screen bg-[#F7FBF7] flex flex-col items-center justify-center p-4 space-y-4 max-w-11/12 mx-auto">
        <h2 className="text-2xl font-black text-red-600">
          জব সার্কুলারটি পাওয়া যায়নি!
        </h2>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-[#0B3D2E] font-bold text-sm hover:underline"
        >
          <ArrowLeft size={18} /> সকল জবের তালিকায় ফিরুন
        </Link>
      </section>
    );
  }

  if (isSubmitted) {
    return (
      <section className="min-h-screen bg-[#F7FBF7] flex items-center justify-center p-4 max-w-11/12 mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white max-w-lg w-full p-8 md:p-12 rounded-3xl shadow-xl border border-[#0B3D2E]/5 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-[#0B3D2E]">
            আবেদন সফল হয়েছে!
          </h2>
          <p className="text-gray-600 font-medium text-sm">
            ধন্যবাদ, <span className="font-bold">{formData.fullName}</span>!{" "}
            <span className="font-bold">{job.title}</span> পদের জন্য আপনার
            আবেদনপত্র এবং রেজুমে আমাদের কাছে পৌঁছেছে।
          </p>
          <Link
            href="/jobs"
            className="inline-block w-full bg-[#0B3D2E] text-white py-3.5 rounded-2xl font-bold hover:bg-green-900 transition"
          >
            অন্যান্য খালি পদসমূহ দেখুন
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F7FBF7] py-10 px-4 md:px-8 max-w-11/12 mx-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ব্যাক বাটন */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-[#0B3D2E] font-bold text-sm hover:underline"
        >
          <ArrowLeft size={18} /> সকল জবের তালিকায় ফিরুন
        </Link>

        {/* ১. জবের সামারি / ব্যানার কার্ড */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-[#0B3D2E]/5 space-y-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="bg-[#8FE3A9]/20 text-[#0B3D2E] text-xs font-black px-3.5 py-1.5 rounded-lg">
              {job.department}
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3.5 py-1.5 rounded-lg">
              {job.type}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-[#0B3D2E]">
            {job.title}
          </h1>

          {/* কী-ইনফরমেশন গ্রিড */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100 text-xs md:text-sm font-bold">
            <div className="space-y-1">
              <span className="text-gray-400 flex items-center gap-1 font-normal">
                <MapPin size={14} /> লোকেশন
              </span>
              <p className="text-[#0B3D2E]">{job.location}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 flex items-center gap-1 font-normal">
                <DollarSign size={14} /> বেতন
              </span>
              <p className="text-[#0B3D2E]">{job.salary}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 flex items-center gap-1 font-normal">
                <GraduationCap size={14} /> অভিজ্ঞতা
              </span>
              <p className="text-[#0B3D2E]">{job.experience}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 flex items-center gap-1 font-normal">
                <Calendar size={14} /> শেষ তারিখ
              </span>
              <p className="text-[#0B3D2E]">{job.deadline}</p>
            </div>
          </div>

          {/* জবের পূর্ণাঙ্গ বিবরণ */}
          <div className="space-y-6 text-gray-700 text-sm md:text-base leading-relaxed">
            {/* বিবরণ */}
            <div>
              <h3 className="font-black text-xl text-[#0B3D2E] mb-3">
                পদের সংক্ষিপ্ত বিবরণ:
              </h3>
              <p className="font-medium text-gray-600">{job.description}</p>
            </div>

            {/* দায়িত্বসমূহ */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h3 className="font-black text-xl text-[#0B3D2E] mb-3">
                  প্রধান দায়িত্বসমূহ (Responsibilities):
                </h3>
                <ul className="space-y-2.5">
                  {job.responsibilities.map((res: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check
                        size={18}
                        className="text-green-600 mt-1 shrink-0"
                      />
                      <span className="font-medium">{res}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* প্রয়োজনীয় যোগ্যতা */}
            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h3 className="font-black text-xl text-[#0B3D2E] mb-3">
                  প্রয়োজনীয় যোগ্যতা (Requirements):
                </h3>
                <ul className="space-y-2.5">
                  {job.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check
                        size={18}
                        className="text-green-600 mt-1 shrink-0"
                      />
                      <span className="font-medium">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* সুযোগ-সুবিধাসমূহ */}
            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h3 className="font-black text-xl text-[#0B3D2E] mb-3">
                  অন্যান্য সুযোগ-সুবিধাসমূহ (Benefits):
                </h3>
                <ul className="space-y-2.5">
                  {job.benefits.map((ben: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check
                        size={18}
                        className="text-green-600 mt-1 shrink-0"
                      />
                      <span className="font-medium">{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ২. অ্যাপ্লিকেশন ফরম (আবেদন করার সেকশন) */}
        <div
          id="apply-form"
          className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-[#0B3D2E]/5"
        >
          <div className="border-b pb-4 mb-6">
            <span className="text-xs font-black text-[#0B3D2E] uppercase tracking-widest bg-[#8FE3A9]/20 px-3 py-1 rounded-full">
              আবেদন ফরম
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#0B3D2E] mt-2">
              আবেদন করতে নিচের তথ্যসমূহ প্রদান করুন
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* নাম */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  আপনার পূর্ণ নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="যেমন: আব্দুল্লাহ আল মামুন"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D2E] outline-none transition"
                  />
                </div>
              </div>

              {/* ইমেইল */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ইমেইল এড্রেস <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@gmail.com"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D2E] outline-none transition"
                  />
                </div>
              </div>

              {/* ফোন */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ফোন নম্বর <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="01700000000"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D2E] outline-none transition"
                  />
                </div>
              </div>

              {/* প্রত্যাশিত বেতন */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  প্রত্যাশিত বেতন (Expected Salary)
                </label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  placeholder="যেমন: ৫০,০০০ টাকা"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D2E] outline-none transition"
                />
              </div>

              {/* পোর্টফোলিও */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  পোর্টফোলিও / ওয়েবসাইট (যদি থাকে)
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D2E] outline-none transition"
                />
              </div>

              {/* লিঙ্কডইন */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  লিঙ্কডইন প্রোফাইল (LinkedIn)
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D2E] outline-none transition"
                />
              </div>
            </div>

            {/* রেজুমে/সিভি আপলোড */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                রেজুমে / সিভি আপলোড (PDF, DOC){" "}
                <span className="text-red-500">*</span>
              </label>

              {!resumeFile ? (
                <label className="border-2 border-dashed border-gray-300 hover:border-[#0B3D2E] bg-gray-50 hover:bg-[#8FE3A9]/10 transition rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer">
                  <UploadCloud size={40} className="text-gray-400 mb-2" />
                  <span className="text-sm font-bold text-gray-700">
                    এখানে ফাইল ড্রপ করুন অথবা ব্রাউজ করতে ক্লিক করুন
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    সর্বোচ্চ ফাইল সাইজ: 5MB (PDF/DOCX)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 bg-[#8FE3A9]/10 border border-[#8FE3A9] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <FileText className="text-[#0B3D2E]" size={28} />
                    <div>
                      <p className="font-bold text-[#0B3D2E] text-sm">
                        {resumeFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* কভার লেটার */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                কভার লেটার / সংক্ষিপ্ত বার্তা (ঐচ্ছিক)
              </label>
              <textarea
                name="coverLetter"
                rows={4}
                value={formData.coverLetter}
                onChange={handleInputChange}
                placeholder="আপনি কেন এই পদের জন্য উপযুক্ত মনে করছেন সংক্ষেপে লিখুন..."
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D2E] outline-none transition"
              />
            </div>

            {/* সাবমিট বাটন */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0B3D2E] text-[#F5EFE1] py-4 rounded-2xl font-black text-lg hover:bg-green-900 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  আবেদন প্রসেসিং হচ্ছে...
                </span>
              ) : (
                <>
                  আবেদন সাবমিট করুন <Send size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}