import React from "react";

const SectionHeading = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-center mb-5">
      <h2 className="text-2xl md:text-3xl font-bold text-green-800 inline-block relative">
        {children}
        <span className="block h-1 bg-green-600 mt-2 mx-auto w-1/2 rounded-full" />
      </h2>
    </div>
  );
};

export default SectionHeading;
