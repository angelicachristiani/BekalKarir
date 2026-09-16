"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Briefcase,
  ChevronRight,
  ArrowRight,
  FileText,
  Target,
  TrendingUp,
  Clock,
  BookOpen,
  Zap,
} from "lucide-react";
import { MOCK_JOBS } from "@/data/mock-jobs";
import { calculateFallbackMatch } from "@/services/ai-matching";
import { getApplications, syncFromLegacyKeys } from "@/services/applications";
import type { Application, ApplicationStatus } from "@/types/application";
import { STATUS_CONFIG } from "@/types/application";
import type { CVAnalysisResult } from "@/types/cv";

const PROGRESS_STATUSES: ApplicationStatus[] = ["saved", "ready", "applied", "interview", "offer"];

function ScoreRing({ score, size = 80, stroke = 6 }: { score: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#0F766E" : score >= 60 ? "#D97706" : "#64748B";

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-1000"
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="font-extrabold text-lg" fill={color}>
        {score}
      </text>
    </svg>
  );
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviewHistory, setInterviewHistory] = useState<any[]>([]);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysisResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("bekalkarir_profile");
    if (saved) setProfile(JSON.parse(saved));

    syncFromLegacyKeys();
    setApplications(getApplications());

    const hist = localStorage.getItem("bekalkarir_interview_history");
    if (hist) setInterviewHistory(JSON.parse(hist));

    // Try to load CV analysis from applications or direct key
    const cvData = localStorage.getItem("bekalkarir_cv_analysis");
    if (cvData) {
      try { setCvAnalysis(JSON.parse(cvData)); } catch {}
    }
  }, []);

  const topJobs = useMemo(() => {
    const jobs = MOCK_JOBS.filter((j) => !j.isLocalOpportunity);
    if (!profile) return jobs.slice(0, 5).map((job) => ({ job, match: null }));
    return jobs
      .map((job) => ({ job, match: calculateFallbackMatch(profile, job) }))
      .sort((a, b) => b.match.totalScore - a.match.totalScore)
      .slice(0, 5);
  }, [profile]);

  const localJobs = useMemo(() => {
    const locs = MOCK_JOBS.filter((j) => j.isLocalOpportunity);
    if (!profile) return locs.slice(0, 3).map((job) => ({ job, match: null }));
    return locs
      .map((job) => ({ job, match: calculateFallbackMatch(profile, job) }))
      .sort((a, b) => b.match.totalScore - a.match.totalScore)
      .slice(0, 3);
  }, [profile]);

  const appStatusCounts = useMemo(() => {
    const counts: Record<ApplicationStatus, number> = {
      saved: 0, ready: 0, applied: 0, interview: 0, offer: 0, rejected: 0,
    };
    for (const app of applications) {
      counts[app.status]++;
    }
    return counts;
  }, [applications]);

  const activeApps = applications.filter((a) => ["ready", "applied", "interview"].includes(a.status)).length;
  const matchedJobsCount = topJobs.filter((j) => (j.match?.totalScore || 0) >= 70).length;

  const skillGaps = useMemo(() => {
    if (!profile) return [];
    const userSkills = (profile.skills || []).map((s: any) => s.nama.toLowerCase());
    const skillCounts: Record<string, number> = {};
    for (const job of MOCK_JOBS) {
      for (const skill of job.skills) {
        const lower = skill.toLowerCase();
        if (!userSkills.includes(lower)) {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        }
      }
    }
    return Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, count }));
  }, [profile]);

  const aiInsight = useMemo(() => {
    if (!profile) return "Lengkapi profilmu untuk mendapatkan rekomendasi karier.";
    const userSkills = (profile.skills || []).map((s: any) => s.nama);
    const topJobTitle = topJobs[0]?.job.title;
    const topMatch = topJobs[0]?.match?.totalScore || 0;

    if (topMatch >= 80) {
      return `Profilmu sangat cocok dengan posisi ${topJobTitle}. Dengan skill ${userSkills.slice(0, 2).join(" dan ")}, kamu memiliki fondasi yang kuat.`;
    }
    if (topMatch >= 60) {
      return `Profilmu cukup cocok dengan posisi ${topJobTitle}. Pertimbangkan untuk memperdalam skill seperti ${skillGaps[0]?.skill || "yang dibutuhkan pasar"}.`;
    }
    return `Ada ${matchedJobsCount} lowongan yang cocok dengan profilmu. Fokus pada skill yang paling dibutuhkan untuk meningkatkan peluangmu.`;
  }, [profile, topJobs, skillGaps, matchedJobsCount]);

  const firstName = profile?.nama?.split(" ")[0] || "Pengguna";
  const cvScore = cvAnalysis?.score || null;

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 space-y-8">

        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Selamat datang kembali, {firstName} 👋
            </h1>
            <p className="text-teal-100 mt-2 text-lg">
              Berikut perkembangan perjalanan kariermu hari ini.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4">
                <ScoreRing score={cvScore || 0} size={72} stroke={5} />
                <div>
                  <p className="text-teal-100 text-sm">Kesiapan Karier</p>
                  <p className="text-2xl font-extrabold">
                    {cvScore ? `${cvScore}%` : "Belum dianalisis"}
                  </p>
                </div>
              </div>
              {!cvScore && (
                <Link
                  href="/cv"
                  className="bg-white text-teal-700 font-bold px-6 py-3 rounded-full hover:bg-teal-50 transition-colors shadow-lg"
                >
                  Analisis CV
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ── Summary Cards ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Kesiapan Karier",
              value: cvScore ? `${cvScore}%` : "—",
              icon: Target,
              href: "/cv",
              color: "text-teal-600",
              bg: "bg-teal-50",
            },
            {
              label: "Rekomendasi Lowongan",
              value: matchedJobsCount,
              sublabel: "lowongan cocok",
              icon: Briefcase,
              href: "/jobs",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Lamaran Aktif",
              value: activeApps,
              sublabel: "lamaran",
              icon: FileText,
              href: "/applications",
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              label: "Interview",
              value: interviewHistory.length,
              sublabel: "selesai",
              icon: BookOpen,
              href: "/interview",
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map((card) => (
            <Link href={card.href} key={card.label} className="block group">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900">{card.value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{card.label}</p>
                {card.sublabel && <p className="text-xs text-slate-400">{card.sublabel}</p>}
              </div>
            </Link>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* ── Recommended Jobs ── */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-slate-900">Rekomendasi Untukmu</h2>
                <Link href="/jobs" className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline">
                  Lihat Semua <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {topJobs.map(({ job, match }) => (
                  <Link href={`/jobs/${job.id}`} key={job.id} className="block group">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors truncate">{job.title}</h3>
                        <p className="text-sm text-primary font-medium truncate">{job.company.split("—")[0].trim()}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
                          <MapPin className="w-3.5 h-3.5" /> {job.location}
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span>Rp{(job.salaryMin / 1000000).toFixed(1)}Jt – Rp{(job.salaryMax / 1000000).toFixed(1)}Jt</span>
                        </div>
                      </div>
                      {match && (
                        <div className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border ${match.totalScore >= 80 ? "bg-teal-50 text-teal-700 border-teal-200" : match.totalScore >= 60 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                          {match.totalScore}% Cocok
                        </div>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* ── Application Progress ── */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-slate-900">Perjalanan Lamaranmu</h2>
                <Link href="/applications" className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline">
                  Lihat Semua <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {PROGRESS_STATUSES.map((status, i) => {
                    const count = appStatusCounts[status];
                    const config = STATUS_CONFIG[status];
                    return (
                      <div key={status} className="flex items-center gap-2 shrink-0">
                        <div className="text-center">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-extrabold border-2 transition-all ${count > 0 ? "border-primary bg-primary/5 text-primary" : "border-slate-200 bg-slate-50 text-slate-300"}`}>
                            {count}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1.5 font-medium max-w-[60px] leading-tight">{config.label}</p>
                        </div>
                        {i < PROGRESS_STATUSES.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-slate-200 mt-[-20px] shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
                {applications.length === 0 && (
                  <p className="text-sm text-slate-400 mt-4 text-center">Mulai mencari pekerjaan untuk mengisi jalur lamaranmu.</p>
                )}
              </div>
            </section>

            {/* ── AI Insight ── */}
            <section>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Rekomendasi Karier</h3>
                    <p className="text-slate-600 leading-relaxed">{aiInsight}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-8">

            {/* ── CV Readiness ── */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Kesiapan CV
              </h3>
              {cvAnalysis ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <ScoreRing score={cvAnalysis.score} size={64} stroke={5} />
                    <div>
                      <p className="text-2xl font-extrabold text-slate-900">{cvAnalysis.score}/100</p>
                      <p className="text-sm text-slate-500">Skor keseluruhan</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Struktur", score: cvAnalysis.sections.structure },
                      { label: "Relevansi", score: cvAnalysis.sections.skillRelevance },
                      { label: "Kelengkapan", score: cvAnalysis.sections.completeness },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{s.label}</span>
                        <span className="font-bold text-slate-900">{s.score}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/cv" className="block text-center text-primary text-sm font-semibold hover:underline">
                    Lihat Analisis CV
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm mb-3">CV kamu belum dianalisis.</p>
                  <Link href="/cv" className="inline-block bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-teal-800 transition-colors">
                    Unggah CV
                  </Link>
                </div>
              )}
            </section>

            {/* ── Skill Gap ── */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Skill yang Bisa Kamu Kembangkan
              </h3>
              {skillGaps.length > 0 ? (
                <div className="space-y-3">
                  {skillGaps.map((sg) => (
                    <div key={sg.skill} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                      <span className="font-medium text-slate-800 text-sm">{sg.skill}</span>
                      <span className="text-xs text-slate-500">Dibutuhkan {sg.count} lowongan</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Lengkapi profilmu untuk melihat skill gap.</p>
              )}
            </section>

            {/* ── Upcoming Interview ── */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Interview Mendatang
              </h3>
              {interviewHistory.length > 0 ? (
                <div className="space-y-3">
                  {interviewHistory.slice(0, 2).map((h: any) => (
                    <div key={h.id} className="p-3 rounded-xl bg-slate-50">
                      <p className="font-semibold text-slate-800 text-sm">{h.jobTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-lg font-extrabold ${h.score >= 80 ? "text-teal-600" : h.score >= 60 ? "text-amber-600" : "text-slate-500"}`}>
                          {h.score}
                        </span>
                        <span className="text-xs text-slate-500">{new Date(h.date).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 mb-3">Belum ada interview terjadwal.</p>
              )}
              <Link href="/interview" className="block text-center bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-teal-800 transition-colors mt-3">
                Latihan Interview
              </Link>
            </section>
          </div>
        </div>

        {/* ── Local Opportunities ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-600" />
                Peluang di Sekitarmu
              </h2>
              <p className="text-sm text-slate-500 mt-1">Temukan kesempatan yang sesuai dengan skillmu dan berdampak di komunitas sekitar.</p>
            </div>
            <Link href="/jobs" className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {localJobs.map(({ job, match }) => (
              <Link href={`/jobs/${job.id}`} key={job.id} className="block group">
                <div className="bg-gradient-to-br from-teal-50 to-white p-5 rounded-3xl border border-teal-100 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all h-full flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    {job.impactTag && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">{job.impactTag}</span>
                    )}
                    {match && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${match.totalScore >= 80 ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-white text-slate-600 border-slate-200"}`}>
                        {match.totalScore}% Cocok
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 flex-1">{job.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 truncate">{job.company.split("—")[0].trim()}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.distance ? `≈ ${job.distance} km (simulasi)` : job.location}
                    </div>
                    <div className="flex items-center text-teal-600 group-hover:translate-x-1 transition-transform">
                      Lihat <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Community Impact ── */}
        <section className="bg-gradient-to-r from-teal-50 to-emerald-50 p-8 rounded-3xl border border-teal-100 text-center">
          <Zap className="w-8 h-8 text-teal-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Dirancang untuk menghubungkan skill dengan komunitas sekitar.
          </h3>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            BekalKarir membantu mempertemukan kemampuan pengguna dengan peluang kerja di sekitar komunitas, termasuk UMKM, program sosial, dan inisiatif yang berdampak lokal.
          </p>
        </section>
      </div>
    </main>
  );
}
