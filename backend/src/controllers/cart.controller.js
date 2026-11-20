import mongoose from "mongoose";
import { z } from "zod";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apierror.js";
import asynchandler from "../utils/asynchandler.js";

// ==========================================
// 🛡️ ZOD SCHEMAS FOR STRICT INPUT VALIDATION
// ==========================================
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const addToCartSchema = z.object({
    productId: objectIdSchema,
    variantId: objectIdSchema.optional().nullable(),
    quantity: z.number().int().min(1, "Quantity must be at least 1").max(10, "Max 10 units per item"),
});

const updateQuantitySchema = z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1").max(10, "Max 10 units per item"),
});

/**
 * 🛠️ HELPER: Extract accurate live stock, price, and MRP based on Variant or Parent Product
 */
const resolveProductInventory = (product, variantId) => {
    if (!product || product.isDeleted || product.isListed === false) {
        return { isAvailable: false, reason: "UNAVAILABLE", stock: 0, price: 0, mrp: 0, title: product?.title || "Unavailable" };
    }

    // Agar variantId pass hui hai, toh specific variant ka stock aur price nikalo
    if (variantId && Array.isArray(product.variants) && product.variants.length > 0) {
        const variant = product.variants.find((v) => v._id.toString() === variantId.toString());
        if (!variant || variant.isListed === false) {
            return { isAvailable: false, reason: "VARIANT_UNAVAILABLE", stock: 0, price: 0, mrp: 0, title: product.title };
        }
        return {
            isAvailable: variant.stock > 0,
            reason: variant.stock <= 0 ? "OUT_OF_STOCK" : null,
            stock: variant.stock,
            price: variant.price || product.price,
            mrp: variant.mrp || product.mrp || variant.price || product.price,
            title: `${product.title} (${variant.title || variant.name || "Selected Variant"})`,
            sku: variant.sku || null,
        };
    }

    // Default: Standard product bina variant ke
    return {
        isAvailable: product.stock > 0,
        reason: product.stock <= 0 ? "OUT_OF_STOCK" : null,
        stock: product.stock,
        price: product.price,
        mrp: product.mrp || product.price,
        title: product.title,
        sku: product.sku || null,
    };
};

// =========================================================================
// 1. GET /api/v1/cart (Pure, Safe, Fast Read with Zero Floating Promises)
// =========================================================================
export const getMyCart = asynchandler(async (req, res) => {
    const userId = req.user._id;

    // Fast, lean read without Mongoose document overhead
    const cart = await Cart.findOne({ user: userId })
        .populate({
            path: "items.product",
            select: "title price mrp stock isListed isDeleted images variants sku",
        })
        .lean();

    if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(200).json({
            success: true,
            cart: {
                availableItems: [],
                unavailableItems: [],
                summary: {
                    totalItemsInCart: 0,
                    availableCount: 0,
                    unavailableCount: 0,
                    totalMRP: 0,
                    subtotal: 0,
                    deliveryFee: 0,
                    totalPayable: 0,
                    totalSavings: 0,
                    totalPayableInPaise: 0,
                    hasAdjustedQuantities: false,
                    canProceedToBuy: false,
                },
            },
        });
    }

    const availableItems = [];
    const unavailableItems = [];

    let totalMRPInPaise = 0;
    let subtotalInPaise = 0;
    let hasAdjustedQuantities = false;

    for (const item of cart.items) {
        const prod = item.product;
        const inventory = resolveProductInventory(prod, item.variantId);

        // Case 1: Out of Stock ya Unavailable
        if (!inventory.isAvailable) {
            unavailableItems.push({
                cartItemId: item._id,
                productId: prod ? prod._id : null,
                variantId: item.variantId || null,
                title: inventory.title,
                image: prod?.images?.[0] || null,
                quantity: item.quantity,
                reason: inventory.reason,
                badgeText: inventory.reason === "OUT_OF_STOCK" ? "Out Of Stock" : "Currently Unavailable",
            });
            continue;
        }

        // Case 2: Available - Stock boundary evaluation (Read-time calculation, NO floating write!)
        let effectiveQuantity = item.quantity;
        let warning = null;

        if (item.quantity > inventory.stock) {
            effectiveQuantity = inventory.stock;
            warning = `Only ${inventory.stock} units left. Quantity adjusted in bill.`;
            hasAdjustedQuantities = true;
        }

        // Paise-level arithmetic
        const currentPriceInPaise = Math.round(inventory.price * 100);
        const mrpInPaise = Math.round(inventory.mrp * 100);
        const additionPriceInPaise = Math.round(item.priceAtAddition * 100);

        // Price Drift Detection
        let priceAlert = { status: "NO_CHANGE", differenceInRupees: 0, tag: null };
        if (currentPriceInPaise < additionPriceInPaise) {
            const diff = (additionPriceInPaise - currentPriceInPaise) / 100;
            priceAlert = { status: "PRICE_DROP", differenceInRupees: diff, tag: `Price dropped by ₹${diff}` };
        } else if (currentPriceInPaise > additionPriceInPaise) {
            const diff = (currentPriceInPaise - additionPriceInPaise) / 100;
            priceAlert = { status: "PRICE_INCREASE", differenceInRupees: diff, tag: `Price increased by ₹${diff}` };
        }

        const itemTotalInPaise = currentPriceInPaise * effectiveQuantity;
        const itemMRPTotalInPaise = mrpInPaise * effectiveQuantity;

        totalMRPInPaise += itemMRPTotalInPaise;
        subtotalInPaise += itemTotalInPaise;

        availableItems.push({
            cartItemId: item._id,
            productId: prod._id,
            variantId: item.variantId || null,
            title: inventory.title,
            image: prod.images?.[0] || null,
            price: currentPriceInPaise / 100,
            mrp: mrpInPaise / 100,
            discountPercentage: mrpInPaise > currentPriceInPaise
                ? Math.round(((mrpInPaise - currentPriceInPaise) / mrpInPaise) * 100)
                : 0,
            quantity: effectiveQuantity,
            originalCartQuantity: item.quantity,
            itemTotal: itemTotalInPaise / 100,
            priceAlert,
            warning,
        });
    }

    const deliveryFeeInPaise = subtotalInPaise > 50000 || subtotalInPaise === 0 ? 0 : 4000;
    const totalSavingsInPaise = totalMRPInPaise > subtotalInPaise ? totalMRPInPaise - subtotalInPaise : 0;
    const totalPayableInPaise = subtotalInPaise + deliveryFeeInPaise;

    return res.status(200).json({
        success: true,
        cart: {
            availableItems,
            unavailableItems,
            summary: {
                totalItemsInCart: cart.items.length,
                availableCount: availableItems.length,
                unavailableCount: unavailableItems.length,
                totalMRP: totalMRPInPaise / 100,
                subtotal: subtotalInPaise / 100,
                deliveryFee: deliveryFeeInPaise / 100,
                totalPayable: totalPayableInPaise / 100,
                totalSavings: totalSavingsInPaise / 100,
                totalPayableInPaise,
                savingsMessage: totalSavingsInPaise > 0 ? `You'll save ₹${totalSavingsInPaise / 100} on this order` : null,
                hasAdjustedQuantities,
                canProceedToBuy: availableItems.length > 0,
            },
        },
    });
});

// =========================================================================
// 2. POST /api/v1/cart/add (Atomic Concurrency-Safe Add: 0% Duplication Risk)
// =========================================================================
export const addToCart = asynchandler(async (req, res) => {
    const validation = addToCartSchema.safeParse(req.body);
    if (!validation.success) {
        throw new ApiError(validation.error.errors[0].message, 400);
    }

    const { productId, variantId = null, quantity } = validation.data;
    const userId = req.user._id;

    // Fetch product & resolve live variant stock
    const product = await Product.findById(productId).select("title price mrp stock isListed isDeleted variants").lean();
    if (!product) {
        throw new ApiError("Product not found", 404);
    }

    const inventory = resolveProductInventory(product, variantId);
    if (!inventory.isAvailable) {
        throw new ApiError(`"${inventory.title}" is currently unavailable or out of stock`, 400);
    }

    if (quantity > inventory.stock) {
        throw new ApiError(`Cannot add ${quantity} units. Only ${inventory.stock} available.`, 400);
    }

    // Ensure the base cart document exists for this user (Upsert base cart if missing)
    await Cart.updateOne(
        { user: userId },
        { $setOnInsert: { user: userId, items: [] } },
        { upsert: true }
    );

    // 🛑 ATOMIC STEP 1: Attempt to increment quantity if the EXACT item already exists in items array
    // Condition: Item exists AND (currentQuantity + newQuantity) <= live inventory stock
    const incResult = await Cart.updateOne(
        {
            user: userId,
            items: {
                $elemMatch: {
                    product: productId,
                    variantId: variantId,
                    quantity: { $lte: inventory.stock - quantity },
                },
            },
        },
        {
            $inc: { "items.$.quantity": quantity },
        }
    );

    // Agar item mil gaya aur stock allow hua toh operation complete
    if (incResult.matchedCount > 0) {
        return res.status(200).json({
            success: true,
            message: "Item quantity incremented in cart",
        });
    }

    // Agar matchedCount 0 hai, check karo: Kya item exist karta hai par stock exceed ho gaya?
    const existingCart = await Cart.findOne({
        user: userId,
        "items.product": productId,
        "items.variantId": variantId,
    }).select("items.$").lean();

    if (existingCart && existingCart.items.length > 0) {
        const currentQty = existingCart.items[0].quantity;
        throw new ApiError(
            `Cannot add more. You have ${currentQty} in cart. Total available stock is ${inventory.stock}`,
            400
        );
    }

    // 🛑 ATOMIC STEP 2: Double-Click Safe Conditional Push!
    // Condition: Push ONLY if the item DOES NOT ALREADY EXIST in the array.
    // Agar do clicks ek saath aate hain, pehla pass hoga aur doosra match 0 dega (No duplicate creation!)
    const pushResult = await Cart.updateOne(
        {
            user: userId,
            items: {
                $not: {
                    $elemMatch: {
                        product: productId,
                        variantId: variantId,
                    },
                },
            },
        },
        {
            $push: {
                items: {
                    product: productId,
                    variantId: variantId,
                    quantity,
                    priceAtAddition: inventory.price,
                },
            },
        }
    );

    // Edge Case: Race condition loser - Doosra request theek tab aaya jab pehla insert hua
    if (pushResult.matchedCount === 0) {
        // Retry atomic increment once for the race condition loser
        await Cart.updateOne(
            {
                user: userId,
                "items.product": productId,
                "items.variantId": variantId,
            },
            {
                $inc: { "items.$.quantity": quantity },
            }
        );
    }

    return res.status(200).json({
        success: true,
        message: "Item added to cart successfully",
    });
});

// =========================================================================
// 3. PATCH /api/v1/cart/item/:cartItemId (Target by cartItemId with Variant Stock)
// =========================================================================
export const updateCartItemQuantity = asynchandler(async (req, res) => {
    const { cartItemId } = req.params;

    if (!objectIdSchema.safeParse(cartItemId).success) {
        throw new ApiError("Invalid Cart Item ID", 400);
    }

    const validation = updateQuantitySchema.safeParse(req.body);
    if (!validation.success) {
        throw new ApiError(validation.error.errors[0].message, 400);
    }

    const { quantity } = validation.data;
    const userId = req.user._id;

    // Fetch single cart item directly
    const cart = await Cart.findOne({ user: userId, "items._id": cartItemId }).select("items.$").lean();
    if (!cart || !cart.items || cart.items.length === 0) {
        throw new ApiError("Cart item not found", 404);
    }

    const item = cart.items[0];
    const product = await Product.findById(item.product).select("stock price mrp isListed isDeleted variants title").lean();
    const inventory = resolveProductInventory(product, item.variantId);

    if (!inventory.isAvailable) {
        throw new ApiError(`"${inventory.title}" is no longer available`, 400);
    }

    if (quantity > inventory.stock) {
        throw new ApiError(`Only ${inventory.stock} units available in stock`, 400);
    }

    // Atomic update
    await Cart.updateOne(
        { user: userId, "items._id": cartItemId },
        { $set: { "items.$.quantity": quantity } }
    );

    return res.status(200).json({
        success: true,
        message: "Cart quantity updated successfully",
    });
});

// =========================================================================
// 4. DELETE /api/v1/cart/item/:cartItemId (Atomic Single Item Pull)
// =========================================================================
export const removeCartItem = asynchandler(async (req, res) => {
    const { cartItemId } = req.params;
    const userId = req.user._id;

    if (!objectIdSchema.safeParse(cartItemId).success) {
        throw new ApiError("Invalid Cart Item ID", 400);
    }

    const result = await Cart.updateOne(
        { user: userId },
        { $pull: { items: { _id: cartItemId } } }
    );

    if (result.matchedCount === 0) {
        throw new ApiError("Cart not found", 404);
    }

    return res.status(200).json({
        success: true,
        message: "Item removed from cart",
    });
});

// =========================================================================
// 5. DELETE /api/v1/cart/clear-unavailable (Atomic Bulk Pull - 0% Data Loss)
// =========================================================================
export const removeAllUnavailableItems = asynchandler(async (req, res) => {
    const userId = req.user._id;

    // Step 1: Read cart with populated products to determine IDs to remove
    const cart = await Cart.findOne({ user: userId })
        .populate({
            path: "items.product",
            select: "stock isListed isDeleted variants",
        })
        .lean();

    if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No items to remove",
        });
    }

    const unavailableCartItemIds = [];

    for (const item of cart.items) {
        const inventory = resolveProductInventory(item.product, item.variantId);
        if (!inventory.isAvailable) {
            unavailableCartItemIds.push(item._id);
        }
    }

    // Step 2: Atomic $pull query using $in operator
    // 🛑 ZERO DATA LOSS: Even if a user added an item simultaneously in another tab,
    // only the specific unavailable IDs are pulled out. The newly added item remains untouched!
    if (unavailableCartItemIds.length > 0) {
        await Cart.updateOne(
            { user: userId },
            { $pull: { items: { _id: { $in: unavailableCartItemIds } } } }
        );
    }

    return res.status(200).json({
        success: true,
        message: `${unavailableCartItemIds.length} unavailable items removed from your cart`,
    });
});

// =========================================================================
// 6. DELETE /api/v1/cart/clear (Order Placed / Empty Cart)
// =========================================================================
export const clearCart = asynchandler(async (req, res) => {
    const userId = req.user._id;

    await Cart.updateOne(
        { user: userId },
        { $set: { items: [] } }
    );

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
