"use client";

import { useForm } from "react-hook-form";
import { User, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import { UnifiedRegistrationForm } from "@/src/components/register/UnifiedRegistrationForm";
import Swal from "sweetalert2";
import React, { useState, useRef } from "react";

export default function AddStudentPage() {
  const axiosSecure = useAxiosSecure();

  // 🎯 ছবি এবং ফাইল ইনপুটের জন্য লোকাল স্টেট ও রেফারেন্স
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "student",
    },
  });

  // 🎯 ছবি আপলোড হ্যান্ডলার মেথডসমূহ
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🎯 মোবাইল নম্বর ভ্যালিডেশন রুল
  const validatePhone = (value: string) => {
    const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    return (
      phoneRegex.test(value) ||
      "সঠিক বাংলাদেশী মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)"
    );
  };

  // 🎯 ক্যাটাগরি/বিভাগ ডাটা ফেচিং
  const { data: departments = [], isLoading: isDeptLoading } = useQuery<any[]>({
    queryKey: ["admin-fetch-departments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data?.data || res.data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  // 🎯 ইউজার ক্রিয়েশন মিউটেশন
  const { mutate: addNewUser, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axiosSecure.post("/auth/admin/add-user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        title: "সফল হয়েছে!",
        text:
          data?.message ||
          "নতুন অ্যাকাউন্টটি সফলভাবে তৈরি ও সক্রিয় করা হয়েছে ভাই।",
        icon: "success",
        confirmButtonColor: "#0B5D3B",
        customClass: { popup: "rounded-[2rem]" },
      });
      reset(); // ফর্ম ক্লিন
      setSelectedImage(null); // ইমেজ প্রিভিউ ক্লিন
      if (fileInputRef.current) fileInputRef.current.value = ""; // ইনপুট ফাইল রিফ্রেশ
    },
    onError: (error: any) => {
      Swal.fire({
        title: "ব্যর্থ হয়েছে!",
        text:
          error.response?.data?.message ||
          "ইউজার তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন ভাই।",
        icon: "error",
        confirmButtonColor: "#d33",
        customClass: { popup: "rounded-[2rem]" },
      });
    },
  });

  const onSubmit = (data: any) => {
    const file = fileInputRef.current?.files?.[0];
    const formData = new FormData();

    formData.append("role", data.role);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("birthDate", data.birthDate);
    formData.append("gender", data.gender);
    formData.append("district", data.district);
    formData.append("permanentAddress", data.permanentAddress);
    formData.append("studentMobile", data.studentMobile);
    formData.append("studentNameEn", data.studentNameEn);
    formData.append("department", data.department);

    if (data.role === "teacher") {
      formData.append("teacherNameBn", data.teacherNameBn);
      formData.append("designation", data.designation);
      formData.append("experience", data.experience);
      formData.append("qualifications", data.qualifications);
    } else {
      formData.append("studentNameBn", data.studentNameBn);
      formData.append("classLevel", data.classLevel);
      formData.append("fatherName", data.fatherName);
      formData.append("fatherMobile", data.fatherMobile);
      formData.append("fatherJob", data.fatherJob || "");
      formData.append("motherName", data.motherName);
      formData.append("motherMobile", data.motherMobile);
      formData.append("motherJob", data.motherJob || "");
    }

    if (file) {
      formData.append("profileImage", file);
    }

    addNewUser(formData);
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-1 mb-8">
          <h3 className="text-2xl font-black text-neutral-800 flex items-center gap-2">
            <User className="text-[#0B5D3B]" size={28} /> নতুন অ্যাকাউন্ট তৈরি
          </h3>
          <p className="text-sm font-semibold text-neutral-600">
            অনুগ্রহ করে নিচে আপনার সমস্ত তথ্য পূরণ করুন
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <UnifiedRegistrationForm
            register={register}
            errors={errors}
            watch={watch}
            handleImageClick={handleImageClick}
            handleImageChange={handleImageChange}
            fileInputRef={fileInputRef}
            selectedImage={selectedImage}
            departments={departments}
            isDeptLoading={isDeptLoading}
            validatePhone={validatePhone}
            hideRoleToggle={false}
          />

          <div className="text-right border-t pt-6">
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#0B5D3B] hover:cursor-pointer text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-[#08452b] transition-all shadow-md tracking-wide disabled:opacity-70 flex items-center gap-2 ml-auto"
            >
              {isPending && <Loader2 className="animate-spin" size={16} />}
              নিবন্ধন সম্পন্ন করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}