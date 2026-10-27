import {
  Bell,
  LayoutDashboard,
  Leaf,
  LogOut,
  Plane,
  Sprout,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthProvider";
import { cn } from "@/lib/utils";

const navigation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/fields", label: "Fields", icon: Sprout },
  { to: "/flights", label: "Flights", icon: Plane },
  { to: "/alerts", label: "Alerts", icon: Bell },
];

export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
    } catch {
      // AuthProvider already cleared the local user, so leave the shell regardless.
    } finally {
      navigate("/login", { replace: true });
    }
  }

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
        <div className="border-t border-white/10 px-3 py-3 md:px-5">
          {user && (
            <p className="truncate text-xs text-canopy-200">
              Signed in as{" "}
              <span className="font-medium text-white">{user.username}</span>
            </p>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="mt-2 w-full justify-start text-canopy-100 hover:bg-white/10 hover:text-white focus-visible:ring-canopy-400 focus-visible:ring-offset-surface-inverse"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Log out
          </Button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}
