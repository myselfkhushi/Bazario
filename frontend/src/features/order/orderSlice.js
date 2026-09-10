import {createSlice} from "@reduxjs/toolkit";

const initialState={
    orders:[],
    loading:false,
    error:null,
};

const orderSlice=createSlice({
    name:"order",
    initialState,
    reducers:{
        setLoading:(state,action)=>{
            state.loading=action.payload;
        },
        setOrders:(state,action)=>{
            state.orders=action.payload;
            state.loading=false;
            state.error=null;
        },

        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});


export const {
   setLoading,setOrders,setError,
}=orderSlice.actions;

export default orderSlice.reducer;