import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getQuestionsForJob, generateMockFeedback } from "@/services/ai-interview";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { job, userProfile, interviewType, previousQuestions, previousAnswers, mode, questionCount } = body;

    if (!job || !interviewType || !mode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return handleFallback(job, userProfile, interviewType, previousQuestions, previousAnswers, mode, questionCount);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      if (mode === "initial") {
        const prompt = `Anda adalah AI interviewer profesional. Buatlah ${questionCount || 6} pertanyaan interview untuk posisi "${job.title}" di ${job.company}.

Deskripsi Pekerjaan:
${job.description}

Skill yang dibutuhkan: ${job.skills.join(", ")}

Profil Kandidat:
Nama: ${userProfile?.nama || "Kandidat"}
Skill: ${userProfile?.skills?.map((s: any) => `${s.nama} (${s.level})`).join(", ") || "Tidak diketahui"}

Tipe Interview: ${interviewType === "hr" ? "HR" : interviewType === "technical" ? "Teknis" : "Campuran"}

Pertanyaan harus:
1. Relevan dengan posisi dan deskripsi pekerjaan
2. Bervariasi (pendidikan, pengalaman, teknis, behavioral)
3. Menguji kemampuan kandidat secara komprehensif
4. Dalam Bahasa Indonesia

Output JSON murni tanpa markdown:
{
  "questions": [
    {
      "id": "q1",
      "question": "Pertanyaan...",
      "type": "hr",
      "category": "introduction",
      "expectsStar": false,
      "skill": "SkillName atau null"
    }
  ]
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = cleanJson(text);
        const parsed = JSON.parse(cleaned);

        const questions = (parsed.questions || []).map((q: any, i: number) => ({
          id: `q-${Date.now()}-${i}`,
          question: q.question,
          type: q.type || "hr",
          category: q.category || "general",
          expectsStar: q.expectsStar || false,
          skill: q.skill || undefined,
        }));

        return NextResponse.json({ questions });
      }

      if (mode === "follow-up") {
        const prompt = `Anda adalah AI interviewer. Kandidat baru saja menjawab pertanyaan interview.

Pertanyaan: ${previousQuestions?.[previousQuestions.length - 1] || ""}
Jawaban: ${previousAnswers?.[previousAnswers.length - 1] || ""}
Posisi: ${job.title}

Buatlah 1 pertanyaan follow-up yang relevan dengan jawaban kandidat.
Jika jawaban sudah cukup baik, buat pertanyaan baru untuk topik berikutnya.
Jika jawaban terlalu singkat, minta elaborasi.

Output JSON murni:
{
  "question": "Pertanyaan follow-up...",
  "type": "follow-up"
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = cleanJson(text);
        const parsed = JSON.parse(cleaned);

        return NextResponse.json({
          question: {
            id: `q-${Date.now()}-followup`,
            question: parsed.question,
            type: parsed.type || "follow-up",
            category: "follow-up",
          },
        });
      }

      if (mode === "feedback") {
        const qaPairs = (previousQuestions || []).map((q: string, i: number) => `P${i + 1}. ${q}\nJ: ${previousAnswers?.[i] || "Tidak dijawab"}`).join("\n\n");

        const prompt = `Anda adalah AI interviewer profesional. Berikan evaluasi interview untuk kandidat.

Posisi: ${job.title} di ${job.company}
Tipe Interview: ${interviewType}

Pertanyaan dan Jawaban:
${qaPairs}

Berikan evaluasi dalam JSON:
{
  "score": 82,
  "relevance": 88,
  "structure": 76,
  "communication": 84,
  "clarity": 89,
  "examples": 78,
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

Skor harus realistis berdasarkan kualitas jawaban. Gunakan Bahasa Indonesia.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = cleanJson(text);
        const parsed = JSON.parse(cleaned);

        return NextResponse.json({ feedback: parsed });
      }
    } catch (aiError) {
      console.error("Gemini API error, falling back to mock:", aiError);
      return handleFallback(job, userProfile, interviewType, previousQuestions, previousAnswers, mode, questionCount);
    }
  } catch (error) {
    console.error("Interview generate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function handleFallback(
  job: any,
  userProfile: any,
  interviewType: string,
  previousQuestions: string[] | undefined,
  previousAnswers: string[] | undefined,
  mode: string,
  questionCount?: number
) {
  if (mode === "initial") {
    const questions = getQuestionsForJob(job.title, interviewType as any, questionCount || 6);
    return NextResponse.json({ questions });
  }

  if (mode === "follow-up") {
    const followUps = [
      "Bisa jelaskan lebih detail tentang hal itu?",
      "Bagaimana hasil dari tindakan yang kamu ambil?",
      "Apa tantangan terbesar yang kamu hadapi?",
      "Contoh konkret dari pengalaman itu?",
      "Apa pelajaran terbesar dari situasi itu?",
    ];
    return NextResponse.json({
      question: {
        id: `q-${Date.now()}-followup`,
        question: followUps[Math.floor(Math.random() * followUps.length)],
        type: "follow-up",
        category: "follow-up",
      },
    });
  }

  if (mode === "feedback") {
    const answers = (previousQuestions || []).map((q, i) => ({
      question: q,
      answer: previousAnswers?.[i] || "",
    }));
    const feedback = generateMockFeedback(answers, interviewType as any);
    return NextResponse.json({ feedback });
  }

  return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
}

function cleanJson(text: string): string {
  if (text.includes("```json")) {
    return text.split("```json")[1].split("```")[0].trim();
  }
  if (text.includes("```")) {
    return text.split("```")[1].split("```")[0].trim();
  }
  return text.trim();
}
