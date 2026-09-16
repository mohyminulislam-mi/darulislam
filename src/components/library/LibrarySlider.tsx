import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
const bannerSlides = [
  {
    image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=900",
    tag: "জ্ঞান",
    title: "যাকাত ও ফিতরা",
    subtitle: "ইসলামের অন্যতম স্তম্ভ সম্পর্কে জানুন",
  },
  {
    image: "https://images.unsplash.com/photo-1564769610726-59cead6a6f8f?w=900",
    tag: "আমল",
    title: "ঈদের সুন্নাহ",
    subtitle: "ঈদের দিনের সঠিক আমলসমূহ",
  },
  {
    image: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=900",
    tag: "দু'আ",
    title: "রমাদানের বিশেষ দু'আ",
    subtitle: "প্রতিটি মুহূর্তের জন্য নির্বাচিত দু'আ",
  },
];

const LibrarySlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  /* Slider auto-advance */
  useEffect(() => {
    const t = setInterval(
      () => setCurrentSlide((p) => (p + 1) % bannerSlides.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <section>
      <div className="relative h-60 md:h-80 lg:h-[400px] rounded-[2rem] overflow-hidden shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={bannerSlides[currentSlide].image}
              alt="banner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
              <motion.span
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-xs md:text-sm bg-amber-400 text-amber-950 font-bold px-4 py-1.5 rounded-full mb-4 inline-block shadow-lg"
              >
                {bannerSlides[currentSlide].tag}
              </motion.span>
              <motion.h3
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-white font-bold text-3xl md:text-5xl leading-tight"
              >
                {bannerSlides[currentSlide].title}
              </motion.h3>
              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-base md:text-xl mt-3 max-w-2xl"
              >
                {bannerSlides[currentSlide].subtitle}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="absolute bottom-8 right-8 flex gap-2.5">
          {bannerSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-500 rounded-full ${
                i === currentSlide
                  ? "w-10 h-2 bg-white shadow-md"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LibrarySlider;
