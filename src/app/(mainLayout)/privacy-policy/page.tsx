"use client";

import React from 'react';
import { 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Cookie, 
  Eye 
} from 'lucide-react';

// আইকন ডাইনামিক্যালি রেন্ডার করার জন্য ম্যাপ
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "UserPlus": UserPlus,
  "ShieldCheck": ShieldCheck,
  "Lock": Lock,
  "Cookie": Cookie,
};

const privacyData = {
  title: "গোপনীয়তা নীতি (Privacy Policy)",
  institution: "দারুল ইসলাম ইনস্টিটিউট",
  intro: "দারুল ইসলাম ইনস্টিটিউট আপনার ব্যক্তিগত তথ্যের নিরাপত্তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। আমাদের ওয়েবসাইট ব্যবহারের সময় আমরা কীভাবে আপনার তথ্য সংগ্রহ ও ব্যবহার করি, তা নিচে বিস্তারিত জানানো হলো:",
  lastUpdated: "জুলাই ২০২৬",
  sections: [
    {
      id: 1,
      iconName: "UserPlus",
      heading: "তথ্য সংগ্রহ",
      text: "ভর্তি বা কল বুকিংয়ের সময় আমরা আপনার নাম, মোবাইল নম্বর, ইমেইল ঠিকানা এবং প্রয়োজনীয় ক্ষেত্রে শিক্ষাগত যোগ্যতার তথ্য সংগ্রহ করি।"
    },
    {
      id: 2,
      iconName: "ShieldCheck",
      heading: "তথ্য ব্যবহার",
      text: "আপনার সংগৃহীত তথ্য মূলত আপনার সাথে যোগাযোগ করা, কোর্সের আপডেট জানানো এবং ক্লাসের লিঙ্ক প্রদানের জন্য ব্যবহার করা হয়।"
    },
    {
      id: 3,
      iconName: "Lock",
      heading: "তথ্য সুরক্ষা",
      text: "আমরা আপনার কোনো ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা পাচার করি না। আপনার তথ্য আমাদের সুরক্ষিত ডাটাবেজে সংরক্ষিত থাকে।"
    },
    {
      id: 4,
      iconName: "Cookie",
      heading: "কুকিজ (Cookies)",
      text: "ওয়েবসাইট ব্যবহারের অভিজ্ঞতা উন্নত করতে আমরা কুকিজ ব্যবহার করতে পারি, যা আপনার ব্রাউজিং প্যাটার্ন বুঝতে সাহায্য করে।"
    }
  ]
};

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 mt-17 min-h-screen text-gray-800 font-sans leading-relaxed">
      {/* Hero Header Section */}
      <div className="bg-emerald-800 text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {privacyData.title}
        </h1>
        <p className="text-emerald-100 max-w-2xl mx-auto text-base md:text-lg">
          {privacyData.intro}
        </p>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 space-y-8">
          
          {/* Loop through sections */}
          {privacyData.sections.map((section) => {
            // ডাইনামিক আইকন অ্যাসাইন এবং ফলব্যাক হিসেবে Eye আইকন সেট করা
            const IconComponent = iconMap[section.iconName] || Eye;

            return (
              <section key={section.id} className="group p-4 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all duration-200 max-w-11/12 mx-auto">
                <div className="flex items-start gap-4">
                  {/* Icon Wrapper */}
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200 shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-1">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">
                      {section.heading}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      {section.text}
                    </p>
                  </div>
                </div>
              </section>
            );
          })}

        </div>
        
        {/* Footer Info */}
        <p className="text-center text-sm text-gray-400 mt-8">
          সর্বশেষ পরিমার্জিত: {privacyData.lastUpdated}
        </p>
      </div>
    </div>
  );
}