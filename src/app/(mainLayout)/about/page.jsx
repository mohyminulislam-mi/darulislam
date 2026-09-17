import React from "react";
import AboutSection from "@/src/components/mainLayout/about/About";
import SuccessStats from "@/src/components/mainLayout/about/SuccessStats";
import DeeniShikhkhaSection from "@/src/components/mainLayout/about/DeeniShikhkhaSection";
import TeamGallery from "@/src/components/mainLayout/about/TeamGallery";
import CommitteeSection from "@/src/components/mainLayout/about/CommitteeSection";
import BookPromotionBanner from "@/src/components/mainLayout/about/BookPromotionBanner";

async function getFullAboutPageData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const [aboutRes, maleTeachersRes, femaleTeachersRes] = await Promise.all([
      fetch(`${baseUrl}/content/page/about/all-sections`, {
        cache: "no-store",
      }),
      fetch(`${baseUrl}/teachers?gender=male`, { cache: "no-store" }),
      fetch(`${baseUrl}/teachers?gender=female`, { cache: "no-store" }),
    ]);

    const aboutData = aboutRes.ok ? await aboutRes.json() : {};
    const maleTeachers = maleTeachersRes.ok ? await maleTeachersRes.json() : [];
    const femaleTeachers = femaleTeachersRes.ok
      ? await femaleTeachersRes.json()
      : [];

    return {
      content: aboutData?.content || {},
      maleTeachers: Array.isArray(maleTeachers) ? maleTeachers : [],
      femaleTeachers: Array.isArray(femaleTeachers) ? femaleTeachers : [],
    };
  } catch (error) {
    console.error("Failed to fetch full about page data pipeline:", error);
    return { content: {}, maleTeachers: [], femaleTeachers: [] };
  }
}

export default async function AboutPage() {
  const { content, maleTeachers, femaleTeachers } =
    await getFullAboutPageData();

  return (
    <>
      <section className="max-w-11/12 mx-auto">
        <AboutSection data={content?.hero || {}} />
      </section>
      <section className="max-w-11/12 mx-auto">
        <SuccessStats data={content?.stats || {}} />
      </section>
      <section className="max-w-11/12 mx-auto">
        <DeeniShikhkhaSection data={content?.importance || {}} />
      </section>
      <section className="max-w-11/12 mx-auto">
        <TeamGallery data={content?.team_gallery || {}} />
      </section>
      <section className="max-w-11/12 mx-auto">
        <CommitteeSection
          data={content?.committee || {}}
          maleTeachers={maleTeachers}
          femaleTeachers={femaleTeachers}
        />
      </section>
      <section className="max-w-11/12 mx-auto">
        <BookPromotionBanner />
      </section>
    </>
  );
}