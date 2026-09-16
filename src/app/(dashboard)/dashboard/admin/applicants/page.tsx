"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  Search,
  Trash2,
  Eye,
  X,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  DollarSign,
  ExternalLink,
  Linkedin,
  Filter,
} from "lucide-react";

interface Application {
  _id: string;
  jobId: string;
  jobSlug: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  expectedSalary?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  coverLetter?: string;
  resumeUrl: string;
  status: "Pending" | "Reviewed" | "Shortlisted" | "Rejected";
  createdAt: string;
}

interface ApplicationsApiResponse {
  success: boolean;
  count: number;
  totalApplications: number;
  totalPages: number;
  currentPage: number;
  data: Application[];
}

function TableSkeleton() {
  return (
    <div className="animate-pulse divide-y divide-gray-100">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4">
          <div className="space-y-2 w-1/4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );
}

export default function JobDashboard() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);

  const limit = 8;

  const { data, isLoading, isError } = useQuery<ApplicationsApiResponse>({
    queryKey: [
      "admin-job-applications",
      currentPage,
      searchTerm,
      selectedStatus,
    ],
    queryFn: async () => {
      const res = await axiosSecure.get("/jobs/applications", {
        params: {
          page: currentPage,
          limit,
          search: searchTerm,
          status: selectedStatus,
        },
      });
      return res.data;
    },
  });

  const applicants = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalApplications = data?.totalApplications || 0;

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await axiosSecure.put(`/jobs/applications/${id}/status`, {
        status,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-job-applications"] });
      Swal.fire({
        icon: "success",
        title: "স্ট্যাটাস আপডেট হয়েছে",
        text: "আবেদনকারীর স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে।",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "rounded-3xl" },
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "ব্যর্থ হয়েছে!",
        text: "স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি।",
        confirmButtonColor: "#EF4444",
      });
    },
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosSecure.delete(`/jobs/applications/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-job-applications"] });
      if (selectedApplicant) setSelectedApplicant(null);
      Swal.fire({
        icon: "success",
        title: "ডিলিট সম্পন্ন!",
        text: "আবেদনপত্রটি মুছে ফেলা হয়েছে।",
        confirmButtonColor: "#0B3D2E",
        customClass: { popup: "rounded-3xl" },
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "ডিলিট ব্যর্থ হয়েছে!",
        text: "সার্ভার থেকে মুছে ফেলা সম্ভব হয়নি।",
        confirmButtonColor: "#EF4444",
      });
    },
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `"${name}" এর আবেদনপত্রটি স্থায়ীভাবে মুছে ফেলা হবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
      customClass: { popup: "rounded-3xl" },
    });

    if (result.isConfirmed) {
      deleteApplicationMutation.mutate(id);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Reviewed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shortlisted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-red-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FBF7] p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-[#0B3D2E]/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-black text-[#0B3D2E] uppercase tracking-wider bg-[#8FE3A9]/20 px-3 py-1 rounded-md">
              এডমিন ড্যাশবোর্ড
            </span>
            <h1 className="text-2xl font-black text-[#0B3D2E] mt-1">
              জব অ্যাপ্লিকেশন ম্যানেজমেন্ট
            </h1>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            মোট আবেদনপত্র:{" "}
            <span className="text-[#0B3D2E] text-sm font-black">
              {totalApplications}
            </span>{" "}
            টি
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#0B3D2E]/10 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="আবেদনকারী বা জবের নাম লিখুন..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B3D2E] font-medium"
            />
          </div>

          <div className="relative w-full md:w-auto shrink-0">
            <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200/80 transition px-3.5 py-2 rounded-xl border border-gray-200/60 focus-within:ring-2 focus-within:ring-[#0B3D2E]">
              <Filter size={16} className="text-gray-500 shrink-0" />
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 outline-none w-full md:w-auto cursor-pointer pr-2"
              >
                <option value="All">সব স্ট্যাটাস (All)</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#0B3D2E]/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-600 uppercase tracking-wider">
                  <th className="p-4 pl-6">আবেদনকারীর তথ্য</th>
                  <th className="p-4">পদ / পজিশন</th>
                  <th className="p-4">আবেদনের তারিখ</th>
                  <th className="p-4 text-center">স্ট্যাটাস</th>
                  <th className="p-4 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={5}>
                      <TableSkeleton />
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-12 text-red-500 font-bold"
                    >
                      আবেদনপত্রের তালিকা লোড করা সম্ভব হয়নি।
                    </td>
                  </tr>
                ) : applicants.length > 0 ? (
                  applicants.map((applicant) => (
                    <tr
                      key={applicant._id}
                      className="hover:bg-gray-50/80 transition"
                    >
                      <td className="p-4 pl-6">
                        <div>
                          <p className="font-bold text-[#0B3D2E] text-base">
                            {applicant.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {applicant.email} • {applicant.phone}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-[#8FE3A9]/20 text-[#0B3D2E] text-xs font-bold px-2.5 py-1 rounded-md">
                          {applicant.jobTitle}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-semibold text-gray-600">
                        {new Date(applicant.createdAt).toLocaleDateString(
                          "bn-BD",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={applicant.status}
                          onChange={(e) =>
                            handleStatusChange(applicant._id, e.target.value)
                          }
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border outline-none cursor-pointer ${getStatusBadgeClass(
                            applicant.status,
                          )}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedApplicant(applicant)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="বিস্তারিত দেখুন"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(applicant._id, applicant.fullName)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="মুছে ফেলুন"
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
                      className="text-center py-12 text-gray-500 font-medium"
                    >
                      কোনো আবেদনপত্র পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span className="text-xs text-gray-500 font-semibold">
                পেজ {currentPage} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-2 rounded-xl border bg-white hover:bg-gray-100 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-[#0B3D2E] px-3 py-1 bg-[#8FE3A9]/20 rounded-lg">
                  {currentPage}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="p-2 rounded-xl border bg-white hover:bg-gray-100 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 my-auto flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-[#f8fbf8]">
              <div>
                <h3 className="text-lg font-bold text-[#0B3D2E]">
                  আবেদনকারীর বিবরণী
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedApplicant.jobTitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="w-14 h-14 bg-[#8FE3A9]/30 text-[#0B3D2E] font-black rounded-2xl flex items-center justify-center text-xl shrink-0">
                  {selectedApplicant.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {selectedApplicant.fullName}
                  </h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Briefcase size={12} /> {selectedApplicant.jobTitle}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <p className="text-gray-400 flex items-center gap-1 font-semibold">
                    <Mail size={12} /> ইমেইল
                  </p>
                  <p className="font-bold text-gray-800 break-all">
                    {selectedApplicant.email}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <p className="text-gray-400 flex items-center gap-1 font-semibold">
                    <Phone size={12} /> ফোন
                  </p>
                  <p className="font-bold text-gray-800">
                    {selectedApplicant.phone}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <p className="text-gray-400 flex items-center gap-1 font-semibold">
                    <DollarSign size={12} /> প্রত্যাশিত বেতন
                  </p>
                  <p className="font-bold text-gray-800">
                    {selectedApplicant.expectedSalary || "উল্লেখ করা হয়নি"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <p className="text-gray-400 flex items-center gap-1 font-semibold">
                    <Calendar size={12} /> আবেদনের তারিখ
                  </p>
                  <p className="font-bold text-gray-800">
                    {new Date(selectedApplicant.createdAt).toLocaleDateString(
                      "bn-BD",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>

              {(selectedApplicant.portfolioUrl ||
                selectedApplicant.linkedinUrl) && (
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <p className="text-xs font-bold text-gray-700">
                    সামাজিক / প্রফেশনাল লিংকসমূহ:
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {selectedApplicant.portfolioUrl && (
                      <a
                        href={selectedApplicant.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-[#8FE3A9]/20 text-[#0B3D2E] rounded-lg font-semibold transition"
                      >
                        <ExternalLink size={12} /> পোর্টফোলিও লিংক
                      </a>
                    )}
                    {selectedApplicant.linkedinUrl && (
                      <a
                        href={selectedApplicant.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition"
                      >
                        <Linkedin size={12} /> লিঙ্কডইন প্রোফাইল
                      </a>
                    )}
                  </div>
                </div>
              )}

              {selectedApplicant.coverLetter && (
                <div className="border-t border-gray-100 pt-4 space-y-1.5">
                  <p className="text-xs font-bold text-gray-700">কভার লেটার:</p>
                  <p className="text-xs text-gray-600 bg-gray-50 p-4 rounded-xl leading-relaxed whitespace-pre-line border border-gray-100">
                    {selectedApplicant.coverLetter}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4">
                <a
                  href={selectedApplicant.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#0B3D2E] hover:bg-green-900 text-white font-bold text-xs rounded-xl transition shadow-md"
                >
                  <Download size={14} /> রেজুমে / সিভি দেখুন ও ডাউনলোড করুন
                </a>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
