import { z } from "zod";

export interface ExtractedCV {
  rawText: string;
  nama: string | null;
  email: string | null;
  phone: string | null;
  lokasi: string | null;
  summary: string | null;
  pendidikan: { institusi: string; jurusan: string; tahun: string }[];
  pengalaman: { perusahaan: string; posisi: string; durasi: string; deskripsi: string }[];
  skills: string[];
  proyek: { nama: string; deskripsi: string }[];
  sertifikasi: string[];
  organisasi: string[];
  bahasa: string[];
}

export const CVAnalysisResultSchema = z.object({
  score: z.number().min(0).max(100),
  sections: z.object({
    structure: z.number().min(0).max(100),
    readability: z.number().min(0).max(100),
    skillRelevance: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    completeness: z.number().min(0).max(100),
  }),
  detectedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export type CVAnalysisResult = z.infer<typeof CVAnalysisResultSchema>;

export interface CVJobMatch {
  jobId: string;
  matchScore: number;
  skillMatch: number;
  keywordRelevance: number;
  experienceRelevance: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
}

export interface CVImprovement {
  section: string;
  current: string;
  suggestion: string;
}
