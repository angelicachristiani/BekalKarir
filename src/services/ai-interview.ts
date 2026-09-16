import type {
  InterviewQuestion,
  InterviewFeedback,
  InterviewType,
  GenerateRequest,
} from "@/types/interview";

function generateId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const QUESTION_BANK: Record<
  string,
  Record<InterviewType, { question: string; category: string; skill?: string; expectsStar?: boolean }[]>
> = {
  "Junior Web Developer": {
    hr: [
      { question: "Ceritakan tentang dirimu dan mengapa kamu tertarik dengan posisi Junior Web Developer ini.", category: "introduction" },
      { question: "Apa yang memotivasimu untuk berkarir di bidang web development?", category: "motivation" },
      { question: "Ceritakan pengalaman proyek web pertama yang pernah kamu kerjakan.", category: "experience", skill: "Problem Solving" },
      { question: "Bagaimana kamu menangani deadline yang ketat saat mengerjakan proyek?", category: "behavioral", expectsStar: true },
      { question: "Di mana kamu melihat dirimu dalam 3 tahun ke depan di bidang ini?", category: "closing" },
    ],
    technical: [
      { question: "Bagaimana kamu memastikan tampilan website tetap responsif di berbagai ukuran layar?", category: "technical", skill: "CSS" },
      { question: "Ceritakan tentang React. Apa yang membuat React berbedan dari library lain?", category: "technical", skill: "React.js" },
      { question: "Apa itu Virtual DOM dan mengapa React menggunakannya?", category: "technical", skill: "React.js" },
      { question: "Bagaimana cara menangani state management dalam aplikasi React yang cukup kompleks?", category: "technical", skill: "React.js" },
      { question: "Bagaimana kamu memastikan website yang kamu bangun accessible?", category: "technical", skill: "HTML" },
    ],
    mixed: [
      { question: "Ceritakan tentang dirimu dan mengapa tertarik dengan posisi ini.", category: "introduction" },
      { question: "Ceritakan pengalaman proyek web yang paling kamu banggakan.", category: "experience", skill: "React.js" },
      { question: "Bagaimana kamu memastikan website tetap responsif di berbagai ukuran layar?", category: "technical", skill: "CSS" },
      { question: "Bagaimana kamu menangani konflik dalam tim saat mengerjakan proyek?", category: "behavioral", expectsStar: true },
      { question: "Apa tantangan terbesar yang pernah kamu hadapi dalam proyek web dan bagaimana kamu mengatasinya?", category: "behavioral", expectsStar: true },
      { question: "Skill apa yang ingin kamu kuasai dalam 6 bulan ke depan?", category: "closing" },
    ],
  },
  "Frontend Developer": {
    hr: [
      { question: "Ceritakan tentang pengalaman kerja kamu di bidang frontend development.", category: "introduction" },
      { question: "Mengapa kamu tertarik bergabung dengan perusahaan kami?", category: "motivation" },
      { question: "Ceritakan situasi ketika kamu harus mempelajari teknologi baru dengan cepat.", category: "experience", skill: "Problem Solving" },
      { question: "Bagaimana kamu memprioritaskan fitur saat mengerjakan sprint?", category: "behavioral", expectsStar: true },
      { question: "Apa pendapatmu tentang clean code dan best practices di frontend?", category: "closing" },
    ],
    technical: [
      { question: "Jelaskan perbedaan antara CSS Grid dan Flexbox. Kapan kamu menggunakan masing-masing?", category: "technical", skill: "Tailwind" },
      { question: "Bagaimana kamu mengoptimalkan performa aplikasi React?", category: "technical", skill: "React.js" },
      { question: "Apa itu TypeScript dan mengapa penting untuk project frontend?", category: "technical", skill: "TypeScript" },
      { question: "Ceritakan tentang state management yang pernah kamu gunakan (Redux, Zustand, dll).", category: "technical", skill: "Redux" },
      { question: "Bagaimana kamu melakukan testing pada komponen frontend?", category: "technical", skill: "React.js" },
    ],
    mixed: [
      { question: "Ceritakan latar belakang dan pengalaman kamu di frontend.", category: "introduction" },
      { question: "Bagaimana kamu mengoptimalkan performa aplikasi React?", category: "technical", skill: "React.js" },
      { question: "Ceritakan pengalaman kamu bekerja dengan designer.", category: "behavioral", expectsStar: true },
      { question: "Apa pendapatmu tentang Tailwind CSS dibanding CSS biasa?", category: "technical", skill: "Tailwind" },
      { question: "Bagaimana kamu menangani feedback dari code review?", category: "behavioral", expectsStar: true },
      { question: "Apa tantangan terbesar di frontend yang pernah kamu hadapi?", category: "experience", skill: "React.js" },
      { question: "Skill apa yang ingin kamu kembangkan selanjutnya?", category: "closing" },
    ],
  },
  "Backend Developer": {
    hr: [
      { question: "Ceritakan tentang pengalaman backend development kamu.", category: "introduction" },
      { question: "Mengapa kamu tertarik dengan posisi Backend Developer ini?", category: "motivation" },
      { question: "Ceritakan proyek backend terbesar yang pernah kamu kerjakan.", category: "experience", skill: "Node.js" },
      { question: "Bagaimana kamu menangani situasi ketika production server down?", category: "behavioral", expectsStar: true },
      { question: "Apa pendapatmu tentang microservices vs monolith?", category: "closing" },
    ],
    technical: [
      { question: "Jelaskan bagaimana kamu mendesain database schema untuk aplikasi e-commerce.", category: "technical", skill: "PostgreSQL" },
      { question: "Apa itu RESTful API? Bagaimana kamu mendesain endpoint yang baik?", category: "technical", skill: "API Design" },
      { question: "Bagaimana kamu menangani authentication dan authorization?", category: "technical", skill: "Node.js" },
      { question: "Apa perbedaan SQL dan NoSQL? Kapan kamu menggunakan masing-masing?", category: "technical", skill: "PostgreSQL" },
      { question: "Bagaimana kamu melakukan optimasi query database yang lambat?", category: "technical", skill: "PostgreSQL" },
    ],
    mixed: [
      { question: "Ceritakan latar belakang dan pengalaman backend kamu.", category: "introduction" },
      { question: "Bagaimana kamu mendesain API yang scalable?", category: "technical", skill: "API Design" },
      { question: "Ceritakan situasi ketika kamu harus menyelesaikan bug kritis.", category: "behavioral", expectsStar: true },
      { question: "Bagaimana kamu menangani rate limiting pada API?", category: "technical", skill: "Node.js" },
      { question: "Ceritakan pengalaman kamu bekerja dengan Docker.", category: "technical", skill: "Docker" },
      { question: "Bagaimana kamu memastikan keamanan API dari serangan umum?", category: "technical", skill: "API Design" },
      { question: "Apa yang membuatmu cocok untuk tim backend kami?", category: "closing" },
    ],
  },
  "Data Analyst": {
    hr: [
      { question: "Ceritakan tentang latar belakang dan pengalaman kamu di bidang data analysis.", category: "introduction" },
      { question: "Mengapa kamu tertarik dengan posisi Data Analyst ini?", category: "motivation" },
      { question: "Ceritakan proyek analisis data yang paling menantang.", category: "experience", skill: "SQL" },
      { question: "Bagaimana kamu menjelaskan temuan data kepada stakeholder non-teknis?", category: "behavioral", expectsStar: true },
      { question: "Bagaimana kamu mengikuti perkembangan terbaru di bidang data?", category: "closing" },
    ],
    technical: [
      { question: "Bagaimana kamu memastikan data yang kamu gunakan dapat dipercaya?", category: "technical", skill: "SQL" },
      { question: "Ceritakan tentang pengalaman kamu menggunakan SQL untuk query kompleks.", category: "technical", skill: "SQL" },
      { question: "Bagaimana kamu menangani data yang memiliki missing values?", category: "technical", skill: "Python" },
      { question: "Apa metrik yang paling penting untuk dashboard penjualan?", category: "technical", skill: "Data Visualization" },
      { question: "Bagaimana kamu memilih visualisasi yang tepat untuk data tertentu?", category: "technical", skill: "Tableau" },
    ],
    mixed: [
      { question: "Ceritakan tentang latar belakang dan pengalaman kamu di data.", category: "introduction" },
      { question: "Bagaimana kamu memastikan kualitas data sebelum dianalisis?", category: "technical", skill: "SQL" },
      { question: "Ceritakan pengalaman kamu menyampaikan insight data kepada tim.", category: "behavioral", expectsStar: true },
      { question: "Apa perbedaan antara descriptive dan inferential statistics?", category: "technical", skill: "Python" },
      { question: "Bagaimana kamu memprioritaskan analisis ketika ada banyak request?", category: "behavioral", expectsStar: true },
      { question: "Bagaimana kamu menangani data yang tidak konsisten?", category: "technical", skill: "SQL" },
      { question: "Apa tantangan terbesar yang pernah kamu hadapi di bidang data?", category: "closing" },
    ],
  },
  "UI/UX Designer": {
    hr: [
      { question: "Ceritakan tentang perjalanan karir kamu di bidang desain.", category: "introduction" },
      { question: "Mengapa kamu tertarik dengan posisi UI/UX Designer ini?", category: "motivation" },
      { question: "Ceritakan desain yang paling kamu banggakan dan mengapa.", category: "experience", skill: "Figma" },
      { question: "Bagaimana kamu menangani feedback yang bertolak belakang dari stakeholder?", category: "behavioral", expectsStar: true },
      { question: "Bagaimana pendekatan kamu terhadap desain yang berpusat pada pengguna?", category: "closing" },
    ],
    technical: [
      { question: "Ceritakan workflow desain kamu dari brief hingga final delivery.", category: "technical", skill: "Figma" },
      { question: "Bagaimana kamu melakukan usability testing?", category: "technical", skill: "UX Research" },
      { question: "Apa perbedaan UI Design dan UX Design menurutmu?", category: "technical", skill: "UI Design" },
      { question: "Bagaimana kamu mendesain untuk accessibility?", category: "technical", skill: "UI Design" },
      { question: "Bagaimana kamu mengelola design system?", category: "technical", skill: "Prototyping" },
    ],
    mixed: [
      { question: "Ceritakan tentang perjalanan karir kamu di desain.", category: "introduction" },
      { question: "Ceritakan pendekatan kamu dalam UX Research.", category: "technical", skill: "UX Research" },
      { question: "Bagaimana kamu menangani feedback desain yang sulit dari pengguna?", category: "behavioral", expectsStar: true },
      { question: "Bagaimana kamu memastikan desain yang kamu buat accessible?", category: "technical", skill: "UI Design" },
      { question: "Ceritakan pengalaman kamu bekerja dengan developer.", category: "behavioral", expectsStar: true },
      { question: "Tools apa yang kamu gunakan dan mengapa?", category: "technical", skill: "Figma" },
      { question: "Apa tren desain yang menurutmu penting untuk dikuasai?", category: "closing" },
    ],
  },
};

const GENERIC_QUESTIONS: Record<InterviewType, { question: string; category: string }[]> = {
  hr: [
    { question: "Ceritakan tentang dirimu.", category: "introduction" },
    { question: "Mengapa kamu tertarik dengan posisi ini?", category: "motivation" },
    { question: "Apa kelebihan dan kelemahan kamu?", category: "experience" },
    { question: "Ceritakan situasi ketika kamu harus bekerja di bawah tekanan.", category: "behavioral" },
    { question: "Di mana kamu melihat dirimu dalam 3 tahun?", category: "closing" },
  ],
  technical: [
    { question: "Ceritakan tentang skill teknis yang paling kamu kuasai.", category: "technical" },
    { question: "Bagaimana kamu mempelajari teknologi baru?", category: "technical" },
    { question: "Ceritakan proyek teknis yang pernah kamu kerjakan.", category: "technical" },
    { question: "Bagaimana kamu debugging ketika menghadapi masalah yang sulit?", category: "technical" },
    { question: "Apa best practice yang selalu kamu terapkan?", category: "technical" },
  ],
  mixed: [
    { question: "Ceritakan tentang dirimu.", category: "introduction" },
    { question: "Ceritakan proyek yang paling kamu banggakan.", category: "experience" },
    { question: "Bagaimana skill kamu relevan dengan posisi ini?", category: "technical" },
    { question: "Ceritakan pengalaman bekerja dalam tim.", category: "behavioral" },
    { question: "Mengapa kami harus memilih kamu?", category: "closing" },
  ],
};

export function getQuestionsForJob(
  jobTitle: string,
  interviewType: InterviewType,
  count: number = 6
): InterviewQuestion[] {
  const bank = QUESTION_BANK[jobTitle];
  const questions = bank ? bank[interviewType] : GENERIC_QUESTIONS[interviewType];

  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((q, i) => ({
    id: generateId(),
    question: q.question,
    type: interviewType === "mixed" && (q.category === "technical" || q.category === "hr" || q.category === "behavioral")
      ? (q.category === "technical" ? "technical" : "hr")
      : interviewType === "technical" ? "technical" : "hr",
    category: q.category,
    expectsStar: "expectsStar" in q ? (q as any).expectsStar : q.category === "behavioral",
    skill: "skill" in q ? (q as any).skill : undefined,
  }));
}

export function generateMockFeedback(
  answers: { question: string; answer: string }[],
  interviewType: InterviewType
): InterviewFeedback {
  const totalWords = answers.reduce((sum, a) => sum + a.answer.split(" ").length, 0);
  const avgWords = totalWords / Math.max(answers.length, 1);

  let relevance = 60;
  let structure = 55;
  let communication = 65;
  let clarity = 60;
  let examples = 50;

  if (avgWords > 20) relevance += 10;
  if (avgWords > 40) relevance += 10;
  if (avgWords > 60) clarity += 10;

  const hasStar = answers.some(
    (a) =>
      a.answer.toLowerCase().includes("ketika") ||
      a.answer.toLowerCase().includes("saat itu") ||
      a.answer.toLowerCase().includes("saya bertanggung jawab") ||
      a.answer.toLowerCase().includes("hasilnya")
  );
  if (hasStar) structure += 15;

  const hasExamples = answers.some(
    (a) =>
      a.answer.toLowerCase().includes("contoh") ||
      a.answer.toLowerCase().includes("proyek") ||
      a.answer.toLowerCase().includes("pengalaman") ||
      a.answer.split(" ").length > 50
  );
  if (hasExamples) examples += 20;

  const hasDetail = answers.some((a) => a.answer.split(" ").length > 40);
  if (hasDetail) communication += 10;

  const wordVariety = new Set(
    answers.flatMap((a) => a.answer.toLowerCase().split(" "))
  ).size;
  if (wordVariety > 100) clarity += 5;

  relevance = Math.min(relevance, 100);
  structure = Math.min(structure, 100);
  communication = Math.min(communication, 100);
  clarity = Math.min(clarity, 100);
  examples = Math.min(examples, 100);

  const score = Math.round(
    relevance * 0.25 +
    structure * 0.2 +
    communication * 0.2 +
    clarity * 0.2 +
    examples * 0.15
  );

  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendations: string[] = [];

  if (relevance >= 70) strengths.push("Jawaban relevan dengan posisi yang dilamar");
  if (structure >= 70) strengths.push("Struktur jawaban sudah cukup baik");
  if (communication >= 70) strengths.push("Komunikasi jelas dan terstruktur");
  if (clarity >= 70) strengths.push("Pesan tersampaikan dengan jelas");
  if (examples >= 70) strengths.push("Memberikan contoh nyata dari pengalaman");

  if (relevance < 70) improvements.push("Jawaban perlu lebih relevan dengan posisi");
  if (structure < 70) improvements.push("Perluas struktur jawaban dengan metode STAR");
  if (communication < 70) improvements.push("Tingkatkan kejelasan komunikasi");
  if (clarity < 70) improvements.push("Jelaskan poin-poin penting dengan lebih spesifik");
  if (examples < 70) improvements.push("Tambahkan contoh konkret dari pengalaman");

  if (structure < 70) recommendations.push("Gunakan metode STAR saat menjawab pertanyaan behavioral.");
  if (examples < 70) recommendations.push("Siapkan 2-3 contoh proyek sebelum interview.");
  if (relevance < 70) recommendations.push("Pelajari job description dan sesuaikan jawaban dengan kebutuhan perusahaan.");
  if (communication < 70) recommendations.push("Latihan menjawab dengan percaya diri dan terstruktur.");
  recommendations.push("Tunjukkan antusiasme terhadap posisi dan perusahaan.");

  return {
    score,
    relevance,
    structure,
    communication,
    clarity,
    examples,
    starAnalysis: {
      situation: hasStar,
      task: hasStar,
      action: hasExamples,
      result: hasDetail,
    },
    strengths: strengths.length > 0 ? strengths : ["Pertumbuhan positif dalam menjawab"],
    improvements: improvements.length > 0 ? improvements : ["Pertahankan kualitas jawaban"],
    recommendations,
  };
}

export async function generateAIInterview(
  request: GenerateRequest
): Promise<{ questions?: InterviewQuestion[]; question?: InterviewQuestion; feedback?: InterviewFeedback }> {
  try {
    const res = await fetch("/api/interview/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    return data;
  } catch {
    if (request.mode === "initial") {
      const questions = getQuestionsForJob(
        request.job.title,
        request.interviewType,
        request.questionCount || 6
      );
      return { questions };
    }

    if (request.mode === "feedback") {
      const answers = (request.previousAnswers || []).map((a, i) => ({
        question: request.previousQuestions?.[i] || "",
        answer: a,
      }));
      const feedback = generateMockFeedback(answers, request.interviewType);
      return { feedback };
    }

    if (request.mode === "follow-up") {
      const followUps = [
        "Bisa jelaskan lebih detail tentang hal itu?",
        "Bagaimana hasil dari tindakan yang kamu ambil?",
        "Apa tantangan terbesar yang kamu hadapi?",
        "Contoh konkret dari pengalaman itu?",
        "Apa pelajaran terbesar dari situasi itu?",
      ];
      const followUpQ: InterviewQuestion = {
        id: `q-${Date.now()}-followup`,
        question: followUps[Math.floor(Math.random() * followUps.length)],
        type: "follow-up",
        category: "follow-up",
      };
      return { question: followUpQ };
    }

    return {};
  }
}
