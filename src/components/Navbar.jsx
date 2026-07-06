import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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
  Key,
} from "lucide-react";


const NAV_LINKS = {
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/employees", label: "Employees", icon: Users },
    { to: "/departments", label: "Departments", icon: Building2 },
    { to: "/leaves", label: "Leaves", icon: Calendar },
    { to: "/payroll", label: "Payroll", icon: Wallet },
    { to: "/audit-logs", label: "Audit Logs", icon: FileClock },
  ],
  hr: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/employees", label: "Employees", icon: Users },
    { to: "/leaves", label: "Leaves", icon: Calendar },
    { to: "/payroll", label: "Payroll", icon: Wallet },
    { to: "/attendance", label: "Attendance", icon: ClipboardList },
  ],
  employee: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/attendance", label: "My Attendance", icon: ClipboardList },
    { to: "/leaves", label: "My Leaves", icon: Calendar },
    { to: "/payslips", label: "Payslips", icon: Wallet },
  ],
};

const Navbar = () => {

  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mobileOpen, setMobileOpen] = useState(true);

  // const role = user?.role?.toLoweeCase() ;
  const role = "admin";
  const links = NAV_LINKS[role] || [];

  // if(!user) return null ;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* logo */}
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-md bg-indigo-500 flex items-center justify-center text-sm font-bold">
              EMS
            </div>
            <span className="hidden sm:block">Employee Portal</span>
          </Link>

          {/* desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {
              links.map(({ to, label, icon: Icon }) => (
                <Link
                  to={to} key={to}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))
            }
          </div>

          {/* profile + logout */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/profile" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-medium">
                {user?.firstName?.[0].toUpperCase() || "U"}
              </div>
              <div className="text-sm leading-tight">
                <p className="font-medium group-hover:text-indigo-300 transition-colors">
                  fistName lastName
                </p>
                <p className="text-xs text-slate-400 capitalize">{role}</p>
              </div>
            </Link>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white hover:bg-red-500/20 hover:text-red-300 transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
          {/* mobile menu toggle */}
          <button
            className="md:hidden text-slate-300"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      
      {/* mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 px-4 pb-4 pt-2 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <div className="border-t border-slate-800 my-2" />
          <Link
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Users size={16} />
            Profile ({user?.firstName})
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-300 hover:bg-red-500/20"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
