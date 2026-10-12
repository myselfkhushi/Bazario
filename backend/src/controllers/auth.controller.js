import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";

// 1. Centralized Cookie Options (Reusable)
const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
};

export const registerUser = asynchandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Strict validation
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
        throw new ApiError("Name, valid email, and minimum 6-character password are required", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw new ApiError("User already registered with this email", 400);
    }

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
    });

    const token = generateToken(user._id);

    // 🛑 CRITICAL FIX: Hide password before sending response!
    const userResponse = user.toObject();
    delete userResponse.password;

    res.cookie("token", token, getCookieOptions());
    res.status(201).json({
        success: true,
        message: "User successfully registered",
        user: userResponse,
    });
});

export const loginUser = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
        throw new ApiError("Email and password are required", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Password explicitly select kiya kyunki schema mein select: false hota hai
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
        throw new ApiError("Invalid email or password", 401); // 401 Unauthorized
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        throw new ApiError("Invalid email or password", 401);
    }

    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.cookie("token", token, getCookieOptions());
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user,
    });
});

export const getProfile = asynchandler(async (req, res) => {
    // req.user Auth Middleware se aata hai
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

export const logoutUser = asynchandler(async (req, res) => {
    const { maxAge, ...clearOptions } = getCookieOptions();

    res.clearCookie("token", clearOptions);
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
});

export const adminDashboard = asynchandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome admin",
    });
});

export const updateProfile = asynchandler(async (req, res) => {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError("User not found", 404);
    }

    if (name?.trim()) user.name = name.trim();

    if (email?.trim()) {
        const normalizedEmail = email.trim().toLowerCase();

        // Optimized MongoDB query using $ne
        const emailExists = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: user._id },
        });

        if (emailExists) {
            throw new ApiError("Email is already taken by another account", 400);
        }
        user.email = normalizedEmail;
    }

    await user.save();

    user.password = undefined;

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
    });
});