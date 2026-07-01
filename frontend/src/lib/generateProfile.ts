import type {
  BusinessProfile,
  LoanRecommendation,
  MonthlyPoint,
  RiskFlag,
  SubDimension,
} from '../data/profiles';
import type { ScoringRequest } from './scoringApi';

const SECTORS = [
  'Manufacturing',
  'Services',
  'Trade',
  'Food',
  'Auto Ancillary',
  'Textiles',
] as const;

const CITY_BY_SECTOR: Record<string, { city: string; name: string }[]> = {
  Manufacturing: [
    { city: 'Pune, Maharashtra', name: 'Precision Components Industries' },
    { city: 'Coimbatore, Tamil Nadu', name: 'Southern Fabricators Pvt Ltd' },
    { city: 'Rajkot, Gujarat', name: 'Maruti Engineering Works' },
  ],
  Services: [
    { city: 'Hyderabad, Telangana', name: 'Vertex IT Solutions LLP' },
    { city: 'Gurugram, Haryana', name: 'Nimbus Digital Services' },
    { city: 'Indore, Madhya Pradesh', name: 'Coreline Facility Services' },
  ],
  Trade: [
    { city: 'Delhi', name: 'Apex Trading House' },
    { city: 'Mumbai, Maharashtra', name: 'Harbourline Distributors' },
    { city: 'Jaipur, Rajasthan', name: 'Pink City Merchants Pvt Ltd' },
  ],
  Food: [
    { city: 'Nashik, Maharashtra', name: 'Greenfield Agro Foods' },
    { city: 'Lucknow, Uttar Pradesh', name: 'Awadh Snack Foods Pvt Ltd' },
    { city: 'Vijayawada, Andhra Pradesh', name: 'Coastal Spice Traders' },
  ],
  'Auto Ancillary': [
    { city: 'Chennai, Tamil Nadu', name: 'Chennai Auto Components Pvt Ltd' },
    { city: 'Gurgaon, Haryana', name: 'NCR Autoparts LLP' },
    { city: 'Aurangabad, Maharashtra', name: 'Maratha Forgings' },
  ],
  Textiles: [
    { city: 'Surat, Gujarat', name: 'Mahalaxmi Weaves Pvt Ltd' },
    { city: 'Tiruppur, Tamil Nadu', name: 'Cotton County Exports' },
    { city: 'Panipat, Haryana', name: 'Northern Looms LLP' },
  ],
};

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1));
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateScoringInputs(): ScoringRequest {
  return {
    gst_filing_rate: Math.round(rand(0.5, 0.99) * 100) / 100,
    cash_buffer_ratio: Math.round(rand(-0.1, 0.5) * 100) / 100,
    revenue_growth: Math.round(rand(-0.15, 0.25) * 100) / 100,
    revenue_volatility: Math.round(rand(0.05, 0.4) * 100) / 100,
    avg_net_cash_flow: Math.round(rand(-20000, 150000)),
    negative_cashflow_months: randInt(0, 5),
    headcount_trend: Math.round(rand(-0.1, 0.15) * 100) / 100,
    buyer_hhi: Math.round(rand(0.15, 0.65) * 100) / 100,
    n_buyers: randInt(2, 25),
    vintage_months: randInt(12, 180),
    sector: pick(SECTORS),
  };
}

function clampScore(n: number): number {
  return Math.max(20, Math.min(150, Math.round(n)));
}

function buildSubDimensions(inputs: ScoringRequest): SubDimension[] {
  const complianceScore = clampScore(inputs.gst_filing_rate * 150);
  const cashFlowScore = clampScore(
    75 + (inputs.cash_buffer_ratio * 80) - (inputs.negative_cashflow_months * 12)
  );
  const revenueScore = clampScore(120 - inputs.revenue_volatility * 180 + inputs.revenue_growth * 60);
  const marketScore = clampScore(150 - inputs.buyer_hhi * 120 + (inputs.n_buyers - 5) * 2);
  const opsScore = clampScore(90 + inputs.headcount_trend * 200);
  const debtScore = clampScore(
    80 + (inputs.avg_net_cash_flow / 150000) * 60 - (inputs.negative_cashflow_months * 8)
  );

  return [
    {
      key: 'revenueStability',
      label: 'Revenue Stability',
      score: revenueScore,
      blurb:
        inputs.revenue_volatility < 0.15
          ? 'Low month-on-month variance across the review period'
          : inputs.revenue_volatility < 0.28
          ? 'Moderate variance tied to seasonal demand'
          : 'High month-on-month volatility — project-based revenue',
    },
    {
      key: 'cashFlowHealth',
      label: 'Cash Flow Health',
      score: cashFlowScore,
      blurb:
        inputs.negative_cashflow_months === 0
          ? 'Positive operating cash flow in every month'
          : `${inputs.negative_cashflow_months} negative month${inputs.negative_cashflow_months > 1 ? 's' : ''} in the last year`,
    },
    {
      key: 'debtServiceability',
      label: 'Debt Serviceability',
      score: debtScore,
      blurb:
        inputs.avg_net_cash_flow > 80000
          ? 'DSCR comfortably above threshold'
          : inputs.avg_net_cash_flow > 20000
          ? 'DSCR adequate but buffer is thin'
          : 'DSCR near 1.0x — limited room to absorb shocks',
    },
    {
      key: 'operationalConsistency',
      label: 'Operational Consistency',
      score: opsScore,
      blurb:
        inputs.headcount_trend > 0.05
          ? 'Growing workforce with stable payroll cadence'
          : inputs.headcount_trend < -0.03
          ? 'Headcount declining — monitor attrition'
          : 'Stable workforce and payroll cadence',
    },
    {
      key: 'marketPositioning',
      label: 'Market Positioning',
      score: marketScore,
      blurb:
        inputs.buyer_hhi > 0.45
          ? 'High buyer concentration — top buyers dominate revenue'
          : inputs.n_buyers > 15
          ? 'Well-diversified buyer base'
          : 'Moderate buyer diversification',
    },
    {
      key: 'compliance',
      label: 'Compliance',
      score: complianceScore,
      blurb:
        inputs.gst_filing_rate > 0.9
          ? 'GST returns filed on time across the review period'
          : inputs.gst_filing_rate > 0.7
          ? 'Occasional filing delays on record'
          : 'Multiple filing gaps — compliance needs attention',
    },
  ];
}

function buildMonthly(inputs: ScoringRequest): MonthlyPoint[] {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const base = Math.max(15, inputs.avg_net_cash_flow / 4000);
  const vol = inputs.revenue_volatility;
  return months.map((month, i) => {
    const seasonal = Math.sin((i / 12) * Math.PI * 2) * base * 0.18;
    const noise = (Math.random() - 0.5) * base * vol * 1.6;
    const revenue = Math.max(8, Math.round(base + seasonal + noise));
    const cashFlow = Math.round((revenue * (0.18 + inputs.cash_buffer_ratio * 0.2)) * 10) / 10;
    return { month, revenue, cashFlow };
  });
}

function buildRiskFlags(inputs: ScoringRequest): RiskFlag[] {
  const flags: RiskFlag[] = [];

  if (inputs.gst_filing_rate >= 0.9) {
    flags.push({
      id: 'r-gst',
      level: 'green',
      title: 'GST Compliance Consistent',
      detail: `Filing rate of ${Math.round(inputs.gst_filing_rate * 100)}% — returns filed on time across the review period.`,
    });
  } else if (inputs.gst_filing_rate >= 0.7) {
    flags.push({
      id: 'r-gst',
      level: 'amber',
      title: 'Occasional Filing Delays',
      detail: `Filing rate of ${Math.round(inputs.gst_filing_rate * 100)}% indicates some delayed returns in the recent period.`,
    });
  } else {
    flags.push({
      id: 'r-gst',
      level: 'red',
      title: 'Filing Gaps on Record',
      detail: `Filing rate of ${Math.round(inputs.gst_filing_rate * 100)}% — multiple missed returns, a material compliance risk.`,
    });
  }

  if (inputs.negative_cashflow_months >= 3) {
    flags.push({
      id: 'r-cf',
      level: 'red',
      title: 'Negative Cash Flow Months',
      detail: `${inputs.negative_cashflow_months} of the last twelve months showed negative operating cash flow, signalling working-capital stress.`,
    });
  } else if (inputs.negative_cashflow_months >= 1) {
    flags.push({
      id: 'r-cf',
      level: 'amber',
      title: 'Seasonal Cash Flow Gaps',
      detail: `${inputs.negative_cashflow_months} negative cash flow month${inputs.negative_cashflow_months > 1 ? 's' : ''} in the last year.`,
    });
  } else {
    flags.push({
      id: 'r-cf',
      level: 'green',
      title: 'Positive Cash Flow',
      detail: 'Operating cash flow was positive in every month of the review period.',
    });
  }

  if (inputs.buyer_hhi > 0.45) {
    flags.push({
      id: 'r-buyer',
      level: 'red',
      title: 'Concentrated Buyer Risk',
      detail: `Buyer concentration (HHI) of ${inputs.buyer_hhi.toFixed(2)} — a small number of buyers dominate revenue.`,
    });
  } else if (inputs.buyer_hhi > 0.3) {
    flags.push({
      id: 'r-buyer',
      level: 'amber',
      title: 'Moderate Buyer Concentration',
      detail: `Buyer HHI of ${inputs.buyer_hhi.toFixed(2)} — worth diversifying the order book.`,
    });
  } else {
    flags.push({
      id: 'r-buyer',
      level: 'green',
      title: 'Diversified Buyer Base',
      detail: `Buyer HHI of ${inputs.buyer_hhi.toFixed(2)} across ${inputs.n_buyers} active buyers.`,
    });
  }

  if (inputs.revenue_volatility > 0.28) {
    flags.push({
      id: 'r-vol',
      level: 'amber',
      title: 'Lumpy Revenue Pattern',
      detail: `Revenue volatility of ${(inputs.revenue_volatility * 100).toFixed(0)}% — month-to-month swings are above the sector benchmark.`,
    });
  }

  if (inputs.headcount_trend < -0.03) {
    flags.push({
      id: 'r-hc',
      level: 'amber',
      title: 'Headcount Declining',
      detail: `Employee count trend of ${(inputs.headcount_trend * 100).toFixed(1)}% — possible attrition or downsizing.`,
    });
  } else if (inputs.headcount_trend > 0.05) {
    flags.push({
      id: 'r-hc',
      level: 'green',
      title: 'Growing Workforce',
      detail: `Employee count trend of ${(inputs.headcount_trend * 100).toFixed(1)}% — steady hiring over the review period.`,
    });
  }

  return flags;
}

function buildLoans(inputs: ScoringRequest, score: number | null): LoanRecommendation[] {
  const healthy = (score ?? 600) >= 600;
  const loans: LoanRecommendation[] = [];

  loans.push({
    id: 'l-wc',
    type: 'Working Capital Loan',
    amount: healthy ? '₹60 Lakh' : '₹30 Lakh',
    rate: healthy ? '11.2%' : '13.5%',
    tenure: '36 months',
    match: healthy ? 88 : 64,
    rationale: healthy
      ? 'Stable cash flow supports a revolving credit line.'
      : 'Structured against receivables; a personal guarantee may be required.',
    badge: healthy ? 'recommended' : 'conditional',
  });

  loans.push({
    id: 'l-tl',
    type: 'Term Loan',
    amount: healthy ? '₹1 Cr' : '₹40 Lakh',
    rate: healthy ? '9.8%' : '12.5%',
    tenure: '60 months',
    match: healthy ? 78 : 55,
    rationale: healthy
      ? 'Healthy debt service coverage leaves room for an asset-backed term loan.'
      : 'Eligible with collateral; thin DSCR limits the ticket size.',
    badge: healthy ? 'eligible' : 'conditional',
  });

  if (inputs.n_buyers >= 5) {
    loans.push({
      id: 'l-inv',
      type: 'Invoice Discounting',
      amount: '₹35 Lakh',
      rate: '12.5%',
      tenure: '90 days',
      match: healthy ? 76 : 60,
      rationale: 'A diversified buyer book makes receivables discountable at competitive rates.',
      badge: 'eligible',
    });
  }

  return loans;
}

export function generateProfile(gstin: string, inputs: ScoringRequest): BusinessProfile {
  const sectorOptions = CITY_BY_SECTOR[inputs.sector] ?? CITY_BY_SECTOR.Manufacturing;
  const place = pick(sectorOptions);
  const incorporatedYear = new Date().getFullYear() - Math.floor(inputs.vintage_months / 12);
  const employees = Math.max(5, Math.round(20 + inputs.vintage_months * 0.4 + inputs.headcount_trend * 100));
  const turnoverLakhs = Math.max(40, Math.round(80 + inputs.avg_net_cash_flow / 5000 + inputs.vintage_months * 1.5));
  const turnoverCr = (turnoverLakhs / 100).toFixed(1);
  const tradeName = place.name.replace(/(Pvt Ltd|LLP)$/, '').trim();

  return {
    id: `sim-${gstin}`,
    legalName: place.name,
    tradeName,
    gstin,
    industry: inputs.sector,
    city: place.city,
    incorporatedYear,
    employees,
    annualTurnover: `₹${turnoverCr} Cr`,
    compositeScore: 0,
    rating: '—',
    subDimensions: buildSubDimensions(inputs),
    monthly: buildMonthly(inputs),
    riskFlags: buildRiskFlags(inputs),
    loans: [],
  };
}

export function attachLoans(profile: BusinessProfile, inputs: ScoringRequest, score: number | null): BusinessProfile {
  return { ...profile, loans: buildLoans(inputs, score) };
}
