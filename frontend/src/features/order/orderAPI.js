import api from "../../api/axios";

export const getMyOrders=async()=>{
    const response=await api.get("/order/getorder");
    return response.data;
};
export const trackOrderAPI = async (orderIdOrAwb) => {
    const response = await api.get(`/order/track/${orderIdOrAwb}`);
    return response.data;
};