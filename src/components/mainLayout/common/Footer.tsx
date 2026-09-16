"use client";

import Link from "next/link";
import {
  Facebook,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Users,
  Youtube,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  // সোশ্যাল মিডিয়া লিংক এবং আইকন ডিফাইন করা হলো
  const socialMedia = [
    {
      Icon: Facebook,
      href: "https://www.facebook.com/darulislaminstituteofficial",
      label: "Facebook",
      color: "#1877F2", // Facebook Blue
    },
    {
      Icon: Users,
      href: "https://www.facebook.com/share/g/1D27qzwCFD/",
      label: "Males",
      color: "#1877F2",
    },
    {
      Icon: Facebook,
      href: "https://www.facebook.com/share/g/1Eiob31i6F/",
      label: "Females",
      color: "#1877F2",
    },
    {
      Icon: Youtube,
      href: "https://www.youtube.com/@darulislamInstitute",
      label: "Youtube",
      color: "#FF0000", // YouTube Red
    },
  ];

  return (
    <footer className="bg-[#123529] text-green-50 pt-24 pb-4 px-6 lg:px-8 border-t border-green-700/30 relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-repeat" />

      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8">
          {/* About */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src="/darulislaminstitute.jpeg"
                  alt="Darul Islam Institute"
                  className="rounded-full"
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-primary-text font-bold text-lg lg:text-xl">
                  দারুল ইসলাম ইনস্টিটিউট
                </span>
                <span className="text-primary-text text-[10px] hidden lg:block uppercase tracking-wider">
                  Darul Islam Institute
                </span>
              </div>
            </Link>

            <p className="text-sm font-medium leading-relaxed text-primary-text max-w-xs">
              একটি আধুনিক ও উন্নত ইসলামি শিক্ষাপ্রতিষ্ঠান যা কুরআন ও সুন্নাহর
              ভিত্তিতে জীবন গড়ার নিরলস প্রচেষ্টা চালিয়ে যাচ্ছে।
            </p>

            {/* সোশ্যাল মিডিয়া সেকশন */}
            <div className="flex gap-4">
              {socialMedia.map(({ Icon, href, label, color }, i) => (
                <Link
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={
                    {
                      "--brand-color": color,
                    } as React.CSSProperties
                  }
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[var(--brand-color)] hover:bg-[var(--brand-color)] hover:text-white transition-all"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-8 lg:pl-8">
            <h3 className="text-medium font-black text-primary-text uppercase tracking-widest flex items-center gap-3">
              <div className="w-6 h-0.5 bg-primary-text" /> গুরুত্বপূর্ণ লিংক
            </h3>

            <ul className="space-y-4">
              {[
                { name: "আমাদের সম্পর্কে", href: "/about" },
                { name: "শর্ত বলি ও নিয়মাবলী", href: "/terms-of-service" },
                { name: "গোপনীয়তা নীতি", href: "/privacy-policy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 text-sm font-bold text-primary-hover hover:text-primary-hover transition-all group"
                  >
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-8 lg:pl-8">
            <h3 className="text-medium font-black text-primary-text uppercase tracking-widest flex items-center gap-3">
              <div className="w-6 h-0.5 bg-primary-text" /> তথ্য ও সাহায্য
            </h3>

            <ul className="space-y-4">
              {[
                { name: "সচরাচর জিজ্ঞাসা ", href: "/faq" },
                { name: "অভিযোগ বাক্স", href: "/complain-box" },
                { name: "রিফান্ড পলিসি", href: "/refund-return-policy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 text-sm font-bold text-primary-hover hover:text-primary-text transition-all group"
                  >
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h3 className="text-medium font-black text-primary-text uppercase tracking-widest flex items-center gap-3">
              <div className="w-6 h-0.5 bg-primary-text" /> যোগাযোগ
            </h3>

            <ul className="space-y-6 text-green-primary-text">
              <li className="flex gap-4 items-center">
                <Phone className="text-primary-text" size={18} />
                <Link
                  href="tel:+8801792297764"
                  className="text-primary-text transition"
                >
                  +880 1792297764
                </Link>
              </li>

              <li className="flex gap-4 items-center">
                <Mail className="text-primary-text" size={18} />
                <Link
                  href="mailto:darulislaminstituteofficial@gmail.com"
                  className="text-primary-text transition break-all"
                >
                  darulislaminstituteofficial@gmail.com
                </Link>
              </li>
              <li className="flex gap-4">
                <MapPin className="text-primary-text" size={18} />
                <span className="text-primary-text">
                  মোহাম্মদপুর, ঢাকা 1207, বাংলাদেশ
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom */}
        <div className="mt-8 pt-4 border-t border-green-700/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs">© ২০২৬ দারুল ইসলাম — সকল স্বত্ব সংরক্ষিত</p>

          <div className="flex bg-white/5 rounded-xl overflow-hidden">
            <Link
              href="https://universesofttech.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs text-white hover:text-primary-text"
            >
              Develop by universesofttech.co
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
