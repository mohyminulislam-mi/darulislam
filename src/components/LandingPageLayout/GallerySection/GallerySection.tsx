"use client";
import { useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

interface GalleryAlbum {
  _id: string;
  title: string;
  event: string;
  assetType?: "image" | "video"; // 🎯 Added schema sync mapping
  image: string[];
  createdAt: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper to check if a string is a YouTube link
const isYoutubeLink = (url: string) => {
  return /shadow|youtu\.be|youtube\.com|embed/i.test(url);
};

const fetchGallery = async (): Promise<GalleryAlbum[]> => {
  // Fetch a larger limit initially to ensure we can safely filter out 5 pure photo items
  const { data } = await axios.get(`${BASE_URL}/gallery?page=1&limit=20`);
  const rawData: GalleryAlbum[] = data?.data || [];

  // 🎯 Security Filter Layer: Exclude items explicitly marked as video or containing video URLs
  const purePhotos = rawData.filter((item) => {
    const isVideoAsset = item.assetType === "video";
    const hasVideoUrl =
      item.image && item.image.length > 0 && isYoutubeLink(item.image[0]);
    return !isVideoAsset && !hasVideoUrl;
  });

  // Limit exactly to 6 elements for the Bento Grid layout structure
  return purePhotos.slice(0, 6);
};

const getGridSize = (index: number) => {
  const sizes = [
    "lg:col-span-2 lg:row-span-2 md:col-span-2",
    "lg:col-span-1 lg:row-span-1",
    "lg:col-span-1 lg:row-span-2 md:col-span-1",
    "lg:col-span-1 lg:row-span-1",
    "lg:col-span-2 lg:row-span-1 md:col-span-2",
    "lg:col-span-2 lg:row-span-1 md:col-span-2",
  ];
  return sizes[index % sizes.length];
};

const getImageUrl = (imgUrl: string) => {
  if (!imgUrl) return "/placeholder.jpg";
  if (imgUrl.startsWith("http")) return imgUrl;

  const cleanBaseUrl =
    BASE_URL?.replace("/api", "") || "https://darulislam-server-v2.vercel.app";
  return `${cleanBaseUrl}/${imgUrl}`;
};

const GallerySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 auto-rows-[250px] md:auto-rows-[300px]">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className={`animate-pulse rounded-[1.5rem] bg-gray-200 ${getGridSize(i)}`}
      />
    ))}
  </div>
);

export default function GallerySection() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    data: albums = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["galleryPhotoSectionData"],
    queryFn: fetchGallery,
    staleTime: 1000 * 60 * 30, // 30 mins cache
  });

  if (isError) return null;

  const openGallery = (album: GalleryAlbum, index = 0) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setIsOpen(false);
    setSelectedAlbum(null);
    document.body.style.overflow = "auto";
  };

  return (
    <section className="px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-brand rounded-full text-xs font-bold mb-4">
            <ImageIcon className="w-4 h-4" />
            <span>আমাদের ক্যাম্পাস লাইফ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-green-800 mb-4">
            ফটো গ্যালারি
          </h2>
          <div className="w-20 h-1.5 bg-brand rounded-full"></div>
        </div>

        {isLoading ? (
          <GallerySkeleton />
        ) : albums.length === 0 ? (
          <div className="text-center py-12 text-gray-600 font-bold">
            বর্তমানে কোনো ছবি নেই।
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 auto-rows-[250px] md:auto-rows-[300px]">
              {albums.map((album, i) => (
                <div
                  key={album._id}
                  onClick={() => openGallery(album)}
                  className={`group relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-gray-100 cursor-pointer ${getGridSize(i)}`}
                >
                  <Image
                    src={getImageUrl(album.image?.[0] || "")}
                    alt={album.title}
                    fill
                    sizes="(max-w-1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end">
                    <p className="text-emerald-400 text-xs font-bold uppercase">
                      {album.event}
                    </p>
                    <h3 className="text-white text-lg font-bold">
                      {album.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-14 mb-6 text-center">
              <Link
                href="/gallery"
                className="px-12 py-5 bg-brand text-white font-black rounded-full hover:bg-brand-dark"
              >
                সম্পূর্ণ গ্যালারি দেখুন
              </Link>
            </div>
          </>
        )}

        {isOpen && selectedAlbum && (
          <div
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
            onClick={closeGallery}
          >
            <button
              onClick={closeGallery}
              className="absolute top-6 right-6 text-white cursor-pointer"
            >
              <X size={36} />
            </button>
            <div
              className="relative max-w-4xl h-[75vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={getImageUrl(selectedAlbum.image[currentImageIndex])}
                alt="Gallery"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
    </section>
  );
}
