import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    User,
    Mail,
    Phone,
    Building2,
    Briefcase,
    Calendar,
    MapPin,
    Save,
    X,
    Camera,
    Loader2,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { addUser } from "../utils/userSlice";

const Profile = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null) ;

    const userData = {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        age: user?.age || "",
        gender: user?.gender || "male",
        profileImage: user?.profileImage || "",
        Address: user?.Address || "",
        phone: user?.phone || ""
    }

    const [formData, setFormData] = useState(userData);
    const [originalData, setOriginalData] = useState(userData);
    const [isChanged, setIsChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [previewImage, setPreviewImage] = useState(user?.profileImage || "");

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsChanged(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData(prev => ({ ...prev, profileImage: file }));
        setPreviewImage(URL.createObjectURL(file));
        setIsChanged(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (val !== undefined && val !== null) data.append(key, val);
            });
            const res = await axiosInstance.put(`/employee/update/${user._id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setOriginalData(res?.data?.data);
            setSuccess(res?.data?.message);
            dispatch(addUser(res?.data?.data));
            setIsChanged(false);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(originalData);
        setIsChanged(false);
    };

    const handleCameraClick = () => {
        fileInputRef.current.click() ;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">My Profile</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    View and update your personal information.
                </p>
            </div>

            {error && <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">{error}</div>}
            {success && <div className="px-4 py-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-sm text-green-600 dark:text-green-400">{success}</div>}

            <form
                onSubmit={handleSave}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800"
            >
                {/* --- top section: avatar + name + role badge --- */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-semibold text-white">
                            {previewImage
                                ? <img src={previewImage} alt="user photo" className="w-full h-full object-cover rounded-full" />
                                : <span>{user?.firstName?.[0]?.toUpperCase() || "U"}</span>
                            }
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        {/* optional avatar upload button - only wire this up if you want photo upload later */}
                        <button
                            type="button"
                            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm cursor-pointer"
                            title="Change photo"
                            onClick={handleCameraClick}
                        >
                            <Camera size={13} />
                        </button>
                    </div>

                    <div className="text-center sm:text-left">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{user?.designation || "—"}</p>
                        <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20 capitalize">
                            {user?.role}
                        </span>
                    </div>
                </div>

                {/* --- form fields --- */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            First Name
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            />
                        </div>
                    </div>

                    {/* Email - usually read-only, login identity shouldn't change casually */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Email
                        </label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                defaultValue={user?.emailId}
                                disabled={user?.role !== "Admin"}

                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Last Name
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            />
                        </div>
                    </div>

                    {user?.role !== "Admin" && (<>
                        {/* Status - usually read-only too */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Status
                            </label>
                            <div className="relative">
                                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    defaultValue={user?.status.toUpperCase() || "—"}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Phone
                            </label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    placeholder="+91 9999999999"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                />
                            </div>
                        </div>

                        {/* Date of Joining - read-only */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Date of Joining
                            </label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    defaultValue={
                                        user?.dateOfJoining
                                            ? new Date(user.dateOfJoining).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : "—"
                                    }
                                    disabled
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* age */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Age
                            </label>
                            <div className="relative">
                                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.age}
                                    onChange={(e) => handleChange("age", e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                />
                            </div>
                        </div>

                        {/* salary */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Salary
                            </label>
                            <div className="relative">
                                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    defaultValue={user?.salary}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* gender  */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                gender
                            </label>
                            <div className="relative">
                                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                {/* <input
                                type="text"
                                defaultValue={user?.age || "—"}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                            /> */}
                                <select
                                    name="gender"
                                    id="gender"
                                    value={formData.gender}
                                    onChange={(e) => handleChange("gender", e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Address - editable */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Address
                            </label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                                <textarea
                                    rows={2}
                                    value={formData.Address}
                                    onChange={(e) => handleChange("Address", e.target.value)}
                                    placeholder="Enter your current address"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                />
                            </div>
                        </div>
                    </>
                    )}

                </div>

                {/* --- action buttons --- */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={!isChanged}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <X size={15} />
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={!isChanged || loading}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                    >
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;