export type RiskLevel = 'green' | 'amber' | 'red';

export type SubDimensionKey =
  | 'revenueStability'
  | 'cashFlowHealth'
  | 'debtServiceability'
  | 'operationalConsistency'
  | 'marketPositioning'
  | 'compliance';

export interface SubDimension {
  key: SubDimensionKey;
  label: string;
  score: number; // out of 150
  blurb: string;
}

export interface MonthlyPoint {
  month: string;
  revenue: number;
  cashFlow: number;
}

export interface RiskFlag {
  id: string;
  level: RiskLevel;
  title: string;
  detail: string;
}

export interface LoanRecommendation {
  id: string;
  type: string;
  amount: string;
  rate: string;
  tenure: string;
  match: number; // 0-100
  rationale: string;
  badge: 'recommended' | 'eligible' | 'conditional';
}

export interface BusinessProfile {
  id: string;
  legalName: string;
  tradeName: string;
  gstin: string;
  industry: string;
  city: string;
  incorporatedYear: number;
  employees: number;
  annualTurnover: string;
  compositeScore: number; // out of 900
  rating: string;
  subDimensions: SubDimension[];
  monthly: MonthlyPoint[];
  riskFlags: RiskFlag[];
  loans: LoanRecommendation[];
}

export const PROFILES: BusinessProfile[] = [
  {
    id: 'shree',
    legalName: 'Shree Balaji Textiles Pvt Ltd',
    tradeName: 'Balaji Fabrics',
    gstin: '27AABCS1234L1Z5',
    industry: 'Textile Manufacturing',
    city: 'Surat, Gujarat',
    incorporatedYear: 2014,
    employees: 48,
    annualTurnover: '₹4.8 Cr',
    compositeScore: 742,
    rating: 'AA-',
    subDimensions: [
      { key: 'revenueStability', label: 'Revenue Stability', score: 128, blurb: 'Low month-on-month variance across 12 months' },
      { key: 'cashFlowHealth', label: 'Cash Flow Health', score: 119, blurb: 'Positive operating cash flow in 11 of 12 months' },
      { key: 'debtServiceability', label: 'Debt Serviceability', score: 132, blurb: 'DSCR of 1.8x — comfortably above threshold' },
      { key: 'operationalConsistency', label: 'Operational Consistency', score: 121, blurb: 'Stable UPI settlement & EPFO payroll cadence' },
      { key: 'marketPositioning', label: 'Market Positioning', score: 110, blurb: 'Established supplier network, repeat orders' },
      { key: 'compliance', label: 'Compliance', score: 132, blurb: 'GST returns filed on time for 24 months' },
    ],
    monthly: [
      { month: 'Jul', revenue: 38, cashFlow: 6.2 },
      { month: 'Aug', revenue: 41, cashFlow: 7.1 },
      { month: 'Sep', revenue: 39, cashFlow: 5.8 },
      { month: 'Oct', revenue: 44, cashFlow: 8.4 },
      { month: 'Nov', revenue: 46, cashFlow: 9.1 },
      { month: 'Dec', revenue: 52, cashFlow: 11.2 },
      { month: 'Jan', revenue: 48, cashFlow: 8.9 },
      { month: 'Feb', revenue: 45, cashFlow: 7.6 },
      { month: 'Mar', revenue: 54, cashFlow: 12.4 },
      { month: 'Apr', revenue: 49, cashFlow: 9.2 },
      { month: 'May', revenue: 47, cashFlow: 8.1 },
      { month: 'Jun', revenue: 51, cashFlow: 10.3 },
    ],
    riskFlags: [
      { id: 'r1', level: 'green', title: 'GST Compliance Consistent', detail: 'All GSTR-1 and GSTR-3B filings on time for the last 24 months. No tax disputes on record.' },
      { id: 'r2', level: 'green', title: 'Healthy Cash Reserves', detail: 'Average daily UPI settlements of ₹1.4 lakh indicate steady demand and liquid collections.' },
      { id: 'r3', level: 'amber', title: 'Seasonal Revenue Dip', detail: 'Revenue dropped 9% in Feb–Mar vs the festive quarter. Normal for textiles but worth monitoring.' },
      { id: 'r4', level: 'green', title: 'Stable Workforce', detail: 'EPFO contributions show 48 employees with under 4% attrition over 12 months.' },
    ],
    loans: [
      { id: 'l1', type: 'Working Capital Loan', amount: '₹75 Lakh', rate: '11.2%', tenure: '36 months', match: 94, rationale: 'Strong cash flow and stable UPI settlements support a revolving credit line.', badge: 'recommended' },
      { id: 'l2', type: 'Machinery Term Loan', amount: '₹1.2 Cr', rate: '9.8%', tenure: '60 months', match: 81, rationale: 'Healthy DSCR of 1.8x leaves room for an asset-backed term loan.', badge: 'eligible' },
      { id: 'l3', type: 'Invoice Discounting', amount: '₹40 Lakh', rate: '12.5%', tenure: '90 days', match: 76, rationale: 'Repeat corporate buyers make receivables discountable at competitive rates.', badge: 'eligible' },
    ],
  },
  {
    id: 'coastal',
    legalName: 'Coastal Seafoods Exporters LLP',
    tradeName: 'Coastal Catch',
    gstin: '33AAHFC8765K1Z2',
    industry: 'Seafood Processing & Export',
    city: 'Kochi, Kerala',
    incorporatedYear: 2018,
    employees: 73,
    annualTurnover: '₹7.1 Cr',
    compositeScore: 631,
    rating: 'BBB+',
    subDimensions: [
      { key: 'revenueStability', label: 'Revenue Stability', score: 98, blurb: 'Moderate volatility tied to export seasonality' },
      { key: 'cashFlowHealth', label: 'Cash Flow Health', score: 104, blurb: 'Two negative months during monsoon lull' },
      { key: 'debtServiceability', label: 'Debt Serviceability', score: 112, blurb: 'DSCR of 1.3x — adequate but thin buffer' },
      { key: 'operationalConsistency', label: 'Operational Consistency', score: 108, blurb: 'EPFO payroll steady, UPI settlements lumpy' },
      { key: 'marketPositioning', label: 'Market Positioning', score: 119, blurb: 'Strong export demand, 3 anchor buyers' },
      { key: 'compliance', label: 'Compliance', score: 90, blurb: 'One delayed GSTR-3B filing in the last year' },
    ],
    monthly: [
      { month: 'Jul', revenue: 62, cashFlow: 9.4 },
      { month: 'Aug', revenue: 58, cashFlow: 7.1 },
      { month: 'Sep', revenue: 49, cashFlow: -1.2 },
      { month: 'Oct', revenue: 44, cashFlow: -2.8 },
      { month: 'Nov', revenue: 51, cashFlow: 3.6 },
      { month: 'Dec', revenue: 67, cashFlow: 12.1 },
      { month: 'Jan', revenue: 72, cashFlow: 14.8 },
      { month: 'Feb', revenue: 69, cashFlow: 13.2 },
      { month: 'Mar', revenue: 64, cashFlow: 10.4 },
      { month: 'Apr', revenue: 58, cashFlow: 8.1 },
      { month: 'May', revenue: 55, cashFlow: 6.7 },
      { month: 'Jun', revenue: 61, cashFlow: 9.9 },
    ],
    riskFlags: [
      { id: 'r1', level: 'amber', title: 'Seasonal Cash Flow Gaps', detail: 'Two consecutive months of negative operating cash flow (Sep–Oct) during the monsoon off-season.' },
      { id: 'r2', level: 'amber', title: 'Filing Delay on Record', detail: 'One GSTR-3B filing delayed by 11 days in November. No penalty, but breaks the clean-streak metric.' },
      { id: 'r3', level: 'green', title: 'Strong Export Order Book', detail: 'Three repeat international buyers with confirmed POs worth ₹2.1 Cr for the next quarter.' },
      { id: 'r4', level: 'red', title: 'Concentrated Buyer Risk', detail: 'Top 2 buyers account for 61% of revenue. Loss of either would materially impact cash flow.' },
      { id: 'r5', level: 'amber', title: 'Thin Debt Service Buffer', detail: 'DSCR of 1.3x leaves limited room to absorb a revenue shock while servicing existing debt.' },
    ],
    loans: [
      { id: 'l1', type: 'Export Packing Credit', amount: '₹1.5 Cr', rate: '8.4%', tenure: '180 days', match: 88, rationale: 'Backed by confirmed export orders; pre-shipment finance matches the seasonal cycle.', badge: 'recommended' },
      { id: 'l2', type: 'Cash Credit Limit', amount: '₹90 Lakh', rate: '11.9%', tenure: 'Revolving', match: 72, rationale: 'Bridges the Sep–Oct cash gap, but concentration risk caps the limit.', badge: 'conditional' },
      { id: 'l3', type: 'Buyer Consolidation Term Loan', amount: '₹60 Lakh', rate: '10.5%', tenure: '48 months', match: 64, rationale: 'Eligible if at least one anchor buyer contract is extended beyond 12 months.', badge: 'conditional' },
    ],
  },
  {
    id: 'metro',
    legalName: 'Metro Kitchenworks Pvt Ltd',
    tradeName: 'Metro Kitchenworks',
    gstin: '29AALCM4521P1Z8',
    industry: 'Commercial Kitchen Equipment',
    city: 'Bengaluru, Karnataka',
    incorporatedYear: 2020,
    employees: 31,
    annualTurnover: '₹2.9 Cr',
    compositeScore: 518,
    rating: 'BB',
    subDimensions: [
      { key: 'revenueStability', label: 'Revenue Stability', score: 76, blurb: 'High variance — project-based revenue' },
      { key: 'cashFlowHealth', label: 'Cash Flow Health', score: 82, blurb: 'Four negative months in the last year' },
      { key: 'debtServiceability', label: 'Debt Serviceability', score: 71, blurb: 'DSCR of 1.05x — barely covering obligations' },
      { key: 'operationalConsistency', label: 'Operational Consistency', score: 94, blurb: 'Irregular UPI volumes, stable payroll' },
      { key: 'marketPositioning', label: 'Market Positioning', score: 103, blurb: 'Niche B2B supplier, growing reputation' },
      { key: 'compliance', label: 'Compliance', score: 92, blurb: 'GST current, one EPFO delay last quarter' },
    ],
    monthly: [
      { month: 'Jul', revenue: 22, cashFlow: 2.1 },
      { month: 'Aug', revenue: 31, cashFlow: 5.4 },
      { month: 'Sep', revenue: 18, cashFlow: -1.8 },
      { month: 'Oct', revenue: 14, cashFlow: -3.2 },
      { month: 'Nov', revenue: 28, cashFlow: 4.1 },
      { month: 'Dec', revenue: 35, cashFlow: 6.8 },
      { month: 'Jan', revenue: 19, cashFlow: -0.9 },
      { month: 'Feb', revenue: 24, cashFlow: 2.4 },
      { month: 'Mar', revenue: 33, cashFlow: 5.9 },
      { month: 'Apr', revenue: 16, cashFlow: -2.4 },
      { month: 'May', revenue: 27, cashFlow: 3.7 },
      { month: 'Jun', revenue: 30, cashFlow: 5.1 },
    ],
    riskFlags: [
      { id: 'r1', level: 'red', title: 'Negative Cash Flow Months', detail: 'Four of the last twelve months showed negative operating cash flow, signalling working-capital stress.' },
      { id: 'r2', level: 'red', title: 'Tight Debt Service Coverage', detail: 'DSCR of 1.05x means almost no buffer. A single delayed receivable could trigger a missed payment.' },
      { id: 'r3', level: 'amber', title: 'Lumpy Revenue Pattern', detail: 'Revenue swings between ₹14L and ₹35L month-to-month, typical of project-based B2B sales.' },
      { id: 'r4', level: 'green', title: 'Compliant & Current', detail: 'All GST returns filed on time; one EPFO contribution was delayed but has since been regularised.' },
    ],
    loans: [
      { id: 'l1', type: 'Secured Working Capital', amount: '₹35 Lakh', rate: '13.2%', tenure: '24 months', match: 71, rationale: 'Structured against receivables; requires a personal guarantee given the thin DSCR.', badge: 'conditional' },
      { id: 'l2', type: 'Bill Discounting Facility', amount: '₹20 Lakh', rate: '14.0%', tenure: '120 days', match: 66, rationale: 'Available against accepted invoices from rated buyers; helps smooth the lumpy cash cycle.', badge: 'eligible' },
    ],
  },
];
