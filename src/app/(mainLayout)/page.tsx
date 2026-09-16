import React from "react";
import HeroSection from "@/src/components/mainLayout/home/HeroSection";
import Course from "@/src/components/LandingPageLayout/Course/Course";
import Academic from "@/src/components/LandingPageLayout/Academic/Academic";
import AmaderTeacher from "@/src/components/LandingPageLayout/AmaderTeacher/AmaderTeacher";
import AboutHome from "@/src/components/mainLayout/home/AboutHome";
import WhyChoose from "@/src/components/mainLayout/home/WhyChoose";
import StudentSlider from "@/src/components/LandingPageLayout/BestStudents/BestStudents";
// import DonationSection from "@/src/components/LandingPageLayout/DonationSection/DonationSection";
// import AdmissionInfo from "@/src/components/LandingPageLayout/AddmissionDoc/AddmissionInfo";
import GallerySection from "@/src/components/LandingPageLayout/GallerySection/GallerySection";
import Testimonials from "@/src/components/LandingPageLayout/Testimonial/Testimonials";

/* ── MAIN PAGE ── */
export default function Home() {
  return (
    <>
      {/* Hero Section with Slides */}
      <HeroSection />
      {/* ── ABOUT SECTION ── */}
      <AboutHome />
      {/* ── COURSES ── */}
      <Course />
      {/* ── ACADEMIC DEPARTMENTS ── */}
      <Academic />
      {/* ── TEACHERS ── */}
      <AmaderTeacher />
      {/* ── STUDENTS ── */}
      <StudentSlider />
      {/* ──  ADMISSION INFO ── */}
      {/* <AdmissionInfo /> */}
      {/* ──  GALLERY ── */}
      <GallerySection />
      {/* ──  WHY CHOOSE US ── */}
      <WhyChoose />
      {/* ──  TESTIMONIALS ── */}
      <Testimonials />
      {/* Donation section */}
      {/* <DonationSection /> */}
    </>
  );
}
