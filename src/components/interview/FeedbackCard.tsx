"use client";

import { CheckCircle2, AlertTriangle, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import type { InterviewFeedback } from "@/types/interview";
import ScoreRing from "./ScoreRing";

interface FeedbackCardProps {
  feedback: InterviewFeedback;
}

const SCORE_ITEMS = [
  { key: "relevance" as const, label: "Relevansi Jawaban" },
  { key: "structure" as const, label: "Struktur Jawaban" },
  { key: "communication" as const, label: "Komunikasi" },
  { key: "clarity" as const, label: "Kejelasan" },
  { key: "examples" as const, label: "Penggunaan Contoh" },
];

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

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center">
        <ScoreRing score={feedback.score} size={160} label="Skor Interview" />
        <p className="mt-4 text-sm text-slate-500">
          {feedback.score >= 80
            ? "Kinerja yang sangat baik!"
            : feedback.score >= 60
              ? "Cukup baik, masih ada ruang untuk berkembang."
              : "Terus berlatih untuk meningkatkan kualitas jawaban."}
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900">Breakdown Skor</h3>
        {SCORE_ITEMS.map(({ key, label }) => (
          <div key={key}>
            <div className="flex justify-between mb-1.5">
              <span className="text-sm text-slate-600">{label}</span>
              <span className={`text-sm font-bold ${textColor(feedback[key])}`}>{feedback[key]}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor(feedback[key])}`}
                style={{ width: `${feedback[key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {feedback.starAnalysis && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Analisis STAR
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(["situation", "task", "action", "result"] as const).map((item) => {
              const passed = feedback.starAnalysis![item];
              return (
                <div
                  key={item}
                  className={`flex items-center gap-2 p-3 rounded-xl border ${
                    passed ? "bg-teal-50 border-teal-200" : "bg-amber-50 border-amber-200"
                  }`}
                >
                  {passed ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className={`text-sm font-medium ${passed ? "text-teal-800" : "text-amber-800"}`}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-500" />
            Kekuatanmu
          </h3>
          <ul className="space-y-2.5">
            {feedback.strengths.map((s, i) => (
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
            Yang Perlu Ditingkatkan
          </h3>
          <ul className="space-y-2.5">
            {feedback.improvements.map((s, i) => (
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
          {feedback.recommendations.map((r, i) => (
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
