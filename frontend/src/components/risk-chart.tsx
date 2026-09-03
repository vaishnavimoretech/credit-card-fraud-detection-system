"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { apiFetch } from "@/lib/api";

interface RiskItem {
  name: string;
  value: number;
}

export default function RiskChart() {
  const [data, setData] = useState<RiskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const COLORS = [
  "#ef4444", // Fraud = Red
  "#22c55e", // Safe = Green
];

  useEffect(() => {
    let mounted = true;
async function loadRiskDistribution() {
  try {
    const result = await apiFetch("/analytics");

    console.log(
      "Risk Distribution Data:",
      result
    );

    if (mounted) {
      setData(
        Array.isArray(result?.risk_distribution)
          ? result.risk_distribution
          : []
      );
    }
  } catch (error) {
    console.error(
      "Failed to load risk distribution:",
      error
    );

    if (mounted) {
      setError(
        "Unable to load risk distribution."
      );
    }
  } finally {
    if (mounted) {
      setLoading(false);
    }
  }
}

    loadRiskDistribution();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading risk distribution...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No risk distribution data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) =>
            `${name} ${((percent ?? 0) * 100).toFixed(1)}%`
          }
        >
          {data.map((entry, index) => (
          <Cell
           key={`${entry.name}-${index}`}
           fill={COLORS[index % COLORS.length]}
  />
       ))}
        </Pie>

        <Tooltip
          formatter={(value, name) => [
            Number(value).toLocaleString(),
            name,
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}