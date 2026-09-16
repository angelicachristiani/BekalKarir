"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Video, VideoOff, Mic, MicOff, Send, Volume2, Loader2,
  Sparkles, Clock, MessageSquare, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_JOBS } from "@/data/mock-jobs";
import type { InterviewType, InterviewQuestion, InterviewState } from "@/types/interview";
import { generateAIInterview } from "@/services/ai-interview";
import {
  startRecognition, stopRecognition, isSpeechRecognitionAvailable,
  speakQuestion, stopSpeaking, isSpeechSynthesisAvailable, cleanupSpeech
} from "@/services/speech";
import CameraCheck from "@/components/interview/CameraCheck";
import QuestionDisplay from "@/components/interview/QuestionDisplay";
import TranscriptPanel from "@/components/interview/TranscriptPanel";

const TOTAL_QUESTIONS = 6;

export default function InterviewRoomPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [step, setStep] = useState<"camera-check" | "interview">("camera-check");
  const [state, setState] = useState<InterviewState>("preparing");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);

  const [interviewType, setInterviewType] = useState<InterviewType>("hr");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; transcript: string; duration: number }[]>([]);

  const [transcripts, setTranscripts] = useState<{ speaker: "ai" | "user"; text: string }[]>([]);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textFallback, setTextFallback] = useState("");
  const [useTextFallback, setUseTextFallback] = useState(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const followUpCountRef = useRef<number>(0);

  const job = MOCK_JOBS.find((j) => j.id === jobId);

  useEffect(() => {
    const config = sessionStorage.getItem("bekalkarir_interview_config");
    if (config) {
      const parsed = JSON.parse(config);
      setInterviewType(parsed.interviewType);
    }
  }, []);

  useEffect(() => {
    if (step === "interview" && state === "preparing") {
      loadQuestions();
    }
  }, [step, state]);

  useEffect(() => {
    if (state === "ai-speaking" || state === "ai-thinking" || state === "waiting-answer") {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  useEffect(() => {
    if (step === "interview" && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [step, stream]);

  useEffect(() => {
    return () => {
      cleanupSpeech();
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stream]);

  const loadQuestions = async () => {
    setState("ai-thinking");
    const profile = JSON.parse(localStorage.getItem("bekalkarir_profile") || "{}");

    const result = await generateAIInterview({
      job: {
        id: job!.id,
        title: job!.title,
        company: job!.company,
        description: job!.description,
        skills: job!.skills,
      },
      userProfile: profile,
      interviewType,
      mode: "initial",
      questionCount: TOTAL_QUESTIONS,
    });

    if (result.questions) {
      setQuestions(result.questions);
      setCurrentQIndex(0);
      setTimeout(() => {
        speakFirstQuestion(result.questions![0]);
      }, 800);
    }
  };

  const speakFirstQuestion = (q: InterviewQuestion) => {
    setState("ai-speaking");
    setIsSpeaking(true);
    setTranscripts((prev) => [...prev, { speaker: "ai", text: q.question }]);

    if (isSpeechSynthesisAvailable()) {
      speakQuestion(q.question, () => {
        setIsSpeaking(false);
        setState("waiting-answer");
        setQuestionStartTime(Date.now());
        if (isSpeechRecognitionAvailable() && !useTextFallback) {
          startSpeechRecognition();
        }
      });
    } else {
      setTimeout(() => {
        setIsSpeaking(false);
        setState("waiting-answer");
        setQuestionStartTime(Date.now());
      }, 2000);
    }
  };

  const startSpeechRecognition = () => {
    startRecognition({
      onResult: (result) => {
        if (result.isFinal) {
          setTranscripts((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.speaker === "user" && !last.text.endsWith(".")) {
              return [...prev.slice(0, -1), { speaker: "user", text: last.text + " " + result.transcript }];
            }
            return [...prev, { speaker: "user", text: result.transcript }];
          });
          setInterimTranscript("");
        } else {
          setInterimTranscript(result.transcript);
        }
      },
      onEnd: () => {
        setIsListening(false);
      },
      onError: (error) => {
        console.error("Speech recognition error:", error);
        setIsListening(false);
        setUseTextFallback(true);
      },
    });
    setIsListening(true);
  };

  const handleStartListening = () => {
    if (isSpeechRecognitionAvailable() && !useTextFallback) {
      startSpeechRecognition();
    } else {
      setUseTextFallback(true);
    }
  };

  const handleStopListening = () => {
    stopRecognition();
    setIsListening(false);
  };

  const handleSubmitAnswer = async () => {
    stopRecognition();
    stopSpeaking();
    setIsListening(false);
    setIsSpeaking(false);

    let userAnswer = "";
    const userTranscripts = transcripts.filter((t) => t.speaker === "user");
    if (userTranscripts.length > 0) {
      userAnswer = userTranscripts.map((t) => t.text).join(" ");
    } else if (textFallback.trim()) {
      userAnswer = textFallback.trim();
      setTranscripts((prev) => [...prev, { speaker: "user", text: userAnswer }]);
    }

    const duration = Math.round((Date.now() - questionStartTime) / 1000);
    const currentQ = questions[currentQIndex];

    setAnswers((prev) => [
      ...prev,
      { questionId: currentQ.id, transcript: userAnswer, duration },
    ]);

    setTextFallback("");
    setInterimTranscript("");
    setState("analyzing");

    followUpCountRef.current += 1;

    if (currentQIndex < questions.length - 1 && followUpCountRef.current < 2) {
      setTimeout(async () => {
        setState("ai-thinking");
        const profile = JSON.parse(localStorage.getItem("bekalkarir_profile") || "{}");

        const result = await generateAIInterview({
          job: {
            id: job!.id,
            title: job!.title,
            company: job!.company,
            description: job!.description,
            skills: job!.skills,
          },
          userProfile: profile,
          interviewType,
          previousQuestions: [...answers.map((a) => {
            const q = questions.find((qq) => qq.id === a.questionId);
            return q?.question || "";
          }), currentQ.question],
          previousAnswers: [...answers.map((a) => a.transcript), userAnswer],
          mode: "follow-up",
        });

        if (result.question) {
          const followUpQ: InterviewQuestion = {
            id: result.question.id,
            question: result.question.question,
            type: "follow-up",
            category: result.question.category,
          };
          setQuestions((prev) => {
            const newQ = [...prev];
            newQ.splice(currentQIndex + 1, 0, followUpQ);
            return newQ;
          });

          setState("ai-speaking");
          setIsSpeaking(true);
          setTranscripts((prev) => [...prev, { speaker: "ai", text: followUpQ.question }]);

          if (isSpeechSynthesisAvailable()) {
            speakQuestion(followUpQ.question, () => {
              setIsSpeaking(false);
              setState("waiting-answer");
              setQuestionStartTime(Date.now());
              if (isSpeechRecognitionAvailable() && !useTextFallback) {
                startSpeechRecognition();
              }
            });
          } else {
            setTimeout(() => {
              setIsSpeaking(false);
              setState("waiting-answer");
              setQuestionStartTime(Date.now());
            }, 2000);
          }
        } else {
          advanceToNextQuestion(userAnswer);
        }
      }, 1000);
    } else {
      advanceToNextQuestion(userAnswer);
    }
  };

  const advanceToNextQuestion = (lastAnswer: string) => {
    followUpCountRef.current = 0;

    if (currentQIndex >= questions.length - 1) {
      finishInterview();
    } else {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);

      setTimeout(() => {
        const nextQ = questions[nextIdx];
        if (!nextQ) {
          finishInterview();
          return;
        }
        setState("ai-speaking");
        setIsSpeaking(true);
        setTranscripts((prev) => [...prev, { speaker: "ai", text: nextQ.question }]);

        if (isSpeechSynthesisAvailable()) {
          speakQuestion(nextQ.question, () => {
            setIsSpeaking(false);
            setState("waiting-answer");
            setQuestionStartTime(Date.now());
            if (isSpeechRecognitionAvailable() && !useTextFallback) {
              startSpeechRecognition();
            }
          });
        } else {
          setTimeout(() => {
            setIsSpeaking(false);
            setState("waiting-answer");
            setQuestionStartTime(Date.now());
          }, 2000);
        }
      }, 1000);
    }
  };

  const finishInterview = async () => {
    setState("analyzing");
    stopRecognition();
    stopSpeaking();

    const allAnswers = [...answers];
    const allQuestions = [...questions];

    const result = await generateAIInterview({
      job: {
        id: job!.id,
        title: job!.title,
        company: job!.company,
        description: job!.description,
        skills: job!.skills,
      },
      userProfile: JSON.parse(localStorage.getItem("bekalkarir_profile") || "{}"),
      interviewType,
      previousQuestions: allAnswers.map((a) => {
        const q = allQuestions.find((qq) => qq.id === a.questionId);
        return q?.question || "";
      }),
      previousAnswers: allAnswers.map((a) => a.transcript),
      mode: "feedback",
    });

    const feedback = result.feedback || {
      score: 50,
      relevance: 50,
      structure: 50,
      communication: 50,
      clarity: 50,
      examples: 50,
      strengths: ["Pertumbuhan positif"],
      improvements: ["Perlu berlatih lebih lagi"],
      recommendations: ["Gunakan metode STAR", "Siapkan contoh proyek"],
    };

    const interviewResult = {
      id: `int-${Date.now()}`,
      jobId: job!.id,
      jobTitle: job!.title,
      interviewType,
      date: new Date().toISOString(),
      score: feedback.score,
      feedback,
      questions: allQuestions,
      answers: allAnswers,
      recommendations: feedback.recommendations,
    };

    const history = JSON.parse(localStorage.getItem("bekalkarir_interview_history") || "[]");
    history.unshift(interviewResult);
    localStorage.setItem("bekalkarir_interview_history", JSON.stringify(history.slice(0, 20)));

    sessionStorage.setItem("bekalkarir_interview_result", JSON.stringify(interviewResult));
    setState("finished");
    router.push(`/interview/${jobId}/result`);
  };

  const handleCameraReady = (mediaStream: MediaStream | null) => {
    setStream(mediaStream);
    if (!mediaStream) {
      setCameraActive(false);
      setMicActive(false);
    }
    setStep("interview");
    setState("preparing");
  };

  const handleSkipCamera = () => {
    setCameraActive(false);
    setMicActive(false);
    setStep("interview");
    setState("preparing");
  };

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach((t) => {
        t.enabled = !t.enabled;
      });
      setCameraActive(!cameraActive);
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach((t) => {
        t.enabled = !t.enabled;
      });
      setMicActive(!micActive);
    }
  };

  const handleReplay = () => {
    const q = questions[currentQIndex];
    if (q) {
      speakQuestion(q.question);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <p className="text-slate-500">Pekerjaan tidak ditemukan.</p>
          <Link href="/interview" className="text-primary font-semibold hover:underline">Kembali</Link>
        </div>
      </div>
    );
  }

  if (step === "camera-check") {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-100 sticky top-0 z-20 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/interview/${jobId}/briefing`} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-bold text-slate-900">Periksa Perangkat</span>
          </div>
        </header>
        <div className="max-w-lg mx-auto px-4 pt-8 space-y-6">
          <CameraCheck onReady={handleCameraReady} onSkip={handleSkipCamera} />
        </div>
      </main>
    );
  }

  const currentQ = questions[currentQIndex];
  const progress = questions.length > 0 ? ((currentQIndex + 1) / questions.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/interview" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="font-bold text-slate-900 text-sm">AI Interview</span>
            <span className="text-slate-400 text-sm mx-2">·</span>
            <span className="text-slate-500 text-sm hidden md:inline">{job.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            {formatTime(elapsedSeconds)}
          </div>
          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-4">
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden aspect-video">
            {cameraActive && stream ? (
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <VideoOff className="w-16 h-16 text-slate-600" />
              </div>
            )}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <button onClick={toggleCamera} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${cameraActive ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}>
                {cameraActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <button onClick={toggleMic} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${micActive ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}>
                {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>
            {isSpeaking && (
              <div className="absolute top-4 left-4 bg-primary/90 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                AI Berbicara
              </div>
            )}
            {isListening && (
              <div className="absolute top-4 right-4 bg-red-500/90 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Mendengarkan
              </div>
            )}
          </div>

          {currentQ && (
            <QuestionDisplay
              question={currentQ}
              questionNumber={currentQIndex + 1}
              totalQuestions={questions.length}
              isSpeaking={isSpeaking}
              onReplay={handleReplay}
            />
          )}

          {state === "waiting-answer" && (
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              {useTextFallback ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Ketik jawaban kamu di sini..."
                    value={textFallback}
                    onChange={(e) => setTextFallback(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && textFallback.trim()) {
                        handleSubmitAnswer();
                      }
                    }}
                    className="h-12 rounded-2xl"
                  />
                  <Button onClick={handleSubmitAnswer} disabled={!textFallback.trim()} className="h-12 rounded-2xl bg-primary">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  {!isListening ? (
                    <Button onClick={handleStartListening} className="flex-1 h-12 rounded-2xl bg-primary">
                      <Mic className="w-5 h-5 mr-2" />
                      Mulai Bicara
                    </Button>
                  ) : (
                    <Button onClick={handleStopListening} variant="outline" className="flex-1 h-12 rounded-2xl border-red-200 text-red-600">
                      <MicOff className="w-5 h-5 mr-2" />
                      Stop
                    </Button>
                  )}
                  <Button onClick={handleSubmitAnswer} className="h-12 rounded-2xl bg-teal-600 hover:bg-teal-700">
                    Selesai Menjawab
                  </Button>
                </div>
              )}
              {!isSpeechRecognitionAvailable() && !useTextFallback && (
                <button onClick={() => setUseTextFallback(true)} className="text-xs text-primary hover:underline">
                  Gunakan input teks sebagai alternatif
                </button>
              )}
            </div>
          )}

          {(state === "ai-thinking" || state === "analyzing") && (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-slate-600 font-medium">
                {state === "ai-thinking" ? "AI sedang memproses..." : "Menganalisis jawaban..."}
              </span>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <TranscriptPanel transcripts={transcripts} interimTranscript={interimTranscript} isListening={isListening} />
        </div>

        <div className="lg:hidden">
          <details className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <summary className="px-5 py-3 font-semibold text-slate-900 text-sm flex items-center gap-2 cursor-pointer">
              <MessageSquare className="w-4 h-4 text-primary" />
              Transkrip
              {isListening && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            </summary>
            <div className="max-h-[300px] overflow-y-auto p-4 space-y-3 border-t border-slate-100">
              {transcripts.map((t, i) => (
                <div key={i} className={`flex ${t.speaker === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                    t.speaker === "ai" ? "bg-slate-100 text-slate-800 rounded-bl-md" : "bg-primary/10 text-slate-800 rounded-br-md"
                  }`}>
                    {t.speaker === "ai" && <span className="text-xs font-bold text-primary block mb-1">AI</span>}
                    {t.text}
                  </div>
                </div>
              ))}
              {interimTranscript && (
                <div className="flex justify-end">
                  <div className="bg-primary/5 text-slate-500 px-4 py-2.5 rounded-2xl rounded-br-md text-sm italic max-w-[85%]">{interimTranscript}</div>
                </div>
              )}
            </div>
          </details>
        </div>
      </div>
    </main>
  );
}
