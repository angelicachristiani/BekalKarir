"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, MapPin, Briefcase, Clock, Building, Bookmark, BookmarkCheck,
  Sparkles, CheckCircle2, AlertCircle, DollarSign, TrendingUp, Calendar
} from "lucide-react";
import { MOCK_JOBS, type JobOpportunity } from "@/data/mock-jobs";
import { type MatchResult } from "@/services/ai-matching";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [job, setJob] = useState<JobOpportunity | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStatusText, setAiStatusText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const foundJob = MOCK_JOBS.find(j => j.id === resolvedParams.id);
    if (!foundJob) { router.push("/jobs"); return; }
    setJob(foundJob);

    const savedProfile = localStorage.getItem("bekalkarir_profile");
    const userProfile = savedProfile ? JSON.parse(savedProfile) : null;
    setProfile(userProfile);

    const savedJobs = JSON.parse(localStorage.getItem("bekalkarir_saved_jobs") || "[]");
    setIsSaved(savedJobs.includes(foundJob.id));

    const readyJobs = JSON.parse(localStorage.getItem("bekalkarir_ready_jobs") || "[]");
    setIsReady(readyJobs.includes(foundJob.id));

    if (userProfile) runAiMatching(userProfile, foundJob);
  }, [resolvedParams.id, router]);

  const runAiMatching = async (userProfile: any, jobData: JobOpportunity) => {
    setAiLoading(true);
    const texts = [
      "AI sedang membandingkan skill kamu...",
      "Menganalisis kecocokan lokasi...",
      "Memeriksa kesesuaian gaji...",
      "Menyiapkan rekomendasi...",
    ];
    let step = 0;
    setAiStatusText(texts[0]);
    const interval = setInterval(() => { step = (step + 1) % texts.length; setAiStatusText(texts[step]); }, 900);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile, job: jobData }),
      });
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      setMatchResult(data);
    } catch (error) {
      console.error("Failed to match via API", error);
    } finally {
      clearInterval(interval);
      setAiLoading(false);
    }
  };

  const toggleSaveJob = () => {
    if (!job) return;
    const savedJobs = JSON.parse(localStorage.getItem("bekalkarir_saved_jobs") || "[]");
    const newSaved = isSaved ? savedJobs.filter((id: string) => id !== job.id) : [...savedJobs, job.id];
    localStorage.setItem("bekalkarir_saved_jobs", JSON.stringify(newSaved));
    setIsSaved(!isSaved);
  };

  const toggleReady = () => {
    if (!job) return;
    const readyJobs = JSON.parse(localStorage.getItem("bekalkarir_ready_jobs") || "[]");
    const newReady = isReady ? readyJobs.filter((id: string) => id !== job.id) : [...readyJobs, job.id];
    localStorage.setItem("bekalkarir_ready_jobs", JSON.stringify(newReady));
    setIsReady(!isReady);
  };

  if (!job) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );

  const scoreColor = (score: number) => score >= 80 ? "text-teal-600" : score >= 60 ? "text-amber-600" : "text-slate-500";
  const scoreBarColor = (score: number) => score >= 80 ? "bg-teal-500" : score >= 60 ? "bg-amber-400" : "bg-slate-400";

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/jobs" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-slate-900 hidden md:block">Detail Pekerjaan</span>
          <Link href="/interview" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors hidden md:block ml-4">Interview</Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSaveJob}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSaved ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8 space-y-6">

        {/* ── Job Header Card ── */}
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          {job.isLocalOpportunity && job.impactTag && (
            <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl">{job.impactTag}</div>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight pr-16 md:pr-0">{job.title}</h1>
          <div className="flex items-center gap-2 mt-3 text-lg font-semibold text-primary">
            <Building className="w-5 h-5 shrink-0" />
            <span className="line-clamp-1">{job.company}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium mt-5">
            <div className="flex items-center gap-1.5 text-sm"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</div>
            <div className="flex items-center gap-1.5 text-sm"><Briefcase className="w-4 h-4 text-slate-400" /> {job.type}</div>
            <div className="flex items-center gap-1.5 text-sm"><Clock className="w-4 h-4 text-slate-400" /> {job.experienceLevel}</div>
            <div className="flex items-center gap-1.5 text-sm"><Calendar className="w-4 h-4 text-slate-400" /> Dipost {job.postedAt}</div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Rentang Gaji</div>
              <div className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-600" />
                Rp{(job.salaryMin / 1000000).toFixed(1)}Jt – Rp{(job.salaryMax / 1000000).toFixed(1)}Jt
                <span className="text-sm font-medium text-slate-500">/ bulan</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Industri</div>
              <div className="text-lg font-semibold text-slate-700">{job.industry}</div>
            </div>
          </div>
        </div>

        {/* ── AI Match Analysis ── */}
        {profile ? (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-10 rounded-3xl border border-slate-700 shadow-2xl text-white relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -right-24 -top-24 w-80 h-80 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -left-24 -bottom-24 w-60 h-60 bg-teal-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-3 mb-7 relative">
              <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Analisis Kecocokan AI</h2>
                <p className="text-slate-400 text-sm">Berdasarkan profil dan skill kamu</p>
              </div>
            </div>

            {aiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary/60" />
                  </div>
                </div>
                <p className="text-slate-300 font-medium animate-pulse text-lg">{aiStatusText}</p>
              </div>
            ) : matchResult ? (
              <div className="space-y-8 relative">
                {/* Score Ring + Breakdown */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Circular progress */}
                  <div className="relative shrink-0">
                    <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
                      <circle
                        cx="60" cy="60" r="52" fill="none"
                        stroke={matchResult.totalScore >= 80 ? "#2DD4BF" : matchResult.totalScore >= 60 ? "#FDE68A" : "#94a3b8"}
                        strokeWidth="12"
                        strokeDasharray="326.7"
                        strokeDashoffset={326.7 - (326.7 * matchResult.totalScore) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-extrabold">{matchResult.totalScore}%</span>
                      <span className="text-slate-400 text-xs font-medium mt-0.5">Cocok</span>
                    </div>
                  </div>

                  {/* Breakdown bars */}
                  <div className="flex-1 w-full space-y-3 text-sm">
                    {[
                      { label: "Skill", val: matchResult.breakdown.skill, weight: "40%" },
                      { label: "Lokasi", val: matchResult.breakdown.location, weight: "20%" },
                      { label: "Gaji", val: matchResult.breakdown.salary, weight: "15%" },
                      { label: "Pengalaman", val: matchResult.breakdown.experience, weight: "15%" },
                      { label: "Preferensi Kerja", val: matchResult.breakdown.preference, weight: "10%" },
                    ].map(({ label, val, weight }) => (
                      <div key={label}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            {label} <span className="text-slate-600 text-xs">({weight})</span>
                          </span>
                          <span className={`font-bold ${scoreColor(val)}`}>{val}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(val)}`}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                {/* Why Match + Missing */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                      Kenapa cocok untukmu?
                    </h3>
                    <ul className="space-y-2.5">
                      {matchResult.explanation.whyMatch.map((reason, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                          <span className="text-teal-400 mt-0.5 shrink-0">✓</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      Yang masih kurang
                    </h3>
                    {matchResult.explanation.whatIsMissing.length > 0 ? (
                      <ul className="space-y-2.5">
                        {matchResult.explanation.whatIsMissing.map((missing, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                            <span className="text-amber-400 mt-0.5 shrink-0">△</span>
                            <span>{missing}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-400 italic text-sm">Tidak ada kekurangan yang signifikan.</p>
                    )}
                  </div>
                </div>

                {/* AI Suggestion */}
                <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Saran AI</p>
                    <p className="text-slate-200 text-sm leading-relaxed">{matchResult.explanation.suggestion}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Lihat Skor Kecocokanmu</h3>
                <p className="text-sm text-slate-500">Lengkapi profil untuk analisis AI personal.</p>
              </div>
            </div>
            <Link href="/onboarding" className={buttonVariants({ variant: "outline", className: "rounded-full shrink-0" })}>Isi Profil</Link>
          </div>
        )}

        {/* ── Skills ── */}
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Skill yang Dibutuhkan
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => {
                const isMatched = matchResult?.matchedSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                const isMissing = matchResult?.missingSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                return (
                  <Badge
                    key={i}
                    variant="outline"
                    className={`px-4 py-2 text-sm font-medium flex items-center gap-1.5 ${
                      isMatched ? "bg-teal-50 text-teal-700 border-teal-200" :
                      isMissing ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {isMatched && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {isMissing && <AlertCircle className="w-3.5 h-3.5" />}
                    {skill}
                  </Badge>
                );
              })}
            </div>
            {matchResult && (
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-teal-700"><CheckCircle2 className="w-4 h-4" /> {matchResult.matchedSkills.length} skill cocok</div>
                {matchResult.missingSkills.length > 0 && (
                  <div className="flex items-center gap-1.5 text-amber-600"><AlertCircle className="w-4 h-4" /> {matchResult.missingSkills.length} skill kurang</div>
                )}
              </div>
            )}
          </section>

          <Separator />

          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Deskripsi Pekerjaan</h3>
            <p className="text-slate-600 leading-relaxed">{job.description}</p>
          </section>
        </div>
      </div>

      {/* ── Sticky Bottom CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-100 p-4 z-30 shadow-[0_-8px_40px_rgba(0,0,0,0.06)]">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={toggleSaveJob}
            className={`h-13 rounded-2xl flex-1 max-w-[160px] border-2 font-bold transition-all ${isSaved ? "bg-teal-50 border-teal-400 text-teal-800 hover:bg-teal-100" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5 mr-2" /> : <Bookmark className="w-5 h-5 mr-2" />}
            {isSaved ? "Tersimpan" : "Simpan"}
          </Button>
          <Button
            size="lg"
            onClick={toggleReady}
            className={`h-13 rounded-2xl flex-1 font-bold text-base transition-all ${
              isReady
                ? "bg-teal-700 hover:bg-teal-800 text-white shadow-lg shadow-teal-700/20"
                : "bg-primary hover:bg-teal-800 text-white shadow-lg shadow-primary/20"
            }`}
          >
            {isReady ? "✓ Siap Dilamar" : "Siap Dilamar"}
          </Button>
        </div>
      </div>
    </main>
  );
}
