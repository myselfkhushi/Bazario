import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainLayout from "../component/layout/MainLayout.jsx";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ProductDetails from "../pages/ProductDetail.jsx";
import Cart from "../pages/Buyer/Cart.jsx";
import Checkout from "../pages/Checkout.jsx";
import Orders from "../pages/Buyer/Orders.jsx"
import AdminDashbored from "../pages/Admin/AdminDashbored.jsx";
import AdminRoute from "./AdminRoute.jsx";
import SellerDashboared from "../pages/seller/SellerDashboared.jsx";
import MyProducts from "../pages/seller/MyProducts.jsx";
import SellerOrders from "../pages/seller/SellerOrders.jsx";
import AddProduct from "../pages/seller/AddProduct";
import SellerRoute from "./SellerRoute";
import SellerLayout from "../layouts/SellerLayout.jsx";
import EditProduct from "../pages/seller/EditProduct.jsx";
import Wishlist from "../pages/Buyer/Wishlist.jsx";
import Profile from "../pages/Profile";

function AppRoutes(){
    return (
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />} >
            <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>}/>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
            <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>


            <Route element={<SellerRoute><SellerLayout/></SellerRoute>}>
              <Route path="/seller/dashboard" element={<SellerDashboared/>}/>
              <Route path="/seller/products" element={<MyProducts/>}/>
              <Route path="/seller/orders" element={<SellerOrders/>}/>
              <Route path="/seller/add-product" element={<AddProduct/>}/>
              <Route path="/seller/edit-product/:id" element={<EditProduct />} />
            </Route>
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist/></ProtectedRoute>}/>

            <Route path="/admin" element={<AdminRoute><AdminDashbored/></AdminRoute>}/>
            <Route path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;