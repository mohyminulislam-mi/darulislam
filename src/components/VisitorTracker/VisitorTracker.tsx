"use client";

import { useEffect } from "react";

const VisitorTracker = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/visitors`,
          {
            method: "POST",
            credentials: "include",
          },
        ); 

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.message || `Request failed (${response.status})`);
        }
      } catch (error) {
        console.error("Visitor tracking failed:", error);
      }
    };

    void trackVisitor();
  }, []);

  return null;
};

export default VisitorTracker;
