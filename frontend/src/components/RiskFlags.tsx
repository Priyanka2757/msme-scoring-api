import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { RiskFlag, RiskLevel } from '../data/profiles';

const STYLES: Record<RiskLevel, { ring: string; icon: typeof CheckCircle2; iconColor: string; chip: string; label: string }> = {
  green: { ring: 'border-green-200', icon: CheckCircle2, iconColor: 'text-green-600', chip: 'bg-green-50 text-green-700', label: 'Low Risk' },
  amber: { ring: 'border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-600', chip: 'bg-amber-50 text-amber-700', label: 'Watch' },
  red: { ring: 'border-red-200', icon: XCircle, iconColor: 'text-red-600', chip: 'bg-red-50 text-red-700', label: 'High Risk' },
};

interface Props {
  flags: RiskFlag[];
}

export default function RiskFlags({ flags }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {flags.map((f, i) => {
        const s = STYLES[f.level];
        const Icon = s.icon;
        return (
          <div
            key={f.id}
            className={`animate-fade-up rounded-xl border ${s.ring} bg-white p-4 shadow-card`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start gap-3">
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${s.iconColor}`} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-navy-900">{f.title}</h4>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${s.chip}`}>
                    {s.label}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-navy-500">{f.detail}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
