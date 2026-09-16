"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Sparkles, Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_JOBS } from "@/data/mock-jobs";
import { calculateFallbackMatch } from "@/services/ai-matching";
import { getApplications, updateApplicationStatus, updateApplicationNotes, syncFromLegacyKeys } from "@/services/applications";
import type { Application, ApplicationStatus } from "@/types/application";
import { KANBAN_COLUMNS, STATUS_CONFIG } from "@/types/application";
import ApplicationCard from "@/components/applications/ApplicationCard";
import ApplicationDetail from "@/components/applications/ApplicationDetail";
import AppNav from "@/components/layout/AppNav";

export default function ApplicationsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("bekalkarir_profile");
    if (saved) setProfile(JSON.parse(saved));

    syncFromLegacyKeys();
    setApplications(getApplications());

    const hist = localStorage.getItem("bekalkarir_interview_history");
    if (hist) setInterviewHistory(JSON.parse(hist));
  }, []);

  const columns = useMemo(() => {
    const grouped: Record<ApplicationStatus, Application[]> = {
      saved: [], ready: [], applied: [], interview: [], offer: [], rejected: [],
    };
    for (const app of applications) {
      if (grouped[app.status]) {
        grouped[app.status].push(app);
      }
    }
    return grouped;
  }, [applications]);

  const handleStatusChange = (jobId: string, status: ApplicationStatus) => {
    updateApplicationStatus(jobId, status);
    setApplications(getApplications());
    if (selectedApp?.jobId === jobId) {
      setSelectedApp((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleNotesChange = (jobId: string, notes: string) => {
    updateApplicationNotes(jobId, notes);
    setApplications(getApplications());
    if (selectedApp?.jobId === jobId) {
      setSelectedApp((prev) => (prev ? { ...prev, notes } : null));
    }
  };

  const getJobData = (jobId: string) => {
    return MOCK_JOBS.find((j) => j.id === jobId);
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <AppNav />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Lamaran Saya</h1>
            <p className="text-slate-500 mt-1">Kelola semua lamaran pekerjaan kamu di satu tempat.</p>
          </div>
          <Link href="/jobs">
            <Button className="bg-primary text-white hover:bg-teal-800 rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Cari Lowongan
            </Button>
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white p-14 rounded-3xl border border-slate-100 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Briefcase className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Belum ada lamaran</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Mulai mencari pekerjaan dan simpan yang kamu minati untuk memulai tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
              <Link href="/jobs">
                <Button variant="outline" className="rounded-full">Cari Lowongan</Button>
              </Link>
              <Link href="/cv">
                <Button className="bg-primary text-white hover:bg-teal-800 rounded-full">Analisis CV</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {KANBAN_COLUMNS.map((status) => (
                <div key={status} className="w-72 shrink-0">
                  <div className={`px-4 py-2.5 rounded-2xl mb-4 ${STATUS_CONFIG[status].bg}`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold text-sm ${STATUS_CONFIG[status].color}`}>
                        {STATUS_CONFIG[status].label}
                      </h3>
                      <span className={`text-xs font-semibold ${STATUS_CONFIG[status].color}`}>
                        {columns[status].length}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {columns[status].map((app) => {
                      const job = getJobData(app.jobId);
                      if (!job) return null;
                      const match = profile ? calculateFallbackMatch(profile, job) : null;
                      return (
                        <ApplicationCard
                          key={app.id}
                          application={app}
                          jobTitle={job.title}
                          jobCompany={job.company.split("—")[0].trim()}
                          jobLocation={job.location}
                          jobSalaryMin={job.salaryMin}
                          jobSalaryMax={job.salaryMax}
                          matchScore={match?.totalScore}
                          onClick={() => setSelectedApp(app)}
                        />
                      );
                    })}

                    {columns[status].length === 0 && (
                      <div className="bg-white/50 p-6 rounded-2xl border border-dashed border-slate-200 text-center">
                        <p className="text-xs text-slate-400">Kosong</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedApp && (() => {
        const job = getJobData(selectedApp.jobId);
        if (!job) return null;
        const match = profile ? calculateFallbackMatch(profile, job) : null;
        return (
          <ApplicationDetail
            application={selectedApp}
            jobTitle={job.title}
            jobCompany={job.company}
            jobLocation={job.location}
            jobType={job.type}
            jobSalaryMin={job.salaryMin}
            jobSalaryMax={job.salaryMax}
            matchScore={match?.totalScore}
            interviewHistory={interviewHistory}
            onClose={() => setSelectedApp(null)}
            onStatusChange={(status) => handleStatusChange(selectedApp.jobId, status)}
            onNotesChange={(notes) => handleNotesChange(selectedApp.jobId, notes)}
          />
        );
      })()}
    </main>
  );
}
