import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import {
  Loader2,
  Wallet,
  Users,
  CheckCircle2,
  Layers,
  User,
} from "lucide-react";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const statusBadge = {
  paid: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
  pending: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  processing: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  failed: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
};

const GeneratePayroll = () => {
  const user = useSelector((store) => store.user);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const today = new Date();
  const [target, setTarget] = useState("employee"); // "employee" | "hr" — only relevant for admin
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState(today.getMonth()); // previous month by default (0-indexed here, +1 on submit)
  const [year, setYear] = useState(today.getFullYear());
  const [basicSalary, setBasicSalary] = useState("");
  const [allowances, setAllowances] = useState("");

  const [generating, setGenerating] = useState(false);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [payrolls, setPayrolls] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const fetchPayrolls = async () => {
    setLoadingList(true);
    try {
      const res = await axiosInstance.get("/payroll");
      setPayrolls(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load payroll records");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setGenerating(true);
    try {
      const endpoint = target === "hr" ? "/payroll/generate/hr" : "/payroll/generate";
      const payload =
        target === "hr"
          ? { hrId: employeeId, month: month + 1, year, basicSalary, allowances }
          : { employeeId, month: month + 1, year, basicSalary, allowances };

      await axiosInstance.post(endpoint, payload);
      setSuccess("Payroll generated successfully");
      setEmployeeId("");
      setBasicSalary("");
      setAllowances("");
      fetchPayrolls();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate payroll");
    } finally {
      setGenerating(false);
    }
  };

  const handleBulkGenerate = async () => {
    setError("");
    setSuccess("");
    setBulkGenerating(true);
    try {
      const endpoint = target === "hr" ? "/payroll/generate-bulk/hr" : "/payroll/generate-bulk";
      const res = await axiosInstance.post(endpoint, { month: month + 1, year });
      setSuccess(res.data.message);
      fetchPayrolls();
    } catch (err) {
      setError(err?.response?.data?.message || "Bulk generation failed");
    } finally {
      setBulkGenerating(false);
    }
  };

  const handleMarkPaid = async (id) => {
    setPayingId(id);
    try {
      await axiosInstance.put(`/payroll/mark-paid/${id}`);
      setPayrolls((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "paid", paymentDate: new Date() } : p))
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to mark as paid");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Payroll Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate and manage monthly payroll.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="px-4 py-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-sm text-green-600 dark:text-green-400">
          {success}
        </div>
      )}

      {/* generate form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet size={18} className="text-indigo-600 dark:text-indigo-400" />
            Generate Payroll
          </h2>

          {/* only Admin can toggle target between Employee/HR */}
          {isAdmin && (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setTarget("employee")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  target === "employee"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                For Employee
              </button>
              <button
                type="button"
                onClick={() => setTarget("hr")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  target === "hr"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                For HR
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {target === "hr" ? "HR Employee ID" : "Employee ID"}
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Paste employee _id"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            >
              {[today.getFullYear(), today.getFullYear() - 1].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Basic Salary
            </label>
            <input
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              placeholder="50000"
              required
              min="0"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Allowances
            </label>
            <input
              type="number"
              value={allowances}
              onChange={(e) => setAllowances(e.target.value)}
              placeholder="5000"
              min="0"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={generating}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {generating ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
              Generate
            </button>

            <button
              type="button"
              onClick={handleBulkGenerate}
              disabled={bulkGenerating}
              className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-300 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              {bulkGenerating ? <Loader2 size={16} className="animate-spin" /> : <Layers size={16} />}
              Bulk Generate for All {target === "hr" ? "HR" : "Employees"}
            </button>
          </div>
        </form>
      </div>

      {/* payroll list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Users size={18} className="text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">All Payroll Records</h2>
        </div>

        {loadingList ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500" size={24} />
          </div>
        ) : payrolls.length === 0 ? (
          <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-10">No payroll records yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-left">
                  <th className="px-6 py-3 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Employee</th>
                  <th className="px-6 py-3 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Period</th>
                  <th className="px-6 py-3 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Net Salary</th>
                  <th className="px-6 py-3 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((p) => (
                  <tr key={p._id} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300">
                      {p.employeeId?.firstName} {p.employeeId?.lastName}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {monthNames[p.month - 1]} {p.year}
                    </td>
                    <td className="px-6 py-3.5 text-slate-800 dark:text-slate-200 font-medium">
                      ₹{p.netSalary?.toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusBadge[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      {p.status !== "paid" ? (
                        <button
                          onClick={() => handleMarkPaid(p._id)}
                          disabled={payingId === p._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium border border-green-200 hover:bg-green-100 disabled:opacity-50 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 dark:hover:bg-green-500/20 transition-colors"
                        >
                          {payingId === p._id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                      )}
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

export default GeneratePayroll;