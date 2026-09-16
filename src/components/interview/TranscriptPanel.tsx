"use client";

import { useEffect, useRef } from "react";
import { MessageSquare, Mic } from "lucide-react";

interface TranscriptPanelProps {
  transcripts: { speaker: "ai" | "user"; text: string }[];
  interimTranscript: string;
  isListening: boolean;
}

export default function TranscriptPanel({ transcripts, interimTranscript, isListening }: TranscriptPanelProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts, interimTranscript]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Transkrip
        </h3>
        {isListening && (
          <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Mendengarkan
          </span>
        )}
      </div>
      <div className="max-h-[240px] overflow-y-auto p-4 space-y-3">
        {transcripts.length === 0 && !interimTranscript && (
          <p className="text-sm text-slate-400 text-center py-4">Transkrip akan muncul di sini...</p>
        )}
        {transcripts.map((t, i) => (
          <div key={i} className={`flex gap-2 ${t.speaker === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                t.speaker === "ai"
                  ? "bg-slate-100 text-slate-800 rounded-bl-md"
                  : "bg-primary/10 text-slate-800 rounded-br-md"
              }`}
            >
              {t.speaker === "ai" && <span className="text-xs font-bold text-primary block mb-1">AI</span>}
              {t.text}
            </div>
          </div>
        ))}
        {interimTranscript && (
          <div className="flex justify-end">
            <div className="bg-primary/5 text-slate-500 px-4 py-2.5 rounded-2xl rounded-br-md text-sm italic max-w-[80%]">
              {interimTranscript}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
