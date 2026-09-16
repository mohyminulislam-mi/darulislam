import React from "react";

const PrimaryButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="bg-green-700 hover:bg-green-800 transition-colors text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md">
      {children}
    </button>
  );
};

export default PrimaryButton;
