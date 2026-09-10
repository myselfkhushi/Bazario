import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    User,
    Mail,
    Shield,
    Package,
    Heart,
    Store,
    Settings,
    LogOut,
    Edit2,
    Check,
    X,
    Camera
} from "lucide-react";
import { updateUserProfile } from "../features/auth/authAPI";
import { setUser, logout } from "../features/auth/authSlice";
import { logoutUser } from "../features/auth/authAPI";
import LogoLoader from "../component/common/LogoLoader.jsx";

function Profile() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
    });

    if (!user) {
        return <LogoLoader />;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            toast.error("Name and Email cannot be empty.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await updateUserProfile(formData);
            if (response.success) {
                dispatch(setUser(response.user));
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await logoutUser();
            dispatch(logout());
            toast.success("Signed out successfully");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your profile and preferences.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar Navigation */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <nav className="space-y-1">
                            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 bg-white text-slate-900 text-sm font-bold rounded-xl border border-slate-200 shadow-sm transition">
                                <User className="w-4 h-4" />
                                Personal Info
                            </Link>
                            <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm font-semibold rounded-xl transition">
                                <Package className="w-4 h-4" />
                                My Orders
                            </Link>
                            <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm font-semibold rounded-xl transition">
                                <Heart className="w-4 h-4" />
                                Wishlist
                            </Link>
                            {user.role === "buyer" && (
                                <Link to="/register/seller" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-purple-600 hover:bg-purple-50 text-sm font-semibold rounded-xl transition">
                                    <Store className="w-4 h-4" />
                                    Become a Seller
                                </Link>
                            )}
                            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 text-sm font-semibold rounded-xl transition mt-4">
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-6">
                        
                        {/* Personal Information Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-6 sm:p-8 border-b border-slate-100 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-5">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-black uppercase">
                                            {user.name[0]}
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                                        <p className="text-sm font-medium text-slate-500 capitalize">{user.role} Account</p>
                                    </div>
                                </div>
                                
                                {!isEditing ? (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-xl border border-slate-200 transition"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData({ name: user.name, email: user.email });
                                            }}
                                            className="px-4 py-2 hover:bg-slate-50 text-slate-600 text-sm font-bold rounded-xl transition"
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <div className="w-3.5 h-3.5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <Check className="w-3.5 h-3.5" />
                                            )}
                                            Save
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 sm:p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            Full Name
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <User className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email Address */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            Email Address
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-semibold text-slate-900">{user.email}</span>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Security Settings Placeholder */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-slate-400" />
                                Security
                            </h3>
                            <div className="flex items-center justify-between py-4 border-t border-slate-100">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Password</p>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5">Change your account password securely.</p>
                                </div>
                                <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition">
                                    Update Password
                                </button>
                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
}

export default Profile;