import { createSlice } from "@reduxjs/toolkit";
import { addToWishlist } from "./wishlistAPI";

const initialState={
    wishlist:[],
    loading:false,
    error:null,
};

const wishlistSlice=createSlice({
    name:"wishlist",
    initialState,
    reducers:{
        setWishlistLoading:(state)=>{
            state.loading=true;
        },
        setWishlist:(state,action)=>{
            state.wishlist=action.payload;
            state.loading=false;
            state.error=null;
        },
        setWishlistError:(state,action)=>{
           state.error=action.payload;
           state.loading=false;
        },
        toggleWishlist:(state,action)=>{
            const productId=action.payload;
            const exists=state.wishlist.find((item)=>item.product._id == productId);
            if(exists){
                state.wishlist=state.wishlist.filter((item)=>item.product._id !== productId)
            }
        },
        addWishListItem:(state,action)=>{
            state.wishlist.push(action.payload);
        },
        removeWishlistItem:(state,action)=>{
            state.wishlist=state.wishlist.filter((item)=>item._id !== action.payload)
        }


    }
})

export const {setWishlist,setWishlistLoading,setWishlistError,toggleWishlist,addWishListItem,removeWishlistItem}=wishlistSlice.actions;

export default wishlistSlice.reducer;