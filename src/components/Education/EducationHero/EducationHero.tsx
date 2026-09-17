import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  // 🎯 Adding callback props to hook into parent architecture query pipeline
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
}

const EducationHero = ({ searchTerm, onSearchChange }: HeroProps) => {
  return (
    <div>
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
  );
};

export default EducationHero;
