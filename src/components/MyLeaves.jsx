import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Loader2,
    CalendarDays,
    FileText,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const statusBadge = {
    approved: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
    rejected: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
    pending: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
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

    // const navigate = useNavigate() ;

    const fetchLeaves = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axiosInstance.get(`/leave/my-leaves?month=${month}&year=${year}`);
            setRecords(res.data.data);
            setSummary(res.data.summary);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load leaves");
        } finally {
            setLoading(false);
        }
    };

    const cancelLeave = async (id) => {
        setLoading(true);
        try{
            const res = await axiosInstance.post("/leave/cancle" , {id}) ;
            fetchLeaves() ;
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to delete leave");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLeaves();
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

    // const isFutureMonth =
    //     year > today.getFullYear() ||
    //     (year === today.getFullYear() && month >= today.getMonth() + 1);

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

                <div className="flex items-center gap-5">
                    <div>
                        <Link
                            to="/leaves/apply"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:shadow-none dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:active:bg-indigo-700 dark:shadow-indigo-500/20 transition-colors duration-150"
                        >
                            Apply
                        </Link>
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
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
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
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-left">
                                                <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                                    Start Date
                                                </th>
                                                <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                                    End Date
                                                </th>
                                                <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                                    Total Days
                                                </th>
                                                <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                                    Leave Type
                                                </th>
                                                <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {records.map((r) => (
                                                <tr
                                                    key={r._id}
                                                    className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                                        {new Date(r.startDate).toLocaleDateString(undefined, {
                                                            weekday: "short",
                                                            day: "numeric",
                                                            month: "short",
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                                        {new Date(r.endDate).toLocaleDateString(undefined, {
                                                            weekday: "short",
                                                            day: "numeric",
                                                            month: "short",
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                        {r.totalDays}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 capitalize">
                                                        {r.leaveType}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <span
                                                                className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border capitalize whitespace-nowrap ${statusBadge[r.status]}`}
                                                            >
                                                                {r.status}
                                                            </span>
                                                            {r.status === "pending" && (
                                                                <button
                                                                    onClick={() => cancelLeave(r._id)}
                                                                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-red-50 text-red-600 text-xs font-medium border border-red-200 hover:bg-red-100 active:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20 dark:active:bg-red-500/30 transition-colors duration-150 whitespace-nowrap"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default MyLeaves;