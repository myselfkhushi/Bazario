import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    PackageOpen,
    Banknote,
    Boxes,
    AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    getMyProducts,
    deleteProduct,
} from "../../features/product/productAPI";

import {
    setLoading,
    setMyProducts,
    setError,
} from "../../features/product/productSlice";

function MyProducts() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [search, setSearch] = useState("");
    const { product = [], loading } = useSelector((state) => state.product);

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            dispatch(setLoading(true));
            const response = await getMyProducts();
            dispatch(setMyProducts(response.product));
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            await deleteProduct(id);
            toast.success("Product deleted successfully");
            await fetchMyProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const filteredProducts = product.filter((item) =>
        item.title?.toLowerCase().includes(search.toLowerCase())
    );

    const totalStock = product.reduce((total, item) => total + Number(item.stock || 0), 0);
    const lowStockProducts = product.filter((item) => item.stock > 0 && item.stock <= 5).length;

    return (
        <div className="font-sans text-slate-900">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                        Inventory
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">
                        Manage your products and stock levels.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/seller/add-product")}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest uppercase text-xs rounded-xl transition-all shadow-[0_8px_30px_rgb(147,51,234,0.3)] hover:-translate-y-0.5"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <PackageOpen className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Items</p>
                        <h3 className="text-2xl font-black">{product.length}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Boxes className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Stock</p>
                        <h3 className="text-2xl font-black">{totalStock}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Low Stock</p>
                        <h3 className="text-2xl font-black">{lowStockProducts}</h3>
                    </div>
                </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-black tracking-tight">Your Products</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 font-black border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-4">Product Details</th>
                                <th className="px-8 py-4">Category</th>
                                <th className="px-8 py-4 text-right">Price</th>
                                <th className="px-8 py-4 text-center">Stock</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-16 text-center">
                                        <div className="w-8 h-8 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-slate-500 text-sm font-bold">Loading inventory...</p>
                                    </td>
                                </tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                                    {item.images && item.images[0] ? (
                                                        <img
                                                            src={item.images[0].url}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                            <PackageOpen className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 font-medium mt-1">ID: {item._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 font-black text-slate-900 text-right">
                                            ₹{item.price.toLocaleString("en-IN")}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`font-black ${item.stock <= 5 ? "text-rose-600" : "text-emerald-600"}`}>
                                                {item.stock}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/seller/edit-product/${item._id}`)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-16 text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 mb-4">
                                            <PackageOpen className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-slate-900 font-bold mb-1">No products found</p>
                                        <p className="text-slate-500 text-sm mb-6">You haven't added any products matching this criteria.</p>
                                        <button
                                            onClick={() => navigate("/seller/add-product")}
                                            className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors"
                                        >
                                            Add New Product
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MyProducts;