"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import {
  User,
  BookOpen,
  Layers,
  Users,
  Search,
  Loader2,
  CheckCircle,
  Trash2, // 1. Import the Trash2 icon
} from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

interface DropdownItem {
  _id: string;
  title?: string;
  batchName?: string;
}

export default function AdminAssignPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // 🎯 সার্চ ও সিলেক্টেড ফিল্ডের স্টেট ম্যানেজমেন্ট
  const [studentSearch, setStudentSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  // ==========================================
  // 🔍 ১. রিয়েল-টাইম শিক্ষার্থী (Student) সার্চ কুয়েরি
  // ==========================================
  const { data: students = [], isLoading: isStudentLoading } = useQuery<any[]>({
    queryKey: ["search-students-manual", studentSearch],
    queryFn: async () => {
      if (!studentSearch.trim()) return [];
      const res = await axiosSecure.get(
        `/students?${studentSearch}`,
      );
      return res.data?.data || res.data || [];
    },
    enabled: studentSearch.trim().length > 0,
    staleTime: 1000 * 30, // ৩০ সেকেন্ড ক্যাশ থাকবে
  });

  // ==========================================
  // 🔍 ২. রিয়েল-টাইম শিক্ষক (Teacher) সার্চ কুয়েরি
  // ==========================================
  const { data: teachers = [], isLoading: isTeacherLoading } = useQuery<any[]>({
    queryKey: ["search-teachers-manual", teacherSearch],
    queryFn: async () => {
      if (!teacherSearch.trim()) return [];
      const res = await axiosSecure.get(`/teachers?search=${teacherSearch}`);
      return res.data?.data || res.data || [];
    },
    enabled: teacherSearch.trim().length > 0,
    staleTime: 1000 * 30,
  });

  // ==========================================
  // 📚 ৩. গ্লোবাল কোর্স (Courses) লিস্ট ফেচিং
  // ==========================================
  const { data: courses = [], isLoading: isCourseLoading } = useQuery<
    DropdownItem[]
  >({
    queryKey: ["admin-fetch-all-courses-manual"],
    queryFn: async () => {
      const res = await axiosSecure.get("/courses");
      return res.data?.data || res.data || [];
    },
    staleTime: 1000 * 60 * 10, // ১০ মিনিট ক্যাশ
  });

  // ==========================================
  // ⚡ ৪. সিলেক্টেড কোর্সের অধীনে ব্যাচসমূহ লোড করা
  // ==========================================
  const { data: batches = [], isLoading: isBatchLoading } = useQuery<
    DropdownItem[]
  >({
    queryKey: ["admin-fetch-batches-by-course", selectedCourse],
    queryFn: async () => {
      if (!selectedCourse) return [];
      const res = await axiosSecure.get(`/batches?course=${selectedCourse}`);
      return res.data?.data || res.data || [];
    },
    enabled: !!selectedCourse,
  });

  // ==========================================
  // 📋 ৫. ইতিমধ্যে এনরোল করা লগে ডাটা রীড করা
  // ==========================================
  const { data: logsResponse, isLoading: isLogsLoading } = useQuery<any>({
    queryKey: ["admin-enrollment-logs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/enrollments/admin/all");
      return res.data;
    },
  });
  const logs = logsResponse?.data || [];

  // ==========================================
  // 🚀 ৬. এনরোলমেন্ট সাবমিশন মিউটেশন হ্যান্ডলার
  // ==========================================
  const { mutate: enrollStudent, isPending } = useMutation({
    mutationFn: async (payload: object) => {
      const res = await axiosSecure.post("/enrollments/manual-enroll", payload);
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        title: "আলহামদুলিল্লাহ!",
        text:
          data?.message ||
          "শিক্ষার্থীকে সফলভাবে সরাসরি ব্যাচে এনরোল করা হয়েছে।",
        icon: "success",
        confirmButtonColor: "#0B5D3B",
        customClass: { popup: "rounded-[2rem]" },
      });
      // স্টেট রিসেট
      setSelectedStudent("");
      setSelectedCourse("");
      setSelectedBatch("");
      setSelectedTeacher("");
      setStudentSearch("");
      setTeacherSearch("");
      queryClient.invalidateQueries({ queryKey: ["admin-enrollment-logs"] });
    },
    onError: (error: any) => {
      Swal.fire({
        title: "দুঃখিত ভাই!",
        text:
          error.response?.data?.message ||
          "এনরোলমেন্ট সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।",
        icon: "error",
        confirmButtonColor: "#d33",
        customClass: { popup: "rounded-[2rem]" },
      });
    },
  });

  // 2. Implement removeEnrollment mutation
  const {
    mutate: removeEnrollment,
    isPending: isDeletePending,
  } = useMutation({
    mutationFn: async (enrollmentId: string) => {
      const res = await axiosSecure.delete(`/enrollments/${enrollmentId}`);
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: data?.message || "Enrollment revoked and removed successfully.",
        confirmButtonColor: "#0B5D3B",
        customClass: { popup: "rounded-[2rem]" },
      });
      queryClient.invalidateQueries({ queryKey: ["admin-enrollment-logs"] });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: "Delete Failed!",
        text:
          error.response?.data?.message ||
          "Could not delete the enrollment. Try again.",
        confirmButtonColor: "#d33",
        customClass: { popup: "rounded-[2rem]" },
      });
    },
  });

  // 4. Confirmation dialog before deleting
  const handleDeleteClick = (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এটি শিক্ষার্থীর কোর্স ও ব্যাচ থেকে মুছে দেবে এবং তার অ্যাক্সেস বাতিল হবে।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "হ্যাঁ, মুছে দিন",
      cancelButtonText: "বাতিল",
      reverseButtons: true,
      customClass: { popup: "rounded-[2rem]" },
    }).then((result) => {
      if (result.isConfirmed) {
        removeEnrollment(id);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourse || !selectedBatch) {
      Swal.fire({
        text: "দয়া করে শিক্ষার্থী, কোর্স এবং ব্যাচ অপশনগুলো নিশ্চিত করুন।",
        icon: "warning",
        confirmButtonColor: "#0B5D3B",
      });
      return;
    }
    enrollStudent({
      studentId: selectedStudent,
      courseId: selectedCourse,
      batchId: selectedBatch,
      teacherId: selectedTeacher || undefined,
    });
  };

  return (
    <main className="min-h-screen bg-neutral-50 p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* হেডার */}
        <header className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-neutral-800 flex items-center gap-2">
            <Layers className="text-[#0B5D3B]" size={30} /> ম্যানুয়াল কোর্স
            এনরোলমেন্ট
          </h1>
          <p className="text-neutral-600 text-xs md:text-sm font-semibold">
            অ্যাডমিন প্যানেল থেকে যেকোনো শিক্ষার্থীকে সরাসরি ব্যাচ ও শিক্ষক
            বরাদ্দ করুন
          </p>
        </header>

        {/* ফর্ম কন্টেইনার */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
          <h2 className="text-base font-black text-neutral-700 mb-6 flex items-center gap-2">
            <CheckCircle size={18} className="text-[#0B5D3B]" /> এনরোলমেন্ট
            কনফিগারেশন
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
              {/* ১. শিক্ষার্থী অনুসন্ধান */}
              <div className="space-y-2 relative">
                <label className="text-[11px] font-bold text-neutral-600 block">
                  শিক্ষার্থী অনুসন্ধান <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="নাম বা স্টুডেন্ট আইডি লিখুন"
                    value={studentSearch}
                    onChange={(e) => {
                      setStudentSearch(e.target.value);
                      if (selectedStudent) setSelectedStudent(""); // পরিবর্তন করলে আইডি ক্লিয়ার
                    }}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#0B5D3B] outline-none pl-9 font-bold transition-all"
                  />
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                </div>
                {/* সার্চ ড্রপডাউন প্যানেল */}
                {studentSearch && !selectedStudent && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-100 rounded-2xl shadow-xl max-h-56 overflow-y-auto divide-y divide-neutral-50">
                    {isStudentLoading && (
                      <div className="p-3 text-xs text-neutral-400 font-bold flex items-center gap-2">
                        <Loader2 className="animate-spin" size={14} /> লোড
                        হচ্ছে...
                      </div>
                    )}
                    {!isStudentLoading && students.length === 0 && (
                      <div className="p-3 text-xs text-neutral-400 font-bold">
                        কোনো শিক্ষার্থী পাওয়া যায়নি
                      </div>
                    )}
                    {students.map((st) => (
                      <button
                        key={st._id}
                        type="button"
                        onClick={() => {
                          setSelectedStudent(st.user?._id || st._id);
                          setStudentSearch(
                            `${st.user?.name || "Unknown"} (${st.studentId || "N/A"})`,
                          );
                        }}
                        className="w-full text-left p-3 hover:bg-green-50/40 flex items-center gap-3 transition-colors"
                      >
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-neutral-100 border shrink-0">
                          <Image
                            src={st.user?.profileImage || "/hujur.webp"}
                            alt="Student"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-black text-neutral-800">
                            {st.user?.name}
                          </p>
                          <p className="text-[10px] font-bold text-neutral-400">
                            ID: {st.studentId || "N/A"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ২. কোর্স নির্বাচন */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-600 block">
                  কোর্স সিলেক্ট করুন <span className="text-red-600">*</span>
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setSelectedBatch(""); // কোর্স বদলালে ব্যাচ রিসেট
                  }}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#0B5D3B] outline-none font-bold cursor-pointer transition-all"
                >
                  <option value="">
                    {isCourseLoading ? "লোড হচ্ছে..." : "-- কোর্স বেছে নিন --"}
                  </option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* ৩. ব্যাচ নির্বাচন */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-600 block">
                  ব্যাচ নির্ধারণ করুন <span className="text-red-600">*</span>
                </label>
                <select
                  value={selectedBatch}
                  disabled={!selectedCourse}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#0B5D3B] outline-none font-bold disabled:opacity-50 cursor-pointer transition-all"
                >
                  <option value="">
                    {isBatchLoading
                      ? "লোড হচ্ছে..."
                      : !selectedCourse
                        ? "আগে কোর্স বাছুন"
                        : "-- ব্যাচ বেছে নিন --"}
                  </option>
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.batchName}
                    </option>
                  ))}
                </select>
              </div>

              {/* ৪. শিক্ষক অনুসন্ধান (অপশনাল/রিকোয়ার্ড ফ্লো) */}
              <div className="space-y-2 relative">
                <label className="text-[11px] font-bold text-neutral-600 block">
                  শিক্ষক বরাদ্দ
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="উস্তাদের নাম দিয়ে সার্চ করুন"
                    value={teacherSearch}
                    onChange={(e) => {
                      setTeacherSearch(e.target.value);
                      if (selectedTeacher) setSelectedTeacher("");
                    }}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#0B5D3B] outline-none pl-9 font-bold transition-all"
                  />
                  <Users
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                </div>
                {teacherSearch && !selectedTeacher && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-100 rounded-2xl shadow-xl max-h-56 overflow-y-auto divide-y divide-neutral-50">
                    {isTeacherLoading && (
                      <div className="p-3 text-xs text-neutral-400 font-bold flex items-center gap-2">
                        <Loader2 className="animate-spin" size={14} /> লোড
                        হচ্ছে...
                      </div>
                    )}
                    {!isTeacherLoading && teachers.length === 0 && (
                      <div className="p-3 text-xs text-neutral-400 font-bold">
                        কোনো শিক্ষক পাওয়া যায়নি
                      </div>
                    )}
                    {teachers.map((tc) => (
                      <button
                        key={tc._id}
                        type="button"
                        onClick={() => {
                          setSelectedTeacher(tc.user?._id || tc._id);
                          setTeacherSearch(
                            `${tc.user?.name || "Unknown"} (${tc.designation || "উস্তাদ"})`,
                          );
                        }}
                        className="w-full text-left p-3 hover:bg-green-50/40 flex items-center gap-3 transition-colors"
                      >
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-neutral-100 border shrink-0">
                          <Image
                            src={tc.user?.profileImage || "/hujur.webp"}
                            alt="Teacher"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-black text-neutral-800">
                            {tc.user?.name}
                          </p>
                          <p className="text-[10px] font-bold text-neutral-400">
                            {tc.designation || "শিক্ষক"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* সাবমিট বাটন অ্যাকশন */}
            <div className="text-right border-t border-neutral-100 pt-5">
              <button
                type="submit"
                disabled={isPending}
                className="bg-[#0B5D3B] hover:cursor-pointer text-white font-semibold text-xs md:text-sm py-3 px-8 rounded-2xl transition-all shadow-md hover:bg-[#07452b] active:scale-[0.98] disabled:opacity-60 flex items-center gap-2 ml-auto"
              >
                {isPending && <Loader2 className="animate-spin" size={16} />}
                সরাসরি এনরোল করুন
              </button>
            </div>
          </form>
        </section>

        {/* টেবিল রেকর্ড সেকশন */}
        <section className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/40">
            <h2 className="text-base font-black text-neutral-700 flex items-center gap-2">
              <BookOpen size={18} className="text-[#0B5D3B]" /> সাম্প্রতিক
              এনরোলমেন্ট রেকর্ডসমূহ
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-neutral-600 text-[11px] font-semibold border-b border-neutral-100">
                  <th className="px-6 py-4">শিক্ষার্থীর নাম ও আইডি</th>
                  <th className="px-6 py-4">এনরোলকৃত কোর্স</th>
                  <th className="px-6 py-4">বরাদ্দকৃত ব্যাচ</th>
                  <th className="px-6 py-4">পেমেন্ট মেথড ও ফি</th>
                  <th className="px-6 py-4 text-right">এনরোলমেন্টের তারিখ</th>
                  {/* 5. Add actions column header */}
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700 font-bold">
                {isLogsLoading ? (
                  [...Array(3)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-neutral-200 rounded w-28" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-neutral-200 rounded w-36" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-neutral-200 rounded w-20" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-neutral-200 rounded w-24" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-4 bg-neutral-200 rounded w-16 ml-auto" />
                      </td>
                      {/* 6. Add skeleton for delete action */}
                      <td className="px-6 py-4 text-right">
                        <div className="h-4 w-6 bg-neutral-200 rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-neutral-400 font-bold"
                    >
                      কোনো এনরোলমেন্ট রেকর্ড পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  logs.map((item: any) => (
                    <tr
                      key={item._id}
                      className="hover:bg-neutral-50/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="relative h-7 w-7 rounded-full overflow-hidden border bg-neutral-100 shrink-0">
                            <Image
                              src={item.student?.profileImage || "/hujur.webp"}
                              alt="Avatar"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-black text-neutral-800 block">
                              {item.student?.name || "Unknown"}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              ID: {item.student?.studentId || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-600 font-black">
                        {item.course?.title || "Unknown Course"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black bg-green-50 text-[#0B5D3B] border border-green-100 uppercase">
                          {item.batch?.batchName || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="block text-neutral-700">
                          {item.paymentDetails?.amountPaid || 0} ৳
                        </span>
                        <span className="text-[9px] text-neutral-400 tracking-tight block font-black uppercase">
                          {item.paymentDetails?.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-400 text-[11px] text-right font-black">
                        {item.createdAt
                          ? new Date(item.createdAt).toISOString().split("T")[0]
                          : "N/A"}
                      </td>
                      {/* 6. Add delete action button */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          title="Delete enrollment"
                          aria-label="Delete enrollment"
                          disabled={isDeletePending}
                          className="inline-flex cursor-pointer items-center justify-center p-2 rounded-lg hover:bg-red-50 transition-colors group disabled:opacity-50 ml-auto"
                          onClick={() => handleDeleteClick(item._id)}
                        >
                          <Trash2
                            size={16}
                            className="text-neutral-300 group-hover:text-red-600 transition-colors"
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
