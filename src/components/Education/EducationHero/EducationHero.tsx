
import { Search, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  // 🎯 Adding callback props to hook into parent architecture query pipeline
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
}

const EducationHero = ({
  searchTerm,
  onSearchChange,
}: HeroProps) => {


  return (
    <div className="relative w-full bg-[#0B5D3B] overflow-hidden rounded-b-[2rem] lg:rounded-b-[3.5rem] mb-8">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/5 rounded-full -ml-16 -mb-16 blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-12 lg:pt-28 lg:pb-16 relative z-10">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-white text-[10px] md:text-xs backdrop-blur-md"
          >
            <BookOpen size={14} className="text-green-300" />
            <span>আধুনিক শিক্ষার এক অনন্য মাধ্যম</span>
          </motion.div>

          <motion.h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            আমাদের সকল <span className="text-green-300">শিক্ষামূলক</span> কোর্স
          </motion.h1>

          <motion.div className="max-w-xl mx-auto mt-6 relative">
            <div className="bg-white relative z-30 p-1.5 rounded-xl shadow-xl flex flex-col md:flex-row items-center gap-1.5">
              {/* Search Input */}
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="সার্চ করুন..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg focus:outline-none text-sm text-gray-700 bg-gray-50 border-transparent focus:bg-white focus:border-green-100 transition-all font-medium"
                />
              </div>

              {/* Dynamic Filter Dropdown & Search Button Group */}
              <div className="flex w-full md:w-auto gap-1.5 shrink-0">

                <button className="flex-1 md:flex-none bg-[#0B5D3B] hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-black text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-emerald-900/10 cursor-pointer active:scale-95">
                  সার্চ
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap justify-center gap-3 mt-4 text-white/60 text-[11px] md:text-xs">
              <span className="font-semibold uppercase tracking-wider opacity-80">
                জনপ্রিয়:
              </span>
              {["হিফজুল কুরআন", "আরবি সাহিত্য", "তাফসীর"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSearchChange(tag)}
                  className="hover:text-green-300 transition-colors font-medium cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EducationHero;