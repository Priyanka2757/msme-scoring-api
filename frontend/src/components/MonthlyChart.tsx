import { useEffect, useState } from 'react';
import type { MonthlyPoint } from '../data/profiles';

interface Props {
  data: MonthlyPoint[];
}

export default function MonthlyChart({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const maxRev = Math.max(...data.map((d) => d.revenue));
  const maxCf = Math.max(...data.map((d) => Math.abs(d.cashFlow)));
  const minCf = Math.min(...data.map((d) => d.cashFlow));
  const cfRange = Math.max(maxCf, Math.abs(minCf));

  return (
    <div>
      <div className="flex items-center gap-5 text-xs font-medium text-navy-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-navy-700" /> Revenue (₹ Lakh)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-green-500" /> Cash Flow (₹ Lakh)
        </span>
      </div>

      <div className="mt-5 grid grid-cols-12 gap-2 sm:gap-3">
        {data.map((d, i) => {
          const revH = mounted ? `${(d.revenue / maxRev) * 100}%` : '0%';
          const cfH = mounted ? `${(Math.abs(d.cashFlow) / cfRange) * 100}%` : '0%';
          const negative = d.cashFlow < 0;
          return (
            <div key={d.month} className="flex flex-col items-center gap-2">
              <div className="flex h-40 w-full items-end justify-center gap-1">
                <div className="relative flex h-full w-1/2 items-end">
                  <div
                    className="w-full rounded-t-sm bg-navy-700 transition-[height] duration-700 ease-out"
                    style={{ height: revH, transitionDelay: `${i * 45}ms` }}
                    title={`Revenue: ₹${d.revenue}L`}
                  />
                </div>
                <div className="relative flex h-full w-1/2 items-end">
                  <div
                    className={`w-full rounded-t-sm transition-[height] duration-700 ease-out ${negative ? 'bg-red-400' : 'bg-green-500'}`}
                    style={{ height: cfH, transitionDelay: `${i * 45 + 60}ms` }}
                    title={`Cash flow: ₹${d.cashFlow}L`}
                  />
                </div>
              </div>
              <span className="text-[10px] font-medium text-navy-400">{d.month}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-navy-400">
        Negative cash-flow months are shown in red. Hover any bar for the exact figure.
      </p>
    </div>
  );
}
