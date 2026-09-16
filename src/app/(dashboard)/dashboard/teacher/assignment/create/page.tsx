"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  FileText,
  Calendar,
  Award,
  BookOpen,
  ChevronRight,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

interface AssignmentInputs {
  title: string;
  description: string;
  course: string;
  totalMarks: number;
  dueDate: string;
}

export default function CreateAssignmentPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignmentInputs>({
    defaultValues: {
      totalMarks: 100,
      description: "",
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<AssignmentInputs>();

  // Fetch instructor's active courses
  const { data: dbCourses = [], isLoading: isCoursesLoading } = useQuery<any[]>(
    {
      queryKey: ["teacher-my-courses"],
      queryFn: async () => {
        const { data } = await axiosSecure.get("/courses/teacher/my-courses");
        return data?.data || data || [];
      },
    },
  );

  // Fetch created assignments list for the active instructor
  const { data: createdAssignments = [], isLoading: isAssignmentsLoading } =
    useQuery<any[]>({
      queryKey: ["teacher-created-assignments"],
      queryFn: async () => {
        const { data } = await axiosSecure.get(
          "/assignments/teacher/my-created",
        );
        return data?.data || data || [];
      },
    });

  // Create Mutation pipeline
  const createMutation = useMutation({
    mutationFn: async (payload: AssignmentInputs) => {
      const { data } = await axiosSecure.post(
        "/assignments/teacher/create",
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-created-assignments"],
      });
      Swal.fire({
        title: "অসাধারণ!",
        text: "নতুন অ্যাসাইনমেন্টটি সফলভাবে তৈরি করা হয়েছে।",
        icon: "success",
        confirmButtonColor: "#10B981",
        confirmButtonText: "ঠিক আছে",
        customClass: { popup: "rounded-[2rem]" },
      });
      reset();
      setIsFormOpen(false);
    },
    onError: (err: any) => {
      const errMsg =
        err?.response?.data?.message ||
        "অ্যাসাইনমেন্ট তৈরি করতে ব্যর্থ হয়েছে।";
      Swal.fire({
        title: "ব্যর্থ হয়েছে!",
        text: errMsg,
        icon: "error",
        confirmButtonColor: "#EF4444",
        customClass: { popup: "rounded-[2rem]" },
      });
    },
  });

  // Update Mutation pipeline
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: AssignmentInputs;
    }) => {
      const { data } = await axiosSecure.put(
        `/assignments/teacher/update/${id}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-created-assignments"],
      });
      Swal.fire({
        title: "সফল!",
        text: "অ্যাসাইনমেন্টটি সফলভাবে আপডেট করা হয়েছে।",
        icon: "success",
        confirmButtonColor: "#3B82F6",
        confirmButtonText: "ঠিক আছে",
        customClass: { popup: "rounded-[2rem]" },
      });
      setEditingAssignment(null);
    },
    onError: (err: any) => {
      const errMsg =
        err?.response?.data?.message || "আপডেট করতে ব্যর্থ হয়েছে।";
      Swal.fire({
        title: "ব্যর্থ হয়েছে!",
        text: errMsg,
        icon: "error",
        confirmButtonColor: "#EF4444",
        customClass: { popup: "rounded-[2rem]" },
      });
    },
  });

  // Delete Mutation pipeline
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosSecure.delete(
        `/assignments/teacher/delete/${id}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-created-assignments"],
      });
      Swal.fire({
        title: "ডিলিট হয়েছে!",
        text: "অ্যাসাইনমেন্টটি সফলভাবে মুছে ফেলা হয়েছে।",
        icon: "success",
        confirmButtonColor: "#10B981",
        confirmButtonText: "ঠিক আছে",
        customClass: { popup: "rounded-[2rem]" },
      });
    },
    onError: (err: any) => {
      const errMsg =
        err?.response?.data?.message || "মুছে ফেলতে ব্যর্থ হয়েছে।";
      Swal.fire({
        title: "ব্যর্থ হয়েছে!",
        text: errMsg,
        icon: "error",
        confirmButtonColor: "#EF4444",
        customClass: { popup: "rounded-[2rem]" },
      });
    },
  });

  const onSubmit = (data: AssignmentInputs) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: AssignmentInputs) => {
    if (editingAssignment) {
      updateMutation.mutate({ id: editingAssignment._id, payload: data });
    }
  };

  const openEditModal = (assignment: any) => {
    setEditingAssignment(assignment);
    resetEdit({
      title: assignment.title,
      description: assignment.description,
      course: assignment.course?._id || assignment.course,
      totalMarks: assignment.totalMarks,
      dueDate: assignment.dueDate ? assignment.dueDate.split("T")[0] : "",
    });
  };

  const handleDeleteConfirm = (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "ডিলিট করার পর এই অ্যাসাইনমেন্টটি আর ফিরিয়ে আনা যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "বাতিল করুন",
      customClass: { popup: "rounded-[2rem]" },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <span>ড্যাশবোর্ড</span>
        <ChevronRight size={12} />
        <span>অ্যাসাইনমেন্ট</span>
        <ChevronRight size={12} />
        <span className="text-emerald-600">অ্যাসাইনমেন্ট তৈরি করুন</span>
      </div>

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            অ্যাসাইনমেন্ট প্যানেল
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            শিক্ষার্থীদের মূল্যায়নের জন্য নতুন অ্যাসাইনমেন্ট তৈরি এবং
            পূর্ববর্তী রেকর্ডসমূহ পরিচালনা করুন
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center"
          >
            <Plus size={16} />
            <span>নতুন অ্যাসাইনমেন্ট তৈরি করুন</span>
          </button>
        )}
      </div>

      {/* Form Trigger Expansion Layout Wrapper */}
      {isFormOpen && (
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-100/40 rounded-[2rem] overflow-hidden animate-scaleUp">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500" />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 sm:p-10 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Course Selector */}
              <div className="col-span-1 group">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block transition-colors group-focus-within:text-emerald-600">
                  কোর্স নির্বাচন করুন
                </label>
                <div className="relative mt-2">
                  <BookOpen
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <select
                    disabled={isCoursesLoading}
                    {...register("course", {
                      required: "কোর্স সিলেক্ট করা আবশ্যক",
                    })}
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all text-slate-900 font-bold cursor-pointer disabled:opacity-60 ${
                      errors.course
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/5"
                        : "border-slate-200 focus:border-emerald-500"
                    }`}
                  >
                    <option value="" className="text-slate-500 bg-white">
                      {isCoursesLoading
                        ? "কোর্স লোড হচ্ছে..."
                        : "একটি কোর্স বেছে নিন"}
                    </option>
                    {dbCourses.map((course) => {
                      const courseName =
                        course?.name || course?.title || "Unnamed Course";
                      return (
                        <option
                          key={course._id || course.id}
                          value={course._id || course.id}
                          className="text-slate-900 bg-white font-bold py-2"
                        >
                          {courseName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {errors.course && (
                  <p className="mt-1.5 text-xs font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.course.message}
                  </p>
                )}
              </div>

              {/* Total Marks */}
              <div className="col-span-1 group">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block transition-colors group-focus-within:text-emerald-600">
                  মোট নম্বর (Total Marks)
                </label>
                <div className="relative mt-2">
                  <Award
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="number"
                    {...register("totalMarks", {
                      required: "মোট নম্বর আবশ্যক",
                      min: { value: 1, message: "নম্বর কমপক্ষে ১ হতে হবে" },
                    })}
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-800 ${
                      errors.totalMarks
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/5"
                        : "border-slate-200 focus:border-emerald-500"
                    }`}
                  />
                </div>
                {errors.totalMarks && (
                  <p className="mt-1.5 text-xs font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.totalMarks.message}
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="col-span-1 sm:col-span-2 group">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block transition-colors group-focus-within:text-emerald-600">
                  অ্যাসাইনমেন্টের শিরোনাম
                </label>
                <div className="relative mt-2">
                  <FileText
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="যেমন: সূরা বাকারার ১ম রুকুর সহজ তাফসির সারসংক্ষেপ"
                    {...register("title", {
                      required: "শিরোনাম দেওয়া বাধ্যতামূলক",
                    })}
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all font-semibold text-slate-800 ${
                      errors.title
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/5"
                        : "border-slate-200 focus:border-emerald-500"
                    }`}
                  />
                </div>
                {errors.title && (
                  <p className="mt-1.5 text-xs font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.title.message}
                  </p>
                )}
              </div>

              {/* Due Date */}
              <div className="col-span-1 sm:col-span-2 group">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block transition-colors group-focus-within:text-emerald-600">
                  জমা দেওয়ার শেষ সময় (Due Date)
                </label>
                <div className="relative mt-2">
                  <Calendar
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="date"
                    {...register("dueDate", {
                      required: "শেষ সময় নির্ধারণ করা বাধ্যতামূলক",
                    })}
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all font-semibold text-slate-800 ${
                      errors.dueDate
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/5"
                        : "border-slate-200 focus:border-emerald-500"
                    }`}
                  />
                </div>
                {errors.dueDate && (
                  <p className="mt-1.5 text-xs font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.dueDate.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="col-span-1 sm:col-span-2 group">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block transition-colors group-focus-within:text-emerald-600">
                  অ্যাসাইনমেন্টের বিস্তারিত নির্দেশনা (Description)
                </label>
                <textarea
                  rows={6}
                  placeholder="শিক্ষার্থীদের জন্য অ্যাসাইনমেন্টের বিস্তারিত নিয়মাবলী ও প্রশ্নসমূহ এখানে লিখুন..."
                  {...register("description")}
                  className="w-full mt-2 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium text-slate-800 resize-none"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  reset();
                }}
                className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                ফর্ম বন্ধ করুন
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-6 py-3 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-slate-900/10 hover:shadow-emerald-700/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
              >
                {createMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <span>অ্যাসাইনমেন্ট প্রকাশ করুন</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 🎯 Section Header: Created Assignments List Container Layout */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-800 tracking-tight">
          পূর্ববর্তী প্রকাশিত অ্যাসাইনমেন্টসমূহ
        </h2>

        {isAssignmentsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-44 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : createdAssignments.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-400">
              এখনো কোনো অ্যাসাইনমেন্ট তৈরি করা হয়নি।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {createdAssignments.map((assignment) => {
              const courseTitle =
                assignment?.course?.name ||
                assignment?.course?.title ||
                "Unknown Course";
              return (
                <div
                  key={assignment._id}
                  className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden"
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500" />

                  <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider truncate inline-block max-w-full">
                        {assignment?.course?.category || "General"}
                      </span>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2 mt-1.5">
                        {assignment.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">
                        {courseTitle}
                      </p>
                    </div>

                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2 bg-slate-50/80 rounded-xl p-2 border border-slate-100">
                        <Calendar
                          size={14}
                          className="text-slate-400 shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[8px] font-bold uppercase text-slate-400">
                            Due Date
                          </span>
                          <span className="text-[10px] sm:text-xs font-bold text-slate-700 truncate">
                            {assignment.dueDate
                              ? new Date(assignment.dueDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-50/80 rounded-xl p-2 border border-slate-100">
                        <Award size={14} className="text-slate-400 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[8px] font-bold uppercase text-slate-400">
                            Total Marks
                          </span>
                          <span className="text-[10px] sm:text-xs font-bold text-slate-700 truncate">
                            {assignment.totalMarks}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100/80 my-2 pt-2 flex items-center justify-end gap-2 mt-auto">
                      <button
                        onClick={() => openEditModal(assignment)}
                        className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Edit Assignment"
                      >
                        <Pencil size={12} />
                        <span>সম্পাদনা</span>
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(assignment._id)}
                        disabled={deleteMutation.isPending}
                        className="h-8 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Delete Assignment"
                      >
                        <Trash2 size={12} />
                        <span>মুছে ফেলুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🎯 Real-Time Mutation Edit Sheet Modal Overlay Layout */}
      {editingAssignment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-md transition-all duration-300 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col transform transition-all duration-300 scale-95 animate-scaleUp">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  অ্যাসাইনমেন্ট সংশোধন করুন
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  নির্ধারিত তথ্যাদি আপডেট করুন
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingAssignment(null)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all text-sm font-bold cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form
              onSubmit={handleSubmitEdit(onEditSubmit)}
              className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
            >
              <div className="group">
                <label className="text-[11px] font-black uppercase text-slate-400 block">
                  অ্যাসাইনমেন্টের শিরোনাম
                </label>
                <input
                  type="text"
                  {...registerEdit("title", {
                    required: "শিরোনাম দেওয়া আবশ্যক",
                  })}
                  className={`w-full mt-1.5 px-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:bg-white text-slate-800 ${
                    editErrors.title
                      ? "border-red-400"
                      : "border-slate-200 focus:border-emerald-500"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="text-[11px] font-black uppercase text-slate-400 block">
                    মোট নম্বর
                  </label>
                  <input
                    type="number"
                    {...registerEdit("totalMarks", {
                      required: "নম্বর আবশ্যক",
                      min: 1,
                    })}
                    className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white text-slate-800"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[11px] font-black uppercase text-slate-400 block">
                    {" "}
                    Due Date{" "}
                  </label>
                  <input
                    type="date"
                    {...registerEdit("dueDate", { required: "তারিখ আবশ্যক" })}
                    className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[11px] font-black uppercase text-slate-400 block">
                  বিস্তারিত নির্দেশনা
                </label>
                <textarea
                  rows={4}
                  {...registerEdit("description")}
                  className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white text-slate-800 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-600/10 disabled:opacity-70 flex items-center justify-center cursor-pointer"
              >
                {updateMutation.isPending
                  ? "আপডেট হচ্ছে..."
                  : "তথ্য সংরক্ষণ করুন"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}