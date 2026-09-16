"use client";

import { Briefcase, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CVJobMatch } from "@/types/cv";

interface JobCVMatchProps {
  match: CVJobMatch;
  jobTitle: string;
  jobCompany: string;
}

export default function JobCVMatch({ match, jobTitle, jobCompany }: JobCVMatchProps) {
  const ringColor = match.matchScore >= 80 ? "#0F766E" : match.matchScore >= 60 ? "#F59E0B" : "#94A3B8";
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (circumference * match.matchScore) / 100;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 md:p-8 rounded-3xl text-white space-y-6">
      <h3 className="font-bold flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-amber-400" />
        Kesesuaian CV dengan Lowongan
      </h3>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={r} fill="none"
              stroke={ringColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold">{match.matchScore}%</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="font-semibold text-lg">{jobTitle}</p>
          <p className="text-slate-400 text-sm">{jobCompany}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Skill Match", val: match.skillMatch },
          { label: "Keyword", val: match.keywordRelevance },
          { label: "Pengalaman", val: match.experienceRelevance },
        ].map(({ label, val }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-slate-400">{label}</span>
              <span className="text-xs font-bold">{val}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {match.matchedSkills.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-teal-400" /> Skill yang Cocok
          </p>
          <div className="flex flex-wrap gap-1.5">
            {match.matchedSkills.map((s, i) => (
              <Badge key={i} className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-xs">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      {match.missingSkills.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" /> Skill yang Kurang
          </p>
          <div className="flex flex-wrap gap-1.5">
            {match.missingSkills.map((s, i) => (
              <Badge key={i} className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">{s}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
