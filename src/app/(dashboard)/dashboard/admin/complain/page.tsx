"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  Trash2,
  ShieldAlert,
  MessageSquare,
  Clock,
  CheckCircle,
  Eye,
  X,
  RefreshCw,
  User,
  Phone,
  Calendar,
} from "lucide-react";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";

interface ComplainData {
  _id: string;
  name: string;
  phone: string;
  complainType: "complain" | "suggestion" | "query";
  subject: string;
  description: string;
  createdAt: string;
  status: "Pending" | "Solved";
}

export default function ComplainTable() {
  const [complains, setComplains] = useState<ComplainData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedComplain, setSelectedComplain] = useState<ComplainData | null>(
    null,
  );

  const axiosSecure = useAxiosSecure();

  // ডাটাবেজ থেকে সকল কমপ্লেইন আনা
  const fetchComplains = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/complains");
      if (res.data?.success) {
        setComplains(res.data.data);
      }
    } catch (error) {
      console.error("ডাটা লোড করতে সমস্যা হয়েছে:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  // Solved করার ফাংশন
  const handleSolve = async (id: string) => {
    try {
      const res = await axiosSecure.patch(`/complains/${id}/solve`);
      if (res.data?.success) {
        setComplains((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: "Solved" } : item,
          ),
        );
        if (selectedComplain && selectedComplain._id === id) {
          setSelectedComplain({ ...selectedComplain, status: "Solved" });
        }
      }
    } catch (error) {
      console.error("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে:", error);
    }
  };

  // Delete করার ফাংশন
  const handleDelete = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিত যে এই অভিযোগটি ডিলিট করতে চান?")) {
      try {
        const res = await axiosSecure.delete(`/complains/${id}`);
        if (res.data?.success) {
          setComplains((prev) => prev.filter((item) => item._id !== id));
          if (selectedComplain && selectedComplain._id === id) {
            setSelectedComplain(null);
          }
        }
      } catch (error) {
        console.error("ডিলিট করতে সমস্যা হয়েছে:", error);
      }
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "complain":
        return (
          <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-bold">
            অভিযোগ
          </span>
        );
      case "suggestion":
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold">
            পরামর্শ
          </span>
        );
      default:
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-bold">
            জিজ্ঞাসা
          </span>
        );
    }
  };

  return (
    <div className="bg-[#F7FBF7] min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-[#0B3D2E]/5 overflow-hidden">
        {/* হেডার / ড্যাশবোর্ড বার */}
        <div className="bg-[#0B3D2E] p-6 lg:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#8FE3A9] rounded-2xl flex items-center justify-center text-[#0B3D2E] shadow-md">
              <ShieldAlert size={26} />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black">
                অভিযোগ ও পরামর্শ তালিকা
              </h1>
              <p className="text-xs text-[#F5EFE1]/80 mt-0.5">
                অ্যাডমিন কন্ট্রোল প্যানেল
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchComplains}
              className="bg-white/10 p-2.5 rounded-xl hover:bg-white/20 transition cursor-pointer text-white"
              title="রিলোড করুন"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <div className="flex gap-3 text-xs font-bold">
              <div className="bg-white/10 px-4 py-2 rounded-xl flex items-center gap-1.5 border border-white/10">
                <Clock size={14} className="text-amber-400" />
                <span>
                  পেন্ডিং:{" "}
                  {complains.filter((c) => c.status === "Pending").length} টি
                </span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-xl flex items-center gap-1.5 border border-white/10">
                <CheckCircle size={14} className="text-[#8FE3A9]" />
                <span>
                  সমাধানকৃত:{" "}
                  {complains.filter((c) => c.status === "Solved").length} টি
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* মেইন টেবিল */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[#0B3D2E] text-sm font-black tracking-wide">
                <th className="p-5 text-center w-16">ক্র. নং</th>
                <th className="p-5 min-w-[150px]">প্রেরক ও যোগাযোগ</th>
                <th className="p-5 text-center w-28">ধরন</th>
                <th className="p-5 min-w-[250px]">বিষয় ও বিবরণ</th>
                <th className="p-5 text-center w-32">তারিখ</th>
                <th className="p-5 text-center w-28">স্ট্যাটাস</th>
                <th className="p-5 text-center min-w-[220px]">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-gray-500 font-medium"
                  >
                    <RefreshCw
                      size={24}
                      className="animate-spin mx-auto mb-2 text-[#0B3D2E]"
                    />
                    ডাটা লোড হচ্ছে...
                  </td>
                </tr>
              ) : complains.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-gray-400 font-medium"
                  >
                    কোনো অভিযোগ বা পরামর্শ পাওয়া যায়নি!
                  </td>
                </tr>
              ) : (
                complains.map((complain, index) => (
                  <tr
                    key={complain._id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="p-5 text-center font-bold text-gray-400">
                      {index + 1 < 10 ? `০${index + 1}` : index + 1}
                    </td>

                    <td className="p-5">
                      <div className="font-black text-[#0B3D2E]">
                        {complain.name}
                      </div>
                      <div className="text-xs text-gray-500 font-semibold mt-0.5">
                        {complain.phone}
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      {getTypeBadge(complain.complainType)}
                    </td>

                    <td className="p-5 max-w-xs">
                      <div className="font-bold text-[#0B3D2E] flex items-center gap-1.5">
                        <MessageSquare
                          size={14}
                          className="text-amber-600 shrink-0"
                        />
                        {complain.subject}
                      </div>
                      <p
                        className="text-xs text-gray-600 leading-relaxed mt-1 font-medium line-clamp-2"
                        title={complain.description}
                      >
                        {complain.description}
                      </p>
                    </td>

                    <td className="p-5 text-center font-medium text-gray-500 text-xs">
                      {new Date(complain.createdAt).toLocaleDateString("bn-BD")}
                    </td>

                    <td className="p-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-black border ${
                          complain.status === "Solved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            complain.status === "Solved"
                              ? "bg-emerald-600"
                              : "bg-amber-500"
                          }`}
                        />
                        {complain.status === "Solved" ? "Solved" : "Pending"}
                      </span>
                    </td>

                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Full View বাটন */}
                        <button
                          onClick={() => setSelectedComplain(complain)}
                          className="flex items-center cursor-pointer gap-1 text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-2 rounded-xl border border-blue-200 transition-all active:scale-95"
                          title="সম্পূর্ণ বিস্তারিত দেখুন"
                        >
                          <Eye size={14} /> View
                        </button>

                        {/* Solved বাটন */}
                        <button
                          disabled={complain.status === "Solved"}
                          onClick={() => handleSolve(complain._id)}
                          className={`flex items-center cursor-pointer gap-1 text-xs font-bold px-2.5 py-2 rounded-xl transition-all shadow-sm ${
                            complain.status === "Solved"
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                              : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                          }`}
                        >
                          <Check size={14} /> Solved
                        </button>

                        {/* Delete বাটন */}
                        <button
                          onClick={() => handleDelete(complain._id)}
                          className="flex items-center cursor-pointer gap-1 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 px-2 py-2 rounded-xl border border-red-200 transition-all active:scale-95"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL VIEW MODAL */}
      {selectedComplain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 lg:p-8 shadow-2xl border border-gray-100 relative space-y-6">
            {/* মডাল ক্লোজ বাটন */}
            <button
              onClick={() => setSelectedComplain(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* হেডার */}
            <div className="flex items-center gap-3 border-b pb-4 border-gray-100">
              {getTypeBadge(selectedComplain.complainType)}
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                  selectedComplain.status === "Solved"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                স্ট্যাটাস: {selectedComplain.status}
              </span>
            </div>

            {/* বিষয় */}
            <div>
              <h2 className="text-xl font-black text-[#0B3D2E]">
                {selectedComplain.subject}
              </h2>
            </div>

            {/* বিবরণ */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/60 max-h-60 overflow-y-auto">
              <p className="text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-line">
                {selectedComplain.description}
              </p>
            </div>

            {/* প্রেরকের তথ্য */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F7FBF7] p-4 rounded-2xl border border-[#0B3D2E]/10">
              <div className="flex items-center gap-2 text-gray-700 font-bold">
                <User size={14} className="text-[#0B3D2E]" />
                <span>নাম: {selectedComplain.name}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 font-bold">
                <Phone size={14} className="text-[#0B3D2E]" />
                <span>মোবাইল: {selectedComplain.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-bold sm:col-span-2">
                <Calendar size={14} className="text-[#0B3D2E]" />
                <span>
                  তারিখ:{" "}
                  {new Date(selectedComplain.createdAt).toLocaleString("bn-BD")}
                </span>
              </div>
            </div>

            {/* মডাল অ্যাকশন বাটন */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {selectedComplain.status !== "Solved" && (
                <button
                  onClick={() => handleSolve(selectedComplain._id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Check size={16} /> Solved হিসেবে মার্ক করুন
                </button>
              )}
              <button
                onClick={() => handleDelete(selectedComplain._id)}
                className="bg-red-50 text-red-600 hover:bg-red-100 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-red-200 transition cursor-pointer"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
