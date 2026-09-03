"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

import {
  Shield,
  CreditCard,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import FraudChart from "@/components/fraud-chart";
import RiskChart from "@/components/risk-chart";
import TransactionsTable from "@/components/transactions-table";
import RiskGauge from "@/components/risk-gauge";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [username] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("username") || "User"
      : "User"
  );

  const [statsData, setStatsData] = useState({
    total_transactions: 0,
    fraud_transactions: 0,
    risk_score: 0,
    accuracy: 0,
  });

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.replace("/login");
    return;
  }

  const loadStats = async () => {
    try {
      const data = await apiFetch(
        "/dashboard-stats"
      );

      setStatsData(data);
    } catch (error) {
      console.error(
        "Failed to load dashboard stats:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  loadStats();

  const interval = setInterval(
    loadStats,
    10000
  );

  return () => clearInterval(interval);

}, [router]);

    function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    router.replace("/login");
  }

  const stats = [
    {
      title: "Total Transactions",
      value:
        statsData.total_transactions.toString(),
      icon: CreditCard,
      color: "text-cyan-400",
    },
    {
      title: "Flagged Fraud",
      value:
        statsData.fraud_transactions.toString(),
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      title: "Risk Score",
      value: `${statsData.risk_score}%`,
      icon: Shield,
      color: "text-yellow-400",
    },
    {
      title: "Detection Accuracy",
      value: `${statsData.accuracy}%`,
      icon: TrendingUp,
      color: "text-green-400",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Fraud Detection Dashboard
          </h1>

          <p className="mt-2 text-muted-foreground">
            Welcome, {username}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="
            rounded-xl
            bg-red-500
            px-5
            py-2
            text-white
            transition
            hover:bg-red-600
          "
        >
          Logout
        </button>

      </div>

      {/* KPI CARDS */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                glass-card
                rounded-3xl
                p-6
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]
              "
            >
              <div className="mb-4 flex items-center justify-between">

                <h3 className="text-sm text-muted-foreground">
                  {item.title}
                </h3>

                <Icon
                  className={`h-6 w-6 ${item.color}`}
                />

              </div>

              <div className="text-5xl font-bold">
                {item.value}
              </div>
            </div>
          );
        })}

      </div>

      {/* CHARTS */}

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="glass-card rounded-3xl p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Fraud Trend Analysis
          </h2>

          <div className="h-80">
            <FraudChart />
          </div>

        </div>

        <div className="glass-card rounded-3xl p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Risk Distribution
          </h2>

          <div className="h-80">
            <RiskChart />
          </div>

        </div>

      </div>

      {/* RISK GAUGE */}

      <div className="glass-card rounded-3xl p-6">

        <h2 className="mb-4 text-xl font-semibold">
          AI Risk Assessment
        </h2>

        <RiskGauge />

      </div>

      {/* RECENT TRANSACTIONS */}

      <div className="glass-card rounded-3xl p-6">

        <h2 className="mb-4 text-xl font-semibold">
          Recent Transactions
        </h2>

        <TransactionsTable />

      </div>

    </div>
  );
}