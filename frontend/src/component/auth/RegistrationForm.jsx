import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";

import { registerUser } from "../../features/auth/authAPI";
import {
    setLoading,
    setError,
    setUser,
} from "../../features/auth/authSlice";

function RegistrationForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const password = watch("password");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (data) => {
        try {
            dispatch(setLoading(true));

            const response = await registerUser({
                name: data.name,
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

                {/* Left */}

                <div className="hidden lg:flex bg-linear-to-br from-indigo-700 to-blue-600 text-white p-12 flex-col justify-center">

                    <h1 className="text-5xl font-bold leading-tight">
                        Join ShopHub
                    </h1>

                    <p className="mt-6 text-lg text-blue-100 leading-8">
                        Create your account to start shopping,
                        manage orders, wishlist and enjoy a
                        seamless shopping experience.
                    </p>

                </div>

                {/* Right */}

                <div className="p-10 lg:p-14">

                    <h2 className="text-4xl font-bold mb-3">
                        Register
                    </h2>

                    <p className="text-gray-500 mb-10">
                        Create your new account
                    </p>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >

                        {/* Name */}

                        <div>

                            <label className="font-medium">
                                Full Name
                            </label>

                            <div className="relative mt-2">

                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("name", {
                                        required:
                                            "Name is required",
                                    })}
                                />

                            </div>

                            {errors.name && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.name.message}
                                </p>
                            )}

                        </div>

                        {/* Email */}

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
                                        required:
                                            "Email is required",
                                    })}
                                />

                            </div>

                            {errors.email && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.email.message}
                                </p>
                            )}

                        </div>

                        {/* Password */}

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
                                    placeholder="Enter password"
                                    className="w-full border rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("password", {
                                        required:
                                            "Password is required",
                                        minLength: {
                                            value: 6,
                                            message:
                                                "Password must be at least 6 characters",
                                        },
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

                        {/* Confirm Password */}

                        <div>

                            <label className="font-medium">
                                Confirm Password
                            </label>

                            <div className="relative mt-2">

                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm password"
                                    className="w-full border rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register(
                                        "confirmPassword",
                                        {
                                            required:
                                                "Confirm Password is required",
                                            validate: (
                                                value
                                            ) =>
                                                value ===
                                                    password ||
                                                "Passwords do not match",
                                        }
                                    )}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </button>

                            </div>

                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-2">
                                    {
                                        errors.confirmPassword
                                            .message
                                    }
                                </p>
                            )}

                        </div>

                        <button
                            type="submit"
                            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
                        >
                            Create Account
                        </button>

                        <p className="text-center text-gray-500">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Login
                            </Link>

                        </p>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default RegistrationForm;