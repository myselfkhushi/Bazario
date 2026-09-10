import { createSlice } from "@reduxjs/toolkit";

const initialState={
    product:[],
    loading:false,
    error:null,
};

const productSlice=createSlice({
    name:"products",
    initialState,
    reducers:{
        setLoading:(state,action)=>{
            state.loading=action.payload;
        },
        setProducts:(state,action)=>{
            state.product=action.payload;
            state.loading=false;
            state.error=null;
        },
        setError:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        setMyProducts:(state,action)=>{
            state.product=action.payload;
        },
    }
})

export const {setLoading,setProducts,setError,setMyProducts}=productSlice.actions;

export default productSlice.reducer;