import { Bell, LayoutDashboard, Leaf, Plane, Sprout } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

import { cn } from "@/lib/utils";

const navigation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/fields", label: "Fields", icon: Sprout },
  { to: "/flights", label: "Flights", icon: Plane },
  { to: "/alerts", label: "Alerts", icon: Bell },
];

export function AppShell() {
  return (
    <div className="min-h-screen bg-surface-muted text-surface-inverse md:flex">
      <aside className="border-b border-white/10 bg-surface-inverse md:flex md:w-64 md:shrink-0 md:flex-col md:border-r md:border-b-0">
        <div className="flex h-16 items-center px-4 md:h-auto md:px-5 md:pt-6 md:pb-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md px-2 py-1 font-display text-lg font-semibold tracking-tight text-white focus-visible:ring-2 focus-visible:ring-canopy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inverse focus-visible:outline-none"
          >
            <Leaf aria-hidden="true" className="size-6 text-canopy-400" />
            AeroSense
          </Link>
        </div>
        <nav aria-label="Primary" className="px-3 pb-3 md:flex-1">
          <ul className="flex flex-wrap items-center gap-1 md:flex-col md:items-stretch">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      "focus-visible:ring-2 focus-visible:ring-canopy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inverse focus-visible:outline-none",
                      isActive
                        ? "bg-canopy-700 text-white"
                        : "text-canopy-100 hover:bg-white/10 hover:text-white",
                    )
                  }
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}
