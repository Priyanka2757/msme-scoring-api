import type { BusinessProfile } from '../data/profiles';

const ENDPOINT = 'https://msme-scoring-api.onrender.com/score';

export interface ScoringRequest {
  gst_filing_rate: number;
  cash_buffer_ratio: number;
  revenue_growth: number;
  revenue_volatility: number;
  avg_net_cash_flow: number;
  negative_cashflow_months: number;
  headcount_trend: number;
  buyer_hhi: number;
  n_buyers: number;
  vintage_months: number;
  sector: string;
}

export interface ScoringResponse {
  composite_score?: number;
  grade?: string;
  [key: string]: unknown;
}

export interface LiveScore {
  score: number | null;
  grade: string | null;
  error: string | null;
}

export function deriveScoringInputs(profile: BusinessProfile): ScoringRequest {
  const compliance = profile.subDimensions.find((d) => d.key === 'compliance');
  const cashFlow = profile.subDimensions.find((d) => d.key === 'cashFlowHealth');
  const revenue = profile.subDimensions.find((d) => d.key === 'revenueStability');
  const market = profile.subDimensions.find((d) => d.key === 'marketPositioning');
  const ops = profile.subDimensions.find((d) => d.key === 'operationalConsistency');

  const gstFilingRate = compliance ? Math.round((compliance.score / 150) * 100) / 100 : 0.9;
  const cashBufferRatio = cashFlow ? Math.round((cashFlow.score / 150) * 100) / 100 : 0.5;
  const revenueGrowth = revenue ? Math.round(((revenue.score / 150) - 0.5) * 40) / 100 : 0.05;
  const revenueVolatility = revenue ? Math.round((1 - revenue.score / 150) * 40) / 100 : 0.15;
  const negativeMonths = cashFlow
    ? Math.max(0, Math.round((1 - cashFlow.score / 150) * 6))
    : 1;
  const avgNetCashFlow = cashFlow ? Math.round((cashFlow.score / 150) * 120000) : 40000;
  const headcountTrend = ops ? Math.round(((ops.score / 150) - 0.5) * 20) / 100 : 0.03;
  const buyerHhi = market ? Math.round((1 - market.score / 150) * 5000) : 2500;
  const nBuyers = market ? Math.max(2, Math.round((market.score / 150) * 24)) : 8;
  const vintageMonths = profile.incorporatedYear
    ? (new Date().getFullYear() - profile.incorporatedYear) * 12
    : 60;

  const sectorMap: Record<string, string> = {
    shree: 'Textiles',
    coastal: 'Food',
    metro: 'Manufacturing',
  };
  const sector = sectorMap[profile.id] ?? 'Manufacturing';

  return {
    gst_filing_rate: gstFilingRate,
    cash_buffer_ratio: cashBufferRatio,
    revenue_growth: revenueGrowth,
    revenue_volatility: revenueVolatility,
    avg_net_cash_flow: avgNetCashFlow,
    negative_cashflow_months: negativeMonths,
    headcount_trend: headcountTrend,
    buyer_hhi: buyerHhi,
    n_buyers: nBuyers,
    vintage_months: vintageMonths,
    sector,
  };
}

export async function fetchLiveScoreFromInputs(body: ScoringRequest): Promise<LiveScore> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      return { score: null, grade: null, error: `API returned ${res.status}` };
    }
    const data = (await res.json()) as ScoringResponse;
    const score = typeof data.composite_score === 'number' ? data.composite_score : null;
    const grade = typeof data.grade === 'string' ? data.grade : null;
    if (score === null && grade === null) {
      return { score: null, grade: null, error: 'Unexpected response shape' };
    }
    return { score, grade, error: null };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { score: null, grade: null, error: 'Request timed out after 60s' };
    }
    return { score: null, grade: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function fetchLiveScore(profile: BusinessProfile): Promise<LiveScore> {
  return fetchLiveScoreFromInputs(deriveScoringInputs(profile));
}
