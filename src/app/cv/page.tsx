"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Loader2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_JOBS } from "@/data/mock-jobs";
import type { ExtractedCV, CVAnalysisResult, CVJobMatch } from "@/types/cv";
import CVUploader from "@/components/cv/CVUploader";
import CVExtractionPreview from "@/components/cv/CVExtractionPreview";
import CVScoreCard from "@/components/cv/CVScoreCard";
import CVFeedbackCard from "@/components/cv/CVFeedbackCard";
import SkillAnalysis from "@/components/cv/SkillAnalysis";
import JobCVMatch from "@/components/cv/JobCVMatch";
import AppNav from "@/components/layout/AppNav";

export default function CVAnalyzerPage() {
  const [profile, setProfile] = useState<any>(null);
  const [cvText, setCvText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [extracted, setExtracted] = useState<ExtractedCV | null>(null);
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);
  const [jobMatch, setJobMatch] = useState<CVJobMatch | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState<"upload" | "result">("upload");

  useEffect(() => {
    const saved = localStorage.getItem("bekalkarir_profile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const handleFileSelected = async (file: File, text: string) => {
    setCvText(text);
    setFileName(file.name);
    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/cv/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: text, userProfile: profile }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();

      setExtracted(data.extracted);
      setAnalysis(data.analysis);
      if (data.analysis) {
        try { localStorage.setItem("bekalkarir_cv_analysis", JSON.stringify(data.analysis)); } catch {}
      }
      setStep("result");
    } catch {
      setStep("result");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleJobMatch = async () => {
    if (!selectedJobId || !cvText || !extracted) return;

    const job = MOCK_JOBS.find((j) => j.id === selectedJobId);
    if (!job) return;

    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/cv/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText,
          userProfile: profile,
          targetJob: { title: job.title, skills: job.skills },
        }),
      });

      if (!res.ok) throw new Error("Match failed");
      const data = await res.json();

      if (data.jobMatch) {
        setJobMatch({ ...data.jobMatch, jobId: job.id });
      }
    } catch {
      // fallback
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSiapDilamar = () => {
    if (!jobMatch?.jobId) return;
    const apps = JSON.parse(localStorage.getItem("bekalkarir_applications") || "[]");
    const existing = apps.find((a: any) => a.jobId === jobMatch.jobId);
    if (existing) {
      existing.status = "ready";
      existing.updatedAt = new Date().toISOString();
    } else {
      apps.unshift({
        id: `app-${Date.now()}`,
        jobId: jobMatch.jobId,
        status: "ready",
        appliedAt: null,
        interviewAt: null,
        notes: "",
        cvAnalysisScore: analysis?.score || null,
        interviewScore: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    localStorage.setItem("bekalkarir_applications", JSON.stringify(apps));
  };

  const resetAnalyzer = () => {
    setCvText(null);
    setFileName("");
    setExtracted(null);
    setAnalysis(null);
    setJobMatch(null);
    setSelectedJobId("");
    setStep("upload");
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <AppNav />

      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-24 space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Analisis CV dengan AI</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Temukan apa yang sudah kuat dan apa yang masih bisa kamu tingkatkan sebelum melamar.
          </p>
        </div>

        {step === "upload" ? (
          <CVUploader onFileSelected={handleFileSelected} isAnalyzing={isAnalyzing} />
        ) : (
          <div className="space-y-8">
            {isAnalyzing && (
              <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="font-bold text-slate-900 text-lg">Menganalisis CV...</p>
                <p className="text-slate-500 mt-1">AI sedang memproses dokumen kamu</p>
              </div>
            )}

            {!isAnalyzing && extracted && (
              <>
                <CVExtractionPreview extracted={extracted} />

                {analysis && (
                  <>
                    <CVScoreCard analysis={analysis} />

                    <SkillAnalysis
                      detectedSkills={analysis.detectedSkills}
                      profileSkills={profile?.skills?.map((s: any) => s.nama) || []}
                      missingFromProfile={analysis.missingSkills}
                    />

                    <CVFeedbackCard analysis={analysis} />

                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Analisis CV untuk Pekerjaan Tertentu
                      </h3>
                      <p className="text-sm text-slate-500">
                        Bandingkan CV kamu dengan lowongan yang tersedia.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Select value={selectedJobId} onValueChange={(val) => setSelectedJobId(val || "")}>
                          <SelectTrigger className="h-12 flex-1">
                            <SelectValue placeholder="Pilih pekerjaan target" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_JOBS.filter((j) => !j.isLocalOpportunity).map((job) => (
                              <SelectItem key={job.id} value={job.id}>
                                {job.title} — {job.company.split("—")[0].trim()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={handleJobMatch}
                          disabled={!selectedJobId}
                          className="h-12 rounded-2xl bg-primary text-white hover:bg-teal-800"
                        >
                          Bandingkan
                        </Button>
                      </div>
                    </div>

                    {jobMatch && (
                      <>
                        <JobCVMatch
                          match={jobMatch}
                          jobTitle={MOCK_JOBS.find((j) => j.id === jobMatch.jobId)?.title || ""}
                          jobCompany={MOCK_JOBS.find((j) => j.id === jobMatch.jobId)?.company || ""}
                        />

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link
                            href={`/jobs/${jobMatch.jobId}`}
                            className="flex-1"
                          >
                            <Button variant="outline" className="w-full h-12 rounded-2xl font-bold">
                              Lihat Detail Lowongan
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                          <Button
                            onClick={handleSiapDilamar}
                            className="flex-1 h-12 rounded-2xl font-bold bg-primary text-white hover:bg-teal-800"
                          >
                            Siap Dilamar
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            <Button onClick={resetAnalyzer} variant="outline" className="w-full h-12 rounded-2xl font-bold">
              Analisis CV Lain
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
