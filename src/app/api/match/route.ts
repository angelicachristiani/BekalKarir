import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculateFallbackMatch } from '@/services/ai-matching';

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
    const { userProfile, job } = body;

    if (!userProfile || !job) {
      return NextResponse.json({ error: 'Missing userProfile or job' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Use Fallback if no API key is provided
    if (!apiKey) {
      const fallbackResult = calculateFallbackMatch(userProfile, job);
      return NextResponse.json(fallbackResult);
    }

    // Use Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Anda adalah AI Career Matchmaker profesional. Tugas Anda adalah memberikan skor kecocokan antara profil kandidat dan pekerjaan, dan memberikan penjelasannya.

      Profil Kandidat:
      ${JSON.stringify(userProfile, null, 2)}

      Lowongan Pekerjaan:
      ${JSON.stringify(job, null, 2)}

      Tugas:
      1. Berikan skor kecocokan untuk 5 aspek:
         - skill (0-100) (bobot 40%)
         - location (0-100) (bobot 20%)
         - salary (0-100) (bobot 15%)
         - experience (0-100) (bobot 15%)
         - preference (0-100) (bobot 10%)
      2. Hitung totalScore berdasarkan bobot di atas.
      3. Tentukan skill apa saja dari lowongan yang SUDAH dimiliki kandidat (matchedSkills).
      4. Tentukan skill apa saja dari lowongan yang BELUM dimiliki kandidat (missingSkills).
      5. Berikan alasan kenapa cocok (whyMatch, berupa array string penjelasan, maks 4).
      6. Berikan skill yang masih kurang (whatIsMissing, array string skill).
      7. Berikan satu saran konstruktif (suggestion).

      Pastikan memberikan output murni dalam format JSON (tanpa tag markdown \`\`\`json) dengan struktur yang sama persis seperti fallback ini:
      {
        "totalScore": 85,
        "breakdown": {
          "skill": 80,
          "location": 100,
          "salary": 90,
          "experience": 70,
          "preference": 100
        },
        "matchedSkills": ["React.js", "HTML"],
        "missingSkills": ["Tailwind"],
        "explanation": {
          "whyMatch": ["Gaji sesuai ekspektasi", "Pengalaman sesuai"],
          "whatIsMissing": ["Tailwind"],
          "suggestion": "Pelajari Tailwind agar lebih siap!"
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown formatting
    let cleanJson = text;
    if (text.includes('```json')) {
      cleanJson = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      cleanJson = text.split('```')[1].split('```')[0].trim();
    }

    const jsonResult = JSON.parse(cleanJson);
    return NextResponse.json(jsonResult);

  } catch (error) {
    // If AI fails for any reason, gracefully fallback to deterministic matching
    if (body?.userProfile && body?.job) {
      const fallbackResult = calculateFallbackMatch(body.userProfile, body.job);
      return NextResponse.json(fallbackResult);
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
