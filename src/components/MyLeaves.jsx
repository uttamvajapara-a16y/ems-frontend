import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Loader2,
    CalendarDays,
} from "lucide-react";

const statusBadge = {
    present: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
    absent: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
    "half-day": "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    leave: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const MyLeaves = () => {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [records, setRecords] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAttendance = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axiosInstance.get(`/attendance/get?month=${month}&year=${year}`);
            setRecords(res.data.data);
            setSummary(res.data.summary);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load attendance");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [month, year]);

    const changeMonth = (direction) => {
        let newMonth = month + direction;
        let newYear = year;
        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }
        setMonth(newMonth);
        setYear(newYear);
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isFutureMonth =
        year > today.getFullYear() ||
        (year === today.getFullYear() && month >= today.getMonth() + 1);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* header + month navigator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">My Leaves</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Track your leaves and monthly leave record.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 w-32 text-center">
                        {monthNames[month - 1]} {year}
                    </span>
                    <button
                        onClick={() => changeMonth(1)}
                        disabled={isFutureMonth}
                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="min-h-[40vh] flex items-center justify-center">
                    <Loader2 className="animate-spin text-indigo-500" size={28} />
                </div>
            ) : (
                <>
                    {/* summary cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Approved</p>
                            <p className="text-xl font-semibold text-green-600 dark:text-green-400 mt-1">{summary?.approvedLeaves ?? 0}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Rejected</p>
                            <p className="text-xl font-semibold text-red-500 dark:text-red-400 mt-1">{summary?.rejectedLeaves ?? 0}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Pending</p>
                            <p className="text-xl font-semibold text-amber-600 dark:text-amber-400 mt-1">{summary?.pendingLeaves ?? 0}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Leaves</p>
                            <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{summary?.totalLeaves ?? 0}</p>
                        </div>
                    </div>

                    {/* leave table */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        {records.length === 0 ? (
                            <div className="text-center py-12">
                                <CalendarDays className="mx-auto text-slate-300 dark:text-slate-700 mb-2" size={32} />
                                <p className="text-sm text-slate-400 dark:text-slate-500">No leave records for this month</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 text-left">
                                            <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Date</th>
                                            <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Start Date</th>
                                            <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">End Date</th>
                                            <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Total Days</th>
                                            <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Leave Type</th>
                                            <th className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.map((r) => (
                                            <tr
                                                key={r._id}
                                                className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                                            >
                                                <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                                                    {new Date(r.date).toLocaleDateString(undefined, {
                                                        weekday: "short",
                                                        day: "numeric",
                                                        month: "short",
                                                    })}
                                                </td>
                                                <td className="px-5 py-3 text-slate-600 dark:text-slate-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock size={13} className="text-slate-300 dark:text-slate-600" />
                                                        {formatTime(r.checkIn)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-slate-600 dark:text-slate-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock size={13} className="text-slate-300 dark:text-slate-600" />
                                                        {formatTime(r.checkOut)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-slate-600 dark:text-slate-400">
                                                    {r.workingHours ? `${r.workingHours}h` : "—"}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span
                                                        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusBadge[r.status]}`}
                                                    >
                                                        {r.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default MyLeaves;