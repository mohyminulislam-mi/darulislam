"use client"

import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, ChevronDown, MessageCircle, PhoneCall } from "lucide-react"
import { useState } from "react"
import Link from "next/link";

const faqs = [
  {
    question: "ভর্তির জন্য ন্যূনতম যোগ্যতা কী?",
    answer: "হিফজ বিভাগের জন্য ন্যূনতম বয়স ৭ বছর হতে হবে। আলিম কোর্সের জন্য দাখিল বা সমমান পাস হতে হবে। তবে আগ্রহী বয়স্কদের জন্য নৈশকালীন বিশেষ কোর্স চালু রয়েছে।"
  },
  {
    question: "আবাসিক ব্যবস্থা আছে কি?",
    answer: "হ্যাঁ, আমাদের অত্যন্ত সুন্দর ও নিরাপদ ছাত্রাবাস রয়েছে। দূরবর্তী শিক্ষার্থীদের জন্য উন্নত আবাসন ও খাবারের সুব্যবস্থা প্রদান করা হয়।"
  },
  {
    question: "পড়াশোনার পাশাপাশি অন্য কোনো দক্ষতা শেখানো হয় কি?",
    answer: "অবশ্যই। আমরা তথ্য-প্রযুক্তি, হস্তলিপি এবং ইংরেজি ও আরবি ভাষার ওপর বিশেষ কর্মশালার আয়োজন করি যাতে শিক্ষার্থীরা কর্মজীবনে সফল হতে পারে।"
  },
  {
    question: "অনলাইনে পড়ার সুযোগ আছে কি?",
    answer: "হ্যাঁ, আমাদের নির্দিষ্ট কিছু শর্ট কোর্স অনলাইনে করার সুবিধা রয়েছে। তবে নিয়মিত হিফজ ও আলিম কোর্সের জন্য সশরীরে উপস্থিত থাকা বাঞ্ছনীয়।"
  },
  {
    question: "মাদরাসার ফিস কত?",
    answer: "হিফজ বিভাগ সম্পূর্ণ ফ্রি। অন্যান্য সাধারণ কোর্সের জন্য নামমাত্র ফি নেওয়া হয়ে থাকে যা এতিম ও দরিদ্র মেধাবী শিক্ষার্থীদের ক্ষেত্রে মওকুফযোগ্য।"
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="flex flex-col min-h-screen bg-[#F7FBF7] max-w-11/12 mx-auto">
      {/* Hero Section */}
      <div className="relative h-48 lg:h-64 bg-[#0B3D2E] flex items-end p-6 lg:p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-repeat" />
        <div className="relative z-10 w-full max-w-screen-xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 bg-[#8FE3A9] rounded-2xl flex items-center justify-center text-[#0B3D2E] shadow-lg">
            <HelpCircle size={40} />
          </div>
          <div>
            <h1 className="text-2xl lg:text-4xl font-black">সাধারণ জিজ্ঞাসা</h1>
            <p className="text-sm font-bold text-[#F5EFE1]/80 uppercase tracking-widest mt-1">সচরাচর জিজ্ঞাসিত প্রশ্নের উত্তর</p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto w-full px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl shadow-lg border border-[#0B3D2E]/5 overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#0B3D2E]/5 transition-colors"
              >
                <span className="text-lg font-black text-[#0B3D2E]">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                >
                  <ChevronDown className="text-amber-600" size={24} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-[#0B3D2E]/70 font-medium leading-relaxed border-t-2 border-dashed border-[#0B3D2E]/5">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-[#0B3D2E] p-8 rounded-[3rem] text-white space-y-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#8FE3A9] text-[#0B3D2E] rounded-2xl flex items-center justify-center">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-xl font-black">আমাদের সাথে কথা বলুন</h3>
            <p className="opacity-70 text-sm">আপনার যদি আরও প্রশ্ন থাকে তবে আমাদের হোয়াটসঅ্যাপ যোগাযোগ করতে পারেন।</p>
            <Link href="https://wa.me/+880 1792297764" target="_blank" rel="noopener noreferrer" className="bg-[#8FE3A9] text-[#0B3D2E] px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform">লাইভ চ্যাট</Link>
          </div>
          <div className="bg-white p-8 rounded-[3rem] border-4 border-amber-100 space-y-4 flex flex-col items-center text-center shadow-xl">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
              <PhoneCall size={32} />
            </div>
            <h3 className="text-xl font-black text-[#0B3D2E]">হেল্পলাইন</h3>
            <p className="text-[#0B3D2E]/60 text-sm">সরাসরি কথা বলতে ফোন করুন আমাদের হেল্পলাইনে।</p>
            <p className="text-3xl font-black text-[#0B3D2E]">০১৭৯২২৯৭৭৬৪</p>
          </div>
        </div>
      </div>
    </section>
  )
}
