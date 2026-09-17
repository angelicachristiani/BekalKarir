import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractCVFromText, analyzeCVLocally, matchCVToJob } from "@/services/ai-cv";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let cvText: string | null = null;
    let userProfile: any = null;
    let targetJob: { title: string; skills: string[] } | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "File CV tidak ditemukan." }, { status: 400 });
      }

      if (file.type !== "application/pdf") {
        return NextResponse.json({ error: "Hanya file PDF yang dapat dianalisis." }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "Ukuran CV maksimal 5MB." }, { status: 400 });
      }

      const profileStr = formData.get("userProfile");
      if (profileStr && typeof profileStr === "string") {
        try { userProfile = JSON.parse(profileStr); } catch {}
      }

      const targetJobStr = formData.get("targetJob");
      if (targetJobStr && typeof targetJobStr === "string") {
        try { targetJob = JSON.parse(targetJobStr); } catch {}
      }

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      let parser: PDFParse | null = null;
      try {
        parser = new PDFParse({ data: uint8Array });
        const textResult = await parser.getText();
        cvText = textResult.text || "";
      } finally {
        if (parser) {
          try { await parser.destroy(); } catch {}
        }
      }

      if (!cvText || cvText.trim().length < 10) {
        return NextResponse.json(
          { error: "PDF tidak dapat dibaca. Pastikan file memiliki teks yang dapat diseleksi." },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Format request tidak valid." },
        { status: 400 }
      );
    }

    const extracted = extractCVFromText(cvText);

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const localAnalysis = analyzeCVLocally(extracted);
      const jobMatch = targetJob ? matchCVToJob(extracted, targetJob.skills || []) : null;
      return NextResponse.json({ extracted, analysis: localAnalysis, jobMatch });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Anda adalah AI Career Advisor profesional. Analisis CV berikut dan berikan evaluasi.

Isi CV:
${cvText.substring(0, 3000)}

${userProfile ? `Profil Karir Pengguna:
Nama: ${userProfile.nama || "-"}
Skill: ${userProfile.skills?.map((s: any) => s.nama).join(", ") || "-"}
Bidang: ${userProfile.bidang_karir || "-"}` : ""}

${targetJob ? `Target Pekerjaan:
${targetJob.title}
Skill dibutuhkan: ${targetJob.skills?.join(", ") || "-"}` : ""}

Berikan output JSON murni tanpa markdown:
{
  "score": 84,
  "sections": {
    "structure": 90,
    "readability": 88,
    "skillRelevance": 79,
    "experience": 81,
    "completeness": 82
  },
  "detectedSkills": ["Skill1", "Skill2"],
  "missingSkills": ["Skill3"],
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

Skor harus realistis berdasarkan kualitas CV. Gunakan Bahasa Indonesia.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.includes("```json")
        ? text.split("```json")[1].split("```")[0].trim()
        : text.includes("```")
          ? text.split("```")[1].split("```")[0].trim()
          : text.trim();

      const aiAnalysis = JSON.parse(cleaned);
      const jobMatch = targetJob ? matchCVToJob(extracted, targetJob.skills || []) : null;

      return NextResponse.json({ extracted, analysis: aiAnalysis, jobMatch });
    } catch (aiError) {
      console.error("Gemini CV analysis error, falling back to local:", aiError);
      const localAnalysis = analyzeCVLocally(extracted);
      const jobMatch = targetJob ? matchCVToJob(extracted, targetJob.skills || []) : null;
      return NextResponse.json({ extracted, analysis: localAnalysis, jobMatch });
    }
  } catch (error) {
    console.error("CV analysis error:", error);
    return NextResponse.json({ error: "Gagal memproses CV. Silakan coba lagi." }, { status: 500 });
  }
}
