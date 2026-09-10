import api from "../../api/axios.js"

export const addtoCart=async(productId,quantity=1)=>{
    const response=await api.post("/cart/add",{
        product:productId,quantity,
    });
    return response.data;
};

export const getMyCart=async()=>{
    const response=await api.get("/cart/mycart");
    return response.data;
};

export const updateCart=async(cartId,quantity)=>{
    const response=await api.put(`/cart/update/${cartId}`,{
        quantity,
    });

    return response.data;
};

export const removeCartItem=async(cartId)=>{
    const response=await api.delete(`/cart/remove/${cartId}`);
    return response.data;
}