import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShoppingBag, Store, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import { loginUser } from "../../features/auth/authAPI";
import { setLoading, setUser, setError } from "../../features/auth/authSlice";

function LoginForm() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const handleLoginSuccess = (user) => {
        toast.success(`Welcome back, ${user.name}!`);
        if (user.role === "seller") {
            navigate("/seller/dashboard");
        } else if (user.role === "admin") {
            navigate("/admin");
        } else {
            navigate("/");
        }
    };

    const onSubmit = async (data) => {
        try {
            setSubmitting(true);
            setFormError("");
            dispatch(setLoading(true));

            const response = await loginUser({
                email: data.email.trim(),
                password: data.password,
            });

            if (response.token) {
                localStorage.setItem("token", response.token);
            }

            dispatch(setUser(response.user));
            handleLoginSuccess(response.user);
        } catch (error) {
            const msg = error.response?.data?.message || "Invalid email or password";
            setFormError(msg);
            toast.error(msg);
            dispatch(setError(msg));
        } finally {
            setSubmitting(false);
            dispatch(setLoading(false));
        }
    };

    const quickDemoLogin = async (email, password) => {
        setValue("email", email);
        setValue("password", password);
        try {
            setSubmitting(true);
            setFormError("");
            dispatch(setLoading(true));

            const response = await loginUser({ email, password });
            if (response.token) {
                localStorage.setItem("token", response.token);
            }
            dispatch(setUser(response.user));
            handleLoginSuccess(response.user);
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to login with demo account";
            setFormError(msg);
            toast.error(msg);
            dispatch(setError(msg));
        } finally {
            setSubmitting(false);
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-8 bg-slate-50 font-sans">
            <div className="flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden max-w-6xl w-full shadow-2xl shadow-slate-200/50">

                {/* Left Side: Premium Image Panel */}
                <div className="hidden lg:flex lg:w-5/12 relative bg-slate-900 text-white flex-col justify-between p-12 overflow-hidden">
                    {/* Vibrant Background Image */}
                    <img 
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" 
                        alt="Premium Lifestyle" 
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/10"></div>

                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-2 mb-12">
                            <div className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center font-black text-xl shadow-lg">
                                B
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white uppercase">
                                Bazario
                            </span>
                        </Link>

                        <h1 className="text-4xl font-black leading-[1.1] mb-4 tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
                            Welcome back <br/> to premium.
                        </h1>
                        <p className="text-slate-300 text-sm leading-relaxed max-w-xs font-medium">
                            Sign in to access your orders, track shipments, and discover exclusive new arrivals.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-4 pt-8 border-t border-white/20">
                        <div className="flex items-center gap-3 text-xs font-bold text-white uppercase tracking-widest">
                            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                            <span>Verified Authentic</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-white uppercase tracking-widest">
                            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                            <span>Secure Checkout</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:w-7/12 p-8 sm:p-14 xl:p-20 flex flex-col justify-center bg-white">
                    
                    {/* Header */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                            Sign In
                        </h2>
                        <p className="text-slate-500 text-sm mt-2 font-medium">
                            Enter your credentials to continue shopping
                        </p>
                    </div>

                    {/* Quick 1-Click Demo Buttons */}
                    <div className="mb-10 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 block rounded-full animate-pulse"></span> 
                            Quick Demo Access
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => quickDemoLogin("buyer@demo.com", "password123")}
                                disabled={submitting}
                                className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Demo Buyer</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => quickDemoLogin("seller@demo.com", "password123")}
                                disabled={submitting}
                                className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                            >
                                <Store className="w-4 h-4" />
                                <span>Demo Seller</span>
                            </button>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {formError && (
                        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl flex items-start gap-3 text-sm font-semibold border border-red-100">
                            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                            <span>{formError}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all"
                                    style={{
                                        borderColor: errors.email ? "#EF4444" : undefined,
                                        paddingLeft: "48px",
                                    }}
                                    {...register("email", {
                                        required: "Email address is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address format",
                                        },
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-2 font-medium">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-slate-700">
                                    Password
                                </label>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                    Demo: <span className="text-purple-600">password123</span>
                                </span>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pr-12 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all"
                                    style={{
                                        borderColor: errors.password ? "#EF4444" : undefined,
                                        paddingLeft: "48px",
                                    }}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-2 font-medium">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full mt-4 py-4 px-6 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-[0_8px_30px_rgb(147,51,234,0.3)] hover:shadow-[0_8px_30px_rgb(147,51,234,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In to Account</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Bottom registration link */}
                    <div className="mt-10 pt-6 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-purple-600 font-bold hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;