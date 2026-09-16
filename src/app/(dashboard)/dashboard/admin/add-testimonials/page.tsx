"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Star,
  Loader2,
  ArrowLeft,
  Send,
  ShieldAlert,
  User,
  Image as ImageIcon,
  Users,
} from "lucide-react";
import Swal from "sweetalert2";

import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import useUserRole from "@/src/app/hooks/useUserRole";

export default function CreateTestimonialPage() {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const { isStudent, isAdmin, isLoading: isRoleLoading } = useUserRole();

  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [userType, setUserType] = useState("student");
  const [customName, setCustomName] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      Swal.fire({
        title: "দুঃখিত!",
        text: "মতামতের ঘরটি খালি রাখা যাবে না।",
        icon: "warning",
        confirmButtonColor: "#105D38",
        customClass: { popup: "rounded-[2rem] font-sans" },
      });
      return;
    }

    if (isAdmin && !customName.trim()) {
      Swal.fire({
        title: "দুঃখিত!",
        text: "মতামতদাতার নামটি দেওয়া বাধ্যতামূলক ভাই।",
        icon: "warning",
        confirmButtonColor: "#105D38",
        customClass: { popup: "rounded-[2rem] font-sans" },
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("text", text);
      formData.append("rating", rating.toString());
      formData.append("userType", userType);

      if (isAdmin) {
        formData.append("reviewerName", customName);
      }

      if (userType === "student") {
        const form = e.currentTarget as HTMLFormElement;
        const courseInput = form.elements.namedItem(
          "courseName",
        ) as HTMLInputElement;
        const batchInput = form.elements.namedItem(
          "batchName",
        ) as HTMLInputElement;

        formData.append("courseName", courseInput?.value || "");
        formData.append("batchName", batchInput?.value || "");
      }

      if (selectedImage) {
        formData.append("identityImage", selectedImage);
      }

      const res = await axiosSecure.post("/testimonials", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          title: "মাশাআল্লাহ্!",
          text: "টেস্টিমোনিয়ালটি সফলভাবে সাবমিট করা হয়েছে।",
          icon: "success",
          confirmButtonColor: "#105D38",
          confirmButtonText: "ঠিক আছে",
          customClass: { popup: "rounded-[2rem] font-sans" },
        }).then(() => {
          router.push(
            isAdmin
              ? "/dashboard/admin/testimonial"
              : "/dashboard/student/testimonial",
          );
        });
      }
    } catch (error: any) {
      console.error("Submission Error:", error);
      const serverMessage =
        error.response?.data?.message ||
        "সার্ভারে কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।";

      Swal.fire({
        title: "এরর এসেছে!",
        text: serverMessage,
        icon: "error",
        confirmButtonColor: "#d33",
        customClass: { popup: "rounded-[2rem] font-sans" },
      });
    } finally {
      setLoading(false);
    }
  };

  if (isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50/50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#105D38]" />
          <p className="text-xs font-bold text-neutral-500 font-sans">
            ইউজার সেশন যাচাই করা হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin && !isStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50/50 px-4 font-sans">
        <div className="max-w-md w-full bg-white border border-neutral-200 p-8 rounded-[2rem] text-center shadow-xs">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-black text-neutral-900">
            অ্যাক্সেস অনুমোদিত নয়
          </h2>
          <p className="text-xs text-neutral-500 font-medium mt-1 leading-relaxed">
            রিভিউ বা টেস্টিমোনিয়াল পোস্ট করার জন্য আপনাকে অবশ্যই আপনার
            স্টুডেন্ট বা অ্যাডমিন অ্যাকাউন্ট দিয়ে লগইন করতে হবে।
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-5 px-6 py-2.5 bg-[#105D38] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#0c4a2d] transition-colors"
          >
            লগইন পেজে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50/50 pt-24 pb-12 md:pt-28 font-sans">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-neutral-500 hover:text-[#105D38] transition-colors cursor-pointer group mb-4"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />{" "}
            ফিরে যান
          </button>

          <h1 className="text-2xl md:text-3xl font-black text-neutral-950 tracking-tight flex items-center gap-2">
            <MessageSquare className="text-[#105D38] w-7 h-7" /> নতুন
            টেস্টিমোনিয়াল যোগ করুন
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 font-medium mt-1">
            {isAdmin
              ? "অ্যাডমিন প্যানেল থেকে কাস্টম ইউজার ক্যাটাগরি অনুযায়ী রিভিউ ইনপুট দিন।"
              : "মাদরাসা সম্পর্কে আপনার মূল্যবান অনুভূতি শেয়ার করুন।"}
          </p>
        </div>

        {/* Post Form Card */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-neutral-200/60 rounded-[2.5rem] p-6 md:p-8 shadow-xs"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <label className="block text-xs md:text-sm font-black text-neutral-800 uppercase mb-2 flex items-center gap-1.5">
                  <User size={15} className="text-[#105D38]" /> মতামতদাতার নাম
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="যেমন: শায়খ আব্দুল আউয়াল হাফি বা মোঃ আব্দুর রহমান"
                  className="w-full border border-neutral-200 bg-neutral-50/40 rounded-2xl p-4 text-xs md:text-sm focus:outline-none focus:border-[#105D38] focus:bg-white transition-all text-neutral-800 font-bold"
                />
              </motion.div>
            )}

            <div>
              <label className="block text-xs md:text-sm font-black text-neutral-800 uppercase mb-2 flex items-center gap-1.5">
                <Users size={15} className="text-[#105D38]" /> মতামতদাতার ধরণ
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full border border-neutral-200 bg-neutral-50/40 rounded-2xl p-4 text-xs md:text-sm focus:outline-none focus:border-[#105D38] focus:bg-white transition-all text-neutral-800 font-bold cursor-pointer"
              >
                <option value="student">শিক্ষার্থী (Student)</option>
                <option value="teacher">শিক্ষক / ওস্তাদ (Teacher)</option>
                <option value="female_teacher">
                  শিক্ষিকা / ওস্তাদা (Female Teacher)
                </option>
                <option value="parent">অভিভাবক (Parent)</option>
              </select>
            </div>

            {userType === "student" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-xs md:text-sm font-black text-neutral-800 uppercase mb-2">
                    কোর্সের নাম
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    placeholder="যেমন: আরবি ভাষা শিক্ষা"
                    className="w-full border border-neutral-200 bg-neutral-50/40 rounded-2xl p-4 text-xs md:text-sm focus:outline-none focus:border-[#105D38] focus:bg-white transition-all text-neutral-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-black text-neutral-800 uppercase mb-2">
                    ব্যাচ নাম
                  </label>
                  <input
                    type="text"
                    name="batchName"
                    placeholder="যেমন: ব্যাচ-০৩"
                    className="w-full border border-neutral-200 bg-neutral-50/40 rounded-2xl p-4 text-xs md:text-sm focus:outline-none focus:border-[#105D38] focus:bg-white transition-all text-neutral-800 font-bold"
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-xs md:text-sm font-black text-neutral-800 uppercase mb-2">
                রেটিং সিলেক্ট করুন
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-amber-400 p-0.5 transition-transform active:scale-90 cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 md:w-8 md:h-8 ${
                        star <= rating ? "fill-current" : "text-neutral-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-black text-neutral-800 uppercase mb-2">
                আপনার মূল্যবান বক্তব্য / মতামত
              </label>
              <textarea
                required
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="মাদরাসা বা কোর্স সম্পর্কিত মতামতটি এখানে গুছিয়ে লিখুন..."
                className="w-full border border-neutral-200 bg-neutral-50/40 rounded-2xl p-4 text-xs md:text-sm focus:outline-none focus:border-[#105D38] focus:bg-white transition-all text-neutral-800 font-medium leading-relaxed resize-none"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-black text-neutral-800 uppercase mb-2 flex items-center gap-1.5">
                <ImageIcon size={15} className="text-[#105D38]" /> প্রোফাইল ছবি
                আপলোড (ঐচ্ছিক)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-neutral-200 hover:border-[#105D38] bg-neutral-50/40 px-4 py-3 rounded-2xl text-xs font-bold text-neutral-600 cursor-pointer transition-colors active:scale-98">
                  <ImageIcon size={16} /> ছবি নির্বাচন করুন
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-12 h-12 rounded-xl border border-neutral-200 overflow-hidden shadow-3xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#105D38] hover:bg-[#0c4a2d] disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-xs md:text-sm shadow-lg shadow-emerald-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> সাবমিট হচ্ছে...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> রিভিউ পোস্ট করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.section>
      </div>
    </main>
  );
}
