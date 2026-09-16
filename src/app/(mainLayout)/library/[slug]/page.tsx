"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import {
  FaMosque,
  FaPrayingHands,
  FaMoon,
  FaBookOpen,
  FaTimes,
  FaFilePdf,
  FaFileAlt,
  FaExpand,
  FaDownload,
  FaHeart,
  FaUsers,
  FaGlobe,
  FaComments,
  FaBookmark,
} from "react-icons/fa";

type BookItem = {
  _id?: string;
  name: string;
  type?: "text" | "pdf";
  content?: string;
  pdfUrl?: string;
  icon?: React.ReactNode;
};

type CategoryMeta = {
  name: string;
  slug: string;
  apiKey: string;
  description: string;
  icon?: React.ReactNode;
};

type ResourceItem = {
  _id: string;
  title: string;
  coverImage: string | null;
  section: string;
  category: string;
  subType: string;
  contentType: "pdf" | "text";
  pdfUrl: string | null;
  textContent: string | null;
};

const categoryMetaList: CategoryMeta[] = [
  {
    name: "কুরআন",
    slug: "quran",
    apiKey: "quran",
    description:
      "এই বিভাগে পবিত্র কুরআনের বাংলা অনুবাদ, তাফসীর, তাজবীদ শিক্ষা এবং বিষয়ভিত্তিক আয়াতের ব্যাখ্যা সংরক্ষণ করা হয়েছে।",
  },
  {
    name: "হাদীস",
    slug: "hadis",
    apiKey: "hadith",
    description:
      "এই বিভাগে সহীহ বুখারী, মুসলিম, তিরমিযীসহ বিভিন্ন হাদীস গ্রন্থ সংরক্ষিত আছে।",
  },
  {
    name: "কিতাব",
    slug: "kitab",
    apiKey: "kitab",
    description:
      "এই বিভাগে আকীদা, ফিকহ, সীরাত, ইসলামী ইতিহাস সম্পর্কিত কিতাবসমূহ রয়েছে।",
  },
  {
    name: "প্রবন্ধ",
    slug: "probondho",
    apiKey: "probondho",
    description:
      "সমসাময়িক বিভিন্ন ইসলামিক বিষয় ও সমাজ সংস্কারমূলক প্রবন্ধ এখানে সংরক্ষিত।",
  },
  {
    name: "নামায",
    slug: "namaz",
    apiKey: "namaz",
    icon: <FaMosque size={24} />,
    description:
      "এই বিভাগে নামাযের নিয়ম, ওযু, সালাতের দোয়া, সুন্নাহ ও গুরুত্বপূর্ণ মাসআলা সহজ ভাষায় তুলে ধরা হয়েছে।",
  },
  {
    name: "দু'আ",
    slug: "dua",
    apiKey: "duwa",
    icon: <FaPrayingHands size={24} />,
    description:
      "ঘুম, খাবার, সফর, অসুস্থতা, নামাযসহ জীবনের বিভিন্ন মুহূর্তের জন্য সহীহ দু'আ ও যিকির এই বিভাগে সংরক্ষিত আছে।",
  },
  {
    name: "তারাবীহ",
    slug: "tarabih",
    apiKey: "tarabihi",
    icon: <FaMoon size={24} />,
    description:
      "এই বিভাগে রমাদান মাসের গুরুত্বপূর্ণ আমল, তারাবীহর নিয়ম, শবে কদর ও রোযার মাসআলা বিস্তারিতভাবে তুলে ধরা হয়েছে।",
  },
  {
    name: "প্রতিবেশী ও পরিবার",
    slug: "family-dawah",
    apiKey: "neighbor",
    icon: <FaHeart size={24} />,
    description:
      "পরিবার, আত্মীয়স্বজন ও প্রতিবেশীদের কাছে ইসলামের সৌন্দর্য ও দাওয়াহ পৌঁছানোর নির্দেশনা।",
  },
  {
    name: "নও-মুসলিম নির্দেশিকা",
    slug: "new-muslim",
    apiKey: "new_muslim",
    icon: <FaUsers size={24} />,
    description:
      "নতুন মুসলিম ভাইবোনদের মৌলিক জ্ঞান, ইসলামী জীবনধারা ও চলার পথের প্রয়োজনীয় গাইড।",
  },
  {
    name: "সমাজ ও দাওয়াহ",
    slug: "society-dawah",
    apiKey: "society",
    icon: <FaGlobe size={24} />,
    description:
      "সমাজে নৈতিকতার প্রসার, সামাজিক সংস্কার ও প্রজ্ঞার সাথে দাওয়াহ সম্প্রসারণের কনটেন্ট।",
  },
  {
    name: "প্রশ্নোত্তর",
    slug: "qa",
    apiKey: "qa",
    icon: <FaComments size={24} />,
    description:
      "সমসাময়িক বিভিন্ন জীবনঘনিষ্ঠ জিজ্ঞাসা ও শরয়ী প্রশ্নের নির্ভরযোগ্য ইসলামী সমাধান।",
  },
];

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default function Page({ params }: Props) {
  const [slug, setSlug] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    params.then((res) => setSlug(res.slug));
  }, [params]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedBook(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const metaData = categoryMetaList.find(
    (item) => item.slug.trim() === slug.trim(),
  );

  useEffect(() => {
    if (!metaData) return;

    const fetchResources = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await axios.get(
          `${baseUrl}/library/resources?category=${metaData.apiKey}`,
        );
        if (res.data?.success && Array.isArray(res.data.data)) {
          setResources(res.data.data);
        } else {
          setResources([]);
        }
      } catch (error) {
        console.error("Failed to fetch resources:", error);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [metaData]);

  // 🎯 Group resources by subType dynamically
  const groupedResources = useMemo(() => {
    const groups: Record<string, ResourceItem[]> = {};
    resources.forEach((item) => {
      const typeKey = item.subType?.trim() || "সাধারণ অনলাইন সংকলন";
      if (!groups[typeKey]) {
        groups[typeKey] = [];
      }
      groups[typeKey].push(item);
    });
    return groups;
  }, [resources]);

  const handleDownloadPdf = async (url?: string, fileName?: string) => {
    if (!url) return;
    try {
      setDownloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });

      const blobUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${fileName || "document"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  if (!slug)
    return <div className="text-center py-20 text-gray-500">লোডিং...</div>;

  if (!metaData) {
    return (
      <div className="text-center py-20 text-red-500 font-bold">
        ক্যাটাগরি খুঁজে পাওয়া যায়নি
      </div>
    );
  }

  const handleBookClick = (item: ResourceItem) => {
    setSelectedBook({
      _id: item._id,
      name: item.title,
      type: item.contentType,
      pdfUrl: item.pdfUrl || undefined,
      content: item.textContent || undefined,
    });
  };

  return (
    <section className="bg-[#f7faf7] min-h-screen mt-10 pb-20">
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              {metaData.icon && (
                <div className="text-[#1a4731] text-2xl">{metaData.icon}</div>
              )}
              <h2 className="text-2xl font-bold text-[#1a4731]">
                {metaData.name}
              </h2>
            </div>

            <span className="bg-[#e8f5ee] text-[#1a4731] text-sm font-semibold px-5 py-2 rounded-full">
              মোট বই: {resources.length}
            </span>
          </div>

          <p className="text-gray-600 leading-8 mb-10">
            {metaData.description}
          </p>

          {/* Dynamic Content Grid Grouped by subType */}
          <div>
            {loading ? (
              <div className="text-center py-10 text-gray-500">
                তথ্য লোড করা হচ্ছে...
              </div>
            ) : Object.keys(groupedResources).length > 0 ? (
              <div className="space-y-10">
                {Object.entries(groupedResources).map(
                  ([subTypeTitle, items]) => (
                    <div key={subTypeTitle} className="space-y-4">
                      {/* SubType Section Header */}
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <FaBookmark className="text-[#1a4731] text-sm" />
                        <h3 className="text-lg md:text-xl font-bold text-gray-800">
                          {subTypeTitle}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium ml-1">
                          {items.length}
                        </span>
                      </div>

                      {/* Books Grid under this subType */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {items.map((item) => {
                          const isPdf = item.contentType === "pdf";

                          return (
                            <button
                              key={item._id}
                              onClick={() => handleBookClick(item)}
                              className="group text-left bg-[#f8fbf8] cursor-pointer border border-gray-200/60 hover:border-[#1a4731]/40 hover:bg-white rounded-2xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-4">
                                {/* 🎯 Updated Cover Image Frame (w-14 h-18 with object-contain to show full height) */}
                                <div className="w-14 h-18 relative shrink-0 rounded-xl overflow-hidden bg-[#e8f5ee] border border-gray-200 flex items-center justify-center text-[#1a4731] p-1">
                                  {item.coverImage ? (
                                    <Image
                                      src={item.coverImage}
                                      alt={item.title}
                                      fill
                                      sizes="56px"
                                      className="object-contain object-center p-0.5"
                                    />
                                  ) : isPdf ? (
                                    <FaFilePdf size={24} />
                                  ) : (
                                    <FaBookOpen size={24} />
                                  )}
                                </div>

                                <div>
                                  <p className="font-bold text-gray-800 group-hover:text-[#1a4731] transition-colors line-clamp-2 leading-snug">
                                    {item.title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    {isPdf
                                      ? "PDF ফাইল (পড়ুন ও ডাউনলোড)"
                                      : "টেক্সট / বিস্তারিত"}
                                  </p>
                                </div>
                              </div>

                              <div className="text-gray-400 group-hover:text-[#1a4731] transition-colors shrink-0 ml-2">
                                <FaExpand size={14} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                এই ক্যাটাগরিতে কোনো বই বা কন্টেন্ট পাওয়া যায়নি।
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal / Popup Reader */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedBook(null)}
          ></div>

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden z-10 border border-emerald-100 animate-scaleUp">
            <div className="flex items-center justify-between px-6 py-4 bg-[#f8fbf8] border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-[#e8f5ee] text-[#1a4731] rounded-lg">
                  {selectedBook.type === "pdf" ? (
                    <FaFilePdf size={18} />
                  ) : (
                    <FaFileAlt size={18} />
                  )}
                </span>
                <h3 className="text-lg font-bold text-gray-800 truncate max-w-xs sm:max-w-md">
                  {selectedBook.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {selectedBook.type === "pdf" && selectedBook.pdfUrl && (
                  <button
                    onClick={() =>
                      handleDownloadPdf(selectedBook.pdfUrl, selectedBook.name)
                    }
                    disabled={downloading}
                    className="flex items-center gap-2 bg-[#e8f5ee] hover:bg-[#1a4731] text-[#1a4731] hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <FaDownload size={12} />
                    <span className="hidden sm:inline">
                      {downloading ? "ডাউনলোড হচ্ছে..." : "ডাউনলোড"}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedBook(null)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {selectedBook.type === "pdf" && selectedBook.pdfUrl ? (
                <div className="w-full h-[60vh] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                  <iframe
                    src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
                      selectedBook.pdfUrl,
                    )}`}
                    className="w-full h-full border-none"
                    title={selectedBook.name}
                  />
                </div>
              ) : (
                <div
                  className="prose max-w-none text-gray-700 leading-relaxed text-base font-normal bg-slate-50/50 p-6 rounded-2xl border border-gray-100"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedBook.content ||
                      `"${selectedBook.name}" সম্পর্কে কোন তথ্য পাওয়া যায়নি।`,
                  }}
                />
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
              <span className="text-xs text-gray-500 hidden sm:inline">
                ইলেকট্রনিক ইসলামিক লাইব্রেরি
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {selectedBook.type === "pdf" && selectedBook.pdfUrl && (
                  <button
                    onClick={() =>
                      handleDownloadPdf(selectedBook.pdfUrl, selectedBook.name)
                    }
                    disabled={downloading}
                    className="flex items-center justify-center gap-2 bg-[#1a4731] hover:bg-[#123323] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <FaDownload size={14} />
                    <span>
                      {downloading ? "ডাউনলোড হচ্ছে..." : "পিডিএফ ডাউনলোড"}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedBook(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 cursor-pointer rounded-xl text-sm font-semibold transition-all"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}