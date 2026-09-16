"use client";
import React, { useState, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>

          <p className="text-gray-500 mb-8">
            An unexpected error occurred. Please try refreshing the page or
            contact support if the problem persists.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition-all"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  try {
    return children;
  } catch (err) {
    console.error("Uncaught error:", err);
    setError(err as Error);
    return null;
  }
}
