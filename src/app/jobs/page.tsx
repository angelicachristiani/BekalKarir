"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Clock, ChevronRight, Bookmark, BookmarkCheck, Sparkles, Star } from "lucide-react";
import { MOCK_JOBS } from "@/data/mock-jobs";
import { type JobOpportunity } from "@/data/mock-jobs";
import { type MatchResult } from "@/services/ai-matching";
import AppNav from "@/components/layout/AppNav";

interface MatchedJobItem {
  job: JobOpportunity;
  match: MatchResult;
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function JobCardSkeleton() {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm animate-pulse">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-100 rounded w-1/2" />
        </div>
        <div className="h-8 w-20 bg-slate-100 rounded-full" />
      </div>
      <div className="flex gap-3 mb-5">
        <div className="h-4 bg-slate-100 rounded w-24" />
        <div className="h-4 bg-slate-100 rounded w-20" />
        <div className="h-4 bg-slate-100 rounded w-20" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(i => <div key={i} className="h-6 bg-slate-100 rounded-full w-16" />)}
      </div>
    </div>
  );
}

export default function JobDiscoveryPage() {
  const [profile, setProfile] = useState<any>(null);
  const [matchedJobs, setMatchedJobs] = useState<MatchedJobItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterExp, setFilterExp] = useState("All");
  const [sortBy, setSortBy] = useState("match");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState("AI sedang membandingkan skill kamu...");

  // Load profile + saved jobs, then fetch matching
  useEffect(() => {
    const savedProfile = localStorage.getItem("bekalkarir_profile");
    const savedJobsRaw = localStorage.getItem("bekalkarir_saved_jobs");
    if (savedJobsRaw) setSavedJobs(JSON.parse(savedJobsRaw));

    const userProfile = savedProfile ? JSON.parse(savedProfile) : null;
    setProfile(userProfile);

    const aiTexts = [
      "AI sedang membandingkan skill kamu...",
      "Menganalisis kecocokan lokasi...",
      "Memeriksa kesesuaian gaji...",
      "Menyiapkan rekomendasi terbaik...",
    ];
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % aiTexts.length;
      setAiStatus(aiTexts[step]);
    }, 800);

    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/match/jobs", {
          method: userProfile ? "POST" : "GET",
          headers: userProfile ? { "Content-Type": "application/json" } : {},
          body: userProfile ? JSON.stringify({ userProfile }) : undefined,
          cache: "no-store",
        });
        const data = await res.json();
        setMatchedJobs(data);
      } catch (e) {
        console.error("Failed to fetch matched jobs", e);
        setMatchedJobs([]);
      } finally {
        clearInterval(interval);
        setIsLoading(false);
      }
    };

    fetchJobs();
    return () => clearInterval(interval);
  }, []);

  const toggleSaveJob = (e: React.MouseEvent, jobId: string) => {
    e.preventDefault();
    const newSaved = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    setSavedJobs(newSaved);
    localStorage.setItem("bekalkarir_saved_jobs", JSON.stringify(newSaved));
  };

  const filteredJobs = useMemo(() => {
    let result = matchedJobs.filter(({ job }) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.skills.some(s => s.toLowerCase().includes(q));
      const matchesType = filterType === "All" || job.type.includes(filterType);
      const matchesLoc = filterLocation === "All" || job.location.includes(filterLocation);
      const matchesExp = filterExp === "All" || job.experienceLevel === filterExp;
      return matchesSearch && matchesType && matchesLoc && matchesExp;
    });

    if (sortBy === "match") result.sort((a, b) => b.match.totalScore - a.match.totalScore);
    else if (sortBy === "recent") result.sort((a, b) => new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime());
    else if (sortBy === "salary") result.sort((a, b) => b.job.salaryMax - a.job.salaryMax);

    return result;
  }, [matchedJobs, searchTerm, filterType, filterLocation, filterExp, sortBy]);

  const localOpportunities = useMemo(() => filteredJobs.filter(j => j.job.isLocalOpportunity).slice(0, 4), [filteredJobs]);
  const standardJobs = useMemo(() => filteredJobs.filter(j => !j.job.isLocalOpportunity), [filteredJobs]);

  const allLocations = ["All", ...Array.from(new Set(MOCK_JOBS.map(j => j.location.split(',')[0].trim())))];

  // Score color helper
  const scoreColor = (score: number) => {
    if (score >= 80) return "text-teal-700 bg-teal-50 border-teal-200";
    if (score >= 60) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <AppNav />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 space-y-8">

        {/* ── Hero/Greeting ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {profile?.nama ? `Halo, ${profile.nama.split(' ')[0]}! 👋` : "Temukan Pekerjaan Untukmu"}
            </h1>
            <p className="text-slate-500 mt-1">
              {isLoading ? (
                <span className="flex items-center gap-2 text-primary font-medium animate-pulse">
                  <Sparkles className="w-4 h-4" /> {aiStatus}
                </span>
              ) : (
                `${standardJobs.length} lowongan cocok ditemukan`
              )}
            </p>
          </div>
          {!profile && (
            <Link href="/onboarding" className="shrink-0 inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-teal-800 transition-colors shadow-md shadow-primary/20">
              <Sparkles className="w-4 h-4" /> Isi Profil untuk Match Score
            </Link>
          )}
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="bg-white p-4 md:p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Cari posisi, skill, atau perusahaan..."
              className="pl-12 h-12 rounded-2xl bg-slate-50 border-transparent focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary text-base"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0 flex-wrap md:flex-nowrap">
            <Select value={filterLocation} onValueChange={(val) => setFilterLocation(val || "All")}>
              <SelectTrigger className="h-12 rounded-2xl w-[150px] bg-slate-50 border-transparent shrink-0"><SelectValue placeholder="Lokasi" /></SelectTrigger>
              <SelectContent>{allLocations.map(loc => <SelectItem key={loc} value={loc}>{loc === "All" ? "Semua Lokasi" : loc}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filterType} onValueChange={(val) => setFilterType(val || "All")}>
              <SelectTrigger className="h-12 rounded-2xl w-[140px] bg-slate-50 border-transparent shrink-0"><SelectValue placeholder="Tipe Kerja" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Semua Tipe</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Remote (WFH)">Remote (WFH)</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterExp} onValueChange={(val) => setFilterExp(val || "All")}>
              <SelectTrigger className="h-12 rounded-2xl w-[150px] bg-slate-50 border-transparent shrink-0"><SelectValue placeholder="Pengalaman" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Semua Level</SelectItem>
                <SelectItem value="Entry Level">Entry Level</SelectItem>
                <SelectItem value="Mid Level">Mid Level</SelectItem>
                <SelectItem value="Senior Level">Senior Level</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(val) => setSortBy(val || "match")}>
              <SelectTrigger className="h-12 rounded-2xl w-[160px] bg-primary text-primary-foreground border-transparent shrink-0"><SelectValue placeholder="Urutkan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="match">🔥 Paling Cocok</SelectItem>
                <SelectItem value="recent">⏱️ Terbaru</SelectItem>
                <SelectItem value="salary">💰 Gaji Tertinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Local Opportunities ── */}
        {(isLoading || localOpportunities.length > 0) && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              Peluang di Sekitarmu
              <Badge variant="secondary" className="ml-1 bg-teal-50 text-teal-800 border-teal-200 font-medium">UMKM & Lokal</Badge>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading
                ? [1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 animate-pulse h-44">
                      <div className="h-5 bg-slate-200 rounded w-1/2 mb-3" />
                      <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-slate-100 rounded w-1/2" />
                    </div>
                  ))
                : localOpportunities.map(({ job, match }) => (
                    <Link href={`/jobs/${job.id}`} key={job.id} className="block group">
                      <div className="bg-gradient-to-br from-teal-50 to-white p-5 rounded-3xl border border-teal-100 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all h-full flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          {job.impactTag && (
                            <Badge className="bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100 font-medium text-xs">{job.impactTag}</Badge>
                          )}
                          {profile && (
                            <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${scoreColor(match.totalScore)}`}>
                              {match.totalScore}%
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 flex-1">{job.title}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{job.company}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
                          <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.distance ? `≈ ${job.distance} km (simulasi)` : job.location}</div>
                          <div className="flex items-center text-teal-600 group-hover:translate-x-1 transition-transform">Lihat <ChevronRight className="w-3.5 h-3.5" /></div>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
          </section>
        )}

        {/* ── Standard Job List ── */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Rekomendasi Pekerjaan
              {!isLoading && <span className="text-slate-400 text-lg ml-2 font-normal">({standardJobs.length})</span>}
            </h2>
            {profile && !isLoading && (
              <div className="text-sm text-slate-500 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                Berdasarkan profilmu
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {[1, 2, 3, 4].map(i => <JobCardSkeleton key={i} />)}
            </div>
          ) : standardJobs.length === 0 ? (
            <div className="bg-white p-14 rounded-3xl border border-slate-100 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Belum ada pekerjaan yang sesuai</h3>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">Coba ubah filter atau perluas lokasi pencarianmu.</p>
              {!profile && (
                <Link href="/onboarding" className="mt-6 inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-800 transition-colors">
                  <Sparkles className="w-4 h-4" /> Isi Profil untuk Rekomendasi
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {standardJobs.map(({ job, match }) => {
                const isSaved = savedJobs.includes(job.id);
                const salaryStr = `Rp${(job.salaryMin / 1000000).toFixed(1)}Jt – Rp${(job.salaryMax / 1000000).toFixed(1)}Jt`;
                return (
                  <Link href={`/jobs/${job.id}`} key={job.id} className="block group">
                    <div className="bg-white p-6 md:p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-200 h-full flex flex-col">
                      {/* Card Top */}
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-2">{job.title}</h3>
                          <p className="text-primary font-semibold mt-1 text-sm truncate">{job.company}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <button
                            onClick={e => toggleSaveJob(e, job.id)}
                            aria-label={isSaved ? "Hapus simpan" : "Simpan pekerjaan"}
                            className={`p-2 rounded-full transition-colors ${isSaved ? "bg-teal-100 text-teal-700" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                          >
                            {isSaved ? <BookmarkCheck className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5" />}
                          </button>
                          {profile && (
                            <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${scoreColor(match.totalScore)}`}>
                              <Sparkles className="w-3 h-3" /> {match.totalScore}% Cocok
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium mb-4">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.type}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.experienceLevel}</span>
                      </div>

                      {/* Salary */}
                      <div className="text-sm font-semibold text-slate-700 mb-4">{salaryStr} / bulan</div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {job.skills.slice(0, 4).map((skill, i) => {
                          const isMatched = profile && match.matchedSkills.some(ms => ms.toLowerCase() === skill.toLowerCase());
                          return (
                            <Badge key={i} variant="outline" className={`text-xs font-normal px-2.5 py-1 ${isMatched ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                              {isMatched && <span className="mr-1">✓</span>}{skill}
                            </Badge>
                          );
                        })}
                        {job.skills.length > 4 && (
                          <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-200 text-xs font-normal px-2.5 py-1">+{job.skills.length - 4}</Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
