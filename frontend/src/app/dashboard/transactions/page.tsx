"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Transaction {
  id: number;
  amount: number;
  fraud_probability: number;
  status: "Fraud" | "Safe";
  created_at: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await apiFetch("/transactions");
        setTransactions(data);
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

 const filteredTransactions = transactions.filter(
  (transaction) => {
    const query = search.toLowerCase().trim();

    return (
      transaction.id.toString().includes(query) ||
      transaction.amount.toString().includes(query) ||
      transaction.status.toLowerCase().includes(query)
    );
  }
);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">
          Transactions
        </h1>

        <p className="mt-2 text-muted-foreground">
          Monitor recent credit card transactions
          and fraud risk.
        </p>
      </div>

      {/* Search Box */}
      <div className="glass-card rounded-3xl p-4">
        <input
          type="text"
          placeholder="Search by ID, Amount or Status..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            rounded-xl
            border border-white/10
            bg-white/5
            px-4
            py-3
            outline-none
            focus:border-cyan-500
          "
        />
      </div>

      {/* Main Card */}
      <div className="glass-card overflow-hidden rounded-3xl p-6">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold">
              Recent Transactions
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Latest transactions analyzed by the
              fraud detection system.
            </p>
          </div>

          <div className="rounded-xl bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
            {filteredTransactions.length} Records
          </div>

        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <p className="text-muted-foreground">
              Loading transactions...
            </p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex min-h-60 items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold">
                No matching transactions found
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Try a different search term.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-225">

              <thead>
                <tr className="border-b border-white/10 text-left">

                  <th className="px-4 py-4 text-sm text-muted-foreground">
                    ID
                  </th>

                  <th className="px-4 py-4 text-sm text-muted-foreground">
                    Amount
                  </th>

                  <th className="px-4 py-4 text-sm text-muted-foreground">
                    Risk
                  </th>

                  <th className="px-4 py-4 text-sm text-muted-foreground">
                    Status
                  </th>

                  <th className="px-4 py-4 text-sm text-muted-foreground">
                    Date
                  </th>

                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map(
                  (transaction) => (
                    <tr
                      key={transaction.id}
                      className="
                        border-b
                        border-white/5
                        transition
                        hover:bg-white/5
                      "
                    >
                      <td className="px-4 py-4">
                        #{transaction.id}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        ₹
                        {Number(
                          transaction.amount
                        ).toFixed(2)}
                      </td>

                      <td className="px-4 py-4">
                        {(
                          transaction.fraud_probability *
                          100
                        ).toFixed(2)}
                        %
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            transaction.status ===
                            "Fraud"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-muted-foreground">
                      {transaction.created_at
                       ? new Date(
                        transaction.created_at
                      ).toLocaleDateString("en-IN")
                       : "N/A"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>

            </table>

          </div>
        )}
      </div>
    </div>
  );
}