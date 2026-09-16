"use client";

import React, { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Plus,
  Loader2,
  Trash2,
  LayoutList,
  DollarSign,
  Clock,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { AVAILABLE_ICONS } from "@/src/config/icons";

type SubCategoryFormProps = {
  categoryName: string;
  onAddSub: (subData: any, file: File | null) => Promise<void>;
};

type SubFormData = {
  name: string;
  icon: string;
  description: string;
  fullTitle: string;
  admissionFee: string;
  oldAdmissionFee: string;
  monthlyFee: string;
  classSchedule: string;
  highlights: { label: string; value: string }[];
};

export default function SubCategoryForm({ categoryName, onAddSub }: SubCategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [subImage, setSubImage] = useState<File | null>(null);
  const [previewSubUrl, setPreviewSubUrl] = useState<string | null>(null);
  const subFileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, watch, control } =
    useForm<SubFormData>({
      defaultValues: {
        icon: "BookOpen",
        description: "",
        fullTitle: "",
        admissionFee: "0",
        oldAdmissionFee: "0",
        monthlyFee: "0",
        classSchedule: "",
        highlights: [{ label: "", value: "" }],
      },
    });

  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control,
    name: "highlights",
  });

  const selectedIcon = watch("icon");

  const handleSubImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubImage(file);
      setPreviewSubUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: SubFormData) => {
    setLoading(true);
    const filteredHighlights = data.highlights.filter(
      (h) => h.label.trim() && h.value.trim(),
    );

    const payload = {
      name: data.name,
      icon: data.icon,
      description: data.description,
      fullTitle: data.fullTitle || data.name,
      admissionFee: Number(data.admissionFee) || 0,
      oldAdmissionFee: Number(data.oldAdmissionFee) || 0,
      monthlyFee: Number(data.monthlyFee) || 0,
      classSchedule: data.classSchedule,
      highlights: filteredHighlights,
    };

    await onAddSub(payload, subImage);

    reset({
      name: "",
      icon: "BookOpen",
      description: "",
      fullTitle: "",
      admissionFee: "0",
      oldAdmissionFee: "0",
      monthlyFee: "0",
      classSchedule: "",
      highlights: [{ label: "", value: "" }],
    });
    setSubImage(null);
    setPreviewSubUrl(null);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-neutral-50/40 border border-neutral-200/40 p-5 rounded-xl mt-4 animate-in fade-in duration-300"
    >
      <span className="text-xs font-black uppercase tracking-wider text-neutral-500 block border-b border-neutral-100 pb-2">
        উপ-বিভাগ / একাডেমিক ক্লাস ফর্ম ({categoryName})
      </span>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 uppercase">
            উপ-বিভাগের নাম *
          </label>
          <input
            {...register("name", { required: true, setValueAs: (v) => v.trim() })}
            placeholder="যেমন: কুরআন তিলাওয়াত"
            className="w-full border border-neutral-200 bg-white rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-[#0B5D3B] transition-colors shadow-3xs"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 uppercase">
            আইকন নির্বাচন
          </label>
          <div className="relative flex items-center">
            <select
              {...register("icon", { required: true })}
              className="w-full border border-neutral-200 bg-white rounded-xl pl-9 pr-4 py-2 text-xs font-bold outline-none focus:border-[#0B5D3B] cursor-pointer appearance-none transition-colors shadow-3xs"
            >
              {Object.keys(AVAILABLE_ICONS).map((iconKey) => (
                <option key={iconKey} value={iconKey}>{iconKey}</option>
              ))}
            </select>
            <div className="absolute left-3.5 text-neutral-400">
              {React.createElement(AVAILABLE_ICONS[selectedIcon] || AVAILABLE_ICONS.BookOpen, { className: "w-3.5 h-3.5" })}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 uppercase">
            ল্যান্ডিং শিরোনাম (Full Title)
          </label>
          <input
            {...register("fullTitle")}
            placeholder="যেমন: সহীহ কুরআন তিলাওয়াত শিক্ষা কোর্স"
            className="w-full border border-neutral-200 bg-white rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-[#0B5D3B] transition-colors shadow-3xs"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-neutral-400 uppercase">
          কোর্সের কভার ইমেজ
        </label>
        <div
          onClick={() => subFileRef.current?.click()}
          className="border border-dashed border-neutral-200 bg-white rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors shadow-3xs"
        >
          {previewSubUrl ? (
            <div className="flex items-center gap-2 w-full px-2">
              <ImageIcon className="w-4 h-4 text-[#0B5D3B]" />
              <span className="text-xs font-bold text-neutral-600 truncate flex-1">{subImage?.name}</span>
              <span className="text-[10px] font-black bg-emerald-50 text-[#0B5D3B] border border-emerald-100 px-2 py-0.5 rounded-md">সিলেক্টেড</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-neutral-400 font-bold">
              <Upload className="w-3.5 h-3.5 text-[#0B5D3B]" />
              <span className="text-[11px]">থাম্বনেইল ইমেজ আপলোড করুন</span>
            </div>
          )}
          <input type="file" ref={subFileRef} onChange={handleSubImageChange} accept="image/*" className="hidden" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 uppercase flex items-center gap-0.5"><DollarSign size={10} /> ভর্তি ফি</label>
          <input type="number" {...register("admissionFee")} className="w-full border border-neutral-200 bg-white rounded-xl px-3.5 py-2 text-xs font-bold outline-none text-[#0B5D3B] shadow-3xs" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 uppercase flex items-center gap-0.5"><DollarSign size={10} /> পূর্বের ফি</label>
          <input type="number" {...register("oldAdmissionFee")} className="w-full border border-neutral-200 bg-white rounded-xl px-3.5 py-2 text-xs font-bold outline-none text-neutral-400 line-through shadow-3xs" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 uppercase flex items-center gap-0.5"><DollarSign size={10} /> মাসিক ফি</label>
          <input type="number" {...register("monthlyFee")} className="w-full border border-neutral-200 bg-white rounded-xl px-3.5 py-2 text-xs font-bold outline-none shadow-3xs" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 uppercase flex items-center gap-0.5"><Clock size={10} /> ক্লাস রুটিন শিডিউল</label>
          <input type="text" {...register("classSchedule")} placeholder="যেমন: সপ্তাহে ৩ দিন ক্লাস" className="w-full border border-neutral-200 bg-white rounded-xl px-3.5 py-2 text-xs font-bold outline-none shadow-3xs" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-neutral-400 uppercase">সংক্ষিপ্ত বিবরণ</label>
        <input {...register("description")} placeholder="কোর্স সম্পর্কিত বর্ণনা..." className="w-full border border-neutral-200 bg-white rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-[#0B5D3B] transition-colors shadow-3xs" />
      </div>

      <div className="space-y-2 border-t border-neutral-100 pt-3">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-black text-neutral-500 flex items-center gap-1"><LayoutList size={12} /> ক্লাস হাইলাইটস সমূহ</span>
          <button type="button" onClick={() => appendHighlight({ label: "", value: "" })} className="text-[10px] font-black text-[#0B5D3B] bg-emerald-50 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors">+ নতুন হাইলাইট</button>
        </div>

        <div className="space-y-2">
          {highlightFields.map((field, idx) => (
            <div key={field.id} className="flex items-center gap-2 bg-white p-2.5 border border-neutral-100 rounded-xl shadow-3xs">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input placeholder="লেবেল (যেমন: মোট আসন)" {...register(`highlights.${idx}.label` as const)} className="w-full border border-neutral-200 p-2 rounded-lg text-[11px] font-bold outline-none" />
                <input placeholder="মান (যেমন: ২৫ জন)" {...register(`highlights.${idx}.value` as const)} className="w-full border border-neutral-200 p-2 rounded-lg text-[11px] font-bold outline-none" />
              </div>
              {highlightFields.length > 1 && (
                <button type="button" onClick={() => removeHighlight(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={13} /></button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2.5 border-t border-neutral-100">
        <button disabled={loading} className="bg-neutral-900 hover:bg-neutral-950 text-white px-5 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-[0.98] transition-colors disabled:opacity-50">
          {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> যুক্ত হচ্ছে...</> : <><Plus className="w-3.5 h-3.5" /> উপ-বিভাগ যোগ করুন</>}
        </button>
      </div>
    </form>
  );
}