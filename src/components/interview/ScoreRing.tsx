interface ScoreRingProps {
  score: number;
  size?: number;
  label?: string;
}

export default function ScoreRing({ score, size = 140, label = "Skor" }: ScoreRingProps) {
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (circumference * score) / 100;

  const color = score >= 80 ? "#0F766E" : score >= 60 ? "#F59E0B" : "#94A3B8";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-slate-900">{score}</span>
        <span className="text-xs text-slate-500 font-medium">{label}</span>
      </div>
    </div>
  );
}
