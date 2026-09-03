"use client";

import {
  User,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function ProfilePage() {
  const username =
    typeof window !== "undefined"
      ? localStorage.getItem("username") || "User"
      : "User";

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("email") || "Email not available"
      : "Email not available";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">
          My Profile
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your account information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="glass-card max-w-3xl rounded-3xl p-8">
        {/* Profile Header */}
        <div className="flex items-center gap-5 border-b border-white/10 pb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-cyan-400 to-purple-500 text-3xl font-bold text-white">
            {username.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {username}
            </h2>

            <p className="text-sm text-muted-foreground">
              Fraud Detection System User
            </p>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 space-y-6">
          <h3 className="text-lg font-semibold">
            Account Information
          </h3>

          {/* Username */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
              <User className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Username
              </p>

              <p className="mt-1 font-medium">
                {username}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">
              <Mail className="h-5 w-5 text-purple-400" />
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                Email Address
              </p>

              <p className="mt-1 break-all font-medium">
                {email}
              </p>
            </div>
          </div>

          {/* Account Status */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
              <ShieldCheck className="h-5 w-5 text-green-400" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Account Status
              </p>

              <p className="mt-1 font-medium text-green-400">
                Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}