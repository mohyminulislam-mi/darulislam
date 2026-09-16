"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { HelpCircle, Plus, Trash2, Save } from "lucide-react";

// TypeScript-এর জন্য ইন্টারফেস ডেফিনিশন
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQFormValues {
  faqs: FAQItem[];
}

// আপনার পেজ থেকে নেওয়া ডিফল্ট ডাটা
const defaultFAQValues: FAQFormValues = {
  faqs: [
    {
      question: "ভর্তির জন্য ন্যূনতম যোগ্যতা কী?",
      answer:
        "হিফজ বিভাগের জন্য ন্যূনতম বয়স ৭ বছর হতে হবে। আলিম কোর্সের জন্য দাখিল বা সমমান পাস হতে হবে। তবে আগ্রহী বয়স্কদের জন্য নৈশকালীন বিশেষ কোর্স চালু রয়েছে।",
    },
    {
      question: "আবাসিক ব্যবস্থা আছে কি?",
      answer:
        "হ্যাঁ, আমাদের অত্যন্ত সুন্দর ও নিরাপদ ছাত্রাবাস রয়েছে। দূরবর্তী শিক্ষার্থীদের জন্য উন্নত আবাসন ও খাবারের সুব্যবস্থা প্রদান করা হয়।",
    },
    {
      question: "কোনো দক্ষতা শেখানো হয় কি?",
      answer:
        "অবশ্যই। আমরা তথ্য-প্রযুক্তি, হস্তলিপি এবং ইংরেজি ও আরবি ভাষার ওপর বিশেষ কর্মশালার আয়োজন করি যাতে শিক্ষার্থীরা কর্মজীবনে সফল হতে পারে।",
    },
  ],
};

export default function FAQAdminForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FAQFormValues>({
    defaultValues: defaultFAQValues,
  });

  // ডাইনামিকালি FAQ বাড়ানো বা কমানোর জন্য useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: "faqs",
  });

  const onSubmit = (data: FAQFormValues) => {
    console.log(
      "আপনার তৈরি করা নতুন FAQ JSON ডাটা:",
      JSON.stringify(data.faqs, null, 2),
    );
    alert("FAQ ডাটা সফলভাবে তৈরি হয়েছে! ব্রাউজারের কনসোল (Console) চেক করুন।");
  };

  return (
    <section className="flex flex-col min-h-screen bg-[#F7FBF7] py-12 px-4">
      <div className="max-w-4xl mx-auto w-full bg-white rounded-[3rem] shadow-xl border border-[#0B3D2E]/5 overflow-hidden">
        {/* ফর্ম হেডার - আপনার FAQ পেজের থিমের সাথে মিল রেখে */}
        <div className="bg-[#0B3D2E] p-6 lg:p-10 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#8FE3A9] rounded-2xl flex items-center justify-center text-[#0B3D2E] shadow-md">
              <HelpCircle size={28} />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black">
                FAQ ম্যানেজমেন্ট প্যানেল
              </h1>
              <p className="text-xs text-[#F5EFE1]/80 mt-0.5">
                নতুন প্রশ্ন ও উত্তর যোগ বা পরিবর্তন করুন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => append({ question: "", answer: "" })}
            className="flex items-center gap-2 bg-[#8FE3A9] text-[#0B3D2E] hover:bg-[#8FE3A9]/90 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95"
          >
            <Plus size={18} /> নতুন FAQ যোগ করুন
          </button>
        </div>

        {/* মেইন ফর্ম এরিয়া */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 lg:p-10 space-y-6"
        >
          {fields.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-400 font-medium">
                কোনো FAQ যুক্ত করা নেই। ওপরের বাটনে ক্লিক করে নতুন প্রশ্ন যোগ
                করুন।
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-gray-50/50 rounded-3xl p-6 border border-[#0B3D2E]/5 relative shadow-sm hover:border-[#0B3D2E]/10 transition-all"
                >
                  {/* রিমুভ বাটন */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 size={20} />
                  </button>

                  {/* সিরিয়াল নাম্বার ব্যাজ */}
                  <div className="inline-block bg-[#0B3D2E] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    প্রশ্ন নং - ০{index + 1}
                  </div>

                  <div className="space-y-4">
                    {/* প্রশ্ন ইনপুট */}
                    <div>
                      <label className="block text-sm font-black text-[#0B3D2E] mb-1.5">
                        জিজ্ঞাসা / প্রশ্ন
                      </label>
                      <input
                        {...register(`faqs.${index}.question` as const, {
                          required: "প্রশ্ন লেখা আবশ্যক",
                        })}
                        placeholder="যেমন: মাদরাসার ফিস কত?"
                        className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-[#0B3D2E] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 focus:border-[#0B3D2E]"
                      />
                      {errors.faqs?.[index]?.question && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {errors.faqs[index]?.question?.message}
                        </p>
                      )}
                    </div>

                    {/* উত্তর ইনপুট */}
                    <div>
                      <label className="block text-sm font-black text-[#0B3D2E] mb-1.5">
                        সমাধান / উত্তর
                      </label>
                      <textarea
                        {...register(`faqs.${index}.answer` as const, {
                          required: "উত্তর লেখা আবশ্যক",
                        })}
                        rows={3}
                        placeholder="এখানে বিস্তারিত উত্তরটি লিখুন..."
                        className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-[#0B3D2E]/80 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 focus:border-[#0B3D2E] leading-relaxed"
                      />
                      {errors.faqs?.[index]?.answer && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {errors.faqs[index]?.answer?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* সাবমিট সেকশন */}
          <div className="pt-6 border-t-2 border-dashed border-[#0B3D2E]/5 flex justify-end">
            <button
              type="submit"
              className="flex items-center cursor-pointer gap-2 bg-[#0B3D2E] text-white hover:bg-[#0B3D2E]/90 px-8 py-3.5 rounded-2xl font-bold shadow-lg transition-transform active:scale-95"
            >
              <Save size={20} /> FAQ ডাটা সেভ করুন
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
