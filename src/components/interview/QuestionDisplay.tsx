"use client";

import { Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InterviewQuestion } from "@/types/interview";

interface QuestionDisplayProps {
  question: InterviewQuestion;
  questionNumber: number;
  totalQuestions: number;
  isSpeaking: boolean;
  onReplay: () => void;
}

export default function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  isSpeaking,
  onReplay,
}: QuestionDisplayProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-primary">
          Pertanyaan {questionNumber} / {totalQuestions}
        </span>
        {question.skill && (
          <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-200 font-medium">
            {question.skill}
          </span>
        )}
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
        <p className="text-lg font-semibold text-slate-900 leading-relaxed">{question.question}</p>
        {question.expectsStar && (
          <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
            <span className="font-bold">STAR:</span> Situation, Task, Action, Result
          </p>
        )}
      </div>

      <Button
        onClick={onReplay}
        variant="outline"
        size="sm"
        className="rounded-full"
        disabled={isSpeaking}
      >
        {isSpeaking ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Volume2 className="w-4 h-4 mr-2" />
        )}
        {isSpeaking ? "Sedang Berbicara..." : "Dengarkan Pertanyaan"}
      </Button>
    </div>
  );
}
