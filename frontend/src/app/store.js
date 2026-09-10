import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/product/productSlice";
import cartReducer from "../features/cart/cartSlice";
import paymentReducer from "../features/payment/paymentSlice";
import orderReducer from "../features/order/orderSlice"
import sellerReducer from "../features/seller/sellerSlice";
import reviewReducer from "../features/review/reviewSlice"
import wishlistReducer from "../features/wishlist/wishlistSlice";
export const store=configureStore({
    reducer:{
        auth:authReducer,
        product:productReducer,
        cart:cartReducer,
        payment:paymentReducer,
        order:orderReducer,
        seller:sellerReducer,
        review:reviewReducer,
        wishlist: wishlistReducer,
    },
});