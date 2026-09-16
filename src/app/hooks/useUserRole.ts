"use client";

import useUser from "./useUser";

export default function useUserRole() {
  const { data: user, isLoading } = useUser();

  const role = user?.role;
  const isAdmin = user ? role === "admin" : undefined;
  const isTeacher = user ? role === "teacher" : undefined;
  const isStudent = user ? role === "student" : undefined;

  const isApproved = user?.profile?.isApproved;

  return {
    role,
    isAdmin,
    isTeacher,
    isStudent,
    isApproved,
    isLoading,
    user,
  };
}
