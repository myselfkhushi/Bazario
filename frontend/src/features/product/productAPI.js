import api from "../../api/axios";

export const getAllProducts = async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append("search", filters.search);
    if (filters.category && filters.category !== "All") params.append("category", filters.category);
    if (filters.brand && filters.brand !== "All") params.append("brand", filters.brand);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.sort) params.append("sort", filters.sort);

    const queryString = params.toString();
    const endpoint = queryString ? `/products?${queryString}` : "/products";
    
    const response = await api.get(endpoint);
    return response.data;
};
 
export const getSingleProduct =async (id) =>{
    const response = await api.get(`/products/${id}`);
    return response.data;
}

export const getMyProducts=async()=>{
    const response=await api.get("/products/my/product");
    return response.data;
}

export const createProduct=async (formData) =>{
    const response=await api.post("/products/create",
        formData,
        {
            headers:{
                "Content-Type":"multipart/form-data",
            },
        }
    );
    return response.data;
}


export const updateProduct=async(id,formData)=>{
    const {data} =await api.put(`/products/${id}`,formData);
    return data;
}

export const deleteProduct=async(id)=>{
    const {data} =await api.delete(`/products/${id}`);
    return data;
}

export const getProductBrands = async () => {
    const response = await api.get("/products/brands");
    return response.data;
};