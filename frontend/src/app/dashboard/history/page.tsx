
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface HistoryItem {
  id: number;
  amount: number;
  fraud_probability: number;
  is_fraud: boolean;
  created_at?: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        setError("");

        const data = await apiFetch("/history");

        setHistory(data);
      } catch (error) {
        console.error(
          "Failed to load history:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load prediction history."
        );
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  function exportHistory() {
    window.open(
      "http://127.0.0.1:8000/export-history",
      "_blank"
    );
  }

  async function deletePrediction(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/history/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setHistory((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete record");
    }
  }

  async function clearAllHistory() {
    const confirmed = window.confirm(
      "Delete all history?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/history",
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed");
      }

      setHistory([]);
    } catch (error) {
      console.error(error);
      alert("Failed to clear history");
    }
  }

  const filteredHistory = history.filter(
    (item) => {
      const query =
        search.toLowerCase().trim();

      if (!query) return true;

      return (
        String(item.id).includes(query) ||
        String(item.amount).includes(
          query
        ) ||
        (
          item.is_fraud
            ? "fraud"
            : "safe"
        ).includes(query)
      );
    }
  );

  const fraudCount = history.filter(
    (item) => item.is_fraud
  ).length;

  const safeCount = history.filter(
    (item) => !item.is_fraud
  ).length;

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Prediction History
          </h1>

          <p className="mt-2 text-muted-foreground">
            View all previous fraud detection predictions.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={exportHistory}
            className="
              rounded-xl
              bg-cyan-500
              px-5
              py-3
              font-semibold
              text-black
              transition
              hover:bg-cyan-400
            "
          >
            Export CSV
          </button>

          <button
            type="button"
            onClick={clearAllHistory}
            className="
              rounded-xl
              bg-red-500
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-red-600
            "
          >
            Clear All
          </button>

        </div>

      </div>

      {/* Search */}

      <div className="glass-card rounded-2xl p-4">

        <input
          type="text"
          placeholder="Search by ID, amount or status..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-3
            outline-none
            transition
            focus:border-cyan-400
          "
        />

      </div>

      {/* Error */}

      {error && (
        <div className="
          rounded-xl
          border
          border-red-500/30
          bg-red-500/10
          p-4
          text-red-400
        ">
          ⚠️ {error}
        </div>
      )}

      {/* Summary */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm text-muted-foreground">
            Total Predictions
          </p>

          <p className="mt-2 text-3xl font-bold">
            {history.length}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm text-muted-foreground">
            Fraud Detected
          </p>

          <p className="mt-2 text-3xl font-bold text-red-400">
            {fraudCount}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm text-muted-foreground">
            Safe Transactions
          </p>

          <p className="mt-2 text-3xl font-bold text-green-400">
            {safeCount}
          </p>
        </div>

      </div>

      {/* Table */}

      <div className="glass-card overflow-hidden rounded-3xl">

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <p className="text-muted-foreground">
              Loading prediction history...
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex min-h-60 items-center justify-center">

            <div className="text-center">

              <p className="text-lg font-semibold">
                No prediction history found
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Try a different search term.
              </p>

            </div>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-250">

              <thead>

                <tr className="border-b border-white/10 text-left">

                  <th className="px-6 py-4 text-sm text-muted-foreground">
                    ID
                  </th>

                  <th className="px-6 py-4 text-sm text-muted-foreground">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-sm text-muted-foreground">
                    Risk
                  </th>

                  <th className="px-6 py-4 text-sm text-muted-foreground">
                    Status
                  </th>

                  <th className="px-6 py-4 text-sm text-muted-foreground">
                    Date
                  </th>

                  <th className="px-6 py-4 text-sm text-muted-foreground">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredHistory.map(
                  (item) => (

                    <tr
                      key={item.id}
                      className="
                        border-b
                        border-white/5
                        transition
                        hover:bg-white/5
                      "
                    >

                      <td className="px-6 py-4 font-medium">
                        #{item.id}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        ₹{Number(
                          item.amount
                        ).toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        {(
                          Number(
                            item.fraud_probability
                          ) * 100
                        ).toFixed(2)}
                        %
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            item.is_fraud
                              ? "bg-red-500/20 text-red-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {item.is_fraud
                            ? "Fraud"
                            : "Safe"}
                        </span>

                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                       {item.created_at
                        ? new Date(item.created_at).toLocaleDateString(
                        "en-IN",
                      {
                        day: "2-digit",
                         month: "2-digit",
                           year: "numeric",
                      }
                          )
                         : "N/A"}
                      </td>

                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            deletePrediction(
                              item.id
                            )
                          }
                          className="
                            rounded-lg
                            bg-red-500
                            px-3
                            py-1
                            text-sm
                            text-white
                            transition
                            hover:bg-red-600
                          "
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {!loading && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredHistory.length}
          {" "}of{" "}
          {history.length}
          {" "}predictions
        </p>
      )}

    </div>
  );
}

