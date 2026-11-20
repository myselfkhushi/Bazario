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
    const { name, email, password, role } = req.body;

    // Strict validation
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
        throw new ApiError("Name, valid email, and minimum 6-character password are required", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const assignedRole = role === "seller" ? "seller" : "buyer";

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw new ApiError("User already registered with this email", 400);
    }

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: assignedRole,
        sellerDetails: assignedRole === "seller" ? { isSellerVerified: false } : undefined
    });

    const token = generateToken(user._id);

    // 🛑 CRITICAL FIX: Hide password before sending response!
    const userResponse = user.toObject();
    delete userResponse.password;

    res.cookie("token", token, getCookieOptions());
    res.status(201).json({
        success: true,
        message: assignedRole === "seller" 
            ? "Seller account created! Please complete verification." 
            : "User successfully registered",
        token,
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
        token,
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

// 🏪 Complete Seller Verification & Onboarding
export const completeSellerOnboarding = asynchandler(async (req, res) => {
    const userId = req.user._id;
    const { phone, gstin, storeName, storeDescription, pickupAddress } = req.body;

    // Resilient Phone Validation (strips country codes and non-digits)
    const cleanPhone = phone ? phone.toString().replace(/\D/g, "").slice(-10) : "";
    if (!cleanPhone || cleanPhone.length !== 10) {
        throw new ApiError("Valid 10-digit mobile number is required", 400);
    }

    // Resilient GSTIN Validation
    const cleanGstin = gstin ? gstin.trim().toUpperCase() : "";
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!cleanGstin || !gstRegex.test(cleanGstin)) {
        throw new ApiError("Valid 15-character Indian GSTIN is required (e.g. 08BDRPC2330N1ZD)", 400);
    }

    if (!storeName || storeName.trim().length < 2) {
        throw new ApiError("Store name is required (minimum 2 characters)", 400);
    }

    if (!pickupAddress || !pickupAddress.street?.trim() || !pickupAddress.city?.trim() || !pickupAddress.state?.trim() || !pickupAddress.pincode?.trim()) {
        throw new ApiError("Complete warehouse pickup location (street, city, state, pincode) is required", 400);
    }

    const panNumber = cleanGstin.slice(2, 12).toUpperCase();

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            role: "seller",
            phone: cleanPhone,
            isPhoneVerified: true,
            isEmailVerified: true,
            sellerDetails: {
                isSellerVerified: true,
                storeName: storeName.trim(),
                storeDescription: storeDescription ? storeDescription.trim() : "",
                gstin: cleanGstin,
                panNumber,
                pickupAddress: {
                    street: pickupAddress.street.trim(),
                    city: pickupAddress.city.trim(),
                    state: pickupAddress.state.trim(),
                    pincode: pickupAddress.pincode.trim(),
                }
            }
        },
        { new: true }
    );

    if (!updatedUser) {
        throw new ApiError("User not found", 404);
    }

    const token = generateToken(updatedUser._id);
    res.cookie("token", token, getCookieOptions());

    res.status(200).json({
        success: true,
        message: "Seller verification and onboarding completed successfully! Welcome to Seller Hub.",
        token,
        user: updatedUser
    });
});