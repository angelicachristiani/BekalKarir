"use client";

import { Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

interface SkillAnalysisProps {
  detectedSkills: string[];
  profileSkills: string[];
  missingFromProfile: string[];
}

export default function SkillAnalysis({ detectedSkills, profileSkills, missingFromProfile }: SkillAnalysisProps) {
  const matchedWithProfile = detectedSkills.filter((s) =>
    profileSkills.some((ps) => ps.toLowerCase() === s.toLowerCase())
  );

  const onlyInProfile = profileSkills.filter(
    (ps) => !detectedSkills.some((ds) => ds.toLowerCase() === ps.toLowerCase())
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        Analisis Skill
      </h3>

      {detectedSkills.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
            Skill yang Terdeteksi di CV
          </h4>
          <div className="flex flex-wrap gap-2">
            {detectedSkills.map((skill, i) => {
              const inProfile = matchedWithProfile.includes(skill);
              return (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                    inProfile
                      ? "bg-teal-50 text-teal-700 border-teal-200"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {inProfile && <span className="mr-1">✓</span>}
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {onlyInProfile.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Skill di Profil yang Belum Terdeteksi di CV
          </h4>
          <div className="flex flex-wrap gap-2">
            {onlyInProfile.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium"
              >
                △ {skill}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Skill ini ada di profil kamu tetapi belum terlihat jelas dalam CV. Pertimbangkan untuk menambahkannya.
          </p>
        </div>
      )}

      {missingFromProfile.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-700 text-sm mb-3">Skill yang Belum Ditemukan</h4>
          <div className="flex flex-wrap gap-2">
            {missingFromProfile.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
