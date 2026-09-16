"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  CheckCircle,
  Clock,
  X,
  Package,
  User,
  MapPin,
  Phone,
  AlertCircle,
} from "lucide-react";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";
import Swal from "sweetalert2";

type Order = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  product: string;
  price: string;
  status: "pending" | "successful";
  rawItems: any[];
};

export default function DeliveryDashboard() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        const mappedOrders: Order[] = result.data.map((ord: any) => {
          const productNames =
            ord.items
              ?.map((i: any) => i.product?.name || "Product")
              .join(", ") || "No Product";

          return {
            id: ord._id,
            customer: ord.customerDetails?.name || "Unknown Customer",
            phone: ord.customerDetails?.phone || "N/A",
            address: ord.customerDetails?.address || "N/A",
            product: productNames,
            price: `৳${ord.totalAmount?.toLocaleString("bn-BD")}`,
            status: ord.orderStatus === "delivered" ? "successful" : "pending",
            rawItems: ord.items || [],
          };
        });
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error("Order fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDeliverySuccess = async (id: string) => {
    if (!token) return;

    Swal.fire({
      icon: "warning",
      title: "ডেলিভারি নিশ্চিতকরণ",
      text: "আপনি কি নিশ্চিত যে এই অর্ডারটি সফলভাবে ডেলিভারি করা হয়েছে?",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, সম্পন্ন হয়েছে",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#0B5D3B",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/orders/admin/${id}/status`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ orderStatus: "delivered" }),
            },
          );

          if (res.ok) {
            Swal.fire({
              icon: "success",
              title: "সফল হয়েছে",
              text: "অর্ডার স্ট্যাটাস 'delivered' এ আপডেট করা হয়েছে।",
              confirmButtonColor: "#0B5D3B",
            });
            fetchOrders();
            setSelectedOrder(null);
          } else {
            throw new Error("Status update failed");
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "ত্রুটি",
            text: "স্ট্যাটাস আপডেট করা সম্ভব হয়নি। আবার চেষ্টা করুন।",
            confirmButtonColor: "#0B5D3B",
          });
        }
      }
    });
  };

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-slate-50 min-h-screen font-sans">
      <h2 className="text-2xl font-black mb-6 text-slate-800 flex items-center gap-2">
        <Package className="text-emerald-600" /> Delivery Dashboard
      </h2>

      <div className="flex border-b border-slate-200 mb-6 bg-white p-1.5 rounded-xl shadow-sm max-w-md">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center justify-center gap-2 w-1/2 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "pending"
              ? "bg-[#0B5D3B] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Clock size={16} />
          Pending ({orders.filter((o) => o.status === "pending").length})
        </button>
        <button
          onClick={() => setActiveTab("successful")}
          className={`flex items-center justify-center gap-2 w-1/2 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "successful"
              ? "bg-[#0B5D3B] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <CheckCircle size={16} />
          Successful ({orders.filter((o) => o.status === "successful").length})
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          {filteredOrders.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-bold">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="p-4 font-mono text-[#0B5D3B] select-all truncate max-w-[120px]">
                      {order.id}
                    </td>
                    <td className="p-4 text-slate-800 font-black">
                      {order.customer}
                    </td>
                    <td className="p-4 text-slate-500 font-medium truncate max-w-[200px]">
                      {order.product}
                    </td>
                    <td className="p-4 text-slate-800 font-black">
                      {order.price}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          order.status === "successful"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status === "successful" ? (
                          <>
                            <CheckCircle size={12} /> Successful
                          </>
                        ) : (
                          <>
                            <Clock size={12} /> Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Eye size={14} /> View
                      </button>

                      {order.status === "pending" && (
                        <button
                          onClick={() => handleDeliverySuccess(order.id)}
                          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-black transition-colors shadow-sm cursor-pointer"
                        >
                          <CheckCircle size={14} /> Delivery
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <AlertCircle size={40} className="text-slate-300" />
              <p className="font-bold text-base">No {activeTab} orders found</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div
              className="absolute inset-0"
              onClick={() => setSelectedOrder(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-[2rem] shadow-xl max-w-md w-full overflow-hidden border border-slate-100 z-10"
            >
              <div className="bg-[#0B5D3B] p-5 text-white flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">
                    Order Details
                  </p>
                  <h3 className="text-base font-mono font-bold">
                    {selectedOrder.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs font-bold">
                <div className="flex items-start gap-3">
                  <User className="text-slate-400 mt-0.5 shrink-0" size={16} />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Customer Name
                    </p>
                    <p className="text-slate-800 font-black text-sm">
                      {selectedOrder.customer}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-slate-400 mt-0.5 shrink-0" size={16} />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Phone Number
                    </p>
                    <p className="text-slate-800 text-sm">
                      {selectedOrder.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    className="text-slate-400 mt-0.5 shrink-0"
                    size={16}
                  />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Delivery Address
                    </p>
                    <p className="text-slate-800 text-xs leading-relaxed font-medium">
                      {selectedOrder.address}
                    </p>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Package size={14} /> Itemized Invoice
                  </p>
                  <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 divide-y divide-neutral-200/60">
                    {selectedOrder.rawItems.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-2 first:pt-0 last:pb-0 text-neutral-700"
                      >
                        <span className="truncate max-w-[220px] font-medium">
                          {item.product?.name || "Product"}
                        </span>
                        <span className="shrink-0 text-neutral-500 font-medium">
                          {item.quantity} x ৳{item.priceAtPurchase}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 mt-1 text-[#0B5D3B] font-black">
                      <span>Total Invoice</span>
                      <span>{selectedOrder.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
                {selectedOrder.status === "pending" && (
                  <button
                    onClick={() => handleDeliverySuccess(selectedOrder.id)}
                    className="px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-sm transition-colors cursor-pointer"
                  >
                    Complete Delivery
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}