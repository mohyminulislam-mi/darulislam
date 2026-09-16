"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

interface DonationFormData {
  title: string;
  slug: string;
  description: string;
  goalAmount: number;
  image: FileList;
}

export default function AddDonationPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DonationFormData>();

  const title = watch("title");

  useEffect(() => {
    if (title) {
      const slug = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u0980-\u09ff]+/g, "-");

      setValue("slug", slug);
    }
  }, [title, setValue]);

  const { mutate: createCampaign, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosSecure.post(
        "/donations/admin/campaigns",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "সফল হয়েছে",
        text: "নতুন দান প্রকল্প সফলভাবে তৈরি করা হয়েছে।",
        confirmButtonColor: "#0B5D3B",
      });
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
      reset();
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: "ব্যর্থ হয়েছে",
        text:
          error?.response?.data?.message || "প্রকল্পটি সংরক্ষণ করা সম্ভব হয়নি।",
        confirmButtonColor: "#0B5D3B",
      });
    },
  });

  const onSubmit = (data: DonationFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("goalAmount", data.goalAmount.toString());

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    createCampaign(formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          নতুন দান প্রকল্প যুক্ত করুন
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">
              প্রকল্পের নাম
            </label>
            <input
              type="text"
              placeholder="যেমন: দারুল ইসলাম ইনস্টিটিউটে দান করুন"
              {...register("title", {
                required: "প্রকল্পের নাম আবশ্যক",
              })}
              className="w-full rounded-xl border border-gray-300 p-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1 font-bold">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Goal Amount */}
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">
              টার্গেট বা লক্ষ্য পরিমাণ (৳)
            </label>
            <input
              type="number"
              placeholder="যেমন: ৫০০০০০"
              {...register("goalAmount", {
                required: "লক্ষ্য পরিমাণ অর্থ আবশ্যক",
                min: {
                  value: 1,
                  message: "পরিমাণ অবশ্যই ১ টাকার বেশি হতে হবে",
                },
              })}
              className="w-full rounded-xl border border-gray-300 p-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.goalAmount && (
              <p className="text-red-500 text-xs mt-1 font-bold">
                {errors.goalAmount.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">
              প্রকল্পের বিস্তারিত
            </label>
            <textarea
              rows={6}
              placeholder="দান প্রকল্প সম্পর্কে বিস্তারিত লিখুন..."
              {...register("description", {
                required: "বিস্তারিত তথ্য আবশ্যক",
              })}
              className="w-full rounded-xl border border-gray-300 p-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1 font-bold">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">
              প্রকল্পের ছবি
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image", {
                required: "একটি ছবি নির্বাচন করুন",
              })}
              className="w-full rounded-xl cursor-pointer border border-gray-300 p-3 text-xs font-bold file:mr-4 file:rounded-lg file:border-0 file:bg-green-600 file:px-4 file:py-2 file:text-white hover:file:bg-green-700"
            />
            {errors.image && (
              <p className="text-red-500 text-xs mt-1 font-bold">
                {errors.image.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl cursor-pointer bg-green-600 py-3 font-black text-white transition hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> সংরক্ষণ করা
                হচ্ছে...
              </>
            ) : (
              "প্রকল্প সংরক্ষণ করুন"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}