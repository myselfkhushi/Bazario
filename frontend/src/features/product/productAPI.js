import api from "../../api/axios";

export const getAllProducts=async ()=>{
    const response=await api.get("/products");
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
    const {data} =await api.put(`/product/${id}`,formData);
    return data;
}

export const deleteProduct=async(id)=>{
    const {data} =await api.delete(`/products/${id}`);
    return data;
}