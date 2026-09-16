"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Library,
  PlusSquare,
  Video,
  Users,
  GraduationCap,
  Bell,
  UserCog,
  ListOrdered,
  FolderKanban,
  House,
  Settings2,
  ChevronDown,
  HelpCircle,
  ListChecks,
  Users2,
  FilePlus,
  ClipboardCheck,
  FileText,
  Image,
  BookOpen,
  HandHelping,
  MessageSquare,
  ShoppingCart,
  SquareChartGantt,
  ShoppingBag,
  Truck,
  HeartHandshake,
  FileChartColumnIncreasing,
  MessageCircleWarning,
  FileBadge,
  BriefcaseBusiness,
  FileUser,
} from "lucide-react";
import useUserRole from "../../hooks/useUserRole";

// ড্রপডাউন আইটেম ম্যানেজ করার সাব-কম্পোনেন্ট
function SidebarLinkGroup({
  link,
  pathname,
  setSidebarOpen,
}: {
  link: any;
  pathname: string;
  setSidebarOpen: (open: boolean) => void;
}) {
  const hasActiveChild = link.children?.some(
    (child: any) => pathname === child.href,
  );
  const [isOpen, setIsOpen] = useState(hasActiveChild);

  const LinkIcon = link.icon;

  if (!link.children) {
    // --- অ্যাক্টিভ রুট চেক করার ফিক্সড লজিক (স্ট্রিক্ট ম্যাচিং) ---
    let isActive = false;

    if (link.href === "/") {
      isActive = pathname === "/";
    } else if (link.href === "/dashboard") {
      isActive = pathname === "/dashboard";
    } else if (link.href === "/dashboard/admin/admin-dashboard") {
      isActive = pathname === "/dashboard/admin/admin-dashboard";
    } else {
      isActive = pathname === link.href;
    }

    return (
      <Link
        href={link.href}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${
          isActive
            ? "bg-[#C8A44D] text-[#10231B] shadow-lg"
            : "text-green-50/85 hover:bg-white/10 hover:text-white"
        }`}
      >
        <LinkIcon size={20} /> {link.name}
      </Link>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full p-3 rounded-xl font-medium transition-all text-green-50/85 hover:bg-white/10 hover:text-white ${
          hasActiveChild ? "bg-white/10 text-white" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <LinkIcon size={20} />
          <span>{link.name}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="pl-6 space-y-1 transition-all">
          {link.children.map((child: any) => {
            const isChildActive = pathname === child.href;
            const ChildIcon = child.icon;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-all ${
                  isChildActive
                    ? "bg-[#C8A44D] text-[#10231B] shadow-md"
                    : "text-green-100/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <ChildIcon size={18} /> {child.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { role } = useUserRole();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি ড্যাশবোর্ড থেকে লগআউট করতে যাচ্ছেন!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0B3D2E",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, লগআউট করুন",
      cancelButtonText: "বাতিল",
      background: "#f5f5f5",
    }).then(async (result) => {
      if (result.isConfirmed) {
        queryClient.clear();
        await signOut({ callbackUrl: "/auth/login" });
      }
    });
  };

  // --- শিক্ষক (Teacher) এর মেনু লিংক সমূহ ---
  const teacherLinks = [
    { name: "হোম", href: "/", icon: House },
    { name: "Dashboard", href: "/dashboard/teacher", icon: LayoutDashboard },
    {
      name: "আমার কোর্সসমূহ",
      href: "/dashboard/teacher/my-course",
      icon: Library,
    },
    { name: "ক্লাস লিঙ্ক", href: "/dashboard/teacher/class-link", icon: Video },
    {
      name: "অ্যাসাইনমেন্ট ও মূল্যায়ন",
      href: "/dashboard/teacher/assignment",
      icon: GraduationCap,
      children: [
        {
          name: "অ্যাসাইনমেন্ট তৈরি করুন",
          href: "/dashboard/teacher/assignment/create",
          icon: FilePlus,
        },
        {
          name: "জমা ও মূল্যায়ন",
          href: "/dashboard/teacher/assignment/submissions",
          icon: ClipboardCheck,
        },
      ],
    },
    {
      name: "নোটিশ বোর্ড (টিচার)",
      href: "/dashboard/teacher/notice-board",
      icon: Bell,
    },
    {
      name: "আমার শিক্ষার্থী",
      href: "/dashboard/teacher/my-students",
      icon: Users,
    },
    {
      name: "প্রোফাইল সেটিংস",
      href: "/dashboard/teacher/profile",
      icon: UserCog,
    },
  ];

  // --- অ্যাডমিন (Admin) এর মেনু লিংক সমূহ ---
  const adminLinks = [
    { name: "হোম", href: "/", icon: House },
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    {
      name: "কোর্স ম্যানেজমেন্ট",
      icon: ListOrdered,
      children: [
        {
          name: "কোর্সসমূহ",
          href: "/dashboard/admin/my-course",
          icon: Library,
        },
        {
          name: "ক্যাটাগরি",
          href: "/dashboard/admin/categories",
          icon: PlusSquare,
        },
        {
          name: "কোর্স যুক্ত করুন",
          href: "/dashboard/admin/add-course",
          icon: PlusSquare,
        },
        {
          name: "ব্যাচ ম্যানেজমেন্ট",
          href: "/dashboard/admin/manage-batch",
          icon: SquareChartGantt,
        },
        {
          name: "শিক্ষার্থী কোর্স যুক্ত",
          href: "/dashboard/admin/add-student-courses",
          icon: PlusSquare,
        },
        {
          name: "ব্যাচ নিযুক্ত",
          href: "/dashboard/admin/batch-assign",
          icon: PlusSquare,
        },
      ],
    },
    {
      name: "ব্যবহারকারী ও শিক্ষক",
      icon: Users,
      children: [
        {
          name: "ছাত্র/শিক্ষক যোগ",
          href: "/dashboard/admin/add-student",
          icon: PlusSquare,
        },
        {
          name: "শিক্ষকবৃন্দ",
          href: "/dashboard/admin/teacher-list",
          icon: Users,
        },
        {
          name: "শিক্ষার্থীবৃন্দ",
          href: "/dashboard/admin/students-list",
          icon: UserCog,
        },
      ],
    },
    {
      name: "শপ ম্যানেজমেন্ট",
      icon: ShoppingCart,
      children: [
        {
          name: "Order Management",
          href: "/dashboard/admin/order-management",
          icon: ShoppingCart,
        },
        {
          name: "Product Management",
          href: "/dashboard/admin/products-management",
          icon: ShoppingBag,
        },
        {
          name: "Product Delivery",
          href: "/dashboard/admin/product-delivey",
          icon: Truck,
        },
      ],
    },
    {
      name: "অনুদান",
      icon: HeartHandshake,
      children: [
        {
          name: "দান প্রকল্প",
          href: "/dashboard/admin/get-donation",
          icon: HeartHandshake,
        },
        {
          name: "অনুদানের তালিকা",
          href: "/dashboard/admin/donations",
          icon: FileChartColumnIncreasing,
        },
        {
          name: "অনুদান পোস্ট",
          href: "/dashboard/admin/donate-post",
          icon: PlusSquare,
        },
      ],
    },
    {
      name: "টেস্টিমোনিয়াল",
      icon: MessageSquare,
      children: [
        {
          name: "টেস্টিমোনিয়াল পোস্ট",
          href: "/dashboard/admin/add-testimonials",
          icon: PlusSquare,
        },
        {
          name: "টেস্টিমোনিয়াল ম্যনেজমেন্ট",
          href: "/dashboard/admin/testimonial",
          icon: ListOrdered,
        },
      ],
    },
    {
      name: "কুইজ ম্যনেজমেন্ট",
      icon: HelpCircle, // Import from 'lucide-react'
      children: [
        {
          name: "কুইজ প্রশ্নসমূহ",
          href: "/dashboard/admin/quiz-manage",
          icon: ListChecks,
        },
        {
          name: "কুইজ সাবমিশন",
          href: "/dashboard/admin/quiz-submissions",
          icon: Users2,
        },
      ],
    },
    {
      name: "লাইব্রেরি কন্ট্রোল",
      icon: Library, // Import from 'lucide-react'
      children: [
        {
          name: "ইলম (বই ও পিডিএফ)",
          href: "/dashboard/admin/library/ilm",
          icon: BookOpen,
        },
        {
          name: "আমল (দু'আ ও জিকির)",
          href: "/dashboard/admin/library/amol",
          icon: HandHelping,
        },
        {
          name: "দাওয়াহ (ইসলামিক বার্তা)",
          href: "/dashboard/admin/library/dawah",
          icon: MessageSquare,
        },
      ],
    },
    {
      name: "কন্টেন্ট কন্ট্রোল",
      icon: Settings2,
      children: [
        {
          name: "হিরো স্লাইডার",
          href: "/dashboard/admin/content-control/hero-slider",
          icon: Image,
        },
        {
          name: "আমাদের সম্পর্কে",
          href: "/dashboard/admin/content-control/about-page",
          icon: FileText,
        },
        {
          name: "আমাদের অর্জন",
          href: "/dashboard/admin/achievements",
          icon: FileText,
        },
      ],
    },
    {
      name: "চাকরি বিজ্ঞপ্তি",
      icon: BriefcaseBusiness,
      children: [
        {
          name: "চাকরির পোস্ট",
          href: "/dashboard/admin/jobs-create",
          icon: PlusSquare,
        },
        {
          name: "চাকরি",
          href: "/dashboard/admin/jobs",
          icon: BriefcaseBusiness,
        },
        {
          name: "আবেদনকারীরা",
          href: "/dashboard/admin/applicants",
          icon: FileUser,
        },
      ],
    },
    {
      name: "পলিসি ও নিয়মাবলী",
      icon: Users,
      children: [
        {
          name: "প্রাইভেসি পলিসি",
          href: "/dashboard/admin/privacy-policy",
          icon: Users,
        },
        {
          name: "রিফান্ড পলিসি",
          href: "/dashboard/admin/refund-return-policy",
          icon: UserCog,
        },
        {
          name: "শর্ত বলি ও নিয়মাবলী",
          href: "/dashboard/admin/terms-of-service",
          icon: UserCog,
        },
        {
          name: "সচরাচর জিজ্ঞাসা ",
          href: "/dashboard/admin/faq",
          icon: UserCog,
        },
      ],
    },
    {
      name: "অভিযোগ বাক্স",
      href: "/dashboard/admin/complain",
      icon: MessageCircleWarning,
    },
    { name: "নোটিশ বোর্ড", href: "/dashboard/admin/admin-notice", icon: Bell },
    {
      name: "সার্টিফিকেট ইস্যু ",
      href: "/dashboard/admin/certificates",
      icon: FileBadge,
    },
    {
      name: "গ্যালারি ম্যনেজমেন্ট",
      href: "/dashboard/admin/gallery",
      icon: Image,
    },
    {
      name: "প্রোফাইল সেটিংস",
      href: "/dashboard/admin/profile",
      icon: UserCog,
    },
  ];

  const navLinks =
    role === "admin" ? adminLinks : role === "teacher" ? teacherLinks : [];

  return (
    <div className="flex h-screen bg-[#F3F8F4]">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#0B3D2E] text-white flex flex-col
          transition-transform duration-300 transform md:relative md:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          rounded-tr-2xl shadow-xl overflow-hidden
        `}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard />
            <h2 className="text-xl font-bold">ড্যাশবোর্ড</h2>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-none">
          {navLinks.map((link, index) => (
            <SidebarLinkGroup
              key={index}
              link={link}
              pathname={pathname}
              setSidebarOpen={setSidebarOpen}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 cursor-pointer bg-red-600 rounded-xl text-white font-medium transition"
          >
            <LogOut size={20} /> লগআউট
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="md:hidden bg-white p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0B3D2E] rounded-lg flex items-center justify-center text-white font-bold">
              DI
            </div>
            <span className="font-bold text-neutral-800 uppercase tracking-tight">
              Darul Islam
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-neutral-600"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F7FBF7]">
          {children}
        </div>
      </main>

      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
