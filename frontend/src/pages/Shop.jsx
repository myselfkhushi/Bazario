import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { 
  Search, 
  ChevronDown, 
  X, 
  Sparkles, 
  Smartphone, 
  Laptop, 
  Shirt, 
  Footprints, 
  Watch, 
  Armchair, 
  Tv, 
  Baby, 
  Dumbbell, 
  BookOpen, 
  SlidersHorizontal,
  Check,
  CheckCircle2
} from "lucide-react";
import ProductCard from "../component/product/ProductCard.jsx";
import ProductSkeleton from "../component/product/ProductSkeleton.jsx";
import { getAllProducts, getProductBrands } from "../features/product/productAPI";

// ── Categories List with Icons & Normalized Identifiers ──
const CATEGORIES = [
  { label: "All Products", value: "All", icon: Sparkles },
  { label: "Mobiles", value: "Mobiles", icon: Smartphone },
  { label: "Electronics", value: "Electronics", icon: Laptop },
  { label: "Fashion", value: "Fashion", icon: Shirt },
  { label: "Footwear", value: "Footwear", icon: Shirt },
  { label: "Watches", value: "Watches", icon: Watch },
  { label: "Beauty", value: "Beauty", icon: Sparkles },
  { label: "Home & Living", value: "Home & Living", icon: Armchair },
  { label: "Appliances", value: "Appliances", icon: Tv },
  { label: "Toys", value: "Toys", icon: Baby },
  { label: "Sports", value: "Sports", icon: Dumbbell },
  { label: "Books", value: "Books", icon: BookOpen },
];

// ── Flipkart Image 4 Visual Brands Showcase Per Category ──
const CATEGORY_BRAND_MAP = {
  Mobiles: [
    { name: "Apple", logoText: " Apple", tag: "iPhone 16", bg: "from-slate-900 to-black", glow: "border-slate-700" },
    { name: "Samsung", logoText: "SAMSUNG", tag: "Galaxy S25", bg: "from-blue-950 to-slate-950", glow: "border-blue-800" },
    { name: "vivo", logoText: "vivo", tag: "V40 Pro", bg: "from-blue-900 to-indigo-950", glow: "border-blue-700" },
    { name: "motorola", logoText: "motorola", tag: "Edge 50", bg: "from-indigo-950 to-slate-950", glow: "border-indigo-800" },
    { name: "realme", logoText: "realme", tag: "GT 7 Pro", bg: "from-amber-950 to-stone-950", glow: "border-amber-700" },
    { name: "POCO", logoText: "POCO", tag: "X7 Pro 5G", bg: "from-yellow-950 to-stone-950", glow: "border-yellow-700" },
    { name: "Nothing", logoText: "NOTHING", tag: "Phone (2a)", bg: "from-zinc-900 to-black", glow: "border-zinc-700" },
    { name: "Google", logoText: "Google", tag: "Pixel 9 Pro", bg: "from-slate-900 to-zinc-950", glow: "border-emerald-800" },
    { name: "OnePlus", logoText: "1+ ONEPLUS", tag: "13 / Nord 4", bg: "from-red-950 to-stone-950", glow: "border-red-800" },
    { name: "OPPO", logoText: "OPPO", tag: "Reno 13", bg: "from-emerald-950 to-slate-950", glow: "border-emerald-800" },
    { name: "Redmi", logoText: "Redmi", tag: "Note 14 Pro", bg: "from-rose-950 to-slate-950", glow: "border-rose-800" },
    { name: "Infinix", logoText: "infinix", tag: "Zero 40", bg: "from-teal-950 to-slate-950", glow: "border-teal-800" },
    { name: "Tecno", logoText: "Tecno", tag: "Camon 30", bg: "from-sky-950 to-slate-950", glow: "border-sky-800" },
    { name: "LAVA", logoText: "LAVA", tag: "Agni 3 5G", bg: "from-orange-950 to-neutral-950", glow: "border-orange-800" },
  ],
  Electronics: [
    { name: "Sony", logoText: "SONY", tag: "Audio & Cine", bg: "from-zinc-900 to-black", glow: "border-zinc-700" },
    { name: "Apple", logoText: " Mac", tag: "MacBook & iPad", bg: "from-slate-900 to-black", glow: "border-slate-700" },
    { name: "Samsung", logoText: "SAMSUNG", tag: "Displays & Tabs", bg: "from-blue-950 to-slate-950", glow: "border-blue-800" },
    { name: "boAt", logoText: "boAt", tag: "Airdopes & Bass", bg: "from-rose-950 to-black", glow: "border-rose-800" },
    { name: "JBL", logoText: "JBL", tag: "Signature Sound", bg: "from-orange-950 to-stone-950", glow: "border-orange-800" },
    { name: "Dell", logoText: "DELL", tag: "XPS & Inspiron", bg: "from-blue-950 to-slate-950", glow: "border-blue-800" },
    { name: "HP", logoText: "HP", tag: "Pavilion & Omen", bg: "from-cyan-950 to-slate-950", glow: "border-cyan-800" },
    { name: "Lenovo", logoText: "Lenovo", tag: "Legion & Yoga", bg: "from-red-950 to-slate-950", glow: "border-red-800" },
    { name: "ASUS", logoText: "ASUS", tag: "ROG & Zenbook", bg: "from-indigo-950 to-slate-950", glow: "border-indigo-800" },
    { name: "Noise", logoText: "NOISE", tag: "Smart Gear", bg: "from-purple-950 to-slate-950", glow: "border-purple-800" },
    { name: "Bose", logoText: "BOSE", tag: "QuietComfort", bg: "from-neutral-900 to-black", glow: "border-neutral-700" },
  ],
  Fashion: [
    { name: "Zara", logoText: "ZARA", tag: "Spring Chic", bg: "from-neutral-900 to-black", glow: "border-neutral-700" },
    { name: "H&M", logoText: "H&M", tag: "Urban Basics", bg: "from-red-950 to-stone-950", glow: "border-red-800" },
    { name: "Levi's", logoText: "LEVI'S", tag: "501 Original", bg: "from-red-900 to-slate-950", glow: "border-red-700" },
    { name: "Nike", logoText: "NIKE", tag: "Club Fleece", bg: "from-slate-900 to-black", glow: "border-slate-700" },
    { name: "Adidas", logoText: "ADIDAS", tag: "Trefoil Edition", bg: "from-zinc-900 to-black", glow: "border-zinc-700" },
    { name: "Puma", logoText: "PUMA", tag: "Motorsport & Street", bg: "from-rose-950 to-black", glow: "border-rose-800" },
    { name: "Allen Solly", logoText: "Allen Solly", tag: "Smart Casuals", bg: "from-blue-950 to-slate-950", glow: "border-blue-800" },
    { name: "FabIndia", logoText: "FabIndia", tag: "Artisan Linen", bg: "from-amber-950 to-stone-950", glow: "border-amber-800" },
    { name: "Tommy Hilfiger", logoText: "TOMMY", tag: "Classic Prep", bg: "from-blue-950 to-slate-950", glow: "border-blue-800" },
  ],
  Footwear: [
    { name: "Nike", logoText: "NIKE", tag: "Air Max & Jordan", bg: "from-slate-900 to-black", glow: "border-slate-700" },
    { name: "Adidas", logoText: "ADIDAS", tag: "Ultraboost & Samba", bg: "from-zinc-900 to-black", glow: "border-zinc-700" },
    { name: "Puma", logoText: "PUMA", tag: "Nitro Running", bg: "from-rose-950 to-black", glow: "border-rose-800" },
    { name: "Skechers", logoText: "SKECHERS", tag: "Slip-ins Cushion", bg: "from-blue-950 to-slate-950", glow: "border-blue-800" },
    { name: "Woodland", logoText: "WOODLAND", tag: "Tough Leather", bg: "from-stone-900 to-black", glow: "border-stone-700" },
    { name: "Bata", logoText: "BATA", tag: "Everyday Walk", bg: "from-red-950 to-stone-950", glow: "border-red-800" },
    { name: "Crocs", logoText: "crocs", tag: "Classic Clog", bg: "from-teal-950 to-slate-950", glow: "border-teal-800" },
    { name: "Sparx", logoText: "SPARX", tag: "Active Sport", bg: "from-amber-950 to-stone-950", glow: "border-amber-800" },
  ],
  Watches: [
    { name: "Titan", logoText: "TITAN", tag: "Edge & Grand", bg: "from-amber-950 to-black", glow: "border-amber-800" },
    { name: "Fastrack", logoText: "FASTRACK", tag: "Smart & Gen-Z", bg: "from-orange-950 to-stone-950", glow: "border-orange-800" },
    { name: "Fossil", logoText: "FOSSIL", tag: "Heritage Leather", bg: "from-stone-900 to-black", glow: "border-stone-700" },
    { name: "Casio", logoText: "CASIO", tag: "G-Shock & Vintage", bg: "from-blue-950 to-slate-950", glow: "border-blue-800" },
    { name: "Timex", logoText: "TIMEX", tag: "Expedition Pro", bg: "from-zinc-900 to-black", glow: "border-zinc-700" },
    { name: "boAt", logoText: "boAt", tag: "Wave AMOLED", bg: "from-rose-950 to-black", glow: "border-rose-800" },
    { name: "Noise", logoText: "NOISE", tag: "ColorFit Pro", bg: "from-purple-950 to-slate-950", glow: "border-purple-800" },
  ],
  Beauty: [
    { name: "L'Oréal", logoText: "L'ORÉAL", tag: "Paris Glycolic", bg: "from-stone-900 to-black", glow: "border-stone-700" },
    { name: "Maybelline", logoText: "MAYBELLINE", tag: "Fit Me & Superstay", bg: "from-rose-950 to-stone-950", glow: "border-rose-800" },
    { name: "Lakmé", logoText: "LAKMÉ", tag: "Absolute Glow", bg: "from-neutral-900 to-black", glow: "border-neutral-700" },
    { name: "Mamaearth", logoText: "mamaearth", tag: "Onion & Ubtan", bg: "from-emerald-950 to-slate-950", glow: "border-emerald-800" },
    { name: "Nivea", logoText: "NIVEA", tag: "Deep Moisture", bg: "from-blue-950 to-slate-950", glow: "border-blue-800" },
    { name: "Plum", logoText: "plum", tag: "Green Tea Vegan", bg: "from-purple-950 to-slate-950", glow: "border-purple-800" },
    { name: "Minimalist", logoText: "MINIMALIST", tag: "Salicylic & Vit C", bg: "from-neutral-900 to-black", glow: "border-neutral-700" },
  ],
  "Home & Living": [
    { name: "IKEA", logoText: "IKEA", tag: "Modular Living", bg: "from-blue-950 to-amber-950", glow: "border-blue-800" },
    { name: "Bombay Dyeing", logoText: "BOMBAY DYEING", tag: "Percale Cotton", bg: "from-indigo-950 to-slate-950", glow: "border-indigo-800" },
    { name: "Wakefit", logoText: "wakefit", tag: "Orthopedic Sleep", bg: "from-emerald-950 to-slate-950", glow: "border-emerald-800" },
    { name: "Solimo", logoText: "SOLIMO", tag: "Home Organizers", bg: "from-orange-950 to-stone-950", glow: "border-orange-800" },
    { name: "Urban Ladder", logoText: "URBAN LADDER", tag: "Solid Sheesham", bg: "from-amber-950 to-stone-950", glow: "border-amber-800" },
  ],
  Appliances: [
    { name: "Samsung", logoText: "SAMSUNG", tag: "Bespoke AI", bg: "from-blue-950 to-slate-950", glow: "border-blue-800" },
    { name: "LG", logoText: "LG", tag: "Direct Drive AI", bg: "from-rose-950 to-black", glow: "border-rose-800" },
    { name: "Whirlpool", logoText: "Whirlpool", tag: "IntelliFresh", bg: "from-cyan-950 to-slate-950", glow: "border-cyan-800" },
    { name: "Philips", logoText: "PHILIPS", tag: "Airfryers & Lights", bg: "from-blue-950 to-slate-950", glow: "border-blue-800" },
    { name: "Dyson", logoText: "dyson", tag: "Purifier & Cyclone", bg: "from-neutral-900 to-black", glow: "border-purple-800" },
    { name: "Havells", logoText: "HAVELLS", tag: "Silent Fans", bg: "from-red-950 to-stone-950", glow: "border-red-800" },
  ],
  Sports: [
    { name: "Decathlon", logoText: "DECATHLON", tag: "Kipsta & Domyos", bg: "from-blue-900 to-indigo-950", glow: "border-blue-700" },
    { name: "Yonex", logoText: "YONEX", tag: "Astrox & Nanoflare", bg: "from-emerald-950 to-slate-950", glow: "border-emerald-800" },
    { name: "Cosco", logoText: "COSCO", tag: "Championship Pro", bg: "from-red-950 to-stone-950", glow: "border-red-800" },
    { name: "Nivia", logoText: "NIVIA", tag: "Ashtang Ball", bg: "from-orange-950 to-stone-950", glow: "border-orange-800" },
    { name: "Wilson", logoText: "Wilson", tag: "Pro Staff Racquets", bg: "from-rose-950 to-black", glow: "border-rose-800" },
  ],
  Books: [
    { name: "Penguin", logoText: "PENGUIN", tag: "Modern Classics", bg: "from-orange-950 to-stone-950", glow: "border-orange-800" },
    { name: "HarperCollins", logoText: "HARPERCOLLINS", tag: "Fiction Bestsellers", bg: "from-red-950 to-slate-950", glow: "border-red-800" },
    { name: "Oxford", logoText: "OXFORD", tag: "Academic Dictionaries", bg: "from-blue-950 to-slate-950", glow: "border-blue-800" },
    { name: "Bloomsbury", logoText: "BLOOMSBURY", tag: "Literary Excellence", bg: "from-purple-950 to-slate-950", glow: "border-purple-800" },
    { name: "Scholastic", logoText: "SCHOLASTIC", tag: "Children & Fantasy", bg: "from-rose-950 to-stone-950", glow: "border-rose-800" },
  ],
  Toys: [
    { name: "Lego", logoText: "LEGO", tag: "Technic & Creator", bg: "from-red-900 to-stone-950", glow: "border-red-700" },
    { name: "Hot Wheels", logoText: "HOT WHEELS", tag: "Track Sets", bg: "from-blue-950 to-red-950", glow: "border-amber-700" },
    { name: "Barbie", logoText: "Barbie", tag: "Dreamhouse", bg: "from-pink-900 to-rose-950", glow: "border-pink-700" },
    { name: "Nerf", logoText: "NERF", tag: "Elite 2.0 Darts", bg: "from-orange-950 to-blue-950", glow: "border-yellow-700" },
    { name: "Hasbro", logoText: "Hasbro", tag: "Monopoly & Games", bg: "from-blue-950 to-indigo-950", glow: "border-blue-800" },
  ],
  // Top Featured across all categories
  All: [
    { name: "Apple", logoText: " Apple", tag: "Flagship Gadgets", bg: "from-slate-900 to-black", glow: "border-slate-700" },
    { name: "Samsung", logoText: "SAMSUNG", tag: "Galaxy & Displays", bg: "from-blue-950 to-slate-950", glow: "border-blue-800" },
    { name: "Sony", logoText: "SONY", tag: "Audio & Bravia", bg: "from-zinc-900 to-black", glow: "border-zinc-700" },
    { name: "Nike", logoText: "NIKE", tag: "Footwear & Wear", bg: "from-slate-900 to-black", glow: "border-slate-700" },
    { name: "Zara", logoText: "ZARA", tag: "Apparel & Trends", bg: "from-neutral-900 to-black", glow: "border-neutral-700" },
    { name: "boAt", logoText: "boAt", tag: "Audio & Watches", bg: "from-rose-950 to-black", glow: "border-rose-800" },
    { name: "Adidas", logoText: "ADIDAS", tag: "Shoes & Sport", bg: "from-zinc-900 to-black", glow: "border-zinc-700" },
    { name: "Levi's", logoText: "LEVI'S", tag: "Authentic Denim", bg: "from-red-900 to-slate-950", glow: "border-red-700" },
    { name: "Titan", logoText: "TITAN", tag: "Heritage Watches", bg: "from-amber-950 to-black", glow: "border-amber-800" },
    { name: "L'Oréal", logoText: "L'ORÉAL", tag: "Paris Skincare", bg: "from-stone-900 to-black", glow: "border-stone-700" },
    { name: "IKEA", logoText: "IKEA", tag: "Home Comfort", bg: "from-blue-950 to-amber-950", glow: "border-blue-800" },
    { name: "Decathlon", logoText: "DECATHLON", tag: "Sports & Gear", bg: "from-blue-900 to-indigo-950", glow: "border-blue-700" },
  ]
};

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

  // Read state from URL
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [brand, setBrand] = useState(searchParams.get("brand") || "All");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Sync state from URL parameters
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

  // Handle Category selection
  const handleCategorySelect = (selectedCat) => {
    setCategory(selectedCat);
    // When changing category, clear the specific brand filter so products load for the new category
    setBrand("All");
    const params = new URLSearchParams(searchParams);
    if (selectedCat && selectedCat !== "All") {
      params.set("category", selectedCat);
    } else {
      params.delete("category");
    }
    params.delete("brand");
    params.delete("page");
    setSearchParams(params);
  };

  // Handle Brand selection toggle (Image 4 Flipkart interaction)
  const handleBrandSelect = (selectedBrand) => {
    const params = new URLSearchParams(searchParams);
    if (brand.toLowerCase() === selectedBrand.toLowerCase()) {
      // Toggle off if already selected
      setBrand("All");
      params.delete("brand");
    } else {
      setBrand(selectedBrand);
      params.set("brand", selectedBrand);
    }
    params.delete("page");
    setSearchParams(params);
  };

  // Handle Sort Change
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

  // Debounced search text and price filter URL updates
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

        params.delete("page");
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
          sort: searchParams.get("sort") || "newest",
          page: searchParams.get("page") || "1",
        };

        const response = await getAllProducts(filters);
        const fetchedList = response.products || response.product || [];
        setProducts(fetchedList);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.currentPage || 1);
        setTotalProducts(response.totalProducts ?? response.count ?? fetchedList.length);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchParams]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
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

  // Active brands list corresponding to selected category (Image 4)
  const currentBrands = useMemo(() => {
    const key = Object.keys(CATEGORY_BRAND_MAP).find(
      (k) => k.toLowerCase() === category.toLowerCase()
    );
    return key ? CATEGORY_BRAND_MAP[key] : CATEGORY_BRAND_MAP["All"];
  }, [category]);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans pb-24">
      
      {/* ── 1. FLIPKART IMAGE 4: DYNAMIC CATEGORY NAVIGATION & VISUAL BRAND SELECTOR ── */}
      <section className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          
          {/* Category Switcher Tabs */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide pb-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isCatActive =
                cat.value.toLowerCase() === category.toLowerCase() ||
                (cat.value === "All" && category === "All");

              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleCategorySelect(cat.value)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isCatActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-102"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── Flipkart Image 4: Visual Brand Cards Inside Active Category ── */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {category === "All" ? "Featured Brands" : `Popular Brands in ${category}`}
                </span>
                {brand !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Active: {brand}
                    <button
                      type="button"
                      onClick={() => handleBrandSelect(brand)}
                      className="hover:text-blue-900 cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              {brand !== "All" && (
                <button
                  type="button"
                  onClick={() => handleBrandSelect(brand)}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Show All Brands
                </button>
              )}
            </div>

            {/* Horizontal Scrollable Brand Pedestals (Matches Image 4 grid) */}
            <div className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-hide">
              {currentBrands.map((b) => {
                const isSelected = brand.toLowerCase() === b.name.toLowerCase();

                return (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => handleBrandSelect(b.name)}
                    className={`group shrink-0 flex flex-col items-center p-2 rounded-2xl transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 ring-2 ring-blue-600 shadow-md scale-105"
                        : "bg-slate-50 hover:bg-white hover:shadow-md border border-slate-200/70"
                    }`}
                  >
                    {/* Visual Device / Brand Pedestal (Flipkart Image 4 mockup style) */}
                    <div
                      className={`w-20 h-24 sm:w-22 sm:h-26 rounded-xl bg-gradient-to-b ${b.bg} flex flex-col items-center justify-between p-2 shadow-inner relative overflow-hidden transition-transform group-hover:scale-102`}
                    >
                      {/* Top status light */}
                      <div className="w-full flex justify-end">
                        {isSelected ? (
                          <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                        )}
                      </div>

                      {/* Brand Logo Title */}
                      <div className="text-center w-full px-0.5 my-auto">
                        <span className="text-white text-xs sm:text-sm font-black tracking-tight leading-tight block drop-shadow-xs">
                          {b.logoText}
                        </span>
                        <span className="text-[10px] text-slate-300 font-medium block truncate mt-0.5">
                          {b.tag}
                        </span>
                      </div>

                      {/* Pedestal Bottom Accent Glow */}
                      <div className="w-10 h-1.5 bg-blue-400/40 rounded-full blur-2xs mt-auto"></div>
                    </div>

                    {/* Brand Name Label below Pedestal */}
                    <span
                      className={`text-xs font-bold mt-2 truncate max-w-[84px] text-center ${
                        isSelected ? "text-blue-700 font-black" : "text-slate-800 group-hover:text-blue-600"
                      }`}
                    >
                      {b.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PRODUCT BROWSING & FILTER CONTROLS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Quick Filter Utility Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-5 sm:px-6 py-3.5 rounded-2xl shadow-xs border border-slate-200 mb-6">
          
          {/* Results count & status */}
          <div className="flex items-center gap-3">
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Showing <span className="font-black text-slate-900">{totalProducts || products.length}</span> products
              {category !== "All" && (
                <span className="text-blue-600 ml-1">in {category}</span>
              )}
              {brand !== "All" && (
                <span className="text-slate-900 font-bold ml-1">({brand})</span>
              )}
            </p>
          </div>

          {/* Controls: Price Range Quick Filter + Sort */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            
            {/* Price Range Inputs */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span>Price:</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-14 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs font-bold text-slate-800 text-center !outline-none"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-14 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs font-bold text-slate-800 text-center !outline-none"
              />
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 py-1.5 pl-3 pr-8 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer transition-all"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Clear All Reset */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              Active Filters:
            </span>
            {category !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Category: {category}
                <button
                  type="button"
                  onClick={() => handleCategorySelect("All")}
                  className="hover:text-blue-900 cursor-pointer"
                  title="Clear category"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {brand !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-xs">
                Brand: {brand}
                <button
                  type="button"
                  onClick={() => handleBrandSelect(brand)}
                  className="hover:text-rose-300 cursor-pointer"
                  title="Clear brand"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                Search: "{search}"
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="hover:text-slate-950 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                ₹{minPrice || 0} - ₹{maxPrice || "Any"}
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  className="hover:text-slate-950 cursor-pointer"
                  title="Clear price filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* ── 3. PRODUCT GRID (Clean, Modern, Full Width) ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="py-24 bg-white rounded-3xl border border-slate-200 shadow-xs text-center flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
              No products found {brand !== "All" && `for ${brand}`}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-sm mb-6">
              We couldn't find anything matching your selected filters. Try choosing a different brand or resetting your filters.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-200 transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* ── 4. PAGINATION CONTROLS ── */}
        {totalPages > 1 && (
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-semibold text-slate-500">
              Showing Page <span className="font-bold text-slate-900">{currentPage}</span> of{" "}
              <span className="font-bold text-slate-900">{totalPages}</span> ({totalProducts} items)
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentPage === p
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;
