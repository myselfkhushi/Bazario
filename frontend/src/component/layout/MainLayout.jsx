import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer";

function MainLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F7FF]">
            <Navbar />
            <div key={location.pathname} className="flex-1 animate-[fadeIn_0.4s_ease-out,fadeUp_0.4s_ease-out]">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default MainLayout;