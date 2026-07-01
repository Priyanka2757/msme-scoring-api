# MSME Financial Health Card

AI-powered MSME credit scoring system using alternate data sources 
(GST, UPI, EPFO, Account Aggregator) to assess financial health 
for New-to-Credit and New-to-Bank businesses.

## Live Demo
https://msme-financial-healt-lnue.bolt.host

## What's in this repo

- /frontend  — React dashboard (built with Bolt)
- app.py     — Flask scoring API
- msme_model.pkl — Trained XGBoost model (AUC 0.878)
- model_columns.json — Feature schema

## How it works

1. User enters a GSTIN in the dashboard
2. Dashboard sends business financial metrics to the scoring API
3. XGBoost model computes a composite score out of 900
4. Dashboard displays the Health Card with 6 sub-dimension scores,
   risk flags, and loan recommendations

## Tech stack

- Frontend: React (Bolt)
- Scoring API: Python Flask, hosted on Render
- ML Model: XGBoost, trained on 1,500 synthetic MSME profiles
- Model AUC: 0.878 (cross-validated: 0.854 ± 0.009)

## API

POST https://msme-scoring-api.onrender.com/

Input: JSON with gst_filing_rate, cash_buffer_ratio, revenue_growth,
revenue_volatility, avg_net_cash_flow, negative_cashflow_months,
headcount_trend, buyer_hhi, n_buyers, vintage_months, sector

Output: { composite_score, grade, repayment_probability }
