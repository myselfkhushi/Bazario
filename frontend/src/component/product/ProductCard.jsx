import { Link } from "react-router-dom";
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../features/wishlist/wishlistAPI";
import { addWishListItem, removeWishlistItem } from "../../features/wishlist/wishlistSlice";

function ProductCard({ product }) {
    const dispatch = useDispatch();
    const { wishlist } = useSelector((state) => state.wishlist);
    
    // Check if item is already in wishlist
    const liked = wishlist?.some((item) => item.product._id === product._id);

    const handleWishlist = async (e) => {
        e.preventDefault(); // To prevent Link click if button is over it
        try {
            if (!liked) {
                const response = await addToWishlist(product._id);
                dispatch(addWishListItem(response.wishlist));
            } else {
                const item = wishlist.find((w) => w.product._id === product._id);
                await removeFromWishlist(item._id);
                dispatch(removeWishlistItem(item._id));
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="group bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-gray-100 flex flex-col relative overflow-hidden h-full">
            
            {/* Image Container with Hover Zoom */}
            <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-gray-50">
                <Link to={`/product/${product._id}`} className="block w-full h-full">
                    <img
                        src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Subtle Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                {/* Floating Discount Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md tracking-wider uppercase z-10">
                    20% OFF
                </div>

                {/* Floating Wishlist Button */}
                <button 
                    onClick={handleWishlist}
                    className="absolute top-3 right-3 z-10 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all duration-300 transform hover:scale-110 focus:outline-none"
                    aria-label="Add to wishlist"
                >
                    <FaHeart
                        className={`text-lg transition-colors duration-300 ${
                            liked ? "text-red-500" : "text-gray-300 hover:text-red-400"
                        }`}
                    />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                
                {/* Category & Rating Row */}
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full tracking-wider uppercase">
                        {product.category}
                    </span>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                        <FaStar className="text-yellow-400 text-xs" />
                        <span className="text-xs font-bold text-yellow-700">
                            {product.rating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="text-gray-400 text-[10px] font-medium ml-0.5">
                            ({product.numReviews})
                        </span>
                    </div>
                </div>

                {/* Title & Description */}
                <Link to={`/product/${product._id}`} className="block group-hover:text-blue-600 transition-colors">
                    <h2 className="text-lg font-extrabold text-gray-900 line-clamp-1 leading-tight">
                        {product.title}
                    </h2>
                </Link>
                <p className="text-gray-500 text-sm mt-1.5 line-clamp-2 leading-relaxed flex-grow">
                    {product.description}
                </p>

                {/* Bottom Details (Price, Stock & Button) */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-xs text-gray-400 font-medium mb-0.5">Price</p>
                            <h3 className="text-2xl font-black text-gray-900 leading-none">
                                ₹{product.price}
                            </h3>
                        </div>
                        <div className="text-right">
                            {product.stock > 0 ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    In Stock
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    Out of Stock
                                </span>
                            )}
                        </div>
                    </div>

                    {/* View Details / Add to Cart CTA */}
                    <Link to={`/product/${product._id}`} className="block">
                        <button 
                            disabled={product.stock <= 0}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${
                                product.stock > 0 
                                ? "bg-gray-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30" 
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <FaShoppingCart className="text-sm" />
                            {product.stock > 0 ? "View Details" : "Sold Out"}
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default ProductCard;