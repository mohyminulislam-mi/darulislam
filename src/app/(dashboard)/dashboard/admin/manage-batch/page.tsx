"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  BookOpen,
  User,
  RefreshCw,
  CheckCircle,
  Clock,
  X,
  Layers,
  Calendar, // 🎯 নতুন আইকন ডেট ফিল্ডের জন্য
} from "lucide-react";

interface Course {
  _id: string;
  title: string;
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

interface Batch {
  _id: string;
  batchName: string;
  course: Course | null;
  teacher: Teacher | null;
  maxSeats: number;
  enrolledStudents: string[];
  status: "upcoming" | "active" | "completed";
  admissionStartDate?: string; // 🎯 নতুন ইন্টারফেস প্রোপার্টি
  classStartDate?: string; // 🎯 নতুন ইন্টারফেস প্রোপার্টি
  createdAt: string;
}

export default function AdminBatchManagement() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [formData, setFormData] = useState({
    batchName: "",
    course: "",
    teacher: "",
    maxSeats: 30,
    status: "upcoming",
    admissionStartDate: "", // 🎯 নতুন স্টেট ইনিশিয়েশন ভাই
    classStartDate: "", // 🎯 নতুন স্টেট ইনিশিয়েশন ভাই
  });

  // Queries using the custom secure axios instance
  const {
    data: batches = [],
    isLoading: batchesLoading,
    refetch: refetchBatches,
    isFetching: batchesFetching,
  } = useQuery({
    queryKey: ["batches", filterCourse, filterStatus],
    queryFn: async (): Promise<Batch[]> => {
      const response = await axiosSecure.get(
        `/batches?course=${filterCourse}&status=${filterStatus}`,
      );
      return response.data.data as Batch[];
    },
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async (): Promise<Course[]> => {
      const response = await axiosSecure.get("/courses");
      return (response.data.data || response.data) as Course[];
    },
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers"],
    queryFn: async (): Promise<Teacher[]> => {
      const response = await axiosSecure.get(
        "/users/admin/all-users?role=teacher",
      );
      return (response.data.data || []) as Teacher[];
    },
  });

  useEffect(() => {
    if (courses.length > 0 && !formData.course) {
      setFormData((prev) => ({ ...prev, course: courses[0]._id }));
    }
  }, [courses]);

  // Mutations using the custom secure axios instance
  const createMutation = useMutation({
    mutationFn: (newBatch: {
      batchName: string;
      course: string;
      teacher: string | null;
      maxSeats: number;
      status: string;
      admissionStartDate: string | null; // 🎯
      classStartDate: string | null; // 🎯
    }) => axiosSecure.post("/batches", newBatch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      Swal.fire("সফল", "নতুন ব্যাচ সফলভাবে তৈরি হয়েছে", "success");
      setModalOpen(false);
    },
    onError: (error: any) => {
      Swal.fire(
        "ব্যর্থ",
        error?.response?.data?.message || "Failed to create batch",
        "error",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData: { id: string; payload: any }) =>
      axiosSecure.put(`/batches/${updatedData.id}`, updatedData.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      Swal.fire("সফল", "ব্যাচ কনফিগারেশন সফলভাবে আপডেট হয়েছে", "success");
      setModalOpen(false);
    },
    onError: (error: any) => {
      Swal.fire(
        "ব্যর্থ",
        error?.response?.data?.message || "Failed to update batch",
        "error",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosSecure.delete(`/batches/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      Swal.fire("ডিলিট হয়েছে", "ব্যাচ রেকর্ডটি মুছে ফেলা হয়েছে।", "success");
    },
    onError: (error: any) => {
      Swal.fire(
        "ত্রুটি",
        error?.response?.data?.message || "Deletion sequence failed",
        "error",
      );
    },
  });

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      batchName: "",
      course: courses[0]?._id || "",
      teacher: "",
      maxSeats: 30,
      status: "upcoming",
      admissionStartDate: "", // 🎯
      classStartDate: "", // 🎯
    });
    setModalOpen(true);
  };

  // ডেট ফরম্যাট সেফটি চেকার ইউটিলিটি ভাই
  const formatInputDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return dateStr.split("T")[0]; // ISO স্ট্রিং থেকে YYYY-MM-DD ফরম্যাট ফিল্টার
  };

  const handleOpenEditModal = (batch: Batch) => {
    setEditingId(batch._id);
    setFormData({
      batchName: batch.batchName,
      course: batch.course?._id || "",
      teacher: batch.teacher?._id || "",
      maxSeats: batch.maxSeats,
      status: batch.status,
      admissionStartDate: formatInputDate(batch.admissionStartDate), // 🎯
      classStartDate: formatInputDate(batch.classStartDate), // 🎯
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.batchName.trim()) {
      return Swal.fire("指示", "দয়া করে ব্যাচের নাম প্রদান করুন", "warning");
    }

    const payload = {
      ...formData,
      maxSeats: Number(formData.maxSeats),
      teacher: formData.teacher || null,
      admissionStartDate: formData.admissionStartDate || null, // 🎯
      classStartDate: formData.classStartDate || null, // 🎯
    };

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        payload: {
          batchName: payload.batchName,
          teacher: payload.teacher,
          maxSeats: payload.maxSeats,
          status: payload.status,
          admissionStartDate: payload.admissionStartDate, // 🎯
          classStartDate: payload.classStartDate, // 🎯
        },
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDeleteBatch = async (id: string) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই ব্যাচটি ডিলিট করতে চান? কোনো অ্যাক্টিভ স্টুডেন্ট থাকলে ডিলিট করা যাবে না।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#166534",
      cancelButtonColor: "#991b1b",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold text-[10px] uppercase tracking-wide">
            চলমান (Active)
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-[10px] uppercase tracking-wide">
            সম্পন্ন (Completed)
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px] uppercase tracking-wide">
            আসন্ন (Upcoming)
          </span>
        );
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-[#F5F0E8]/40 p-6 md:p-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#0B3D2E] mt-2 flex items-center gap-2">
            <Layers className="text-green-800" size={28} /> ব্যাচ ম্যানেজমেন্ট
            প্যানেল
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            কোর্সের ব্যাচ তৈরি করুন, আসন সংখ্যা নির্ধারণ করুন এবং শিক্ষক এসাইন
            করুন।
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => refetchBatches()}
            className="p-3 bg-white hover:bg-gray-50 text-gray-600 rounded-xl border border-gray-200 cursor-pointer active:scale-95 transition-all"
            disabled={batchesFetching}
          >
            <RefreshCw
              className={batchesFetching ? "animate-spin" : ""}
              size={18}
            />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 cursor-pointer bg-green-800 hover:bg-green-900 text-white font-black px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 text-sm"
          >
            <Plus size={18} /> নতুন ব্যাচ তৈরি করুন
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-black/5 shadow-sm mb-6">
        <div>
          <label className="text-[10px] md:text-xs font-medium text-gray-500 uppercase mb-1 block">
            কোর্স অনুযায়ী ফিল্টার
          </label>
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="w-full cursor-pointer bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 outline-none"
          >
            <option value="">সর্বমোট কোর্স</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] md:text-xs font-medium text-gray-500 uppercase mb-1 block">
            অবস্থা (Status) ফিল্টার
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full cursor-pointer bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 outline-none"
          >
            <option value="">সর্বমোট স্ট্যাটাস</option>
            <option value="upcoming">আসন্ন (Upcoming)</option>
            <option value="active">চলমান (Active)</option>
            <option value="completed">সম্পন্ন (Completed)</option>
          </select>
        </div>
      </div>

      {batchesLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-black/5 shadow-sm">
          <RefreshCw className="animate-spin text-green-800 mb-2" size={32} />
          <p className="text-sm font-bold text-gray-500">
            ব্যাচ ইনফরমেশন লোড হচ্ছে...
          </p>
        </div>
      ) : batches.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-black/5 shadow-sm">
          <BookOpen className="mx-auto text-gray-300 mb-3" size={48} />
          <h3 className="text-lg font-bold text-gray-700">
            কোনো ব্যাচ খুঁজে পাওয়া যায়নি
          </h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
            ফিল্টার পরিবর্তন করে অথবা নতুন ব্যাচ তৈরি করে ট্র্যাকিং শুরু করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <div
              key={batch._id}
              className="bg-white rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {getStatusBadge(batch.status)}
                  <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                    <Clock size={12} />{" "}
                    {new Date(batch.createdAt).toLocaleDateString("bn-BD")}
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#0B3D2E] line-clamp-1 mb-1">
                  {batch.batchName}
                </h3>

                <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-2.5 text-sm">
                    <BookOpen
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                      size={16}
                    />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                        কোর্স
                      </p>
                      <p className="font-bold text-gray-700 mt-0.5">
                        {batch.course?.title || "Unknown Course"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-sm">
                    <User
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                      size={16}
                    />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                        শিক্ষক
                      </p>
                      <p
                        className={`font-bold mt-0.5 ${batch.teacher ? "text-gray-700" : "text-red-500 text-xs"}`}
                      >
                        {batch.teacher
                          ? batch.teacher.name
                          : "শিক্ষক নিযুক্ত করা হয়নি"}
                      </p>
                    </div>
                  </div>

                  {/* 🎯 টাইমলাইন ডিসপ্লে ট্র্যাকার উইজেট ভাই */}
                  {(batch.admissionStartDate || batch.classStartDate) && (
                    <div className="pt-2 mt-2 border-t border-dashed border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-500 font-medium">
                      {batch.admissionStartDate && (
                        <div>
                          <span className="block text-[9px] text-gray-400 font-bold uppercase">
                            ভর্তি শুরু
                          </span>
                          <span>
                            {new Date(
                              batch.admissionStartDate,
                            ).toLocaleDateString("bn-BD")}
                          </span>
                        </div>
                      )}
                      {batch.classStartDate && (
                        <div>
                          <span className="block text-[9px] text-gray-400 font-bold uppercase">
                            ক্লাস শুরু
                          </span>
                          <span>
                            {new Date(batch.classStartDate).toLocaleDateString(
                              "bn-BD",
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-100 p-5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Users size={16} className="text-green-800" />
                  <span className="text-sm font-black text-gray-800">
                    {batch.enrolledStudents.length}
                  </span>
                  <span className="text-xs text-gray-400 font-bold">
                    / {batch.maxSeats} আসন
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(batch)}
                    className="p-2.5 cursor-pointer bg-white hover:bg-gray-100 text-gray-600 rounded-xl border border-gray-200 shadow-sm transition-all active:scale-95"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteBatch(batch._id)}
                    className="p-2.5 cursor-pointer bg-white hover:bg-red-50 text-red-600 rounded-xl border border-gray-200 shadow-sm transition-all active:scale-95"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* মডাল হেডার এরিয়া */}
            <div className="bg-green-800 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight">
                  {editingId
                    ? "ব্যাচ কনফিগারেশন পরিবর্তন"
                    : "নতুন ব্যাচ সংযোজন"}
                </h2>
                <p className="text-[11px] tracking-wider font-medium uppercase mt-0.5">
                  প্রয়োজনীয় তথ্য দিয়ে ফর্মটি পূরণ করুন
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer active:scale-95"
              >
                <X size={16} />
              </button>
            </div>

            {/* মডাল মেইন ফর্ম */}
            <form
              onSubmit={handleFormSubmit}
              className="p-6 space-y-4 max-h-[75vh] overflow-y-auto selection:bg-emerald-100"
            >
              {/* ব্যাচের নাম ইনপুট */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1.5 block tracking-wide">
                  ব্যাচের নাম (Batch Name)
                </label>
                <input
                  type="text"
                  placeholder="উদা: তাজভীদ - ব্যাচ ০১"
                  value={formData.batchName}
                  onChange={(e) =>
                    setFormData({ ...formData, batchName: e.target.value })
                  }
                  className="w-full p-3.5 bg-gray-50 border border-gray-200/60 focus:border-green-600 focus:bg-white rounded-xl text-sm font-bold text-slate-800 outline-none transition-all"
                  required
                />
              </div>

              {/* কোর্স সিলেকশন (কন্ডিশনাল লক) */}
              {!editingId && (
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1.5 block tracking-wide">
                    কোর্স নির্বাচন করুন
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) =>
                      setFormData({ ...formData, course: e.target.value })
                    }
                    className="w-full p-3.5 bg-gray-50 border border-gray-200/60 focus:border-green-600 focus:bg-white rounded-xl text-sm font-bold text-slate-700 outline-none transition-all cursor-pointer"
                    required
                  >
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* শিক্ষক সিলেকশন */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1.5 block tracking-wide">
                  শিক্ষক নির্বাচন করুন (ঐচ্ছিক)
                </label>
                <select
                  value={formData.teacher}
                  onChange={(e) =>
                    setFormData({ ...formData, teacher: e.target.value })
                  }
                  className="w-full p-3.5 bg-gray-50 border border-gray-200/60 focus:border-green-600 focus:bg-white rounded-xl text-sm font-bold text-slate-700 outline-none transition-all cursor-pointer"
                >
                  <option value="">শিক্ষক ছাড়া রাখুন</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* 📅 ডাইনামিক ডেট ট্র্যাকার সেকশন */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1.5 block tracking-wide flex items-center gap-1.5">
                    <Calendar size={14} className="text-green-700" /> ভর্তি
                    শুরুর তারিখ
                  </label>
                  <input
                    type="date"
                    value={formData.admissionStartDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        admissionStartDate: e.target.value,
                      })
                    }
                    className="w-full p-3.5 bg-gray-50 border border-gray-200/60 focus:border-green-600 focus:bg-white rounded-xl text-sm font-bold text-slate-700 outline-none transition-all tracking-wide"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1.5 block tracking-wide flex items-center gap-1.5">
                    <Calendar size={14} className="text-green-700" /> ক্লাস
                    শুরুর তারিখ
                  </label>
                  <input
                    type="date"
                    value={formData.classStartDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        classStartDate: e.target.value,
                      })
                    }
                    className="w-full p-3.5 bg-gray-50 border border-gray-200/60 focus:border-green-600 focus:bg-white rounded-xl text-sm font-bold text-slate-700 outline-none transition-all tracking-wide"
                  />
                </div>
              </div>

              {/* সিট এবং স্ট্যাটাস কনফিগারেশন */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1.5 block tracking-wide">
                    সর্বোচ্চ আসন সংখ্যা (Max Seats)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.maxSeats}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxSeats: Number(e.target.value),
                      })
                    }
                    className="w-full p-3.5 bg-gray-50 border border-gray-200/60 focus:border-green-600 focus:bg-white rounded-xl text-sm font-bold text-slate-800 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1.5 block tracking-wide">
                    অবস্থা (Status)
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full p-3.5 bg-gray-50 border border-gray-200/60 focus:border-green-600 focus:bg-white rounded-xl text-sm font-bold text-slate-700 outline-none transition-all cursor-pointer"
                    required
                  >
                    <option value="upcoming">আসন্ন (Upcoming)</option>
                    <option value="active">চলমান (Active)</option>
                    <option value="completed">সম্পন্ন (Completed)</option>
                  </select>
                </div>
              </div>

              {/* 🔘 অ্যাকশন বাটন গ্রুপ */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/3 py-3.5 border border-gray-200 text-gray-500 font-bold cursor-pointer rounded-xl hover:bg-gray-50 transition-all text-sm active:scale-95"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-3.5 bg-green-800 hover:bg-green-900 cursor-pointer text-white font-black rounded-xl transition-all shadow-md text-sm active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <RefreshCw className="animate-spin" size={16} />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  তথ্য সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}
