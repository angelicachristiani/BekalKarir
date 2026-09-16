"use client";

import type { CVAnalysisResult } from "@/types/cv";

interface CVScoreCardProps {
  analysis: CVAnalysisResult;
}

const barColor = (score: number) => {
  if (score >= 80) return "bg-teal-500";
  if (score >= 60) return "bg-amber-400";
  return "bg-slate-400";
};

const textColor = (score: number) => {
  if (score >= 80) return "text-teal-600";
  if (score >= 60) return "text-amber-600";
  return "text-slate-500";
};

const ringColor = (score: number) => {
  if (score >= 80) return "#0F766E";
  if (score >= 60) return "#F59E0B";
  return "#94A3B8";
};

export default function CVScoreCard({ analysis }: CVScoreCardProps) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (circumference * analysis.score) / 100;

  const sectionItems = [
    { key: "structure" as const, label: "Struktur CV", val: analysis.sections.structure },
    { key: "readability" as const, label: "Keterbacaan", val: analysis.sections.readability },
    { key: "skillRelevance" as const, label: "Relevansi Skill", val: analysis.sections.skillRelevance },
    { key: "experience" as const, label: "Pengalaman", val: analysis.sections.experience },
    { key: "completeness" as const, label: "Kelengkapan", val: analysis.sections.completeness },
  ];

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <h3 className="font-bold text-slate-900 text-lg">Kesiapan CV</h3>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative shrink-0">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r={r} fill="none"
              stroke={ringColor(analysis.score)}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-900">{analysis.score}</span>
            <span className="text-xs text-slate-500 font-medium">/ 100</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          {sectionItems.map(({ key, label, val }) => (
            <div key={key}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm text-slate-600">{label}</span>
                <span className={`text-sm font-bold ${textColor(val)}`}>{val}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor(val)}`}
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
