import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../component/product/ProductCard.jsx";
import HeroSection from "../component/Hero/HeroSection.jsx"; // Hero component import karein
import { getAllProducts } from "../features/product/productAPI";
import { Truck, LockKeyhole, RotateCcw, Star } from "lucide-react";
import { setLoading, setProducts, setError } from "../features/product/productSlice";

const categories = ["Home", "Electronics", "Fashion", "Books", "Beauty", "Sports"];

function Home() {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const { product } = useSelector((state) => state.product);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                dispatch(setLoading(true));
                const response = await getAllProducts();
                dispatch(setProducts(response.product));
            } catch (error) {
                dispatch(setError(error.response?.data?.message || "Something went wrong"));
            }
        };
        fetchProducts();
    }, [dispatch]);

    // Filter Logic
    const filteredProducts = product
        .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
        .filter((item) => (category === "" ? true : item.category === category));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            
            {/* 1. HERO SECTION (Ab top par hai) */}
            <HeroSection />

            {/* 2. CATEGORIES SECTION */}
            <div className="mb-16">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Shop by Category
                    </h2>
                </div>

                {/* Stylish Category Pills */}
                <div className="flex flex-wrap gap-3 sm:gap-4">
                    <button
                        onClick={() => setCategory("")}
                        className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-sm border ${
                            category === ""
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-blue-500/30 shadow-lg transform -translate-y-0.5"
                                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                    >
                        All Products
                    </button>

                    {categories.map((item) => (
                        <button
                            key={item}
                            onClick={() => setCategory(item)}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-sm border ${
                                category === item
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-blue-500/30 shadow-lg transform -translate-y-0.5"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. PRODUCT GRID SECTION */}
            <div className="mb-16">
                <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        {category ? `${category} Products` : "Featured Products"}
                    </h2>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {filteredProducts.length} Items
                    </span>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((Product) => (
                            <ProductCard key={Product._id} product={Product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                        <p className="text-xl text-gray-500 font-medium">No products found.</p>
                    </div>
                )}
            </div>

            {/* 4. FEATURES/BENEFITS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 mb-10">
                
                {/* Feature 1 */}
                <div className="group bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300">
                    <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:rotate-6 transition-all duration-300">
                        <Truck className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Free Shipping</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Free delivery on all orders above ₹499 across India.</p>
                </div>

                {/* Feature 2 */}
                <div className="group bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300">
                    <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:-rotate-6 transition-all duration-300">
                        <LockKeyhole className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Payment</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">100% secure online payment with trusted gateways.</p>
                </div>

                {/* Feature 3 */}
                <div className="group bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300">
                    <div className="w-16 h-16 mx-auto bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:rotate-6 transition-all duration-300">
                        <RotateCcw className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Returns</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Hassle-free return & refund policy within 7 days.</p>
                </div>

                {/* Feature 4 */}
                <div className="group bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300">
                    <div className="w-16 h-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:-rotate-6 transition-all duration-300">
                        <Star className="w-8 h-8 text-amber-500 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Quality</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Carefully selected products with top-notch quality.</p>
                </div>

            </div>
        </div>
    );
}

export default Home;