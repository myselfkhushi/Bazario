import AppRoutes from "./routes/AppRoutes.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProfile } from "./features/auth/authAPI.js";
import { setUser } from "./features/auth/authSlice.js";
import { getMyWishlist } from "./features/wishlist/wishlistAPI";
import { setWishlist } from "./features/wishlist/wishlistSlice";
import { getMyCart } from "./features/cart/cartAPI";
import { setCart } from "./features/cart/cartSlice";

function App() {

  const dispatch=useDispatch();
  useEffect(()=>{
    const loadUser = async()=>{
      try{
        const response= await getProfile();
        dispatch(setUser(response.user));

        const wishlistResponse = await getMyWishlist();
        dispatch(setWishlist(wishlistResponse.wishlist));

        const cartResponse = await getMyCart();
        dispatch(setCart(cartResponse.cart));

      }catch(error){

      }
    }
    loadUser();
  },[dispatch]);

  return (
    
  <AppRoutes/>
);
}

export default App;
