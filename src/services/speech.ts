export type SpeechRecognitionResult = {
  transcript: string;
  isFinal: boolean;
};

export type SpeechServiceCallbacks = {
  onResult: (result: SpeechRecognitionResult) => void;
  onEnd: () => void;
  onError: (error: string) => void;
};

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export function isSpeechRecognitionAvailable(): boolean {
  return !!SpeechRecognitionAPI;
}

export function isSpeechSynthesisAvailable(): boolean {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}

let recognition: any = null;
let currentCallbacks: SpeechServiceCallbacks | null = null;

export function startRecognition(callbacks: SpeechServiceCallbacks): void {
  if (!SpeechRecognitionAPI) {
    callbacks.onError("Speech Recognition tidak tersedia di browser ini.");
    return;
  }

  stopRecognition();

  recognition = new SpeechRecognitionAPI();
  recognition.lang = "id-ID";
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.maxAlternatives = 1;

  currentCallbacks = callbacks;

  recognition.onresult = (event: any) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    if (finalTranscript) {
      callbacks.onResult({ transcript: finalTranscript, isFinal: true });
    } else if (interimTranscript) {
      callbacks.onResult({ transcript: interimTranscript, isFinal: false });
    }
  };

  recognition.onend = () => {
    callbacks.onEnd();
    currentCallbacks = null;
  };

  recognition.onerror = (event: any) => {
    if (event.error === "no-speech") {
      return;
    }
    const errorMsg =
      event.error === "not-allowed"
        ? "Izmicrophone belum diberikan. Silakan izinkan akses microphone."
        : event.error === "network"
          ? "Terjadi kesalahan jaringan saat mengenali suara."
          : `Kesalahan pengenalan suara: ${event.error}`;
    callbacks.onError(errorMsg);
  };

  try {
    recognition.start();
  } catch {
    callbacks.onError("Gagal memulai pengenalan suara.");
  }
}

export function stopRecognition(): void {
  if (recognition) {
    try {
      recognition.stop();
    } catch {
      // ignore
    }
    recognition = null;
  }
  currentCallbacks = null;
}

export function cancelRecognition(): void {
  if (recognition) {
    try {
      recognition.abort();
    } catch {
      // ignore
    }
    recognition = null;
  }
  currentCallbacks = null;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakQuestion(
  text: string,
  onEnd?: () => void,
  onError?: (error: string) => void
): void {
  if (!isSpeechSynthesisAvailable()) {
    onEnd?.();
    return;
  }

  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find((v) => v.lang.startsWith("id"));
  if (idVoice) {
    utterance.voice = idVoice;
  }

  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    onError?.("Gagal memutar suara pertanyaan.");
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export function cleanupSpeech(): void {
  cancelRecognition();
  stopSpeaking();
}
