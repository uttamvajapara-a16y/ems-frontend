import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

const RegisterUser = () => {

    const [error, setError] = useState("");
    const [loading, setloading] = useState(false);
    const [fetchingDepts, setFetchingDepts] = useState(true);

    const [firstName, setFirstname] = useState("meet");
    const [lastName, setLastname] = useState("savaj");
    const [emailId, setEmailId] = useState("savaj@gmail.com");
    const [password, setPassword] = useState("Savaj@124");
    const [role, setRole] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [designation, setDesignation] = useState("");
    const [dateOfJoining, setDateOfJoining] = useState("");
    const [salary, setSalary] = useState("30000");

    const [departments, setDepartments] = useState([]);

    const navigate = useNavigate();

    const fetchDepartments = async () => {
        try {
            setFetchingDepts(true);
            const res = await axiosInstance.get("/department/get/all");
            setDepartments(res.data.data);
            // console.log(res.data.data)
        } catch (err) {
            setError(err?.response?.data?.message || "error in fetching departments");
        } finally {
            setFetchingDepts(false);
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        const userData = {
            firstName,
            lastName,
            emailId,
            password,
            role,
            departmentName,
            designation,
            dateOfJoining,
            salary
        }
        console.log(userData)
        try {
            setloading(true);
            const res = await axiosInstance.post("/register", userData);
            navigate("/dashboard");
        } catch (err) {
            setError(err?.response?.data?.message || "can not register user");
        } finally {
            setloading(false);
        }
    }

    useEffect(() => {
        fetchDepartments();
    }, [])

    return (
        <div className="min-h-[calc(100vh-14rem)] max-w-5xl mx-auto flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8">
            <form
                className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8"
                onSubmit={handleRegister}
            >
                <div className="text-center mb-8">
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">User</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create New User</p>
                </div>

                {error && (
                    <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                        >First Name: </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstname(e.target.value)}
                                required
                                className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                        >Last Name </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastname(e.target.value)}
                                required
                                className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Email Id:
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={emailId}
                                onChange={(e) => setEmailId(e.target.value)}
                                required
                                className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Password:
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        >
                            <option value="" disabled>Select a role</option>
                            <option value="Admin">Admin</option>
                            <option value="HR">HR</option>
                            <option value="Employee">Employee</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Department Name
                        </label>
                        <select
                            value={departmentName}
                            required
                            onChange={(e) => setDepartmentName(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        >
                            <option value="">ALL DEPARTMENTS</option>
                            {
                                departments.map((d) => (
                                    <option key={d._id} value={d.departmentName}>{d.departmentName}</option>
                                ))
                            }
                        </select>
                    </div>

                    {role === "Employee" && <div className="mb-4">
                        <label
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                        >Designation </label>
                        <div className="relative">
                            <select
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        >
                            <option value="">ALL Designation</option>
                            <option value="jr.developer">jr.developer</option>
                            <option value="sr.developer">sr.developer</option>
                            <option value="teamleader">teamleader</option>
                        </select>
                        </div>
                    </div>}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Date Of Joining
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={dateOfJoining}
                                onChange={(e) => setDateOfJoining(e.target.value)}
                                required
                                className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Salary:
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                required
                                className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mx-auto w-[300px] px-3 py-2.5 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                    {
                        loading ? (
                            <>
                                <Loader size={16} className="animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create User"
                        )
                    }
                </button>
            </form>
        </div>
    )
}

export default RegisterUser
