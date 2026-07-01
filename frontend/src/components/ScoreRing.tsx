import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ScoreRingProps {
  score: number;
  max: number;
  rating: string;
  loading?: boolean;
}

export default function ScoreRing({ score, max, rating, loading = false }: ScoreRingProps) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(displayed / max, 1);
  const offset = circumference * (1 - pct);

  useEffect(() => {
    if (loading) return;
    let raf: number;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score, loading]);

  const band = score >= 700 ? 'text-green-600' : score >= 550 ? 'text-amber-500' : 'text-red-500';
  const stroke = score >= 700 ? '#0f8a45' : score >= 550 ? '#e07a0a' : '#c52e2e';
  const label = score >= 700 ? 'Healthy' : score >= 550 ? 'Moderate' : 'Needs Attention';

  if (loading) {
    return (
      <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
        <svg width="220" height="220" className="-rotate-90">
          <circle cx="110" cy="110" r={radius} fill="none" stroke="#eef2f7" strokeWidth="14" />
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="#b8cce4"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
            className="animate-spin-slow origin-center"
            style={{ transformOrigin: '110px 110px' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-navy-500" />
          <span className="mt-2 text-xs font-medium uppercase tracking-wider text-navy-400">
            Scoring live
          </span>
          <span className="mt-1 max-w-[180px] text-center text-[11px] leading-relaxed text-navy-400">
            Connecting to scoring engine, this may take up to a minute on first request.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      <svg width="220" height="220" className="-rotate-90">
        <circle cx="110" cy="110" r={radius} fill="none" stroke="#eef2f7" strokeWidth="14" />
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-medium uppercase tracking-wider text-navy-400">Composite Score</span>
        <span className={`mt-1 text-5xl font-bold tabular-nums ${band}`}>{displayed}</span>
        <span className="text-sm font-medium text-navy-400">/ {max}</span>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-md bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-700">{rating}</span>
          <span className={`text-xs font-semibold ${band}`}>{label}</span>
        </div>
      </div>
    </div>
  );
}
