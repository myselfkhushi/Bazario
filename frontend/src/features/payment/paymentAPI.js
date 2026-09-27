import api from "../../api/axios"
export const createPaymentOrder = async (paymentData) => {
    const response = await api.post("/payment/createorder", paymentData);
    return response.data;
};
export const verifyPayment = async (paymentData) => {
    const response = await api.post("/payment/verify", paymentData);
    return response.data;
};

