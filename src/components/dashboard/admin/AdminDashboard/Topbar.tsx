"use client";
import { Bell, Search, ChevronDown } from "lucide-react";

interface Props { activeLabel: string; }

export default function Topbar({ activeLabel }: Props) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b"
      style={{ borderColor: "rgba(27,67,50,0.08)" }}>
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#1B4332" }}>{activeLabel}</h1>
        <p className="text-xs mt-0.5" style={{ color: "#52796F" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{ background: "#FAF7F0", border: "1px solid rgba(27,67,50,0.12)" }}>
          <Search size={15} color="#52796F" />
          <input placeholder="Search courses, orders…"
            className="bg-transparent outline-none text-sm w-44" style={{ color: "#1C1917" }} />
        </div>

        <button className="relative p-2 rounded-xl" style={{ background: "#FAF7F0" }}>
          <Bell size={18} color="#1B4332" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#D4A017" }} />
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "#1B4332" }}>
            AA
          </div>
          <ChevronDown size={14} color="#52796F" />
        </div>
      </div>
    </header>
  );
}