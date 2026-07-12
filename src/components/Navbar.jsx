import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { removeUser } from "../utils/userSlice";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Wallet,
  Building2,
  FileClock,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  MessageCircle,
} from "lucide-react";

const NAV_LINKS = {
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/employees", label: "Employees/HR", icon: Users },
    { to: "/departments", label: "Departments", icon: Building2 },
    { to: "/leaves/approve", label: "Leaves", icon: Calendar },
    { to: "/payslips", label: "Payroll", icon: Wallet },
    { to: "/audit-logs", label: "Audit Logs", icon: FileClock },
    { to: "/chat", label: "Chat", icon: MessageCircle },
  ],
  hr: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/employees", label: "Employees", icon: Users },
    { to: "/leaves", label: "My Leaves", icon: Calendar },
    { to: "/payslips", label: "Payroll", icon: Wallet },
    { to: "/attendance", label: "Attendance", icon: ClipboardList },
    { to: "/chat", label: "Chat", icon: MessageCircle },
  ],
  employee: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/attendance", label: "My Attendance", icon: ClipboardList },
    { to: "/leaves", label: "My Leaves", icon: Calendar },
    { to: "/payslips", label: "Payslips", icon: Wallet },
    { to: "/chat", label: "Chat", icon: MessageCircle },
  ],
};

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  const role = user?.role?.toLowerCase();
  const links = NAV_LINKS[role] || [];

  const toggleTheme = () => {
    const nowDark = document.documentElement.classList.toggle("dark");
    setIsDark(nowDark);
    localStorage.setItem("theme", nowDark ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (err) {
      console.log("Logout error:", err.message);
    } finally {
      dispatch(removeUser());
      navigate("/login");
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-semibold text-lg tracking-tight text-slate-900 dark:text-white shrink-0"
          >
            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
              EMS
            </div>
            <span className="hidden sm:block">Employee Portal</span>
          </Link>

          {/* desktop links */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center overflow-x-auto">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* right side: theme toggle + profile + logout */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link to="/profile" className="flex items-center gap-2 group pl-1">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium text-white shrink-0">
                <img src={user?.profileImage} alt="user photo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="text-sm leading-tight hidden lg:block">
                <p className="font-medium text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors whitespace-nowrap">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 capitalize whitespace-nowrap">
                  {/* {role}{user?.departmentId?.departmentName ? ` - ${user.departmentId.departmentName}` : ""} */}
                  {role}-{user?.departmentName}
                </p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap"
            >
              <LogOut size={16} />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>

          {/* mobile menu toggle */}
          <button
            className="md:hidden text-slate-600 dark:text-slate-300 shrink-0"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 pb-4 pt-2 space-y-1 bg-white dark:bg-slate-900">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}

          <div className="border-t border-slate-200 dark:border-slate-800 my-2" />

          <Link
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Users size={16} />
            Profile ({user.firstName})
          </Link>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? "Light mode" : "Dark mode"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;