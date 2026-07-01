import { useEffect, useState } from 'react';
import { Check, FileText, ShieldCheck } from 'lucide-react';
import type { LoanRecommendation } from '../data/profiles';

const BADGE = {
  recommended: { label: 'Recommended', cls: 'bg-green-600 text-white', icon: Check },
  eligible: { label: 'Eligible', cls: 'bg-navy-700 text-white', icon: FileText },
  conditional: { label: 'Conditional', cls: 'bg-amber-500 text-white', icon: ShieldCheck },
} as const;

interface Props {
  loans: LoanRecommendation[];
}

export default function LoanCards({ loans }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {loans.map((loan, i) => {
        const b = BADGE[loan.badge];
        const Icon = b.icon;
        const width = mounted ? `${loan.match}%` : '0%';
        return (
          <div
            key={loan.id}
            className="animate-scale-in flex flex-col rounded-xl border border-navy-100 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${b.cls}`}>
                <Icon className="h-3 w-3" />
                {b.label}
              </span>
              <span className="text-xs font-medium text-navy-400">Match</span>
            </div>

            <h4 className="mt-3 text-base font-semibold text-navy-900">{loan.type}</h4>
            <p className="mt-0.5 text-2xl font-bold tabular-nums text-navy-900">{loan.amount}</p>

            <div className="mt-3 grid grid-cols-2 gap-3 border-y border-navy-50 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-navy-400">Rate</p>
                <p className="text-sm font-semibold text-navy-800">{loan.rate}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-navy-400">Tenure</p>
                <p className="text-sm font-semibold text-navy-800">{loan.tenure}</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-navy-400">Fit Score</span>
                <span className="font-semibold tabular-nums text-navy-800">{loan.match}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-navy-50">
                <div className="h-full rounded-full bg-green-500 transition-[width] duration-1000 ease-out" style={{ width, transitionDelay: `${i * 100}ms` }} />
              </div>
            </div>

            <p className="mt-3 flex-1 text-xs leading-relaxed text-navy-500">{loan.rationale}</p>
          </div>
        );
      })}
    </div>
  );
}
