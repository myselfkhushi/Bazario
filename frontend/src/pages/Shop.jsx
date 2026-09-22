import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronDown, X, Filter } from "lucide-react";
import ProductCard from "../component/product/ProductCard.jsx";
import ProductSkeleton from "../component/product/ProductSkeleton.jsx";
import { getAllProducts, getProductBrands } from "../features/product/productAPI";

const CATEGORIES = [
    "All",
    "Electronics",
    "Fashion",
    "Footwear",
    "Watches",
    "Home & Living",
    "Beauty",
    "Health",
    "Sports",
    "Books",
    "Toys"
];

const DEFAULT_BRANDS = [
    "All", 
    "Apple", 
    "Samsung", 
    "Sony", 
    "Nike", 
    "Adidas", 
    "Zara", 
    "Levi's", 
    "H&M", 
    "Bazario Official"
];

const SORTS = [
    { label: "Newest Arrivals", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Brand: A to Z", value: "brand_asc" },
    { label: "Brand: Z to A", value: "brand_desc" }
];

function Shop() {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    // Read initial state from URL or set defaults
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "All");
    const [brand, setBrand] = useState(searchParams.get("brand") || "All");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "newest");

    const [availableBrands, setAvailableBrands] = useState(DEFAULT_BRANDS);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Fetch dynamic catalog brands on mount
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await getProductBrands();
                if (res.brands && res.brands.length > 0) {
                    const combined = ["All", ...new Set([...DEFAULT_BRANDS.slice(1), ...res.brands])];
                    setAvailableBrands(combined);
                }
            } catch (error) {
                console.error("Failed to load catalog brands:", error);
            }
        };
        fetchBrands();
    }, []);

    // Synchronize URL search params to component state when URL changes (e.g. from navbar clicks)
    useEffect(() => {
        const urlSearch = searchParams.get("search") || "";
        let urlCategory = searchParams.get("category") || "All";
        if (urlCategory.toLowerCase() === "home") urlCategory = "Home & Living";
        const urlBrand = searchParams.get("brand") || "All";
        const urlMinPrice = searchParams.get("minPrice") || "";
        const urlMaxPrice = searchParams.get("maxPrice") || "";
        const urlSort = searchParams.get("sort") || "newest";

        setSearch(urlSearch);
        setCategory(urlCategory);
        setBrand(urlBrand);
        setMinPrice(urlMinPrice);
        setMaxPrice(urlMaxPrice);
        setSort(urlSort);
    }, [searchParams]);

    // Handle immediate Category chip filter click
    const handleCategoryClick = (newCat) => {
        setCategory(newCat);
        const params = new URLSearchParams(searchParams);
        if (newCat && newCat !== "All") {
            params.set("category", newCat);
        } else {
            params.delete("category");
        }
        setSearchParams(params);
    };

    // Handle immediate Brand chip filter click
    const handleBrandClick = (newBrand) => {
        setBrand(newBrand);
        const params = new URLSearchParams(searchParams);
        if (newBrand && newBrand !== "All") {
            params.set("brand", newBrand);
        } else {
            params.delete("brand");
        }
        setSearchParams(params);
    };

    // Handle Sort dropdown change
    const handleSortChange = (newSort) => {
        setSort(newSort);
        const params = new URLSearchParams(searchParams);
        if (newSort && newSort !== "newest") {
            params.set("sort", newSort);
        } else {
            params.delete("sort");
        }
        setSearchParams(params);
    };

    // Debounce search text and price filter URL updates
    useEffect(() => {
        const handler = setTimeout(() => {
            const currentSearch = searchParams.get("search") || "";
            const currentMin = searchParams.get("minPrice") || "";
            const currentMax = searchParams.get("maxPrice") || "";

            if (search !== currentSearch || minPrice !== currentMin || maxPrice !== currentMax) {
                const params = new URLSearchParams(searchParams);
                if (search.trim()) params.set("search", search.trim());
                else params.delete("search");

                if (minPrice) params.set("minPrice", minPrice);
                else params.delete("minPrice");

                if (maxPrice) params.set("maxPrice", maxPrice);
                else params.delete("maxPrice");

                setSearchParams(params);
            }
        }, 350);
        return () => clearTimeout(handler);
    }, [search, minPrice, maxPrice]);

    // Fetch products when URL changes
    useEffect(() => {
        const fetchFilteredProducts = async () => {
            try {
                setLoading(true);
                const filters = {
                    search: searchParams.get("search") || "",
                    category: searchParams.get("category") || "All",
                    brand: searchParams.get("brand") || "All",
                    minPrice: searchParams.get("minPrice") || "",
                    maxPrice: searchParams.get("maxPrice") || "",
                    sort: searchParams.get("sort") || "newest"
                };
                
                const response = await getAllProducts(filters);
                setProducts(response.product || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredProducts();
    }, [searchParams]);

    const clearFilters = () => {
        setSearch("");
        setCategory("All");
        setBrand("All");
        setMinPrice("");
        setMaxPrice("");
        setSort("newest");
        setSearchParams(new URLSearchParams());
    };

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (category !== "All") count++;
        if (brand !== "All") count++;
        if (minPrice || maxPrice) count++;
        if (search) count++;
        return count;
    }, [category, brand, minPrice, maxPrice, search]);

    return (
        <div className="bg-slate-50 min-h-screen text-slate-900 font-sans pb-24">
            
            {/* ── Premium Modern Header ── */}
            <div className="bg-white shadow-sm mb-8 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
                                The Collection
                            </h1>
                            <p className="text-slate-500 mt-3 text-base sm:text-lg max-w-xl">
                                Discover our meticulously curated selection of premium products.
                            </p>
                        </div>
                        
                        {/* Floating Modern Search Input */}
                        <div className="w-full md:w-96 relative group">
                            <div className="absolute inset-0 bg-purple-600/5 rounded-2xl blur-xl group-focus-within:bg-purple-600/15 transition-all duration-300"></div>
                            <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100 transition-all duration-300 flex items-center overflow-hidden">
                                <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
                                <input 
                                    type="text" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search everything..."
                                    className="w-full py-3.5 px-3 bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none border-none ring-0"
                                />
                                {search && (
                                    <button 
                                        onClick={() => setSearch("")}
                                        className="p-3 text-slate-400 hover:text-slate-900 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* ── Mobile Filter Toggle ── */}
                    <div className="lg:hidden flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                        <button 
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                            Filters {activeFilterCount > 0 && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">{activeFilterCount}</span>}
                        </button>
                        <div className="text-sm font-medium text-slate-500">
                            {products.length} Products
                        </div>
                    </div>

                    {/* ── Premium Sidebar Filters ── */}
                    <aside className={`lg:w-72 shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}>
                        <div className="sticky top-28 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-8">
                            
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-purple-600" />
                                    Refine Search
                                </h2>
                                {activeFilterCount > 0 && (
                                    <button 
                                        onClick={clearFilters}
                                        className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors bg-purple-50 px-3 py-1.5 rounded-lg"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Modern Chip Filters for Category */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                                    Categories
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button 
                                            key={cat}
                                            onClick={() => handleCategoryClick(cat)}
                                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                                                category === cat 
                                                ? 'bg-purple-600 text-white shadow-md shadow-purple-200' 
                                                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Modern Chip Filters for Brand */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                                    Brands
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableBrands.map(b => (
                                        <button 
                                            key={b}
                                            onClick={() => handleBrandClick(b)}
                                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                                                brand === b 
                                                ? 'bg-slate-900 text-white shadow-md shadow-slate-300' 
                                                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900'
                                            }`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Elevated Price Range */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                                    Price Range
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                                        <input 
                                            type="number" 
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="w-full py-2.5 pl-7 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                        />
                                    </div>
                                    <span className="text-slate-300">-</span>
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                                        <input 
                                            type="number" 
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-full py-2.5 pl-7 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </aside>

                    {/* ── Main Content Area ── */}
                    <div className="flex-1">
                        
                        {/* Sort & Info Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200">
                            <p className="text-sm font-medium text-slate-500">
                                Showing <span className="font-bold text-slate-900">{products.length}</span> exceptional products
                            </p>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort by:</span>
                                <div className="relative">
                                    <select 
                                        value={sort}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="appearance-none bg-slate-50 border border-slate-200 py-2 pl-4 pr-10 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 cursor-pointer transition-all"
                                    >
                                        {SORTS.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Active Filter Chips Bar */}
                        {activeFilterCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Active:</span>
                                {category !== "All" && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                        Category: {category}
                                        <button 
                                            onClick={() => handleCategoryClick("All")}
                                            className="hover:text-purple-900 cursor-pointer"
                                            title="Clear category"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                                {brand !== "All" && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-900 text-white shadow-xs">
                                        Brand: {brand}
                                        <button 
                                            onClick={() => handleBrandClick("All")}
                                            className="hover:text-red-300 cursor-pointer"
                                            title="Clear brand"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                                {search && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                        Search: "{search}"
                                        <button 
                                            onClick={() => setSearch("")}
                                            className="hover:text-slate-950 cursor-pointer"
                                            title="Clear search"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                                {(minPrice || maxPrice) && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                        ₹{minPrice || 0} - ₹{maxPrice || "Any"}
                                        <button 
                                            onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                                            className="hover:text-slate-950 cursor-pointer"
                                            title="Clear price filter"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                                <button
                                    onClick={clearFilters}
                                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 underline underline-offset-2 ml-2 cursor-pointer"
                                >
                                    Reset All
                                </button>
                            </div>
                        )}

                        {/* Product Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                                {products.map((prod) => (
                                    <ProductCard key={prod._id} product={prod} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 bg-white rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No items found</h3>
                                <p className="text-slate-500 text-sm max-w-sm mb-8">
                                    We couldn't find anything matching your specific filters. Try expanding your search.
                                </p>
                                <button 
                                    onClick={clearFilters}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-purple-200 transition-all"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shop;
