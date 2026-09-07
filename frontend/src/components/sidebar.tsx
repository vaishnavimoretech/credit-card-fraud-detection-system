"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Shield,
  CreditCard,
  BarChart3,
  History,
  Settings,
  User,
  X,
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Fraud Detection", icon: Shield, href: "/dashboard/predict" },
  { name: "CSV Analysis", icon: CreditCard, href: "/dashboard/upload" },
  { name: "Transactions", icon: CreditCard, href: "/dashboard/transactions" },
  { name: "Profile", icon: User, href: "/dashboard/profile" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  { name: "History", icon: History, href: "/dashboard/history" },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile वर काळा overlay - sidebar उघडा असताना दिसतो, click केल्यावर बंद होतो */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 shrink-0
          border-r border-white/10 bg-black/90 backdrop-blur-xl
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:bg-black/20
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo + Close button (mobile) */}
        <div className="flex items-center justify-between p-6">
          <h2 className="bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
            FraudAI
          </h2>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 px-4">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className="
                  flex items-center gap-3
                  rounded-xl
                  px-4 py-3
                  text-white/80
                  transition-all
                  duration-200
                  hover:bg-cyan-500/10
                  hover:text-cyan-400
                "
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}