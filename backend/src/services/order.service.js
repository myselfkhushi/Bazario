import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apierror.js";

export const createOrderFromCart = async (userId, shippingAddress) => {
    const cartItem = await Cart.find({
        user: userId,
    }).populate("product");

    if (cartItem.length === 0) {
        throw new ApiError("Cart is empty", 400);
    }

    const street = shippingAddress?.street || shippingAddress?.address;
    const pincode = shippingAddress?.pincode || shippingAddress?.postalCode;
    const city = shippingAddress?.city;
    const state = shippingAddress?.state || "Rajasthan";
    const fullName = shippingAddress?.fullName || "Customer";
    const phone = shippingAddress?.phone || "";

    if (!shippingAddress || !street || !city || !pincode) {
        throw new ApiError("Complete shipping address is required", 400);
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const orderItem = [];
        let totalAmount = 0;

        for (const item of cartItem) {
            const product = item.product;

            if (!product) {
                continue;
            }
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: product._id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true, session }
            );
            if (!updatedProduct) {
                throw new ApiError(`${product.title} is out of stock`, 400);
            }
            totalAmount += product.price * item.quantity;

            // Independent fulfillment tracking for each item & seller
            orderItem.push({
                product: product._id,
                seller: product.createdBy,
                title: product.title,
                image: product.images?.[0]?.url || "",
                brand: product.brand || "Bazario Official",
                quantity: item.quantity,
                price: product.price,
                status: "pending",
                courier: "",
                trackingNumber: "",
                isLabelPrinted: false,
                statusHistory: [
                    {
                        status: "pending",
                        timestamp: new Date(),
                        message: "Item ordered. Awaiting seller confirmation.",
                        location: "Seller Warehouse Hub",
                    },
                ],
            });
        }

        const orderArray = await Order.create(
            [
                {
                    user: userId,
                    orderitem: orderItem,
                    totalamount: totalAmount,
                    shippingAddress: {
                        fullName: String(fullName).trim(),
                        phone: String(phone).trim(),
                        street: String(street).trim(),
                        city: String(city).trim(),
                        state: String(state).trim(),
                        pincode: String(pincode).trim(),
                    },
                    orderstatus: "pending",
                    statusHistory: [
                        {
                            status: "pending",
                            timestamp: new Date(),
                            message: "Order placed successfully. Sellers notified for preparation.",
                            location: `${String(city).trim()}, ${String(state).trim()}`,
                        },
                    ],
                },
            ],
            { session }
        );

        const order = orderArray[0];

        await Cart.deleteMany({ user: userId }, { session });

        await session.commitTransaction();
        session.endSession();

        return order;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
