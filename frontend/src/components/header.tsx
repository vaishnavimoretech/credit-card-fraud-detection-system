"use client";

import { Bell, } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Notification {
  id: number;
  message: string;
  time: string;
}

export default function Header() {
  const [showNotifications, setShowNotifications] =
    useState(false);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await apiFetch("/notifications");
        setNotifications(data);
      } catch (error) {
        console.error(
          "Failed to load notifications:",
          error
        );
      }
    }

    loadNotifications();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="flex items-center justify-between px-8 py-4">

        {/* Search */}
        <div className="relative w-100">
        
          
        </div>

        <div className="flex items-center gap-4">

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              className="rounded-xl border border-white/10 p-3 hover:bg-white/5"
            >
              <Bell size={18} />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl glass-card p-4">

                <h3 className="mb-3 font-semibold">
                  Notifications
                </h3>

                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No notifications
                  </p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-white/10 py-3"
                    >
                      <p className="text-sm">
                        {item.message}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                  ))
                )}

              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-linear-to-r from-cyan-500 to-purple-500" />

            <div>
              <p className="text-xs text-gray-400">
                Administrator
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}