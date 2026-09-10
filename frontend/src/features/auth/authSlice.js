import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:null,
    isAuthenticated:false,
    loading:false,
    error:null,
}

const authSlice=createSlice({
    name: "auth",
    initialState,
    reducers:{
        setLoading:(state,action)=>{
            state.loading=action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.isAuthenticated = true;
            state.error = null;
        },

        logout:(state)=>{
            state.user=null;
            state.isAuthenticated=false;
            state.error=null;
        },

        setError:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
    },
})

export const {setLoading,setUser,logout,setError,}=authSlice.actions; 

export default authSlice.reducer;
