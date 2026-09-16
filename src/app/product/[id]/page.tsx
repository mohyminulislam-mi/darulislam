"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import ProductCard from "@/src/components/Islamic-shop/ProductCard";
import {
  ChevronLeft,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";

const ProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://darulislam-server-v2.vercel.app/api/products/shop")
      .then((res) => res.json())
      .then((data) => {
        const found = data.products.find((p: any) => p.id === id);
        setProduct(found);

        const related = data.products
          .filter((p: any) => p.id !== id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);

        setRelatedProducts(related);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleGoBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  const handleBuyNow = () => {
    if (!product) return;
    const query = new URLSearchParams({
      id: String(product.id),
      name: String(product.name),
      price: String(product.price),
      image: String(product.image),
    }).toString();
    router.push(`/checkout?${query}`);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProductIndex = existingCart.findIndex(
      (item: any) => item.id === product.id,
    );

    if (existingProductIndex > -1) {
      existingCart[existingProductIndex].quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        category: product.category,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    Swal.fire({
      title: "মাশাআল্লাহ্!",
      text: `"${product.name}" সফলভাবে কার্টে যোগ করা হয়েছে।`,
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#0B5D3B", // আপনার থিম কালার গ্রিন
      cancelButtonColor: "#6b7280",
      confirmButtonText: "কার্ট পেজে যান",
      cancelButtonText: "আরো শপিং করুন",
      background: "#ffffff",
      customClass: {
        popup: "rounded-[2rem] font-sans", // এই rounded-[2rem] আপনার ২৪ পিক্সেলের কাজ করে দেবে
        title: "text-xl font-black text-neutral-900",
        confirmButton: "px-5 py-3 rounded-xl font-bold text-sm",
        cancelButton: "px-5 py-3 rounded-xl font-bold text-sm",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/cart"); // ইউজার কনফার্ম করলে কার্ট পেজে যাবে
      }
    });
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (!product)
    return (
      <div className="h-screen flex items-center justify-center text-red-500 font-bold">
        পণ্য পাওয়া যায়নি!
      </div>
    );

  const currentPrice = Number(product.price);
  const oldPrice = Math.floor(currentPrice * 1.2);

  return (
    <main className="min-h-screen bg-gray-50 pb-32 md:pb-12">
      {/* Navigation - Mobile */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b px-4 py-3 flex items-center justify-between md:hidden">
        <button
          onClick={handleGoBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <span className="font-bold text-gray-800 tracking-tight">
          বিস্তারিত
        </span>
        <button
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart className="w-6 h-6" />
        </button>
      </nav>

      <div className="max-w-6xl mx-auto md:py-10 md:px-6">
        {/* Product Info Card - Semantic Content */}
        <section className="flex flex-col lg:flex-row bg-white md:rounded-3xl overflow-hidden shadow-sm md:shadow-xl border-gray-100 mb-12">
          {/* Left: Image Section */}
          <div className="w-full lg:w-1/2 bg-white flex items-center justify-center relative group">
            <button
              onClick={handleGoBack}
              className="hidden md:flex absolute cursor-pointer top-6 left-6 z-10 items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold text-gray-700 shadow-sm border border-gray-100 hover:bg-[#0B5D3B] hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> ফিরে যান
            </button>

            <div className="relative w-full aspect-square md:aspect-[4/5] lg:aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-contain p-8 md:p-12 transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-red-500 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-black shadow-lg">
              ২০% ছাড়
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-1/2 p-6 md:p-10 lg:p-14 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-50">
            <header className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-green-50 text-[#0B5D3B] text-[10px] md:text-xs font-bold rounded-lg uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center text-yellow-400 gap-1 ml-auto">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-gray-700 text-xs font-bold">
                  {product.details.rating || "4.8"}
                </span>
              </div>
            </header>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.2] mb-6">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-3xl md:text-5xl font-black text-[#0B5D3B]">
                ৳{currentPrice}
              </span>
              <span className="text-lg md:text-xl text-gray-400 line-through decoration-red-400/50">
                ৳{oldPrice}
              </span>
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-3 gap-4 py-6 mb-8 border-y border-gray-100">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                  দ্রুত ডেলিভারি
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 border-x border-gray-100">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#0B5D3B]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                  ১০০% অরিজিনাল
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                  সহজ রিটার্ন
                </span>
              </div>
            </div>

            {/* Description */}
            <article className="mb-10">
              <h3 className="text-sm font-black text-gray-900 uppercase mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#0B5D3B] rounded-full inline-block"></span>
                পণ্যের বিবরণ
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {product.details.description}
              </p>
            </article>

            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 border-2 border-[#0B5D3B] text-[#0B5D3B] hover:bg-green-50 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-xs tracking-widest uppercase cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" /> কার্টে যোগ করুন
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-[2] py-4 hover:cursor-pointer bg-[#0B5D3B] text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-green-100 hover:bg-[#0c4a2d] transition-all transform active:scale-[0.98] uppercase text-xs tracking-widest"
              >
                সরাসরি অর্ডার করুন
              </button>
            </div>
          </div>
        </section>

        {/* --- Related Products Section --- */}
        <section className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl md:text-3xl font-black text-gray-900">
                আরো কিছু পণ্য
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                আপনার জন্য সেরা কিছু পছন্দ
              </p>
            </div>
            <button
              onClick={() => router.push("/islamic-shop")}
              className="flex items-center gap-2 text-xs md:text-sm font-black text-[#0B5D3B] hover:gap-3 transition-all hover:cursor-pointer"
            >
              সবগুলো দেখুন <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100 flex gap-3 z-50 md:hidden">
        <button
          onClick={handleAddToCart}
          className="w-14 h-14 flex items-center justify-center bg-green-50 text-[#0B5D3B] border border-green-200 rounded-2xl active:scale-95 transition-transform"
          title="কার্টে যোগ করুন"
        >
          <ShoppingCart className="w-6 h-6" />
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-[#0B5D3B] text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-green-200 text-sm uppercase tracking-widest active:scale-95 transition-transform"
        >
          সরাসরি কিনুন
        </button>
      </footer>
    </main>
  );
};

export default ProductDetails;
