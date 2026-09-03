"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    try {
      const data = await apiFetch(
        "/login",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (data.success) {
        localStorage.setItem(
          "token",
          data.access_token
        );

        localStorage.setItem(
          "username",
          data.username
        );
        localStorage.setItem(
        "email",
         email
        );

        router.push("/dashboard");
      } else {
        setError(
          data.message ||
            "Login failed"
        );
      }
    } catch {
      setError(
        "Invalid email or password"
      );
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">

      {/* Background Glow */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-10 left-32 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 gap-10 px-8 lg:grid-cols-2">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center">
          <h1 className="text-6xl font-bold leading-tight">
            <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI Fraud
            </span>
            <br />
            Detection System
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Enterprise-grade AI platform for detecting
            fraudulent credit card transactions using
            Machine Learning and real-time risk analysis.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-3xl font-bold">
                99.2%
              </h3>
              <p className="text-sm text-muted-foreground">
                Accuracy
              </p>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-3xl font-bold">
                284K+
              </h3>
              <p className="text-sm text-muted-foreground">
                Transactions
              </p>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-3xl font-bold">
                24/7
              </h3>
              <p className="text-sm text-muted-foreground">
                Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="glass-card w-full max-w-md rounded-3xl border border-white/10 p-8 backdrop-blur-xl"
          >
            <h1 className="mb-2 text-3xl font-bold">
              Welcome Back
            </h1>

            <p className="mb-6 text-muted-foreground">
              Login to access your fraud analytics dashboard.
            </p>

            <div className="space-y-5">

              <div>
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="mt-2 h-12 px-4 text-base"
                />
              </div>

              <div>
                <Label htmlFor="password">
                  Password
                </Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="mt-2 h-12 px-4 text-base"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="h-12 w-full rounded-xl"
              >
                Login
              </Button>

            </div>
          </form>
        </div>

      </div>
    </div>
  );
}