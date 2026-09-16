"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Upload,
  UserPlus,
  Image as ImageIcon,
  Edit3,
  Facebook,
} from "lucide-react";

type SectionType =
  | "hero"
  | "stats"
  | "importance"
  | "team_gallery"
  | "committee";

export default function StaticSectionTab({ pageName }: { pageName: string }) {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [selectedSection, setSelectedSection] = useState<SectionType>("hero");

  const [singleFiles, setSingleFiles] = useState<Record<string, File>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [teamFiles, setTeamFiles] = useState<FileList | null>(null);
  const [memberFiles, setMemberFiles] = useState<Record<number, File>>({});
  const [memberPreviews, setMemberPreviews] = useState<Record<number, string>>(
    {},
  );
  const [expandedMemberIndex, setExpandedMemberIndex] = useState<number | null>(
    null,
  );

  const { data: sectionData, isLoading } = useQuery({
    queryKey: ["sectionContent", pageName, selectedSection],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/content/page/${pageName}/section/${selectedSection}`,
      );
      return res.data?.content || {};
    },
  });

  useEffect(() => {
    return () => {
      Object.values(previews).forEach(URL.revokeObjectURL);
      Object.values(memberPreviews).forEach(URL.revokeObjectURL);
    };
  }, [previews, memberPreviews]);

  const handleFileChange = (key: string, file: File | undefined) => {
    if (!file) return;
    setSingleFiles((prev) => ({ ...prev, [key]: file }));
    const objectUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [key]: objectUrl }));
  };

  const handleMemberFileChange = (index: number, file: File | undefined) => {
    if (!file) return;
    setMemberFiles((prev) => ({ ...prev, [index]: file }));
    const objectUrl = URL.createObjectURL(file);
    setMemberPreviews((prev) => ({ ...prev, [index]: objectUrl }));
  };

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosSecure.put(
        `/content/page/${pageName}/section/${selectedSection}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sectionContent", pageName, selectedSection],
      });
      setSingleFiles({});
      setPreviews({});
      setTeamFiles(null);
      setMemberFiles({});
      setMemberPreviews({});
      setExpandedMemberIndex(null);
      Swal.fire({
        icon: "success",
        title: "সংরক্ষিত!",
        text: "কন্টেন্ট সফলভাবে আপডেট হয়েছে ভাই।",
        confirmButtonColor: "#0B5D3B",
        customClass: { popup: "rounded-[2rem]" },
      });
    },
    onError: (err: any) => {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: err.response?.data?.message || "সংরক্ষণ করা যায়নি",
        confirmButtonColor: "#d33",
      });
    },
  });

  const handleSaveHero = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    fd.forEach((val, key) => {
      if (
        ![
          "mainImage",
          "bookcaseImage",
          "libraryImage",
          "studentsImage",
        ].includes(key)
      )
        data[key] = val;
    });

    ["mainImage", "bookcaseImage", "libraryImage", "studentsImage"].forEach(
      (imgKey) => {
        if (!singleFiles[imgKey] && sectionData[imgKey]) {
          data[imgKey] = sectionData[imgKey];
        }
      },
    );

    const rootFormData = new FormData();
    rootFormData.append("content", JSON.stringify(data));
    Object.keys(singleFiles).forEach((key) =>
      rootFormData.append(key, singleFiles[key]),
    );
    updateMutation.mutate(rootFormData);
  };

  const handleSaveStats = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const statsArray = [
      { count: fd.get("count0"), label: fd.get("label0") },
      { count: fd.get("count1"), label: fd.get("label1") },
      { count: fd.get("count2"), label: fd.get("label2") },
      { count: fd.get("count3"), label: fd.get("label3") },
    ];

    const textData = {
      heading: fd.get("heading"),
      stats: statsArray,
      successImage: sectionData.successImage || "",
    };

    const rootFormData = new FormData();
    rootFormData.append("content", JSON.stringify(textData));

    if (singleFiles["successImage"]) {
      rootFormData.append("successImage", singleFiles["successImage"]);
    }

    updateMutation.mutate(rootFormData);
  };

  const handleSaveImportance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const textData = {
      title: fd.get("title"),
      highlightedText: fd.get("highlightedText"),
      authorName: fd.get("authorName"),
      authorDesignation: fd.get("authorDesignation"),
      paragraphs: [
        fd.get("p1"),
        fd.get("p2"),
        fd.get("p3"),
        fd.get("p4"),
      ].filter(Boolean),
      profileImage: sectionData.profileImage || "",
    };
    const rootFormData = new FormData();
    rootFormData.append("content", JSON.stringify(textData));
    if (singleFiles["profileImage"])
      rootFormData.append("profileImage", singleFiles["profileImage"]);
    updateMutation.mutate(rootFormData);
  };

  const handleSaveTeamGallery = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const existingImages = sectionData.images || [];
    const rootFormData = new FormData();
    rootFormData.append(
      "content",
      JSON.stringify({
        title: fd.get("title"),
        description: fd.get("description"),
        images: existingImages,
      }),
    );
    if (teamFiles) {
      for (let i = 0; i < teamFiles.length; i++)
        rootFormData.append("images", teamFiles[i]);
    }
    updateMutation.mutate(rootFormData);
  };

  const handleSaveCommittee = (membersList: any[]) => {
    const rootFormData = new FormData();
    rootFormData.append(
      "content",
      JSON.stringify({
        title: sectionData.title || "পরিচিতি",
        description: sectionData.description || "",
        members: membersList,
      }),
    );
    Object.keys(memberFiles).forEach((idx) => {
      rootFormData.append(`members[${idx}][image]`, memberFiles[Number(idx)]);
    });
    updateMutation.mutate(rootFormData);
  };

  if (pageName !== "about") {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-sm font-black text-slate-700">
          এই পৃষ্ঠাটি শুধুমাত্র &quot;about&quot; পেজ ম্যানেজমেন্ট সাপোর্ট করে
          ভাই।
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full p-3 text-xs sm:text-sm font-bold bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] text-slate-900 shadow-3xs transition-all placeholder:text-slate-400";
  const labelClass =
    "block text-xs font-black text-slate-700 tracking-wide uppercase";

  const imageLabelMap: Record<string, string> = {
    mainImage: "ছবি-১",
    bookcaseImage: "ছবি-২",
    libraryImage: "ছবি-৩",
    studentsImage: "ছবি-৪",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100">
        {(
          ["hero", "stats", "importance", "team_gallery", "committee"] as const
        ).map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`px-4 py-2.5 text-xs font-black rounded-xl border transition-all cursor-pointer ${
              selectedSection === sec
                ? "bg-[#0B5D3B] text-white border-transparent shadow-md shadow-emerald-950/20"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {sec === "hero" && "প্রধান ব্যানার (Hero)"}
            {sec === "stats" && "পরিসংখ্যান (Stats)"}
            {sec === "importance" && "দ্বীনি শিক্ষা গুরুত্ব"}
            {sec === "team_gallery" && "টিম গ্যালারি স্লাইডার"}
            {sec === "committee" && "পরিচালনা পরিষদ"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col justify-center items-center bg-slate-50/50 rounded-2xl border border-slate-100">
          <Loader2 className="animate-spin text-[#0B5D3B]" size={32} />
        </div>
      ) : (
        <div className="w-full">
          <div className="bg-white border border-slate-100 p-4 sm:p-6 rounded-2xl shadow-2xs">
            {/* 1. HERO SECTION FORM */}
            {selectedSection === "hero" && (
              <form onSubmit={handleSaveHero} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelClass}>সাবটাইটেল</label>
                    <input
                      type="text"
                      name="subtitle"
                      defaultValue={sectionData.subtitle || "আমাদের সম্পর্কে"}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>শিরোনাম লাইন ১</label>
                    <input
                      type="text"
                      name="titleLine1"
                      defaultValue={sectionData.titleLine1 || ""}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>শিরোনাম লাইন ২</label>
                    <input
                      type="text"
                      name="titleLine2"
                      defaultValue={sectionData.titleLine2 || ""}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>শিরোনাম লাইন ৩</label>
                    <input
                      type="text"
                      name="titleLine3"
                      defaultValue={sectionData.titleLine3 || ""}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>বিস্তারিত বিবরণ</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={sectionData.description || ""}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {[
                    "mainImage",
                    "bookcaseImage",
                    "libraryImage",
                    "studentsImage",
                  ].map((imgKey) => {
                    const displaySrc = previews[imgKey] || sectionData[imgKey];
                    return (
                      <div
                        key={imgKey}
                        className="border border-slate-100 bg-slate-50/50 p-3 rounded-xl flex flex-col items-center justify-between text-center gap-3 group hover:border-[#0B5D3B]/20 transition-all"
                      >
                        <span className="text-[10px] font-black uppercase text-slate-800 tracking-wider bg-slate-200/60 px-2 py-0.5 rounded">
                          {imageLabelMap[imgKey]}
                        </span>
                        <div className="relative w-full aspect-[4/3] rounded-lg border border-slate-200 bg-white overflow-hidden shadow-3xs flex items-center justify-center">
                          {displaySrc ? (
                            <img
                              src={displaySrc}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          ) : (
                            <ImageIcon className="text-slate-300 w-8 h-8" />
                          )}
                        </div>
                        <label className="w-full flex items-center justify-center gap-1.5 py-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-[#0B5D3B]/30 text-slate-700 hover:text-[#0B5D3B] rounded-xl text-[11px] font-black cursor-pointer transition-all shadow-3xs">
                          <Upload size={12} />{" "}
                          <span>{previews[imgKey] ? "পরিবর্তন" : "আপলোড"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileChange(imgKey, e.target.files?.[0])
                            }
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full py-3.5 bg-[#0B5D3B] hover:bg-[#094f2d] text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/10 transition-all"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Save size={14} />
                  )}{" "}
                  কন্টেন্ট সংরক্ষণ করুন
                </button>
              </form>
            )}

            {/* 2. STATS SECTION FORM */}
            {selectedSection === "stats" && (
              <form onSubmit={handleSaveStats} className="space-y-5">
                <div className="space-y-1.5">
                  <label className={labelClass}>মূল শিরোনাম</label>
                  <input
                    type="text"
                    name="heading"
                    defaultValue={
                      sectionData.heading || "একনজরে আমাদের সাফল্যসমূহ"
                    }
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 grid grid-cols-2 gap-3"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700">
                          লেবেল (যেমন: শিক্ষার্থী)
                        </label>
                        <input
                          type="text"
                          name={`label${idx}`}
                          defaultValue={sectionData.stats?.[idx]?.label || ""}
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700">
                          কাউন্ট (যেমন: ২৫০০+)
                        </label>
                        <input
                          type="text"
                          name={`count${idx}`}
                          defaultValue={sectionData.stats?.[idx]?.count || ""}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl flex items-center justify-between gap-4 col-span-1 md:col-span-2">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-3xs flex items-center justify-center shrink-0">
                        {previews["successImage"] ||
                        sectionData.successImage ? (
                          <img
                            src={
                              previews["successImage"] ||
                              sectionData.successImage
                            }
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <ImageIcon className="text-slate-300 w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-800 block">
                          সেকশন ব্যানার ছবি
                        </span>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                          আর্চ আকৃতির ফ্রেম ছবি
                        </p>
                      </div>
                    </div>
                    <label className="px-4 py-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-[#0B5D3B]/30 text-slate-700 hover:text-[#0B5D3B] rounded-xl text-xs font-black cursor-pointer transition-all shadow-3xs">
                      <Upload size={12} className="inline mr-1" />{" "}
                      <span>
                        {previews["successImage"] ? "পরিবর্তন" : "আপলোড"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileChange("successImage", e.target.files?.[0])
                        }
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full py-3.5 bg-[#0B5D3B] hover:bg-[#094f2d] text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/10 transition-all"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Save size={14} />
                  )}{" "}
                  কন্টেন্ট সংরক্ষণ করুন
                </button>
              </form>
            )}

            {/* 3. IMPORTANCE SECTION FORM */}
            {selectedSection === "importance" && (
              <form onSubmit={handleSaveImportance} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelClass}>সেকশন শিরোনাম</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={sectionData.title || ""}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      হাইলাইটেড হাদিস/উক্তি টেক্সট
                    </label>
                    <input
                      type="text"
                      name="highlightedText"
                      defaultValue={sectionData.highlightedText || ""}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>লেখক/উস্তাদের নাম</label>
                    <input
                      type="text"
                      name="authorName"
                      defaultValue={sectionData.authorName || ""}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>পদবী বিবরণী</label>
                    <input
                      type="text"
                      name="authorDesignation"
                      defaultValue={sectionData.authorDesignation || ""}
                      className={inputClass}
                    />
                  </div>
                </div>
                {[1, 2, 3, 4].map((num, i) => (
                  <div key={num} className="space-y-1.5">
                    <label className="text-xs font-black text-slate-600">
                      প্যারাগ্রাফ {num}
                    </label>
                    <textarea
                      name={`p${num}`}
                      rows={2}
                      defaultValue={sectionData.paragraphs?.[i] || ""}
                      className={`${inputClass} resize-none font-medium`}
                    />
                  </div>
                ))}

                <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-3xs flex items-center justify-center shrink-0">
                      {previews["profileImage"] || sectionData.profileImage ? (
                        <img
                          src={
                            previews["profileImage"] || sectionData.profileImage
                          }
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <ImageIcon className="text-slate-300 w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">
                        উস্তাদের প্রোফাইল ছবি
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                        জেপিজি বা পিএনজি ফরম্যাট ম্যাপ করুন
                      </p>
                    </div>
                  </div>
                  <label className="px-4 py-2.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-[#0B5D3B]/30 text-slate-700 hover:text-[#0B5D3B] rounded-xl text-xs font-black cursor-pointer transition-all shadow-3xs">
                    <Upload size={14} className="inline mr-1" />{" "}
                    <span>
                      {previews["profileImage"] ? "পরিবর্তন করুন" : "ছবি আপলোড"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange("profileImage", e.target.files?.[0])
                      }
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full py-3.5 bg-[#0B5D3B] hover:bg-[#094f2d] text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/10 transition-all"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Save size={14} />
                  )}{" "}
                  কন্টেন্ট সংরক্ষণ করুন
                </button>
              </form>
            )}

            {/* 4. TEAM GALLERY FORM */}
            {selectedSection === "team_gallery" && (
              <form onSubmit={handleSaveTeamGallery} className="space-y-5">
                <div className="space-y-1.5">
                  <label className={labelClass}>মূল শিরোনাম</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={
                      sectionData.title || "দারুল ইসলাম ইনস্টিটিউট মাদ্রাসা টিম"
                    }
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>টিম ডেসক্রিপশন</label>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={sectionData.description || ""}
                    className={`${inputClass} resize-none font-medium`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>সংরক্ষিত স্লাইডার ইমেজেস</label>

                  {!sectionData.images || sectionData.images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center p-4">
                      <ImageIcon className="text-slate-300 w-10 h-10 mb-2" />
                      <span className="text-xs font-black text-slate-700">
                        কোনো ছবি সংরক্ষিত নেই ভাই
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                        নিচের আপলোড বক্সের মাধ্যমে নতুন স্লাইড ইমেজ এড করুন।
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 bg-slate-50/50 p-4 border border-slate-100 rounded-xl">
                      {sectionData.images.map((url: string, index: number) => (
                        <div
                          key={index}
                          className="relative aspect-[4/3] rounded-xl overflow-hidden border bg-white group shadow-3xs"
                        >
                          <img
                            src={url}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const currentImages = [
                                ...(sectionData.images || []),
                              ];
                              currentImages.splice(index, 1);
                              const rootFormData = new FormData();
                              rootFormData.append(
                                "content",
                                JSON.stringify({
                                  ...sectionData,
                                  images: currentImages,
                                }),
                              );
                              updateMutation.mutate(rootFormData);
                            }}
                            className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-2 border-dashed border-slate-200 bg-white p-5 rounded-xl text-center relative group hover:border-[#0B5D3B] transition-all cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setTeamFiles(e.target.files)}
                  />
                  <Upload
                    size={24}
                    className="mx-auto text-slate-400 group-hover:text-[#0B5D3B] mb-2 transition-colors"
                  />
                  <span className="text-xs font-black text-slate-700 block">
                    {teamFiles
                      ? `নির্বাচিত: ${teamFiles.length}টি নতুন ফাইল`
                      : "নতুন স্লাইড ইমেজ যুক্ত করুন (একাধিক সম্ভব)"}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full py-3.5 bg-[#0B5D3B] hover:bg-[#094f2d] text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/10 transition-all"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Save size={14} />
                  )}{" "}
                  কন্টেন্ট সংরক্ষণ করুন
                </button>
              </form>
            )}

            {/* 5. COMMITTEE MEMBERS MODULE WITH 2-COLUMN BIG IMAGE CARDS */}
            {selectedSection === "committee" && (
              <div className="space-y-5">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className={labelClass}>
                    পরিষদ মেম্বার প্যানেল লিস্ট
                  </span>
                  <button
                    onClick={() => {
                      const existing = [...(sectionData.members || [])];
                      existing.push({
                        id: Date.now(),
                        name: "নতুন মেম্বার",
                        role: "পদবী",
                        category: "পরিচলনা পরিষদ",
                        details: "",
                        fbLink: "",
                      });
                      handleSaveCommittee(existing);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-[#0B5D3B] text-white rounded-xl text-xs font-black cursor-pointer transition-all shadow-sm"
                  >
                    <UserPlus size={14} /> <span>মেম্বার যোগ করুন</span>
                  </button>
                </div>

                {/* 🎯 Modern High-UX 2-Column Responsive Card Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {(sectionData.members || []).map(
                    (member: any, index: number) => {
                      const currentMemberImage =
                        memberPreviews[index] || member.image;
                      const isExpanded = expandedMemberIndex === index;

                      return (
                        <div
                          key={member.id || index}
                          className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg"
                        >
                          {/* Big Image Presentation Frame Container */}
                          <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden shrink-0 border-b border-slate-100">
                            {currentMemberImage ? (
                              <img
                                src={currentMemberImage}
                                className="w-full h-full object-cover"
                                alt=""
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-2">
                                <ImageIcon size={32} />
                                <span className="text-[10px] font-black uppercase tracking-wider">
                                  কোনো ছবি নেই
                                </span>
                              </div>
                            )}
                            <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-md text-white border border-white/10 text-[10px] font-semibold px-2.5 py-1 rounded-xl uppercase tracking">
                              {member.category || "সাধারণ পরিষদ"}
                            </div>
                          </div>

                          {/* Identity & Controller Action Row */}
                          <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-slate-50/40">
                            <div>
                              <h4 className="text-sm font-black text-slate-800 line-clamp-1">
                                {member.name || "নতুন মেম্বার"}
                              </h4>
                              <p className="text-xs font-semibold text-slate-600 mt-0.5 line-clamp-1">
                                {member.role || "পদবী সেট করা নেই"}
                              </p>
                              {member.details && (
                                <p className="text-[11px] font-medium mt-2 line-clamp-2 border-t border-slate-200/40 pt-1.5 leading-relaxed">
                                  {member.details}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-200/40">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedMemberIndex(
                                    isExpanded ? null : index,
                                  )
                                }
                                className={`p-2 bg-white hover:bg-emerald-50 text-slate-600 hover:text-[#0B5D3B] border border-slate-200/60 rounded-xl transition-all shadow-3xs flex items-center justify-center cursor-pointer ${isExpanded ? "ring-2 ring-[#0B5D3B]/20 border-[#0B5D3B]" : ""}`}
                                title="সম্পাদনা করুন"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const existing = [
                                    ...(sectionData.members || []),
                                  ];
                                  existing.splice(index, 1);
                                  handleSaveCommittee(existing);
                                }}
                                className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200/60 rounded-xl transition-all shadow-3xs flex items-center justify-center cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          {/* Collapsible Inner Inputs Panel Configurator */}
                          {isExpanded && (
                            <div className="p-4 bg-white border-t border-slate-100 space-y-4 animate-fadeIn md:col-span-2 w-full">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-800">
                                    নাম
                                  </label>
                                  <input
                                    type="text"
                                    defaultValue={member.name}
                                    onChange={(e) => {
                                      const list = [...sectionData.members];
                                      list[index].name = e.target.value;
                                    }}
                                    className={inputClass}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-800">
                                    পদবী (Role)
                                  </label>
                                  <input
                                    type="text"
                                    defaultValue={member.role}
                                    onChange={(e) => {
                                      const list = [...sectionData.members];
                                      list[index].role = e.target.value;
                                    }}
                                    className={inputClass}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-800">
                                    ক্যাটেগরি গ্রুপ
                                  </label>
                                  <select
                                    defaultValue={
                                      member.category || "পরিচালনা পরিষদ"
                                    }
                                    onChange={(e) => {
                                      const list = [...sectionData.members];
                                      list[index].category = e.target.value;
                                    }}
                                    className={`${inputClass} text-slate-700`}
                                  >
                                    <option value="পরিচালনা পরিষদ">
                                      পরিচালনা পরিষদ
                                    </option>
                                    <option value="উস্তাদ প্যানেল">
                                      উস্তাদ প্যানেল
                                    </option>
                                    <option value="উস্তাযা প্যানেল">
                                      উস্তাযা প্যানেল
                                    </option>
                                    <option value="এডমিশন এন্ড সাপোর্ট প্যানেল">
                                      এডমিশন এন্ড সাপোর্ট প্যানেল
                                    </option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-800">
                                    পরিচিতি বিবরণ
                                  </label>
                                  <input
                                    type="text"
                                    defaultValue={member.details}
                                    onChange={(e) => {
                                      const list = [...sectionData.members];
                                      list[index].details = e.target.value;
                                    }}
                                    className={inputClass}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-800">
                                    ফেসবুক লিংক (ঐচ্ছিক)
                                  </label>
                                  <input
                                    type="text"
                                    defaultValue={member.fbLink}
                                    onChange={(e) => {
                                      const list = [...sectionData.members];
                                      list[index].fbLink = e.target.value;
                                    }}
                                    className={inputClass}
                                  />
                                </div>
                              </div>

                              <div className="pt-1">
                                <label className="px-3 py-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-[#0B5D3B]/30 text-slate-700 hover:text-[#0B5D3B] rounded-xl text-[11px] font-black cursor-pointer transition-all shadow-3xs inline-flex items-center gap-1">
                                  <Upload size={12} />{" "}
                                  <span>
                                    {memberFiles[index]
                                      ? "ছবি নির্বাচিত"
                                      : "নতুন ছবি আপলোড"}
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleMemberFileChange(
                                        index,
                                        e.target.files?.[0],
                                      )
                                    }
                                  />
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveCommittee(sectionData.members || [])}
                  disabled={updateMutation.isPending}
                  className="w-full mt-2 py-3.5 bg-[#0B5D3B] hover:bg-[#094f2d] text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/10 transition-all"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Save size={14} />
                  )}{" "}
                  <span>মেম্বার প্যানেল ডাটাবেজে সেভ করুন</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
