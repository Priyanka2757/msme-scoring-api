import { useEffect, useState } from 'react';
import { Check, Loader2, Building2, Smartphone, Users, Landmark } from 'lucide-react';

export interface LoadingSource {
  key: string;
  label: string;
  sublabel: string;
  icon: typeof Building2;
}

export const LOADING_SOURCES: LoadingSource[] = [
  { key: 'gst', label: 'GST Network', sublabel: 'Fetching returns & filing history', icon: Building2 },
  { key: 'upi', label: 'UPI Settlements', sublabel: 'Aggregating daily collection patterns', icon: Smartphone },
  { key: 'epfo', label: 'EPFO Payroll', sublabel: 'Verifying employee count & attrition', icon: Users },
  { key: 'aa', label: 'Account Aggregator', sublabel: 'Consenting bank statement data', icon: Landmark },
];

interface Props {
  gstin: string;
  onComplete: () => void;
}

export default function LoadingSequence({ gstin, onComplete }: Props) {
  const [active, setActive] = useState(0);
  const [done, setDone] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    LOADING_SOURCES.forEach((_, i) => {
      timers.push(setTimeout(() => setActive(i), i * 900));
      timers.push(setTimeout(() => {
        setDone((prev) => new Set(prev).add(i));
      }, i * 900 + 750));
    });
    timers.push(setTimeout(() => onComplete(), LOADING_SOURCES.length * 900 + 400));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center">
      <div className="relative mb-8 flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-navy-100" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-navy-700 animate-spin-slow" />
        <div className="absolute inset-2 rounded-full bg-navy-50" />
        <Loader2 className="relative h-7 w-7 animate-pulse-soft text-navy-700" />
      </div>

      <h2 className="text-lg font-semibold text-navy-900">Aggregating financial signals</h2>
      <p className="mt-1 text-sm text-navy-400">
        Pulling data for <span className="font-mono font-medium text-navy-700">{gstin}</span>
      </p>

      <div className="mt-8 w-full space-y-3">
        {LOADING_SOURCES.map((src, i) => {
          const isDone = done.has(i);
          const isActive = active === i && !isDone;
          const Icon = src.icon;
          return (
            <div
              key={src.key}
              className={`flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-300 ${
                isDone
                  ? 'border-green-200 bg-green-50/50'
                  : isActive
                  ? 'border-navy-200 bg-navy-50/60 shadow-card'
                  : 'border-navy-100 bg-white opacity-50'
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isDone ? 'bg-green-100 text-green-700' : isActive ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-400'
                }`}
              >
                {isDone ? <Check className="h-5 w-5" /> : <Icon className={`h-5 w-5 ${isActive ? 'animate-pulse-soft' : ''}`} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${isDone || isActive ? 'text-navy-900' : 'text-navy-400'}`}>{src.label}</p>
                <p className="truncate text-xs text-navy-400">{src.sublabel}</p>
              </div>
              {isActive && (
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-navy-100">
                  <div className="h-full w-1/2 rounded-full bg-navy-500 animate-[shimmer_1s_ease-in-out_infinite]" />
                </div>
              )}
              {isDone && <span className="text-xs font-medium text-green-600">Done</span>}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-navy-300">
        Simulated fetch for demonstration. No live data is accessed.
      </p>
    </div>
  );
}
