"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, MapPin, Briefcase, ChevronRight, Mic, Video, Users, Clock } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_JOBS, type JobOpportunity } from "@/data/mock-jobs";
import { calculateFallbackMatch } from "@/services/ai-matching";
import type { InterviewType } from "@/types/interview";
import AppNav from "@/components/layout/AppNav";

const INTERVIEW_TYPES: { value: InterviewType; label: string; icon: typeof Mic; desc: string }[] = [
  { value: "hr", label: "Interview HR", icon: Users, desc: "Pertanyaan umum, motivasi, dan perilaku kerja" },
  { value: "technical", label: "Interview Teknis", icon: Video, desc: "Pertanyaan teknis sesuai skill dan posisi" },
  { value: "mixed", label: "Interview Campuran", icon: Sparkles, desc: "Kombinasi HR dan pertanyaan teknis" },
];

export default function InterviewHubPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("bekalkarir_profile");
    if (saved) setProfile(JSON.parse(saved));
    const hist = localStorage.getItem("bekalkarir_interview_history");
    if (hist) setHistory(JSON.parse(hist));
  }, []);

  const jobs = MOCK_JOBS.filter((j) => !j.isLocalOpportunity);

  const handleStart = () => {
    if (!selectedJob || !selectedType) return;
    sessionStorage.setItem(
      "bekalkarir_interview_config",
      JSON.stringify({ jobId: selectedJob, interviewType: selectedType })
    );
    router.push(`/interview/${selectedJob}/briefing`);
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <AppNav />

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-24 space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">AI Interview Simulator</h1>
          <p className="text-slate-500 mt-2 text-lg">Latihan interview sesuai pekerjaan yang kamu incar.</p>
        </div>

        {history.length > 0 && (
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-3">Riwayat Interview</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {history.slice(0, 5).map((h) => (
                <div key={h.id} className="shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-100 min-w-[180px]">
                  <p className="text-xs text-slate-500">{new Date(h.date).toLocaleDateString("id-ID")}</p>
                  <p className="font-semibold text-slate-800 text-sm mt-1 truncate">{h.jobTitle}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-lg font-extrabold ${h.score >= 80 ? "text-teal-600" : h.score >= 60 ? "text-amber-600" : "text-slate-500"}`}>{h.score}</span>
                    <Badge variant="outline" className="text-xs">{h.interviewType === "hr" ? "HR" : h.interviewType === "technical" ? "Teknis" : "Campuran"}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            1. Pilih Pekerjaan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => {
              const match = profile ? calculateFallbackMatch(profile, job) : null;
              const isSelected = selectedJob === job.id;
              return (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className={`text-left p-5 rounded-3xl border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold ${isSelected ? "text-primary" : "text-slate-900"} transition-colors`}>{job.title}</h3>
                      <p className="text-sm text-primary font-medium mt-0.5">{job.company}</p>
                    </div>
                    {match && (
                      <Badge variant="outline" className={`shrink-0 ${match.totalScore >= 80 ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                        {match.totalScore}%
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                    <span className="mx-1">·</span>
                    <Briefcase className="w-3.5 h-3.5" /> {job.type}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 3).map((s, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-slate-50">{s}</Badge>
                    ))}
                    {job.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-slate-50">+{job.skills.length - 3}</Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            2. Pilih Jenis Interview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INTERVIEW_TYPES.map(({ value, label, icon: Icon, desc }) => {
              const isSelected = selectedType === value;
              return (
                <button
                  key={value}
                  onClick={() => setSelectedType(value)}
                  className={`text-left p-6 rounded-3xl border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className={`font-bold ${isSelected ? "text-primary" : "text-slate-900"}`}>{label}</h3>
                  <p className="text-sm text-slate-500 mt-2">{desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {selectedJob && selectedType && (
          <div className="bg-gradient-to-r from-primary/10 to-teal-50 p-6 rounded-3xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-slate-900">Siap untuk interview?</p>
              <p className="text-sm text-slate-500 mt-1">
                {jobs.find((j) => j.id === selectedJob)?.title} ·{" "}
                {INTERVIEW_TYPES.find((t) => t.value === selectedType)?.label}
              </p>
            </div>
            <Button onClick={handleStart} className="bg-primary text-white hover:bg-teal-800 rounded-full px-8 shadow-lg shadow-primary/20">
              Mulai Briefing <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Bagaimana AI Interview Simulator Bekerja?
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Pilih Pekerjaan", desc: "Pilih posisi yang ingin kamu lamar" },
              { step: "2", title: "Pilih Tipe", desc: "HR, Teknis, atau Campuran" },
              { step: "3", title: "Siapkan Diri", desc: "Periksa kamera dan mikrofon" },
              { step: "4", title: "Mulai Interview", desc: "Jawab pertanyaan AI secara real-time" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">{step}</div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{title}</p>
                  <p className="text-xs text-slate-500 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
