import { JobOpportunity } from "@/data/mock-jobs";

export type MatchResult = {
  totalScore: number;
  breakdown: {
    skill: number; // 40%
    location: number; // 20%
    salary: number; // 15%
    experience: number; // 15%
    preference: number; // 10%
  };
  matchedSkills: string[];
  missingSkills: string[];
  explanation: {
    whyMatch: string[];
    whatIsMissing: string[];
    suggestion: string;
  };
};

// Fallback Deterministic Matching Logic
export function calculateFallbackMatch(userProfile: any, job: JobOpportunity): MatchResult {
  // 1. Skill Match (40%)
  const userSkills = (userProfile.skills || []).map((s: any) => s.nama.toLowerCase());
  const jobSkills = job.skills.map((s) => s.toLowerCase());
  
  const matchedSkills = job.skills.filter(s => userSkills.includes(s.toLowerCase()));
  const missingSkills = job.skills.filter(s => !userSkills.includes(s.toLowerCase()));
  
  let skillScore = 0;
  if (jobSkills.length > 0) {
    skillScore = Math.round((matchedSkills.length / jobSkills.length) * 100);
  }

  // 2. Location Match (20%)
  let locationScore = 0;
  const userLoc = (userProfile.lokasi || "").toLowerCase();
  const jobLoc = job.location.toLowerCase();
  const userPrefLoc = (userProfile.preferensi_lokasi || "").toLowerCase();
  
  if (job.type.toLowerCase().includes("remote") || userPrefLoc === "wfh" || userPrefLoc === "remote") {
    locationScore = 100;
  } else if (userLoc && jobLoc.includes(userLoc)) {
    locationScore = 100; // Very close
  } else if (userLoc && jobLoc !== userLoc) {
    locationScore = 50; // Different city, might relocate
  } else {
    locationScore = 80; // Unknown
  }

  // 3. Salary Match (15%)
  let salaryScore = 100;
  const expectedStr = userProfile.ekspektasi_gaji || "";
  let userExpectedMin = 0;
  if (expectedStr.includes("< 5")) userExpectedMin = 4000000;
  else if (expectedStr.includes("5 - 10")) userExpectedMin = 5000000;
  else if (expectedStr.includes("10 - 15")) userExpectedMin = 10000000;
  else if (expectedStr.includes("> 15")) userExpectedMin = 15000000;

  if (userExpectedMin > job.salaryMax) {
    salaryScore = 30;
  } else if (userExpectedMin > job.salaryMin) {
    salaryScore = 80;
  } else {
    salaryScore = 100;
  }

  // 4. Experience Match (15%)
  let expScore = 100;
  const userExpYears = (userProfile.pengalaman || []).length * 1.5; // Rough estimate
  if (job.experienceLevel === "Entry Level") {
    expScore = 100;
  } else if (job.experienceLevel === "Mid Level") {
    expScore = userExpYears >= 2 ? 100 : 60;
  } else if (job.experienceLevel === "Senior Level") {
    expScore = userExpYears >= 5 ? 100 : 40;
  }

  // 5. Work Preference Match (10%)
  let prefScore = 100;
  if (userProfile.tipe_pekerjaan && !job.type.toLowerCase().includes(userProfile.tipe_pekerjaan.toLowerCase())) {
    prefScore = 50;
  }

  // Calculate Total
  const totalScore = Math.round(
    (skillScore * 0.40) +
    (locationScore * 0.20) +
    (salaryScore * 0.15) +
    (expScore * 0.15) +
    (prefScore * 0.10)
  );

  // Generate Explanation
  const whyMatch = [];
  if (skillScore >= 70) whyMatch.push(`Keahlian utama kamu sesuai dengan kebutuhan peran ini.`);
  if (locationScore >= 90) whyMatch.push(`Lokasi pekerjaan sesuai dengan domisili atau preferensimu.`);
  if (salaryScore >= 90) whyMatch.push(`Gaji berada dalam rentang ekspektasimu.`);
  if (expScore >= 90) whyMatch.push(`Tingkat pengalamanmu cocok untuk posisi ini.`);
  if (whyMatch.length === 0) whyMatch.push(`Pekerjaan ini memiliki beberapa aspek yang bisa menjadi peluang belajar bagimu.`);

  let suggestion = `Pekerjaan ini sangat cocok untukmu! Segera siapkan lamaran terbaikmu.`;
  if (totalScore < 70) {
    suggestion = `Pekerjaan ini mungkin agak menantang saat ini. Fokus untuk mempelajari skill yang masih kurang sebelum melamar.`;
  } else if (missingSkills.length > 0) {
    suggestion = `Jika kamu mempelajari ${missingSkills[0]}, kamu akan jauh lebih siap untuk posisi ini.`;
  }

  return {
    totalScore,
    breakdown: {
      skill: skillScore,
      location: locationScore,
      salary: salaryScore,
      experience: expScore,
      preference: prefScore
    },
    matchedSkills,
    missingSkills,
    explanation: {
      whyMatch,
      whatIsMissing: missingSkills.slice(0, 3), // Max 3 missing
      suggestion
    }
  };
}
