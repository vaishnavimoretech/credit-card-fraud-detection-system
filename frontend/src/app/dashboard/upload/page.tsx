"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UploadResult {
  total_transactions: number;
  fraud_transactions: number;
  safe_transactions: number;
  fraud_rate: number;
  average_fraud_probability: number;
}

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload() {
    // Clear old messages
    setError("");
    setResult(null);

    // Validate file
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Only CSV files are allowed.");
      return;
    }

    setLoading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Send CSV to backend
      const response = await fetch(
        "http://127.0.0.1:8000/upload-csv",
        {
          method: "POST",
          body: formData,
        }
      );

      // Read response
      const data = await response.json();

      // Backend error
      if (!response.ok) {
        let message = "CSV upload failed.";

        if (typeof data.detail === "string") {
          message = data.detail;
        } else if (
          data.detail &&
          typeof data.detail.message === "string"
        ) {
          message = data.detail.message;

          if (Array.isArray(data.detail.missing_columns)) {
            message +=
              ` Missing columns: ${data.detail.missing_columns.join(", ")}`;
          }
        }

        throw new Error(message);
      }

      // Backend may return an error object
      if (data.error) {
        throw new Error(data.error);
      }

      // Save result
      setResult({
        total_transactions: Number(
          data.total_transactions ?? 0
        ),
        fraud_transactions: Number(
          data.fraud_transactions ?? 0
        ),
        safe_transactions: Number(
          data.safe_transactions ?? 0
        ),
        fraud_rate: Number(
          data.fraud_rate ?? 0
        ),
        average_fraud_probability: Number(
          data.average_fraud_probability ?? 0
        ),
      });

      // Refresh route data
      router.refresh();
    } catch (error) {
      console.error("CSV upload error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload CSV file."
      );
    } finally {
      setLoading(false);
    }
  }

  function removeFile() {
    setFile(null);
    setResult(null);
    setError("");
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">
          CSV Fraud Analysis
        </h1>

        <p className="mt-2 text-muted-foreground">
          Upload a credit card transaction CSV file and
          analyze fraudulent transactions using AI.
        </p>
      </div>

      {/* Upload Card */}
      <div className="glass-card rounded-3xl p-8">
        <div className="mx-auto max-w-2xl">

          <h2 className="mb-2 text-2xl font-semibold">
            Upload Transaction Dataset
          </h2>

          <p className="mb-6 text-sm text-muted-foreground">
            Select a CSV file containing transaction data.
          </p>

          {/* File Input */}
          <label
            htmlFor="csv-file"
            className="
              flex
              min-h-48
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border-2
              border-dashed
              border-cyan-400/30
              bg-cyan-400/5
              p-8
              text-center
              transition
              hover:border-cyan-400
              hover:bg-cyan-400/10
            "
          >
            <div className="mb-4 text-5xl">
              📊
            </div>

            <p className="text-lg font-semibold">
              {file
                ? file.name
                : "Click to select CSV file"}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              CSV files only
            </p>

            <input
              id="csv-file"
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const selectedFile =
                  e.target.files?.[0] ?? null;

                setFile(selectedFile);
                setResult(null);
                setError("");
              }}
            />
          </label>

          {/* Selected File */}
          {file && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="font-medium">
                    {file.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  disabled={loading}
                  className="
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    text-red-400
                    transition
                    hover:bg-red-500/10
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Remove
                </button>

              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="
                mt-4
                rounded-xl
                border
                border-red-500/20
                bg-red-500/10
                p-4
                text-sm
                text-red-400
              "
            >
              ⚠️ {error}
            </div>
          )}

          {/* Upload Button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || loading}
            className="
              mt-6
              w-full
              rounded-xl
              bg-cyan-500
              px-6
              py-3
              font-semibold
              text-black
              transition
              hover:bg-cyan-400
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading
              ? "Analyzing CSV..."
              : "Upload & Analyze"}
          </button>

        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">

          <div>
            <h2 className="text-2xl font-semibold">
              Analysis Results
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              AI analysis completed successfully.
            </p>
          </div>

          <div
            className="
              grid
              gap-6
              md:grid-cols-2
              xl:grid-cols-5
            "
          >

            {/* Total */}
            <div className="glass-card rounded-3xl p-6">
              <p className="text-sm text-muted-foreground">
                Total Transactions
              </p>

              <p className="mt-3 text-4xl font-bold">
                {result.total_transactions.toLocaleString()}
              </p>
            </div>

            {/* Fraud */}
            <div className="glass-card rounded-3xl p-6">
              <p className="text-sm text-muted-foreground">
                Fraud Transactions
              </p>

              <p className="mt-3 text-4xl font-bold text-red-400">
                {result.fraud_transactions.toLocaleString()}
              </p>
            </div>

            {/* Safe */}
            <div className="glass-card rounded-3xl p-6">
              <p className="text-sm text-muted-foreground">
                Safe Transactions
              </p>

              <p className="mt-3 text-4xl font-bold text-green-400">
                {result.safe_transactions.toLocaleString()}
              </p>
            </div>

            {/* Fraud Rate */}
            <div className="glass-card rounded-3xl p-6">
              <p className="text-sm text-muted-foreground">
                Fraud Rate
              </p>

              <p className="mt-3 text-4xl font-bold text-cyan-400">
                {result.fraud_rate.toFixed(2)}%
              </p>
            </div>

            {/* Average Risk */}
            <div className="glass-card rounded-3xl p-6">
              <p className="text-sm text-muted-foreground">
                Average Risk
              </p>

              <p className="mt-3 text-4xl font-bold text-purple-400">
                {(
                  result.average_fraud_probability * 100
                ).toFixed(2)}
                %
              </p>
            </div>

          </div>

          {/* Success Message */}
          <div
            className="
              rounded-2xl
              border
              border-green-500/20
              bg-green-500/10
              p-5
              text-green-400
            "
          >
            <p className="font-semibold">
              ✅ CSV analysis completed successfully.
            </p>

            <p className="mt-1 text-sm text-green-400/80">
              Predictions have been saved to the database.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}