import api from "../../api/axios";

export const getMyOrders = async () => {
    const response = await api.get("/order/getorder");
    return response.data;
};

export const trackOrderAPI = async (orderIdOrAwb) => {
    const response = await api.get(`/order/track/${orderIdOrAwb}`);
    return response.data;
};

export const cancelOrderAPI = async (orderId, reasonData) => {
    const response = await api.post(`/order/cancel/${orderId}`, reasonData);
    return response.data;
};

export const returnOrderAPI = async (orderId, returnData) => {
    const response = await api.post(`/order/return/${orderId}`, returnData);
    return response.data;
};
