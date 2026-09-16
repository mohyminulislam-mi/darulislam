"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../shared/spinner/LoadingSpinner";

const CategorySection = () => {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(false);

  const productsSectionRef = useRef<HTMLDivElement>(null);

  const categories = [
    {
      id: 1,
      name: "কুরআন শরীফ",
      slug: "Religious Book",
      image:
        "https://i.ibb.co.com/1f4vFQh9/360-F-263148731-URq-K7-TVJz0a1ja-V3-Iu-Ad-TBu-Xmoi4lc-A6.jpg",
    },
    {
      id: 2,
      name: "তাসবিহ",
      slug: "Accessories",
      image:
        "https://i.ibb.co.com/0jJJ8yMh/463087068-500611622945397-6536297165675071357-n-420x420.jpg",
    },
    {
      id: 3,
      name: "ইসলামিক বই",
      slug: "Islamic Books",
      image:
        "https://i.ibb.co.com/KzXKdMKt/png-row-islamic-books-transparent-background-378502811.webp",
    },
    {
      id: 4,
      name: "আতর",
      slug: "Fragrance",
      image: "https://i.ibb.co.com/rRR1Bstz/ramy-vicky-ator-3-ml-2.png",
    },
    {
      id: 5,
      name: "পোশাক",
      slug: "Clothing",
      image:
        "https://i.ibb.co.com/8g0CcrK3/pngtree-women-muslim-with-black-dress-png-image-5294699.png",
    },
    {
      id: 6,
      name: "জায়নামাজ",
      slug: "Prayer Mat",
      image:
        "https://i.ibb.co.com/0jJJ8yMh/463087068-500611622945397-6536297165675071357-n-420x420.jpg",
    },
    {
      id: 7,
      name: "উপহার সামগ্রী",
      slug: "Combo",
      image:
        "https://i.ibb.co.com/1f4vFQh9/360-F-263148731-URq-K7-TVJz0a1ja-V3-Iu-Ad-TBu-Xmoi4lc-A6.jpg",
    },
    {
      id: 8,
      name: "হোম ডেকোর",
      slug: "Home Decor",
      image:
        "https://i.ibb.co.com/1f4vFQh9/360-F-263148731-URq-K7-TVJz0a1ja-V3-Iu-Ad-TBu-Xmoi4lc-A6.jpg",
    },
  ];

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/shop`)
      .then((res) => res.json())
      .then((data) => setAllProducts(data.products || []))
      .catch((err) => console.error(err));
  }, []);

  const handleCategoryClick = (slug: string) => {
    if (activeCategory === slug) return;

    setLoading(true);
    setActiveCategory(slug);

    setTimeout(() => {
      const filtered = allProducts.filter((p) => p.category === slug);
      setFilteredProducts(filtered);
      setLoading(false);

      if (productsSectionRef.current) {
        window.scrollTo({
          top: productsSectionRef.current.offsetTop - 100,
          behavior: "smooth",
        });
      }
    }, 300);
  };

  return (
    <section className="px-4 py-8 max-w-7xl mx-auto bg-white">
      <div className="mb-6 mt-10">
        <h2 className="text-lg md:text-xl font-black text-[#0B5D3B]">
          ক্যাটেগরি সমূহ
        </h2>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-6 mb-12">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
            className="group cursor-pointer"
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={`relative w-full aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden border transition-all ${activeCategory === cat.slug ? "border-[#0B5D3B] bg-green-50" : "border-gray-100 bg-[#F3F4F6]"}`}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover p-2 md:p-4 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <span
                className={`text-[10px] md:text-xs font-bold text-center line-clamp-1 ${activeCategory === cat.slug ? "text-[#0B5D3B]" : "text-gray-600"}`}
              >
                {cat.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div ref={productsSectionRef} className="scroll-mt-20">
        {activeCategory !== "All" && (
          <div className="bg-gray-50 rounded-[2rem] p-4 md:p-8 mb-16 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 text-sm md:text-base">
                {categories.find((c) => c.slug === activeCategory)?.name}{" "}
                কালেকশন
              </h3>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setFilteredProducts([]);
                }}
                className="text-[10px] font-bold text-red-500 bg-white px-4 py-1.5 rounded-full border border-red-50 shadow-sm hover:bg-red-50 transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ৩. New Arrival */}
      <div className="mb-16">
        <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-6">
          নতুন আসা পণ্যসমূহ
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {allProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* ৪. Just For You */}
      <div className="bg-gray-50 rounded-[2.5rem] p-6 md:p-10 border border-gray-100 mb-10 text-center md:text-left">
        <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-1">
          আপনার জন্য বিশেষ কিছু
        </h2>
        <p className="text-xs text-gray-400 font-medium mb-8">
          Your personalized recommendations
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {allProducts
            .slice()
            .reverse()
            .slice(0, 6)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
