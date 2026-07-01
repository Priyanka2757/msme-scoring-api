import { useEffect, useState } from 'react';
import type { SubDimension } from '../data/profiles';

const MAX = 150;

function band(score: number) {
  if (score >= 110) return { bar: 'bg-green-500', text: 'text-green-700', dot: 'bg-green-500' };
  if (score >= 85) return { bar: 'bg-amber-500', text: 'text-amber-700', dot: 'bg-amber-500' };
  return { bar: 'bg-red-500', text: 'text-red-700', dot: 'bg-red-500' };
}

interface Props {
  dimensions: SubDimension[];
}

export default function SubDimensions({ dimensions }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
      {dimensions.map((d, i) => {
        const b = band(d.score);
        const width = mounted ? `${(d.score / MAX) * 100}%` : '0%';
        return (
          <div key={d.key} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${b.dot}`} />
                <span className="text-sm font-medium text-navy-800">{d.label}</span>
              </div>
              <span className="text-sm font-semibold tabular-nums text-navy-900">
                {d.score}
                <span className="text-navy-300">/{MAX}</span>
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy-50">
              <div
                className={`h-full rounded-full ${b.bar} transition-[width] duration-1000 ease-out`}
                style={{ width, transitionDelay: `${i * 70}ms` }}
              />
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-navy-400">{d.blurb}</p>
          </div>
        );
      })}
    </div>
  );
}
