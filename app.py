from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # allows Bolt's frontend to call this from a browser

model = joblib.load("msme_model.pkl")
with open("model_columns.json") as f:
    MODEL_COLUMNS = json.load(f)

def compute_score(payload):
    # payload is a dict of raw business inputs from the frontend
    row = {col: 0 for col in MODEL_COLUMNS}  # default everything to 0

    row["revenue_growth"] = payload.get("revenue_growth", 0)
    row["revenue_volatility"] = payload.get("revenue_volatility", 0)
    row["avg_net_cash_flow"] = payload.get("avg_net_cash_flow", 0)
    row["negative_cashflow_months"] = payload.get("negative_cashflow_months", 0)
    row["cash_buffer_ratio"] = payload.get("cash_buffer_ratio", 0)
    row["gst_filing_rate"] = payload.get("gst_filing_rate", 0)
    row["headcount_trend"] = payload.get("headcount_trend", 0)
    row["buyer_hhi"] = payload.get("buyer_hhi", 0)
    row["n_buyers"] = payload.get("n_buyers", 0)
    row["vintage_months"] = payload.get("vintage_months", 0)

    sector_col = f"sector_{payload.get('sector', '')}"
    if sector_col in row:
        row[sector_col] = 1

    X = pd.DataFrame([row])[MODEL_COLUMNS]
    prob = model.predict_proba(X)[0][1]
    composite_score = int(300 + prob * 600)  # maps 0-1 probability to a 300-900 score

    if composite_score >= 700:
        grade = "A"
    elif composite_score >= 500:
        grade = "B"
    else:
        grade = "C"

    return {
        "composite_score": composite_score,
        "grade": grade,
        "repayment_probability": round(float(prob), 3),
    }

@app.route("/score", methods=["POST"])
def score():
    data = request.get_json()
    result = compute_score(data)
    return jsonify(result)

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "MSME scoring API is running"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)