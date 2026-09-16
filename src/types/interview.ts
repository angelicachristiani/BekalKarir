import { z } from "zod";

export type InterviewType = "hr" | "technical" | "mixed";

export type InterviewState =
  | "preparing"
  | "ai-thinking"
  | "ai-speaking"
  | "waiting-answer"
  | "user-speaking"
  | "analyzing"
  | "finished";

export type QuestionCategory =
  | "introduction"
  | "motivation"
  | "experience"
  | "role-specific"
  | "technical"
  | "behavioral"
  | "closing";

export const InterviewQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.enum(["hr", "technical", "follow-up"]),
  category: z.string().optional(),
  expectsStar: z.boolean().optional(),
  skill: z.string().optional(),
});

export type InterviewQuestion = z.infer<typeof InterviewQuestionSchema>;

export const InterviewAnswerSchema = z.object({
  questionId: z.string(),
  transcript: z.string(),
  duration: z.number(),
});

export type InterviewAnswer = z.infer<typeof InterviewAnswerSchema>;

export const InterviewFeedbackSchema = z.object({
  score: z.number().min(0).max(100),
  relevance: z.number().min(0).max(100),
  structure: z.number().min(0).max(100),
  communication: z.number().min(0).max(100),
  clarity: z.number().min(0).max(100),
  examples: z.number().min(0).max(100),
  starAnalysis: z
    .object({
      situation: z.boolean().optional(),
      task: z.boolean().optional(),
      action: z.boolean().optional(),
      result: z.boolean().optional(),
    })
    .optional(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export type InterviewFeedback = z.infer<typeof InterviewFeedbackSchema>;

export interface InterviewResult {
  id: string;
  jobId: string;
  jobTitle: string;
  interviewType: InterviewType;
  date: string;
  score: number;
  feedback: InterviewFeedback;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  recommendations: string[];
}

export interface InterviewSession {
  jobId: string;
  interviewType: InterviewType;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  currentState: InterviewState;
  currentQuestionIndex: number;
}

export const GenerateRequestSchema = z.object({
  job: z.object({
    id: z.string(),
    title: z.string(),
    company: z.string(),
    description: z.string(),
    skills: z.array(z.string()),
  }),
  userProfile: z.object({
    nama: z.string(),
    skills: z.array(z.object({ nama: z.string(), level: z.string() })).optional(),
    pengalaman: z.array(z.object({ perusahaan: z.string(), posisi: z.string(), durasi: z.string() })).optional(),
    bidang_karir: z.string().optional(),
  }),
  interviewType: z.enum(["hr", "technical", "mixed"]),
  previousQuestions: z.array(z.string()).optional(),
  previousAnswers: z.array(z.string()).optional(),
  mode: z.enum(["initial", "follow-up", "feedback"]),
  questionCount: z.number().optional(),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
