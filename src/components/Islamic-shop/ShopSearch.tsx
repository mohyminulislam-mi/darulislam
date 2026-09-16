"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Grid,
  RotateCcw,
  X,
  ShoppingCart,
  SearchCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../shared/spinner/LoadingSpinner";

const ProductSearchSection = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchedProducts, setSearchedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // কার্টের পণ্যের সংখ্যা রাখার জন্য স্টেট
  const [cartLength, setCartLength] = useState(0);

  const resultSectionRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: "", name: "সব ক্যাটাগরি" },
    { id: "Religious Book", name: "কুরআন শরীফ & ধর্মীয় বই" },
    { id: "Accessories", name: "তাসবিহ" },
    { id: "Islamic Books", name: "ইসলামিক বই" },
    { id: "Fragrance", name: "আতর" },
    { id: "Clothing", name: "পোশাক" },
    { id: "Prayer Mat", name: "জায়নামাজ" },
    { id: "Combo", name: "উপহার সামগ্রী" },
    { id: "Home Decor", name: "হোম ডেকোর" },
  ];

  // localStorage থেকে কার্টের সংখ্যা লোড করার জন্য useEffect
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartLength(items.length);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() && !selectedCategory) {
      setHasSearched(false);
      setSearchedProducts([]);
      return;
    }

    setHasSearched(true);
    setLoading(true);

    const delayDebounceFn = setTimeout(() => {
      const queryParams = new URLSearchParams();
      if (searchQuery.trim()) queryParams.append("search", searchQuery.trim());
      if (selectedCategory) queryParams.append("category", selectedCategory);

      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/shop?${queryParams.toString()}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setSearchedProducts(data.products || []);
          setLoading(false);

          if (resultSectionRef.current) {
            window.scrollTo({
              top: resultSectionRef.current.offsetTop - 120,
              behavior: "smooth",
            });
          }
        })
        .catch((err) => {
          console.error("Error searching products:", err);
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSearchedProducts([]);
    setHasSearched(false);
  };

  return (
    <section className="px-4 py-6 max-w-7xl mx-auto bg-white">
      <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-3xl shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="relative md:col-span-7 w-full">
          <Search
            className="absolute left-4 top-3.5 text-neutral-400"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="আপনার পছন্দের পণ্য বা বইটি এখানে সার্চ করুন..."
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] outline-none transition-all font-medium text-xs md:text-sm text-neutral-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative md:col-span-3 w-full">
          <Grid
            className="absolute left-4 top-3.5 text-neutral-400"
            size={16}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-[#0B5D3B] outline-none appearance-none font-bold text-xs text-neutral-700 cursor-pointer"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-5 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-500 w-0 h-0" />
        </div>

        <div className="md:col-span-2 w-full flex items-center justify-end gap-2">
          <button
            onClick={handleClearSearch}
            disabled={!hasSearched}
            className={`w-full md:w-max p-3.5 rounded-2xl flex items-center justify-center border transition-all ${
              hasSearched
                ? "bg-red-50 border-red-100 text-red-600 hover:bg-red-100 cursor-pointer"
                : "bg-neutral-100 border-transparent text-neutral-400 cursor-not-allowed"
            }`}
            title="ফিল্টার রিসেট করুন"
          >
            <RotateCcw size={18} />
          </button>

          {/* কার্ট বাটন - যেটিতে নোটিফিকেশন যুক্ত করা হয়েছে */}
          <button
            onClick={() => router.push("/cart")}
            className="relative w-full md:w-max p-3 bg-emerald-50 border border-emerald-100 text-[#0B5D3B] hover:bg-emerald-100 transition-all rounded-2xl flex items-center justify-center cursor-pointer"
            title="কার্ট পেজে যান"
          >
            আপনার কার্ট <ShoppingCart className="ml-2" size={18} />

            {/* যদি কার্টে ১ বা তার বেশি পণ্য থাকে তবেই ব্যাজটি দেখাবে */}
            {cartLength > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-red-500 text-white font-sans text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-md border border-white animate-pulse">
                {cartLength}
              </span>
            )}
          </button>
        </div>
      </div>

      <div ref={resultSectionRef} className="scroll-mt-24">
        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="mt-10 bg-neutral-50/50 border border-neutral-100 rounded-[2.5rem] p-4 md:p-8"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                <div>
                  <h3 className="font-black text-[#0B5D3B] text-sm md:text-base flex items-center gap-2">
                    <SearchCheck />
                    অনুসন্ধান ফলাফল
                    <span className="text-xs bg-emerald-50 text-[#0B5D3B] px-2.5 py-0.5 rounded-full font-bold">
                      {searchedProducts.length} টি পণ্য পাওয়া গেছে
                    </span>
                  </h3>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="text-[10px] hover:cursor-pointer font-bold text-neutral-500 bg-white px-4 py-1.5 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors shadow-xs"
                >
                  ফলাফল বন্ধ করুন
                </button>
              </div>

              {loading ? (
                <div className="py-12">
                  <LoadingSpinner />
                </div>
              ) : searchedProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5">
                  {searchedProducts.map((product) => (
                    <ProductCard
                      key={product.id || product._id}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100">
                  <p className="text-neutral-400 font-bold text-sm tracking-wider">
                    আপনার সার্চের সাথে মিলে যায় এমন কোনো পণ্য পাওয়া যায়নি!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProductSearchSection;
