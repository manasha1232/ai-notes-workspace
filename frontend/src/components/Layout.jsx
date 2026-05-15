import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LayoutDashboard, FileText, BarChart3, LogOut, Menu, X, Moon, Sun, Zap } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/notes", icon: FileText, label: "My Notes" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
];

export default function Layout() {
  const [open, setOpen] = useState(true);
  const [dark, setDark] = useState(false);
  const { user, logout } = useAuthStore();

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside
        className={`${open ? "w-56" : "w-16"} flex-shrink-0 flex flex-col transition-all duration-300 border-r`}
        style={{ background: "var(--sidebar)", borderColor: "var(--border)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {open && <span className="font-display font-bold text-sm" style={{ color: "var(--text)" }}>Peblo Study</span>}
          <button
            onClick={() => setOpen(!open)}
            className="ml-auto p-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            style={{ color: "var(--muted)" }}
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "hover:bg-amber-50 dark:hover:bg-amber-900/10"
                }`
              }
              style={({ isActive }) => ({ color: isActive ? undefined : "var(--muted)" })}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {open && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-2 space-y-0.5 border-t" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={toggleDark}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-amber-50 dark:hover:bg-amber-900/10"
            style={{ color: "var(--muted)" }}
          >
            {dark ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
            {open && <span className="font-medium">{dark ? "Light" : "Dark"} Mode</span>}
          </button>
          {open && (
            <div className="px-3 py-2 text-xs" style={{ color: "var(--muted)" }}>
              <span className="font-medium" style={{ color: "var(--text)" }}>{user?.name}</span>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-red-50 dark:hover:bg-red-900/10 text-red-400 hover:text-red-500"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {open && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
