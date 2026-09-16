import type { ExtractedCV, CVAnalysisResult, CVJobMatch } from "@/types/cv";
import type { InterviewType } from "@/types/interview";

const SKILL_KEYWORDS: Record<string, string[]> = {
  "JavaScript": ["javascript", "js", "es6", "es2015", "es2020"],
  "TypeScript": ["typescript", "ts"],
  "React": ["react", "reactjs", "react.js"],
  "Next.js": ["next.js", "nextjs", "next"],
  "Node.js": ["node.js", "nodejs", "node"],
  "Python": ["python", "py"],
  "SQL": ["sql", "mysql", "postgresql", "mssql"],
  "Excel": ["excel", "microsoft excel", "spreadsheet"],
  "HTML": ["html", "html5"],
  "CSS": ["css", "css3", "tailwind", "bootstrap", "sass", "scss"],
  "Figma": ["figma", "sketch", "adobe xd"],
  "Power BI": ["power bi", "powerbi"],
  "Tableau": ["tableau"],
  "Git": ["git", "github", "gitlab", "bitbucket"],
  "Docker": ["docker", "container"],
  "AWS": ["aws", "amazon web services"],
  "Java": ["java"],
  "C++": ["c++", "cpp"],
  "C#": ["c#", "csharp"],
  "PHP": ["php"],
  "Laravel": ["laravel"],
  "Django": ["django"],
  "Spring": ["spring", "spring boot"],
  "MySQL": ["mysql"],
  "PostgreSQL": ["postgresql", "postgres"],
  "MongoDB": ["mongodb", "mongo"],
  "Redis": ["redis"],
  "REST API": ["rest", "restful", "rest api", "api"],
  "GraphQL": ["graphql", "gql"],
  "Agile": ["agile", "scrum", "kanban"],
  "Leadership": ["leadership", "memimpin", "kepemimpinan"],
  "Communication": ["communication", "komunikasi"],
  "Problem Solving": ["problem solving", "problem-solving"],
  "Public Speaking": ["public speaking", "presentasi"],
  "Copywriting": ["copywriting", "menulis"],
  "SEO": ["seo", "search engine optimization"],
  "Social Media": ["social media", "media sosial", "instagram", "tiktok"],
  "Video Editing": ["video editing", "premiere pro", "davinci", "after effects"],
  "Photography": ["photography", "fotografi"],
  "Branding": ["branding", "brand"],
  "UI Design": ["ui design", "ui/ux", "user interface"],
  "UX Research": ["ux research", "user experience", "usability"],
  "Wireframing": ["wireframe", "wireframing"],
  "Prototyping": ["prototyping", "prototype"],
  "Data Analysis": ["data analysis", "analisis data"],
  "Machine Learning": ["machine learning", "ml", "ai"],
  "TensorFlow": ["tensorflow"],
  "PyTorch": ["pytorch"],
  "Penetration Testing": ["penetration testing", "pentest"],
  "Network Security": ["network security", "keamanan jaringan"],
  "Linux": ["linux", "ubuntu", "centos"],
  "Customer Service": ["customer service", "pelanggan"],
};

export function extractCVFromText(text: string): ExtractedCV {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
  const phoneMatch = text.match(/(\+62|62|08)\d{8,13}/);

  const nama = extractName(lines);
  const pendidikan = extractEducation(lines);
  const pengalaman = extractExperience(lines);
  const skills = extractSkills(text);
  const proyek = extractProjects(lines);
  const sertifikasi = extractCertifications(lines);
  const organisasi = extractOrganizations(lines);
  const bahasa = extractLanguages(text);
  const summary = extractSummary(lines);

  return {
    rawText: text,
    nama,
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    lokasi: extractLocation(lines),
    summary,
    pendidikan,
    pengalaman,
    skills,
    proyek,
    sertifikasi,
    organisasi,
    bahasa,
  };
}

function extractName(lines: string[]): string | null {
  if (lines.length === 0) return null;
  const firstLine = lines[0];
  if (firstLine.length < 50 && !firstLine.includes("@") && !firstLine.match(/\d{3}/)) {
    return firstLine;
  }
  return null;
}

function extractSummary(lines: string[]): string | null {
  const summaryKeywords = ["summary", "profil", "about", "tentang", "deskripsi diri"];
  for (let i = 0; i < Math.min(lines.length, 20); i++) {
    const lower = lines[i].toLowerCase();
    if (summaryKeywords.some((k) => lower.includes(k))) {
      const nextLines = lines.slice(i + 1, i + 4);
      const summary = nextLines
        .filter((l) => l.length > 10 && !l.match(/^[A-Z][A-Z\s]+$/))
        .join(" ");
      if (summary.length > 20) return summary;
    }
  }
  return null;
}

function extractLocation(lines: string[]): string | null {
  const locationKeywords = ["lokasi", "alamat", "location", "address", "domisili"];
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (locationKeywords.some((k) => lower.includes(k))) {
      const loc = line.split(":").pop()?.trim();
      if (loc && loc.length > 3) return loc;
    }
  }
  const cities = ["jakarta", "bandung", "surabaya", "yogyakarta", "semarang", "medan", "makassar", "bandar lampung"];
  for (const line of lines) {
    const lower = line.toLowerCase();
    for (const city of cities) {
      if (lower.includes(city)) {
        return line.trim();
      }
    }
  }
  return null;
}

function extractEducation(lines: string[]): { institusi: string; jurusan: string; tahun: string }[] {
  const edu: { institusi: string; jurusan: string; tahun: string }[] = [];
  const eduKeywords = ["pendidikan", "education", "riwayat pendidikan", "educational background"];
  let startIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (eduKeywords.some((k) => lines[i].toLowerCase().includes(k))) {
      startIdx = i + 1;
      break;
    }
  }

  if (startIdx === -1) return edu;

  const endKeywords = ["pengalaman", "experience", "skill", "keahlian", "proyek", "project", "sertifikasi"];
  for (let i = startIdx; i < Math.min(startIdx + 15, lines.length); i++) {
    if (endKeywords.some((k) => lines[i].toLowerCase().includes(k))) break;
    const yearMatch = lines[i].match(/(20\d{2})\s*[-–]\s*(20\d{2}|sekarang|present|now)?/i);
    if (yearMatch || lines[i].includes("Universitas") || lines[i].includes("Institut") || lines[i].includes("SMA") || lines[i].includes("SMK")) {
      const tahun = yearMatch ? yearMatch[0] : "";
      const parts = lines[i].split(yearMatch?.[0] || "").map((s) => s.trim()).filter(Boolean);
      edu.push({
        institusi: parts[0] || lines[i],
        jurusan: parts[1] || "",
        tahun,
      });
    }
  }

  return edu.slice(0, 5);
}

function extractExperience(lines: string[]): { perusahaan: string; posisi: string; durasi: string; deskripsi: string }[] {
  const exp: { perusahaan: string; posisi: string; durasi: string; deskripsi: string }[] = [];
  const expKeywords = ["pengalaman", "experience", "riwayat kerja", "work experience"];
  let startIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (expKeywords.some((k) => lines[i].toLowerCase().includes(k))) {
      startIdx = i + 1;
      break;
    }
  }

  if (startIdx === -1) return exp;

  const endKeywords = ["pendidikan", "education", "skill", "keahlian", "proyek", "project", "sertifikasi", "organisasi"];
  let currentExp: Partial<{ perusahaan: string; posisi: string; durasi: string; deskripsi: string }> = {};

  for (let i = startIdx; i < Math.min(startIdx + 30, lines.length); i++) {
    if (endKeywords.some((k) => lines[i].toLowerCase().includes(k))) break;

    const yearMatch = lines[i].match(/(20\d{2})\s*[-–]\s*(20\d{2}|sekarang|present|now)?/i);
    if (yearMatch) {
      if (currentExp.perusahaan) {
        exp.push(currentExp as any);
      }
      currentExp = { durasi: yearMatch[0] };
      const before = lines[i].split(yearMatch[0])[0]?.trim();
      if (before) currentExp.perusahaan = before;
    } else if (lines[i].length > 5 && !currentExp.posisi) {
      currentExp.posisi = lines[i];
    } else if (lines[i].length > 10) {
      currentExp.deskripsi = (currentExp.deskripsi || "") + " " + lines[i];
    }
  }

  if (currentExp.perusahaan) {
    exp.push(currentExp as any);
  }

  return exp.slice(0, 10);
}

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const detected: string[] = [];

  for (const [skill, keywords] of Object.entries(SKILL_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      if (!detected.includes(skill)) {
        detected.push(skill);
      }
    }
  }

  return detected;
}

function extractProjects(lines: string[]): { nama: string; deskripsi: string }[] {
  const projects: { nama: string; deskripsi: string }[] = [];
  const projKeywords = ["proyek", "project", "portofolio", "portfolio"];
  let startIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (projKeywords.some((k) => lines[i].toLowerCase().includes(k))) {
      startIdx = i + 1;
      break;
    }
  }

  if (startIdx === -1) return projects;

  const endKeywords = ["sertifikasi", "certification", "organisasi", "organization", "bahasa", "language"];
  for (let i = startIdx; i < Math.min(startIdx + 15, lines.length); i++) {
    if (endKeywords.some((k) => lines[i].toLowerCase().includes(k))) break;
    if (lines[i].length > 5) {
      projects.push({ nama: lines[i], deskripsi: lines[i + 1] || "" });
    }
  }

  return projects.slice(0, 5);
}

function extractCertifications(lines: string[]): string[] {
  const certs: string[] = [];
  const certKeywords = ["sertifikasi", "certification", "certifications", "sertifikat"];
  let startIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (certKeywords.some((k) => lines[i].toLowerCase().includes(k))) {
      startIdx = i + 1;
      break;
    }
  }

  if (startIdx === -1) return certs;

  const endKeywords = ["organisasi", "organization", "bahasa", "language", "referensi"];
  for (let i = startIdx; i < Math.min(startIdx + 10, lines.length); i++) {
    if (endKeywords.some((k) => lines[i].toLowerCase().includes(k))) break;
    if (lines[i].length > 3) certs.push(lines[i]);
  }

  return certs.slice(0, 10);
}

function extractOrganizations(lines: string[]): string[] {
  const orgs: string[] = [];
  const orgKeywords = ["organisasi", "organization", "kegiatan", "pengalaman organisasi"];
  let startIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (orgKeywords.some((k) => lines[i].toLowerCase().includes(k))) {
      startIdx = i + 1;
      break;
    }
  }

  if (startIdx === -1) return orgs;

  const endKeywords = ["bahasa", "language", "referensi", "reference"];
  for (let i = startIdx; i < Math.min(startIdx + 10, lines.length); i++) {
    if (endKeywords.some((k) => lines[i].toLowerCase().includes(k))) break;
    if (lines[i].length > 3) orgs.push(lines[i]);
  }

  return orgs.slice(0, 10);
}

function extractLanguages(text: string): string[] {
  const langs: string[] = [];
  const commonLangs = ["inggris", "english", "mandarin", "china", "jepang", "japanese", "korea", "korean", "arab", "arabic", "jerman", "german", "prancis", "french", "spanish", "spanyol"];
  const lower = text.toLowerCase();

  for (const lang of commonLangs) {
    if (lower.includes(lang)) {
      langs.push(lang.charAt(0).toUpperCase() + lang.slice(1));
    }
  }

  if (lower.includes("indonesia") || lower.includes("bahasa lokal")) {
    langs.push("Indonesia");
  }

  return [...new Set(langs)];
}

export function analyzeCVLocally(extracted: ExtractedCV): CVAnalysisResult {
  let structure = 50;
  let readability = 50;
  let skillRelevance = 50;
  let experience = 50;
  let completeness = 50;

  if (extracted.nama) structure += 10;
  if (extracted.email) structure += 5;
  if (extracted.phone) structure += 5;
  if (extracted.lokasi) structure += 5;
  if (extracted.summary) { structure += 10; readability += 10; }

  if (extracted.skills.length > 3) skillRelevance += 20;
  else if (extracted.skills.length > 0) skillRelevance += 10;

  if (extracted.pengalaman.length > 0) experience += 15;
  if (extracted.pengalaman.length > 2) experience += 10;
  if (extracted.pengalaman.some((p) => p.deskripsi.length > 20)) experience += 10;

  if (extracted.pendidikan.length > 0) completeness += 10;
  if (extracted.proyek.length > 0) completeness += 10;
  if (extracted.sertifikasi.length > 0) completeness += 5;
  if (extracted.organisasi.length > 0) completeness += 5;

  const totalWords = extracted.rawText.split(/\s+/).length;
  if (totalWords > 200) readability += 10;
  if (totalWords > 500) readability += 10;

  structure = Math.min(structure, 100);
  readability = Math.min(readability, 100);
  skillRelevance = Math.min(skillRelevance, 100);
  experience = Math.min(experience, 100);
  completeness = Math.min(completeness, 100);

  const score = Math.round(
    structure * 0.2 +
    readability * 0.2 +
    skillRelevance * 0.25 +
    experience * 0.2 +
    completeness * 0.15
  );

  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendations: string[] = [];

  if (extracted.nama) strengths.push("Identitas nama sudah tersedia");
  if (extracted.email) strengths.push("Email contact sudah tercantum");
  if (extracted.summary) strengths.push("Summary/profil sudah ada");
  if (extracted.skills.length > 3) strengths.push("Cukup banyak skill yang terdeteksi");
  if (extracted.pengalaman.length > 0) strengths.push("Pengalaman kerja tercantum");

  if (!extracted.summary) improvements.push("Belum ada summary/profil singkat");
  if (extracted.skills.length < 3) improvements.push("Skill yang terdeteksi masih sedikit");
  if (extracted.pengalaman.length === 0) improvements.push("Belum ada pengalaman kerja yang terdeteksi");
  if (extracted.proyek.length === 0) improvements.push("Belum ada proyek yang tercantum");

  if (!extracted.summary) recommendations.push("Tambahkan ringkasan profil di bagian atas CV.");
  if (extracted.pengalaman.length > 0 && !extracted.pengalaman.some((p) => p.deskripsi.length > 30)) {
    recommendations.push("Buat deskripsi pengalaman lebih detail dengan pencapaian konkret.");
  }
  if (extracted.skills.length < 5) recommendations.push("Perluas daftar skill yang relevan dengan bidang yang diminati.");
  recommendations.push("Gunakan format bullet point yang konsisten untuk keterbacaan.");

  return {
    score,
    sections: { structure, readability, skillRelevance, experience, completeness },
    detectedSkills: extracted.skills,
    missingSkills: [],
    strengths,
    improvements,
    recommendations,
  };
}

export function matchCVToJob(extracted: ExtractedCV, jobSkills: string[]): CVJobMatch {
  const cvSkillsLower = extracted.skills.map((s) => s.toLowerCase());
  const matched = jobSkills.filter((s) => cvSkillsLower.includes(s.toLowerCase()));
  const missing = jobSkills.filter((s) => !cvSkillsLower.includes(s.toLowerCase()));

  const skillMatch = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 50;

  const fullText = extracted.rawText.toLowerCase();
  const keywordHits = jobSkills.filter((s) => fullText.includes(s.toLowerCase()));
  const keywordRelevance = jobSkills.length > 0 ? Math.round((keywordHits.length / jobSkills.length) * 100) : 50;

  const experienceRelevance = extracted.pengalaman.length > 0 ? 70 : 30;

  const matchScore = Math.round(skillMatch * 0.5 + keywordRelevance * 0.3 + experienceRelevance * 0.2);

  return {
    jobId: "",
    matchScore,
    skillMatch,
    keywordRelevance,
    experienceRelevance,
    matchedSkills: matched,
    missingSkills: missing,
    summary: "",
  };
}
