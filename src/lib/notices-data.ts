// src/lib/notices-data.ts

export type Notice = {
  id: number
  slug: string
  category: "ভর্তি" | "পরীক্ষা" | "ছুটি" | "অনুষ্ঠান" | "ফলাফল"
  title: string
  desc: string
  time: string
  color: "amber" | "blue" | "green" | "purple" | "rose"
  body: string
  author: string
  views: number
}

export const notices: Notice[] = [
  {
    id: 1,
    slug: "nayi-bhoti-1446-ah",
    category: "ভর্তি",
    title: "নতুন ভর্তি চলছে ১৪৪৬ হিজরী",
    desc: "হিফজ, আলিম ও আরবি প্রোগ্রামে ভর্তি চলছে। আসন সীমিত, আজই অনলাইনে আবেদন করুন।",
    time: "২ দিন আগে",
    color: "amber",
    author: "ভর্তি বিভাগ",
    views: 342,
    body: `
      <p class="text-lg font-black text-[#0B3D2E]">📢 দারুল ইসলাম ইনস্টিটিউট ১৪৪৬ হিজরীর জন্য ভর্তি ঘোষণা করছে।</p>
      <div class="my-6 bg-[#F7FBF7] p-6 rounded-3xl border border-amber-200">
        <p class="font-black text-sm mb-3 text-[#0B3D2E]">📚 উপলব্ধ কোর্সসমূহ:</p>
        <ul class="space-y-2 text-sm font-bold opacity-70">
          <li>• হিফজুল কুরআন (২ বছর)</li>
          <li>• আলিম কোর্স (৬ বছর)</li>
          <li>• ইফতা বিশেষায়িত কোর্স</li>
          <li>• আরবি ভাষা ডিপ্লোমা</li>
          <li>• ইসলামী অর্থনীতি সার্টিফিকেট</li>
        </ul>
      </div>
      <p class="font-medium leading-relaxed">🗓️ আবেদনের শেষ তারিখ: ১৫ই শাবান। 📍 সরাসরি ইন্টারভিউ রোববার থেকে বৃহস্পতিবার, সকাল ৯টা–দুপুর ১২টা। প্রয়োজনীয় কাগজপত্র সঙ্গে আনুন (জাতীয় পরিচয়পত্র, পূর্ববর্তী সনদ, ছবি)।</p>
      <div class="bg-[#0B3D2E] text-[#F5EFE1] p-4 rounded-2xl mt-6 flex items-center gap-3">
        <span class="text-sm font-black">📧 যোগাযোগ: admission@darulislam.edu | ☎️ ০১৮০০-১২৩৪৫৬</span>
      </div>
    `
  },
  {
    id: 2,
    slug: "barshik-poriksha-2025",
    category: "পরীক্ষা",
    title: "বার্ষিক পরীক্ষার সময়সূচি ২০২৫",
    desc: "সকল শ্রেণির পরীক্ষার তারিখ ও নির্দেশিকা প্রকাশিত হয়েছে।",
    time: "৫ দিন আগে",
    color: "blue",
    author: "পরীক্ষা নিয়ন্ত্রণ বিভাগ",
    views: 518,
    body: `
      <p class="text-lg font-black text-[#0B3D2E]">📋 সকল শ্রেণির পরীক্ষার সময়সূচি প্রকাশিত হয়েছে।</p>
      <div class="grid grid-cols-1 gap-3 my-6">
        <div class="bg-white border-2 border-blue-100 p-4 rounded-2xl flex justify-between items-center">
          <span class="font-black">হিফজ (মৌখিক)</span>
          <span class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">৫ই মার্চ</span>
        </div>
        <div class="bg-white border-2 border-blue-100 p-4 rounded-2xl flex justify-between items-center">
          <span class="font-black">আলিম প্রথম বর্ষ</span>
          <span class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">৭ই মার্চ</span>
        </div>
        <div class="bg-white border-2 border-blue-100 p-4 rounded-2xl flex justify-between items-center">
          <span class="font-black">আলিম দ্বিতীয় বর্ষ</span>
          <span class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">৯ই মার্চ</span>
        </div>
        <div class="bg-white border-2 border-blue-100 p-4 rounded-2xl flex justify-between items-center">
          <span class="font-black">আরবি ইন্টেনসিভ</span>
          <span class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">১০ই মার্চ</span>
        </div>
        <div class="bg-white border-2 border-blue-100 p-4 rounded-2xl flex justify-between items-center">
          <span class="font-black">ইফতা বিভাগ</span>
          <span class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">১২ই মার্চ</span>
        </div>
      </div>
      <p class="text-sm font-medium leading-relaxed opacity-60">সম্পূর্ণ সময়সূচি প্রশাসনিক অফিস থেকে সংগ্রহ করা যাবে অথবা স্টুডেন্ট পোর্টাল থেকে ডাউনলোড করা যাবে।</p>
      <div class="bg-blue-50 p-4 rounded-2xl mt-4 border border-blue-100">
        <p class="text-sm font-bold text-blue-800">⚠️ নোট: পরীক্ষার দিন সকাল ৮:৩০ মিনিটের মধ্যে কেন্দ্রে উপস্থিত থাকতে হবে।</p>
      </div>
    `
  },
  {
    id: 3,
    slug: "eid-al-fitr-chutti",
    category: "ছুটি",
    title: "ঈদুল ফিতর উপলক্ষে ছুটির নোটিশ",
    desc: "ঈদ উপলক্ষে ইনস্টিটিউট বন্ধ থাকবে। সকলকে ঈদ মোবারক।",
    time: "১ সপ্তাহ আগে",
    color: "green",
    author: "প্রশাসন বিভাগ",
    views: 876,
    body: `
      <p class="text-lg font-black text-[#0B3D2E]">🌙 দারুল ইসলাম ইনস্টিটিউট ২৭শে রমজান থেকে ৫ই শাওয়াল পর্যন্ত ঈদুল ফিতর উপলক্ষে বন্ধ থাকবে।</p>
      <p class="mt-4 font-medium leading-relaxed">৬ই শাওয়াল থেকে পুনরায় ক্লাস শুরু হবে। আমরা সকল শিক্ষার্থী ও শিক্ষকমণ্ডলীকে পরিবারসহ আনন্দময় ও বরকতময় ঈদের শুভেচ্ছা জানাই।</p>
      <div class="mt-6 bg-green-50 p-6 rounded-3xl border border-green-100">
        <p class="text-sm font-black text-green-800">🕌 মূল মসজিদে ঈদের নামাজ: সকাল ৭:৩০। সকলকে আমন্ত্রণ।</p>
      </div>
      <div class="mt-4 bg-amber-50 p-4 rounded-2xl border border-amber-100">
        <p class="text-sm font-bold text-amber-800">📅 ছুটির সময়সীমা: ২৭ রমজান – ৫ শাওয়াল | ক্লাস পুনরায়: ৬ শাওয়াল</p>
      </div>
    `
  },
  {
    id: 4,
    slug: "hifz-fasil-2025-falafal",
    category: "ফলাফল",
    title: "হিফজ ফাসিল পরীক্ষার ফলাফল ২০২৫",
    desc: "এ বছর মোট ৪৭ জন শিক্ষার্থী পরীক্ষায় অংশ নিয়ে ৪৪ জন উত্তীর্ণ হয়েছেন।",
    time: "৩ দিন আগে",
    color: "purple",
    author: "পরীক্ষা নিয়ন্ত্রণ বিভাগ",
    views: 1204,
    body: `
      <p class="text-lg font-black text-[#0B3D2E]">🎉 হিফজ ফাসিল পরীক্ষার ফলাফল প্রকাশিত হয়েছে।</p>
      <div class="grid grid-cols-3 gap-4 my-6">
        <div class="bg-purple-50 border border-purple-100 p-4 rounded-2xl text-center">
          <p class="text-3xl font-black text-purple-700">৪৭</p>
          <p class="text-xs font-bold text-purple-500 mt-1">মোট পরীক্ষার্থী</p>
        </div>
        <div class="bg-green-50 border border-green-100 p-4 rounded-2xl text-center">
          <p class="text-3xl font-black text-green-700">৪৪</p>
          <p class="text-xs font-bold text-green-500 mt-1">উত্তীর্ণ</p>
        </div>
        <div class="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-center">
          <p class="text-3xl font-black text-amber-700">৯৩%</p>
          <p class="text-xs font-bold text-amber-500 mt-1">পাসের হার</p>
        </div>
      </div>
      <p class="font-medium leading-relaxed">বিস্তারিত ফলাফল প্রশাসনিক অফিস থেকে সংগ্রহ করুন অথবা স্টুডেন্ট পোর্টালে প্রবেশ করুন।</p>
      <div class="mt-6 bg-[#0B3D2E] text-[#F5EFE1] p-4 rounded-2xl">
        <p class="text-sm font-black">🏆 শীর্ষ তিনজন শিক্ষার্থীকে বিশেষ পুরস্কার প্রদান করা হবে আগামী সাপ্তাহিক অনুষ্ঠানে।</p>
      </div>
    `
  },
  {
    id: 5,
    slug: "istiqbal-majlis-nayi-shikshak",
    category: "অনুষ্ঠান",
    title: "নতুন শিক্ষকদের বরণ অনুষ্ঠান",
    desc: "আগামী বৃহস্পতিবার নতুন যোগদানকৃত শিক্ষকদের আনুষ্ঠানিক পরিচয় ও বরণ অনুষ্ঠান অনুষ্ঠিত হবে।",
    time: "২ সপ্তাহ আগে",
    color: "rose",
    author: "ছাত্র কার্যক্রম বিভাগ",
    views: 289,
    body: `
      <p class="text-lg font-black text-[#0B3D2E]">🌹 নতুন শিক্ষকদের আনুষ্ঠানিক বরণ অনুষ্ঠান আয়োজন করা হয়েছে।</p>
      <div class="my-6 bg-rose-50 p-6 rounded-3xl border border-rose-100">
        <ul class="space-y-3 text-sm font-bold">
          <li class="flex items-center gap-3"><span class="text-rose-500">📅</span> <span>তারিখ: আগামী বৃহস্পতিবার</span></li>
          <li class="flex items-center gap-3"><span class="text-rose-500">🕐</span> <span>সময়: বিকাল ৩:০০ – ৫:০০</span></li>
          <li class="flex items-center gap-3"><span class="text-rose-500">📍</span> <span>স্থান: মূল হলরুম, ২য় তলা</span></li>
          <li class="flex items-center gap-3"><span class="text-rose-500">👤</span> <span>প্রধান অতিথি: মুহতামিম সাহেব দামাত বারাকাতুহুম</span></li>
        </ul>
      </div>
      <p class="font-medium leading-relaxed">সকল শিক্ষার্থী ও শিক্ষকমণ্ডলীকে উপস্থিত থাকার অনুরোধ করা হচ্ছে। অনুষ্ঠান শেষে বিশেষ মিষ্টান্ন বিতরণ করা হবে।</p>
    `
  },
  {
    id: 6,
    slug: "library-nayi-kitab-sangrah",
    category: "অনুষ্ঠান",
    title: "লাইব্রেরিতে নতুন কিতাব সংযোজন",
    desc: "দারুল ইসলাম লাইব্রেরিতে ৫০০টিরও বেশি নতুন ইসলামী গ্রন্থ সংযোজিত হয়েছে।",
    time: "৩ সপ্তাহ আগে",
    color: "green",
    author: "লাইব্রেরি বিভাগ",
    views: 431,
    body: `
      <p class="text-lg font-black text-[#0B3D2E]">📚 দারুল ইসলাম লাইব্রেরিতে নতুন কিতাবের বিশাল সংগ্রহ যুক্ত হয়েছে।</p>
      <div class="grid grid-cols-2 gap-3 my-6">
        <div class="bg-green-50 border border-green-100 p-4 rounded-2xl">
          <p class="text-2xl font-black text-green-700">৫০০+</p>
          <p class="text-xs font-bold text-green-500 mt-1">নতুন কিতাব</p>
        </div>
        <div class="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
          <p class="text-2xl font-black text-amber-700">১২টি</p>
          <p class="text-xs font-bold text-amber-500 mt-1">নতুন বিষয়</p>
        </div>
      </div>
      <div class="my-4 bg-white border border-[#0B3D2E]/10 p-5 rounded-2xl">
        <p class="font-black text-sm text-[#0B3D2E] mb-3">উল্লেখযোগ্য বিষয়সমূহ:</p>
        <ul class="space-y-1 text-sm font-medium opacity-70">
          <li>• তাফসীর ও উলুমুল কুরআন</li>
          <li>• হাদীস ও উসুলুল হাদীস</li>
          <li>• ফিকহ ও উসুলুল ফিকহ</li>
          <li>• আরবি ব্যাকরণ ও সাহিত্য</li>
          <li>• ইসলামী ইতিহাস ও সীরাত</li>
        </ul>
      </div>
      <p class="text-sm font-medium leading-relaxed opacity-60">লাইব্রেরি খোলার সময়: রোববার – বৃহস্পতিবার, সকাল ৮টা – বিকাল ৫টা।</p>
    `
  }
]

export const categories = ["সব", "ভর্তি", "পরীক্ষা", "ছুটি", "অনুষ্ঠান", "ফলাফল"]
