"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  GraduationCap,
  HandHeart,
  User,
  Store,
} from "lucide-react";
import { motion } from "framer-motion";
import useUserRole from "@/src/app/hooks/useUserRole";

const staticNavItems = [
  { name: "হোম", href: "/", icon: Home },
  { name: "শিক্ষা", href: "/education", icon: GraduationCap },
  { name: "লাইব্রেরি", href: "/library", icon: BookOpen },
  { name: "ইসলামিক শপ", href: "/islamic-shop", icon: Store },
  { name: "দান", href: "/donation", icon: HandHeart },
];

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const pathname = usePathname();

  const { role, isAdmin, isTeacher, isStudent } = useUserRole();

  const getProfileHref = () => {
    if (isStudent) return "/student-profile";
    if (isTeacher) return "/dashboard/teacher";
    if (isAdmin) return "/dashboard/admin";
    return "/auth/login";
  };

  const navItems = [
    ...staticNavItems,
    { name: "প্রোফাইল", href: getProfileHref(), icon: User },
  ];

  /* Active check: exact match for "/", prefix match for the rest */
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const diff = currentY - lastScrollY.current;

          if (Math.abs(diff) < 8) {
            ticking.current = false;
            return;
          }

          if (diff > 0 && currentY > 80) {
            setShowNavbar(false);
          } else {
            setShowNavbar(true);
          }

          lastScrollY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* main nav wrapper mamah */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: showNavbar ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed top-0 left-0 w-full z-40 will-change-transform shadow-md"
      >
        <div className="bg-[#0B3D2E] mt-16 lg:mt-17">
          <nav className="bg-[#F3F8F4] border-b border-[#DCEADE]">
            <div className="max-w-screen-xl mx-auto grid grid-cols-6 h-14">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex flex-col items-center justify-center relative group transition-all
                      ${
                        active
                          ? " text-[#0B5D3B]"
                          : "text-[#10231B] hover:bg-[#E0F2E7]"
                      }
                    `}
                  >
                    {/* Icon with animated pop on active */}
                    <motion.div
                      key={active ? "active" : "inactive"}
                      initial={active ? { scale: 0.7, opacity: 0 } : false}
                      animate={active ? { scale: 1, opacity: 1 } : {}}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <Icon
                        size={20}
                        strokeWidth={active ? 2.8 : 2.5}
                        className={active ? "text-[#0B5D3B]" : ""}
                      />
                    </motion.div>

                    <span
                      className={`text-[10px] sm:text-[11px] font-bold mt-1 ${
                        active ? "text-[#0B5D3B]" : ""
                      }`}
                    >
                      {item.name}
                    </span>

                    {/* Active indicator bar */}
                    {active ? (
                      <motion.div
                        layoutId="active-bar"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0B5D3B]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    ) : (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0B3D2E] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </motion.div>

      <div className="h-14" />
    </>
  );
}
