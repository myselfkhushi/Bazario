import api from "../../api/axios"
export const createPaymentOrder=async()=>{
    const response=await api.post("/payment/createorder");
    return response.data;
};

export const verifyPayment=async(paymentData)=>{
    const response=await api.post("/payment/verify",paymentData);
    return response.data;
};

