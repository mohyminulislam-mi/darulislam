"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  Truck,
  AlertTriangle,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(items);
  }, []);

  const updateLocalStorage = (updatedItems: CartItem[]) => {
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const handleIncrease = (id: string) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    updateLocalStorage(updated);
  };

  const handleDecrease = (id: string) => {
    const itemToDecrease = cartItems.find((item) => item.id === id);

    if (itemToDecrease && itemToDecrease.quantity === 1) {
      setDeleteTargetId(id);
    } else {
      const updated = cartItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      updateLocalStorage(updated);
    }
  };

  const confirmRemove = () => {
    if (!deleteTargetId) return;
    const filtered = cartItems.filter((item) => item.id !== deleteTargetId);
    updateLocalStorage(filtered);
    setDeleteTargetId(null);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 70;
  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    router.push("/checkout?from=cart");
  };

  if (!isMounted) return null;

  return (
    <section className="min-h-screen bg-neutral-50/50 pt-24 pb-12 md:pt-32 md:pb-20 font-sans transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4">
        {/* SEO Header - Semantic Structure */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => router.push("/islamic-shop")}
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-[#0B5D3B] transition-colors mb-3 group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
              শপিং চালিয়ে যান
            </button>
            <h1 className="text-2xl md:text-4xl font-black text-neutral-950 tracking-tight">
              আপনার শপিং কার্ট
            </h1>
          </div>
          <div className="text-xs md:text-sm font-medium text-neutral-500 bg-white border border-neutral-200 px-4 py-2 rounded-2xl w-fit shadow-2xs">
            মোট পণ্য:{" "}
            <span className="font-bold text-[#0B5D3B]">
              {cartItems.length} টি
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {cartItems.length === 0 ? (
            /* --- Empty Cart State --- */
            <motion.section
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 md:p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="w-20 h-20 bg-emerald-50 text-[#0B5D3B] rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-neutral-900 mb-2">
                আপনার কার্টটি একদম খালি!
              </h2>
              <p className="text-neutral-500 text-sm max-w-sm mb-8 font-medium">
                কার্টে কোনো পণ্য যোগ করা হয়নি। আমাদের শপ থেকে আপনার পছন্দের
                ইসলামিক সামগ্রীগুলো ঘুরে দেখুন।
              </p>
              <button
                onClick={() => router.push("/islamic-shop")}
                className="px-8 py-4 bg-[#0B5D3B] text-white font-bold rounded-2xl text-sm hover:bg-[#0c4a2d] transition-all shadow-lg shadow-emerald-900/10 active:scale-98 cursor-pointer"
              >
                পণ্য পছন্দ করুন
              </button>
            </motion.section>
          ) : (
            /* --- Cart Content Grid --- */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Product List */}
              <div className="lg:col-span-8 space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="bg-white border border-neutral-100 p-4 md:p-6 rounded-3xl shadow-2xs flex flex-col sm:flex-row gap-4 items-center relative group"
                    >
                      {/* Product Image & Details Container */}
                      <div className="flex items-center gap-4 w-full sm:flex-1 min-w-0">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-neutral-50 border border-neutral-100 p-2 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] bg-neutral-100 text-neutral-600 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {item.category}
                          </span>
                          <h2 className="text-sm md:text-base font-black text-neutral-900 truncate mt-1.5 mb-1">
                            {item.name}
                          </h2>
                          <p className="text-sm md:text-base font-black text-[#0B5D3B]">
                            ৳{item.price}
                          </p>
                        </div>
                      </div>

                      {/* Right Control Side: Quantity & Delete */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-neutral-200 bg-neutral-50 rounded-xl p-1">
                          <button
                            onClick={() => handleDecrease(item.id)}
                            className="p-1.5 hover:bg-white text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-xs text-neutral-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrease(item.id)}
                            className="p-1.5 hover:bg-white text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Total Single Item Price & Delete Button */}
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-black text-neutral-900 text-sm min-w-[70px] text-right">
                            ৳{item.price * item.quantity}
                          </span>
                          <button
                            onClick={() => setDeleteTargetId(item.id)}
                            className="p-2.5 bg-red-50 hover:bg-red-100 border border-red-100/50 text-red-600 rounded-xl transition-all cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-4 bg-white border border-neutral-100 rounded-[2rem] p-6 md:p-8 shadow-xs lg:sticky lg:top-28 w-full">
                <h3 className="text-base font-black text-neutral-900 border-b border-neutral-100 pb-4 mb-5">
                  অর্ডার ডিটেইলস
                </h3>

                {/* Pricing Calculation */}
                <div className="space-y-4 text-sm font-medium text-neutral-600 mb-6">
                  <div className="flex justify-between items-center">
                    <span>সাবটোটাল</span>
                    <span className="font-bold text-neutral-900">
                      ৳{subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      ডেলিভারি চার্জ
                      {shippingFee === 0 && (
                        <span className="text-[10px] bg-emerald-50 text-[#0B5D3B] px-2 py-0.5 rounded-md font-bold">
                          ফ্রি
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-neutral-900">
                      {shippingFee === 0 ? "৳০" : `৳${shippingFee}`}
                    </span>
                  </div>

                  <div className="border-t border-neutral-100 pt-4 flex justify-between items-center text-base font-black text-neutral-900">
                    <span>সর্বমোট মূল্য</span>
                    <span className="text-xl font-black text-[#0B5D3B]">
                      ৳{total}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#0B5D3B] hover:bg-[#0c4a2d] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/10 active:scale-98 text-sm uppercase tracking-wider cursor-pointer mb-4"
                >
                  অর্ডার সম্পন্ন করুন <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Premium Custom Delete Confirmation Modal --- */}
      <AnimatePresence>
        {deleteTargetId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur OverLay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTargetId(null)}
              className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-neutral-100 rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-2xl relative z-10 text-center"
            >
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-black text-neutral-900 mb-2">
                পণ্যটি কি মুছে ফেলতে চান?
              </h4>
              <p className="text-neutral-500 text-xs font-medium mb-6 leading-relaxed">
                কার্ট থেকে এই প্রোডাক্টটি রিমুভ করা হবে। আপনি কি নিশ্চিত?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeleteTargetId(null)}
                  className="py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  না, থাক
                </button>
                <button
                  onClick={confirmRemove}
                  className="py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md shadow-red-900/10 transition-colors cursor-pointer"
                >
                  হ্যাঁ, মুছুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
