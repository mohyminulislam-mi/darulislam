import React from "react";
import Course from "@/src/components/LandingPageLayout/Course/Course";
import Academic from "@/src/components/LandingPageLayout/Academic/Academic";
import AmaderTeacher from "@/src/components/LandingPageLayout/AmaderTeacher/AmaderTeacher";
import FreeTest from "@/src/components/mainLayout/mainLayout/FreeTest";
import WhyChoose from "@/src/components/mainLayout/home/WhyChoose";
import StudentSlider from "@/src/components/LandingPageLayout/BestStudents/BestStudents";
// import DonationSection from "@/src/components/LandingPageLayout/DonationSection/DonationSection";
// import AdmissionInfo from "@/src/components/LandingPageLayout/AddmissionDoc/AddmissionInfo";
import GallerySection from "@/src/components/LandingPageLayout/GallerySection/GallerySection";
import Testimonials from "@/src/components/LandingPageLayout/Testimonial/Testimonials";
import Hero from "@/src/components/mainLayout/mainLayout/Hero";
import HomeAbout from "@/src/components/mainLayout/mainLayout/HomeAbout";
import WhyChooseUs from "@/src/components/mainLayout/mainLayout/WhyChooseUs";
import Stats from "@/src/components/mainLayout/mainLayout/Stats";
import CTA from "@/src/components/mainLayout/mainLayout/CTA";

/* ── MAIN PAGE ── */
export default function Home() {
  return (
    <>
      {/* Hero Section with Slides */}
      {/* <HeroSection /> */}
      <Hero />
      {/* ── ABOUT SECTION ── */}
      <HomeAbout />
      <FreeTest />
      {/* ── COURSES ── */}
      <WhyChooseUs />
      <Stats />
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
      <CTA />
    </>
  );
}
