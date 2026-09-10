import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
    getMyWishlist,
    removeFromWishlist,
} from "../../features/wishlist/wishlistAPI";

import {
    setWishlist,
    setWishlistError,
    setWishlistLoading,
} from "../../features/wishlist/wishlistSlice";

function Wishlist() {
    const dispatch = useDispatch();

    const { wishlist } = useSelector((state) => state.wishlist);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            dispatch(setWishlistLoading());

            const response = await getMyWishlist();

            dispatch(setWishlist(response.wishlist));
        } catch (error) {
            dispatch(
                setWishlistError(
                    error.response?.data?.message ||
                        "Something went wrong"
                )
            );
        }
    };

    const handleRemove = async (id) => {
        try {
            await removeFromWishlist(id);

            const response = await getMyWishlist();

            dispatch(setWishlist(response.wishlist));
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Something went wrong"
            );
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8">

            <h1 className="text-4xl font-bold mb-3">
                My Wishlist
            </h1>

            <p className="text-gray-500 mb-10">
                {wishlist.length}{" "}
                {wishlist.length === 1
                    ? "Item"
                    : "Items"}{" "}
                Saved
            </p>

            {wishlist.length === 0 ? (

                <div className="bg-white rounded-3xl shadow-md py-20 flex flex-col items-center">

                    <FaHeart className="text-7xl text-red-400" />

                    <h2 className="text-3xl font-bold mt-8">
                        Your Wishlist is Empty
                    </h2>

                    <p className="text-gray-500 mt-3">
                        Save products you love and they'll
                        appear here.
                    </p>

                    <Link to="/">
                        <button className="mt-8 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:opacity-90 transition">
                            Continue Shopping
                        </button>
                    </Link>

                </div>

            ) : (

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                    {wishlist.map((item) => (

                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                        >

                            <div className="overflow-hidden">

                                <img
                                    src={item.product.images[0].url}
                                    alt={item.product.title}
                                    className="w-full h-60 object-cover hover:scale-110 transition duration-500"
                                />

                            </div>

                            <div className="p-5">

                                <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                                    {item.product.category}
                                </span>

                                <h2 className="text-xl font-bold mt-5 line-clamp-1">
                                    {item.product.title}
                                </h2>

                                <p className="text-gray-500 mt-3 line-clamp-2">
                                    {item.product.description}
                                </p>

                                <div className="flex justify-between items-center mt-6">

                                    <h3 className="text-3xl font-bold text-green-600">
                                        ₹{item.product.price}
                                    </h3>

                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                        In Stock
                                    </span>

                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-8">

                                    <Link
                                        to={`/product/${item.product._id}`}
                                    >
                                        <button className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:opacity-90 transition">
                                            View
                                        </button>
                                    </Link>

                                    <button
                                        onClick={() =>
                                            handleRemove(item._id)
                                        }
                                        className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition flex items-center justify-center gap-2"
                                    >
                                        <FaTrash />

                                        Remove
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Wishlist;