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
  
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Fraud Detection",
    icon: Shield,
    href: "/dashboard/predict",
  },
  {
  name: "CSV Analysis",
  icon: CreditCard,
  href: "/dashboard/upload",
  },
  {
    name: "Transactions",
    icon: CreditCard,
    href: "/dashboard/transactions",
  },
  {
    name: "Profile",
    icon: User,
    href: "/dashboard/profile",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
  {
    name: "History",
    icon: History,
    href: "/dashboard/history",
  },
  {
  name: "Analytics",
  href: "/dashboard/analytics",
  icon: BarChart3,
  },
];

export default function Sidebar() {
  return (
   <aside className="w-72 shrink-0 border-r border-white/10 bg-black/20 backdrop-blur-xl">
      {/* Logo */}
      <div className="p-6">
        <h2 className="bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
          FraudAI
        </h2>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 px-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
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
  );
}