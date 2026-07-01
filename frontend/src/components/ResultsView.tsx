import { Building2, MapPin, Calendar, Users, IndianRupee, RefreshCw, Download, ArrowLeft, Wifi, AlertTriangle } from 'lucide-react';
import type { BusinessProfile } from '../data/profiles';
import type { LiveScore } from '../lib/scoringApi';
import ScoreRing from './ScoreRing';
import SubDimensions from './SubDimensions';
import MonthlyChart from './MonthlyChart';
import RiskFlags from './RiskFlags';
import LoanCards from './LoanCards';

interface Props {
  profile: BusinessProfile;
  onReset: () => void;
  onSwitch: (id: string) => void;
  profiles: BusinessProfile[];
  liveScore: LiveScore;
  scoreLoading: boolean;
  isSimulated?: boolean;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wide text-navy-400">{label}</p>
        <p className="text-sm font-semibold text-navy-900">{value}</p>
      </div>
    </div>
  );
}

export default function ResultsView({ profile, onReset, onSwitch, profiles, liveScore, scoreLoading, isSimulated = false }: Props) {
  const displayScore = liveScore.score ?? profile.compositeScore;
  const displayRating = liveScore.grade ?? profile.rating;
  const isLive = liveScore.score !== null;
  return (
    <div className="animate-fade-in">
      {/* Top bar: back + switcher */}
      <div className="flex flex-col gap-4 border-b border-navy-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onReset}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-navy-500 transition-colors hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" /> New search
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-navy-400">Demo profiles:</span>
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => onSwitch(p.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                p.id === profile.id
                  ? 'bg-navy-800 text-white'
                  : 'border border-navy-200 bg-white text-navy-600 hover:border-navy-400 hover:bg-navy-50'
              }`}
            >
              {p.tradeName}
            </button>
          ))}
        </div>
      </div>

      {/* Business header */}
      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{profile.legalName}</h1>
          <p className="mt-0.5 text-sm text-navy-400">
            trading as <span className="font-medium text-navy-600">{profile.tradeName}</span> · {profile.industry}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
            <Stat icon={MapPin} label="Location" value={profile.city} />
            <Stat icon={Calendar} label="Incorporated" value={String(profile.incorporatedYear)} />
            <Stat icon={Users} label="Employees" value={String(profile.employees)} />
            <Stat icon={IndianRupee} label="Annual Turnover" value={profile.annualTurnover} />
            <Stat icon={Building2} label="GSTIN" value={profile.gstin} />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-50">
            <Download className="h-3.5 w-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Score + sub-dimensions */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-navy-100 bg-white p-6 shadow-card lg:col-span-1">
          <ScoreRing score={displayScore} max={900} rating={displayRating} loading={scoreLoading} />
          <div className="mt-4 flex items-center gap-1.5">
            {scoreLoading ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-medium text-navy-500">
                <Wifi className="h-3 w-3 animate-pulse" /> Connecting to scoring engine…
              </span>
            ) : isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700">
                <Wifi className="h-3 w-3" /> Live score from API
              </span>
            ) : liveScore.error ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                <AlertTriangle className="h-3 w-3" /> API unavailable — showing demo score
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-medium text-navy-500">
                Demo score
              </span>
            )}
          </div>
          <p className="mt-3 text-center text-xs leading-relaxed text-navy-400">
            Composite of six weighted sub-dimensions, each scored out of 150.
          </p>
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h3 className="text-base font-semibold text-navy-900">Sub-dimension Scores</h3>
            <span className="text-xs text-navy-400">Each out of 150</span>
          </div>
          <div className="mt-5">
            <SubDimensions dimensions={profile.subDimensions} />
          </div>
        </div>
      </div>

      {/* Monthly chart */}
      <div className="mt-5 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <div className="flex items-baseline justify-between">
          <h3 className="text-base font-semibold text-navy-900">Revenue & Cash Flow — Last 12 Months</h3>
          <span className="text-xs text-navy-400">Source: Account Aggregator + UPI</span>
        </div>
        <div className="mt-5">
          <MonthlyChart data={profile.monthly} />
        </div>
      </div>

      {/* Risk flags */}
      <div className="mt-5 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <div className="flex items-baseline justify-between">
          <h3 className="text-base font-semibold text-navy-900">Risk Flags</h3>
          <span className="text-xs text-navy-400">{profile.riskFlags.length} signals detected</span>
        </div>
        <div className="mt-5">
          <RiskFlags flags={profile.riskFlags} />
        </div>
      </div>

      {/* Loan recommendations */}
      <div className="mt-5 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <div className="flex items-baseline justify-between">
          <h3 className="text-base font-semibold text-navy-900">Loan Recommendations</h3>
          <span className="text-xs text-navy-400">Matched to your health profile</span>
        </div>
        <div className="mt-5">
          <LoanCards loans={profile.loans} />
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-navy-300">
        {isSimulated
          ? 'Business data simulated for demonstration. Scoring engine and model are live and real.'
          : 'Composite score and grade are fetched live from the MSME scoring API. All other signals are simulated for demonstration.'}
      </p>
    </div>
  );
}
