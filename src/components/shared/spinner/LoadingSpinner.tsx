"use client";

import React from "react";

const LoadingSpinner = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen" : "py-10"
      }`}
    >
      <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
