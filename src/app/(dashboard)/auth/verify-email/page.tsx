"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState<string>(
    "আপনার ইমেইল ভেরিফিকেশন প্রসেস করা হচ্ছে...",
  );
  const [emailInput, setEmailInput] = useState<string>("");
  const [showResendForm, setShowResendForm] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [resendMessage, setResendMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(
        "ভেরিফিকেশন টোকেনটি পাওয়া যায়নি। অনুগ্রহ করে সঠিক লিঙ্ক ব্যবহার করুন।",
      );
      return;
    }

    let isMounted = true;

    const verifyEmailToken = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
          { token },
        );

        if (isMounted) {
          if (response.data?.success) {
            setStatus("success");
            setMessage(
              response.data?.message ||
                "আপনার ইমেইলটি সফলভাবে ভেরিফাই করা হয়েছে।",
            );
          }
        }
      } catch (error: any) {
        if (isMounted) {
          setStatus("error");
          setMessage(
            error.response?.data?.message ||
              "ভেরিফিকেশন ব্যর্থ হয়েছে। লিঙ্কটির মেয়াদ শেষ হতে পারে অথবা টোকেনটি অবৈধ।",
          );
        }
      }
    };

    verifyEmailToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResendMail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setResendLoading(true);
    setResendMessage(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`,
        { email: emailInput },
      );
      if (response.data?.success) {
        setResendMessage({ type: "success", text: response.data.message });
        setEmailInput("");
      }
    } catch (error: any) {
      setResendMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "লিঙ্ক পুনরায় পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 lg:p-12 text-center border border-neutral-100/80">
      <div className="mb-6 flex justify-center">
        {status === "loading" && (
          <div className="p-4 bg-emerald-50 rounded-full">
            <Loader2 className="w-12 h-12 text-[#0B5D3B] animate-spin" />
          </div>
        )}
        {status === "success" && (
          <div className="p-4 bg-emerald-100 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-[#0B5D3B]" />
          </div>
        )}
        {status === "error" && (
          <div className="p-4 bg-red-100 rounded-full">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        )}
      </div>

      <h1 className="text-xl md:text-2xl font-black text-slate-800 mb-3">
        {status === "loading" && "ভেরিফিকেশন চলছে"}
        {status === "success" && "ভেরিফিকেশন সফল!"}
        {status === "error" && "ভেরিফিকেশন ব্যর্থ"}
      </h1>

      <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed mb-8 px-2">
        {message}
      </p>

      {status === "success" && (
        <Link
          href="/auth/login"
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#0B5D3B] hover:bg-[#094f2d] text-white rounded-2xl font-black shadow-xl active:scale-[0.98] transition-all cursor-pointer"
        >
          লগইন করতে ক্লিক করুন <ArrowRight size={18} />
        </Link>
      )}

      {status === "error" && (
        <div className="w-full flex flex-col gap-4">
          {!showResendForm ? (
            <button
              onClick={() => setShowResendForm(true)}
              className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black shadow-xl active:scale-[0.98] transition-all cursor-pointer"
            >
              <RefreshCw size={18} /> নতুন ভেরিফিকেশন লিঙ্ক পাঠান
            </button>
          ) : (
            <form
              onSubmit={handleResendMail}
              className="w-full flex flex-col gap-3"
            >
              <input
                type="email"
                required
                placeholder="আপনার ইমেইল ঠিকানা দিন"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3.5 border border-neutral-200 rounded-2xl text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-[#0B5D3B] transition-all text-sm"
              />
              <button
                type="submit"
                disabled={resendLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#0B5D3B] hover:bg-[#094f2d] text-white rounded-2xl font-black shadow-xl active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70"
              >
                {resendLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "লিঙ্ক পাঠান"
                )}
              </button>
            </form>
          )}

          {resendMessage && (
            <p
              className={`text-xs font-bold mt-1 ${resendMessage.type === "success" ? "text-emerald-600" : "text-red-500"}`}
            >
              {resendMessage.text}
            </p>
          )}

          <Link
            href="/auth/login"
            className="w-full flex items-center justify-center gap-2 py-4 border-2 bg-green-600 rounded-2xl font-black text-white hover:bg-green-700 transition-all"
          >
            লগইন পেজে ফিরে যান
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div
      className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4"
      suppressHydrationWarning={true}
    >
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-12 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#0B5D3B] animate-spin mb-4" />
            <p className="text-sm font-bold text-slate-500">লোডিং হচ্ছে...</p>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}