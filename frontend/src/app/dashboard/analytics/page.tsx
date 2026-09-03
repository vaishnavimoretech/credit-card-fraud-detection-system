"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { AlertTriangle, ShieldCheck, Activity, TrendingUp } from "lucide-react";

interface AnalyticsData {
  total_transactions: number;
  fraud_transactions: number;
  safe_transactions: number;
  fraud_rate: number;
  average_risk: number;
  risk_distribution: {
    name: string;
    value: number;
  }[];
  fraud_trend: {
    transaction: string;
    risk: number;
    status: string;
  }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const result = await apiFetch("/analytics");
        setData(result);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-muted-foreground">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center">
        <p className="text-lg font-semibold">
          Analytics data unavailable
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Make some predictions first and try again.
        </p>
      </div>
    );
  }
const trendData = data.fraud_trend.slice(-50);

const maxRisk =
  trendData.length > 0
    ? trendData.reduce(
        (max, item) => Math.max(max, item.risk),
        1
      )
    : 1;
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">
          Fraud Analytics
        </h1>

        <p className="mt-2 text-muted-foreground">
          Analyze fraud detection performance using real prediction data.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="glass-card rounded-3xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total Transactions
            </p>

            <Activity className="h-6 w-6 text-cyan-400" />
          </div>

          <p className="text-4xl font-bold">
            {data.total_transactions}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Fraud Detected
            </p>

            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>

          <p className="text-4xl font-bold text-red-400">
            {data.fraud_transactions}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Safe Transactions
            </p>

            <ShieldCheck className="h-6 w-6 text-green-400" />
          </div>

          <p className="text-4xl font-bold text-green-400">
            {data.safe_transactions}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Fraud Rate
            </p>

            <TrendingUp className="h-6 w-6 text-purple-400" />
          </div>

          <p className="text-4xl font-bold text-purple-400">
            {data.fraud_rate}%
          </p>
        </div>

      </div>

      {/* Risk Overview */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Fraud / Safe */}
        <div className="glass-card rounded-3xl p-6">

          <h2 className="text-xl font-semibold">
            Risk Distribution
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Fraudulent versus safe transactions.
          </p>

          <div className="mt-8 space-y-6">

            <div>
              <div className="mb-2 flex justify-between">
                <span>Fraud</span>

                <span className="font-semibold text-red-400">
                  {data.fraud_transactions}
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{
                    width:
                      data.total_transactions > 0
                        ? `${(
                            (data.fraud_transactions /
                              data.total_transactions) *
                            100
                          ).toFixed(2)}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <span>Safe</span>

                <span className="font-semibold text-green-400">
                  {data.safe_transactions}
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{
                    width:
                      data.total_transactions > 0
                        ? `${(
                            (data.safe_transactions /
                              data.total_transactions) *
                            100
                          ).toFixed(2)}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

          </div>

        </div>

        {/* Average Risk */}
        <div className="glass-card rounded-3xl p-6">

          <h2 className="text-xl font-semibold">
            Average Risk
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Average fraud probability across predictions.
          </p>

          <div className="mt-10 flex items-center justify-center">

            <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-16 border-cyan-500/20">

              <div className="text-center">
                <p className="text-4xl font-bold text-cyan-400">
                  {data.average_risk}%
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Average Risk
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Fraud Trend */}
      <div className="glass-card rounded-3xl p-6">

        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Fraud Risk Trend
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Fraud probability for analyzed transactions.
          </p>
        </div>

        {data.fraud_trend.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No prediction data available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <div className="flex min-w-175 items-end gap-3">

             {data.fraud_trend.slice(-50).map((item) => (
                <div
                  key={item.transaction}
                  className="flex min-w-10 flex-1 flex-col items-center gap-2"
                >

                  <span className="text-xs text-muted-foreground">
                    {item.risk.toFixed(1)}%
                  </span>

                  <div className="flex h-64 w-full items-end rounded-lg bg-white/5">

                    <div
                      className={`w-full rounded-lg transition-all ${
                        item.status === "Fraud"
                          ? "bg-red-500"
                          : "bg-cyan-500"
                      }`}
                      style={{
                        height: `${Math.max(
                          (item.risk / maxRisk) * 100,
                          3
                        )}%`,
                      }}
                    />

                  </div>

                  <span className="text-xs text-muted-foreground">
                    {item.transaction}
                  </span>

                </div>
              ))}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}