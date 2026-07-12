import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  Loader2,
  FileClock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  LogIn,
  LogOut,
} from "lucide-react";

const actionConfig = {
  CREATE: { icon: Plus, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20" },
  UPDATE: { icon: Pencil, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
  DELETE: { icon: Trash2, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" },
  APPROVE: { icon: CheckCircle2, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20" },
  REJECT: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" },
  LOGIN: { icon: LogIn, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20" },
  LOGOUT: { icon: LogOut, color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" },
  "CHECK IN": { icon: LogIn, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20" },
  "CHECK OUT": { icon: LogOut, color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" },
};

const targetTypes = ["Employee", "Department", "Attendance", "Leave", "Payroll", "User"];
const actions = Object.keys(actionConfig);

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const [date, setDate] = useState("");
  const [action, setAction] = useState("");
  const [targetType, setTargetType] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      let query = `?page=${page}&limit=10`;
      if (date) query += `&date=${date}`;
      if (action) query += `&action=${action}`;
      if (targetType) query += `&targetType=${targetType}`;

      const res = await axiosInstance.get(`/admin/auditLog${query}`);
      setLogs(res.data.data || []);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, date, action, targetType]);

  const clearFilters = () => {
    setDate("");
    setAction("");
    setTargetType("");
    setPage(1);
  };

  const hasActiveFilters = date || action || targetType;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Audit Logs</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track every change made across the system.
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
          <div className="relative">
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setPage(1); }}
              max={new Date().toISOString().split("T")[0]}
              className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
          </div>

          <select
            value={action}
            onChange={(e) => { setAction(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          >
            <option value="">All Actions</option>
            {actions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <select
            value={targetType}
            onChange={(e) => { setTargetType(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          >
            <option value="">All Types</option>
            {targetTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline lg:ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* logs list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="min-h-75 flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500" size={28} />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16">
            <FileClock className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={36} />
            <p className="text-sm text-slate-400 dark:text-slate-500">No audit logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map((log) => {
              const config = actionConfig[log.action] || actionConfig.UPDATE;
              const Icon = config.icon;

              return (
                <div key={log._id} className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${config.bg}`}>
                    <Icon size={16} className={config.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 dark:text-slate-200">
                      <span className="font-semibold">
                        {log.userId?.firstName} {log.userId?.lastName}({log.userId?.role})
                      </span>{" "}
                      <span className="text-slate-500 dark:text-slate-400">
                        {log.action?.toLowerCase()} - {" "}
                      </span>
                      <span className="font-medium">{log.targetType}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {log.userId?.emailId}
                      </span>
                      {log.userId?.departmentName && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          · {log.userId.departmentName}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
                    {new Date(log.createdAt).toLocaleString(undefined, {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Page {pagination.currentPage} of {pagination.totalPages} · {pagination.logsCount} total
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
              disabled={page === pagination.totalPages}
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

export default AuditLogPage;