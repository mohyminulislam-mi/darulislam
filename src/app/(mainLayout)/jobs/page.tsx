"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  DollarSign,
  ChevronRight,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Job {
  _id: string;
  id?: string | number;
  slug: string;
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string;
  deadline: string;
  postedDate: string;
  experience: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  isActive?: boolean;
}

export default function JobCircularsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useQuery<Job[]>({
    queryKey: ["public-jobs"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await axios.get(`${baseUrl}/jobs`);
      return res.data?.data || [];
    },
  });

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "All" ||
      job.type.toLowerCase().includes(selectedType.toLowerCase());

    return matchesSearch && matchesType;
  });

  return (
    <section className="min-h-screen bg-[#F7FBF7] pb-12 pt-20 px-4 md:px-8">
      {/* ব্যানার */}
      <div className="max-w-5xl mx-auto text-center mb-12 space-y-4">
        <span className="bg-[#8FE3A9]/20 text-[#0B3D2E] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block">
          ক্যারিয়ার সুযোগ
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-[#0B3D2E]">
          খালি পদের তালিকা
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto font-medium">
          আমাদের প্রতিষ্ঠানে আপনার স্বপ্নের ক্যারিয়ার গড়ে তুলুন। নিচের খালি
          পদগুলো দেখে আপনার জন্য উপযুক্ত পদে আবেদন করুন।
        </p>
      </div>

      {/* ফিল্টার ও সার্চ বার */}
      <div className="max-w-5xl mx-auto mb-8 bg-white p-4 rounded-2xl shadow-sm border border-[#0B3D2E]/5 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="পদের নাম বা বিভাগ খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0B3D2E] outline-none transition text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter size={16} className="text-gray-500 hidden md:block" />
          {["All", "Full-Time", "Part-Time", "Remote"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedType === type
                  ? "bg-[#0B3D2E] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type === "All" ? "সকল জব" : type}
            </button>
          ))}
        </div>
      </div>

      {/* জব লিস্ট কার্ডসমূহ */}
      <div className="max-w-5xl mx-auto space-y-6">
        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#0B3D2E] animate-spin" />
            <p className="text-gray-500 font-bold text-sm">
              জব সার্কুলার লোড হচ্ছে...
            </p>
          </div>
        ) : isError ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-red-100">
            <p className="text-red-500 font-bold">
              জব তালিকা লোড করতে সমস্যা হয়েছে! অনুগ্রহ করে পেজটি রিফ্রেশ করুন।
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-500 font-bold">
              কোনো জব পোস্ট পাওয়া যায়নি!
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <motion.div
              key={job._id || job.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md border border-[#0B3D2E]/5 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="bg-[#8FE3A9]/20 text-[#0B3D2E] text-xs font-black px-3 py-1 rounded-lg">
                    {job.department}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-lg">
                    {job.type}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-[#0B3D2E]">
                  {job.title}
                </h2>

                <p className="text-gray-600 text-sm line-clamp-2 font-medium">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500 pt-2">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-green-700" />{" "}
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={14} className="text-green-700" />{" "}
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-green-700" /> শেষ তারিখ:{" "}
                    {job.deadline}
                  </span>
                </div>
              </div>

              {/* এপ্লাই বাটন */}
              <Link
                href={`/jobs/${job.slug}`}
                className="w-full md:w-auto bg-[#0B3D2E] text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-green-900 transition flex items-center justify-center gap-2 whitespace-nowrap"
              >
                বিস্তারিত ও আবেদন <ChevronRight size={18} />
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}