"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import {
  ClipboardList,
  RefreshCw,
  Clock,
  CheckCircle,
  Folder,
  Inbox,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import AssignmentCard from "@/src/components/Assignment/AssignmentCard";

interface AssignmentDetails {
  _id: string;
  title: string;
  totalMarks: number;
}

interface StudentDetails {
  _id: string;
  name: string;
  profilePicture: string;
}

interface CourseDetails {
  _id: string;
  name: string;
  category: string;
}

export interface SubmissionType {
  _id: string;
  status: "pending" | "reviewed";
  studentNotes?: string;
  submittedImages: string[];
  assignment: AssignmentDetails;
  student: StudentDetails;
  course: CourseDetails;
  marksObtained?: number;
  instructorFeedback?: string;
}

const AssignmentManagement = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "reviewed">(
    "pending",
  );

  // Fetch submitted assignments from database pipeline
  const {
    data: submissions = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<SubmissionType[]>({
    queryKey: ["teacher-submissions", activeTab],
    queryFn: async () => {
      const url =
        activeTab === "all"
          ? "assignments/teacher/submissions"
          : `assignments/teacher/submissions?status=${activeTab}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  // Evaluate mutation pipeline logic handler
  const evaluateMutation = useMutation({
    mutationFn: async ({
      id,
      marks,
      feedback,
    }: {
      id: string;
      marks: number;
      feedback: string;
    }) => {
      const res = await axiosSecure.patch(
        `assignments/teacher/evaluate/${id}`,
        {
          marksObtained: marks,
          instructorFeedback: feedback,
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teacher-submissions"] });
      Swal.fire({
        icon: "success",
        title: "সম্পন্ন হয়েছে!",
        text: data?.message || "শিক্ষার্থীর অ্যাসাইনমেন্ট গ্রেড করা হয়েছে।",
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: "rounded-[2rem]" },
      });
    },
    onError: (err: any) => {
      Swal.fire({
        icon: "error",
        title: "অ্যাকশন ব্যর্থ হয়েছে",
        text:
          err?.response?.data?.message ||
          "সেভ করা যায়নি। ব্যাকএন্ড রাউট চেক করুন।",
        customClass: { popup: "rounded-[2rem]" },
      });
    },
  });

  const handleEvaluate = (submission: SubmissionType) => {
    const totalMarks = submission.assignment?.totalMarks || 100;

    Swal.fire({
      title: `<span class="text-base font-black text-slate-800">অ্যাসাইনমেন্ট মূল্যায়ন</span>`,
      html: `
        <div class="text-left font-sans space-y-3">
          <p class="text-xs text-slate-500 mb-2 font-bold">সর্বমোট নম্বর: <span class="text-emerald-600">${totalMarks}</span></p>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">প্রাপ্ত নম্বর *</label>
            <input id="swal-marks" type="number" min="0" max="${totalMarks}" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-500" value="${submission.marksObtained ?? ""}" placeholder="নম্বর লিখুন">
          </div>
          <div class="mt-3">
            <label class="block text-xs font-bold text-slate-600 mb-1">শিক্ষকের মন্তব্য / ফিডব্যাক</label>
            <textarea id="swal-feedback" rows="3" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 resize-none" placeholder="মন্তব্য লিখুন...">${submission.instructorFeedback || ""}</textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "সাবমিট করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#059669",
      cancelButtonColor: "#64748B",
      customClass: { popup: "rounded-[2rem] p-6 sm:p-8" },
      preConfirm: () => {
        const marksInput = (
          document.getElementById("swal-marks") as HTMLInputElement
        ).value;
        const feedbackInput = (
          document.getElementById("swal-feedback") as HTMLTextAreaElement
        ).value;

        if (!marksInput) {
          Swal.showValidationMessage("প্রাপ্ত নম্বর দেওয়া বাধ্যতামূলক!");
          return false;
        }

        const marks = parseFloat(marksInput);
        if (marks > totalMarks || marks < 0) {
          Swal.showValidationMessage(
            `নম্বর ০ থেকে ${totalMarks} এর মধ্যে হতে হবে!`,
          );
          return false;
        }

        return { marks, feedback: feedbackInput };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        evaluateMutation.mutate({
          id: submission._id,
          marks: result.value.marks,
          feedback: result.value.feedback,
        });
      }
    });
  };

  return (
    <div className="mt-8 space-y-6 pb-10 max-w-4xl mx-auto px-2 sm:px-4">
      {/* Header Container */}
      <div className="relative bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1.5 bg-emerald-600" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              অ্যাসাইনমেন্ট ও মূল্যায়ন
            </h2>
            <p className="text-xs md:text-sm font-medium text-slate-400 mt-0.5">
              শিক্ষার্থীদের জমা দেওয়া কাজগুলো চেক করুন এবং গ্রেড দিন
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl transition-all border border-slate-200 text-slate-600 active:scale-95 cursor-pointer shrink-0"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw
              size={16}
              className={`${isLoading ? "animate-spin text-emerald-600" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Modern High-Contrast Filter Tab Menu Bar */}
      <div className="flex bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-2xl gap-1.5 w-full max-w-md border border-slate-200/40">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "pending"
              ? "bg-white text-orange-600 shadow-md shadow-slate-200/60"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock size={14} />
          <span>রিভিউ বাকি</span>
        </button>
        <button
          onClick={() => setActiveTab("reviewed")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "reviewed"
              ? "bg-white text-emerald-600 shadow-md shadow-slate-200/60"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <CheckCircle size={14} />
          <span>মূল্যায়িত</span>
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "all"
              ? "bg-white text-blue-600 shadow-md shadow-slate-200/60"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Folder size={14} />
          <span>সব একসাথে</span>
        </button>
      </div>

      {/* Loading & Error States Layout Framework */}
      {isLoading && (
        <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/40">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-bold tracking-wide">
            অ্যাসাইনমেন্টগুলো লোড হচ্ছে...
          </p>
        </div>
      )}

      {isError && (
        <div className="text-center py-10 bg-red-50/60 text-red-600 rounded-[2rem] border border-red-100 text-xs font-bold flex items-center justify-center gap-2 px-4 shadow-sm">
          <AlertCircle size={16} />
          <span>
            ডাটা লোড করতে সমস্যা হয়েছে! দয়া করে ব্যাকএন্ড রাউট বা টোকেন চেক
            করুন।
          </span>
        </div>
      )}

      {/* Dynamic Submissions Content Stack mapping */}
      {!isLoading && !isError && submissions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/40 px-4 flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 rounded-2xl text-slate-600 mb-3 border border-slate-100">
            <Inbox size={32} />
          </div>
          <p className="text-slate-600 font-extrabold text-xs sm:text-sm">
            এই ট্যাবে বর্তমানে কোনো অ্যাসাইনমেন্ট সাবমিশন নেই।
          </p>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          {submissions.map((submission, idx) => (
            <AssignmentCard
              key={submission._id}
              submission={submission}
              idx={idx}
              onEvaluate={handleEvaluate}
            />
          ))}
        </div>
      )}

      {/* Bottom Sticky Synchronous Tracker Indicator Section */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 p-4 sm:p-5 rounded-[2rem] flex items-center justify-between text-white shadow-xl shadow-emerald-900/10 border border-emerald-600/20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 shrink-0">
            <ClipboardList size={18} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-black truncate">
              ডাটা সিঙ্ক মোড চালু আছে
            </h4>
            <p className="text-[10px] text-emerald-100/70 font-bold truncate mt-0.5">
              মূল্যায়ন করার পর তালিকা স্বয়ংক্রিয়ভাবে আপডেট হবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentManagement;