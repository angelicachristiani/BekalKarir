"use client";

import { useState, useEffect, useRef } from "react";
import { Video, Mic, MicOff, VideoOff, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type DeviceStatus = "checking" | "available" | "denied" | "unavailable";

interface CameraCheckProps {
  onReady: (stream: MediaStream | null) => void;
  onSkip: () => void;
}

export default function CameraCheck({ onReady, onSkip }: CameraCheckProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStatus, setVideoStatus] = useState<DeviceStatus>("checking");
  const [audioStatus, setAudioStatus] = useState<DeviceStatus>("checking");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    let mounted = true;

    async function checkDevices() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!mounted) {
          mediaStream.getTracks().forEach((t) => t.stop());
          return;
        }

        setStream(mediaStream);
        setVideoStatus("available");
        setAudioStatus("available");

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(mediaStream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function updateLevel() {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setAudioLevel(avg / 128);
          animFrameRef.current = requestAnimationFrame(updateLevel);
        }
        updateLevel();
      } catch (err: any) {
        if (!mounted) return;
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setVideoStatus("denied");
          setAudioStatus("denied");
        } else if (err.name === "NotFoundError") {
          setVideoStatus("unavailable");
          setAudioStatus("unavailable");
        } else {
          setVideoStatus("unavailable");
          setAudioStatus("unavailable");
        }
      }
    }

    checkDevices();

    return () => {
      mounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleStart = () => {
    onReady(stream);
  };

  const handleSkip = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    onSkip();
  };

  const StatusIcon = ({ status }: { status: DeviceStatus }) => {
    if (status === "checking") return <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />;
    if (status === "available") return <CheckCircle2 className="w-5 h-5 text-teal-500" />;
    return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  };

  const statusText = (status: DeviceStatus, type: string) => {
    if (status === "checking") return `Memeriksa ${type}...`;
    if (status === "available") return `${type} Berfungsi`;
    if (status === "denied") return `${type} Belum Mendapatkan Izin`;
    return `${type} Tidak Tersedia`;
  };

  const allReady = videoStatus === "available" && audioStatus === "available";
  const hasPermission = videoStatus !== "denied" && audioStatus !== "denied";

  return (
    <div className="space-y-6">
      <div className="relative bg-slate-900 rounded-3xl overflow-hidden aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        {!allReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
            <div className="text-center text-white">
              {videoStatus === "checking" ? (
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3 text-primary" />
              ) : (
                <VideoOff className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              )}
              <p className="font-medium">
                {videoStatus === "checking" ? "Memeriksa kamera..." : "Kamera tidak tersedia"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl border ${videoStatus === "available" ? "bg-teal-50 border-teal-200" : videoStatus === "denied" ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center gap-3">
            <StatusIcon status={videoStatus} />
            <div>
              <p className="font-semibold text-slate-900 text-sm">{statusText(videoStatus, "Kamera")}</p>
              {videoStatus === "denied" && <p className="text-xs text-amber-600 mt-1">Izinkan akses di browser</p>}
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-2xl border ${audioStatus === "available" ? "bg-teal-50 border-teal-200" : audioStatus === "denied" ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center gap-3">
            <StatusIcon status={audioStatus} />
            <div>
              <p className="font-semibold text-slate-900 text-sm">{statusText(audioStatus, "Mikrofon")}</p>
              {audioStatus === "denied" && <p className="text-xs text-amber-600 mt-1">Izinkan akses di browser</p>}
            </div>
          </div>
        </div>
      </div>

      {allReady && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 text-center">Level Audio</p>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-100"
              style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {hasPermission ? (
        <Button onClick={handleStart} className="w-full h-12 rounded-2xl bg-primary text-white hover:bg-teal-800 font-bold">
          <Video className="w-5 h-5 mr-2" />
          Mulai Interview
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-sm text-amber-800">
            <p className="font-semibold mb-1">Perangkat tidak tersedia atau izin ditolak</p>
            <p>Kamu tetap bisa melanjutkan interview menggunakan mode teks. Kamera tidak akan aktif selama interview.</p>
          </div>
          <Button onClick={handleSkip} variant="outline" className="w-full h-12 rounded-2xl font-bold">
            Lanjutkan Tanpa Kamera
          </Button>
        </div>
      )}
    </div>
  );
}
