import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apierror.js";
import asynchandler from "../utils/asynchandler.js";

// ==========================================
// 1. ADD TO CART
// ==========================================
export const addToCart = asynchandler(async (req, res) => {
    // Robust: Accept either product or productId from body
    const productId = req.body.productId || req.body.product;
    const quantity = Number(req.body.quantity) || 1;

    if (!productId) {
        throw new ApiError("Product ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError("Invalid product ID format", 400);
    }

    if (quantity <= 0) {
        throw new ApiError("Quantity must be at least 1", 400);
    }

    const productData = await Product.findById(productId);
    if (!productData) {
        throw new ApiError("Product not found in database", 404);
    }

    if (productData.stock <= 0) {
        throw new ApiError(`"${productData.title}" is currently out of stock`, 400);
    }

    // Check if item already exists in user's cart
    const existingCartItem = await Cart.findOne({
        user: req.user._id,
        product: productId,
    });

    if (existingCartItem) {
        const totalQuantity = existingCartItem.quantity + quantity;
        if (totalQuantity > productData.stock) {
            throw new ApiError(
                `Cannot add more. Available stock is ${productData.stock}, and you already have ${existingCartItem.quantity} in your cart.`,
                400
            );
        }

        existingCartItem.quantity = totalQuantity;
        await existingCartItem.save();
        await existingCartItem.populate("product");

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully",
            cartItem: existingCartItem,
        });
    }

    if (quantity > productData.stock) {
        throw new ApiError(`Requested quantity exceeds available stock (${productData.stock})`, 400);
    }

    const cartItem = await Cart.create({
        user: req.user._id,
        product: productId,
        quantity,
    });

    await cartItem.populate("product");

    return res.status(201).json({
        success: true,
        message: "Product added to cart successfully",
        cartItem,
    });
});

// ==========================================
// 2. GET MY CART
// ==========================================
export const getMyCart = asynchandler(async (req, res) => {
    const cartItems = await Cart.find({
        user: req.user._id,
    })
    .populate("product")
    .lean();

    return res.status(200).json({
        success: true,
        count: cartItems.length,
        cart: cartItems,
    });
});

// ==========================================
// 3. UPDATE CART QUANTITY
// ==========================================
export const updateCartItemQuantity = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid cart item ID", 400);
    }

    const parsedQuantity = Number(quantity);
    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
        throw new ApiError("Quantity must be a positive number greater than 0", 400);
    }

    const cartItem = await Cart.findOne({
        _id: id,
        user: req.user._id,
    });

    if (!cartItem) {
        throw new ApiError("Cart item not found or unauthorized", 404);
    }

    const productData = await Product.findById(cartItem.product);
    if (!productData) {
        throw new ApiError("Product not found", 404);
    }

    if (parsedQuantity > productData.stock) {
        throw new ApiError(`Requested quantity exceeds available stock (${productData.stock})`, 400);
    }

    cartItem.quantity = parsedQuantity;
    await cartItem.save();
    await cartItem.populate("product");

    return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cartItem,
    });
});

// ==========================================
// 4. REMOVE ITEM FROM CART
// ==========================================
export const removeCartItem = asynchandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid cart item ID", 400);
    }

    const deletedItem = await Cart.findOneAndDelete({
        _id: id,
        user: req.user._id,
    });

    if (!deletedItem) {
        throw new ApiError("Cart item not found or unauthorized", 404);
    }

    return res.status(200).json({
        success: true,
        message: "Cart item removed successfully",
    });
});

// ==========================================
// 5. CLEAR CART
// ==========================================
export const clearCart = asynchandler(async (req, res) => {
    await Cart.deleteMany({ user: req.user._id });

    return res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
    });
});

// Backward-compatible named exports
export const addtocart = addToCart;
export const getmycart = getMyCart;
export const updatecart = updateCartItemQuantity;
export const removecartitem = removeCartItem;
