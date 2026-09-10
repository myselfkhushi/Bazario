import {createSlice} from "@reduxjs/toolkit";

const initialState={
    cart:[],
    loading:false,
    error:null,
};

const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        setLoading:(state,action)=>{
            state.loading=action.payload;
        },

        setCart:(state,action)=>{
            state.cart=action.payload;
            state.loading=false;
            state.error=null;
        },

        setError:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
    },
});

export const{
    setLoading,setCart,setError,
}=cartSlice.actions;

export default cartSlice.reducer;