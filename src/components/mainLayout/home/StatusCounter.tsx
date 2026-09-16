"use client"
import React from 'react';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const StatusCounter = () => {

  const { ref, inView } = useInView({
    triggerOnce: true, // একবারই run হবে
    threshold: 0.4,    // 40% visible হলে start
  });

  const stats = [
    { label: "শিক্ষার্থী", value: 2500, suffix: "+", icon: <Users size={28} /> },
    { label: "শিক্ষক", value: 120, suffix: "+", icon: <GraduationCap size={28} /> },
    { label: "কোর্স", value: 45, suffix: "+", icon: <BookOpen size={28} /> },
  ];

  return (
    <section 
      ref={ref}
      className="py-4 md:py-8 bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden"
    >
      {/* background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-300 opacity-30 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">

          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative p-3 md:p-7 rounded-2xl 
              bg-white/70 backdrop-blur-lg border border-green-100
              shadow-md hover:shadow-2xl 
              transition duration-300 transform hover:-translate-y-2"
            >

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-100 to-green-200 opacity-0 group-hover:opacity-20 transition"></div>

              {/* icon */}
              <div className="mx-auto w-12 h-12 md:w-14 md:h-14 
              bg-gradient-to-br from-green-100 to-green-200 
              rounded-full flex items-center justify-center mb-3 
              text-green-700 shadow-inner">
                {stat.icon}
              </div>

              {/* number */}
              <h4 className="text-2xl md:text-3xl font-extrabold text-green-800">
                {inView ? (
                  <CountUp end={stat.value} duration={2} />
                ) : (
                  0
                )}
                {stat.suffix}
              </h4>

              {/* label */}
              <p className="text-sm md:text-base text-neutral-600 font-medium mt-1">
                {stat.label}
              </p>

              <div className="mt-3 h-1 w-0 group-hover:w-12 mx-auto bg-green-500 rounded-full transition-all duration-300"></div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default StatusCounter;