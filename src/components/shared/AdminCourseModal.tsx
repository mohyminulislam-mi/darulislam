"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import LoadingSpinner from "./spinner/LoadingSpinner";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: any;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}

export default function ProductModal({
  isOpen,
  onClose,
  editingProduct,
  onSubmit,
  isPending,
}: ProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [inStock, setInStock] = useState("true");
  const [description, setDescription] = useState("");
  const [publisher, setPublisher] = useState("");
  const [features, setFeatures] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || "");
      setPrice(editingProduct.price?.toString() || "");
      setCategory(editingProduct.category || "");
      setInStock(editingProduct.inStock ? "true" : "false");
      setDescription(editingProduct.details?.description || "");
      setPublisher(editingProduct.details?.publisher || "");
      setFeatures(
        editingProduct.details?.features
          ? editingProduct.details.features.join(", ")
          : "",
      );
    } else {
      // রিসেট ফর্ম
      setName("");
      setPrice("");
      setCategory("");
      setInStock("true");
      setDescription("");
      setPublisher("");
      setFeatures("");
      setSelectedFile(null);
    }
  }, [editingProduct, isOpen]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("inStock", inStock);
    formData.append("description", description);
    formData.append("publisher", publisher);

    const featuresArray = features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    formData.append("features", JSON.stringify(featuresArray));

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* ব্যাকড্রপ অ্যানিমেশন */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* মডাল কন্টেন্ট অ্যানিমেশন */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white w-full max-w-lg rounded-2xl border border-neutral-100 shadow-xl overflow-hidden flex flex-col max-h-[90vh] relative z-10"
          >
            {/* মডাল হেডার */}
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div>
                <h3 className="text-sm font-black text-neutral-800">
                  {editingProduct
                    ? "প্রোডাক্ট তথ্য এডিট করুন"
                    : "নতুন প্রোডাক্ট যোগ করুন"}
                </h3>
                <p className="text-[10px] text-neutral-400 font-medium">
                  সঠিকভাবে ফর্ম ডাটা ফিল্ডগুলো পূরণ করুন
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-neutral-200/60 rounded-lg cursor-pointer text-neutral-400 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* মডাল ফর্ম বডি */}
            <form
              onSubmit={handleFormSubmit}
              className="p-5 space-y-4 overflow-y-auto flex-1 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-neutral-600">
                  প্রোডাক্টের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="উদা: নূরানী হাফেজি কুরআন শরীফ"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600">
                    মূল্য (Price) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="650"
                      className="w-full p-2.5 pl-7 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all"
                    />
                    <span className="absolute left-2.5 top-3 text-neutral-400 font-bold">
                      ৳
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-600">
                    ক্যাটাগরি *
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="উদা: Religious Book"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600">
                    স্টক স্ট্যাটাস *
                  </label>
                  <select
                    value={inStock}
                    onChange={(e) => setInStock(e.target.value)}
                    className="w-full cursor-pointer p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Stock Out</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-600">
                    প্রকাশনী (Publisher)
                  </label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="উদা: এমদাদিয়া লাইব্রেরী"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-600">
                  প্রোডাক্ট বিবরণ (Description)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="প্রোডাক্টের বিস্তারিত এখানে লিখুন..."
                  rows={3}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-600">
                  বৈশিষ্ট্যসমূহ (Features){" "}
                  <span className="text-[10px] text-neutral-400">
                    (কমা দিয়ে আলাদা করুন)
                  </span>
                </label>
                <input
                  type="text"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="সহজ পাঠ্য, আর্ট পেপার, মজবুত বাইন্ডিং"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-600">
                  প্রোডাক্ট ইমেজ {editingProduct ? "(ঐচ্ছিক)" : "*"}
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-neutral-200 border-dashed rounded-xl cursor-pointer bg-neutral-50 hover:bg-neutral-100/50 transition-all">
                    <div className="flex flex-col items-center justify-center pt-3 pb-3 text-neutral-400">
                      <ImageIcon size={20} className="mb-1" />
                      <p className="text-[10px] font-bold">
                        {selectedFile
                          ? selectedFile.name
                          : "ইমেজ আপলোড করতে ক্লিক করুন"}
                      </p>
                      <p className="text-[9px] text-neutral-400">
                        PNG, JPG (Max 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0])
                          setSelectedFile(e.target.files[0]);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* মডাল অ্যাকশন বাটন */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 cursor-pointer bg-neutral-100 hover:bg-neutral-200/70 text-neutral-600 font-bold rounded-xl transition-all"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 cursor-pointer bg-[#0B5D3B] hover:bg-[#0c462a] text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  {isPending && <Loader2 className="animate-spin" />}
                  <span>{editingProduct ? "আপডেট করুন" : "যোগ করুন"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
