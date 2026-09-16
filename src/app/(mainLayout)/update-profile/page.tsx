"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "../../hooks/useUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  Loader2,
  Camera,
  User,
  Phone,
  Book,
  Briefcase,
  CheckCircle2,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";

interface ProfileFormInput {
  name: string;
  phone: string;
  studentNameBn?: string;
  classLevel?: string;
  designation?: string;
  department?: string;
}

// 🎯 পাসওয়ার্ড ফর্মের টাইপ ইন্টারফেস
interface PasswordFormInput {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ProfilePage = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useUser();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // 🎯 পাসওয়ার্ড ভিজিবিলিটি স্টেটসমূহ
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔹 ১. প্রোফাইল ফর্মের জন্য React Hook Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormInput>();

  // 🔹 ২. পাসওয়ার্ড পরিবর্তনের জন্য আলাদা React Hook Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormInput>();

  const newPasswordValue = watchPassword("newPassword");

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user?.name || "",
        phone: user?.phone || "",
        studentNameBn:
          user?.profile?.studentNameBn || user?.studentNameBn || "",
        classLevel: user?.profile?.classLevel || user?.classLevel || "",
        designation: user?.profile?.designation || "",
        department:
          user?.profile?.department?._id || user?.profile?.department || "",
      });
      if (user?.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [user, resetProfile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 🔹 ৩. প্রোফাইল আপডেট মিউটেশন
  const updateProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axiosSecure.put("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title:
          "<span style='font-family: inherit; font-weight: 900; color: #0B5D3B;'>সফল হয়েছে!</span>",
        html: "<p style='font-family: inherit; font-size: 14px; color: #4b5563;'>আপনার প্রোফাইল সফলভাবে আপডেট হয়েছে! 🎉</p>",
        background: "#ffffff",
        confirmButtonColor: "#0B5D3B",
        confirmButtonText: "ঠিক আছে",
        customClass: {
          popup:
            "rounded-[24px] shadow-[0_20px_50px_rgba(16,93,56,0.1)] border border-neutral-100",
          confirmButton:
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "আপডেট করতে সমস্যা হয়েছে।";
      Swal.fire({
        icon: "error",
        title:
          "<span style='font-family: inherit; font-weight: 900; color: #dc2626;'>দুঃখিত!</span>",
        html: `<p style='font-family: inherit; font-size: 14px; color: #4b5563;'>${errorMessage}</p>`,
        background: "#ffffff",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "আবার চেষ্টা করুন",
        customClass: {
          popup:
            "rounded-[24px] shadow-[0_20px_50px_rgba(220,38,38,0.08)] border border-neutral-100",
          confirmButton:
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer",
        },
      });
    },
  });

  // 🔹 ৪. পাসওয়ার্ড পরিবর্তন মিউটেশন (নতুন ব্যাকএন্ড এপিআই অনুযায়ী সচল)
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData: PasswordFormInput) => {
      const res = await axiosSecure.put("/auth/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title:
          "<span style='font-family: inherit; font-weight: 900; color: #0B5D3B;'>পাসওয়ার্ড পরিবর্তিত হয়েছে!</span>",
        html: "<p style='font-family: inherit; font-size: 14px; color: #4b5563;'>আপনার অ্যাকাউন্টের নিরাপত্তা পাসওয়ার্ড সফলভাবে আপডেট হয়েছে।</p>",
        background: "#ffffff",
        confirmButtonColor: "#0B5D3B",
        confirmButtonText: "ঠিক আছে",
        customClass: {
          popup:
            "rounded-[24px] shadow-[0_20px_50px_rgba(16,93,56,0.1)] border border-neutral-100",
          confirmButton:
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer",
        },
      });
      resetPassword(); // ফর্মের ফিল্ডগুলো ফ্লাশ করা হলো
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "পাসওয়ার্ড পরিবর্তন করা সম্ভব হয়নি।";
      Swal.fire({
        icon: "error",
        title:
          "<span style='font-family: inherit; font-weight: 900; color: #dc2626;'>ভুল হয়েছে!</span>",
        html: `<p style='font-family: inherit; font-size: 14px; color: #4b5563;'>${errorMessage}</p>`,
        background: "#ffffff",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "আবার চেষ্টা করুন",
        customClass: {
          popup:
            "rounded-[24px] shadow-[0_20px_50px_rgba(220,38,38,0.08)] border border-neutral-100",
          confirmButton:
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer",
        },
      });
    },
  });

  const onProfileSubmit = (data: ProfileFormInput) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);

    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    let profileDetails = {};
    if (user?.role === "student") {
      profileDetails = {
        studentNameBn: data.studentNameBn,
        classLevel: data.classLevel,
      };
    } else if (user?.role === "teacher") {
      profileDetails = {
        designation: data.designation,
        department: data.department,
      };
    }

    formData.append("profileData", JSON.stringify(profileDetails));
    updateProfileMutation.mutate(formData);
  };

  const onPasswordSubmit = (data: PasswordFormInput) => {
    changePasswordMutation.mutate(data);
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F5]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-start">
          <Link
            href="/student-profile"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 bg-white/80 backdrop-blur-md px-4 py-2 border border-neutral-200/60 rounded-full shadow-sm hover:text-[#0B5D3B] hover:border-[#0B5D3B]/30 transition-all active:scale-95"
          >
            <ArrowLeft size={14} /> ফিরে যান
          </Link>
        </div>

        {/* 🔹 মেইন প্রোফাইল ইনফরমেশন কার্ড */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(16,93,56,0.05)] border border-neutral-100 overflow-hidden">
          <div className="bg-[#0B5D3B] p-8 lg:p-10 text-white text-center relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />

            <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
              আমার প্রোফাইল
            </h2>
            <p className="text-white/75 text-xs lg:text-sm mt-1.5 font-medium max-w-md mx-auto">
              আপনার ব্যক্তিগত তথ্য দেখুন এবং প্রয়োজন অনুযায়ী আপডেট করুন
            </p>

            <span className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {user?.role === "teacher" ? "শিক্ষক" : "শিক্ষার্থী"}
            </span>
          </div>

          <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="p-6 lg:p-10 space-y-8"
          >
            <div className="flex flex-col items-center justify-center group">
              <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-3xl overflow-hidden shadow-md border-4 border-white ring-4 ring-[#0B5D3B]/5 transition-transform duration-300 group-hover:scale-105">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                    <User size={44} />
                  </div>
                )}

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 inset-x-0 bg-neutral-900/80 backdrop-blur-sm text-white text-[10px] font-bold py-2 flex items-center justify-center gap-1 cursor-pointer opacity-90 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"
                >
                  <Camera size={12} /> পরিবর্তন করুন
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-neutral-400 text-[10px] mt-2.5 font-medium">
                JPG, PNG বা WEBP (সর্বোচ্চ ২ মেগাবাইট)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <User size={14} className="text-[#0B5D3B]" /> নাম (ইংরেজি)
                </label>
                <input
                  type="text"
                  {...registerProfile("name", {
                    required: "নাম দেওয়া আবশ্যক",
                  })}
                  className={`w-full px-4 py-3 bg-neutral-50/50 border rounded-xl text-sm font-medium transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0B5D3B]/5 focus:border-[#0B5D3B] ${
                    profileErrors.name
                      ? "border-red-500 bg-red-50/10"
                      : "border-neutral-200"
                  }`}
                  placeholder="যেমন: Ariful Islam"
                />
                {profileErrors.name && (
                  <p className="text-red-500 text-xs font-medium pl-1">
                    {profileErrors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <Phone size={14} className="text-[#0B5D3B]" /> ফোন নম্বর
                </label>
                <input
                  type="text"
                  {...registerProfile("phone", {
                    required: "ফোন নম্বর দেওয়া আবশ্যক",
                  })}
                  className={`w-full px-4 py-3 bg-neutral-50/50 border rounded-xl text-sm font-medium transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0B5D3B]/5 focus:border-[#0B5D3B] ${
                    profileErrors.phone
                      ? "border-red-500 bg-red-50/10"
                      : "border-neutral-200"
                  }`}
                  placeholder="যেমন: 01899999999"
                />
                {profileErrors.phone && (
                  <p className="text-red-500 text-xs font-medium pl-1">
                    {profileErrors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
                  <Mail size={14} /> ইমেইল এড্রেস (পরিবর্তনযোগ্য নয়)
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200/60 rounded-xl text-sm font-medium text-neutral-400 cursor-not-allowed select-none"
                />
              </div>

              {user?.role === "student" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <Book size={14} className="text-[#0B5D3B]" /> নাম
                      (বাংলায়)
                    </label>
                    <input
                      type="text"
                      {...registerProfile("studentNameBn")}
                      className="w-full px-4 py-3 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm font-medium transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0B5D3B]/5 focus:border-[#0B5D3B]"
                      placeholder="যেমন: আরিফুল ইসলাম"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <Book size={14} className="text-[#0B5D3B]" /> ক্লাস লেভেল
                      / বিভাগ
                    </label>
                    <input
                      type="text"
                      {...registerProfile("classLevel")}
                      className="w-full px-4 py-3 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm font-medium transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0B5D3B]/5 focus:border-[#0B5D3B]"
                      placeholder="যেমন: Class 10 / Level 3"
                    />
                  </div>
                </>
              )}

              {user?.role === "teacher" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <Briefcase size={14} className="text-[#0B5D3B]" /> পদবী
                      (Designation)
                    </label>
                    <input
                      type="text"
                      {...registerProfile("designation")}
                      className="w-full px-4 py-3 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm font-medium transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0B5D3B]/5 focus:border-[#0B5D3B]"
                      placeholder="যেমন: Senior Lecturer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <Briefcase size={14} className="text-[#0B5D3B]" />{" "}
                      ডিপার্টমেন্ট আইডি
                    </label>
                    <input
                      type="text"
                      {...registerProfile("department")}
                      className="w-full px-4 py-3 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm font-medium transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0B5D3B]/5 focus:border-[#0B5D3B]"
                      placeholder="যেমন: CATEGORY_ID"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="pt-5 border-t border-neutral-100 flex justify-end">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#0B5D3B] text-white rounded-xl text-sm font-bold shadow-[0_10px_20px_rgba(16,93,56,0.15)] hover:bg-[#0d4b2d] hover:shadow-[0_10px_25px_rgba(16,93,56,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed select-none cursor-pointer"
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    প্রোফাইল আপডেট করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 🎯 🔹 ৫. নতুন সিকিউর পাসওয়ার্ড পরিবর্তন সেকশন (Premium UI Matching) */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(16,93,56,0.05)] border border-neutral-100 overflow-hidden">
          <div className="p-6 lg:p-10 border-b border-neutral-100 flex items-center gap-3 bg-neutral-50/50">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-3xs border border-amber-100/50">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-800 tracking-tight">
                পাসওয়ার্ড পরিবর্তন করুন
              </h3>
              <p className="text-neutral-400 text-[11px] font-medium mt-0.5">
                অ্যাকাউন্টের সুরক্ষার জন্য শক্তিশালী বা নতুন জটিল পাসওয়ার্ড সেট
                করুন
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="p-6 lg:p-10 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* বর্তমান পাসওয়ার্ড */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  বর্তমান পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    {...registerPassword("oldPassword", {
                      required: "বর্তমান পাসওয়ার্ড প্রদান করুন",
                    })}
                    className={`w-full pl-4 pr-10 py-3 bg-neutral-50/50 border rounded-xl text-sm font-medium transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0B5D3B]/5 focus:border-[#0B5D3B] ${
                      passwordErrors.oldPassword
                        ? "border-red-500 bg-red-50/10"
                        : "border-neutral-200"
                    }`}
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordErrors.oldPassword && (
                  <p className="text-red-500 text-xs font-medium pl-1">
                    {passwordErrors.oldPassword.message}
                  </p>
                )}
              </div>

              {/* নতুন পাসওয়ার্ড */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  নতুন পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    {...registerPassword("newPassword", {
                      required: "নতুন পাসওয়ার্ড প্রদান করুন",
                      minLength: {
                        value: 6,
                        message: "পাসওয়ার্ড সর্বনিম্ন ৬ অক্ষরের হতে হবে",
                      },
                    })}
                    className={`w-full pl-4 pr-10 py-3 bg-neutral-50/50 border rounded-xl text-sm font-medium transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0B5D3B]/5 focus:border-[#0B5D3B] ${
                      passwordErrors.newPassword
                        ? "border-red-500 bg-red-50/10"
                        : "border-neutral-200"
                    }`}
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-xs font-medium pl-1">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              {/* নতুন পাসওয়ার্ড নিশ্চিতকরণ */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  নতুন পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...registerPassword("confirmPassword", {
                      required: "নতুন পাসওয়ার্ডটি পুনরায় টাইপ করুন",
                      validate: (val) =>
                        val === newPasswordValue ||
                        "নতুন পাসওয়ার্ড দুটি মিলেনি",
                    })}
                    className={`w-full pl-4 pr-10 py-3 bg-neutral-50/50 border rounded-xl text-sm font-medium transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0B5D3B]/5 focus:border-[#0B5D3B] ${
                      passwordErrors.confirmPassword
                        ? "border-red-500 bg-red-50/10"
                        : "border-neutral-200"
                    }`}
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-xs font-medium pl-1">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end">
              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-black shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed select-none cursor-pointer"
              >
                {changePasswordMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Lock size={14} />
                    পাসওয়ার্ড রিসেট করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;