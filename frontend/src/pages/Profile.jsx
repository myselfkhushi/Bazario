import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    FaUserCircle,
    FaEnvelope,
    FaUserTag,
    FaShoppingBag,
    FaHeart,
    FaBoxOpen,
    FaStore,
} from "react-icons/fa";

function Profile() {

    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-gray-500 text-lg">
                    Loading profile...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-5">

            <div className="max-w-5xl mx-auto">

                {/* HEADER */}

                <div className="mb-10">

                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                        Account
                    </p>

                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">
                        My Profile
                    </h1>

                    <p className="text-gray-500 mt-3">
                        Manage your account information and activities.
                    </p>

                </div>


                {/* PROFILE CARD */}

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                    {/* TOP SECTION */}

                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-10">

                        <div className="flex flex-col md:flex-row md:items-center gap-6">

                            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/40">

                                <FaUserCircle
                                    className="text-white"
                                    size={72}
                                />

                            </div>

                            <div className="text-white">

                                <h2 className="text-3xl font-black">
                                    {user.name}
                                </h2>

                                <p className="text-blue-100 mt-2">
                                    {user.email}
                                </p>

                                <span className="inline-flex items-center gap-2 mt-4 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">

                                    <FaUserTag />

                                    {user.role}

                                </span>

                            </div>

                        </div>

                    </div>


                    {/* ACCOUNT INFORMATION */}

                    <div className="p-8">

                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Account Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* NAME */}

                            <div className="border border-gray-200 rounded-2xl p-5 flex items-center gap-4">

                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

                                    <FaUserCircle size={22} />

                                </div>

                                <div>

                                    <p className="text-sm text-gray-400">
                                        Full Name
                                    </p>

                                    <p className="font-bold text-slate-800 mt-1">
                                        {user.name}
                                    </p>

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="border border-gray-200 rounded-2xl p-5 flex items-center gap-4">

                                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">

                                    <FaEnvelope size={20} />

                                </div>

                                <div className="min-w-0">

                                    <p className="text-sm text-gray-400">
                                        Email Address
                                    </p>

                                    <p className="font-bold text-slate-800 mt-1 truncate">
                                        {user.email}
                                    </p>

                                </div>

                            </div>


                            {/* ROLE */}

                            <div className="border border-gray-200 rounded-2xl p-5 flex items-center gap-4">

                                <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">

                                    <FaUserTag size={20} />

                                </div>

                                <div>

                                    <p className="text-sm text-gray-400">
                                        Account Type
                                    </p>

                                    <p className="font-bold text-slate-800 mt-1 capitalize">
                                        {user.role}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* QUICK ACTIONS */}

                        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-6">
                            Quick Actions
                        </h2>


                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            {/* BUYER */}

                            {user.role === "buyer" && (
                                <>
                                    <Link
                                        to="/orders"
                                        className="group border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition"
                                    >

                                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">

                                            <FaShoppingBag size={21} />

                                        </div>

                                        <h3 className="font-bold text-lg mt-4">
                                            My Orders
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            View your order history
                                        </p>

                                    </Link>


                                    <Link
                                        to="/wishlist"
                                        className="group border border-gray-200 rounded-2xl p-6 hover:border-red-300 hover:shadow-lg transition"
                                    >

                                        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:scale-110 transition">

                                            <FaHeart size={20} />

                                        </div>

                                        <h3 className="font-bold text-lg mt-4">
                                            Wishlist
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            View your saved products
                                        </p>

                                    </Link>
                                </>
                            )}


                            {/* SELLER */}

                            {user.role === "seller" && (
                                <>
                                    <Link
                                        to="/seller/dashboard"
                                        className="group border border-gray-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-lg transition"
                                    >

                                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">

                                            <FaStore size={20} />

                                        </div>

                                        <h3 className="font-bold text-lg mt-4">
                                            Seller Dashboard
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Manage your store
                                        </p>

                                    </Link>


                                    <Link
                                        to="/seller/products"
                                        className="group border border-gray-200 rounded-2xl p-6 hover:border-green-300 hover:shadow-lg transition"
                                    >

                                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition">

                                            <FaBoxOpen size={20} />

                                        </div>

                                        <h3 className="font-bold text-lg mt-4">
                                            My Products
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Manage your products
                                        </p>

                                    </Link>
                                </>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;