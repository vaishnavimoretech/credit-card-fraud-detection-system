"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Transaction {
  id: number;
  amount: number;
  fraud_probability: number;
  status: "Fraud" | "Safe" | string;
  created_at?: string;
}

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await apiFetch("/transactions");

        // Show only latest 5 transactions on Dashboard
        setTransactions(
          Array.isArray(data) ? data.slice(0, 5) : []
        );
      } catch (error) {
        console.error(
          "Failed to load transactions:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading transactions...
        </p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">
            No transactions found
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Make a fraud prediction to see transactions here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-175">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="px-4 py-4 text-sm font-medium text-muted-foreground">
              ID
            </th>

            <th className="px-4 py-4 text-sm font-medium text-muted-foreground">
              Amount
            </th>

            <th className="px-4 py-4 text-sm font-medium text-muted-foreground">
              Risk
            </th>

            <th className="px-4 py-4 text-sm font-medium text-muted-foreground">
              Status
            </th>

            <th className="px-4 py-4 text-sm font-medium text-muted-foreground">
              Date 
            </th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((item) => {
            const risk =
              Number(item.fraud_probability) * 100;

            const isFraud =
              item.status.toLowerCase() === "fraud";

            return (
              <tr
                key={item.id}
                className="border-b border-white/5 transition hover:bg-white/5"
              >
                {/* ID */}
                <td className="px-4 py-4 font-medium">
                  #{item.id}
                </td>

                {/* Amount */}
                <td className="px-4 py-4 font-semibold">
                  ${Number(item.amount).toFixed(2)}
                </td>

                {/* Risk */}
                <td className="px-4 py-4">
                  <span
                    className={
                      risk >= 50
                        ? "font-semibold text-red-400"
                        : "font-semibold text-green-400"
                    }
                  >
                    {risk.toFixed(2)}%
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isFraud
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {isFraud ? "Fraud" : "Safe"}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {item.created_at
                 ? new Date(item.created_at).toLocaleDateString(
                 "en-IN"
                 )
                 : "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}