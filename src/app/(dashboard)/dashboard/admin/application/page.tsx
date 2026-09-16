"use client"

import { useState } from "react"
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter, 
  Eye, 
  FileText,
  Phone,
  BookOpen,
  X,
  User,
  Calendar,
  MapPin,
  University,
  Award,
  Mail,
  UserCheck
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// আরও কিছু ডেটা যুক্ত করা হলো মডালে বিস্তারিত দেখানোর জন্য
const initialApplications = [
  { 
    id: "APP-001", 
    name: "মুহাম্মদ রহিম", 
    fatherName: "আব্দুল করিম",
    motherName: "রহিমা বেগম",
    dob: "২০০৫-১০-১২",
    gender: "পুরুষ",
    course: "হিফযুল কুরআন", 
    date: "২০২৬-০৬-১৫", 
    status: "পেন্ডিং", 
    phone: "০১৭১২৩৪৫৬৭৮",
    email: "rahim@gmail.com",
    address: "মিরপুর-১০, ঢাকা",
    education: "দাখিল",
    proficiency: ["tajweed", "hifz"]
  },
  { 
    id: "APP-002", 
    name: "আব্দুল্লাহ আল মামুন", 
    fatherName: "মোঃ খলিলুর রহমান",
    motherName: "মরিয়ম নেছা",
    dob: "২০০৩-০৫-২০",
    gender: "পুরুষ",
    course: "আরবি ভাষা কোর্স", 
    date: "২০২৬-০৬-১৪", 
    status: "রিভিউ চলছে", 
    phone: "০১৯৮৭৬৫৪৩২১",
    email: "mamun@gmail.com",
    address: "চাষাড়া, নারায়ণগঞ্জ",
    education: "এইচএসসি",
    proficiency: ["read"]
  },
  { 
    id: "APP-003", 
    name: "ফাতিমা খাতুন", 
    fatherName: "নূর ইসলাম",
    motherName: "আয়েশা সিদ্দিকা",
    dob: "২০০৬-১২-০১",
    gender: "মহিলা",
    course: "তাজবীদ ও কিরাত", 
    date: "২০২৬-০৬-১২", 
    status: "গৃহীত", 
    phone: "০১৫৫৫৫৫৫৫৫৫",
    email: "fatima@gmail.com",
    address: "জিইসি মোড়, চট্টগ্রাম",
    education: "এসএসসি",
    proficiency: ["tajweed", "read", "mean"]
  }
]

// দক্ষতার লেবেল ম্যাপ করার জন্য অবজেক্ট
const proficiencyLabels: { [key: string]: string } = {
  tajweed: "তাজবীদ জানি",
  hifz: "হিফয করছি",
  read: "আরবি পড়তে পারি",
  mean: "অর্থ বুঝি"
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState(initialApplications)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("সব")
  
  // পপ-আপ মডালের জন্য স্টেট
  const [selectedApp, setSelectedApp] = useState<typeof initialApplications[0] | null>(null)

  // স্ট্যাটাস কাউন্ট
  const totalApps = applications.length
  const pendingApps = applications.filter(app => app.status === "পেন্ডিং").length
  const reviewedApps = applications.filter(app => app.status === "রিভিউ চলছে").length
  const acceptedApps = applications.filter(app => app.status === "গৃহীত").length

  // ফিল্টার ও সার্চ লজিক
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.phone.includes(searchTerm)
    const matchesFilter = statusFilter === "সব" || app.status === statusFilter
    return matchesSearch && matchesFilter
  })

  const handleStatusChange = (id: string, newStatus: string) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app))
  }

  return (
    <div className="min-h-screen bg-[#F7FBF7] p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* হেডার ও স্ট্যাটাস কার্ডস পূর্বের মতই থাকবে... */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-dashed border-[#0B3D2E]/10 pb-6">
          <div>
            <h1 className="text-3xl font-black text-[#0B3D2E]">ভর্তি ম্যানেজমেন্ট ড্যাশবোর্ড</h1>
            <p className="text-sm font-semibold text-[#0B3D2E]/50 mt-1">২০২৬ শিক্ষাবর্ষের সকল আবেদন এখানে ট্র্যাকিং করুন</p>
          </div>
        </div>

        {/* পরিসংখ্যান কার্ডসমূহ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-[#0B3D2E]/5 flex items-center justify-between">
            <div className="space-y-2"><p className="text-sm font-bold text-[#0B3D2E]/40">মোট আবেদন</p><p className="text-3xl font-black text-[#0B3D2E]">{totalApps} টি</p></div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Users size={24} /></div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-[#0B3D2E]/5 flex items-center justify-between">
            <div className="space-y-2"><p className="text-sm font-bold text-[#0B3D2E]/40">পেন্ডিং (নতুন)</p><p className="text-3xl font-black text-amber-600">{pendingApps} টি</p></div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><Clock size={24} /></div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-[#0B3D2E]/5 flex items-center justify-between">
            <div className="space-y-2"><p className="text-sm font-bold text-[#0B3D2E]/40">রিভিউ চলছে</p><p className="text-3xl font-black text-purple-600">{reviewedApps} টি</p></div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center"><FileText size={24} /></div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-[#0B3D2E]/5 flex items-center justify-between">
            <div className="space-y-2"><p className="text-sm font-bold text-[#0B3D2E]/40">ভর্তি অনুমোদিত</p><p className="text-3xl font-black text-green-600">{acceptedApps} টি</p></div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><CheckCircle size={24} /></div>
          </div>
        </div>

        {/* সার্চ এবং ফিল্টার বার */}
        <div className="bg-white p-4 rounded-2xl shadow-md border border-[#0B3D2E]/5 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B3D2E]/30" size={20} />
            <input 
              type="text" 
              placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B3D2E]/5 pl-12 pr-4 py-3 rounded-xl font-medium outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {["সব", "পেন্ডিং", "রিভিউ চলছে", "গৃহীত"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  statusFilter === status ? "bg-[#0B3D2E] text-white" : "bg-white text-[#0B3D2E]/70 border-[#0B3D2E]/10"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* টেবিল লিস্ট */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-[#0B3D2E]/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0B3D2E]/5 border-b border-[#0B3D2E]/10">
                  <th className="p-5 text-sm font-black text-[#0B3D2E] text-center">আইডি</th>
                  <th className="p-5 text-sm font-black text-[#0B3D2E]">আবেদনকারী</th>
                  <th className="p-5 text-sm font-black text-[#0B3D2E]">পছন্দের কোর্স</th>
                  <th className="p-5 text-sm font-black text-[#0B3D2E]">তারিখ</th>
                  <th className="p-5 text-sm font-black text-[#0B3D2E] text-center">বর্তমান অবস্থা</th>
                  <th className="p-5 text-sm font-black text-[#0B3D2E] text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3D2E]/5">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#0B3D2E]/5 transition-colors">
                    <td className="p-5 text-center text-xs font-bold text-gray-500">{app.id}</td>
                    <td className="p-5">
                      <div className="font-bold text-[#0B3D2E]">{app.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Phone size={12} /> {app.phone}</div>
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B3D2E]/5 text-[#0B3D2E] rounded-lg text-xs font-bold">
                        <BookOpen size={12} /> {app.course}
                      </span>
                    </td>
                    <td className="p-5 text-sm font-medium text-gray-600">{app.date}</td>
                    <td className="p-5 text-center">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-black ${
                        app.status === "পেন্ডিং" ? "bg-amber-100 text-amber-800" :
                        app.status === "রিভিউ চলছে" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                      }`}>{app.status}</span>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <select 
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-lg px-2 py-1.5 outline-none cursor-pointer"
                        >
                          <option value="পেন্ডিং">পেন্ডিং</option>
                          <option value="রিভিউ চলছে">রিভিউ চলছে</option>
                          <option value="গৃহীত">অনুমোদন করুন</option>
                        </select>
                        {/* চোখ আইকনে ক্লিক করলে মডাল ওপেন হবে */}
                        <button 
                          onClick={() => setSelectedApp(app)}
                          className="p-2 cursor-pointer text-gray-400 hover:text-[#0B3D2E] hover:bg-[#0B3D2E]/5 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* পপ-আপ মডাল সেকশন (Details Pop-up Modal) */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            {/* মডাল ব্যাকড্রপ ক্লিক করলে বন্ধ করার জন্য */}
            <div className="absolute inset-0" onClick={() => setSelectedApp(null)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl border border-[#0B3D2E]/10 w-full max-w-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
            >
              {/* মডাল হেডার */}
              <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">আবেদনের পূর্ণাঙ্গ বিবরণ</h2>
                    <p className="text-xs text-white/70 font-semibold mt-0.5">আইডি: {selectedApp.id} | তারিখ: {selectedApp.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 cursor-pointer rounded-xl flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* মডাল বডি (স্ক্রোলযোগ্য) */}
              <div className="p-8 overflow-y-auto space-y-6 text-[#0B3D2E]">
                
                {/* বেসিক ইনফো গ্রিড */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* নাম */}
                  <div className="space-y-1 bg-[#0B3D2E]/5 p-4 rounded-2xl">
                    <p className="text-xs font-black text-[#0B3D2E]/50 flex items-center gap-1.5 uppercase tracking-wider">
                      <User size={13} className="text-amber-600" /> আবেদনকারীর নাম
                    </p>
                    <p className="text-base font-black">{selectedApp.name}</p>
                  </div>

                  {/* কোর্সের নাম */}
                  <div className="space-y-1 bg-[#0B3D2E]/5 p-4 rounded-2xl">
                    <p className="text-xs font-black text-[#0B3D2E]/50 flex items-center gap-1.5 uppercase tracking-wider">
                      <BookOpen size={13} className="text-amber-600" /> পছন্দের কোর্স
                    </p>
                    <p className="text-base font-black text-emerald-700">{selectedApp.course}</p>
                  </div>

                  {/* পিতার নাম */}
                  <div className="space-y-1 bg-[#0B3D2E]/5 p-4 rounded-2xl">
                    <p className="text-xs font-black text-[#0B3D2E]/50 flex items-center gap-1.5 uppercase tracking-wider">
                      <UserCheck size={13} className="text-amber-600" /> পিতার নাম
                    </p>
                    <p className="text-base font-bold">{selectedApp.fatherName}</p>
                  </div>

                  {/* মাতার নাম */}
                  <div className="space-y-1 bg-[#0B3D2E]/5 p-4 rounded-2xl">
                    <p className="text-xs font-black text-[#0B3D2E]/50 flex items-center gap-1.5 uppercase tracking-wider">
                      <UserCheck size={13} className="text-amber-600" /> মাতার নাম
                    </p>
                    <p className="text-base font-bold">{selectedApp.motherName}</p>
                  </div>

                  {/* মোবাইল নম্বর */}
                  <div className="space-y-1 bg-[#0B3D2E]/5 p-4 rounded-2xl">
                    <p className="text-xs font-black text-[#0B3D2E]/50 flex items-center gap-1.5 uppercase tracking-wider">
                      <Phone size={13} className="text-amber-600" /> মোবাইল নম্বর
                    </p>
                    <p className="text-base font-black tracking-wide">{selectedApp.phone}</p>
                  </div>

                  {/* ইমেইল */}
                  <div className="space-y-1 bg-[#0B3D2E]/5 p-4 rounded-2xl">
                    <p className="text-xs font-black text-[#0B3D2E]/50 flex items-center gap-1.5 uppercase tracking-wider">
                      <Mail size={13} className="text-amber-600" /> ইমেইল ঠিকানা
                    </p>
                    <p className="text-base font-bold text-gray-600">{selectedApp.email || "প্রদান করা হয়নি"}</p>
                  </div>

                  {/* জন্ম তারিখ */}
                  <div className="space-y-1 bg-[#0B3D2E]/5 p-4 rounded-2xl">
                    <p className="text-xs font-black text-[#0B3D2E]/50 flex items-center gap-1.5 uppercase tracking-wider">
                      <Calendar size={13} className="text-amber-600" /> জন্ম তারিখ
                    </p>
                    <p className="text-base font-bold">{selectedApp.dob}</p>
                  </div>

                  {/* লিঙ্গ */}
                  <div className="space-y-1 bg-[#0B3D2E]/5 p-4 rounded-2xl">
                    <p className="text-xs font-black text-[#0B3D2E]/50 uppercase tracking-wider">লিঙ্গ</p>
                    <p className="text-base font-bold">{selectedApp.gender}</p>
                  </div>
                </div>

                {/* ফুল উইডথ ইনফো (ঠিকানা ও যোগ্যতা) */}
                <div className="space-y-4">
                  {/* বর্তমান ঠিকানা */}
                  <div className="space-y-1 bg-[#0B3D2E]/5 p-4 rounded-2xl">
                    <p className="text-xs font-black text-[#0B3D2E]/50 flex items-center gap-1.5 uppercase tracking-wider">
                      <MapPin size={13} className="text-amber-600" /> বর্তমান ঠিকানা
                    </p>
                    <p className="text-sm font-bold leading-relaxed">{selectedApp.address}</p>
                  </div>

                  {/* শিক্ষাগত যোগ্যতা */}
                  <div className="space-y-1 bg-[#0B3D2E]/5 p-4 rounded-2xl">
                    <p className="text-xs font-black text-[#0B3D2E]/50 flex items-center gap-1.5 uppercase tracking-wider">
                      <University size={13} className="text-amber-600" /> সর্বোচ্চ শিক্ষাগত যোগ্যতা
                    </p>
                    <p className="text-sm font-bold">{selectedApp.education || "প্রদান করা হয়নি"}</p>
                  </div>

                  {/* কুরআন সম্পর্কিত দক্ষতা */}
                  <div className="space-y-2 bg-[#0B3D2E]/5 p-4 rounded-2xl">
                    <p className="text-xs font-black text-[#0B3D2E]/50 flex items-center gap-1.5 uppercase tracking-wider">
                      <Award size={13} className="text-amber-600" /> কুরআন সম্পর্কিত দক্ষতা
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.proficiency && selectedApp.proficiency.length > 0 ? (
                        selectedApp.proficiency.map((skill) => (
                          <span key={skill} className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-xl text-xs font-bold">
                            ✓ {proficiencyLabels[skill] || skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 font-bold">কোনো দক্ষতা উল্লেখ করা হয়নি</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* মডাল ফুটার */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="cursor-pointer bg-[#0B3D2E] text-[#F5EFE1] px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}