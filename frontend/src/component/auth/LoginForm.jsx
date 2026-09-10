import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import { loginUser } from "../../features/auth/authAPI";
import { setLoading, setUser, setError } from "../../features/auth/authSlice";

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        try {
            dispatch(setLoading(true));

            const response = await loginUser({
                email: data.email,
                password: data.password,
            });

            dispatch(setUser(response.user));

            navigate("/");
        } catch (error) {
            dispatch(
                setError(
                    error.response?.data?.message ||
                        "Something went wrong"
                )
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 via-white to-indigo-100 px-6">

            <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">

                {/* Left Side */}

                <div className="hidden lg:flex bg-linear-to-br from-blue-600 to-indigo-700 text-white p-12 flex-col justify-center">

                    <h1 className="text-5xl font-bold leading-tight">
                        Welcome Back!
                    </h1>

                    <p className="mt-6 text-lg text-blue-100 leading-8">
                        Login to continue shopping, manage your orders,
                        wishlist and explore amazing products.
                    </p>

                </div>

                {/* Right Side */}

                <div className="p-10 lg:p-14">

                    <h2 className="text-4xl font-bold mb-3">
                        Login
                    </h2>

                    <p className="text-gray-500 mb-10">
                        Sign in to your account
                    </p>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >

                        <div>

                            <label className="font-medium">
                                Email
                            </label>

                            <div className="relative mt-2">

                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("email", {
                                        required: "Email is required",
                                    })}
                                />

                            </div>

                            {errors.email && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.email.message}
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="font-medium">
                                Password
                            </label>

                            <div className="relative mt-2">

                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    className="w-full border rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("password", {
                                        required:
                                            "Password is required",
                                    })}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </button>

                            </div>

                            {errors.password && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.password.message}
                                </p>
                            )}

                        </div>

                        <div className="flex justify-between items-center">

                            <label className="flex items-center gap-2 text-sm">

                                <input type="checkbox" />

                                Remember Me

                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Forgot Password?
                            </Link>

                        </div>

                        <button
                            type="submit"
                            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
                        >
                            Login
                        </button>

                        <p className="text-center text-gray-500">

                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Register
                            </Link>

                        </p>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default LoginForm;