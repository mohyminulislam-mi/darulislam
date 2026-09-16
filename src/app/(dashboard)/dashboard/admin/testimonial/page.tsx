"use client";
import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  RefreshCw,
  User,
  ShieldCheck,
  Filter,
  Users,
} from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";

interface Testimonial {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email?: string;
  };
  adminCustomName?: string; // 🎯 নতুন অ্যাডমিন কাস্টম নাম সাপোর্ট সিঙ্ক
  adminCustomAvatar?: string;
  identityImage?: string;
  text: string;
  reviewerName: string; 
  rating: number;
  userType: "student" | "teacher" | "female_teacher" | "parent"; // 🎯 নতুন ফিল্টারিং জোন
  isApproved: boolean;
  createdAt: string;
}

const TestimonialAdmin: React.FC = () => {
  const axiosSecure = useAxiosSecure();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const [filterTab, setFilterTab] = useState<"all" | "pending" | "approved">(
    "all",
  );
  const [selectedUserType, setSelectedUserType] = useState<string>(""); // 🎯 ওস্তাদ, ওস্তাদা, ছাত্র ফিল্টার স্টেট

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedUserType) params.append("userType", selectedUserType);

      const res = await axiosSecure.get(
        `/testimonials/admin?${params.toString()}`,
      );

      if (res.data) {
        if (Array.isArray(res.data.data)) {
          setTestimonials(res.data.data);
        } else if (Array.isArray(res.data)) {
          setTestimonials(res.data);
        }
      }
    } catch (err: any) {
      console.error("Error fetching testimonials:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setTimeout(() => {
          if (testimonials.length === 0 && loading) fetchTestimonials();
        }, 800);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTestimonials();
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [selectedUserType]);

  const handleToggleApprove = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setActionLoading(true);
    try {
      const res = await axiosSecure.put(`/testimonials/${id}/approve`, {
        isApproved: nextStatus,
      });

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: "success",
          title: nextStatus
            ? "রিভিউটি সাকসেসফুলি অ্যাপ্রুভড!"
            : "রিভিউটি ল্যান্ডিং থেকে হাইড করা হয়েছে!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        setTestimonials((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, isApproved: nextStatus } : item,
          ),
        );
      }
    } catch (err: any) {
      console.error("Status update error:", err);
      Swal.fire({
        icon: "error",
        title: "অ্যাকশন ব্যর্থ!",
        text:
          err.response?.data?.message || "স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি।",
        confirmButtonColor: "#d33",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "ডিলিট করলে এই রিভিউটি কিন্তু ডাটাবেজ থেকে স্থায়ীভাবে মুছে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6e7881",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "বাতিল",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setActionLoading(true);
        try {
          const res = await axiosSecure.delete(`/testimonials/${id}`);
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "সফলভাবে ডিলিট হয়েছে!",
              confirmButtonColor: "#0B5D3B",
              timer: 2000,
            });

            setTestimonials((prev) => prev.filter((item) => item._id !== id));
          }
        } catch (err: any) {
          console.error("Delete error:", err);
          Swal.fire({
            icon: "error",
            title: "ডিলিট ব্যর্থ হয়েছে!",
            text:
              err.response?.data?.message || "অনুমতি নেই বা নেটওয়ার্ক সমস্যা।",
            confirmButtonColor: "#d33",
          });
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  // 📊 ট্যাবের ওপর ভিত্তি করে মডারেশন ফিল্টারিং লজিক
  const filteredTestimonials = testimonials.filter((item) => {
    if (filterTab === "pending") return !item.isApproved;
    if (filterTab === "approved") return item.isApproved;
    return true; // 'all'
  });

  return (
    <div className="w-full min-h-screen bg-gray-50/50 px-4 pb-16 pt-24 md:pt-28 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/80 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/60 rounded-md text-[10px] font-black text-amber-800 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Control Only
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-7 h-7 text-[#0B5D3B]" /> রিভিউ মডারেশন
              প্যানেল
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              শিক্ষার্থী, ওস্তাদ ও অভিভাবকদের সাবমিট করা টেস্টীমোনিয়ালগুলো
              ভেরিফাই করুন এবং হোমপেজের জন্য ম্যানেজ করুন।
            </p>
          </div>

          <button
            onClick={fetchTestimonials}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 cursor-pointer bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-black text-gray-700 hover:bg-gray-50 transition-all shadow-xs active:scale-95 w-full md:w-auto"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />{" "}
            ডাটা রিফ্রেশ করুন
          </button>
        </div>

        {/* 🎛️ ফিল্টারিং কন্ট্রোল বার কম্বো প্যানেল */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white border border-gray-200/60 p-3 rounded-2xl shadow-xs">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setFilterTab("all")}
              className={`px-4 py-2 cursor-pointer rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                filterTab === "all"
                  ? "bg-[#0B5D3B] text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              সব রিভিউ ({testimonials.length})
            </button>
            <button
              onClick={() => setFilterTab("pending")}
              className={`px-4 py-2 cursor-pointer rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                filterTab === "pending"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-amber-50 text-amber-700"
              }`}
            >
              পেন্ডিং ({testimonials.filter((i) => !i.isApproved).length})
            </button>
            <button
              onClick={() => setFilterTab("approved")}
              className={`px-4 py-2 cursor-pointer rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                filterTab === "approved"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-emerald-50 text-emerald-700"
              }`}
            >
              অ্যাপ্রুভড ({testimonials.filter((i) => i.isApproved).length})
            </button>
          </div>

          {/* 🎯 নতুন সংযোজিত ইউজার টাইপ সার্ভার-সাইড ড্রপডাউন ফিল্টার */}
          <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
            <Users size={14} className="text-gray-400 shrink-0" />
            <select
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value)}
              className="w-full sm:w-44 border border-gray-200/80 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#0B5D3B] bg-gray-50/50 cursor-pointer"
            >
              <option value="">সকল ধরণ (All Types)</option>
              <option value="student">শিক্ষার্থী (Student)</option>
              <option value="teacher">ওস্তাদ (Teacher)</option>
              <option value="female_teacher">ওস্তাদা (Female Teacher)</option>
              <option value="parent">অভিভাবক (Parent)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <LoadingSpinner />
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="bg-white text-center py-24 border border-gray-100 rounded-[2rem] text-gray-400 text-xs font-bold shadow-xs">
            এই ক্যাটাগরিতে কোনো রিভিউ খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((item) => {
              // 🎯 নতুন ব্যাকএন্ড স্কিমা অনুযায়ী reviewerName ফিল্ড সবার আগে ট্র্যাক করা হলো ভাই
              const displayName =
                item.reviewerName ||
                item.adminCustomName ||
                item.user?.name ||
                "অজানা ব্যবহারকারী";

              let userTypeLabel = "শিক্ষার্থী";
              if (item.userType === "teacher")
                userTypeLabel = "শিক্ষক (ওস্তাদ)";
              if (item.userType === "female_teacher")
                userTypeLabel = "শিক্ষিকা (ওস্তাদা)";
              if (item.userType === "parent") userTypeLabel = "অভিভাবক";

              // 🎯 মাল্টার আপলোডেড ব্যানার ইমেজ অথবা কাস্টম ইমেজকে প্রোফাইল হিসেবে দেখানোর জন্য ফলব্যাক
              const profileDisplayImage =
                item.identityImage || item.adminCustomAvatar;

              return (
                <div
                  key={item._id}
                  className={`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                    !item.isApproved
                      ? "border-l-4 border-l-amber-500"
                      : "border-l-4 border-l-emerald-600"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 overflow-hidden shrink-0">
                          {profileDisplayImage ? (
                            <img
                              src={profileDisplayImage}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3
                            className="text-xs font-black text-gray-900 truncate max-w-[120px]"
                            title={displayName}
                          >
                            {displayName}
                          </h3>
                          <p className="text-[9px] text-[#0B5D3B] font-black uppercase tracking-wide mt-0.5">
                            {userTypeLabel}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                          item.isApproved
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {item.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star
                            key={index}
                            className={`w-3.5 h-3.5 ${
                              index < item.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-black text-gray-400 uppercase">
                        {new Date(item.createdAt).toLocaleDateString("bn-BD")}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed font-medium italic bg-gray-50/40 p-3 rounded-xl border border-gray-100/50 line-clamp-4">
                      "{item.text}"
                    </p>

                    {/* 🎯 যদি বাম পাশের বড় থাম্বনেইল ব্যানার ইমেজ থাকে তবে তার ইনডিকেটর */}
                    {item.identityImage && (
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50/50 w-fit px-2 py-1 rounded-md border border-emerald-100/30 font-bold">
                        <Filter size={11} /> ব্যানার ইমেজ সংযুক্ত আছে
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        handleToggleApprove(item._id, item.isApproved)
                      }
                      disabled={actionLoading}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black transition-all shadow-xs ${
                        item.isApproved
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60 cursor-pointer"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-900/10 border border-transparent cursor-pointer"
                      }`}
                    >
                      {item.isApproved ? (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> ল্যান্ডিং থেকে
                          হাইড করুন
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />{" "}
                          পাবলিশ/অ্যাপ্রুভ করুন
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteTestimonial(item._id)}
                      disabled={actionLoading}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer rounded-xl border border-transparent hover:border-red-100 transition-all"
                      title="রিভিউ ডিলিট করুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialAdmin;
