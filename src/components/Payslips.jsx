import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Download,
  Wallet,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

const monthNames = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const statusBadge = {
  paid: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
  pending: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  processing: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  failed: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
};

const Payslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState("");

  const fetchPayslips = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/payroll/my-payslips?page=${page}&limit=10`);
      setPayslips(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load payslips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, [page]);

  const handleDownload = async (id, month, year) => {
    setDownloadingId(id);
    try {
      const res = await axiosInstance.get(`/payroll/download/${id}`, {
        responseType: "blob", // important - tells axios to expect binary data, not JSON
      });

      // create a temporary link to trigger the browser's download dialog
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payslip-${month}-${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to download payslip");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">My Payslips</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          View and download your monthly payslips.
        </p>
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
      ) : payslips.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center py-16">
          <FileText className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={36} />
          <p className="text-sm text-slate-400 dark:text-slate-500">No payslips available yet</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
          {payslips.map((slip) => (
            <div
              key={slip._id}
              className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <Wallet className="text-indigo-600 dark:text-indigo-400" size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {monthNames[slip.month]} {slip.year}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Net Salary: <span className="font-medium text-slate-600 dark:text-slate-300">₹{slip.netSalary?.toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`hidden sm:inline-block text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusBadge[slip.status]}`}
                >
                  {slip.status}
                </span>

                {slip.status === "paid" ? (
                  <button
                    onClick={() => handleDownload(slip._id, slip.month, slip.year)}
                    disabled={downloadingId === slip._id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                      bg-indigo-600 text-white text-xs font-medium
                      hover:bg-indigo-700 active:bg-indigo-800
                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 dark:focus:ring-offset-slate-900
                      disabled:bg-indigo-300 disabled:cursor-not-allowed
                      dark:bg-indigo-500 dark:hover:bg-indigo-600
                      transition-colors duration-150"
                  >
                    {downloadingId === slip._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    Download
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500 px-1">
                    Not available
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300
                border border-slate-200 dark:border-slate-700
                hover:bg-slate-50 dark:hover:bg-slate-800
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
              disabled={page === pagination.totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300
                border border-slate-200 dark:border-slate-700
                hover:bg-slate-50 dark:hover:bg-slate-800
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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

export default Payslips;