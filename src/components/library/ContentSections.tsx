"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  ChevronRight,
  Globe2,
  Heart,
  MessagesSquare,
  NotebookPen,
  NotebookText,
  Users,
} from "lucide-react";
import { PiMosqueDuotone } from "react-icons/pi";
import {
  FaBook,
  FaBookOpen,
  FaMoon,
  FaMosque,
  FaPrayingHands,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { MetadataCounts } from "@/src/app/(mainLayout)/library/page";

interface ContentSectionsProps {
  metadataCounts?: MetadataCounts;
}

const ilmCategories = [
  {
    name: "কুরআন",
    slug: "quran",
    apiKey: "quran",
    icon: <NotebookText className="h-[22px] w-[22px]" />,
    tagline: "তিলাওয়াত, তাফসীর ও অনুবাদ",
  },
  {
    name: "হাদীস",
    slug: "hadis",
    apiKey: "hadith",
    icon: <PiMosqueDuotone className="h-[22px] w-[22px]" />,
    tagline: "সহীহ হাদীস ও সুন্নাহ",
  },
  {
    name: "কিতাব",
    slug: "kitab",
    apiKey: "kitab",
    icon: <FaBook className="h-5 w-5" />,
    tagline: "আকীদা, ফিকহ ও ইতিহাস",
  },
  {
    name: "প্রবন্ধ",
    slug: "probondho",
    apiKey: "probondho",
    icon: <NotebookPen className="h-[22px] w-[22px]" />,
    tagline: "সমসাময়িক ইসলামি চিন্তা",
  },
];

const amalCategories = [
  {
    name: "নামায",
    slug: "namaz",
    apiKey: "namaz",
    icon: <FaMosque className="h-[26px] w-[26px]" />,
    subtitle: "পাঁচ ওয়াক্ত সালাত ও সুন্নাহর নির্দেশনা",
    books: [
      "সহজ নামায শিক্ষা",
      "সালাতের মাসআলা",
      "ওযু ও পবিত্রতা",
      "মুসলিমের দৈনিক আমল",
    ],
  },
  {
    name: "দু'আ",
    slug: "dua",
    apiKey: "duwa",
    icon: <FaPrayingHands className="h-[26px] w-[26px]" />,
    subtitle: "প্রতিদিনের দু'আ ও যিকিরের সংগ্রহ",
    books: ["হিসনুল মুসলিম", "দৈনিক দু'আ সমূহ", "সকালের যিকির", "রাতের আমল"],
  },
  {
    name: "তারাবীহ",
    slug: "tarabih",
    apiKey: "tarabihi",
    icon: <FaMoon className="h-[26px] w-[26px]" />,
    subtitle: "রমাদানের ফজিলত ও তারাবীহর আমল",
    books: [
      "তারাবীহর নামায",
      "রমাদানের আমল",
      "রোযার মাসআলা",
      "শবে কদরের ফজিলত",
    ],
  },
];

const dawahCategories = [
  {
    name: "প্রতিবেশী ও পরিবার",
    slug: "family-dawah",
    apiKey: "neighbor",
    icon: <Heart className="h-[22px] w-[22px]" />,
    tagline: "ঘর থেকে শুরু হওয়া দাওয়াহ",
  },
  {
    name: "নও-মুসলিম নির্দেশিকা",
    slug: "new-muslim",
    apiKey: "new_muslim",
    icon: <Users className="h-[22px] w-[22px]" />,
    tagline: "নতুন মুসলিম ভাইবোনদের জন্য গাইড",
  },
  {
    name: "সমাজ ও দাওয়াহ",
    slug: "society-dawah",
    apiKey: "society",
    icon: <Globe2 className="h-[22px] w-[22px]" />,
    tagline: "সমাজে ইসলামের বার্তা পৌঁছানো",
  },
  {
    name: "প্রশ্নোত্তর",
    slug: "qa",
    apiKey: "qa",
    icon: <MessagesSquare className="h-[22px] w-[22px]" />,
    tagline: "প্রচলিত প্রশ্নের সহজ উত্তর",
  },
];

function SectionDivider() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 12"
      className="mx-auto mb-4 h-3 w-24 text-[#A9793C] opacity-70"
    >
      <path
        d="M0 6 H44 M76 6 H120 M60 0 L66 6 L60 12 L54 6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  id,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  id: string;
}) {
  return (
    <header className="mb-8 text-center sm:mb-10">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#A9793C] uppercase">
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="font-serif text-2xl font-bold text-[#20261F] sm:text-3xl md:text-4xl"
      >
        {title}
      </h2>
      <SectionDivider />
      {subtitle && (
        <p className="mx-auto max-w-2xl text-sm text-[#5B6359] sm:text-base">
          {subtitle}
        </p>
      )}
    </header>
  );
}

export default function ContentSections({
  metadataCounts,
}: ContentSectionsProps) {
  const getCount = (section: "ilm" | "amol" | "dawah", key: string): number => {
    return metadataCounts?.[section]?.[key] || 0;
  };

  return (
    <section className="min-h-screen bg-[#FAF7F1]">
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* ── ইলম ── */}
        <div aria-labelledby="ilm-heading">
          <SectionHeading
            id="ilm-heading"
            eyebrow="জ্ঞানার্জন"
            title="ইলম"
            subtitle="কুরআন, হাদীস, কিতাব ও প্রবন্ধ — মৌলিক ইসলামি জ্ঞানের উৎসসমূহ"
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {ilmCategories.map((c) => {
              const count = getCount("ilm", c.apiKey);
              return (
                <Link
                  key={c.slug}
                  href={`/library/${c.slug}`}
                  className="group block"
                >
                  <motion.article
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="flex h-full flex-col justify-between rounded-2xl border border-[#1A4731]/10 bg-white p-5 shadow-sm transition-colors group-hover:border-[#1A4731]/30 sm:p-6"
                  >
                    <div>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F5EE] text-[#1A4731]">
                        {c.icon}
                      </div>
                      <h3 className="font-serif text-base font-bold text-[#20261F] sm:text-lg">
                        {c.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#5B6359] sm:text-sm">
                        {c.tagline}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between text-xs font-semibold text-[#1A4731]">
                      <span>{count} টি সংকলন</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </motion.article>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── আমল ── */}
        <div aria-labelledby="amal-heading">
          <SectionHeading
            id="amal-heading"
            eyebrow="প্রাত্যহিক চর্চা"
            title="আমল"
            subtitle="নামায, দু'আ ও রমাদানের আমল সম্পর্কিত ব্যবহারিক নির্দেশনা"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {amalCategories.map((c) => {
              const count = getCount("amol", c.apiKey);
              return (
                <Link
                  key={c.slug}
                  href={`/library/${c.slug}`}
                  className="group block h-full"
                >
                  <motion.article
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="flex h-full flex-col rounded-2xl border border-[#A9793C]/20 bg-white p-6 shadow-sm transition-colors group-hover:border-[#A9793C]/50"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6EFE3] text-[#A9793C]">
                      {c.icon}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#20261F]">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#5B6359]">{c.subtitle}</p>

                    <ul className="mt-4 space-y-1.5 border-t border-dashed border-[#20261F]/10 pt-4">
                      {c.books.slice(0, 3).map((b) => (
                        <li
                          key={b}
                          className="flex items-center gap-2 text-xs text-[#5B6359] sm:text-sm"
                        >
                          <FaBookOpen className="h-3 w-3 shrink-0 text-[#A9793C]" />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex items-center justify-between pt-5 text-xs font-semibold text-[#A9793C]">
                      <span>{count} টি সংকলন</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </motion.article>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── দাওয়া ── */}
        <div aria-labelledby="dawah-heading">
          <SectionHeading
            id="dawah-heading"
            eyebrow="বার্তা পৌঁছে দিন"
            title="দাওয়া"
            subtitle="পরিবার, প্রতিবেশী ও সমাজে দাওয়াহর সহজ ও কার্যকর পদ্ধতি"
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {dawahCategories.map((c) => {
              const count = getCount("dawah", c.apiKey);
              return (
                <Link
                  key={c.slug}
                  href={`/library/${c.slug}`}
                  className="group block"
                >
                  <motion.article
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="flex h-full flex-col justify-between rounded-2xl border border-[#1A4731]/10 bg-white p-5 shadow-sm transition-colors group-hover:border-[#1A4731]/30 sm:p-6"
                  >
                    <div>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F5EE] text-[#1A4731]">
                        {c.icon}
                      </div>
                      <h3 className="font-serif text-base font-bold text-[#20261F] sm:text-lg">
                        {c.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#5B6359] sm:text-sm">
                        {c.tagline}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between text-xs font-semibold text-[#1A4731]">
                      <span>{count} টি সংকলন</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </motion.article>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── CTA ── */}
        <div
          aria-labelledby="cta-heading"
          className="rounded-3xl border border-[#A9793C]/20 bg-[#F6EFE3] px-6 py-10 text-center sm:px-12 sm:py-14"
        >
          <BookMarked className="mx-auto mb-4 h-7 w-7 text-[#A9793C]" />
          <h2
            id="cta-heading"
            className="font-serif text-xl font-bold text-[#20261F] sm:text-2xl"
          >
            আপনার শেখার যাত্রা আজই শুরু করুন
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5B6359]">
            পুরো লাইব্রেরিতে প্রবেশ করে ইলম, আমল ও দাওয়াহর সব কনটেন্ট এক
            জায়গায় পান।
          </p>
          <Link
            href="/library"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1A4731] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            <span>সম্পূর্ণ লাইব্রেরি দেখুন</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}