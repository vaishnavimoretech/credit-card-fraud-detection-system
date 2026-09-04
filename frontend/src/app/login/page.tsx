"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isRegister) {
        // REGISTER
        const data = await apiFetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });

        setSuccess(
          `Account created successfully for ${data.username}. Please login.`
        );

        // Clear form
        setUsername("");
        setEmail("");
        setPassword("");

        // Switch to Login
        setIsRegister(false);
      } else {
        // LOGIN
        const data = await apiFetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("username", data.username);
          localStorage.setItem("email", email);

          router.push("/dashboard");
        } else {
          setError(data.message || "Login failed");
        }
      }
    } catch (err: unknown) {
  console.error(err);

  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError(
      isRegister
        ? "Registration failed. Please try again."
        : "Login failed. Please check your email and password."
    );
  }
} finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setSuccess("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20 mb-5">
            <span className="text-2xl font-bold">AI</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            AI Fraud Detection System
          </h1>

          <p className="text-gray-400 mt-2">
            {isRegister
              ? "Create your account to access fraud analytics."
              : "Login to access your fraud analytics dashboard."}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/0.05] backdrop-blur-xl p-8 shadow-2xl">
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              {isRegister
                ? "Register a new account to get started."
                : "Enter your credentials to continue."}
            </p>
          </div>

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username - Register only */}
            {isRegister && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/0.05] px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/0.05] px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                className="w-full rounded-xl border border-white/10 bg-white/0.05] px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01] hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? isRegister
                  ? "Creating Account..."
                  : "Logging in..."
                : isRegister
                  ? "Create Account"
                  : "Login"}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-semibold text-blue-400 hover:text-blue-300"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-semibold text-blue-400 hover:text-blue-300"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Secure AI-powered transaction monitoring
        </p>
      </div>
    </main>
  );
}