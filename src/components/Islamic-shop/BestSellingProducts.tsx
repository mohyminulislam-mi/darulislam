"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight, Loader2, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../shared/spinner/LoadingSpinner";

const BestSellingProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/shop`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section
      id="best-selling-section"
      className="px-4 py-12 max-w-7xl mx-auto bg-white"
    >
      {/* হেডার সেকশন */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#0B5D3B]">
            সেরা পণ্য সমূহ
          </h2>
          <div className="w-16 h-1.5 bg-[#0B5D3B] rounded-full mt-2"></div>
        </div>
      </div>

      {/* প্রোডাক্ট গ্রিড: মোবাইল ২ কলাম, ট্যাবলেট ৪ কলাম, ডেস্কটপ ৬ কলাম */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5 mb-10">
        {products.slice(0, visibleCount).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* লোড মোর বাটন বা শেষ মেসেজ */}
      <div className="mt-6">
        {visibleCount < products.length ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 w-full max-w-md">
              <div className="h-[1px] bg-gray-100 flex-grow"></div>
              <p className="text-[10px] font-bold text-gray-300 italic whitespace-nowrap uppercase tracking-tighter">
                আরো {products.length - visibleCount} টি পণ্য বাকি আছে
              </p>
              <div className="h-[1px] bg-gray-100 flex-grow"></div>
            </div>

            <button
              onClick={handleLoadMore}
              className="w-full hover:cursor-pointer md:w-max md:px-16 py-4 bg-[#0B5D3B] text-white font-black rounded-2xl hover:bg-[#0d4d2e] transition-all active:scale-95 shadow-xl shadow-green-100 flex items-center justify-center gap-2"
            >
              আরও পণ্য দেখুন
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="h-[1px] bg-gray-100 w-full mb-4"></div>
            <p className="text-gray-300 font-bold text-sm tracking-widest">
              — আপনি সব পণ্য দেখে ফেলেছেন —
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellingProducts;
