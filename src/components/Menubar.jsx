import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Wallet,
  ClipboardList,
  FileClock,
} from "lucide-react";

// same NAV_LINKS pattern as your Navbar - single source of truth
const SIDEBAR_LINKS = {
  Admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/employees", label: "Employees", icon: Users },
    { to: "/departments", label: "Departments", icon: Building2 },
    { to: "/leaves", label: "Leaves", icon: Calendar },
    { to: "/payroll", label: "Payroll", icon: Wallet },
    { to: "/audit-logs", label: "Audit Logs", icon: FileClock },
  ],
  HR: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/employees", label: "Employees", icon: Users },
    { to: "/leaves", label: "Leaves", icon: Calendar },
    { to: "/payroll", label: "Payroll", icon: Wallet },
    { to: "/attendance", label: "Attendance", icon: ClipboardList },
  ],
};

const Menubar = ({ role }) => {
  const links = SIDEBAR_LINKS[role] || [];

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Menubar;