import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
    Calendar,
    Loader2,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    MinusCircle,
} from "lucide-react";
import { useSelector } from "react-redux";

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const statusBadge = {
    present: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
    absent: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
    "half-day": "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    leave: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

const AttendanceReport = () => {
    const user = useSelector((store) => store.user);
    const [filterMode, setFilterMode] = useState("today");
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0]);
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [department, setDepartment] = useState("");

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deptData, setDeptData] = useState([]);

    const fetchReport = async () => {
        setLoading(true);
        setError("");
        try {
            let query = "";
            if (filterMode === "date") {
                query = `?date=${selectedDate}`;
            } else if (filterMode === "month") {
                query = `?month=${selectedMonth}&year=${selectedYear}`;
            }

            if (department) query += `${query ? "&" : "?"}department=${department}`;

            const res = await axiosInstance.get(`/attendance/getReport${query}`);
            setRecords(res?.data?.data);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load attendance report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [filterMode, selectedDate, selectedMonth, selectedYear, department]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axiosInstance.get("/department/get/all");
                setDeptData(res.data.data);
            } catch (err) {
                console.error("Failed to fetch departments:", err.message);
            }
        };
        fetchDepartments();
    }, []);

    const summary = {
        present: records.filter((r) => r.status === "present").length,
        absent: records.filter((r) => r.status === "absent").length,
        halfDay: records.filter((r) => r.status === "half-day").length,
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Attendance Report</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Track daily and monthly attendance across your organization.
                </p>
            </div>

            {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* filter bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    {/* mode toggle */}
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setFilterMode("today")}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterMode === "today"
                                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setFilterMode("date")}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterMode === "date"
                                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                }`}
                        >
                            Specific Date
                        </button>
                        <button
                            onClick={() => setFilterMode("month")}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterMode === "month"
                                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                }`}
                        >
                            Month
                        </button>
                    </div>

                    {/* conditional inputs based on mode */}
                    {filterMode === "date" && (
                        <div className="relative">
                            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                max={today.toISOString().split("T")[0]}
                                className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            />
                        </div>
                    )}

                    {filterMode === "month" && (
                        <div className="flex gap-2">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            >
                                {monthNames.map((m, i) => (
                                    <option key={i + 1} value={i + 1}>{m}</option>
                                ))}
                            </select>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            >
                                {[today.getFullYear(), today.getFullYear() - 1].map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* department filter - TODO: populate real department options */}
                    {user?.role === "Admin" && <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow lg:ml-auto"
                    >
                        <option value="">All Departments</option>
                        {deptData?.map((dept) => (<option key={dept._id} value={dept.departmentName}>{dept.departmentName}</option>))}
                    </select>}
                </div>
            </div>

            {/* summary cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Present</span>
                        <CheckCircle2 className="text-green-600 dark:text-green-400" size={16} />
                    </div>
                    <p className="text-xl font-semibold text-slate-900 dark:text-white">{summary.present}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Absent</span>
                        <XCircle className="text-red-500 dark:text-red-400" size={16} />
                    </div>
                    <p className="text-xl font-semibold text-slate-900 dark:text-white">{summary.absent}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Half Day</span>
                        <MinusCircle className="text-amber-600 dark:text-amber-400" size={16} />
                    </div>
                    <p className="text-xl font-semibold text-slate-900 dark:text-white">{summary.halfDay}</p>
                </div>
            </div>

            {/* table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {loading ? (
                    <div className="min-h-[300px] flex items-center justify-center">
                        <Loader2 className="animate-spin text-indigo-500" size={28} />
                    </div>
                ) : records.length === 0 ? (
                    <div className="text-center py-16">
                        <Users className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={36} />
                        <p className="text-sm text-slate-400 dark:text-slate-500">No attendance records found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-left">
                                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Employee</th>
                                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Date</th>
                                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Check In</th>
                                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Check Out</th>
                                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((r) => (
                                    <tr
                                        key={r._id}
                                        className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                                                    {r.employeeId?.profileImage ? (
                                                        <img src={r.employeeId?.profileImage} alt="userphoto" className="rounded-full object-cover" />
                                                    ) : "U"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800 dark:text-slate-200">
                                                        {r.employeeId?.firstName} {r.employeeId?.lastName} - {r.employeeId?.role}
                                                    </p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500">{r.employeeId?.emailId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {new Date(r.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={13} className="text-slate-300 dark:text-slate-600" />
                                                {r.checkIn ? new Date(r.checkIn).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={13} className="text-slate-300 dark:text-slate-600" />
                                                {r.checkOut ? new Date(r.checkOut).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusBadge[r.status]}`}>
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
        </div>
    );
};

export default AttendanceReport;