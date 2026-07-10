import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import React, { useState } from 'react'
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // const [emailId, setEmailId] = useState("uttam@gmail.com");
    const [emailId, setEmailId] = useState("admin2@gmail.com");
    // const [password, setPassword] = useState("Uttam@124");  
    const [password, setPassword] = useState("Admin2@124");
    const [role, setRole] = useState("Admin");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            const res = await axiosInstance.post("/login" , {emailId, password, role}) ;
            // console.log(res) ;
            dispatch(addUser(res.data)) ;
            navigate("/dashboard") ;
        } catch (error){
            setError(error?.response?.data?.message || "Something went wrong");
            console.log("Error in handlelogin : " + error);
        } finally{
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            <form
                className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8"
                onSubmit={handleLogin}
            >
                {/* logo/heading */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                        EMS
                    </div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Welcome back</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}


                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >EmailId: </label>
                    <div className="relative">
                        {/* <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> */}
                        <input
                            type="email"
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                            placeholder="you@company.com"
                            required
                            className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Password
                    </label>
                    <div className="relative">
                        {/* <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> */}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
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
                        <option value="Employee">Employee</option>
                        <option value="Admin">Admin</option>
                        <option value="HR">HR</option>
                    </select>
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
                                Signing In...
                            </>
                        ) : (
                            "Sign In"
                        )
                    }
                </button>
            </form>
        </div>
    )
}

export default Login
