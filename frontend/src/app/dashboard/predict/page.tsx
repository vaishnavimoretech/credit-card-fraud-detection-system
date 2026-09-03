"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

interface PredictionResult {
  is_fraud: boolean;
  fraud_probability: number;
}

export default function PredictForm() {
  const [amount, setAmount] = useState("");
  const [result, setResult] =
    useState<PredictionResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePredict() {
    setError("");
    setResult(null);

    const numericAmount = Number(amount);

    // Validation
    if (!amount.trim()) {
      setError("Please enter a transaction amount.");
      return;
    }

    if (Number.isNaN(numericAmount)) {
      setError("Please enter a valid amount.");
      return;
    }

    if (numericAmount <= 0) {
      setError("Transaction amount must be greater than 0.");
      return;
    }

    if (numericAmount > 10000000) {
      setError(
        "Transaction amount is too large. Please enter a valid amount."
      );
      return;
    }

    try {
      setLoading(true);

      const data = (await apiFetch("/predict-simple", {
        method: "POST",
        body: JSON.stringify({
          amount: numericAmount,
        }),
      })) as PredictionResult;

      setResult(data);
    } catch (error) {
      console.error("Prediction failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Prediction failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearPrediction() {
    setAmount("");
    setResult(null);
    setError("");
  }

  const risk =
    result
      ? Number(result.fraud_probability) * 100
      : 0;

  function getRiskLevel() {
    if (risk >= 70) {
      return {
        text: "High Risk",
        className: "text-red-400",
      };
    }

    if (risk >= 40) {
      return {
        text: "Medium Risk",
        className: "text-yellow-400",
      };
    }

    return {
      text: "Low Risk",
      className: "text-green-400",
    };
  }

  const riskLevel = getRiskLevel();

  return (
    <div className="space-y-5">
      {/* Amount Input */}
      <div>
        <label
          htmlFor="transaction-amount"
          className="mb-2 block text-sm font-medium text-white/80"
        >
          Transaction Amount
        </label>

        <Input
          id="transaction-amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter transaction amount"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
            setResult(null);
          }}
          disabled={loading}
          className="h-12"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={handlePredict}
          disabled={!amount || loading}
          className="h-12 flex-1"
        >
          {loading
            ? "Analyzing Transaction..."
            : "Check Fraud Risk"}
        </Button>

        {(result || amount) && !loading && (
          <Button
            type="button"
            variant="outline"
            onClick={clearPrediction}
            className="h-12"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Result */}
      {result && (
        <div
          className={`rounded-2xl border p-6 ${
            result.is_fraud
              ? "border-red-500/30 bg-red-500/10"
              : "border-green-500/30 bg-green-500/10"
          }`}
        >
          {/* Status */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p
                className={`text-lg font-bold ${
                  result.is_fraud
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {result.is_fraud
                  ? "⚠️ Fraudulent Transaction"
                  : "✅ Genuine Transaction"}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Transaction Amount: ₹
                {numericAmountDisplay(amount)}
              </p>
            </div>

            {/* Risk */}
            <div className="text-right">
              <p className="text-3xl font-bold">
                {risk.toFixed(2)}%
              </p>

              <p
                className={`text-sm font-semibold ${riskLevel.className}`}
              >
                {riskLevel.text}
              </p>
            </div>
          </div>

          {/* Probability Bar */}
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">
                Fraud Probability
              </span>

              <span className="font-semibold">
                {risk.toFixed(2)}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  result.is_fraud
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min(100, Math.max(0, risk))}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function numericAmountDisplay(value: string) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return number.toFixed(2);
}