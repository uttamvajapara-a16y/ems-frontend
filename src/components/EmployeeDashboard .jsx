import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {
    Clock,
    LogIn,
    LogOut,
    CalendarCheck,
    CalendarX,
    Wallet,
    FileText,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from "lucide-react";

const statusStyles = {
    approved: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
    pending: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    rejected: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
    cancelled: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

const statusIcon = {
    approved: CheckCircle2,
    pending: AlertCircle,
    rejected: XCircle,
    cancelled: XCircle,
};

const EmployeeDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkLoading, setCheckLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchStats = async () => {
        try {
            const res = await axiosInstance.get("/employee/dashboard/employee-stats");
            setStats(res.data.data);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleCheckIn = async () => {
        setCheckLoading(true);
        try {
            // await axiosInstance.post("/attendance/checkin");
            const res = await axiosInstance.post("/attendance/checkin");
            console.log(res)
            await fetchStats();
        } catch (err) {
            setError(err?.response?.data?.message || "Check-in failed");
            console.log(err)
        } finally {
            setCheckLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setCheckLoading(true);
        try {
            await axiosInstance.post("/attendance/checkout");
            await fetchStats();
        } catch (err) {
            setError(err?.response?.data?.message || "Check-out failed");
        } finally {
            setCheckLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={28} />
            </div>
        );
    }

    const {
        checkedInToday,
        checkedOutToday,
        monthlyAttendance,
        recentLeaves,
        latestPayslip,
    } = stats || {};

    const presentDays = monthlyAttendance?.presentDays || 0;
    const absentDays = monthlyAttendance?.absentDays || 0;
    const totalMarked = monthlyAttendance?.totalMarked || 0;
    const attendancePct = totalMarked ? Math.round((presentDays / totalMarked) * 100) : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">My Dashboard</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Here's what's happening with your work today.
                </p>
            </div>

            {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* check-in/out widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                        <Clock className="text-indigo-600 dark:text-indigo-400" size={22} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {checkedOutToday
                                ? "You've completed today's attendance"
                                : checkedInToday
                                    ? "You're checked in — have a productive day!"
                                    : "You haven't checked in yet today"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date().toLocaleDateString(undefined, {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                {!checkedInToday && (
                    <button
                        onClick={handleCheckIn}
                        disabled={checkLoading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                    >
                        {checkLoading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                        Check In
                    </button>
                )}
                {checkedInToday && !checkedOutToday && (
                    <button
                        onClick={handleCheckOut}
                        disabled={checkLoading}
                        className="flex items-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                    >
                        {checkLoading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                        Check Out
                    </button>
                )}
                {checkedOutToday && (
                    <span className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 px-4 py-2.5">
                        <CheckCircle2 size={16} />
                        Done for today
                    </span>
                )}
            </div>

            {/* stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Present Days
                        </span>
                        <CalendarCheck className="text-green-600 dark:text-green-400" size={18} />
                    </div>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">{presentDays}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">this month</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Absent Days
                        </span>
                        <CalendarX className="text-red-500 dark:text-red-400" size={18} />
                    </div>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">{absentDays}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">this month</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Attendance Rate
                        </span>
                    </div>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">{attendancePct}%</p>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 rounded-full transition-all"
                            style={{ width: `${attendancePct}%` }}
                        />
                    </div>
                </div>

                <Link
                    to="/payslips"
                    className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Latest Payslip
                        </span>
                        <Wallet className="text-indigo-600 dark:text-indigo-400" size={18} />
                    </div>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                        {latestPayslip ? `₹${latestPayslip.netSalary?.toLocaleString()}` : "—"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {latestPayslip ? `${latestPayslip.month}/${latestPayslip.year}` : "No payslips yet"}
                    </p>
                </Link>
            </div>

            {/* recent leave requests */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Leave Requests</h2>
                    <Link
                        to="/leaves"
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        View all
                    </Link>
                </div>

                {(!recentLeaves || recentLeaves.length === 0) ? (
                    <div className="text-center py-8">
                        <FileText className="mx-auto text-slate-300 dark:text-slate-700 mb-2" size={32} />
                        <p className="text-sm text-slate-400 dark:text-slate-500">No leave requests yet</p>
                        <Link
                            to="/leaves/apply"
                            className="inline-block mt-3 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                        >
                            Apply for leave
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentLeaves.map((leave) => {
                            const Icon = statusIcon[leave.status] || AlertCircle;
                            return (
                                <div
                                    key={leave._id}
                                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">
                                            {leave.leaveType} Leave
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">
                                            {new Date(leave.startDate).toLocaleDateString()} –{" "}
                                            {new Date(leave.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusStyles[leave.status]}`}
                                    >
                                        <Icon size={12} />
                                        {leave.status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeDashboard;