"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  ShoppingBag,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  RefreshCw,
  Check,
  X,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "@/src/app/hooks/useAxiosSecure";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  priceAtPurchase: number;
}

interface OrderData {
  _id: string;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
    district: string;
  };
  items: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  paymentDetails: {
    method: string;
    status: string;
    bkashMsisdn: string;
    transactionId: string;
  };
  createdAt: string;
}

export default function AdminPendingOrders() {
  const axiosSecure = useAxiosSecure();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["adminPendingOrders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders/admin/pending");
      return res.data;
    },
    staleTime: 30 * 1000,
  });

  const orders: OrderData[] = data?.data || [];
  const totalPending = data?.totalPending || 0;

  const handleUpdateStatus = async (
    orderId: string,
    statusValue: "processing" | "cancelled",
  ) => {
    const confirmText =
      statusValue === "processing"
        ? "আপনি কি অর্ডারটি কনফার্ম করতে চান?"
        : "আপনি কি অর্ডারটি বাতিল করতে চান?";
    const confirmButtonColor =
      statusValue === "processing" ? "#0B5D3B" : "#d33";

    const result = await Swal.fire({
      title: "নিশ্চিত করুন",
      text: confirmText,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: "#aaa",
      confirmButtonText:
        statusValue === "processing"
          ? "হ্যাঁ, কনফার্ম করুন"
          : "হ্যাঁ, বাতিল করুন",
      cancelButtonText: "না",
    });

    if (!result.isConfirmed) return;

    setActionLoading(orderId);
    try {
      const response = await axiosSecure.put(
        `/orders/admin/${orderId}/status`,
        {
          orderStatus: statusValue,
        },
      );

      if (response.status === 200) {
        Swal.fire({
          title: "সফল হয়েছে!",
          text: response.data?.message || "অর্ডার স্ট্যাটাস আপডেট হয়েছে।",
          icon: "success",
          confirmButtonColor: "#0B5D3B",
        });
        refetch();
      }
    } catch (error: any) {
      console.error("Status Update Error:", error);
      Swal.fire(
        "ব্যর্থ হয়েছে!",
        error?.response?.data?.message || "স্ট্যাটাস পরিবর্তন করা যায়নি।",
        "error",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই অর্ডারের রেকর্ডটি চিরতরে ডাটাবেস থেকে মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    });

    if (!result.isConfirmed) return;

    setActionLoading(orderId);
    try {
      const response = await axiosSecure.delete(`/orders/admin/${orderId}`);

      if (response.status === 200) {
        Swal.fire({
          title: "মুছে ফেলা হয়েছে!",
          text: response.data?.message || "অর্ডারটি সফলভাবে ডিলিট হয়েছে।",
          icon: "success",
          confirmButtonColor: "#0B5D3B",
        });
        refetch();
      }
    } catch (error: any) {
      console.error("Order Delete Error:", error);
      Swal.fire(
        "ত্রুটি!",
        error?.response?.data?.message || "অর্ডারটি ডিলিট করা সম্ভব হয়নি।",
        "error",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("bn-BD", options);
  };

  return (
    <div className="min-h-screen bg-[#F9FBFA] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-neutral-900">
                পেন্ডিং অর্ডারসমূহ
              </h1>
              <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                <Clock className="w-3 h-3" /> {totalPending} টি পেন্ডিং
              </span>
            </div>
            <p className="text-xs md:text-sm text-neutral-400 font-medium mt-1">
              কাস্টমারদের নতুন অর্ডারগুলো অ্যাকশন বাটনের সাহায্যে ম্যানেজ করুন
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="flex hover:cursor-pointer items-center gap-2 px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 active:scale-95 text-neutral-600 rounded-xl text-xs font-bold border border-neutral-200/60 transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            রিফ্রেশ করুন
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="h-64 flex flex-col items-center justify-center text-neutral-500 gap-3">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl text-center">
            <p className="font-bold">ডাটা লোড করতে সমস্যা হয়েছে!</p>
            <p className="text-xs mt-1 text-red-600">
              দয়া করে আপনার অ্যাডমিন অ্যাকাউন্ট রি-লগইন করে চেক করুন।
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && orders.length === 0 && (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-neutral-100 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-bold">
              আলহামদুলিল্লাহ, কোনো পেন্ডিং অর্ডার নেই!
            </p>
          </div>
        )}

        {/* Responsive Mobile-First Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-neutral-100/80 rounded-[2.2rem] p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {actionLoading === order._id && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              )}

              {/* Card Body */}
              <div>
                <div className="flex justify-between items-start border-b border-dashed border-neutral-100 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                      Order ID
                    </span>
                    <span className="text-xs font-black text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md">
                      #{order._id.slice(-6)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="p-1.5 hover:cursor-pointer text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="রেকর্ড ডিলিট করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Customer Info Box */}
                <div className="space-y-2.5 mb-5 bg-neutral-50/60 p-3.5 rounded-2xl border border-neutral-100/50">
                  <div className="flex items-center gap-2.5 text-neutral-800">
                    <User className="w-4 h-4 text-[#0B5D3B] flex-shrink-0" />
                    <span className="font-black text-sm">
                      {order.customerDetails.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-neutral-600">
                    <Phone className="w-4 h-4 text-[#0B5D3B] flex-shrink-0" />
                    <a
                      href={`tel:${order.customerDetails.phone}`}
                      className="font-bold text-xs hover:underline hover:text-[#0B5D3B]"
                    >
                      {order.customerDetails.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-2.5 text-neutral-500">
                    <MapPin className="w-4 h-4 text-[#0B5D3B] mt-0.5 flex-shrink-0" />
                    <span className="font-medium text-xs leading-relaxed">
                      {order.customerDetails.address},{" "}
                      <b className="text-neutral-700">
                        {order.customerDetails.district}
                      </b>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-neutral-400 border-t border-neutral-200/40 pt-2 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    <span className="text-[11px] font-bold">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="space-y-3 mb-4">
                  <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider block px-1">
                    অর্ডারকৃত পণ্য
                  </span>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 items-center p-2 bg-white border border-neutral-100 rounded-xl"
                    >
                      <div className="relative w-12 h-12 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-100 flex-shrink-0">
                        {item.product?.image ? (
                          <Image
                            src={
                              item.product.image.startsWith("http")
                                ? item.product.image
                                : `/${item.product.image}`
                            }
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-100 text-[8px] flex items-center justify-center">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-neutral-800 line-clamp-1 leading-snug">
                          {item.product?.name || "প্রোডাক্টের নাম নেই"}
                        </h4>
                        <p className="text-[11px] font-medium text-neutral-400 mt-0.5">
                          ৳{item.priceAtPurchase} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Amount & Call to Actions */}
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <div className="flex justify-between items-center mb-4 px-1">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase">
                      পেমেন্ট মেথড
                    </span>
                    <span className="text-[11px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                      ক্যাশ অন ডেলিভারি
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-neutral-400 block">
                      সর্বমোট বিল
                    </span>
                    <span className="text-lg font-black text-[#0B5D3B]">
                      ৳{order.totalAmount}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpdateStatus(order._id, "cancelled")}
                    className="py-2.5 hover:cursor-pointer border border-red-100 hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    অর্ডার বাতিল
                  </button>
                  {/* কনফার্ম বাটন -> স্ট্যাটাস processing */}
                  <button
                    onClick={() => handleUpdateStatus(order._id, "processing")}
                    className="py-2.5 hover:cursor-pointer bg-[#0B5D3B] hover:bg-[#0c4a2c] text-white text-xs font-black rounded-xl shadow-md shadow-green-100 transition-all active:scale-[0.98] flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    অর্ডার কনফার্ম
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
