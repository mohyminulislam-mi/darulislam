"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { useSession } from "next-auth/react";

export default function useUser() {
  const axiosSecure = useAxiosSecure();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: ["userProfile", session?.user?.email || "guest"],
    queryFn: async () => {
      const res = await axiosSecure.get("/auth/me");
      return res.data;
    },

    enabled:
      status === "authenticated" &&
      !!session?.accessToken &&
      !!session?.user?.email,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
