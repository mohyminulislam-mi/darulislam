"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
} from "lucide-react";
import { useForm, ValidationError } from '@formspree/react';

export default function ContactPage() {
  // Formspree হুক ব্যবহার করা হচ্ছে (আপনার ফর্ম আইডি: mdaqknqo)
  const [state, handleSubmit] = useForm("mdaqknqo");

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FBF7]">
      {/* Hero Section */}
      <div className="relative h-48 lg:h-64 bg-[#0B3D2E] flex items-end p-6 lg:p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-repeat" />
        <div className="relative z-10 w-full max-w-screen-xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 bg-[#8FE3A9] rounded-2xl flex items-center justify-center text-[#0B3D2E] shadow-lg">
            <MessageSquare size={40} />
          </div>
          <div>
            <h1 className="text-2xl lg:text-4xl font-black">যোগাযোগ</h1>
            <p className="text-sm font-bold text-[#F5EFE1]/80 uppercase tracking-widest mt-1">
              আমাদের সাথে সংযুক্ত হোন
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto w-full px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-xl border border-[#0B3D2E]/5 space-y-4"
            >
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-black text-[#0B3D2E]">ঠিকানা</h3>
              <p className="text-sm font-medium text-[#0B3D2E]/60 leading-relaxed">
                দারুল ইসলাম ইনস্টিটিউট ক্যাম্পাস,
                <br />
                মোহাম্মদপুর, ঢাকা 1207, বাংলাদেশ
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-xl border border-[#0B3D2E]/5 space-y-4"
            >
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-black text-[#0B3D2E]">
                ফোন ও মোবাইল
              </h3>
              <p className="text-sm font-medium text-[#0B3D2E]/60 leading-relaxed">
                হেল্পলাইন: +880 1792297764
                <br />
                অফিস: +880 1792297764
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-3xl shadow-xl border border-[#0B3D2E]/5 space-y-4"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-black text-[#0B3D2E]">ইমেইল</h3>
              <p className="text-sm font-medium text-[#0B3D2E]/60 leading-relaxed">
                darulislaminstituteofficial@gmail.com
              </p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-2xl border-4 border-amber-50"
            >
              {/* state.succeeded সরাসরি ব্যবহার করা হচ্ছে সাকসেস মেসেজের জন্য */}
              {state.succeeded ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Send size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-[#0B3D2E]">
                    ধন্যবাদ!
                  </h2>
                  <p className="text-lg text-[#0B3D2E]/60 font-medium">
                    আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে
                    যোগাযোগ করব।
                  </p>
                  {/* Formspree রিসেট করার জন্য উইন্ডো রিলোড বা স্টেট ক্লিয়ার করতে পারেন */}
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-[#0B3D2E] text-[#F5EFE1] px-8 py-3 rounded-2xl font-bold cursor-pointer transition-all hover:bg-[#06261d]"
                  >
                    আবার পাঠান
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* নাম */}
                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-widest">
                        আপনার নাম
                      </label>
                      <input
                        required
                        type="text"
                        name="name" // Formspree-এর জন্য যুক্ত করা হয়েছে
                        placeholder="নাম লিখুন"
                        className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all"
                      />
                      <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-xs" />
                    </div>

                    {/* মোবাইল নম্বর */}
                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-widest">
                        মোবাইল নম্বর
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone" // Formspree-এর জন্য যুক্ত করা হয়েছে
                        placeholder="০১৭XXXXXXXX"
                        className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all"
                      />
                      <ValidationError prefix="Phone" field="phone" errors={state.errors} className="text-red-500 text-xs" />
                    </div>

                    {/* ইমেইল */}
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-widest">
                        ইমেইল (ঐচ্ছিক)
                      </label>
                      <input
                        type="email"
                        name="email" // Formspree-এর জন্য যুক্ত করা হয়েছে
                        placeholder="example@gmail.com"
                        className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all"
                      />
                      <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs" />
                    </div>

                    {/* বার্তার বিষয় */}
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-widest">
                        বার্তার বিষয়
                      </label>
                      <input
                        required
                        type="text"
                        name="subject" // Formspree-এর জন্য যুক্ত করা হয়েছে
                        placeholder="বিষয় লিখুন"
                        className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all"
                      />
                      <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-red-500 text-xs" />
                    </div>

                    {/* আপনার বার্তা */}
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-sm font-black text-[#0B3D2E]/60 uppercase tracking-widest">
                        আপনার বার্তা
                      </label>
                      <textarea
                        required
                        rows={5}
                        name="message" // Formspree-এর জন্য যুক্ত করা হয়েছে
                        placeholder="এখানে আপনার বার্তা লিখুন..."
                        className="w-full bg-[#0B3D2E]/5 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-[#0B3D2E]/20 outline-none transition-all resize-none"
                      />
                      <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-xs" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full cursor-pointer bg-[#0B3D2E] text-[#F5EFE1] py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:translate-y-[-2px] active:translate-y-[2px] transition-all disabled:opacity-50"
                  >
                    {state.submitting ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"} <Send size={24} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}