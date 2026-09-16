"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  Phone,
  User,
  BadgeDollarSign,
  Loader2,
  Trash2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import Swal from "sweetalert2";

type DonationStatus = "pending" | "approved" | "rejected";

interface DonationData {
  _id: string;
  name: string;
  phone: string;
  amount: number;
  method: string;
  status: DonationStatus;
  createdAt: string;
  campaignSlug?: string;
  senderNumber?: string;
  trxId?: string;
}

export default function DonationManagementPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const { data: donationResponse, isLoading } = useQuery({
    queryKey: ["donations", activeTab],
    queryFn: async () => {
      const url =
        activeTab === "all"
          ? "/donations/admin/all"
          : `/donations/admin/all?status=${activeTab}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });

  const donations: DonationData[] = donationResponse?.data || [];

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosSecure.put(`/donations/admin/approve/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("সফল!", "ডোনেশনটি অ্যাপ্রুভ করা হয়েছে।", "success");
      queryClient.invalidateQueries({ queryKey: ["donations"] });
    },
    onError: (error: any) => {
      const serverMessage =
        error?.response?.data?.message ||
        "অ্যাপ্রুভ করার সময় কিছু সমস্যা হয়েছে।";
      Swal.fire("ব্যর্থ", serverMessage, "error");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosSecure.put(`/donations/admin/reject/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire(
        "রিজেক্টেড!",
        "ডোনেশন রিকোয়েস্টটি বাতিল করা হয়েছে।",
        "success",
      );
      queryClient.invalidateQueries({ queryKey: ["donations"] });
    },
    onError: (error: any) => {
      const serverMessage =
        error?.response?.data?.message ||
        "রিজেক্ট করার সময় কিছু সমস্যা হয়েছে।";
      Swal.fire("ব্যর্থ", serverMessage, "error");
    },
  });

  // পার্মানেন্ট ডিলিট এপিআই মিউটেশন পাইপলাইন ভাই
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosSecure.delete(`/donations/delete-donation/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire(
        "মুছে ফেলা হয়েছে!",
        "ডোনেশন রেকর্ডটি স্থায়ীভাবে ডিলিট করা হয়েছে।",
        "success",
      );
      queryClient.invalidateQueries({ queryKey: ["donations"] });
    },
    onError: (error: any) => {
      const serverMessage =
        error?.response?.data?.message || "ডিলিট করার সময় কিছু সমস্যা হয়েছে।";
      Swal.fire("ব্যর্থ", serverMessage, "error");
    },
  });

  const handleApproveConfirm = (id: string) => {
    Swal.fire({
      title: "ডোনেশনটি অ্যাপ্রুভ করবেন?",
      text: "টাকা সঠিকভাবে জমা হয়েছে কিনা তা নিশ্চিত হয়ে নিন।",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0B5D3B",
      cancelButtonColor: "#64748b",
      confirmButtonText: "হ্যাঁ, ভেরিফাই করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        approveMutation.mutate(id);
      }
    });
  };

  const handleRejectConfirm = (id: string) => {
    Swal.fire({
      title: "ডোনেশনটি রিজেক্ট করবেন?",
      text: "ভুল বা ফেক ট্রানজেকশনের ক্ষেত্রে এটি ব্যবহার করুন।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "হ্যাঁ, রিজেক্ট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        rejectMutation.mutate(id);
      }
    });
  };

  // পার্মানেন্ট ডিলিট কনফার্মেশন অ্যালার্ট গেটওয়ে
  const handleDeleteConfirm = (id: string) => {
    Swal.fire({
      title: "স্থায়ীভাবে ডিলিট করবেন?",
      text: "ডিলিট করার পর এই ডোনেশন রেকর্ডটি আর ফিরে পাওয়া যাবে না!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "হ্যাঁ, চিরতরে মুছুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const totalCount = donationResponse?.count || donations.length;

  const pendingCount = useMemo(
    () => donations.filter((item) => item.status === "pending").length,
    [donations],
  );
  const approvedCount = useMemo(
    () => donations.filter((item) => item.status === "approved").length,
    [donations],
  );
  const rejectedCount = useMemo(
    () => donations.filter((item) => item.status === "rejected").length,
    [donations],
  );

  // ফাইন্যান্সিয়াল কন্ডিশনাল টোটাল ফিল্টারিং ভাই
  const approvedTotalAmount = useMemo(
    () =>
      donations
        .filter((item) => item.status === "approved")
        .reduce((acc, item) => acc + item.amount, 0),
    [donations],
  );
  const pendingTotalAmount = useMemo(
    () =>
      donations
        .filter((item) => item.status === "pending")
        .reduce((acc, item) => acc + item.amount, 0),
    [donations],
  );
  const rejectedTotalAmount = useMemo(
    () =>
      donations
        .filter((item) => item.status === "rejected")
        .reduce((acc, item) => acc + item.amount, 0),
    [donations],
  );

  const statusClasses: Record<DonationStatus, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };

  const tabs = [
    { label: "All", value: "all", count: totalCount },
    {
      label: "Pending",
      value: "pending",
      count: activeTab === "all" ? pendingCount : totalCount,
    },
    {
      label: "Approved",
      value: "approved",
      count: activeTab === "all" ? approvedCount : totalCount,
    },
    {
      label: "Rejected",
      value: "rejected",
      count: activeTab === "all" ? rejectedCount : totalCount,
    },
  ];

  const getCampaignImage = (slug?: string) => {
    if (slug === "masjid-renovation")
      return "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500";
    return "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Donation Management
          </h1>
          <p className="mt-2 text-slate-500">
            Manage and review all donation requests dynamically.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Combined Total Panel */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Amount (All Logs)</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              ৳{" "}
              {donations
                .reduce((acc, item) => acc + item.amount, 0)
                .toLocaleString()}
            </h3>
          </div>

          {/* Pending Amount Panel */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending Amount</p>
            <h3 className="mt-2 text-3xl font-bold text-amber-500">
              ৳ {isLoading ? "..." : pendingTotalAmount.toLocaleString()}
            </h3>
          </div>

          {/* Approved Amount Panel */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Approved Amount</p>
            <h3 className="mt-2 text-3xl font-bold text-emerald-600">
              ৳ {isLoading ? "..." : approvedTotalAmount.toLocaleString()}
            </h3>
          </div>

          {/* Rejected Amount Panel */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Rejected Amount</p>
            <h3 className="mt-2 text-3xl font-bold text-rose-600">
              ৳ {isLoading ? "..." : rejectedTotalAmount.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as any)}
              className={`rounded-2xl border px-5 py-3 font-medium transition-all duration-300 ${
                activeTab === tab.value
                  ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    activeTab === tab.value
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {isLoading ? "..." : tab.count}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Campaign
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Method / Trx ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Donor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} className="border-b animate-pulse">
                      <td className="px-6 py-5">
                        <div className="h-12 w-48 bg-slate-200 rounded-xl"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-5 w-28 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-5 w-20 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-5 w-32 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-5 w-28 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-9 w-40 bg-slate-200 rounded-xl mx-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : donations.length > 0 ? (
                  donations.map((donation, index) => (
                    <motion.tr
                      key={donation._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Campaign / Project */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <Image
                            src={getCampaignImage(donation.campaignSlug)}
                            alt={donation.campaignSlug || "General"}
                            width={60}
                            height={60}
                            className="h-11 w-11 rounded-xl object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-slate-900 capitalize">
                              {(donation.campaignSlug || "general").replace(
                                "-",
                                " ",
                              )}
                            </h4>
                            <p className="text-xs text-slate-400">
                              {new Date(donation.createdAt).toLocaleDateString(
                                "bn-BD",
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Method & Trx ID */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded w-fit">
                            {donation.method}
                          </span>
                          <span className="font-mono text-sm font-medium mt-1 text-slate-700">
                            {donation.method === "bank"
                              ? "Bank Transfer"
                              : donation.trxId || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                          <BadgeDollarSign size={16} />৳{" "}
                          {donation.amount.toLocaleString()}
                        </div>
                      </td>

                      {/* Sender Name */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <User size={15} className="text-slate-400" />
                          {donation.name}
                        </div>
                      </td>

                      {/* Sender Phone */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone size={15} className="text-slate-400" />
                          {donation.phone}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses[donation.status]}`}
                        >
                          {donation.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex justify-center items-center gap-2">
                          {donation.status === "pending" ? (
                            <>
                              <button
                                onClick={() =>
                                  handleApproveConfirm(donation._id)
                                }
                                disabled={
                                  approveMutation.isPending ||
                                  rejectMutation.isPending ||
                                  deleteMutation.isPending
                                }
                                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-50 cursor-pointer"
                              >
                                {approveMutation.isPending ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <CheckCircle2 size={16} />
                                )}
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  handleRejectConfirm(donation._id)
                                }
                                disabled={
                                  approveMutation.isPending ||
                                  rejectMutation.isPending ||
                                  deleteMutation.isPending
                                }
                                className="flex items-center gap-1.5 rounded-xl bg-red-500 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600 disabled:opacity-50 cursor-pointer"
                              >
                                {rejectMutation.isPending ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <XCircle size={16} />
                                )}
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium bg-slate-100 px-3 py-1.5 rounded-xl">
                              Resolved
                            </span>
                          )}

                          {/* 🎯 পার্মানেন্ট ডিলিট বাটন ট্র্যাকার অ্যাকশন ভাই */}
                          <button
                            onClick={() => handleDeleteConfirm(donation._id)}
                            disabled={
                              approveMutation.isPending ||
                              rejectMutation.isPending ||
                              deleteMutation.isPending
                            }
                            className="flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer"
                            title="Delete Permanently"
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div>
                        <h3 className="font-semibold text-slate-700">
                          No donations found
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          There are no records in this category right now.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
