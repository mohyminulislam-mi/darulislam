"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Home,
  University,
  HandHeart,
  User,
  Menu,
  X,
  ChevronRight,
  Book,
  FileText,
  Users,
  Settings,
  Info,
  Image as ImageIcon,
  LogIn,
  UserPlus,
  BellRing,
  LogOut,
  LayoutDashboard,
  LucideIcon,
  InfoIcon,
  Briefcase,
} from "lucide-react";
import Swal from "sweetalert2";
import useUserRole from "@/src/app/hooks/useUserRole";
import Image from "next/image";

interface SubmenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface MenuItem {
  name: string;
  href?: string;
  icon?: LucideIcon;
  submenu?: SubmenuItem[];
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { user, role, isLoading } = useUserRole();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি আপনার অ্যাকাউন্ট থেকে লগআউট করতে যাচ্ছেন!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0B3D2E",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, লগআউট করুন",
      cancelButtonText: "বাতিল",
      background: "#F5EFE1",
      color: "#10231B",
    }).then(async (result) => {
      if (result.isConfirmed) {
        queryClient.clear();
        await signOut({ callbackUrl: "/auth/login" });

        Swal.fire({
          title: "লগআউট সফল!",
          text: "আপনার সেশনটি সফলভাবে শেষ হয়েছে।",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "#F5EFE1",
          color: "#10231B",
        });
      }
    });
  };

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  // 🔹 রোল-ভিত্তিক ডাইনামিক ড্যাশবোর্ড পাথ হ্যান্ডলার
  const getDashboardHref = () => {
    if (role === "admin") return "/dashboard/admin";
    return "/dashboard/teacher";
  };

  const drawerMenuItems: MenuItem[] = [
    { name: "হোম", href: "/", icon: Home },
    {
      name: "আমাদের সম্পর্কে",
      href: "/about",
    },
    {
      name: "একাডেমিক বিবরণ",
      submenu: [
        { name: "একাডেমিক", href: "/education", icon: University },
        { name: "ভর্তি ফর্ম", href: "/auth/register", icon: FileText },
        { name: "নোটিশ বোর্ড", href: "/notice", icon: FileText },
        { name: "প্রায়শই প্রশ্নাবলী", href: "/faq", icon: InfoIcon },
      ],
    },
    {
      name: "বিভাগসমূহ",
      submenu: [
        { name: "কোর্স সমূহ", href: "/education", icon: Book },
        { name: "দাওয়াহ", href: "/dawah", icon: Users },
      ],
    },
    {
      name: "অন্যান্য তথ্যসমূহ",
      submenu: [
        { name: "চাকরি তথ্যসমূহ", href: "/jobs", icon: Briefcase },
        {
          name: "শংসাপত্র-যাচাই",
          href: "/certificate-verification",
          icon: Info,
        },
      ],
    },
    { name: "দান", href: "/donation", icon: HandHeart },
    { name: "যোগাযোগ", href: "/contact", icon: Info },
    {
      name: "গ্যালারি",
      href: "/gallery",
      icon: ImageIcon,
    },
    {
      name: "অ্যাকাউন্ট",
      submenu: user
        ? [
            ...(role !== "student"
              ? [
                  {
                    name: "ড্যাশবোর্ড",
                    href: getDashboardHref(),
                    icon: LayoutDashboard,
                  },
                ]
              : []),
            { name: "প্রোফাইল", href: "/student-profile", icon: User },
            { name: "সেটিংস", href: "/settings", icon: Settings },
          ]
        : [
            { name: "লগইন", href: "/auth/login", icon: LogIn },
            { name: "রেজিস্ট্রেশন", href: "/auth/register", icon: UserPlus },
          ],
    },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-brand shadow-md border-b border-white/10">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Image
              src="/darulislaminstitute.jpeg"
              alt="Darul Islam Institute"
              className="rounded-full"
              width={40}
              height={40}
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-white font-bold text-lg lg:text-xl">
              দারুল ইসলাম ইনস্টিটিউট
            </span>
            <span className="text-white/60 text-[10px] hidden lg:block uppercase tracking-wider">
              Darul Islam Institute
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/notice"
            className="text-white hover:text-gold transition"
          >
            <BellRing size={24} />
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className="text-white bg-white/10 p-2 rounded-lg hover:bg-white/20 transition active:scale-95 cursor-pointer"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-secondary z-[80] shadow-2xl flex flex-col text-left"
            >
              <div className="bg-brand p-5 flex justify-between items-center shrink-0">
                <span className="text-white font-bold text-lg">মেনু</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 cursor-pointer hover:bg-white/10 rounded-full transition"
                >
                  <X className="text-white" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1">
                <ul className="space-y-3">
                  {drawerMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        {item.submenu ? (
                          <>
                            <button
                              onClick={() => toggleSubmenu(item.name)}
                              className="w-full flex justify-between items-center p-3 bg-[#0B3D2E]/5 hover:bg-[#0B3D2E]/10 rounded-lg font-bold text-[#10231B] transition text-left"
                            >
                              <span>{item.name}</span>
                              <ChevronRight
                                size={18}
                                className={`transition-transform duration-300 ${
                                  openSubmenu === item.name ? "rotate-90" : ""
                                }`}
                              />
                            </button>
                            <AnimatePresence>
                              {openSubmenu === item.name && (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="pl-4 border-l-2 border-[#0B3D2E]/20 mt-2 space-y-1 overflow-hidden"
                                >
                                  {item.submenu.map((sub) => {
                                    const SubIcon = sub.icon;
                                    return (
                                      <li key={sub.name}>
                                        <Link
                                          href={sub.href}
                                          onClick={() => setIsOpen(false)}
                                          className="flex items-center gap-3 p-2.5 text-sm text-[#10231B]/80 hover:text-[#0B3D2E] hover:bg-white/50 rounded-md transition"
                                        >
                                          <SubIcon size={16} />
                                          {sub.name}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link
                            href={item.href || "#"}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-3 bg-[#0B3D2E]/5 hover:bg-[#0B3D2E]/10 rounded-lg font-bold text-[#10231B] transition"
                          >
                            {Icon && <Icon size={18} />}
                            {item.name}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {user && (
                  <button
                    onClick={handleLogout}
                    className="w-full hover:cursor-pointer mt-6 flex items-center gap-3 p-3 bg-red-600/10 hover:bg-red-600/20 rounded-lg font-bold text-red-600 transition"
                  >
                    <LogOut size={18} />
                    লগআউট
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
