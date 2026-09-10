import api from "../../api/axios.js";

export const registerUser = async(userData)=>{
    const response= await api.post("/auth/register",userData);
    return response.data;
};

export const loginUser= async(userData)=>{
    const response=await api.post("/auth/login",userData);
    return response.data;
};

export const logoutUser=async()=>{
  const response=await api.post("/auth/logout");
  return response.data;
};

export const getProfile=async()=>{
    const response=await api.get("/auth/me");
    return response.data;
}

export const updateUserProfile = async (userData) => {
    const response = await api.put("/auth/me", userData);
    return response.data;
};