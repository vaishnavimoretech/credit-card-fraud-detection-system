"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { apiFetch } from "@/lib/api";

interface FraudTrendItem {
  transaction: string;
  fraud: number;
}

export default function FraudChart() {
  const [data, setData] = useState<FraudTrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadTrend() {
  try {
    const result = await apiFetch("/fraud-trend");

    console.log("Fraud Trend Data:", result);

    if (mounted) {
      setData(
        Array.isArray(result)
          ? result.slice(-50)
          : []
      );
    }
  } catch (error) {
    console.error(
      "Failed to load fraud trend:",
      error
    );

    if (mounted) {
      setError("Unable to load fraud trend.");
    }
  } finally {
    if (mounted) {
      setLoading(false);
    }
  }
}

    loadTrend();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading fraud trend...
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
        No fraud trend data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 20,
          left: 0,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

        <XAxis
          dataKey="transaction"
          tick={{ fontSize: 11 }}
          interval="preserveStartEnd"
        />

        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => `${value}%`}
        />

        <Tooltip
          formatter={(value) => [
            `${Number(value).toFixed(2)}%`,
            "Fraud Risk",
          ]}
        />

        <Line
          type="monotone"
          dataKey="fraud"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}