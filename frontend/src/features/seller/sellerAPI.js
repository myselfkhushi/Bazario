import api from "../../api/axios";

// Dashboard

export const getSellerDashboard = async () => {
    const response = await api.get("/seller/dashboard");
    return response.data;
};

// Recent Orders (Dashboard)

export const getRecentOrders = async () => {
    const response = await api.get("/seller/recent-orders");
    return response.data;
};

// All Seller Orders

export const getSellerOrders = async () => {
    const response = await api.get("/seller/orders");
    return response.data;
};

// Update Seller Order Status (Confirmed, Processing, Shipped, Cancelled)
export const updateSellerOrderStatus = async (orderId, data) => {
    const response = await api.put(`/seller/orders/${orderId}/status`, data);
    return response.data;
};