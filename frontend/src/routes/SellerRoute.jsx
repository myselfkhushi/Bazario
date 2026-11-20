import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function SellerRoute({children}){
    const {user,isAuthenticated} = useSelector((state)=>state.auth);

    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }

    if(user?.role !== "seller"){
        return <Navigate to="/" replace/>
    }

    // 🛑 Gated: Seller must complete business & contact verification before accessing Seller Hub
    if(user?.role === "seller" && !user?.sellerDetails?.isSellerVerified){
        return <Navigate to="/seller/onboarding" replace/>
    }

    return children;
}

export default SellerRoute;