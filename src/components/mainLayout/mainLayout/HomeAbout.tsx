import { CheckCircle2 } from "lucide-react";

const points = [
  "যোগ্য ও অভিজ্ঞ শিক্ষকবৃন্দ",
  "সুশৃঙ্খল শিক্ষাক্রম",
  "নিরাপদ ইসলামী পরিবেশ",
  "তারবিয়াহর প্রতি বিশেষ গুরুত্ব",
];

export default function HomeAbout() {
  return (
    <section id="about" className="max-w-6xl mx-auto bg-white py-16 md:py-24 max-w-11/12 mx-auto">
      <div className="container-content grid items-center gap-12 md:grid-cols-2">
        <div className="relative">
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-pale to-brand/10">
            <img src="/hujur.jpg" alt="" />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden rounded-xl bg-brand px-6 py-4 text-white shadow-lg md:block">
            <p className="text-2xl font-bold">১৫+</p>
            <p className="text-xs text-white/80">বিশ্বাসের বছর</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold tracking-wide text-brand">
            হামিদ একাডেমি সম্পর্কে
          </p>

          <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            মানসম্মত শিক্ষার মাধ্যমে{" "}
            <span className="text-brand">আদর্শ মুসলিম গড়ে তোলা</span>
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-gray-600">
            হামিদ একাডেমিতে আমাদের লক্ষ্য হলো ইসলামের বিশুদ্ধ ও প্রামাণিক
            শিক্ষার সঙ্গে আধুনিক শিক্ষার সমন্বয় করা।
          </p>

          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            আমরা এমন শিক্ষার্থী গড়ে তুলতে চাই, যারা দৃঢ় ঈমান, উত্তম চরিত্র
            এবং বর্তমান বিশ্বের চ্যালেঞ্জ মোকাবিলায় প্রয়োজনীয় জ্ঞান ও
            দক্ষতায় সমৃদ্ধ হবে।
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <div key={point} className="flex items-center gap-2">
                <CheckCircle2 size={18} className="flex-none text-brand" />
                <span className="text-sm text-gray-700">{point}</span>
              </div>
            ))}
          </div>

          <a
            href="#"
            className="mt-8 inline-block rounded-full bg-primary-light px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-light"
          >
            আমাদের সম্পর্কে আরও জানুন
          </a>
        </div>
      </div>
    </section>
  );
}