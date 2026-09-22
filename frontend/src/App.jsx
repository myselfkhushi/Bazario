import AppRoutes from "./routes/AppRoutes.jsx";
import { useEffect, useState } from "react";
import LogoLoader from "./component/common/LogoLoader.jsx";
import { useDispatch } from "react-redux";
import { getProfile } from "./features/auth/authAPI.js";
import { setUser } from "./features/auth/authSlice.js";
import { getMyWishlist } from "./features/wishlist/wishlistAPI";
import { setWishlist } from "./features/wishlist/wishlistSlice";
import { getMyCart } from "./features/cart/cartAPI";
import { setCart } from "./features/cart/cartSlice";

import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useDispatch();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getProfile();
        dispatch(setUser(response.user));

        const wishlistResponse = await getMyWishlist();
        dispatch(setWishlist(wishlistResponse.wishlist));

        const cartResponse = await getMyCart();
        dispatch(setCart(cartResponse.cart));
      } catch (error) {
        // Suppress errors for unauthenticated initial load and remove invalid token
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
        }
      } finally {
        setIsAppLoading(false);
      }
    };
    loadUser();
  }, [dispatch]);

  if (isAppLoading) {
    return <LogoLoader />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            background: "#ffffff",
            color: "#0F0A1E",
            fontWeight: "600",
            fontSize: "14px",
            fontFamily: "var(--font-heading)",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(108, 62, 244, 0.12)",
            border: "1px solid rgba(108, 62, 244, 0.15)",
            padding: "12px 18px",
          },
          success: {
            iconTheme: {
              primary: "#6C3EF4",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <AppRoutes />
    </>
  );
}

export default App;
