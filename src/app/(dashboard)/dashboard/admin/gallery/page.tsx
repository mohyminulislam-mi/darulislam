"use client";

import React, { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  Upload,
  ImageIcon,
  RefreshCw,
  Film,
  Link2,
  LayoutGrid,
  Calendar,
} from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";

interface GalleryAlbum {
  _id: string;
  title: string;
  event: string;
  assetType: "image" | "video";
  image: string[];
  createdAt: string;
}

const GalleryAdmin: React.FC = () => {
  const axiosSecure = useAxiosSecure();

  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [title, setTitle] = useState<string>("");
  const [event, setEvent] = useState<string>("campus");
  const [assetType, setAssetType] = useState<"image" | "video">("image");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const fetchGallery = async (targetPage: number) => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/gallery?page=${targetPage}&limit=9`);
      if (res.data && res.data.data) {
        setAlbums(res.data.data);
        setTotalPages(res.data.totalPages || 1);
        setPage(res.data.currentPage || 1);
      }
    } catch (err) {
      console.error("Error fetching admin gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(1);
  }, [axiosSecure]);

  const handleAddAlbum = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "শিরোনাম প্রয়োজন",
        confirmButtonColor: "#0B5D3B",
      });
      return;
    }

    if (assetType === "video" && !videoUrl.trim()) {
      Swal.fire({
        icon: "warning",
        title: "ভিডিও লিংক প্রয়োজন",
        confirmButtonColor: "#0B5D3B",
      });
      return;
    }

    if (
      assetType === "image" &&
      (!selectedFiles || selectedFiles.length === 0)
    ) {
      Swal.fire({
        icon: "warning",
        title: "ছবি নির্বাচন করুন",
        confirmButtonColor: "#0B5D3B",
      });
      return;
    }

    setActionLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("event", event);
    formData.append("assetType", assetType);

    if (assetType === "video") {
      formData.append("videoUrl", videoUrl);
    } else if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("image", selectedFiles[i]);
      }
    }

    try {
      const res = await axiosSecure.post("/gallery/admin/add-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "সফল হয়েছে!",
          text: "নতুন ফাইলটি সফলভাবে গ্যালারিতে যোগ হয়েছে।",
          confirmButtonColor: "#0B5D3B",
          timer: 2000,
        });

        setTitle("");
        setVideoUrl("");
        setSelectedFiles(null);

        const fileInput = document.getElementById(
          "file-upload",
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        fetchGallery(1);
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "আপলোড ব্যর্থ!",
        text: err.response?.data?.message || "সংরক্ষণ করতে সমস্যা হয়েছে।",
        confirmButtonColor: "#d33",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এটি স্থায়ীভাবে গ্যালারি থেকে মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748B",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "বাতিল",
      customClass: { popup: "rounded-[2rem]" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setActionLoading(true);
        try {
          const res = await axiosSecure.delete(`/gallery/admin/${id}`);
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "মুছে ফেলা হয়েছে!",
              confirmButtonColor: "#0B5D3B",
              timer: 1500,
            });

            const updatedAlbums = albums.filter((album) => album._id !== id);
            if (updatedAlbums.length === 0 && page > 1) {
              fetchGallery(page - 1);
            } else {
              fetchGallery(page);
            }
          }
        } catch (err: any) {
          Swal.fire({
            icon: "error",
            title: "ব্যর্থ হয়েছে",
            text: err.response?.data?.message || "মুছে ফেলা যায়নি।",
            confirmButtonColor: "#d33",
          });
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const getYoutubeEmbed = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 12 ? match[2] : match ? match[2] : null;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-[#F8FAFC] min-h-screen text-slate-800">
      {/* Page Header */}
      <div className="relative bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden mb-8">
        <div className="absolute top-0 left-0 h-full w-1.5 bg-[#0B5D3B]" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-[#0B5D3B]" /> গ্যালারি
              ম্যানেজমেন্ট প্যানেল
            </h1>
            <p className="text-xs md:text-sm font-medium text-slate-400 mt-0.5">
              ক্যাম্পাস লাইফ ও ইভেন্ট গ্যালারির চিত্র ও ভিডিও মডিউল কন্ট্রোল
              করুন।
            </p>
          </div>
          <button
            onClick={() => fetchGallery(page)}
            className="w-fit flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer shrink-0"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#0B5D3B]" : ""}`}
            />
            <span>রিফ্রেশ ডাটা</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Operations Form Form Column */}
        <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/40 sticky top-24">
          <h2 className="text-base font-black text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-50 pb-3">
            <Plus className="w-5 h-5 text-[#0B5D3B]" /> নতুন গ্যালারি আইটেম
          </h2>

          <form onSubmit={handleAddAlbum} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                আইটেম শিরোনাম
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: পুরস্কার বিতরণী অনুষ্ঠান ২০২৬"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-all font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 text-slate-400 uppercase tracking-wide mb-1.5">
                ইভেন্ট ক্যাটাগরি (ট্যাগ)
              </label>
              <select
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-all font-bold cursor-pointer"
              >
                <option value="campus">ক্যাম্পাস (campus)</option>
                <option value="cultural">সাংস্কৃতিক (cultural)</option>
                <option value="academic">একাডেমিক (academic)</option>
                <option value="prayer">ইবাদত/অন্যান্য (prayer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 text-slate-400 uppercase tracking-wide mb-2">
                মিডিয়া টাইপ সিলেক্ট করুন
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/40">
                <button
                  type="button"
                  onClick={() => setAssetType("image")}
                  className={`py-2 rounded-lg text-xs font-black tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    assetType === "image"
                      ? "bg-white text-[#0B5D3B] shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <ImageIcon size={14} /> <span>চিত্র</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAssetType("video")}
                  className={`py-2 rounded-lg text-xs font-black tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    assetType === "video"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <Film size={14} /> <span>ভিডিও</span>
                </button>
              </div>
            </div>

            {assetType === "image" ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 text-slate-400 uppercase tracking-wide mb-1.5">
                  ছবি নির্বাচন করুন (একাধিক সম্ভব)
                </label>
                <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 text-center hover:bg-slate-100/50 transition-all cursor-pointer group">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*"
                    onChange={(e) => setSelectedFiles(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 mx-auto text-slate-400 group-hover:text-[#0B5D3B] mb-2 transition-colors" />
                  <span className="text-xs font-bold text-slate-500 block">
                    {selectedFiles && selectedFiles.length > 0
                      ? `নির্বাচিত: ${selectedFiles.length} টি ছবি`
                      : "এক বা একাধিক ছবি সিলেক্ট করুন"}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 text-slate-400 uppercase tracking-wide mb-1.5">
                  ইউটিউব ভিডিও ইউআরএল (URL)
                </label>
                <div className="relative">
                  <Link2
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#0B5D3B]/20 focus:border-[#0B5D3B] transition-all font-semibold"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={actionLoading || loading}
              className="w-full py-3 bg-[#0B5D3B] hover:bg-[#094f2d] text-white font-semibold rounded-xl text-xs md:text-sm uppercase tracking-wider shadow-md shadow-emerald-900/10 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {actionLoading ? "সংরক্ষণ হচ্ছে..." : "গ্যালারিতে পোস্ট করুন"}
            </button>
          </form>
        </div>

        {/* Dynamic High-Contrast Bento Gallery Stream */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/40">
            <h2 className="text-base font-black text-slate-800 mb-6 flex items-center justify-between border-b border-slate-50 pb-3">
              <span>সংরক্ষিত অ্যালবাম ও ভিডিওসমূহ</span>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                মোট: {albums.length}টি অ্যালবাম
              </span>
            </h2>

            {loading && page === 1 ? (
              <div className="text-center py-20">
                <div className="w-8 h-8 border-4 border-[#0B5D3B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-400 font-bold">
                  মিডিয়া ফাইল লোড হচ্ছে...
                </p>
              </div>
            ) : albums.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-xs font-bold">
                গ্যালারিতে বর্তমানে কোনো ডেটা পাওয়া যায়নি।
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {albums.map((album) => {
                  const isVideo =
                    album.assetType === "video" ||
                    (!album.image?.[0]?.includes("http") &&
                      !album.image?.[0]?.includes("/"));
                  const ytId =
                    isVideo && album.image?.[0]
                      ? getYoutubeEmbed(album.image[0])
                      : null;

                  return (
                    <div
                      key={album._id}
                      className="bg-slate-50 border border-slate-100 rounded-[1.5rem] overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-emerald-100/50 transition-all duration-300 group shadow-xs"
                    >
                      {/* Media Display Sandbox Frame */}
                      <div className="relative aspect-video w-full bg-slate-200 overflow-hidden shrink-0 shadow-3xs">
                        {isVideo && ytId ? (
                          <img
                            src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                            alt="Youtube Video Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={album.image?.[0] || "/placeholder-course.jpg"}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}

                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md text-white font-bold text-[9px] rounded-lg shadow-md uppercase tracking-wider">
                          {isVideo ? (
                            <Film size={10} className="text-amber-400" />
                          ) : (
                            <ImageIcon size={10} className="text-emerald-400" />
                          )}
                          <span>{isVideo ? "ভিডিও" : "চিত্র"}</span>
                        </div>
                      </div>

                      {/* Content Details Block */}
                      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/40 uppercase tracking-wide inline-block">
                            {album.event}
                          </span>
                          <h4 className="text-xs font-black text-slate-800 line-clamp-2 leading-snug">
                            {album.title}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/40">
                          <span className="text-[11px] text-slate-700 font-bold flex items-center gap-1">
                            <LayoutGrid size={11} />{" "}
                            {!isVideo
                              ? `${album.image?.length || 1}টি ফাইল`
                              : "ইউটিউব সোর্স"}
                          </span>
                          <button
                            onClick={() => handleDeleteAlbum(album._id)}
                            disabled={actionLoading}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Grid Controls Container */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-slate-100">
                <button
                  onClick={() => fetchGallery(page - 1)}
                  disabled={page === 1 || loading}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold disabled:opacity-50 transition-colors cursor-pointer"
                >
                  আগেরটি
                </button>
                <span className="text-xs font-bold text-slate-400 px-2">
                  পেজ {page} / {totalPages}
                </span>
                <button
                  onClick={() => fetchGallery(page + 1)}
                  disabled={page === totalPages || loading}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold disabled:opacity-50 transition-colors cursor-pointer"
                >
                  পরেরটি
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryAdmin;