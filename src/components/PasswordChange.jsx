
import React, { useState } from 'react'
import { toast, ToastContainer, Bounce } from 'react-toastify';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { Loader2, Lock } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const PasswordChange = () => {
    const user = useSelector((store) => store.user);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true) ;
        setError("") ;
        try {
            if (newPassword !== confirmNewPassword) {
                setError("New Password and Confirm New Password must be same");
                return ;
            }
            await axiosInstance.post('/auth/change-password', { oldPassword, newPassword, role: user.role })
            toast.success('Password Changed successfully.', {
                toastId: nanoid(),
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            setOldPassword("")
            setNewPassword("")
            setConfirmNewPassword("");
        } catch (err) {
            const errMsg = err?.response?.data?.message || "something went wrong";
            {!error && toast.error(errMsg, {
                toastId: nanoid(),
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });}
        } finally{
            setLoading(false) ;
        }
    }
    return (
        <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8">
            <form
                className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8"
                onSubmit={handleSubmit}
            >
                <div className="text-center mb-8">
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Password</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1"> Update Password</p>
                </div>

                {error && (
                    <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >Old Password: </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="old password"
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >New Password: </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="new password"
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Confirm New Password: 
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="confirm new password"
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
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
                                Updating...
                            </>
                        ) : (
                            "Update"
                        )
                    }
                </button>
            </form>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </div >
    )
}

export default PasswordChange