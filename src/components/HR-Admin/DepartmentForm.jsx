import { useNavigate } from 'react-router-dom';
import { useState } from 'react' ;
import axiosInstance from '../../utils/axiosInstance' ;
import React from 'react'
import { Loader2 } from 'lucide-react';

const DepartmentForm = () => {
    const [error , setError] = useState("") ;
    const [loading , setLoading] = useState(false) ;

    const [departmentName , setDepartmentName] = useState("") ;
    const [description , setDescription] = useState("") ;
    const [headName , setHeadName] = useState("") ;

    const navigate = useNavigate() ;

    const handleCreateDepartment = async (e) => {
        e.preventDefault() ;
        setError("") ;
        setLoading(true) ;
        try{
            const res = await axiosInstance.post("/department/create" , {departmentName , description , headName }) ;
            navigate("/departments")
        } catch (err){
            setError(err?.response?.data?.message) ;
            console.log("Error in applying leave" + err.message) ;
        } finally {
            setLoading(false) ;
        }
    }
  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8">
            <form
                className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8"
                onSubmit={handleCreateDepartment}
            >
                <div className="text-center mb-8">
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Department</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create Department</p>
                </div>

                {error && (
                    <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}


                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >Department Name: </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            placeholder="IT DEPARTMENT"
                            required
                            className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >Description: </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Head Name
                    </label>
                    <div className="relative">
                        {/* <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> */}
                        <input
                            type="text"
                            value={headName}
                            onChange={(e) => setHeadName(e.target.value)}
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
                                <Loader2 size={16} className="animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create"
                        )
                    }
                </button>
            </form>
        </div >
  )
}

export default DepartmentForm
