import { useCallback, useEffect, useState } from 'react';
import { Activity, ShieldCheck, Lock } from 'lucide-react';
import { PROFILES, type BusinessProfile } from './data/profiles';
import { fetchLiveScore, fetchLiveScoreFromInputs, type LiveScore, type ScoringRequest } from './lib/scoringApi';
import { generateProfile, generateScoringInputs, attachLoans } from './lib/generateProfile';
import SearchBar from './components/SearchBar';
import LoadingSequence from './components/LoadingSequence';
import ResultsView from './components/ResultsView';

type Stage = 'search' | 'loading' | 'results';

function matchProfile(gstin: string) {
  return PROFILES.find((p) => p.gstin === gstin) ?? null;
}

export default function App() {
  const [stage, setStage] = useState<Stage>('search');
  const [gstin, setGstin] = useState('');
  const [profileId, setProfileId] = useState(PROFILES[0].id);
  const [simProfile, setSimProfile] = useState<BusinessProfile | null>(null);
  const [simInputs, setSimInputs] = useState<ScoringRequest | null>(null);
  const [liveScore, setLiveScore] = useState<LiveScore>({ score: null, grade: null, error: null });
  const [scoreLoading, setScoreLoading] = useState(false);

  const handleSearch = useCallback((g: string) => {
    setGstin(g);
    setLiveScore({ score: null, grade: null, error: null });
    const demo = matchProfile(g);
    if (demo) {
      setProfileId(demo.id);
      setSimProfile(null);
      setSimInputs(null);
    } else {
      const inputs = generateScoringInputs();
      setSimInputs(inputs);
      setSimProfile(generateProfile(g, inputs));
      setProfileId(`sim-${g}`);
    }
    setScoreLoading(true);
    setStage('loading');
  }, []);

  const handleLoaded = useCallback(() => setStage('results'), []);

  const handleReset = useCallback(() => {
    setStage('search');
    setGstin('');
    setSimProfile(null);
    setSimInputs(null);
    setLiveScore({ score: null, grade: null, error: null });
    setScoreLoading(false);
  }, []);

  const handleSwitch = useCallback((id: string) => {
    const p = PROFILES.find((x) => x.id === id);
    if (p) {
      setProfileId(id);
      setGstin(p.gstin);
      setSimProfile(null);
      setSimInputs(null);
      setLiveScore({ score: null, grade: null, error: null });
      setScoreLoading(true);
    }
  }, []);

  const demoProfile = PROFILES.find((p) => p.id === profileId);
  const isSimulated = !demoProfile && simProfile !== null;
  const profile = demoProfile ?? simProfile ?? PROFILES[0];

  useEffect(() => {
    if (!scoreLoading) return;
    let cancelled = false;
    const promise = isSimulated && simInputs
      ? fetchLiveScoreFromInputs(simInputs)
      : fetchLiveScore(profile);
    promise.then((result) => {
      if (cancelled) return;
      setLiveScore(result);
      if (isSimulated && simProfile && simInputs) {
        setSimProfile(attachLoans(simProfile, simInputs, result.score));
      }
      setScoreLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [profile, scoreLoading, isSimulated, simInputs, simProfile]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-navy-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight text-navy-900">MSME Health Card</h1>
              <p className="text-[11px] leading-tight text-navy-400">Financial Health Dashboard</p>
            </div>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <span className="flex items-center gap-1.5 text-xs font-medium text-navy-500">
              <ShieldCheck className="h-4 w-4 text-green-600" /> RBI-aligned framework
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-navy-500">
              <Lock className="h-4 w-4 text-navy-500" /> Consent-based
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {stage === 'search' && (
          <div className="animate-fade-up">
            {/* Hero */}
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Live demo · Simulated data
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                The financial health of your business, in one card.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-navy-500">
                Enter a GSTIN to aggregate signals from GST, UPI, EPFO and Account Aggregator sources into a
                composite health score — with sub-dimension breakdowns, risk flags, and matched loan offers.
              </p>
            </div>

            {/* Search */}
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Feature strip */}
            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { title: 'Six-dimension score', desc: 'Revenue, cash flow, debt, ops, market & compliance — out of 900.' },
                { title: 'Plain-language risk flags', desc: 'Green, amber and red signals explained in words a owner understands.' },
                { title: 'Matched loan offers', desc: 'Working capital, term loans and invoice finance ranked by fit.' },
              ].map((f) => (
                <div key={f.title} className="rounded-xl border border-navy-100 bg-white p-4">
                  <h3 className="text-sm font-semibold text-navy-900">{f.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-navy-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === 'loading' && (
          <div className="flex min-h-[60vh] items-center justify-center py-10">
            <LoadingSequence gstin={gstin} onComplete={handleLoaded} />
          </div>
        )}

        {stage === 'results' && (
          <ResultsView
            profile={profile}
            onReset={handleReset}
            onSwitch={handleSwitch}
            profiles={PROFILES}
            liveScore={liveScore}
            scoreLoading={scoreLoading}
            isSimulated={isSimulated}
          />
        )}
      </main>

      <footer className="border-t border-navy-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <p className="text-center text-xs text-navy-400">
            MSME Financial Health Card · Demonstration prototype · All data is simulated
          </p>
        </div>
      </footer>
    </div>
  );
}
