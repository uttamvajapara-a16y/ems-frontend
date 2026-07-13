import { useEffect, useState } from 'react'
import React from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { Loader2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeDept } from '../../utils/deptSlice';

const Departments = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch() ;
    const departments = useSelector((store) => store.department);

    const handleDeleteDept = (id) => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            axiosInstance.delete(`/department/delete/${id}`)
                .then((res) => {
                    console.log(res.data);
                    // window.location.reload();
                    dispatch(removeDept(id)) ;
                })
                .catch((err) => {
                    console.log(err);
                    setError("Failed to delete department");
                })
        }
    }

    const [error, setError] = useState("");

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {user.role === "Admin" && <div className='flex justify-end'>
                <Link
                    to="/department/create"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:shadow-none dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:active:bg-indigo-700 dark:shadow-indigo-500/20 transition-colors duration-150"
                >
                    Create Department
                </Link>
            </div>}

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {departments.length === 0 ? (
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
                                    {user.role === "Admin" && <th className="px-6 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide"></th>}
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

                                        {user.role === "Admin" && <td>
                                            <button
                                                disabled={user?.role === "HR" || user?.role === "Employee"}
                                                onClick={() => handleDeleteDept(d._id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 ml-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200 hover:bg-red-100 active:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20 transition-colors duration-150"
                                            >
                                                delete
                                            </button>
                                            <Link
                                                to={`/department/create`}
                                                state={{ toEdit: d }}
                                                disabled={user?.role === "HR" || user?.role === "Employee"}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 ml-3 rounded-lg bg-green-50 text-green-700 text-xs font-medium border border-green-200 hover:bg-green-100 active:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 dark:hover:bg-green-500/20 transition-colors duration-150"
                                            >
                                                Edit
                                            </Link>
                                        </td>}
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
