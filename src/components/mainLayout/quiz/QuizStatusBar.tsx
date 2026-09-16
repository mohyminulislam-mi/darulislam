"use client";

import React from "react";

interface StatusBarProps {
  current: number;
  total: number;
}

export default function QuizStatusBar({ current, total }: StatusBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="max-w-2xl mx-auto flex items-center justify-between gap-4 font-sans mb-4">
      <div className="flex-1 bg-neutral-100 h-2.5 rounded-full overflow-hidden relative border border-neutral-200/30">
        <div
          className="bg-gradient-to-r from-emerald-600 to-teal-600 h-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-mono font-black text-neutral-500 bg-white border px-3 py-1 rounded-xl shrink-0">
        {current}/{total}
      </span>
    </div>
  );
}