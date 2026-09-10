import api from "../../api/axios";

export const addToWishlist=async(productId)=>{
    const {data}=await api.post(`/wishlist/${productId}`);
    return data;
}

export const getMyWishlist=async()=>{
    const {data}=await api.get("/wishlist");
    return data;
}

export const removeFromWishlist=async(id)=>{
    const {data}=await api.delete(`/wishlist/${id}`);
    return data;
}