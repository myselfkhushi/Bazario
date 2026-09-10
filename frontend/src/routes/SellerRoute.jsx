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

    return children;
}

export default SellerRoute;