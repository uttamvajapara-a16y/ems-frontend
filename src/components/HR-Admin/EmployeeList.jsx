import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Users,
    CheckCircle2,
    XCircle,
    MinusCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const EmployeeList = () => {
    const user = useSelector((store) => store.user);
    const useDebounce = (value, delay = 800) => {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
            const timer = setTimeout(() => setDebouncedValue(value), delay);
            return () => clearTimeout(timer);
        }, [value, delay]);

        return debouncedValue;
    };

    const [employees, setEmployees] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");        // employee active/inactive
    const [attendanceFilter, setAttendanceFilter] = useState(""); // "present" | "absent" | ""
    const [forceFilter, setForceFilter] = useState("hr"); // "present" | "absent" | ""
    const [page, setPage] = useState(1);

    const [deptData, setDeptData] = useState([]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/${forceFilter}?page=${page}&search=${debouncedSearch}&department=${department}&status=${status}&attendance=${attendanceFilter}`)
            setEmployees(res?.data?.data);
            setPagination(res?.data?.pagination);
        } catch (err) {
            setError(err?.response?.data?.message || `Failed to fetch ${forceFilter}`)
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmp = async (id) => {
        setLoading(true);
        try {
            await axiosInstance.delete(`/employee/delete/${id}`)
        } catch (err) {
            setError(err?.response?.data?.message || "error in deleting Employee")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!user) return;
        fetchEmployees();
    }, [page, debouncedSearch, department, status, attendanceFilter, user, forceFilter]);

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

    const attendanceStyles = {
        present: {
            badge: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
            icon: CheckCircle2,
            dot: "bg-green-500",
        },
        absent: {
            badge: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
            icon: XCircle,
            dot: "bg-red-500",
        },
        "not-marked": {
            badge: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
            icon: MinusCircle,
            dot: "bg-slate-400",
        },
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{forceFilter.toUpperCase()}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage your organization's workforce.
                    </p>
                </div>

                {/* HR / EMPLOYEES TOGGLE BUTTON */}
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button
                        onClick={() => { setForceFilter("hr"); setPage(1); }}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${forceFilter === "hr"
                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            }`}
                    >
                        HR
                    </button>
                    <button
                        onClick={() => { setForceFilter("employees"); setPage(1); }}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${forceFilter === "employees"
                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            }`}
                    >
                        EMPLOYEE
                    </button>
                </div>
            </div>

            {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* filter bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex flex-col lg:flex-row gap-3">
                    {/* search */}
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by name, email, designation..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        />
                    </div>

                    {/* department dropdown */}
                    <select
                        value={department}
                        onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    >
                        <option value="">All Departments</option>
                        {deptData?.map((d) => (
                            <option key={d._id} value={d.departmentName}>{d.departmentName}</option>
                        ))}
                        {/* TODO: map real departments here, e.g. departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>) */}
                    </select>

                    {/* present/absent quick filter buttons */}
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => { setAttendanceFilter(""); setPage(1); }}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${attendanceFilter === ""
                                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => { setAttendanceFilter("present"); setPage(1); }}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${attendanceFilter === "present"
                                ? "bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                }`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Present
                        </button>
                        <button
                            onClick={() => { setAttendanceFilter("absent"); setPage(1); }}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${attendanceFilter === "absent"
                                ? "bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                }`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Absent
                        </button>
                    </div>
                </div>
            </div>

            {/* employee table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {loading ? (
                    <div className="min-h-75 flex items-center justify-center">
                        <Loader2 className="animate-spin text-indigo-500" size={28} />
                    </div>
                ) : employees?.length === 0 || employees === undefined ? (
                    <div className="text-center py-16">
                        <Users className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={36} />
                        <p className="text-sm text-slate-400 dark:text-slate-500">No employees found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-left">
                                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        {forceFilter.toUpperCase()}
                                    </th>
                                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Department
                                    </th>
                                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Designation
                                    </th>
                                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Today's Status
                                    </th>
                                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Employment
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => {
                                    const todayStatus = emp.todayStatus || "not-marked";
                                    const { badge, icon: StatusIcon, dot } = attendanceStyles[todayStatus];

                                    return (
                                        <tr
                                            key={emp._id}
                                            className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                                                        {/* {emp.firstName?.[0]?.toUpperCase() || "U"} */}
                                                        <img src={emp.profileImage} alt="photo" className="rounded-full object-center" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800 dark:text-slate-200">
                                                            {emp.firstName} {emp.lastName}
                                                        </p>
                                                        <p className="text-xs text-slate-400 dark:text-slate-500">{emp.emailId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                {emp.departmentName || "—"}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                {emp.designation || "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${badge}`}
                                                >
                                                    <StatusIcon size={12} />
                                                    {todayStatus === "not-marked" ? "Not marked" : todayStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${emp.status === "active" ? "bg-green-500" : "bg-slate-400"
                                                            }`}
                                                    />
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                                        {emp.status}
                                                    </span>
                                                    <button
                                                        disabled={user?.role === "HR"}
                                                        onClick={() => handleDeleteEmp(emp._id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 ml-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200 hover:bg-red-100 active:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20 transition-colors duration-150"
                                                    >
                                                        delete
                                                    </button>
                                                    <Link
                                                        to={`/edit/${emp._id}`}
                                                        state={{ toEdit: emp }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 ml-3 rounded-lg bg-green-50 text-green-700 text-xs font-medium border border-green-200 hover:bg-green-100 active:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 dark:hover:bg-green-500/20 transition-colors duration-150"
                                                    >
                                                        Edit
                                                    </Link>
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* pagination bar */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-1">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        Page {pagination.currentPage} of {pagination.totalPages} · {pagination.totalCount} total
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={15} />
                            Prev
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                            disabled={pagination && page === pagination.totalPages}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;