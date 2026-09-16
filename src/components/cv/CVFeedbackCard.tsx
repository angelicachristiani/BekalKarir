"use client";

import { CheckCircle2, TrendingDown, Sparkles } from "lucide-react";
import type { CVAnalysisResult } from "@/types/cv";

interface CVFeedbackCardProps {
  analysis: CVAnalysisResult;
}

export default function CVFeedbackCard({ analysis }: CVFeedbackCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-500" />
            Yang Sudah Kuat
          </h3>
          <ul className="space-y-2.5">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="text-teal-500 mt-0.5">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-amber-500" />
            Yang Perlu Diperbaiki
          </h3>
          <ul className="space-y-2.5">
            {analysis.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="text-amber-500 mt-0.5">△</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Rekomendasi AI
        </h3>
        <ul className="space-y-3">
          {analysis.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="text-amber-400 mt-0.5">→</span>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
