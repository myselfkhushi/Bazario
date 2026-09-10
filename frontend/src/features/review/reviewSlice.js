import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "../product/productSlice";

const initialState={
    reviews:[],
    loading:false,
    error:null,
}

const reviewSlice=createSlice({
    name:"reviews",
    initialState,
    reducers:{

        setReviews:(state,action)=>{
            state.reviews=action.payload;
            state.loading=false;
        },
        setReviewsLoading:(state)=>{
            state.loading=true;
        },
        setReviewsError:(state,action)=>{
           state.error=action.payload;
           state.loading=false;
        },

    },
})

export const {setReviewsError,setReviewsLoading,setReviews} =reviewSlice.actions;

export default  reviewSlice.reducer;