import api from "../../api/axios";

export const createReview=async(productId,reviewData)=>{
    const {data}=await api.post(`/reviews/${productId}`,reviewData);
    return data;
}

export const getProductReviews=async(productId)=>{
    const {data}=await api.get(`/reviews/${productId}`);
    return data;
}

export const updateReview=async(reviewId,reviewData)=>{
    const {data}=await api.put(`/reviews/${reviewId}`,reviewData);
    return data;
}

export const deleteReview=async(reviewId)=>{
    const {data}=await api.delete(`/reviews/${reviewId}`);
    return data;
}