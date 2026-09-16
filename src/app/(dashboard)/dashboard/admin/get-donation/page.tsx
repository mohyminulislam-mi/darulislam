"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import {
  HandHeart,
  Check,
  Trash2,
  X,
  Image as ImageIcon,
  UploadCloud,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";
import { AnimatePresence } from "framer-motion";

interface Cause {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  goalAmount: number;
  raisedAmount?: number;
  image: string;
  isActive?: boolean;
}

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  goalAmount: number;
  image: FileList | string;
}

export default function DonationPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCause, setSelectedCause] = useState<Cause | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>();

  // --- ১. ক্যাম্পেইন ডাটা ফেচ করা (TanStack Query) ---
  const { data: causes = [], isLoading } = useQuery<Cause[]>({
    queryKey: ["adminCampaigns"],
    queryFn: async () => {
      const response = await axiosSecure.get("/donations/admin/campaigns");
      return response.data?.data || [];
    },
  });

  const watchedImage = watch("image");

  useEffect(() => {
    if (
      watchedImage &&
      watchedImage instanceof FileList &&
      watchedImage.length > 0
    ) {
      const file = watchedImage[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [watchedImage]);

  const titleWatch = watch("title");
  useEffect(() => {
    if (titleWatch && !selectedCause) {
      const slug = titleWatch
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u0980-\u09ff]+/g, "-");
      setValue("slug", slug);
    }
  }, [titleWatch, setValue, selectedCause]);

  // --- ২. ডাটা আপডেট মিউটেশন (TanStack Query Mutation) ---
  const { mutate: updateCampaign, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const response = await axiosSecure.put(
        `/donations/admin/campaigns/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "সফল!",
        text: "দান প্রকল্পটির তথ্য সফলভাবে আপডেট করা হয়েছে।",
        icon: "success",
        confirmButtonColor: "#0B5D3B",
      });
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      Swal.fire({
        title: "ত্রুটি!",
        text: error?.response?.data?.message || "তথ্য আপডেট করা সম্ভব হয়নি।",
        icon: "error",
        confirmButtonColor: "#0B5D3B",
      });
    },
  });

  // --- ৩. ডাটা ডিলিট মিউটেশন (TanStack Query Mutation) ---
  const { mutate: deleteCampaign } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosSecure.delete(
        `/donations/admin/campaigns/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "মুছে ফেলা হয়েছে!",
        text: "দান প্রকল্পটি সফলভাবে মুছে ফেলা হয়েছে।",
        icon: "success",
        confirmButtonColor: "#0B5D3B",
      });
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
    },
    onError: (error: any) => {
      Swal.fire({
        title: "ত্রুটি!",
        text:
          error?.response?.data?.message || "প্রকল্পটি মুছে ফেলা সম্ভব হয়নি।",
        icon: "error",
        confirmButtonColor: "#0B5D3B",
      });
    },
  });

  // মডাল ওপেন করার ফাংশন
  const openUpdateModal = (cause: Cause) => {
    setSelectedCause(cause);
    setImagePreview(cause.image);
    reset({
      title: cause.title,
      slug: cause.slug,
      description: cause.description,
      goalAmount: cause.goalAmount,
      image: cause.image,
    });
    setIsModalOpen(true);
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const onUpdateSubmit = async (data: FormInputs) => {
    if (!selectedCause?._id) return;

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("goalAmount", data.goalAmount.toString());

    if (data.image instanceof FileList && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    updateCampaign({ id: selectedCause._id, formData });
  };

  // ডিলিট নিশ্চিতকরণ হ্যান্ডলার
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "প্রকল্পটি মুছে ফেলবেন?",
      text: "একবার মুছে ফেললে এই তথ্যটি আর পুনরুদ্ধার করা যাবে না।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে করুন",
      cancelButtonText: "না, রাখুন",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      deleteCampaign(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col relative min-h-screen bg-gray-50/50">
      <div className="max-w-screen-xl mx-auto w-full px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12 space-y-12">
          <div className="space-y-8 pt-12">
            <h2 className="text-3xl font-black text-[#0B3D2E] flex items-center gap-3">
              <HandHeart /> আপনার দান প্রকল্পসমূহ
            </h2>

            {causes.length === 0 ? (
              <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-[2.5rem]">
                <p className="text-neutral-400 font-bold">
                  কোনো দান প্রকল্প খুঁজে পাওয়া যায়নি!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {causes.map((cause, i) => (
                  <div
                    key={cause._id || i}
                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-[#0B3D2E]/5 group"
                  >
                    <div className="relative h-44">
                      <Image
                        src={cause.image}
                        alt={cause.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-6 right-6 flex items-end justify-between">
                        <div className="text-white text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#8FE3A9]">
                            লক্ষ্যমাত্রা
                          </p>
                          <p className="text-xl font-black">
                            {cause.goalAmount?.toLocaleString("bn-BD")}৳
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 space-y-6">
                      <div>
                        <h4 className="text-lg font-bold text-[#0B3D2E] truncate">
                          {cause.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px]">
                          {cause.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => cause._id && handleDelete(cause._id)}
                          className="py-2.5 hover:cursor-pointer border border-red-100 hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          প্রকল্প মুছুন
                        </button>

                        <button
                          onClick={() => openUpdateModal(cause)}
                          className="py-2.5 hover:cursor-pointer bg-[#0B5D3B] hover:bg-[#0c4a2c] text-white text-xs font-black rounded-xl shadow-md shadow-green-100 transition-all active:scale-[0.98] flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          তথ্য আপডেট করুন
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- REACT HOOK FORM UPDATE MODAL WITH IMAGE UPLOAD --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 my-8"
            >
              {/* Modal Header */}
              <div className="bg-[#0B3D2E] text-white px-6 py-4 flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> প্রকল্পের তথ্য ও ছবি
                  পরিবর্তন
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form
                onSubmit={handleSubmit(onUpdateSubmit)}
                className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
              >
                {/* Image Upload Field */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">
                    প্রকল্পের ছবি
                  </label>

                  {/* Image Preview Window */}
                  {imagePreview && (
                    <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Custom File Upload Input */}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100/70 transition-all">
                      <div className="flex flex-col items-center justify-center pt-3 pb-3">
                        <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-500 font-medium">
                          নতুন ছবি আপলোড করতে{" "}
                          <span className="font-bold text-[#0B5D3B]">
                            ক্লিক করুন
                          </span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          PNG, JPG বা WEBP
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        {...register("image")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Title Field */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700 block">
                    প্রকল্পের নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("title", {
                      required: "প্রকল্পের নাম দেওয়া আবশ্যক",
                    })}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-xs font-bold ${
                      errors.title
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200"
                    }`}
                    placeholder="যেমন: এতিমখানায় খাদ্য বিতরণ"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1 font-bold">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Goal Field */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700 block">
                    টাকার লক্ষ্যমাত্রা (৳){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("goalAmount", {
                      required: "টাকার লক্ষ্যমাত্রা দেওয়া আবশ্যক",
                      min: {
                        value: 1,
                        message: "পরিমাণ অবশ্যই ১ টাকার বেশি হতে হবে",
                      },
                    })}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-xs font-bold ${
                      errors.goalAmount
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200"
                    }`}
                    placeholder="যেমন: ৫০০০০"
                  />
                  {errors.goalAmount && (
                    <p className="text-red-500 text-xs mt-1 font-bold">
                      {errors.goalAmount.message}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700 block">
                    বিবরণ
                  </label>
                  <textarea
                    rows={4}
                    {...register("description", {
                      required: "বিস্তারিত বিবরণ আবশ্যক",
                    })}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-xs font-bold resize-none ${
                      errors.description
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200"
                    }`}
                    placeholder="প্রকল্পের বিস্তারিত বিবরণ এখানে লিখুন..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1 font-bold">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2 text-sm font-bold text-white bg-[#0B5D3B] hover:bg-[#0c4a2c] rounded-xl shadow-md shadow-green-100 cursor-pointer transition-all active:scale-[0.98] flex items-center gap-1 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> সংরক্ষণ
                        হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> সংরক্ষণ করুন
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}