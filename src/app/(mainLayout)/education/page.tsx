"use client";

import { useEffect, useState } from "react";
import CourseSection from "@/src/components/shared/EducationSectionShare";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import EducationHero from "@/src/components/Education/EducationHero/EducationHero";
import EduCategories from "@/src/components/mainLayout/Educations/EduCategories";
import { getAllCourses } from "@/src/lib/data";
import LoadingSpinner from "@/src/components/shared/spinner/LoadingSpinner";
import { ChevronDown } from "lucide-react";

const EducationPage = () => {
  const [data, setData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Track extended visibility state for separate course sections using dynamic key mapping
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllCourses();
        setData(result);
      } catch (err) {
        console.error("Error loading education data:", err);
      }
    };
    fetchData();
  }, []);

  if (!data) return <LoadingSpinner fullScreen />;

  const courseSections = Array.isArray(data?.courseSections)
    ? data.courseSections
    : [];

  const remainingSections = courseSections.filter(
    (item: any) =>
      !(item?.categoryName && item.categoryName.includes("ফ্রি কোর্স")),
  );

  const freeCoursesData = courseSections.find(
    (item: any) =>
      item?.categoryName && item.categoryName.includes("ফ্রি কোর্স"),
  );

  const filterBySearch = (sections: any[]) => {
    if (!sections || !Array.isArray(sections)) return [];
    return sections
      .map((section) => {
        const sectionCourses = Array.isArray(section?.courses)
          ? section.courses
          : [];
        return {
          ...section,
          courses: sectionCourses.filter((course: any) =>
            course?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        };
      })
      .filter((section) => section.courses && section.courses.length > 0);
  };

  const filteredEducationData2 = filterBySearch(remainingSections);

  const toggleSectionExpand = (idx: number) => {
    setExpandedSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const fadeInVariant = {
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.4, ease: "easeOut" },
  } as const;

  // Determine active searching status to dynamically handle sub-layout shifts
  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50/50 antialiased">
      <EducationHero searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* 🎯 Conditionally unmount category filter panel during active client-side searches */}
      {!isSearching && <EduCategories />}

      {/* মেইন ক্যাটাগরি কোর্স সেকশন সমূহ */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-12 lg:pt-16 space-y-16">
        {filteredEducationData2.map((section, idx) => {
          const allSectionCourses = section.courses || [];
          const hasMoreThanEight = allSectionCourses.length > 8;
          const isExpanded = expandedSections[idx];

          // 🎯 Slice the course data cleanly to default to 8 items unless explicitly toggled by user
          const optimizedSection = {
            ...section,
            courses: isExpanded
              ? allSectionCourses
              : allSectionCourses.slice(0, 8),
          };

          return (
            <motion.div
              key={idx}
              {...fadeInVariant}
              className="flex flex-col gap-4"
            >
              <CourseSection section={optimizedSection} />

              {/* Render structural "See More" controller element if bounds are satisfied */}
              {hasMoreThanEight && (
                <div className="w-full flex justify-center pt-2">
                  <button
                    onClick={() => toggleSectionExpand(idx)}
                    className="group flex items-center gap-1.5 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-[#0B5D3B] hover:border-[#0B5D3B]/30 font-bold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span>{isExpanded ? "কম দেখান" : "আরও দেখুন"}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${isExpanded ? "rotate-180 text-[#0B5D3B]" : "text-slate-400 group-hover:text-[#0B5D3B]"}`}
                    />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ফ্রি কোর্স সমূহ মডিউল */}
      {freeCoursesData &&
        Array.isArray(freeCoursesData.courses) &&
        (() => {
          const filteredFreeCourses = freeCoursesData.courses.filter((c: any) =>
            c?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
          );

          if (filteredFreeCourses.length === 0) return null;

          return (
            <section className="max-w-6xl mx-auto px-4 py-12">
              <motion.div
                {...fadeInVariant}
                className="relative border border-neutral-200/50 bg-white rounded-[2rem] p-5 md:p-8 shadow-2xs"
              >
                <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 bg-white px-5 py-1.5 border border-neutral-200/50 rounded-xl shadow-3xs z-10">
                  <h2 className="text-[#0B5D3B] font-black text-xs md:text-sm whitespace-nowrap uppercase tracking-wider">
                    {freeCoursesData.categoryName}
                  </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5 mt-6">
                  {filteredFreeCourses.map((course: any) => {
                    const courseId = course.id || course._id;
                    return (
                      <Link href={`/education/${courseId}`} key={courseId}>
                        <motion.div
                          whileHover={{ y: -4 }}
                          className="bg-slate-50/50 border border-neutral-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-neutral-200/50 transition-all duration-300 h-full flex flex-col justify-between"
                        >
                          <div className="relative aspect-video w-full bg-neutral-100 border-b border-neutral-100">
                            {course.image ? (
                              <Image
                                src={course.image}
                                alt={course.title}
                                fill
                                className="object-cover"
                                sizes="(max-w-7xl) 50vw, 25vw"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-[10px] text-neutral-400 font-bold px-2 text-center">
                                {course.title}
                              </div>
                            )}
                          </div>

                          <div className="p-3.5 text-center bg-white mt-auto">
                            <h3 className="text-xs font-bold text-neutral-700 line-clamp-1 mb-1.5">
                              {course.title}
                            </h3>
                            <p className="text-[#0B5D3B] font-black text-sm md:text-base">
                              {course.label || "ফ্রি"}
                            </p>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </section>
          );
        })()}
    </div>
  );
};

export default EducationPage;
