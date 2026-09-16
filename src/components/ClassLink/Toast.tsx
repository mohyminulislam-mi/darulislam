"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  // Clear layout notification footprint via structured interface timeout
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border font-bold text-sm bg-white transition-all duration-300 transform translate-y-0 opacity-100 scale-100 animate-slideIn ${
        type === "success"
          ? "border-emerald-100 text-slate-800 shadow-emerald-100/40"
          : "border-red-100 text-slate-800 shadow-red-100/40"
      }`}
    >
      {/* Icon rendering mapping wrapper */}
      <div className="shrink-0">
        {type === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
      </div>

      <span className="text-slate-700 tracking-wide">{message}</span>
    </div>
  );
}