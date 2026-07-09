import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from "lucide-react";

const statusBadge = {
  approved: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
  pending: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  rejected: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
  cancelled: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

const ApproveLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // reject modal state
  const [rejectModal, setRejectModal] = useState({ open: false, leaveId: null });
  const [rejectReason, setRejectReason] = useState("");

  const fetchLeaves = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(
        `/leave/all-leaves?page=${page}&limit=10${statusFilter ? `&status=${statusFilter}` : ""}`
      );
      setLeaves(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [page, statusFilter]);

  const handleApprove = async (leaveId) => {
    setActionLoadingId(leaveId);
    setError("");
    setSuccess("");
    try {
      await axiosInstance.put(`/leave/review/approved/${leaveId}`);
      setSuccess("Leave approved successfully");
      // update this leave's status locally instead of refetching everything
      setLeaves((prev) =>
        prev.map((l) => (l._id === leaveId ? { ...l, status: "approved" } : l))
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to approve leave");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectModal = (leaveId) => {
    setRejectReason("");
    setRejectModal({ open: true, leaveId });
  };

  const closeRejectModal = () => {
    setRejectModal({ open: false, leaveId: null });
    setRejectReason("");
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }
    setActionLoadingId(rejectModal.leaveId);
    setError("");
    setSuccess("");
    try {
      await axiosInstance.put(`/leave/review/rejected/${rejectModal.leaveId}`, {
        reason: rejectReason,
      });
      setSuccess("Leave rejected successfully");
      setLeaves((prev) =>
        prev.map((l) =>
          l._id === rejectModal.leaveId
            ? { ...l, status: "rejected", rejectionReason: rejectReason }
            : l
        )
      );
      closeRejectModal();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reject leave");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Leave Requests</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review and act on employee leave requests.
          </p>
        </div>

        {/* status filter tabs */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {["pending", "approved", "rejected", ""].map((s) => (
            <button
              key={s || "all"}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {s || "All"}
            </button>
          ))}
        </div>
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

      {/* leave requests list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500" size={28} />
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-16">
            <ClipboardList className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={36} />
            <p className="text-sm text-slate-400 dark:text-slate-500">No leave requests found</p>
          </div>
        ) : (
          leaves.map((leave) => (
            <div key={leave._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                  {/* {leave.applierId?.firstName?.[0]?.toUpperCase() || "U"} */}
                  <img src={leave.applierId?.profileImage} alt="UserProfile" className="rounded-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {leave.applierId?.firstName} {leave.applierId?.lastName}
                    <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500 capitalize">
                      ({leave.applierId?.role})
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
                    {leave.leaveType} leave · {leave.totalDays} day{leave.totalDays > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                    <Calendar size={11} />
                    {new Date(leave.startDate).toLocaleDateString()} – {new Date(leave.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">{leave.reason}</p>
                  {leave.status === "rejected" && leave.rejectionReason && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                      Reason: {leave.rejectionReason}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusBadge[leave.status]}`}>
                  {leave.status}
                </span>

                {leave.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(leave._id)}
                      disabled={actionLoadingId === leave._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        bg-green-50 text-green-700 text-xs font-medium border border-green-200
                        hover:bg-green-100 active:bg-green-200
                        focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1 dark:focus:ring-offset-slate-900
                        disabled:opacity-50 disabled:cursor-not-allowed
                        dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20
                        dark:hover:bg-green-500/20
                        transition-colors duration-150"
                    >
                      {actionLoadingId === leave._id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={13} />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => openRejectModal(leave._id)}
                      disabled={actionLoadingId === leave._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        bg-red-50 text-red-600 text-xs font-medium border border-red-200
                        hover:bg-red-100 active:bg-red-200
                        focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 dark:focus:ring-offset-slate-900
                        disabled:opacity-50 disabled:cursor-not-allowed
                        dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20
                        dark:hover:bg-red-500/20
                        transition-colors duration-150"
                    >
                      <XCircle size={13} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* pagination */}
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
              disabled={page === pagination.totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* reject reason modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              Reject Leave Request
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Please provide a reason for rejecting this request.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Insufficient staffing during this period"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-shadow"
            />

            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoadingId === rejectModal.leaveId}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                  bg-red-600 text-white hover:bg-red-700 active:bg-red-800
                  disabled:bg-red-300 disabled:cursor-not-allowed
                  dark:bg-red-500 dark:hover:bg-red-600
                  transition-colors"
              >
                {actionLoadingId === rejectModal.leaveId && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveLeave;