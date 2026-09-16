"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useState, useMemo } from "react";
import { Sparkles, MapPin, Briefcase, ChevronRight, ArrowRight, Star, Users, Zap } from "lucide-react";
import { MOCK_JOBS } from "@/data/mock-jobs";
import { calculateFallbackMatch } from "@/services/ai-matching";
import AppNav from "@/components/layout/AppNav";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  useEffect(() => {
    const savedProfile = localStorage.getItem("bekalkarir_profile");
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    const saved = localStorage.getItem("bekalkarir_saved_jobs");
    if (saved) setSavedJobs(JSON.parse(saved));
  }, []);

  // Top 3 recommended jobs for dashboard preview
  const topJobs = useMemo(() => {
    if (!profile) return MOCK_JOBS.filter(j => !j.isLocalOpportunity).slice(0, 3);
    return MOCK_JOBS
      .filter(j => !j.isLocalOpportunity)
      .map(job => ({ ...job, matchScore: calculateFallbackMatch(profile, job).totalScore }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [profile]);

  const scoreColor = (score: number) => {
    if (score >= 80) return "bg-teal-50 text-teal-700 border-teal-200";
    if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <main className="flex-1 overflow-x-hidden">
      <AppNav />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 md:pt-52 md:pb-36 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[700px] h-[700px] bg-teal-100 rounded-full blur-[140px] opacity-60 -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] bg-amber-100 rounded-full blur-[120px] opacity-50 -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 font-semibold text-sm border border-teal-200">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Platform Karir Cerdas untuk Gen-Z Indonesia
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
            Pekerjaan Sesuai{" "}
            <span className="relative text-primary whitespace-nowrap">
              Kemampuan Nyata
              <svg className="absolute w-full h-3.5 -bottom-0.5 left-0 text-amber-300" viewBox="0 0 200 10" preserveAspectRatio="none">
                <path d="M0 8 Q 100 0 200 8" stroke="currentColor" strokeWidth="5" fill="transparent" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            BekalKarir memahami skill nyatamu. AI kami mencocokkan kemampuanmu dengan pekerjaan yang benar-benar relevan — bukan sekadar listing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/onboarding"
              className={buttonVariants({ size: "lg", className: "w-full sm:w-auto text-lg h-14 px-10 rounded-full shadow-xl shadow-primary/25 hover:scale-105 transition-all bg-primary text-white" })}
            >
              Mulai Perjalanan Karirmu →
            </Link>
            <Link
              href="/jobs"
              className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto text-lg h-14 px-8 rounded-full border-slate-200 bg-white hover:bg-slate-50 text-slate-700" })}
            >
              Lihat Lowongan
            </Link>
          </div>

          <div className="pt-8 flex items-center justify-center gap-10 text-sm text-slate-500">
            {[
              { icon: Users, val: "20+", label: "Contoh Lowongan" },
              { icon: Briefcase, val: "5", label: "Fitur Utama" },
              { icon: Star, val: "AI", label: "Powered Matching" },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <Icon className="w-5 h-5 text-primary/60 mb-0.5" />
                <span className="font-extrabold text-2xl text-slate-800">{val}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rekomendasi Untukmu (Dashboard Integration) ── */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                {profile ? `Rekomendasi Untukmu, ${profile.nama.split(" ")[0]} ✨` : "Rekomendasi Pekerjaan"}
              </h2>
              <p className="text-slate-500 mt-2">
                {profile ? "Pekerjaan yang paling cocok berdasarkan skill dan profilmu." : "Isi profil untuk mendapatkan rekomendasi yang dipersonalisasi."}
              </p>
            </div>
            <Link href="/jobs" className="flex items-center gap-2 text-primary font-semibold hover:underline shrink-0">
              Lihat semua rekomendasi <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topJobs.map((job: any) => (
              <Link href={`/jobs/${job.id}`} key={job.id} className="block group">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all h-full flex flex-col">
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">{job.title}</h3>
                      <p className="text-sm text-primary font-medium mt-0.5 truncate">{job.company}</p>
                    </div>
                    {profile && job.matchScore !== undefined && (
                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 flex items-center gap-1 ${scoreColor(job.matchScore)}`}>
                        <Sparkles className="w-3 h-3" /> {job.matchScore}%
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                    <span className="mx-1">·</span>
                    <Briefcase className="w-3.5 h-3.5" /> {job.type}
                  </div>
                  <div className="text-sm font-semibold text-slate-700 mb-auto">
                    Rp{(job.salaryMin / 1000000).toFixed(1)}Jt – Rp{(job.salaryMax / 1000000).toFixed(1)}Jt
                  </div>
                  <div className="flex items-center justify-end mt-4 text-primary text-sm font-semibold group-hover:gap-2 gap-1 transition-all">
                    Lihat Detail <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {!profile && (
            <div className="mt-8 bg-gradient-to-r from-primary/10 to-teal-50 p-6 rounded-3xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Dapatkan Rekomendasi yang Dipersonalisasi</p>
                  <p className="text-sm text-slate-500">Isi profil singkat untuk melihat skor kecocokan di setiap lowongan.</p>
                </div>
              </div>
              <Link href="/onboarding" className={buttonVariants({ className: "bg-primary text-white hover:bg-teal-800 rounded-full px-6 shrink-0" })}>
                Isi Profil Sekarang
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Cara Kerja ── */}
      <section id="cara-kerja" className="py-24 bg-white px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Bagaimana BekalKarir Membantumu?</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Dari mengenali potensi diri hingga menemukan pekerjaan yang tepat.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "✨", title: "Bangun Profil Skill", desc: "Isi profil interaktif: skill, pendidikan, pengalaman. Hanya 5 menit." },
              { icon: "🤖", title: "Temukan Pekerjaan Cocok", desc: "AI mencocokkan profilmu dengan lowongan dan menjelaskan mengapa cocok." },
              { icon: "🎯", title: "Latihan Interview AI", desc: "Persiapan interview real-time dengan AI yang memahami posisi targetmu." },
              { icon: "📋", title: "Kelola Lamaranmu", desc: "Track setiap lamaran dari awal hingga diterima, semua di satu tempat." },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 p-7 rounded-3xl border border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group text-center">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm mb-5 mx-auto group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-2xl mx-auto relative">
          <div className="w-16 h-16 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-extrabold mb-4">Mulai Sekarang, Gratis.</h2>
          <p className="text-slate-400 text-lg mb-4">Temukan lowongan yang cocok dengan kemampuan nyatamu.</p>
          <p className="text-slate-500 text-sm mb-10">Termasuk peluang di UMKM, program sosial, dan inisiatif lokal di sekitarmu.</p>
          <Link href="/onboarding" className={buttonVariants({ size: "lg", className: "h-14 px-10 rounded-full bg-primary text-white hover:bg-teal-600 shadow-xl shadow-primary/30 text-lg font-bold hover:scale-105 transition-all" })}>
            Mulai Perjalanan Karirmu →
          </Link>
        </div>
      </section>
    </main>
  );
}
