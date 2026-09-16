import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractCVFromText, analyzeCVLocally, matchCVToJob } from "@/services/ai-cv";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cvText, userProfile, targetJob } = body;

    if (!cvText || typeof cvText !== "string" || cvText.trim().length < 10) {
      return NextResponse.json({ error: "CV text tidak valid atau terlalu pendek." }, { status: 400 });
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
    return NextResponse.json({ error: "Gagal menganalisis CV." }, { status: 500 });
  }
}
