"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Head from "next/head";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  ShieldCheck,
  BookOpen,
  Briefcase,
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import useUserRole from "@/src/app/hooks/useUserRole";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";

const ProfileSettings = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, role, isLoading: isUserLoading } = useUserRole();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState<boolean>(false);

  // 🌐 সাধারণ তথ্যসমূহ স্টেট
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // 🎓 রোল-ভিত্তিক তথ্যসমূহ স্টেট
  const [studentNameBn, setStudentNameBn] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [teacherNameBn, setTeacherNameBn] = useState("");
  const [designation, setDesignation] = useState("");
  const [biography, setBiography] = useState("");
  const [experience, setExperience] = useState("");

  // 🔒 পাসওয়ার্ড পরিবর্তন স্টেটসমূহ
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // 🎯 আলটিমেট ফিক্স: ডাইনামিক চেইন ভ্যালু ফলব্যাক (যদি ডাটা সরাসরি প্রোফাইলে বা সাব-প্রোফাইলে থাকে)
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setImagePreview(user.profileImage || user.profile?.profileImage || "");

      // ১. স্টুডেন্ট ডাটা প্রি-ফিল
      if (role === "student") {
        const studentData = user.profile?.profile || user.profile || user;
        setStudentNameBn(studentData.studentNameBn || "");
        setClassLevel(studentData.classLevel || "");
      }
      // ২. টিচার ডাটা প্রি-ফিল (মাল্টি-লেয়ার চেইনিং ফলব্যাক লক)
      else if (role === "teacher") {
        const teacherData = user.profile?.profile || user.profile || user;

        setTeacherNameBn(teacherData.teacherNameBn || user.teacherNameBn || "");
        setDesignation(teacherData.designation || user.designation || "");
        setBiography(teacherData.biography || user.biography || "");
        setExperience(teacherData.experience || user.experience || "");
      }
    }
  }, [user, role]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "ফাইল সাইজ বেশি!",
          text: "অনুগ্রহ করে ২ মেগাবাইটের কম সাইজের ছবি আপলোড করুন।",
        });
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 🔹 প্রোফাইল তথ্য সংরক্ষণ হ্যান্ডলার
  const handleProfileSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "নাম এবং ফোন নম্বর দেওয়া আবশ্যক",
      });
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);

      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      let profileDetails = {};
      if (role === "student") {
        profileDetails = { studentNameBn, classLevel };
      } else if (role === "teacher") {
        profileDetails = { teacherNameBn, designation, biography, experience };
      }

      formData.append("profileData", JSON.stringify(profileDetails));

      const res = await axiosSecure.put("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "প্রোফাইল আপডেট সফল!",
          text: "আপনার প্রোফাইলের তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।",
          confirmButtonColor: "#0B5D3B",
        });
        // 🎯 তানস্ট্যাক কুয়েরি ক্যাশ রিফ্রেশ
        queryClient.invalidateQueries({ queryKey: ["userRoleProfile"] });
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      Swal.fire({
        icon: "error",
        title: "আপডেট ব্যর্থ হয়েছে!",
        text:
          err.response?.data?.message ||
          "সার্ভার বা নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন।",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 পাসওয়ার্ড পরিবর্তন হ্যান্ডলার
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return Swal.fire({
        icon: "warning",
        title: "ত্রুটি",
        text: "সবগুলো পাসওয়ার্ড ফিল্ড পূরণ করুন।",
      });
    }

    if (newPassword.length < 6) {
      return Swal.fire({
        icon: "warning",
        title: "ত্রুটি",
        text: "নতুন পাসওয়ার্ডটি সর্বনিম্ন ৬ অক্ষরের হতে হবে।",
      });
    }

    if (newPassword !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "নতুন পাসওয়ার্ড দুটি মিলছে না।",
      });
    }

    setPasswordLoading(true);
    try {
      const res = await axiosSecure.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "পাসওয়ার্ড পরিবর্তিত হয়েছে!",
          text: "আপনার অ্যাকাউন্টের নিরাপত্তা পাসওয়ার্ড সফলভাবে আপডেট হয়েছে।",
          confirmButtonColor: "#0B5D3B",
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "পাসওয়ার্ড পরিবর্তন ব্যর্থ!",
        text:
          err.response?.data?.message || "আপনার বর্তমান পাসওয়ার্ডটি সঠিক নয়।",
        confirmButtonColor: "#d33",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center py-40">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>প্রোফাইল সেটিংস | ড্যাশবোর্ড</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="mt-4 pb-12 max-w-4xl mx-auto font-sans px-4 sm:px-6">
        {/* Header Title */}
        <div className="mb-6 px-1">
          <h2 className="text-xl md:text-2xl font-black text-neutral-800 flex items-center gap-2">
            প্রোফাইল সেটিংস
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 font-medium">
            আপনার ব্যক্তিগত তথ্য ও রোল-ভিত্তিক প্রোফাইল ম্যানেজ করুন
          </p>
        </div>

        {/* Settings Tabs */}
        <div className="flex gap-2 p-1 bg-neutral-100 rounded-2xl mb-8 w-full sm:w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 sm:flex-none px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "profile"
                ? "bg-white text-[#0B5D3B] shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            প্রোফাইল তথ্য
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex-1 sm:flex-none px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "security"
                ? "bg-white text-[#0B5D3B] shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            নিরাপত্তা ও পাসওয়ার্ড
          </button>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-5 md:p-8"
        >
          {activeTab === "profile" ? (
            <div className="space-y-8">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center sm:flex-row gap-6 border-b border-neutral-50 pb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-emerald-50 flex items-center justify-center overflow-hidden border-2 border-dashed border-[#0B5D3B]/30 relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="ইউজার প্রোফাইল পিকচার"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={40} className="text-[#0B5D3B]" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2 bg-[#0B5D3B] text-white rounded-xl shadow-lg border-2 border-white hover:scale-110 transition-transform cursor-pointer"
                    type="button"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-bold text-neutral-800 text-sm md:text-base">
                    প্রোফাইল ছবি
                  </h4>
                  <p className="text-[11px] md:text-xs text-neutral-500 mt-1">
                    JPG, JPEG অথবা PNG। সর্বোচ্চ ২ মেগাবাইট।
                  </p>
                </div>
              </div>

              {/* 🌐 সাধারণ তথ্যসমূহ */}
              <div>
                <h4 className="text-xs font-black text-[#0B5D3B] uppercase tracking-wider mb-4 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#0B5D3B] rounded-full inline-block" />{" "}
                  সাধারণ তথ্যসমূহ
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-600 uppercase ml-1">
                      পুরো নাম
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-3.5 text-neutral-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] outline-none transition-all font-medium text-xs md:text-sm text-neutral-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-600 uppercase ml-1">
                      ইমেইল ঠিকানা
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-3.5 text-neutral-400"
                        size={18}
                      />
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full pl-12 pr-4 py-3.5 bg-neutral-100 border border-neutral-200 rounded-2xl cursor-not-allowed outline-none font-medium text-xs md:text-sm text-neutral-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-neutral-600 uppercase ml-1">
                      ফোন নম্বর
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-3.5 text-neutral-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] outline-none transition-all font-medium text-xs md:text-sm text-neutral-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 👨‍🎓 স্টুডেন্ট ফিল্ডস */}
              {role === "student" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-4 border-t border-neutral-100"
                >
                  <h4 className="text-xs font-black text-amber-700 uppercase tracking-wider mb-4 flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-amber-600" />{" "}
                    স্টুডেন্ট প্রোফাইল তথ্য
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-600 uppercase ml-1">
                        শিক্ষार्थियों নাম (বাংলায়)
                      </label>
                      <input
                        type="text"
                        value={studentNameBn}
                        onChange={(e) => setStudentNameBn(e.target.value)}
                        placeholder="বাংলায় আপনার নাম"
                        className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] outline-none transition-all text-xs md:text-sm text-neutral-800 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-600 uppercase ml-1">
                        শ্রেণী/ক্লাস (Class Level)
                      </label>
                      <input
                        type="text"
                        value={classLevel}
                        onChange={(e) => setClassLevel(e.target.value)}
                        placeholder="উদাঃ Class 10"
                        className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] outline-none transition-all text-xs md:text-sm text-neutral-800 font-medium"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 👨‍🏫 টিচার ফিল্ডস */}
              {role === "teacher" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-4 border-t border-neutral-100"
                >
                  <h4 className="text-xs font-black text-blue-700 uppercase tracking-wider mb-4 flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-blue-600" /> শিক্ষক
                    প্রোফাইল তথ্য
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-600 uppercase ml-1">
                        শিক্ষকের নাম (বাংলায়)
                      </label>
                      <input
                        type="text"
                        value={teacherNameBn}
                        onChange={(e) => setTeacherNameBn(e.target.value)}
                        placeholder="উদাঃ আরিফুল ইসলাম"
                        className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] outline-none transition-all text-xs md:text-sm text-neutral-800 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-600 uppercase ml-1">
                        পদবী
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="উদাঃ Lecturer"
                        className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] outline-none transition-all text-xs md:text-sm text-neutral-800 font-medium"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-neutral-600 uppercase ml-1 flex items-center gap-1">
                        শিক্ষক বায়োগ্রাফি
                      </label>
                      <textarea
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                        placeholder="আপনার সংক্ষিপ্ত পরিচিতি এবং ইসলামি শিক্ষার পটভূমি এখানে লিখুন..."
                        rows={4}
                        className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] outline-none transition-all text-xs md:text-sm text-neutral-800 font-medium resize-none leading-relaxed"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-neutral-600 uppercase ml-1">
                        শিক্ষাদান অভিজ্ঞতা
                      </label>
                      <textarea
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="আপনার পূর্বের শিক্ষকতার অভিজ্ঞতা বা অর্জিত খিদমতের বিবরণ লিখুন..."
                        rows={3}
                        className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] outline-none transition-all text-xs md:text-sm text-neutral-800 font-medium resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* প্রোফাইল বাটন অ্যাকশন জোন */}
              <div className="mt-10 pt-6 border-t border-neutral-50 flex justify-end">
                <button
                  onClick={handleProfileSubmit}
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0B5D3B] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-green-900/20 active:scale-95 hover:bg-[#0d4d2e] transition-all disabled:bg-neutral-300 disabled:cursor-not-allowed text-sm cursor-pointer"
                  type="button"
                >
                  <Save size={18} />{" "}
                  {loading ? "সংরক্ষণ করা হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
              </div>
            </div>
          ) : (
            /* নিরাপত্তা ও পাসওয়ার্ড ফর্ম সেকশন */
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="p-4 bg-emerald-50/60 border border-emerald-100/50 rounded-2xl flex gap-4 items-start mb-2">
                <ShieldCheck
                  className="text-emerald-700 shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <h5 className="font-bold text-emerald-900 text-sm">
                    নিরাপত্তা গাইডলাইন
                  </h5>
                  <p className="text-xs text-emerald-800/80 mt-0.5 leading-relaxed">
                    আপনার অ্যাকাউন্টের সুরক্ষার জন্য বর্তমান সঠিক পাসওয়ার্ডটি
                    দিয়ে নতুন একটি শক্তিশালী পাসওয়ার্ড (সর্বনিম্ন ৬ অক্ষর)
                    টাইপ করুন।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-600 uppercase ml-1">
                    বর্তমান পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-3.5 text-neutral-400"
                      size={16}
                    />
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-11 pr-10 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] outline-none transition-all font-medium text-sm text-neutral-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                    >
                      {showOldPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-600 uppercase ml-1">
                    নতুন পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-3.5 text-neutral-400"
                      size={16}
                    />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-11 pr-10 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] outline-none transition-all font-medium text-sm text-neutral-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                    >
                      {showNewPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-600 uppercase ml-1">
                    নতুন পাসওয়ার্ড নিশ্চিত করুন
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-3.5 text-neutral-400"
                      size={16}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-11 pr-10 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] outline-none transition-all font-medium text-sm text-neutral-800"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-neutral-50 flex justify-end">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-slate-900/10 active:scale-95 hover:bg-slate-800 transition-all disabled:bg-neutral-300 disabled:cursor-not-allowed text-sm cursor-pointer"
                >
                  {passwordLoading ? "রিসেট হচ্ছে..." : "পাসওয়ার্ড রিসেট করুন"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ProfileSettings;
