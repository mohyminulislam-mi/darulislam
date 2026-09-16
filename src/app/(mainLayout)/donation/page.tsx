"use client";

import React, { useEffect, useState } from "react";
import { HandHeart, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Campaign {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  goalAmount: number;
  raisedAmount: number;
  isActive: boolean;
}

export default function DonationPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPublicCampaigns = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/donations/campaigns`,
        );
        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          setCampaigns(result.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to load donation campaigns:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicCampaigns();
  }, []);

  return (
    <section className="flex flex-col min-h-screen mt-16 lg:mt-18">
      {/* Hero Section */}
      <div className="relative h-48 lg:h-64 bg-green-800 flex items-end p-6 lg:p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-repeat" />
        <div className="relative z-10 w-full max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#8FE3A9] rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
              <HandHeart size={40} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-4xl font-black">
                আল্লাহর পথে দান করুন
              </h1>
              <p className="text-sm font-bold text-[#F5EFE1]/80 uppercase tracking-widest mt-1">
                সদাকাহ • যাকাত • লিল্লাহ
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/5 max-w-md">
            <p className="text-xs lg:text-sm font-medium leading-relaxed italic opacity-90">
              “যারা আল্লাহর পথে ধনসম্পদ ব্যয় করে, তাদের উদাহরণ একটি শস্যদানা,
              যা সাতটি শীষ জন্মায়।” (সূরা বাকারা ২:২৬১)
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto w-full px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12 space-y-12">
          {/* Causes Grid */}
          <div className="space-y-8 pt-12">
            <h2 className="text-3xl font-black text-[#0B3D2E] flex items-center gap-3">
              <HandHeart /> আপনার দান যেখানে যাবে
            </h2>

            {loading ? (
              // লোডিং স্টেট (স্কেলিটন প্লেসহোল্ডার)
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-neutral-100 animate-pulse"
                  >
                    <div className="h-64 bg-neutral-200" />
                    <div className="p-8 space-y-4">
                      <div className="h-6 bg-neutral-200 rounded-md w-3/4" />
                      <div className="h-4 bg-neutral-200 rounded-md w-full" />
                      <div className="h-4 bg-neutral-200 rounded-md w-5/6" />
                      <div className="h-12 bg-neutral-200 rounded-2xl w-full pt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // এরর রেসপন্স এরিয়া
              <div className="text-center py-16 bg-red-50/50 border border-red-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-2">
                <AlertCircle className="text-red-500 h-10 w-10" />
                <p className="text-neutral-600 font-bold">
                  দান প্রকল্পসমূহ লোড করা সম্ভব হয়নি।
                </p>
                <p className="text-neutral-400 text-xs font-medium">
                  অনুগ্রহ করে কিছু সময় পর পৃষ্ঠাটি রিফ্রেশ করে আবার চেষ্টা করুন।
                </p>
              </div>
            ) : campaigns.length === 0 ? (
              // এম্পটি ক্যাম্পেইন হ্যান্ডলার
              <div className="text-center py-20 bg-neutral-50 rounded-[2.5rem] border border-dashed border-neutral-200">
                <p className="text-neutral-400 font-bold">
                  বর্তমানে কোনো সক্রিয় দান প্রকল্প চালু নেই।
                </p>
              </div>
            ) : (
              // একচুয়াল ডাটা রেন্ডারিং
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {campaigns.map((cause) => (
                  <div
                    key={cause._id}
                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-[#0B3D2E]/5 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-64 w-full">
                        <Image
                          src={
                            cause.image ||
                            "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop"
                          }
                          alt={cause.title}
                          fill
                          sizes="(max-w-768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 right-6 flex items-end justify-between">
                          <div className="text-white text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8FE3A9]">
                              প্রয়োজন
                            </p>
                            <p className="text-xl font-black">
                              {cause.goalAmount?.toLocaleString("bn-BD")}৳
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 space-y-4">
                        <h4 className="text-xl font-black text-[#0B3D2E] truncate">
                          {cause.title}
                        </h4>
                        <p className="text-sm font-medium text-[#0B3D2E]/60 leading-relaxed line-clamp-3 min-h-[60px]">
                          {cause.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-8 pt-0">
                      <Link
                        href={`/donation/${cause.slug}`}
                        className="w-full flex items-center justify-center py-4 rounded-2xl font-black bg-green-800 text-white transition-all duration-300 hover:bg-green-900 active:scale-[0.99] text-center shadow-sm"
                      >
                        অনুদান প্রদান করুন
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
