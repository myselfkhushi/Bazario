import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
    FaShoppingCart, 
    FaHeart, 
    FaUserCircle, 
    FaSearch,
    FaSignOutAlt,
    FaBox,
    FaClipboardList,
    FaTachometerAlt
} from "react-icons/fa";
import { logoutUser } from "../../features/auth/authAPI";
import { logout } from "../../features/auth/authSlice";
import { useState, useRef, useEffect } from "react";

function Navbar() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { wishlist } = useSelector((state) => state.wishlist);
    const { cart } = useSelector((state) => state.cart);
    const [search, setSearch] = useState("");
    const [openProfile, setOpenProfile] = useState(false);
    const profileRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        dispatch(logout());
        navigate("/login");
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setOpenProfile(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                
                {/* Logo Section */}
                <Link
                    to="/"
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                    ShopHub
                </Link>

                {/* Search Bar - Desktop */}
                <div className="hidden lg:flex flex-1 max-w-2xl mx-10">
                    <div className="relative w-full group">
                        <input
                            type="text"
                            placeholder="Search for amazing products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-100 border-2 border-transparent rounded-full py-2.5 pl-12 pr-6 text-gray-700 placeholder-gray-400 transition-all duration-300 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-inner group-hover:bg-gray-200 focus-within:group-hover:bg-white"
                        />
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                    </div>
                </div>

                {/* Right Side Icons & Profile */}
                <div className="flex items-center gap-4 sm:gap-6">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3 sm:gap-5">
                            
                            {user?.role === "buyer" && (
                                <>
                                    {/* Wishlist Icon */}
                                    <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-red-50 transition-colors group">
                                        <FaHeart className="text-2xl text-gray-500 group-hover:text-red-500 transition-transform duration-300 group-hover:scale-110" />
                                        {wishlist?.length > 0 && (
                                            <span className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                                {wishlist.length}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Cart Icon */}
                                    <Link to="/cart" className="relative p-2 rounded-full hover:bg-blue-50 transition-colors group">
                                        <FaShoppingCart className="text-2xl text-gray-500 group-hover:text-blue-600 transition-transform duration-300 group-hover:scale-110" />
                                        {cart?.length > 0 && (
                                            <span className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                                {cart.length}
                                            </span>
                                        )}
                                    </Link>
                                </>
                            )}

                            {/* Profile Dropdown */}
                            <div className="relative z-50" ref={profileRef}>
                                <button
                                    onClick={() => setOpenProfile(!openProfile)}
                                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 border border-transparent focus:border-gray-200"
                                >
                                    <FaUserCircle className="text-3xl text-gray-600 hover:text-indigo-600 transition-colors" />
                                    <span className="hidden md:block font-medium text-gray-700 text-sm">
                                        {user?.name?.split(' ')[0]}
                                    </span>
                                </button>

                                {/* Dropdown Menu with Animation */}
                                <div className={`absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden transition-all duration-300 origin-top-right ${openProfile ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}>
                                    
                                    {/* User Info Header */}
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-5 py-4 border-b border-gray-100">
                                        <h2 className="font-bold text-gray-800 truncate">{user?.name}</h2>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                                        <span className="inline-block mt-2 px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-full tracking-wider">
                                            {user?.role}
                                        </span>
                                    </div>

                                    {/* Dropdown Links */}
                                    <div className="py-2">
                                        {user?.role === "buyer" && (
                                            <>
                                                <Link to="/orders" className="flex items-center gap-3 px-5 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors">
                                                    <FaBox className="text-sm" /> My Orders
                                                </Link>
                                                <Link to="/wishlist" className="flex items-center gap-3 px-5 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors">
                                                    <FaHeart className="text-sm" /> Wishlist
                                                </Link>
                                            </>
                                        )}

                                        {user?.role === "seller" && (
                                            <>
                                                <Link to="/seller/dashboard" className="flex items-center gap-3 px-5 py-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors">
                                                    <FaTachometerAlt className="text-sm" /> Dashboard
                                                </Link>
                                                <Link to="/seller/products" className="flex items-center gap-3 px-5 py-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors">
                                                    <FaClipboardList className="text-sm" /> My Products
                                                </Link>
                                            </>
                                        )}

                                        {user?.role === "admin" && (
                                            <Link to="/admin" className="flex items-center gap-3 px-5 py-2.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 transition-colors">
                                                <FaTachometerAlt className="text-sm" /> Admin Dashboard
                                            </Link>
                                        )}
                                    </div>

                                    {/* Logout Button */}
                                    <div className="p-2 border-t border-gray-100">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center justify-center gap-2 w-full text-left px-5 py-2.5 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors"
                                        >
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 sm:gap-4">
                            <Link to="/login" className="text-gray-600 font-medium hover:text-blue-600 px-2 py-2 transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;