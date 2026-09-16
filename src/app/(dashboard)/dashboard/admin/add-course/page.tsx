"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Upload,
  BookOpen,
  Clock,
  DollarSign,
  Image as ImageIcon,
  Loader2,
  LayoutList,
  Trash2,
  GraduationCap,
  Layers,
} from "lucide-react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import TiptapEditor from "@/src/components/TiptapEditor/TiptapEditor";

interface ISubCategory {
  _id: string;
  name: string;
}

interface ICategory {
  _id: string;
  name: string;
  subCategories?: ISubCategory[];
  subCategory?: ISubCategory[];
}

interface ICourseFormInputs {
  title: string;
  fullTitle: string;
  label: string;
  category: string;
  subCategory: string;
  courseCategoryType: "general" | "academic";
  description: string;
  price: string;
  oldPrice: string;
  duration: string;
  courseType: string;
  admissionFee: string;
  monthlyFee: string;
  highlights: { label: string; value: string }[];
  modules: { title: string; statusType: string; statusText: string }[];
}

const AddCoursePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const [categories, setCategories] = useState<ICategory[]>([]);

  const { register, control, handleSubmit, setValue, watch, reset } =
    useForm<ICourseFormInputs>({
      defaultValues: {
        courseCategoryType: "general",
        courseType: "premium", // 🎯 ডিফল্ট টাইপ প্রিমিয়াম সেট করা হলো ভাই
        oldPrice: "0",
        price: "0",
        description: "",
        highlights: [{ label: "", value: "" }],
        modules: [
          {
            title: "অরিয়েন্টেশন ও ড্যাশবোর্ড সেটআপ",
            statusType: "live_class",
            statusText: "লাইভ ক্লাস - একটিভ",
          },
        ],
      },
    });

  const selectedCategoryType = watch("courseCategoryType");
  const selectedSubCategoryId = watch("subCategory");

  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control,
    name: "highlights",
  });

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control,
    name: "modules",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const res = await axiosSecure.get("/categories");
        if (res.data) {
          setCategories(res.data.categories || res.data);
        }
      } catch (error) {
        console.error("Category fetch failed:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [axiosSecure]);

  // Handle auto matching parent Category object id when SubCategory changes
  useEffect(() => {
    if (selectedSubCategoryId) {
      const parentCat = categories.find((cat) => {
        const subs = cat.subCategories || cat.subCategory || [];
        return subs.some((s) => s._id === selectedSubCategoryId);
      });
      if (parentCat) {
        setValue("category", parentCat._id);
      }
    }
  }, [selectedSubCategoryId, categories, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ICourseFormInputs) => {
    if (!token) return Swal.fire("Error", "লগইন সেশন পাওয়া যায়নি!", "error");
    if (!imageFile) return Swal.fire("Warning", "কোর্সের ইমেজ দিন", "warning");

    setLoading(true);
    Swal.fire({
      title: "পাবলিশ হচ্ছে...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // 🎯 একাডেমিক হলে ব্যাকএন্ড লজিকের সাথে সামঞ্জস্য রেখে অটো টাইপ অ্যাসাইন
    const finalCourseType =
      data.courseCategoryType === "academic" ? "academic" : data.courseType;

    const detailsPayload = {
      fullTitle: data.fullTitle || data.title,
      description: data.description,
      admissionFee:
        data.courseCategoryType === "academic"
          ? 0
          : Number(data.admissionFee) || 0,
      monthlyFee:
        data.courseCategoryType === "academic"
          ? 0
          : Number(data.monthlyFee) || 0,
      highlights: data.highlights.filter((h) => h.label && h.value),
    };

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("label", data.label);
      formData.append("image", imageFile);
      formData.append("category", data.category);
      formData.append("subCategory", data.subCategory);
      formData.append("courseCategoryType", data.courseCategoryType);
      formData.append("duration", data.duration);
      formData.append("courseType", finalCourseType); // 🎯 সেফ ও ডাইনামিক ভ্যালু সাবমিশন
      formData.append(
        "price",
        data.courseCategoryType === "academic" ? "0" : data.price,
      );
      formData.append(
        "oldPrice",
        data.courseCategoryType === "academic" ? "0" : data.oldPrice || "0",
      );
      formData.append("details", JSON.stringify(detailsPayload));
      formData.append("modules", JSON.stringify(data.modules));

      const response = await axiosSecure.post(
        "/courses/teacher/add-course",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data) {
        Swal.fire("অভিনন্দন!", "কোর্সটি সফলভাবে তৈরি হয়েছে।", "success");
        reset();
        setImageFile(null);
        setPreviewUrl(null);
      }
    } catch (err: any) {
      Swal.fire(
        "ব্যর্থ হয়েছে",
        err?.response?.data?.message || "সার্ভার এরর",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-12 pt-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-black text-[#0B5D3B]">
            নতুন কোর্স তৈরি করুন
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            প্রয়োজনীয় তথ্য দিয়ে আপনার কোর্সটি পাবলিশ করুন
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-8 space-y-6">
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                <BookOpen className="w-5 h-5 text-emerald-600" /> বেসিক ইনফরমেশন
              </h3>

              <div className="space-y-5">
                {/* Course Category Type Selection Toggle */}
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">
                    কোর্সের ধরণ (Course Category Type)
                  </label>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    <label
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer text-[10px] md:text-xs font-black transition-all ${selectedCategoryType === "general" ? "bg-white text-[#0B5D3B] shadow-sm border border-gray-100" : "text-gray-500"}`}
                    >
                      <input
                        type="radio"
                        value="general"
                        {...register("courseCategoryType")}
                        className="hidden"
                      />
                      সাধারণ কোর্স
                    </label>
                    <label
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer text-[10px] md:text-xs font-black transition-all ${selectedCategoryType === "academic" ? "bg-white text-[#0B5D3B] shadow-sm border border-gray-100" : "text-gray-500"}`}
                    >
                      <input
                        type="radio"
                        value="academic"
                        {...register("courseCategoryType")}
                        className="hidden"
                      />
                      <GraduationCap size={16} /> একাডেমিক সাবজেক্ট
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">
                      কোর্সের নাম (Title)
                    </label>
                    <input
                      type="text"
                      required
                      {...register("title", { required: true })}
                      className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl outline-none text-xs font-bold focus:ring-2 ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="উদা: আরবী ভাষা শিক্ষা"
                    />
                  </div>
                </div>

                {/* 🎯 নতুন ডাইনামিক কোর্স সেকশন ড্রপডাউন (কন্ডিশনাল ইউআই লক) */}
                {selectedCategoryType === "general" && (
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider flex items-center gap-1">
                      <Layers size={12} className="text-[#0B5D3B]" /> কোর্স টাইপ (Course Type)
                    </label>
                    <select
                      required={selectedCategoryType === "general"}
                      {...register("courseType")}
                      className="w-full cursor-pointer rounded-2xl bg-gray-50 border border-gray-200 p-4 text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      <option value="premium">
                        প্রিমিয়াম কোর্স
                      </option>
                      <option value="bundle">বান্ডেল কোর্স</option>
                      <option value="free">ফ্রি কোর্স</option>
                      <option value="short">শর্ট কোর্স</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">
                    বিস্তারিত শিরোনাম (Full Title)
                  </label>
                  <input
                    type="text"
                    {...register("fullTitle")}
                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl outline-none text-xs font-bold focus:ring-2 ring-emerald-500/20"
                    placeholder="যেমন: কুরআন পড়ার সহজ উপায় ও আরবী ব্যাকরণ"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">
                      Select Class / Sub Category
                    </label>
                    <select
                      required
                      {...register("subCategory", { required: true })}
                      className="w-full cursor-pointer rounded-2xl bg-gray-50 border border-gray-200 p-4 text-xs font-bold text-neutral-700 focus:outline-none"
                    >
                      <option value="">
                        {categoriesLoading
                          ? "Loading..."
                          : "Select Target Section"}
                      </option>
                      {categories.map((category) => (
                        <optgroup key={category._id} label={category.name}>
                          {(
                            category.subCategories ||
                            category.subCategory ||
                            []
                          ).map((sub) => (
                            <option key={sub._id} value={sub._id}>
                              {sub.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">
                      লেবেল যুক্ত করুন (Course Label)
                    </label>
                    <input
                      type="text"
                      {...register("label")}
                      className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl outline-none text-xs font-bold"
                      placeholder="যেমন: সাধারণ, দাখিল বা বোর্ড পরীক্ষা"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">
                    কোর্সের বিবরণ (Description)
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TiptapEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </section>

            {/* Highlights Builder */}
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <LayoutList className="w-5 h-5 text-emerald-600" /> কোর্স
                  হাইলাইটস
                </h3>
                <button
                  type="button"
                  onClick={() => appendHighlight({ label: "", value: "" })}
                  className="text-xs cursor-pointer font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  + নতুন লাইন
                </button>
              </div>
              <div className="space-y-3">
                {highlightFields.map((field, i) => (
                  <div
                    key={field.id}
                    className="block space-y-3 md:space-y-0 md:flex gap-3 items-center"
                  >
                    <input
                      placeholder="লেবেল (সময়)"
                      {...register(`highlights.${i}.label` as const)}
                      className="flex-1 bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs font-bold outline-none w-full"
                    />
                    <input
                      placeholder="মান (৩ মাস)"
                      {...register(`highlights.${i}.value` as const)}
                      className="flex-1 bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs font-bold outline-none w-full"
                    />
                    {highlightFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHighlight(i)}
                        className="text-red-500 bg-red-100 cursor-pointer rounded p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum Modules */}
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-4 mb-2">
                <LayoutList className="w-5 h-5 text-emerald-600" /> কোর্সের
                কারিকুলাম / মডিউল
              </h3>

              {moduleFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 relative space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-gray-400 bg-white shadow-sm w-7 h-7 flex items-center justify-center rounded-full border border-gray-100">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <input
                      type="text"
                      placeholder="মডিউলের নাম লিখুন"
                      required
                      {...register(`modules.${index}.title` as const, {
                        required: true,
                      })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div className="pl-10">
                    <input
                      type="text"
                      placeholder="স্ট্যাটাস টেক্সট"
                      required
                      {...register(`modules.${index}.statusText` as const, {
                        required: true,
                      })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>

                  {moduleFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeModule(index)}
                      className="absolute top-4.5 right-4 text-red-500 bg-red-100 cursor-pointer rounded p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() =>
                    appendModule({
                      title: "",
                      statusType: "live_class",
                      statusText: "",
                    })
                  }
                  className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-green-600 hover:text-green-700 transition"
                >
                  + আরও মডিউল যোগ করুন
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 justify-center">
                <ImageIcon className="w-4 h-4 text-emerald-600" /> থাম্বনেইল
                ইমেজ
              </h3>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-gray-100 rounded-3xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50/30 transition-all overflow-hidden group"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <>
                    <div className="p-4 bg-emerald-50 rounded-full mb-3 text-emerald-500">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      ইমেজে সিলেক্ট করুন
                    </p>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-5">
              {/* Conditionally hide pricing structure if the course type is set to Academic */}
              {selectedCategoryType === "general" ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">
                      বর্তমান মূল্য
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required={selectedCategoryType === "general"}
                        {...register("price")}
                        className="w-full bg-gray-50 border border-gray-100 p-4 pl-10 rounded-2xl outline-none text-lg font-bold text-[#0B5D3B]"
                        placeholder="৳ 0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">
                      পূর্বের মূল্য 
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        {...register("oldPrice")}
                        className="w-full bg-gray-50 border border-gray-100 p-4 pl-10 rounded-2xl outline-none text-md text-gray-500 line-through"
                        placeholder="৳ 0.00"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-emerald-50/50 border border-emerald-100/60 rounded-2xl text-center text-xs text-emerald-800 font-bold leading-relaxed">
                  📢 অ্যাকাডেমিক সাবজেক্টের মূল্য ও সাবস্ক্রিপশন ফি তার
                  প্যারেন্ট শ্রেনী (Sub Category) প্যাকেজ থেকে অটোমেটিক
                  এগ্রিগেশন হবে।
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">
                  Duration / মেয়াদ
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    {...register("duration", { required: true })}
                    className="w-full bg-gray-50 border border-gray-100 p-3 pl-10 rounded-2xl outline-none text-xs font-bold"
                    placeholder="যেমন: ৩ মাস"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B5D3B] cursor-pointer text-white py-5 rounded-[1.5rem] font-black text-lg transition-all disabled:bg-gray-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "কোর্স পাবলিশ করুন"
                )}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default AddCoursePage;
