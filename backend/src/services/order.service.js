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
        throw new ApiError("cart is empty", 400);
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
        throw new ApiError("Complete shipping address is required", 400);
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const orderItem = [];
        let totalAmount = 0;

        for (const item of cartItem) {
            const product = item.product;

            const updatedProduct = await Product.findOneAndUpdate(
                { _id: product._id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true, session }
            );

            if (!updatedProduct) {
                throw new ApiError(`${product.title} is out of stock`, 400);
            }

            totalAmount += product.price * item.quantity;

            orderItem.push({
                product: product._id,
                seller: product.createdBy,
                quantity: item.quantity,
                price: item.product.price,
            });
        }

        const orderArray = await Order.create([{
            user: userId,
            orderitem: orderItem,
            totalamount: totalAmount,
            shippingAddress: {
                fullName: shippingAddress.fullName.trim(),
                phone: shippingAddress.phone.trim(),
                street: shippingAddress.street.trim(),
                city: shippingAddress.city.trim(),
                state: shippingAddress.state.trim(),
                pincode: shippingAddress.pincode.trim(),
            },
        }], { session });

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