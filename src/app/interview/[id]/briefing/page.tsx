"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2, Clock, Mic, Video, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_JOBS } from "@/data/mock-jobs";
import type { InterviewType } from "@/types/interview";

const TYPE_LABELS: Record<InterviewType, string> = {
  hr: "Interview HR",
  technical: "Interview Teknis",
  mixed: "Interview Campuran",
};

const TIPS: Record<InterviewType, string[]> = {
  hr: [
    "Jawab dengan jelas dan percaya diri",
    "Gunakan metode STAR untuk pertanyaan behavioral",
    "Tunjukkan antusiasme terhadap posisi",
    "Siapkan contoh pengalaman kerja/organisasi",
  ],
  technical: [
    "Jelaskan pendekatan kamu sebelum memberikan solusi",
    "Berikan contoh konkret dari pengalaman",
    "Jika tidak yakin, jelaskan proses berpikir kamu",
    "Tunjukkan pemahaman konsep dasar",
  ],
  mixed: [
    "Seimbangkan jawaban teknis dan soft skill",
    "Gunakan contoh nyata untuk mendukung jawaban",
    "Perhatikan struktur jawaban (STAR)",
    "Tunjukkan kemampuan komunikasi yang baik",
  ],
};

export default function BriefingPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [interviewType, setInterviewType] = useState<InterviewType | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const config = sessionStorage.getItem("bekalkarir_interview_config");
    if (config) {
      const parsed = JSON.parse(config);
      if (parsed.jobId === jobId) {
        setInterviewType(parsed.interviewType);
      }
    }
  }, [jobId]);

  const job = MOCK_JOBS.find((j) => j.id === jobId);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <p className="text-slate-500">Pekerjaan tidak ditemukan.</p>
          <Link href="/interview" className="text-primary font-semibold hover:underline">Kembali ke Interview Hub</Link>
        </div>
      </div>
    );
  }

  const questionCount = 6;
  const estimatedMinutes = 10;

  const handleStartCheck = () => {
    if (interviewType) {
      sessionStorage.setItem(
        "bekalkarir_interview_config",
        JSON.stringify({ jobId, interviewType, questionCount })
      );
      router.push(`/interview/${jobId}/room`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/interview" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-slate-900 hidden md:block">Briefing Interview</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-8 pt-8 space-y-6">
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Briefing Interview</h1>
              <p className="text-slate-500 text-sm">Persiapkan dirimu sebelum interview dimulai.</p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                <p className="text-primary font-semibold mt-1">{job.company}</p>
              </div>
              {interviewType && (
                <Badge className="w-fit bg-primary/10 text-primary border-primary/20">{TYPE_LABELS[interviewType]}</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-primary" />
                <span className="text-sm text-slate-600">{questionCount} Pertanyaan</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm text-slate-600">~{estimatedMinutes} Menit</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                <span className="text-sm text-slate-600">Kamera + Mikrofon</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Skill yang Akan Diuji</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s, i) => (
                <Badge key={i} variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">{s}</Badge>
              ))}
            </div>
          </div>

          {interviewType && (
            <div>
              <h3 className="font-bold text-slate-900 mb-3">Tips Interview</h3>
              <div className="space-y-3">
                {TIPS[interviewType].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {interviewType === "mixed" && (
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
              <p className="text-sm text-slate-700">
                <strong>Interview Campuran</strong> menggabungkan pertanyaan HR dan teknis. Kamu akan dinilai
                dari kemampuan komunikasi, problem solving, dan pengetahuan teknis.
              </p>
            </div>
          )}
        </div>

        <div className="bg-amber-50 p-5 rounded-3xl border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">Pastikan kamera dan mikrofon berfungsi</p>
            <p className="text-sm text-amber-700 mt-1">
              Kamu akan diperiksa sebelum interview dimulai. Jika perangkat tidak tersedia, kamu tetap bisa melanjutkan dengan mode teks.
            </p>
          </div>
        </div>

        <Button
          onClick={handleStartCheck}
          disabled={!interviewType}
          className="w-full h-14 rounded-2xl bg-primary text-white hover:bg-teal-800 text-lg font-bold shadow-lg shadow-primary/20"
        >
          <Video className="w-5 h-5 mr-3" />
          Periksa Kamera & Mikrofon
        </Button>
      </div>
    </main>
  );
}
