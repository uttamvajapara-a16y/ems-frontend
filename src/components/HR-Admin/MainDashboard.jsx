import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
    Users,
    UserCog,
    Building2,
    CalendarCheck,
    CalendarX,
    Clock3,
    FileClock,
    Loader2,
    ArrowRight,
    AlertCircle,
    Clock,
    LogIn,
    LogOut,
    CheckCircle2
} from "lucide-react";
import { useSelector } from "react-redux";

const MainDashboard = () => {
    const user = useSelector((store) => store.user) ;
    const [stats, setStats] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkLoading, setCheckLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchStats = async () => {
        try {
            const res = await axiosInstance.get("/dashboard/stats");
            setStats(res.data.data);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    const fetchStatsAttendence = async () => {
        try {
            const res = await axiosInstance.get("/dashboard/my-attendance");
            setAttendance(res.data.data);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load Attendance");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        setCheckLoading(true);
        try {
            await axiosInstance.post("/attendance/checkin");
            await fetchStatsAttendence();
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
            await fetchStatsAttendence();
        } catch (err) {
            setError(err?.response?.data?.message || "Check-out failed");
        } finally {
            setCheckLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchStatsAttendence();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={28} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            </div>
        );
    }

    const {
        headcount,
        departmentWiseCount,
        attendanceToday,
        pendingLeaves,
        recentLeaveRequests,
    } = stats || {};

    const {
        checkedInToday,
        checkedOutToday,
        monthlyAttendance,
        recentLeaves,
        latestPayslip,
    } = attendance || {};

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* header */}
            <div className="flex justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">HR Dashboard</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Overview of your organization's workforce today.
                    </p>
                </div>

                <Link
                    to="/attendance/report"
                    className="inline-flex items-center justify-center gap-2 px-5 py-1 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:shadow-none dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:active:bg-indigo-700 dark:shadow-indigo-500/20 transition-colors duration-150"
                >
                    Attendance Report
                </Link>
            </div>

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

            {/* top stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Total Workforce
                        </span>
                        <Users className="text-indigo-600 dark:text-indigo-400" size={18} />
                    </div>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                        {headcount?.totalWorkforce ?? 0}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {headcount?.totalEmployees ?? 0} employees · {headcount?.totalManagers ?? 0} managers · {headcount?.totalHR ?? 0} HR
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Present Today
                        </span>
                        <CalendarCheck className="text-green-600 dark:text-green-400" size={18} />
                    </div>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                        {attendanceToday?.present ?? 0}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">checked in today</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Absent Today
                        </span>
                        <CalendarX className="text-red-500 dark:text-red-400" size={18} />
                    </div>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                        {attendanceToday?.absent ?? 0}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">not checked in</p>
                </div>

                <Link
                    to="/leaves/approve"
                    className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Pending Leaves
                        </span>
                        <FileClock className="text-amber-600 dark:text-amber-400" size={18} />
                    </div>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                        {pendingLeaves ?? 0}
                    </p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1">
                        Review now <ArrowRight size={12} />
                    </p>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* department breakdown */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Building2 className="text-slate-400" size={18} />
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Department Breakdown</h2>
                    </div>

                    {(!departmentWiseCount || departmentWiseCount.length === 0) ? (
                        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">No departments yet</p>
                    ) : (
                        <div className="space-y-3">
                            {departmentWiseCount.map((dept) => {
                                const maxCount = Math.max(...departmentWiseCount.map((d) => d.employeeCount));
                                const pct = maxCount ? (dept.employeeCount / maxCount) * 100 : 0;
                                return (
                                    <div key={dept._id}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-slate-700 dark:text-slate-300">{dept.departmentName}</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{dept.employeeCount}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-600 rounded-full transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* recent leave requests */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Clock3 className="text-slate-400" size={18} />
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Leave Requests</h2>
                        </div>
                        <Link to="/leaves/approve" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                            View all
                        </Link>
                    </div>

                    {(!recentLeaveRequests || recentLeaveRequests.length === 0) ? (
                        <div className="text-center py-10">
                            <AlertCircle className="mx-auto text-slate-300 dark:text-slate-700 mb-2" size={28} />
                            <p className="text-sm text-slate-400 dark:text-slate-500">No pending leave requests</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentLeaveRequests.map((leave) => (
                                <div
                                    key={leave._id}
                                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                            {leave.applierId?.firstName?.[0]?.toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                {leave.applierId?.firstName} {leave.applierId?.lastName}
                                            </p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">
                                                {leave.leaveType} leave · {new Date(leave.startDate).toLocaleDateString()} – {new Date(leave.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20">
                                        pending
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;
