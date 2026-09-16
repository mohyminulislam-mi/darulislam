
import { 
  UserCheck, 
  BookOpen, 
  FileVideo, 
  Award, 
  CreditCard, 
  MessageSquare, 
  ShieldAlert 
} from 'lucide-react';

// ১. আইকন ম্যাপকে একদম সহজ অবজেক্ট হিসেবে ইনিশিয়ালাইজ করা হলো (কোনো জটিল টাইপ ছাড়া)
const iconMap: Record<string, React.ElementType> = {
  "UserCheck": UserCheck,
  "BookOpen": BookOpen,
  "FileVideo": FileVideo,
  "Award": Award,
  "CreditCard": CreditCard,
  "MessageSquare": MessageSquare,
  "ShieldAlert": ShieldAlert,
};

// ২. মূল JSON ডাটা অবজেক্ট
const termsData = {
  title: "ব্যবহারের শর্তাবলি (Terms of Service)",
  institution: "দারুল ইসলাম ইনস্টিটিউট",
  intro: "দারুল ইসলাম ইনস্টিটিউট ওয়েবসাইট ব্যবহার এবং আমাদের যেকোনো কোর্সে অংশগ্রহণ করার মাধ্যমে আপনি নিম্নলিখিত শর্তাবলি মেনে নিতে সন্মতি প্রদান করছেন:",
  lastUpdated: "জুলাই ২০২৬",
  sections: [
    {
      id: 1,
      iconName: "UserCheck",
      heading: "১. সাধারণ নিয়ম ও সঠিক তথ্য প্রদান",
      type: "paragraphs",
      contents: [
        {
          label: "তথ্য প্রদান",
          text: "ভর্তির আবেদন বা যেকোনো ফর্ম পূরণের সময় শিক্ষার্থীকে অবশ্যই সঠিক এবং সত্য তথ্য প্রদান করতে হবে। ভুল বা মিথ্যা তথ্য প্রদান করলে কর্তৃপক্ষ ভর্তি বাতিল করার অধিকার রাখে।"
        },
        {
          label: "আচরণবিধি",
          text: "এটি একটি দ্বীনি প্রতিষ্ঠান। ক্লাসে বা গ্রুপ ডিসকাশনে শিক্ষক এবং সহপাঠীদের সাথে মার্জিত ও সম্মানজনক আচরণ করতে হবে। কোনো প্রকার হিংসা-বিদ্বেষ, উসকানিমূলক বা ধর্মীয় অবমাননামূলক কথা বলা সম্পূর্ণ নিষিদ্ধ। আমাদের লক্ষ্য সামগ্রিকভাবে দুনিয়া ও আখিরাতের কল্যাণ তালাশ করা।"
        }
      ]
    },
    {
      id: 2,
      iconName: "BookOpen",
      heading: "২. ক্লাস ও একাডেমিক নীতিমালা",
      type: "list",
      contents: [
        { label: "যোগাযোগ", text: "ক্লাস সংক্রান্ত বিশেষ ঘোষণা শুধুমাত্র WhatsApp গ্রুপ অথবা Google Classroom থেকে অ্যাডমিন জানাবেন।" },
        { label: "উপস্থিতি", text: "ইলম অর্জনের আদব রক্ষার্থে ক্লাস শুরুর ৩০ মিনিট আগে ওজু করে প্রস্তুত থাকার চেষ্টা করবেন। এটেন্ডেন্স শীটে নিয়মিত হাজিরা নিশ্চিত করা শিক্ষার্থীর দায়িত্ব। হাজিরা সংক্রান্ত কোনো সমস্যা হলে দ্রুত শিক্ষক বা মাদ্রাসার দৃষ্টি আকর্ষণ করতে হবে।" },
        { label: "লিঙ্ক ও নোটিফিকেশন", text: "গুগল মিট (Google Meet) ক্যালেন্ডারে ক্লাসের লিঙ্ক শিডিউল করা থাকবে। ক্লাস শুরুর ৩০ মিনিট আগে মোবাইল ও ইমেইলে নোটিফিকেশন যাবে। এই লিঙ্কটি সম্পূর্ণ কোর্সের জন্য অপরিবর্তিত থাকবে।" },
        { label: "মাইক্রোফোন সতর্কতা", text: "কথা বলার সময় খেয়াল রাখতে হবে যেন আপনার আশেপাশে কোনো অবাঞ্ছিত আওয়াজ না হয়, যাতে অন্যদের মনোযোগ বিঘ্নিত না হয়।" }
      ]
    },
    {
      id: 3,
      iconName: "FileVideo",
      heading: "৩. মেটেরিয়ালস ও রেকর্ডিং",
      type: "paragraphs",
      contents: [
        {
          label: "বৌদ্ধিক সম্পদ (IP)",
          text: "কোর্সে প্রদত্ত ভিডিও, পিডিএফ বা অন্যান্য শিক্ষা উপকরণ শুধুমাত্র আপনার ব্যক্তিগত ব্যবহারের জন্য। এগুলো অনুমতি ছাড়া বাণিজ্যিক উদ্দেশ্যে শেয়ার করা বা ইন্টারнеটে প্রকাশ করা আইনত দণ্ডনীয়।"
        },
        {
          label: "রেকর্ডিং",
          text: "ক্লাসের ভিডিও রেকর্ডিং সাধারণত ক্লাস শেষ হওয়ার ২ ঘণ্টার মধ্যে আপলোড করা হবে। দ্রুততম সময়ে ভিডিওটি দেখে নেওয়া বা ডাউনলোড করে নেওয়ার পরামর্শ দেওয়া হচ্ছে।"
        }
      ]
    },
    {
      id: 4,
      iconName: "Award",
      heading: "৪. মূল্যায়ন ও পরীক্ষা",
      type: "plain_text",
      text: "মাসিক ও সেমিস্টার ভিত্তিক পরীক্ষাগুলোতে অংশগ্রহণ করা বাধ্যতামূলক। পরীক্ষার ফলাфলের ওপর ভিত্তি করে আমরা আমাদের পাঠদান পদ্ধতি উন্নত করি। আপনার ভালো ফলাফলের জন্য আমরা সর্বোচ্চ চেষ্টা করি, তাই পরীক্ষায় অংশগ্রহণকে সর্বোচ্চ গুরুত্ব দিতে হবে।"
    },
    {
      id: 5,
      iconName: "CreditCard",
      heading: "৫. পেমেন্ট ও হাদিয়া পলিসি",
      type: "plain_text",
      text: "মাদ্রাসার ব্যয় নির্বাহের লক্ষ্যে নির্ধারিত মাসিক হাদিয়া বা ফি প্রতি মাসের ১ থেকে ১০ তারিখের মধ্যে পরিশোধ করতে হবে। ফি বকেয়া থাকলে কর্তৃপক্ষ ক্লাসে সাময়িক স্থগিতাদেশ দেওয়ার অধিকার রাখে।"
    },
    {
      id: 6,
      iconName: "MessageSquare",
      heading: "৬. অভিযোগ ও পরামর্শ",
      type: "plain_text",
      text: "ব্যাচের সময় পরিবর্তনসহ যেকোনো গঠনমূলক পরামর্শের জন্য নির্ধারিত অনলাইন ফর্ম ব্যবহার করতে হবে। ফর্ম পূরণের পর সমাধানের জন্য সবর (ধৈর্য) ধরে অপেক্ষা করতে হবে; কর্তৃপক্ষ অতি সত্বর ব্যবস্থা গ্রহণ করবে।"
    },
    {
      id: 7,
      iconName: "ShieldAlert",
      heading: "৭. Authorities অধিকার",
      type: "plain_text",
      text: "দারুল ইসলাম ইনস্টিটিউট যেকোনো সময় কোনো পূর্ব ঘোষণা ছাড়াই কোর্স মডিউল, সময়সূচী বা নীতিমালায় প্রয়োজনীয় পরিবর্তন করার সর্বময় অধিকার সংরক্ষণ করে।"
    }
  ]
};

export default function TermsOfService() {
  return (
    <div className="bg-gray-50 mt-16 min-h-screen text-gray-800 font-sans leading-relaxed">
      {/* Hero Section */}
      <div className="bg-emerald-800 text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {termsData.title}
        </h1>
        <p className="text-emerald-100 max-w-2xl mx-auto text-base md:text-lg">
          {termsData.intro}
        </p>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 space-y-10">
          
          {/* Loop through sections */}
          {termsData.sections.map((section) => {
            // আইকনটি ম্যাপ থেকে নেওয়া হচ্ছে, না থাকলে ফলব্যাক হিসেবে ShieldAlert বসবে
            const IconComponent = iconMap[section.iconName] || ShieldAlert;

            return (
              <section key={section.id} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <IconComponent className="text-emerald-600 w-6 h-6 shrink-0" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {section.heading}
                  </h2>
                </div>

                <div className="pl-0 md:pl-9 text-gray-600">
                  {/* Paragraph টাইপ ডেটা রেন্ডার */}
                  {section.type === "paragraphs" && section.contents && (
                    <div className="space-y-3">
                      {section.contents.map((item, idx) => (
                        <p key={idx}>
                          <strong className="text-gray-950 block mb-1">{item.label}:</strong>
                          {item.text}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* List টাইপ ডেটা রেন্ডার */}
                  {section.type === "list" && section.contents && (
                    <ul className="list-disc pl-5 space-y-2">
                      {section.contents.map((item, idx) => (
                        <li key={idx}>
                          <strong className="text-gray-950">{item.label}:</strong> {item.text}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Plain text টাইপ ডেটা রেন্ডার */}
                  {section.type === "plain_text" && section.text && (
                    <p>{section.text}</p>
                  )}
                </div>
              </section>
            );
          })}

        </div>
         {/* Footer Info */}
        <p className="text-center text-sm text-gray-400 mt-8">
          সর্বশেষ পরিমার্জিত: {termsData.lastUpdated}
        </p>
      </div>
    </div>
  );
}
