import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api/auth") ||
    pathname.includes("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const role = (token?.role as string)?.toLowerCase();
  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  if (isAuthPage && !!token) {
    if (role === "admin")
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    if (role === "teacher")
      return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
    return NextResponse.redirect(new URL("/student-profile", req.url));
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (pathname === "/dashboard") {
    if (role === "admin")
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    if (role === "teacher")
      return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    pathname.startsWith("/student-profile") &&
    (role === "teacher" || role === "admin")
  ) {
    return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
  }

  if (pathname.startsWith("/dashboard") && role === "student") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    if (role === "teacher") {
      return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    pathname.startsWith("/dashboard/teacher") &&
    role !== "teacher" &&
    role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/student-profile/:path*",
    "/settings/:path*",
    "/auth/login",
    "/auth/register",
  ],
};