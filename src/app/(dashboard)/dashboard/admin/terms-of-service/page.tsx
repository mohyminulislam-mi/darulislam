"use client";

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, Save } from "lucide-react";

// টাইপ ডেফিনিশন (TypeScript এর জন্য)
interface ContentItem {
  label: string;
  text: string;
}

interface SectionItem {
  id: number;
  iconName: string;
  heading: string;
  type: "paragraphs" | "list" | "plain_text";
  text?: string;
  contents?: ContentItem[];
}

interface TermsFormValues {
  title: string;
  institution: string;
  intro: string;
  lastUpdated: string;
  sections: SectionItem[];
}

// ডিফল্ট ইনিশিয়াল ডেটা (যা আপনার আগের ডাটার সাথে হুবহু মিলবে)
const defaultValues: TermsFormValues = {
  title: "ব্যবহারের শর্তাবলি (Terms of Service)",
  institution: "দারুল ইসলাম ইনস্টিটিউট মাদ্রাসা",
  intro:
    "দারুল ইসলাম ইনস্টিটিউট মাদ্রাসার ওয়েবসাইট ব্যবহার এবং আমাদের যেকোনো কোর্সে অংশগ্রহণ করার মাধ্যমে আপনি নিম্নলিখিত শর্তাবলি মেনে নিতে সন্মতি প্রদান করছেন:",
  lastUpdated: "জুলাই ২০২৬",
  sections: [
    {
      id: 1,
      iconName: "UserCheck",
      heading: "১. সাধারণ নিয়ম ও সঠিক তথ্য প্রদান",
      type: "paragraphs",
      contents: [
        {
          label: "তথ্য প্রদান",
          text: "ভর্তির আবেদন বা যেকোনো ফর্ম পূরণের সময় শিক্ষার্থীকে অবশ্যই সঠিক এবং সত্য তথ্য প্রদান করতে হবে।",
        },
        {
          label: "আচরণবিধি",
          text: "এটি একটি দ্বীনি প্রতিষ্ঠান। ক্লাসে বা গ্রুপ ডিসকাশনে শিক্ষক এবং সহপাঠীদের সাথে মার্জিত ও সম্মানজনক আচরণ করতে হবে।",
        },
      ],
    },
  ],
};

export default function TermsAdminForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TermsFormValues>({
    defaultValues: defaultValues,
  });

  // সেকশন হ্যান্ডেল করার জন্য ফিল্ড অ্যারে
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const onSubmit = (data: TermsFormValues) => {
    console.log(
      "আপনার জেনারেট হওয়া নতুন JSON ডেটা:",
      JSON.stringify(data, null, 2),
    );
    alert("ডাটা সফলভাবে সাবমিট হয়েছে! কনসোল (Console) চেক করুন।");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            শর্তাবলি আপডেট ফর্ম (Admin Panel)
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* মেটা ইনফরমেশন */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                পেজ টাইটেল
              </label>
              <input
                {...register("title", { required: "টাইটেল আবশ্যিক" })}
                className="w-full border rounded-md p-2 bg-white text-gray-900 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                প্রতিষ্ঠানের নাম
              </label>
              <input
                {...register("institution")}
                className="w-full border rounded-md p-2 bg-white text-gray-900 focus:outline-emerald-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ভূমিকা (Intro Text)
              </label>
              <textarea
                {...register("intro")}
                rows={2}
                className="w-full border rounded-md p-2 bg-white text-gray-900 focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                সর্বশেষ পরিমার্জিত (Last Updated)
              </label>
              <input
                {...register("lastUpdated")}
                placeholder="উদা: জুলাই ২০২৬"
                className="w-full border rounded-md p-2 bg-white text-gray-900 focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* সেকশন এরিয়া */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">
                শর্তাবলির সেকশনসমূহ
              </h2>
              <button
                type="button"
                onClick={() =>
                  appendSection({
                    id: Date.now(),
                    iconName: "ShieldAlert",
                    heading: "নতুন শর্ত",
                    type: "plain_text",
                    text: "",
                  })
                }
                className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-sm px-3 py-1.5 rounded-md transition"
              >
                <Plus size={16} /> সেকশন যোগ করুন
              </button>
            </div>

            {sectionFields.map((section, index) => {
              // কারেন্ট সেকশনের টাইপ ট্র্যাক করার জন্য
              const currentType = watch(`sections.${index}.type`);

              return (
                <div
                  key={section.id}
                  className="border border-gray-200 rounded-lg p-4 md:p-6 space-y-4 bg-white relative shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>

                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">
                    সেকশন #{index + 1}
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        সেকশন হেডিং
                      </label>
                      <input
                        {...register(`sections.${index}.heading` as const, {
                          required: true,
                        })}
                        placeholder="উদা: ১. সাধারণ নিয়ম"
                        className="w-full border rounded-md p-2 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        আইকন নাম (Lucide Icon)
                      </label>
                      <select
                        {...register(`sections.${index}.iconName` as const)}
                        className="w-full border rounded-md p-2 bg-white text-gray-900"
                      >
                        <option value="UserCheck">UserCheck (ইউজার)</option>
                        <option value="BookOpen">BookOpen (বই/শিক্ষা)</option>
                        <option value="FileVideo">FileVideo (ভিডিও)</option>
                        <option value="Award">Award (পরীক্ষা)</option>
                        <option value="CreditCard">CreditCard (পেমেন্ট)</option>
                        <option value="MessageSquare">
                          MessageSquare (পরামর্শ)
                        </option>
                        <option value="ShieldAlert">
                          ShieldAlert (সতর্কতা)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      ডাটার ধরন (Type)
                    </label>
                    <select
                      {...register(`sections.${index}.type` as const)}
                      className="w-full border rounded-md p-2 bg-white text-gray-900"
                    >
                      <option value="plain_text">
                        Plain Text (সাধারণ অনুচ্ছেদ)
                      </option>
                      <option value="paragraphs">
                        Paragraphs (লেবেলসহ প্যারাগ্রাফ)
                      </option>
                      <option value="list">List (বুলেট পয়েন্ট তালিকা)</option>
                    </select>
                  </div>

                  {/* শর্তের ধরন অনুযায়ী সাব-ইনপুট ফিল্ড ফিল্টারিং */}
                  {currentType === "plain_text" ? (
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        বিস্তারিত বিবরণ
                      </label>
                      <textarea
                        {...register(`sections.${index}.text` as const)}
                        rows={3}
                        placeholder="এখানে শর্তের বিস্তারিত লিখুন..."
                        className="w-full border rounded-md p-2 text-gray-900"
                      />
                    </div>
                  ) : (
                    <NestedContents
                      index={index}
                      control={control}
                      register={register}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* সাবমিট বাটন */}
          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-6 py-2.5 rounded-md shadow transition"
            >
              <Save size={18} /> নতুন জেনারেট করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// সেকশনের ভেতরের সাব-লিস্ট বা সাব-প্যারাগ্রাফ হ্যান্ডেল করার জন্য আলাদা সাব-কম্পোনেন্ট
function NestedContents({
  index,
  control,
  register,
}: {
  index: number;
  control: any;
  register: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${index}.contents`,
  });

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-gray-700">
          কন্টেন্ট আইটেম সমূহ (Label & Text)
        </label>
        <button
          type="button"
          onClick={() => append({ label: "", text: "" })}
          className="text-xs bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded transition"
        >
          + আইটেম যোগ করুন
        </button>
      </div>

      {fields.map((subField, subIndex) => (
        <div
          key={subField.id}
          className="flex gap-2 items-start bg-white p-2 rounded border"
        >
          <div className="w-1/3">
            <input
              {...register(
                `sections.${index}.contents.${subIndex}.label` as const,
                { required: true },
              )}
              placeholder="লেবেল (উদা: আচরণবিধি)"
              className="w-full border rounded p-1.5 text-xs text-gray-900"
            />
          </div>
          <div className="w-full">
            <textarea
              {...register(
                `sections.${index}.contents.${subIndex}.text` as const,
                { required: true },
              )}
              placeholder="বিস্তারিত বিবরণ..."
              rows={1}
              className="w-full border rounded p-1.5 text-xs text-gray-900"
            />
          </div>
          <button
            type="button"
            onClick={() => remove(subIndex)}
            className="text-red-500 hover:text-red-700 pt-1.5 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
