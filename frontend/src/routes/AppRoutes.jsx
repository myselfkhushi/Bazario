import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../component/layout/MainLayout.jsx";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ProductDetails from "../pages/ProductDetail.jsx";
import Cart from "../pages/Buyer/Cart.jsx";
import Checkout from "../pages/Checkout.jsx";
import Orders from "../pages/Buyer/Orders.jsx";
import AdminDashbored from "../pages/Admin/AdminDashbored.jsx";
import AdminRoute from "./AdminRoute.jsx";
import SellerDashboared from "../pages/seller/SellerDashboared.jsx";
import MyProducts from "../pages/seller/MyProducts.jsx";
import SellerOrders from "../pages/seller/SellerOrders.jsx";
import AddProduct from "../pages/seller/AddProduct";
import SellerRoute from "./SellerRoute";
import SellerLayout from "../layouts/SellerLayout.jsx";
import EditProduct from "../pages/seller/EditProduct.jsx";
import SellerOnboarding from "../pages/seller/SellerOnboarding.jsx";
import Wishlist from "../pages/Buyer/Wishlist.jsx";
import Profile from "../pages/Profile";

// Account sub-pages (Flipkart Account options)
import SavedAddresses from "../pages/Account/SavedAddresses.jsx";
import Coupons from "../pages/Account/Coupons.jsx";
import Supercoin from "../pages/Account/Supercoin.jsx";
import PlusZone from "../pages/Account/PlusZone.jsx";
import WalletCards from "../pages/Account/WalletCards.jsx";
import GiftCards from "../pages/Account/GiftCards.jsx";
import Notifications from "../pages/Account/Notifications.jsx";

// Company sub-pages
import About from "../pages/company/About.jsx";
import Careers from "../pages/company/Careers.jsx";
import Blog from "../pages/company/Blog.jsx";
import PressKit from "../pages/company/PressKit.jsx";
import Contact from "../pages/company/Contact.jsx";

// Support sub-pages
import HelpCenter from "../pages/support/HelpCenter.jsx";
import Returns from "../pages/support/Returns.jsx";
import TrackOrder from "../pages/support/TrackOrder.jsx";
import BulkOrders from "../pages/support/BulkOrders.jsx";

// Legal sub-pages
import LegalPage from "../pages/legal/LegalPage.jsx";
import ScrollToTop from "../component/common/ScrollToTop.jsx";

// 🛑 Smart Home Route: If a seller visits "/", redirect directly to Seller Dashboard!
function HomeRoute() {
  const { user } = useSelector((state) => state.auth);
  if (user?.role === "seller") {
    return <Navigate to="/seller/dashboard" replace />;
  }
  return <Home />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public & Customer Routes — Rendered inside MainLayout (Includes Customer Navbar & Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Company routes */}
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/press" element={<PressKit />} />
          <Route path="/contact" element={<Contact />} />

          {/* Support routes */}
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/bulk-orders" element={<BulkOrders />} />

          {/* Legal routes */}
          <Route path="/privacy" element={<LegalPage initialTab="privacy" />} />
          <Route path="/terms" element={<LegalPage initialTab="terms" />} />
          <Route path="/cookies" element={<LegalPage initialTab="cookies" />} />
          <Route path="/refund" element={<LegalPage initialTab="refund" />} />

          {/* Protected Customer routes */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/account/addresses" element={<ProtectedRoute><SavedAddresses /></ProtectedRoute>} />
          <Route path="/account/coupons" element={<ProtectedRoute><Coupons /></ProtectedRoute>} />
          <Route path="/account/supercoin" element={<ProtectedRoute><Supercoin /></ProtectedRoute>} />
          <Route path="/account/plus" element={<ProtectedRoute><PlusZone /></ProtectedRoute>} />
          <Route path="/account/wallet" element={<ProtectedRoute><WalletCards /></ProtectedRoute>} />
          <Route path="/account/gift-cards" element={<ProtectedRoute><GiftCards /></ProtectedRoute>} />
          <Route path="/account/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* 🚀 Standalone Seller Onboarding Wizard (Dedicated, Distraction-Free - No Buyer Navbar) */}
        <Route path="/seller/onboarding" element={<ProtectedRoute><SellerOnboarding /></ProtectedRoute>} />

        {/* 🛑 SELLER PORTAL — OUTSIDE MainLayout (Dedicated Seller Hub Top Navbar & Pages) */}
        <Route element={<SellerRoute><SellerLayout /></SellerRoute>}>
          <Route path="/seller/dashboard" element={<SellerDashboared />} />
          <Route path="/seller/products" element={<MyProducts />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/add-product" element={<AddProduct />} />
          <Route path="/seller/edit-product/:id" element={<EditProduct />} />
        </Route>

        {/* Admin Portal — Outside MainLayout */}
        <Route path="/admin" element={<AdminRoute><AdminDashbored /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
