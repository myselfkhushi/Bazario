import {createSlice} from "@reduxjs/toolkit";

const initialState={
    loading:false,
    error:null,
};

const paymentSlice=createSlice({
    name:"payment",
    initialState,
    reducers:{
        setLoading:(State,action)=>{
            State.loading=action.payload;
        },

        setError:(state,action)=>{
            state.error=action.payload;
            state.loading=FontFaceSetLoadEvent;
        }
    }
});
export const {setLoading,setError}= paymentSlice.actions;

export default paymentSlice.reducers;