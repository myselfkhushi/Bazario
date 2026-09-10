import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { getSingleProduct } from "../features/product/productAPI";
import { useDispatch, useSelector } from "react-redux"
import { addtoCart } from "../features/cart/cartAPI";
import { setLoading, setError } from "../features/product/productSlice";
import { createReview, getProductReviews, updateReview, deleteReview } from "../features/review/reviewAPI";
import { setReviewsLoading, setReviewsError, setReviews } from "../features/review/reviewSlice";
import { getMyCart } from "../features/cart/cartAPI";
import { setCart } from "../features/cart/cartSlice";
import { 
    FaUserCircle, 
    FaStar, 
    FaEdit, 
    FaTrash, 
    FaShoppingCart, 
    FaBolt,
    FaRegStar
} from "react-icons/fa";

function ProductDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { reviews } = useSelector((state) => state.review);
    const { id } = useParams();

    const { register, handleSubmit, reset } = useForm();
    const [editingReview, setEditingReview] = useState(null);
    const [product, setProduct] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
        fetchReviews();
        // eslint-disable-next-line
    }, [id]);

    const fetchProducts = async () => {
        try {
            setPageLoading(true);
            const response = await getSingleProduct(id);
            setProduct(response.product);
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setPageLoading(false);
        }
    }

    const fetchReviews = async () => {
        try {
            dispatch(setReviewsLoading());
            const response = await getProductReviews(id);
            dispatch(setReviews(response.reviews));
        } catch (error) {
            dispatch(setReviewsError(error.response?.data?.message || "Something went wrong"));
        }
    }

    const onSubmitReview = async (data) => {
        try {
            if (editingReview) {
                await updateReview(editingReview, data);
                alert("Review Updated Successfully");
                setEditingReview(null);
            } else {
                await createReview(id, data);
                alert("Review Added Successfully");
            }
            reset({ rating: "", comment: "" });
            fetchReviews();
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    }

    const handleAddToCart = async () => {
        try {
            dispatch(setLoading(true));
            await addtoCart(product._id);
            const response = await getMyCart();
            dispatch(setCart(response.cart));
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    // Modern Loading State
    if (pageLoading || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <h2 className="mt-4 text-xl font-semibold text-gray-600 animate-pulse">Loading amazing product...</h2>
            </div>
        );
    }

    return (
        <div className="bg-gray-50/50 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* --- PRODUCT DETAILS CARD --- */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 overflow-hidden border border-gray-100 p-6 lg:p-10 mb-12">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        
                        {/* Left: Product Image */}
                        <div className="relative bg-gray-50 rounded-[2rem] p-8 flex items-center justify-center group overflow-hidden h-[400px] lg:h-[500px]">
                            <img
                                src={product.images?.[0]?.url || "https://via.placeholder.com/600"}
                                alt={product.title}
                                className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Subtle overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-[2rem]" />
                        </div>

                        {/* Right: Product Info */}
                        <div className="flex flex-col h-full justify-center">
                            
                            <div>
                                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold tracking-wider uppercase mb-4 border border-blue-100">
                                    {product.category}
                                </span>
                                
                                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                                    {product.title}
                                </h1>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
                                        <FaStar className="text-yellow-500 text-lg" />
                                        <span className="font-bold text-yellow-700 text-lg">{product.rating?.toFixed(1) || "0.0"}</span>
                                    </div>
                                    <span className="text-gray-500 font-medium hover:text-blue-600 cursor-pointer underline decoration-dashed underline-offset-4 transition-colors">
                                        Read {product.numReviews} Reviews
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-b border-gray-100 py-6 my-2">
                                <h2 className="text-5xl font-black text-gray-900 mb-2 flex items-baseline gap-2">
                                    ₹{product.price}
                                    <span className="text-lg text-gray-400 font-medium line-through">₹{Math.round(product.price * 1.2)}</span>
                                </h2>
                                <p className="text-sm text-green-600 font-semibold mb-4">Inclusive of all taxes</p>
                                
                                <p className="text-gray-600 leading-relaxed text-lg text-justify">
                                    {product.description}
                                </p>
                            </div>

                            <div className="mt-8">
                                <div className="mb-6">
                                    {product.stock > 0 ? (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                                            <span className="relative flex h-3 w-3">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                            </span>
                                            <span className="text-emerald-700 font-bold">In Stock ({product.stock} units left)</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100">
                                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                            <span className="text-red-700 font-bold">Out of Stock</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock <= 0}
                                        className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                                            product.stock > 0 
                                            ? "bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-transparent" 
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        <FaShoppingCart />
                                        Add To Cart
                                    </button>

                                    <button
                                        onClick={async () => {
                                            await handleAddToCart();
                                            navigate("/checkout");
                                        }}
                                        disabled={product.stock <= 0}
                                        className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
                                            product.stock > 0 
                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/30 hover:-translate-y-1" 
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                        }`}
                                    >
                                        <FaBolt />
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- REVIEWS SECTION --- */}
                <div className="max-w-4xl mx-auto">
                    
                    {/* Review Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-10 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold text-gray-900">
                                {editingReview ? "Update Your Review" : "Write a Review"}
                            </h2>
                            {editingReview && (
                                <button 
                                    onClick={() => {
                                        setEditingReview(null);
                                        reset({ rating: "", comment: "" });
                                    }}
                                    className="text-sm font-semibold text-red-500 hover:text-red-700 underline"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                                <select 
                                    {...register("rating", { required: true })} 
                                    className="w-full sm:w-1/2 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none transition-all"
                                >
                                    <option value="">Select Rating</option>
                                    <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                                    <option value="4">⭐⭐⭐⭐ - Good</option>
                                    <option value="3">⭐⭐⭐ - Average</option>
                                    <option value="2">⭐⭐ - Poor</option>
                                    <option value="1">⭐ - Terrible</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Your Comment</label>
                                <textarea 
                                    {...register("comment", { required: true })}
                                    placeholder="Share your experience with this product..." 
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4 h-32 outline-none resize-none transition-all"
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="bg-gray-900 hover:bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl transition-colors duration-300 shadow-md"
                            >
                                {editingReview ? "Update Review" : "Submit Review"}
                            </button>
                        </form>
                    </div>

                    {/* Customer Reviews List */}
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Customer Reviews</h2>

                        {reviews.length === 0 ? (
                            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
                                <FaRegStar className="mx-auto text-5xl text-gray-300 mb-4" />
                                <p className="text-xl text-gray-500 font-medium">No reviews yet.</p>
                                <p className="text-gray-400 mt-2">Be the first to review this product!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div key={review._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            
                                            {/* User Info & Stars */}
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                                                    <FaUserCircle className="text-4xl opacity-50" />
                                                </div>
                                                <div>
                                                    <h3 className="font-extrabold text-lg text-gray-900 capitalize">
                                                        {review.user.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {Array.from({ length: 5 }).map((_, index) => (
                                                            <FaStar
                                                                key={index}
                                                                className={index < review.rating ? "text-yellow-400" : "text-gray-200"}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 sm:self-start">
                                                <button
                                                    onClick={() => {
                                                        setEditingReview(review._id);
                                                        reset({
                                                            rating: review.rating,
                                                            comment: review.comment,
                                                        });
                                                        // Scroll to form (optional enhancement)
                                                        window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Review"
                                                >
                                                    <FaEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if(window.confirm("Are you sure you want to delete this review?")) {
                                                            try {
                                                                await deleteReview(review._id);
                                                                if(editingReview === review._id) {
                                                                    setEditingReview(null);
                                                                    reset({ rating: "", comment: "" });
                                                                }
                                                                fetchReviews();
                                                            } catch (error) {
                                                                alert(error.response?.data?.message || "Something went wrong");
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Review"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Review Comment */}
                                        <p className="text-gray-600 mt-5 leading-relaxed sm:ml-16">
                                            "{review.comment}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;