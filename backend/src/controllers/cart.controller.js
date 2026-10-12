import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apierror.js";
import asynchandler from "../utils/asynchandler.js";

// 1. ADD TO CART
export const addtocart = asynchandler(async (req, res) => {
    const { product, quantity } = req.body;

    // 1. Basic & ID Validation
    if (!product || !quantity) {
        throw new ApiError("Product ID and quantity are required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(product)) {
        throw new ApiError("Invalid product ID format", 400);
    }

    const parsedQuantity = Number(quantity);
    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
        throw new ApiError("Quantity must be a positive number greater than 0", 400);
    }

    // 2. Pehle Product check karo (Dukan mein samaan hai ya nahi?)
    const productData = await Product.findById(product);
    if (!productData) {
        throw new ApiError("Product not found in database", 404);
    }

    // 3. Check karo user ki cart mein ye pehle se hai ya nahi
    const existingCartItem = await Cart.findOne({
        user: req.user._id,
        product,
    });

    // Case A: Agar pehle se cart mein hai (Update Quantity)
    if (existingCartItem) {
        const totalQuantity = existingCartItem.quantity + parsedQuantity;

        if (totalQuantity > productData.stock) {
            throw new ApiError(
                `Cannot add. Available stock is ${productData.stock}, you already have ${existingCartItem.quantity} in cart`,
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

    // Case B: Pehli baar cart mein daal rahe hain (Create New)
    if (parsedQuantity > productData.stock) {
        throw new ApiError(`Requested quantity exceeds available stock (${productData.stock})`, 400);
    }

    const cartItem = await Cart.create({
        user: req.user._id,
        product,
        quantity: parsedQuantity,
    });

    await cartItem.populate("product");

    return res.status(201).json({
        success: true,
        message: "Product added to cart successfully",
        cartItem,
    });
});

// 2. GET MY CART
export const getmycart = asynchandler(async (req, res) => {
    // .lean() lagaya taaki query fast ho aur RAM bache (Read-only query)
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

// 3. UPDATE CART QUANTITY
export const updatecart = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid cart item ID", 400);
    }

    const parsedQuantity = Number(quantity);
    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
        throw new ApiError("Quantity must be a positive number greater than 0", 400);
    }

    // Database level security: item ki ID bhi match ho AUR user bhi logged-in user hi ho!
    const cartItem = await Cart.findOne({
        _id: id,
        user: req.user._id,
    });

    if (!cartItem) {
        throw new ApiError("Cart item not found or unauthorized", 404);
    }

    // Product ka stock check karo
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

// 4. REMOVE ITEM FROM CART
export const removecartitem = asynchandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid cart item ID", 400);
    }

    // Atomic Delete: Ek hi jhatke mein security check aur delete!
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