"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

import QuizLeadForm from "@/src/components/mainLayout/quiz/QuizLeadForm";
import QuizStatusBar from "@/src/components/mainLayout/quiz/QuizStatusBar";
import QuizCard from "@/src/components/mainLayout/quiz/QuizCard";
import QuizSurvey from "@/src/components/mainLayout/quiz/QuizSurvey";
import QuizResult from "@/src/components/mainLayout/quiz/QuizResult";

export default function PublicQuizPage() {
  const [step, setStep] = useState<"lead" | "quiz" | "survey" | "result">(
    "lead",
  );

  const [visitorDetails, setVisitorDetails] = useState({ name: "", phone: "" });
  const [userAnswers, setUserAnswers] = useState<
    Array<{ questionId: string; selectedAnswer: string | null }>
  >([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [finalResult, setFinalResult] = useState<any>(null);

  // কুইজ প্রশ্ন ফেচিং পাইপলাইন
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["publicVisitorQuizQuestions"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/quiz/questions`,
      );
      return res.data?.data || [];
    },
    enabled: step === "quiz",
  });

  // সাবমিশন ইঞ্জিন মিউটেশন
  const submitMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/quiz/submit`,
        payload,
      );
      return res.data?.data || null;
    },
    onSuccess: (data) => {
      setFinalResult(data);
      setStep("result");
    },
  });

  const handleLeadSubmit = (name: string, phone: string) => {
    setVisitorDetails({ name, phone });
    setStep("quiz");
  };

  const handleNextQuestion = (selectedAnswer: string | null) => {
    const currentQuestion = questions[currentIdx];
    const updatedAnswers = [
      ...userAnswers,
      { questionId: currentQuestion._id, selectedAnswer },
    ];
    setUserAnswers(updatedAnswers);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setStep("survey");
    }
  };

  const handleSurveyComplete = (surveyResponses: any) => {
    submitMutation.mutate({
      visitorDetails,
      userAnswers,
      surveyResponses,
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] px-4 py-40 flex flex-col justify-center items-center antialiased selection:bg-emerald-100 selection:text-emerald-950">
      {/* 🎯 কন্ডিশনাল হেডিং লেয়ার: কুইজ শুরু হলে (step === "lead" ব্যতীত অন্য স্টেপে) এটি হাইড হয়ে যাবে */}
      {step === "lead" && (
        <div className="text-center mb-10 max-w-xl mx-auto space-y-2 animate-in fade-in duration-300">
          <h1 className="text-2xl mb-5 md:text-4xl font-black text-slate-900 tracking-tight">
            মাত্র ২ মিনিটের ফ্রি টেস্টে জেনে নিন আপনি কতটুকু কুরআন পারেন
          </h1>
          <p className="text-sm text-slate-500 font-bold">
            মাত্র ১২টি প্রশ্নের উত্তর দিয়েই জেনে নিন আপনি কুরআন পড়ার কোন
            লেভেলে আছেন
          </p>
        </div>
      )}

      <div className="w-full max-w-3xl mx-auto">
        {step === "lead" && <QuizLeadForm onSubmit={handleLeadSubmit} />}

        {step === "quiz" && (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center py-32">
                <Loader2 className="animate-spin text-[#0B5D3B] w-8 h-8" />
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-4">
                <QuizStatusBar
                  current={currentIdx + 1}
                  total={questions.length}
                />
                <QuizCard
                  question={questions[currentIdx]}
                  onNext={handleNextQuestion}
                />
              </div>
            ) : (
              <div className="bg-white border p-12 rounded-[2rem] text-center text-xs font-bold text-neutral-400 shadow-sm">
                কোনো প্রশ্ন লাইভ পাওয়া যায়নি ভাই। অনুগ্রহ করে অ্যাডমিন প্যানেল
                চেক করুন।
              </div>
            )}
          </>
        )}

        {step === "survey" && (
          <QuizSurvey
            isPending={submitMutation.isPending}
            onComplete={handleSurveyComplete}
          />
        )}

        {step === "result" && finalResult && (
          <QuizResult payload={finalResult} />
        )}
      </div>
    </div>
  );
}