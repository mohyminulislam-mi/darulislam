"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  PlusCircle,
  Trophy,
  Award as AwardIcon,
  Users,
  GraduationCap,
  Calendar,
  Building2,
  CheckCircle2,
  Send,
  Milestone,
} from "lucide-react";

// Types
type StatInputs = {
  title: string;
  value: string;
  iconName: string;
  description: string;
};

type MilestoneInputs = {
  year: string;
  title: string;
  description: string;
};

type AwardInputs = {
  title: string;
  issuer: string;
  year: string;
  details: string;
};

export default function AdminAchievementDashboard() {
  const [activeTab, setActiveTab] = useState<"stats" | "milestones" | "awards">(
    "stats",
  );
  const [successMsg, setSuccessMsg] = useState("");

  // Forms Setup
  const statForm = useForm<StatInputs>();
  const milestoneForm = useForm<MilestoneInputs>();
  const awardForm = useForm<AwardInputs>();

  // Handlers
  const onStatSubmit: SubmitHandler<StatInputs> = (data) => {
    console.log("Pushing New Stat to DB:", data);
    // TODO: আপনার API Call (e.g., fetch('/api/achievements/stats', { method: 'POST', body: JSON.stringify(data) }))
    showSuccess("নতুন পরিসংখ্যান সফলভাবে যুক্ত করা হয়েছে!");
    statForm.reset();
  };

  const onMilestoneSubmit: SubmitHandler<MilestoneInputs> = (data) => {
    console.log("Pushing New Milestone to DB:", data);
    // TODO: API Call
    showSuccess("নতুন মাইলফলক সফলভাবে যুক্ত করা হয়েছে!");
    milestoneForm.reset();
  };

  const onAwardSubmit: SubmitHandler<AwardInputs> = (data) => {
    console.log("Pushing New Award to DB:", data);
    // TODO: API Call
    showSuccess("নতুন অ্যাওয়ার্ড/পুরস্কার সফলভাবে যুক্ত করা হয়েছে!");
    awardForm.reset();
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <section className="min-h-screen bg-[#F7FBF7] p-4 sm:p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* হেডার */}
        <div className="bg-white p-6 rounded-3xl border border-[#0B3D2E]/10 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-black text-[#0B3D2E] uppercase tracking-wider bg-[#8FE3A9]/20 px-3 py-1 rounded-md">
              এডমিন ড্যাশবোর্ড
            </span>
            <h1 className="text-2xl font-black text-[#0B3D2E] mt-1">
              "আমাদের অর্জন" ডাটা ম্যানেজার
            </h1>
          </div>

          {/* ট্যাব সিলেক্টর */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "stats"
                  ? "bg-[#0B3D2E] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              পরিসংখ্যান
            </button>
            <button
              onClick={() => setActiveTab("milestones")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "milestones"
                  ? "bg-[#0B3D2E] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              মাইলফলক
            </button>
            <button
              onClick={() => setActiveTab("awards")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "awards"
                  ? "bg-[#0B3D2E] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              পুরস্কার/অ্যাওয়ার্ড
            </button>
          </div>
        </div>

        {/* সাকসেস মেসেজ অ্যালার্ট */}
        {successMsg && (
          <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-2xl font-bold text-sm flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-700" /> {successMsg}
          </div>
        )}

        {/* ১. পরিসংখ্যান ফর্ম (Stats Form) */}
        {activeTab === "stats" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3D2E]/10 shadow-sm space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-black text-[#0B3D2E] flex items-center gap-2">
                <Users size={20} /> নতুন পরিসংখ্যান কার্ড যুক্ত করুন
              </h2>
            </div>

            <form
              onSubmit={statForm.handleSubmit(onStatSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* টাইটেল */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    টাইটেল / শিরোনাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...statForm.register("title", {
                      required: "শিরোনাম দেওয়া বাধ্যতামূলক",
                    })}
                    placeholder="যেমন: মোট শিক্ষার্থী"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                  {statForm.formState.errors.title && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {statForm.formState.errors.title.message}
                    </p>
                  )}
                </div>

                {/* ভ্যালু */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    সংখ্যা / ভ্যালু <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...statForm.register("value", {
                      required: "সংখ্যা দেওয়া বাধ্যতামূলক",
                    })}
                    placeholder="যেমন: ৫,০০০+"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                  {statForm.formState.errors.value && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {statForm.formState.errors.value.message}
                    </p>
                  )}
                </div>

                {/* আইকন সিলেক্টর */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    আইকন নির্বাচন করুন
                  </label>
                  <select
                    {...statForm.register("iconName")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  >
                    <option value="Users">Users (শিক্ষার্থী/মানুষ)</option>
                    <option value="GraduationCap">
                      GraduationCap (ক্বারী/গ্র্যাজুয়েট)
                    </option>
                    <option value="Trophy">Trophy (পুরস্কার)</option>
                    <option value="Award">Award (সম্মাননা)</option>
                  </select>
                </div>

                {/* বিবরণ */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    সংক্ষিপ্ত বিবরণ
                  </label>
                  <input
                    {...statForm.register("description")}
                    placeholder="যেমন: সাফল্যের সাথে দ্বীনি ও আধুনিক শিক্ষায় যুক্ত"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0B3D2E] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-900 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send size={16} /> ডাটাবেজে সাবমিট করুন
              </button>
            </form>
          </div>
        )}

        {/* ২. মাইলফলক ফর্ম (Milestone Form) */}
        {activeTab === "milestones" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3D2E]/10 shadow-sm space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-black text-[#0B3D2E] flex items-center gap-2">
                <Milestone size={20} /> নতুন মাইলফলক যুক্ত করুন
              </h2>
            </div>

            <form
              onSubmit={milestoneForm.handleSubmit(onMilestoneSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* সাল */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    সাল / বছর <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...milestoneForm.register("year", {
                      required: "সাল দেওয়া বাধ্যতামূলক",
                    })}
                    placeholder="যেমন: ২০২৬"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                  {milestoneForm.formState.errors.year && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {milestoneForm.formState.errors.year.message}
                    </p>
                  )}
                </div>

                {/* টাইটেল */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    মাইলফলকের শিরোনাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...milestoneForm.register("title", {
                      required: "শিরোনাম দেওয়া বাধ্যতামূলক",
                    })}
                    placeholder="যেমন: জাতীয় হিফজ অ্যাওয়ার্ড অর্জন"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                  {milestoneForm.formState.errors.title && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {milestoneForm.formState.errors.title.message}
                    </p>
                  )}
                </div>

                {/* বিবরণ */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    বিস্তারিত বিবরণ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    {...milestoneForm.register("description", {
                      required: "বিবরণ দেওয়া বাধ্যতামূলক",
                    })}
                    placeholder="এই বছরে অর্জিত বিশেষ সাফল্য বা মাইলফলকের বিবরণ দিন..."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                  {milestoneForm.formState.errors.description && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {milestoneForm.formState.errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0B3D2E] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-900 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send size={16} /> মাইলফলক যুক্ত করুন
              </button>
            </form>
          </div>
        )}

        {/* ৩. পুরস্কার ও অ্যাওয়ার্ড ফর্ম (Award Form) */}
        {activeTab === "awards" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B3D2E]/10 shadow-sm space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-black text-[#0B3D2E] flex items-center gap-2">
                <Trophy size={20} /> নতুন অ্যাওয়ার্ড / সম্মাননা যুক্ত করুন
              </h2>
            </div>

            <form
              onSubmit={awardForm.handleSubmit(onAwardSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* অ্যাওয়ার্ড টাইটেল */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    অ্যাওয়ার্ডের নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...awardForm.register("title", {
                      required: "অ্যাওয়ার্ডের নাম আবশ্যক",
                    })}
                    placeholder="যেমন: সেরা শিক্ষাপ্রতিষ্ঠান সম্মাননা"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                  {awardForm.formState.errors.title && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {awardForm.formState.errors.title.message}
                    </p>
                  )}
                </div>

                {/* প্রদানকারী সংস্থা */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    প্রদানকারী সংস্থা (Issuer){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...awardForm.register("issuer", {
                      required: "প্রদানকারী সংস্থার নাম আবশ্যক",
                    })}
                    placeholder="যেমন: জাতীয় ইসলামিক শিক্ষা বোর্ড"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                  {awardForm.formState.errors.issuer && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {awardForm.formState.errors.issuer.message}
                    </p>
                  )}
                </div>

                {/* বছর */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    অর্জনের বছর <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...awardForm.register("year", { required: "বছর আবশ্যক" })}
                    placeholder="যেমন: ২০২৬"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                  {awardForm.formState.errors.year && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {awardForm.formState.errors.year.message}
                    </p>
                  )}
                </div>

                {/* বিস্তারিত */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    পুরস্কার প্রাপ্তির সংক্ষিপ্ত কারণ / নোট
                  </label>
                  <textarea
                    rows={3}
                    {...awardForm.register("details")}
                    placeholder="গুণগত দ্বীনি শিক্ষা ও সুশৃঙ্খল পরিবেশের জন্য এই শ্রেষ্ঠ সম্মাননা অর্জিত হয়..."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0B3D2E] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0B3D2E] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-900 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send size={16} /> অ্যাওয়ার্ড ডাটা পুশ করুন
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
