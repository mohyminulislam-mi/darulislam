"use client";

import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Video,
  Maximize2,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Images,
  Play,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface GalleryImage {
  id: string | number;
  _id?: string;
  url: string;
  image?: string[];
  assetType?: "image" | "video";
  title: string;
  event: string;
  category?: string;
}

export default function GalleryClient({
  initialImages,
}: {
  initialImages: GalleryImage[];
}) {
  const [activeTab, setActiveTab] = useState("photos");
  const [allAssets] = useState<GalleryImage[]>(initialImages || []);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<GalleryImage | null>(null); // ভিডিও পপ-আপ স্টেট
  const [selectedIndex, setSelectedIndex] = useState(0);

  const FALLBACK_IMAGE_PATH = "/images/course-fallback.png";

  // Filter photos and videos from the unified backend API dataset
  const photoAssets = allAssets.filter((item) => item.assetType !== "video");
  const videoAssets = allAssets.filter((item) => item.assetType === "video");

  const currentStream = activeTab === "photos" ? photoAssets : videoAssets;

  const handleNext = () => {
    if (currentStream.length === 0) return;
    const nextIndex =
      selectedIndex === currentStream.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(nextIndex);
    setSelectedImage(currentStream[nextIndex]);
  };

  const handlePrev = () => {
    if (currentStream.length === 0) return;
    const prevIndex =
      selectedIndex === 0 ? currentStream.length - 1 : selectedIndex - 1;
    setSelectedIndex(prevIndex);
    setSelectedImage(currentStream[prevIndex]);
  };

  const getYoutubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "sXO-Y9xOBRQ";
  };

  return (
    <section className="flex flex-col min-h-screen bg-[#F7FBF7] max-w-11/12 mx-auto">
      {/* ব্যানার */}
      <div className="relative h-48 lg:h-64 bg-green-800 flex items-end p-6 lg:p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-repeat" />
        <div className="relative z-10 w-full max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#8FE3A9] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Images size={40} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-4xl font-black">গ্যালারি</h1>
              <p className="text-sm font-bold text-[#F5EFE1]/80 uppercase tracking-widest mt-1">
                ক্যাম্পাসের এক পলক
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto w-full px-4 py-12 space-y-12">
        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="bg-white p-1.5 rounded-2xl shadow-xl flex gap-1 border border-[#0B3D2E]/5">
            <button
              onClick={() => setActiveTab("photos")}
              className={`flex items-center gap-2 px-8 py-3 cursor-pointer rounded-xl font-black transition-all ${
                activeTab === "photos"
                  ? "bg-[#0B3D2E] text-[#F5EFE1]"
                  : "text-[#0B3D2E]/60 hover:bg-[#0B3D2E]/5"
              }`}
            >
              <ImageIcon size={18} /> চিত্র গ্যালারি
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2 px-8 py-3 cursor-pointer rounded-xl font-black transition-all ${
                activeTab === "videos"
                  ? "bg-[#0B3D2E] text-[#F5EFE1]"
                  : "text-[#0B3D2E]/60 hover:bg-[#0B3D2E]/5"
              }`}
            >
              <Video size={18} /> ভিডিও গ্যালারি
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div>
          {activeTab === "photos" ? (
            photoAssets.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 font-bold">
                কোনো ছবি পাওয়া যায়নি।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photoAssets.map((img, i) => {
                  const rawSrc = img.url || img.image;
                  const resolvedSrc =
                    Array.isArray(rawSrc) && rawSrc.length > 0
                      ? rawSrc[0]
                      : typeof rawSrc === "string" && rawSrc.trim() !== ""
                        ? rawSrc
                        : FALLBACK_IMAGE_PATH;

                  return (
                    <motion.div
                      key={img._id || i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => {
                        setSelectedImage(img);
                        setSelectedIndex(i);
                      }}
                      className="group relative aspect-square bg-white rounded-[2rem] overflow-hidden shadow-xl border border-[#0B3D2E]/5 cursor-pointer"
                    >
                      <Image
                        width={500}
                        height={500}
                        src={resolvedSrc}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={img.title || "Gallery Image"}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D2E] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8FE3A9] mb-1">
                          {img.event || "ক্যাম্পাস"}
                        </span>
                        <h3 className="text-xl font-black text-white">
                          {img.title || "দারুল ইসলাম গ্যালারি"}
                        </h3>
                        <div className="absolute top-8 right-8 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                          <Maximize2 size={20} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )
          ) : videoAssets.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 font-bold">
              কোনো ভিডিও পাওয়া যায়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videoAssets.map((vid, i) => {
                const rawVideoSrc = vid.url || vid.image;
                const targetUrl = Array.isArray(rawVideoSrc)
                  ? rawVideoSrc[0]
                  : rawVideoSrc || "";
                const ytId = getYoutubeId(targetUrl);

                return (
                  <motion.div
                    key={vid._id || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedVideo(vid)}
                    className="group relative aspect-video bg-[#0B3D2E] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white cursor-pointer"
                  >
                    {/* YouTube thumbnail visualization */}
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                      alt={vid.title || "Video thumbnail"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#8FE3A9] text-[#0B3D2E] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={32} className="ml-1 fill-current" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                      <h3 className="font-bold text-lg line-clamp-1">
                        {vid.title || "দারুল ইসলাম ভিডিও"}
                      </h3>
                      <p className="text-xs text-[#8FE3A9] font-medium">
                        {vid.event || "ভিডিও গ্যালারি"}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-[#0B3D2E] rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-black">
              আমাদের সম্পর্কে আরও জানতে চান?
            </h2>
            <p className="text-[#F5EFE1]/80 max-w-xl mx-auto">
              আমাদের ইউটিউব চ্যানেলে আপনি মাদরাসার সকল কার্যক্রমের ভিডিও দেখতে
              পাবেন।
            </p>
            <Link
              href="https://www.youtube.com/@darulislamInstitute"
              target="_blank"
              className="inline-flex bg-green-800 text-white px-10 py-4 rounded-2xl font-black items-center gap-3 mx-auto hover:scale-105 transition-transform"
            >
              আমাদের ইউটিউব চ্যানেল <ExternalLink size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage &&
        (() => {
          const modalRawSrc = selectedImage.url || selectedImage.image;
          const modalResolvedSrc =
            Array.isArray(modalRawSrc) && modalRawSrc.length > 0
              ? modalRawSrc[0]
              : typeof modalRawSrc === "string" && modalRawSrc.trim() !== ""
                ? modalRawSrc
                : FALLBACK_IMAGE_PATH;

          return (
            <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white z-50 animate-none"
              >
                <X size={24} />
              </button>

              <button
                onClick={handlePrev}
                className="absolute left-4 lg:left-10 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white z-50 animate-none"
              >
                <ChevronLeft size={30} />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 lg:right-10 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white z-50 animate-none"
              >
                <ChevronRight size={30} />
              </button>

              <motion.div
                key={selectedImage._id || selectedImage.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl w-full flex flex-col items-center"
              >
                <Image
                  src={modalResolvedSrc}
                  alt={selectedImage.title}
                  width={800}
                  height={600}
                  className="w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl"
                />
                <div className="text-center mt-6">
                  <span className="text-[#8FE3A9] uppercase tracking-widest text-xs font-black">
                    {selectedImage.event || "ক্যাম্পাস"}
                  </span>
                  <h2 className="text-white text-3xl font-black mt-2">
                    {selectedImage.title || "দারুল ইসলাম গ্যালারি"}
                  </h2>
                </div>
              </motion.div>
            </div>
          );
        })()}

      {/* Video Preview Modal */}
      {selectedVideo &&
        (() => {
          const rawVideoSrc = selectedVideo.url || selectedVideo.image;
          const targetUrl = Array.isArray(rawVideoSrc)
            ? rawVideoSrc[0]
            : rawVideoSrc || "";
          const ytId = getYoutubeId(targetUrl);

          return (
            <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              {/* Modal Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white z-50"
              >
                <X size={24} />
              </button>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl w-full flex flex-col items-center"
              >
                {/* YouTube Video Player (with autoplay=1) */}
                <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                    title={selectedVideo.title || "YouTube video player"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="text-center mt-6">
                  <span className="text-[#8FE3A9] uppercase tracking-widest text-xs font-black">
                    {selectedVideo.event || "ভিডিও গ্যালারি"}
                  </span>
                  <h2 className="text-white text-2xl lg:text-3xl font-black mt-2">
                    {selectedVideo.title || "দারুল ইসলাম ভিডিও"}
                  </h2>
                </div>
              </motion.div>
            </div>
          );
        })()}
    </section>
  );
}
