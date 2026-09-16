"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, RotateCcw, Home, Briefcase } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_JOBS } from "@/data/mock-jobs";
import type { InterviewResult } from "@/types/interview";
import FeedbackCard from "@/components/interview/FeedbackCard";

const TYPE_LABELS: Record<string, string> = {
  hr: "Interview HR",
  technical: "Interview Teknis",
  mixed: "Interview Campuran",
};

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [result, setResult] = useState<InterviewResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("bekalkarir_interview_result");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.jobId === jobId) {
        setResult(parsed);
      }
    }
  }, [jobId]);

  const job = MOCK_JOBS.find((j) => j.id === jobId);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <p className="text-slate-500">Hasil interview tidak ditemukan.</p>
          <Link href="/interview" className="text-primary font-semibold hover:underline">Kembali ke Interview Hub</Link>
        </div>
      </div>
    );
  }

  const handleRetry = () => {
    sessionStorage.setItem(
      "bekalkarir_interview_config",
      JSON.stringify({ jobId, interviewType: result.interviewType })
    );
    router.push(`/interview/${jobId}/briefing`);
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/interview" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-slate-900 hidden md:block">Hasil Interview</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-8 pt-8 space-y-6">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-10 rounded-3xl text-white text-center relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-80 h-80 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative">
            <div className="w-16 h-16 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">Hasil Interview</h1>
            <p className="text-slate-400 mb-1">{result.jobTitle}</p>
            <Badge className="bg-white/10 text-white border-white/20">{TYPE_LABELS[result.interviewType]}</Badge>
          </div>
        </div>

        <FeedbackCard feedback={result.feedback} />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleRetry} variant="outline" className="flex-1 h-12 rounded-2xl font-bold">
            <RotateCcw className="w-5 h-5 mr-2" />
            Latihan Lagi
          </Button>
          <Link href={`/interview/${jobId}/briefing`} className={buttonVariants({ variant: "outline", className: "flex-1 h-12 rounded-2xl font-bold justify-center" })}>
            <Briefcase className="w-5 h-5 mr-2" />
            Kembali ke Briefing
          </Link>
          <Link href="/" className={buttonVariants({ className: "flex-1 h-12 rounded-2xl font-bold bg-primary text-white hover:bg-teal-800 justify-center" })}>
            <Home className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
