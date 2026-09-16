"use client"

import { HandHeart, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function DonationBanner() {
  return (
    <section className="px-4 py-14 lg:px-8 bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden">

      {/* bg blur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-green-200/30 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-300/30 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-screen-xl mx-auto 
        bg-gradient-to-br from-green-700 via-green-600 to-green-800 
        rounded-3xl p-8 lg:p-16 
        relative overflow-hidden shadow-2xl"
      >

        {/* inner glow */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

        {/* decorative glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-300/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-200/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">

          {/* Left */}
          <div className="space-y-6 max-w-2xl">

            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-200 px-4 py-1.5 rounded-full text-xs font-semibold">
              <HandHeart size={14} /> সদকায়ে জারিয়া
            </div>
            
            <h2 className="text-2xl lg:text-5xl font-extrabold text-white leading-tight">
              আপনার একটি দান হতে পারে <br />
              <span className="text-green-300">পরকালের পাথেয়</span>
            </h2>

            <p className="text-white/80 text-sm lg:text-base leading-relaxed">
              দারুল ইসলাম ইনস্টিটিউটের দ্বীনি কার্যক্রম পরিচালনায় আপনার সহযোগিতা আমাদের এগিয়ে নিয়ে যায়।
            </p>

            {/* points */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-white/70 text-xs font-medium pt-2">
              <span className="flex items-center gap-1"><Sparkles size={12} /> স্বচ্ছ হিসাব</span>
              <span className="flex items-center gap-1"><Sparkles size={12} /> সরাসরি প্রভাব</span>
              <span className="flex items-center gap-1"><Sparkles size={12} /> নিরাপদ</span>
            </div>

          </div>

          {/* Right */}
          <div className="flex flex-col items-center lg:items-end gap-4 w-full lg:w-auto">

            <Link 
              href="/donation" 
              className="group relative px-6 py-3 
              bg-white text-green-700 
              rounded-full font-semibold text-sm 
              shadow hover:bg-green-100 
              transition flex items-center gap-2"
            >
              এখনই দান করুন 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
            </Link>

            <p className="text-white/60 text-xs">
              বিকাশ / নগদ / রকেট / ব্যাংক
            </p>

          </div>

        </div>
      </motion.div>
    </section>
  )
}