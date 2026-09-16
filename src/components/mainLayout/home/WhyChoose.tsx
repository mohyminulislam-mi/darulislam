import React from "react";

const Features = {
  Teacher: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-green-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  Mosque: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-green-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  ),
  Graduation: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-green-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 14l9-5-9-5-9 5 9 5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 14l6.16-3.422A12.083 12.083 0 0112 21a12.083 12.083 0 01-6.16-3.422L12 14z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 9v5" />
    </svg>
  ),
  Online: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-green-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
};
const WhyChoose = () => {
  return (
    <section className="px-5">
      <div className="bg-[#faf6ec] shadow-[inset_0_0_20px_rgba(245,158,11,0.4)] max-w-7xl mx-auto px-5 py-6 rounded-2xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">
            কেন আমাদের বেছে নিবেন?
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto text-sm md:text-base">
            দারুল ইসলাম ইনস্টিটিউট নৈতিক ও আধুনিক শিক্ষার এক অনন্য সমন্বয়।
          </p>
        </div>
        {/* Mobile: 2 cols, md+: 4 cols */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <Features.Teacher />, title: "অভিজ্ঞ শিক্ষক" },
            { icon: <Features.Mosque />, title: "ইসলামিক পরিবেশ" },
            { icon: <Features.Graduation />, title: "মানসম্মত শিক্ষা" },
            { icon: <Features.Online />, title: "অনলাইন সুবিধা" },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 bg-[#f8faf8] p-5 rounded-2xl border border-green-50 shadow-inner"
            >
              <div className="p-3 bg-white rounded-full shadow-md border border-gray-50">
                {feature.icon}
              </div>
              <p className="text-sm md:text-base font-semibold text-green-900 leading-tight">
                {feature.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
