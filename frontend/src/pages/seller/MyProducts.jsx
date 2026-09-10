import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    FaSearch,
    FaPlus,
    FaEdit,
    FaTrash,
    FaBoxOpen,
    FaRupeeSign,
    FaBoxes,
} from "react-icons/fa";

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

    const { product = [], loading } = useSelector(
        (state) => state.product
    );

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            dispatch(setLoading(true));

            const response = await getMyProducts();

            dispatch(setMyProducts(response.product));
        } catch (error) {
            dispatch(
                setError(
                    error.response?.data?.message ||
                        "Something went wrong"
                )
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {
            await deleteProduct(id);

            await fetchMyProducts();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Something went wrong"
            );
        }
    };

    const filteredProducts = product.filter((item) =>
        item.title
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    const totalStock = product.reduce(
        (total, item) => total + Number(item.stock || 0),
        0
    );

    const lowStockProducts = product.filter(
        (item) => item.stock > 0 && item.stock <= 5
    ).length;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

            <div className="max-w-7xl mx-auto">

                {/* Header */}

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            My Products
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Manage, update and track all your products.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/seller/add-product")
                        }
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                    >
                        <FaPlus />

                        Add Product
                    </button>

                </div>

                {/* Statistics */}

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Products
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {product.length}
                            </h2>
                        </div>

                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                            <FaBoxOpen size={24} />
                        </div>

                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Stock
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {totalStock}
                            </h2>
                        </div>

                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                            <FaBoxes size={24} />
                        </div>

                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Low Stock
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {lowStockProducts}
                            </h2>
                        </div>

                        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                            <FaRupeeSign size={24} />
                        </div>

                    </div>

                </div>

                {/* Products Container */}

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Search Header */}

                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>
                            <h2 className="text-2xl font-bold">
                                Product Inventory
                            </h2>

                            <p className="text-gray-500 text-sm mt-1">
                                {filteredProducts.length} products found
                            </p>
                        </div>

                        <div className="relative w-full md:w-80">

                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />

                        </div>

                    </div>

                    {/* Loading */}

                    {loading ? (

                        <div className="py-24 flex flex-col items-center justify-center">

                            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />

                            <p className="text-gray-500 mt-4">
                                Loading products...
                            </p>

                        </div>

                    ) : filteredProducts.length === 0 ? (

                        /* Empty State */

                        <div className="py-24 px-6 text-center">

                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                                <FaBoxOpen size={34} />
                            </div>

                            <h2 className="text-2xl font-bold mt-6">
                                {search
                                    ? "No Products Found"
                                    : "No Products Yet"}
                            </h2>

                            <p className="text-gray-500 mt-2">
                                {search
                                    ? "Try searching with another product name."
                                    : "Start selling by adding your first product."}
                            </p>

                            {!search && (
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/seller/add-product"
                                        )
                                    }
                                    className="mt-7 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                                >
                                    Add Your First Product
                                </button>
                            )}

                        </div>

                    ) : (

                        /* Table */

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px]">

                                <thead className="bg-gray-50">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Product
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Price
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Stock
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-gray-100">

                                    {filteredProducts.map(
                                        (Product) => (

                                            <tr
                                                key={Product._id}
                                                className="hover:bg-gray-50/80 transition"
                                            >

                                                {/* Product */}

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-4">

                                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">

                                                            <img
                                                                src={
                                                                    Product
                                                                        .images?.[0]
                                                                        ?.url
                                                                }
                                                                alt={
                                                                    Product.title
                                                                }
                                                                className="w-full h-full object-cover hover:scale-110 transition duration-300"
                                                            />

                                                        </div>

                                                        <div>

                                                            <h3 className="font-semibold text-gray-900 max-w-60 truncate">
                                                                {
                                                                    Product.title
                                                                }
                                                            </h3>

                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {Product.category ||
                                                                    "Uncategorized"}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* Price */}

                                                <td className="px-6 py-5">

                                                    <span className="font-bold text-lg text-gray-900">
                                                        ₹
                                                        {
                                                            Product.price
                                                        }
                                                    </span>

                                                </td>

                                                {/* Stock */}

                                                <td className="px-6 py-5">

                                                    <span className="font-semibold">
                                                        {
                                                            Product.stock
                                                        }
                                                    </span>

                                                    <span className="text-gray-400 text-sm ml-1">
                                                        units
                                                    </span>

                                                </td>

                                                {/* Status */}

                                                <td className="px-6 py-5">

                                                    {Product.stock <=
                                                    0 ? (

                                                        <span className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                                            Out of Stock
                                                        </span>

                                                    ) : Product.stock <=
                                                      5 ? (

                                                        <span className="inline-flex items-center bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                                            Low Stock
                                                        </span>

                                                    ) : (

                                                        <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                                            In Stock
                                                        </span>

                                                    )}

                                                </td>

                                                {/* Actions */}

                                                <td className="px-6 py-5">

                                                    <div className="flex justify-end items-center gap-3">

                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/seller/edit-product/${Product._id}`
                                                                )
                                                            }
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                                            title="Edit Product"
                                                        >
                                                            <FaEdit />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    Product._id
                                                                )
                                                            }
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                                                            title="Delete Product"
                                                        >
                                                            <FaTrash />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default MyProducts;