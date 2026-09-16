"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { Sidebar } from "@/src/components/register/Sidebar";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
} from "@/src/components/register/Fromsteps";

import dynamicImport from "next/dynamic";

const validateInternationalPhone = (value: string) => {
  if (!value) return "মোবাইল নম্বরটি আবশ্যক";
  const phoneWithPlus = value.startsWith("+") ? value : `+${value}`;
  try {
    const phoneNumber = parsePhoneNumberFromString(phoneWithPlus);
    if (!phoneNumber || !phoneNumber.isValid()) {
      return "অনুগ্রহ করে কান্ট্রি কোড সহ সঠিক নম্বর দিন (যেমন: +88017XXXXXXXX)";
    }
    return true;
  } catch (error) {
    return "সঠিক আন্তর্জাতিক মোবাইল নম্বরটি প্রদান করুন";
  }
};

const RegisterPage: React.FC = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: { role: "student" },
    mode: "onChange",
  });

  const [step, setStep] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const totalSteps = 5;

  const userRole = watch("role");
  const isTeacher = userRole === "teacher";

  useEffect(() => {
    if (redirectUrl) {
      setValue("role", "student");
    }
  }, [redirectUrl, setValue]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        );
        setDepartments(res.data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };
    fetchDepartments();
  }, []);

  const staticDivisions = [
    "ঢাকা",
    "চট্টগ্রাম",
    "রাজশাহী",
    "খুলনা",
    "বরিশাল",
    "সিলেট",
    "রংপুর",
    "ময়মনসিংহ",
  ];

  const nextStep = async () => {
    const validationMap: any = {
      1: [
        "studentNameEn",
        "studentNameBn",
        "teacherNameBn",
        "birthDate",
        "gender",
        "division",
      ],
      2: isTeacher
        ? ["designation", "department", "experience"]
        : ["fatherName", "fatherMobile", "department"],
      3: ["motherName"],
      4: ["district", "studentMobile", "email"],
      5: ["password", "confirmPassword"],
    };

    const isStepValid = await trigger(validationMap[step] || []);

    if (isStepValid) {
      if (isTeacher && step === 2) {
        setStep(4);
      } else if (step < totalSteps) {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    if (isTeacher && step === 4) {
      setStep(2);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        title: "পাসওয়ার্ড মিলেনি!",
        text: "পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড একই হতে হবে।",
        icon: "warning",
        confirmButtonColor: "#0B5D3B",
        customClass: { popup: "rounded-[2rem]" },
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== "confirmPassword") {
          if (
            (key === "fatherMobile" || key === "studentMobile") &&
            data[key]
          ) {
            const cleanValue = data[key].trim();
            const formatted = cleanValue.startsWith("+")
              ? cleanValue
              : `+${cleanValue}`;
            formData.append(key, formatted);
          } else if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key]);
          }
        }
      });

      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      Swal.fire({
        title: "রেজিস্ট্রেশন সফল হয়েছে!",
        text:
          response.data?.message ||
          "আপনার অ্যাকাউন্টটি সফলভাবে তৈরি করা হয়েছে। ইমেইল ভেরিফিকেশন লিঙ্কটি চেক করুন।",
        icon: "success",
        confirmButtonColor: "#0B5D3B",
        customClass: { popup: "rounded-[2rem]" },
      }).then(() => {
        if (redirectUrl) {
          router.push(
            `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`,
          );
        } else {
          router.push("/auth/login");
        }
      });
    } catch (error: any) {
      Swal.fire({
        title: "রেজিস্ট্রেশন ব্যর্থ হয়েছে",
        text:
          error.response?.data?.message ||
          "কিছু একটা ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        icon: "error",
        confirmButtonColor: "#0B5D3B",
        customClass: { popup: "rounded-[2rem]" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMobileStepLabel = () => {
    if (step === 1) return "ব্যক্তিগত তথ্য";
    if (step === 2) return isTeacher ? "পেশাগত তথ্য" : "পিতার তথ্য";
    if (step === 3) return "মাতার তথ্য";
    if (step === 4) return "যোগাযোগ";
    return "নিরাপত্তা";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-neutral-100">
        <Sidebar step={step} isTeacher={isTeacher} />

        <div className="flex-1 p-6 lg:p-12 relative">
          <div className="lg:hidden mb-6 bg-slate-50 p-4 rounded-2xl border border-neutral-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black text-[#0B5D3B] bg-[#0B5D3B]/10 px-2.5 py-1 rounded-md">
                ধাপ{" "}
                {step === 4 && isTeacher
                  ? 3
                  : step === 5 && isTeacher
                    ? 4
                    : step}{" "}
                / {isTeacher ? 4 : totalSteps}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {getMobileStepLabel()}
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-200/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0B5D3B] transition-all duration-300 rounded-full"
                style={{
                  width: `${(step / totalSteps) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mb-6 lg:mb-8">
            <Link
              href={
                redirectUrl
                  ? `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`
                  : "/auth/login"
              }
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-[#0B5D3B] transition-colors group"
            >
              <div className="p-2 lg:p-0 bg-neutral-50 lg:bg-transparent rounded-full lg:rounded-none">
                <ArrowLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </div>
              <span className="hidden lg:block text-sm font-bold uppercase tracking-widest">
                পিছনে
              </span>
            </Link>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                nextStep();
              }
            }}
            className="min-h-[400px] flex flex-col"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                {step === 1 && (
                  <Step1
                    register={register}
                    errors={errors}
                    watch={watch}
                    handleImageClick={() => fileInputRef.current?.click()}
                    handleImageChange={(e: any) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedImage(URL.createObjectURL(file));
                        setImageFile(file);
                      }
                    }}
                    fileInputRef={fileInputRef}
                    selectedImage={selectedImage}
                    departments={departments}
                    hideRoleToggle={!!redirectUrl}
                  />
                )}
                {step === 2 && (
                  <Step2
                    register={register}
                    errors={errors}
                    isTeacher={isTeacher}
                    departments={departments}
                    validatePhone={validateInternationalPhone}
                  />
                )}
                {step === 3 && !isTeacher && (
                  <Step3 register={register} errors={errors} />
                )}
                {step === 4 && (
                  <Step4
                    register={register}
                    errors={errors}
                    divisions={staticDivisions}
                    validatePhone={validateInternationalPhone}
                  />
                )}
                {step === 5 && (
                  <Step5 register={register} errors={errors} watch={watch} />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isLoading}
                    className="px-6 py-4 hover:cursor-pointer border-2 border-neutral-100 rounded-2xl font-black text-neutral-400 hover:bg-neutral-50 flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <ChevronLeft size={20} /> ফিরে যান
                  </button>
                )}

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      nextStep();
                    }}
                    className="flex-1 flex hover:cursor-pointer items-center justify-center gap-2 py-4 bg-[#0B5D3B] text-white rounded-2xl font-black shadow-xl active:scale-[0.98] transition-all"
                  >
                    পরবর্তী ধাপ <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex hover:cursor-pointer items-center justify-center gap-2 py-4 px-3 lg:px-0 bg-[#0B5D3B] text-white rounded-2xl font-black shadow-xl active:scale-[0.98] transition-all disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "রেজিস্ট্রেশন সম্পন্ন করুন"
                    )}
                  </button>
                )}
              </div>

              <p className="text-center text-sm font-bold text-neutral-500 mt-2">
                ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
                <Link
                  href={
                    redirectUrl
                      ? `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`
                      : "/auth/login"
                  }
                  className="text-[#0B5D3B] hover:underline font-black"
                >
                  লগইন করুন
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AntiBailoutLoginPage = dynamicImport(
  () => Promise.resolve(RegisterPage),
  {
    ssr: false,
  },
);

export default AntiBailoutLoginPage;