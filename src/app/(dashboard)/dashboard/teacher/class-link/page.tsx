"use client";

import { useState, useMemo } from "react";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import useUserRole from "@/src/app/hooks/useUserRole";
import { Search, Filter, Plus, CalendarDays } from "lucide-react";

import Toast from "@/src/components/ClassLink/Toast";
import ClassLinkModal from "@/src/components/ClassLink/ClassLinkModal";
import ClassLinkCard from "@/src/components/ClassLink/ClassLinkCard";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";

interface CategoryPopulated {
  _id: string;
  name: string;
}

interface CoursePopulated {
  _id: string;
  title: string;
  category: CategoryPopulated | string;
  banner: string;
}

interface ClassLink {
  _id: string;
  classTitle: string;
  link: string;
  classDate: string;
  startTime: string;
  endTime: string;
  course: CoursePopulated;
}

export default function ClassLinkPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<ClassLink | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // 'all' | 'today' | 'upcoming' | 'past'

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const axiosSecure = useAxiosSecure();
  const { isTeacher, isLoading: isUserLoading } = useUserRole();

  const {
    data: classLinks = [],
    isLoading: isLinksLoading,
    isError,
    error,
  } = useQuery<ClassLink[]>({
    queryKey: ["class-links-teacher"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/class-links/teacher/my-links");
      return data;
    },
    enabled: isUserLoading === false && isTeacher === true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const filteredLinks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return classLinks.filter((link) => {
      const matchesSearch =
        link.classTitle.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        link.course?.title.toLowerCase().includes(searchQuery?.toLowerCase());

      const classDateObj = new Date(link.classDate);
      classDateObj.setHours(0, 0, 0, 0);

      let matchesDate = true;

      if (dateFilter === "today") {
        matchesDate = classDateObj.getTime() === today.getTime();
      } else if (dateFilter === "upcoming") {
        matchesDate = classDateObj.getTime() > today.getTime();
      } else if (dateFilter === "past") {
        matchesDate = classDateObj.getTime() < today.getTime();
      }

      return matchesSearch && matchesDate;
    });
  }, [classLinks, searchQuery, dateFilter]);

  if (isUserLoading || isTeacher === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-600">
            অথোরাইজেশন ভেরিফাই করা হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (isTeacher === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-sm text-center max-w-sm mx-4">
          <p className="text-red-500 font-bold text-base">
            🚫 অ্যাক্সেস ডিনাইড!
          </p>
          <p className="text-xs text-slate-500 mt-2">
            দুঃখিত, শুধুমাত্র রেজিস্টার্ড শিক্ষকরাই এই ড্যাশবোর্ড ম্যানেজমেন্ট
            পেজটি অ্যাক্সেস করতে পারবেন।
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ড্যাশবোর্ড স্ক্রিন রোবট থেকে হাইড রাখার জন্য */}
      <Head>
        <title>ক্লাস লিঙ্ক ম্যানেজমেন্ট | ইনস্ট্রাক্টর ড্যাশবোর্ড</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-slate-50/50">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <main className="max-w-6xl mx-auto px-4 py-10">
          {/* হেডার সেকশন */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-emerald-600 mb-1.5">
                Instructor Dashboard
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Class Link <span className="text-emerald-500">Management</span>
              </h1>
            </div>

            <button
              onClick={() => {
                setEditData(null);
                setIsModalOpen(true);
              }}
              className="bg-slate-900 text-white px-6 py-3.5 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95 shrink-0 cursor-pointer"
            >
              <Plus size={16} /> Post New Link
            </button>
          </div>

          {classLinks.length > 0 && (
            <div className="mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* সার্চ ইনপুট */}
              <div className="relative w-full sm:max-w-md">
                <Search
                  className="absolute left-4 top-3 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="ক্লাসের শিরোনাম বা কোর্স দিয়ে খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-xs md:text-sm text-slate-700 font-medium"
                />
              </div>

              <div className="relative w-full sm:w-64 flex items-center gap-2">
                <CalendarDays
                  size={16}
                  className="text-slate-400 shrink-0 hidden sm:inline"
                />
                <div className="relative w-full">
                  <Filter
                    className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none"
                    size={14}
                  />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none appearance-none text-xs md:text-sm font-bold text-slate-600 cursor-pointer"
                  >
                    <option value="all">সব ক্লাস (All Classes)</option>
                    <option value="today">আজকের ক্লাস (Today's Classes)</option>
                    <option value="upcoming">
                      আসন্ন ক্লাস (Upcoming Classes)
                    </option>
                    <option value="past">
                      গত হয়ে যাওয়া ক্লাস (Expired/Past)
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {isLinksLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <LoadingSpinner />
            </div>
          ) : isError ? (
            <div className="text-center bg-white p-6 rounded-2xl shadow-xs border border-red-100 max-w-md mx-auto">
              <p className="text-red-500 font-bold text-sm">
                ডাটা লোড করতে সমস্যা হয়েছে
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {(error as any)?.response?.data?.message ||
                  (error as any)?.message ||
                  "Error"}
              </p>
            </div>
          ) : classLinks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-2xl-zinc px-4">
              <p className="text-slate-400 font-bold text-sm md:text-base">
                এখনো কোনো ক্লাস লিঙ্ক পোস্ট করা হয়নি।
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                উপরের{" "}
                <strong className="text-slate-700">"Post New Link"</strong>{" "}
                বাটনে চাপ দিয়ে আপনার প্রথম লাইভ ক্লাসের লিঙ্কটি জেনারেট করুন।
              </p>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-2xs px-4">
              <p className="text-amber-600 font-bold text-sm">
                এই নির্দিষ্ট সময়ে কোনো ক্লাস শিডিউল পাওয়া যায়নি!
              </p>
              <p className="text-xs text-slate-400 mt-1">
                অনুগ্রহ করে অন্য কোনো টাইম ক্যাটাগরি বা ফিল্টার সিলেক্ট করে
                চেষ্টা করুন।
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((link) => (
                <ClassLinkCard
                  key={link._id}
                  linkData={link}
                  showToast={showToast}
                  onEdit={(data) => {
                    setEditData(data);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}

          {/* 🪟 অ্যাড / এডিট মডাল */}
          {isModalOpen && (
            <ClassLinkModal
              isOpen={isModalOpen}
              editData={editData}
              onClose={() => {
                setIsModalOpen(false);
                setEditData(null);
              }}
            />
          )}
        </main>
      </div>
    </>
  );
}
