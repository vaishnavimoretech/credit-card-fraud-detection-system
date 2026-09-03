"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  // Notifications state
  const [notifications, setNotifications] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    const saved = localStorage.getItem("notifications");

    return saved !== null ? saved === "true" : true;
  });

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return document.documentElement.classList.contains("dark");
  });

  // Toggle notifications
  function toggleNotifications() {
    const newValue = !notifications;

    setNotifications(newValue);

    localStorage.setItem(
      "notifications",
      String(newValue)
    );
  }

  // Toggle dark/light mode
  function toggleDarkMode() {
    const newDarkMode = !darkMode;

    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");

      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");

      localStorage.setItem("theme", "light");
    }
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    router.replace("/login");
  }

  return (
    <div className="w-full max-w-5xl">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="mb-6">
  <button
    onClick={() => router.push("/analytics")}
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
    Open Analytics Dashboard
  </button>
</div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your FraudAI system preferences.
        </p>
      </div>
<div className="glass-card mb-6 rounded-3xl p-6">
  <h2 className="mb-6 text-xl font-semibold">
    User Profile
  </h2>

  <div className="grid gap-4 md:grid-cols-2">

    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-muted-foreground">
        Username
      </p>

      <p className="mt-2 font-semibold">
        {typeof window !== "undefined"
          ? localStorage.getItem("username") || "Admin"
          : "Admin"}
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-muted-foreground">
        Email
      </p>

      <p className="mt-2 font-semibold">
        {typeof window !== "undefined"
          ? localStorage.getItem("email") || "admin@fraudai.com"
          : "admin@fraudai.com"}
      </p>
    </div>

  </div>
</div>

      {/* =====================================================
          GENERAL SETTINGS
      ====================================================== */}

      <div className="glass-card mb-6 rounded-3xl p-6">

        <h2 className="mb-6 text-xl font-semibold">
          General Settings
        </h2>

        <div className="space-y-5">

          {/* ================= FRAUD ALERTS ================= */}

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5">

            <div>
              <h3 className="font-medium">
                Fraud Alerts
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Receive notifications when suspicious
                transactions are detected.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleNotifications}
              aria-label="Toggle fraud alerts"
              className={`relative h-7 w-12 rounded-full transition ${
                notifications
                  ? "bg-cyan-500"
                  : "bg-gray-400"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                  notifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>


          {/* ================= DARK MODE ================= */}

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5">

            <div>
              <h3 className="font-medium">
                Dark Mode
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Use the dark interface for the FraudAI dashboard.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className={`relative h-7 w-12 rounded-full transition ${
                darkMode
                  ? "bg-purple-500"
                  : "bg-gray-400"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                  darkMode
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>

        </div>
      </div>


      {/* =====================================================
          SECURITY
      ====================================================== */}

      <div className="glass-card mb-6 rounded-3xl p-6">

        <h2 className="mb-6 text-xl font-semibold">
          Security
        </h2>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

          <div>
            <h3 className="font-medium">
              Account Session
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Sign out from your current FraudAI account.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 rounded-xl bg-red-500 px-5 py-2.5 font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>
          <button
  type="button"
  onClick={() => {
    if (
      confirm(
        "Delete all fraud prediction history?"
      )
    ) {
      localStorage.clear();
      alert("History cleared.");
      window.location.reload();
    }
  }}
  className="
    mt-4
    rounded-xl
    bg-yellow-500
    px-5
    py-2.5
    font-medium
    text-black
    transition
    hover:bg-yellow-400
  "
>
  Clear Local Data
</button>

<div className="glass-card mb-6 rounded-3xl p-6">

  <h2 className="mb-6 text-xl font-semibold">
    Reports
  </h2>

  <button
    onClick={() =>
      window.open(
        "http://127.0.0.1:8000/export-pdf",
        "_blank"
      )
    }
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
    Download PDF Report
  </button>

</div>
        </div>
      </div>


      {/* =====================================================
          SYSTEM INFORMATION
      ====================================================== */}

      <div className="glass-card rounded-3xl p-6">

        <h2 className="mb-6 text-xl font-semibold">
          System Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          {/* Platform */}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

            <p className="text-sm text-muted-foreground">
              Platform
            </p>

            <p className="mt-2 font-semibold">
              FraudAI
            </p>

          </div>


          {/* Detection Engine */}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

            <p className="text-sm text-muted-foreground">
              Detection Engine
            </p>

            <p className="mt-2 font-semibold">
              XGBoost Machine Learning
            </p>

          </div>


          {/* Backend */}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

            <p className="text-sm text-muted-foreground">
              Backend
            </p>

            <p className="mt-2 font-semibold">
              FastAPI
            </p>

          </div>


          {/* Database */}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

            <p className="text-sm text-muted-foreground">
              Database
            </p>

            <p className="mt-2 font-semibold">
              PostgreSQL
            </p>

          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
  <p className="text-sm text-muted-foreground">
    Version
  </p>

  <p className="mt-2 font-semibold">
    FraudAI v1.0.0
  </p>
</div>

        </div>
      </div>

    </div>
  );
}