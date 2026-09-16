"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Save } from "lucide-react";

// টাইপ ডেফিনিশন (TypeScript-এর জন্য)
interface PrivacySection {
  id: number;
  iconName: string;
  heading: string;
  text: string;
}

interface PrivacyFormValues {
  title: string;
  institution: string;
  intro: string;
  lastUpdated: string;
  sections: PrivacySection[];
}

// চিত্র image_8e94e5.png-এর কন্টেন্ট অনুযায়ী ডিফল্ট ভ্যালু সেট করা হয়েছে
const defaultPrivacyValues: PrivacyFormValues = {
  title: "গোপনীয়তা নীতি (Privacy Policy)",
  institution: "দারুল ইসলাম ইনস্টিটিউট মাদ্রাসা",
  intro:
    "দারুল ইসলাম ইনস্টিটিউট মাদ্রাসায় আপনার ব্যক্তিগত তথ্যের নিরাপত্তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। আমাদের ওয়েবসাইট ব্যবহারের সময় আমরা কীভাবে আপনার তথ্য সংগ্রহ ও ব্যবহার করি, তা নিচে বিস্তারিত জানানো হলো:",
  lastUpdated: "জুলাই ২০২৬",
  sections: [
    {
      id: 1,
      iconName: "UserPlus",
      heading: "তথ্য সংগ্রহ",
      text: "ভর্তি বা কল বুকিংয়ের সময় আমরা আপনার নাম, মোবাইল নম্বর, ইমেইল ঠিকানা এবং প্রয়োজনীয় ক্ষেত্রে শিক্ষাগত যোগ্যতার তথ্য সংগ্রহ করি।",
    },
    {
      id: 2,
      iconName: "ShieldCheck",
      heading: "তথ্য ব্যবহার",
      text: "আপনার সংগৃহীত তথ্য মূলত আপনার সাথে যোগাযোগ করা, কোর্সের আপডেট জানানো এবং ক্লাসের লিঙ্ক প্রদানের জন্য ব্যবহার করা হয়।",
    },
    {
      id: 3,
      iconName: "Lock",
      heading: "তথ্য সুরক্ষা",
      text: "আমরা আপনার কোনো ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা পাচার করি না। আপনার তথ্য আমাদের সুরক্ষিত ডাটাবেজে সংরক্ষিত থাকে।",
    },
    {
      id: 4,
      iconName: "Cookie",
      heading: "কুকিজ (Cookies)",
      text: "ওয়েবসাইট ব্যবহারের অভিজ্ঞতা উন্নত করতে আমরা কুকিজ ব্যবহার করতে পারি, যা আপনার ব্রাউজিং প্যাটার্ন বুঝতে সাহায্য করে।",
    },
  ],
};

export default function PrivacyAdminForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PrivacyFormValues>({
    defaultValues: defaultPrivacyValues,
  });

  // ডাইনামিকালি সেকশন যোগ/বিয়োগ করার জন্য useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const onSubmit = (data: PrivacyFormValues) => {
    console.log(
      "আপনার জেনারেট হওয়া নতুন Privacy Policy JSON ডাটা:",
      JSON.stringify(data, null, 2),
    );
    alert("ডাটা সফলভাবে সাবমিট হয়েছে! ব্রাউজারের কনসোল (Console) চেক করুন।");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10">
        {/* ফর্ম হেডার */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              গোপনীয়তা নীতি আপডেট ফর্ম
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              দারুল ইসলাম ইনস্টিটিউট মাদ্রাসা — অ্যাডমিন প্যানেল
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* মেটা ইনফরমেশন (শীর্ষক, ভূমিকা ও তারিখ) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                পেজ টাইটেল
              </label>
              <input
                {...register("title", { required: "টাইটেল প্রয়োজন" })}
                className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                প্রতিষ্ঠানের নাম
              </label>
              <input
                {...register("institution")}
                className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                ভূমিকা (Introductory Text)
              </label>
              <textarea
                {...register("intro", { required: "ভূমিকা প্রয়োজন" })}
                rows={3}
                className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
              {errors.intro && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.intro.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                সর্বশেষ পরিমার্জিত (Last Updated)
              </label>
              <input
                {...register("lastUpdated")}
                placeholder="উদা: জুলাই ২০২৬"
                className="w-full border border-gray-200 rounded-lg p-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* ডাইনামিক সেকশন এরিয়া */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">
                নীতিমালার পয়েন্টসমূহ
              </h2>
              <button
                type="button"
                onClick={() =>
                  append({
                    id: Date.now(),
                    iconName: "ShieldCheck",
                    heading: "",
                    text: "",
                  })
                }
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
              >
                <Plus size={16} /> নতুন পয়েন্ট যোগ করুন
              </button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-xl p-4 md:p-6 space-y-4 bg-white relative shadow-sm hover:border-gray-300 transition-colors"
              >
                {/* ডিলিট বাটন */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  title="রিমুভ করুন"
                >
                  <Trash2 size={18} />
                </button>

                <div className="inline-block bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-100">
                  পয়েন্ট #{index + 1}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* পয়েন্ট হেডিং */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      পয়েন্টের শিরোনাম (Heading)
                    </label>
                    <input
                      {...register(`sections.${index}.heading` as const, {
                        required: "শিরোনাম প্রয়োজন",
                      })}
                      placeholder="উদা: তথ্য সংগ্রহ"
                      className="w-full border border-gray-200 rounded-lg p-2 text-gray-900 focus:outline-emerald-600"
                    />
                  </div>

                  {/* আইকন সিলেক্টর */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      আইকন (Lucide Icon)
                    </label>
                    <select
                      {...register(`sections.${index}.iconName` as const)}
                      className="w-full border border-gray-200 rounded-lg p-2 bg-white text-gray-900 focus:outline-emerald-600"
                    >
                      <option value="UserPlus">UserPlus (তথ্য সংগ্রহ)</option>
                      <option value="ShieldCheck">
                        ShieldCheck (তথ্য ব্যবহার)
                      </option>
                      <option value="Lock">Lock (তথ্য নিরাপত্তা)</option>
                      <option value="Cookie">Cookie (কুকিজ)</option>
                    </select>
                  </div>
                </div>

                {/* বিস্তারিত টেক্সট এরিয়া */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    বিস্তারিত বিবরণ (Description)
                  </label>
                  <textarea
                    {...register(`sections.${index}.text` as const, {
                      required: "বিবরণ প্রয়োজন",
                    })}
                    rows={3}
                    placeholder="এখানে এই পয়েন্টের বিস্তারিত বিবরণ লিখুন..."
                    className="w-full border border-gray-200 rounded-lg p-2 text-gray-900 focus:outline-emerald-600"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* অ্যাকশন বাটন */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center cursor-pointer gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md transition-all"
            >
              <Save size={18} /> নতুন Privacy তৈরি করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
