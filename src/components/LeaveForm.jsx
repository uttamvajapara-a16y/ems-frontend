import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react'
import axiosInstance from '../utils/axiosInstance';

const LeaveForm = () => {

    const [error , setError] = useState("") ;
    const [startDate , setStartDate] = useState("") ;
    const [endDate , setEndDate] = useState("") ;
    const [leaveType , setLeaveType] = useState("casual") ;
    const [reason , setReason] = useState("") ;
    const [loading , setLoading] = useState(false) ;

    const navigate = useNavigate() ;

    const handleLeaveApply = async (e) => {
        e.preventDefault() ;
        setError("") ;
        setLoading(true) ;
        try{
            const res = await axiosInstance.post("/leave/apply" , {startDate , endDate , leaveType , reason}) ;
            navigate("/leaves")
        } catch (err){
            setError(err?.response?.data?.message || "sonthing went wrong") ;
            console.log("Error in applying leave" + err.message) ;
        } finally {
            setLoading(false) ;
        }
    }
    return (
        <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8">
            <form
                className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8"
                onSubmit={handleLeaveApply}
            >
                <div className="text-center mb-8">
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Leave</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Apply for Leave</p>
                </div>

                {error && (
                    <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}


                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >Start Date: </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >End Date: </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Leave Type
                    </label>
                    <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    >
                        <option value="casual">casual</option>
                        <option value="sick">sick</option>
                        <option value="maternity">maternity</option>
                        <option value="paternity">paternity</option>
                        <option value="unpaid">unpaid</option>
                        <option value="paid">paid</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Reason
                    </label>
                    <div className="relative">
                        {/* <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> */}
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="your reason"
                            required
                            className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                    {
                        loading ? (
                            <>
                                {/* <Loader2 size={16} className="animate-spin" /> */}
                                applying...
                            </>
                        ) : (
                            "Apply"
                        )
                    }
                </button>
            </form>
        </div >
    )
}

export default LeaveForm
