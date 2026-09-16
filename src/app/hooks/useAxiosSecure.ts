"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL?.trim(),
  withCredentials: true,
});

export default function useAxiosSecure() {
  const { data: session } = useSession();

  useEffect(() => {
    const requestIntercept = axiosSecure.interceptors.request.use(
      (config) => {
        if (session?.accessToken) {
          config.headers["Authorization"] = `Bearer ${session.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestIntercept);
    };
  }, [session]);

  return axiosSecure;
}
