"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function RiskGauge() {
  const [risk, setRisk] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRisk() {
      try {
        const data = await apiFetch("/risk-gauge");

        const score = Number(data?.risk_score ?? 0);

        // Keep risk between 0 and 100
        const safeScore = Math.min(
          100,
          Math.max(0, score)
        );

        setRisk(safeScore);
      } catch (error) {
        console.error(
          "Failed to load risk score:",
          error
        );

        setRisk(0);
      } finally {
        setLoading(false);
      }
    }

    loadRisk();
  }, []);

  const getRiskLevel = () => {
    if (risk >= 70) {
      return {
        label: "High Risk",
        className: "text-red-400",
      };
    }

    if (risk >= 40) {
      return {
        label: "Medium Risk",
        className: "text-yellow-400",
      };
    }

    return {
      label: "Low Risk",
      className: "text-green-400",
    };
  };

  const riskLevel = getRiskLevel();

  const circumference = 314;

  const dashOffset =
    circumference -
    (circumference * risk) / 100;

  if (loading) {
    return (
      <div className="flex min-h-52 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading risk assessment...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-52 flex-col items-center justify-center">
      <div className="relative h-52 w-52">
        <svg
          viewBox="0 0 120 120"
          className="h-full w-full -rotate-90"
        >
          {/* Background Circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
          />

          {/* Progress Circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="url(#riskGradient)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          <defs>
            <linearGradient
              id="riskGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="#06b6d4"
              />

              <stop
                offset="100%"
                stopColor="#8b5cf6"
              />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold">
            {risk.toFixed(1)}%
          </div>

          <div className="mt-1 text-sm text-muted-foreground">
            Risk Score
          </div>
        </div>
      </div>

      {/* Risk Level */}
      <div
        className={`mt-2 text-lg font-semibold ${riskLevel.className}`}
      >
        {riskLevel.label}
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        AI-powered transaction risk assessment
      </p>
    </div>
  );
}