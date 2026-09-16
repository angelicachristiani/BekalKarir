"use client";

import { MapPin, Briefcase, DollarSign, Sparkles } from "lucide-react";
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import type { Application } from "@/types/application";

interface ApplicationCardProps {
  application: Application;
  jobTitle: string;
  jobCompany: string;
  jobLocation: string;
  jobSalaryMin: number;
  jobSalaryMax: number;
  matchScore?: number;
  onClick: () => void;
}

export default function ApplicationCard({
  application,
  jobTitle,
  jobCompany,
  jobLocation,
  jobSalaryMin,
  jobSalaryMax,
  matchScore,
  onClick,
}: ApplicationCardProps) {
  const salaryStr = `Rp${(jobSalaryMin / 1000000).toFixed(0)}Jt–${(jobSalaryMax / 1000000).toFixed(0)}Jt`;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-slate-900 text-sm truncate">{jobTitle}</h4>
          <p className="text-xs text-primary font-medium truncate">{jobCompany}</p>
        </div>
        <ApplicationStatusBadge status={application.status} />
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {jobLocation}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" /> {salaryStr}
        </span>
      </div>

      <div className="flex items-center justify-between">
        {matchScore !== undefined && (
          <span className="flex items-center gap-1 text-xs font-semibold text-teal-600">
            <Sparkles className="w-3 h-3" /> {matchScore}%
          </span>
        )}
        {application.cvAnalysisScore !== null && (
          <span className="text-xs text-slate-400">CV: {application.cvAnalysisScore}</span>
        )}
        {application.interviewScore !== null && (
          <span className="text-xs text-slate-400">Interview: {application.interviewScore}</span>
        )}
      </div>

      {application.notes && (
        <p className="text-xs text-slate-400 mt-2 truncate italic">{application.notes}</p>
      )}
    </button>
  );
}
