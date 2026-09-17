import {
  BookOpenText,
  Landmark,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: BookOpenText,
    title: "কুরআন শিক্ষা",
    desc: "তাজবিদ, নাজেরা, হিফজ ও তাফসির প্রোগ্রাম",
  },
  {
    icon: Landmark,
    title: "ইসলামিক স্টাডিজ",
    desc: "ফিকহ, হাদিস, সীরাত ও ইসলামী মূল্যবোধ",
  },
  {
    icon: GraduationCap,
    title: "আধুনিক শিক্ষা",
    desc: "গণিত, বিজ্ঞান, ইংরেজি ও প্রযুক্তি শিক্ষা",
  },
  {
    icon: Sparkles,
    title: "চরিত্র গঠন",
    desc: "নেতৃত্ব, শৃঙ্খলা ও ব্যক্তিগত উন্নয়ন",
  },
];

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat md:pt-20 pt-10"
      style={{
        backgroundImage: "url('/madina.png')",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-brand-dark/60"></div>

      <div className="relative z-10">
        <div className="container-content relative py-16 md:py-24">
          <p className="mb-4 max-w-md text-left font-serif text-lg text-gold/90 md:text-xl">
            اقرأ باسم ربك الذي خلق
          </p>

          <h1 className="max-w-xl text-4xl font-bold leading-tight text-white md:text-5xl">
            আধুনিক ও ইসলামি শিক্ষার <span className="text-gold">এক অপূর্ব সমন্বয়</span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/80 md:text-base">
            সহজ পদ্ধতিতে তাজবীদসহ কুরআন শিক্ষা ও হিফজ প্রোগ্রাম
          </p>

          <div className="mt-6 flex md:flex-wrap gap-2">
            <Link
              href="#"
              className="rounded-full bg-gold px-5 md:px-7 py-3 text-sm font-semibold text-brand-dark transition hover:bg-gold-dark"
            >
              ভর্তি হতে ক্লিক করুন &gt;
            </Link>

            <Link
              href="#courses"
              className="rounded-full border border-white/40 px-5 md:px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              কোর্সসমূহ দেখুন
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Strip */}
      <div className="relative z-10 bg-primary-light/95">
        <div className="container-content grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-white/10 text-gold">
                <Icon size={20} />
              </span>

              <div>
                <p className="text-sm font-semibold text-white">
                  {title}
                </p>

                <p className="mt-1 text-xs leading-snug text-white/60">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}