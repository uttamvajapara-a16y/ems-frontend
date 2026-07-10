import { useEffect, useState } from 'react'
import React from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetDepartments = async () => {
        try {
            const res = await axiosInstance.get("/department/get/all");
            setDepartments(res.data.data);
            // console.log(res.data.data)
        } catch (err) {
            setError(err.response.data.message || "Failed to fetch departments")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetDepartments();
    }, [])
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className='flex justify-end'>
                <Link
                    to="/department/create"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:shadow-none dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:active:bg-indigo-700 dark:shadow-indigo-500/20 transition-colors duration-150"
                >
                    Create Department 
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {loading ? (
                    <div className="min-h-75 flex items-center justify-center">
                        <Loader2 className="animate-spin text-indigo-500" size={28} />
                    </div>
                ) : departments.length === 0 ? (
                    <div className="text-center py-16">
                        <Users className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={36} />
                        <p className="text-sm text-slate-400 dark:text-slate-500">No departments records found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-left">
                                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Department Name</th>
                                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Description</th>
                                    <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Head Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map((d) => (
                                    <tr
                                        key={d._id}
                                        className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {d.departmentName}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {d.description ? d.description : "—"}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            <span className="flex items-center gap-1.5">
                                                {d.headName ? d.headName : "—"}
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
    )
}

export default Departments
