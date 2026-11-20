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
            if (Array.isArray(action.payload)) {
                state.cart = action.payload;
            } else if (action.payload && Array.isArray(action.payload.availableItems)) {
                state.cart = action.payload.availableItems;
            } else if (action.payload && Array.isArray(action.payload.items)) {
                state.cart = action.payload.items;
            } else {
                state.cart = [];
            }
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