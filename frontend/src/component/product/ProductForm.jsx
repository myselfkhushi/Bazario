import { useForm } from "react-hook-form";
import { useState } from "react";
import {
    FaBoxOpen,
    FaTag,
    FaFileAlt,
    FaRupeeSign,
    FaWarehouse,
    FaPalette,
    FaRulerCombined,
    FaWeight,
    FaCloudUploadAlt,
    FaSave,
} from "react-icons/fa";

function ProductForm({ onSubmit, defaultValues = {} }) {

    const [preview, setPreview] = useState([]);

    const {
        register,
        handleSubmit,
    } = useForm({
        defaultValues,
    });

    return (

        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

            <div className="max-w-5xl mx-auto">

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                    <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-7">

                        <h1 className="text-3xl font-bold text-white">
                            Product Information
                        </h1>

                        <p className="text-blue-100 mt-2">
                            Fill all product details carefully before publishing.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-8 space-y-8"
                    >

                        {/* Product Name */}

                        <div>

                            <label className="font-semibold flex items-center gap-2 mb-3">

                                <FaBoxOpen />

                                Product Name

                            </label>

                            <input
                                type="text"
                                placeholder="Enter product name"
                                className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                {...register("title", {
                                    required: true,
                                })}
                            />

                        </div>

                        {/* Category */}

                        <div>

                            <label className="font-semibold flex items-center gap-2 mb-3">

                                <FaTag />

                                Category

                            </label>

                            <select
                                className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                {...register("category", {
                                    required: true,
                                })}
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="Electronics">
                                    Electronics
                                </option>

                                <option value="Fashion">
                                    Fashion
                                </option>

                                <option value="Home">
                                    Home
                                </option>

                                <option value="Books">
                                    Books
                                </option>

                                <option value="Beauty">
                                    Beauty
                                </option>

                                <option value="Sports">
                                    Sports
                                </option>

                            </select>

                        </div>

                        {/* Description */}

                        <div>

                            <label className="font-semibold flex items-center gap-2 mb-3">

                                <FaFileAlt />

                                Description

                            </label>

                            <textarea
                                rows="6"
                                placeholder="Write product description..."
                                className="w-full border border-gray-300 rounded-xl px-5 py-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                                {...register("description", {
                                    required: true,
                                })}
                            />

                        </div>

                        {/* Price + Stock */}

                        <div className="grid md:grid-cols-2 gap-6">

                            <div>

                                <label className="font-semibold flex items-center gap-2 mb-3">

                                    <FaRupeeSign />

                                    Price

                                </label>

                                <input
                                    type="number"
                                    placeholder="Enter price"
                                    className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    {...register("price", {
                                        required: true,
                                    })}
                                />

                            </div>

                            <div>

                                <label className="font-semibold flex items-center gap-2 mb-3">

                                    <FaWarehouse />

                                    Stock

                                </label>

                                <input
                                    type="number"
                                    placeholder="Available stock"
                                    className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    {...register("stock", {
                                        required: true,
                                    })}
                                />

                            </div>

                        </div>

                        {/* Images */}

                        <div>

                            <label className="font-semibold flex items-center gap-2 mb-4">

                                <FaCloudUploadAlt />

                                Product Images

                            </label>

                            <label className="border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center py-10 cursor-pointer hover:bg-blue-50 transition">

                                <FaCloudUploadAlt className="text-5xl text-blue-600 mb-4" />

                                <h3 className="font-semibold text-lg">
                                    Click to Upload Images
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    PNG, JPG, JPEG supported
                                </p>

                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    {...register("images")}
                                    onChange={(e) => {

                                        const files = Array.from(e.target.files);

                                        register("images").onChange(e);

                                        setPreview(
                                            files.map((file) =>
                                                URL.createObjectURL(file)
                                            )
                                        );

                                    }}
                                />

                            </label>

                            {preview.length > 0 && (

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">

                                    {preview.map((image, index) => (

                                        <img
                                            key={index}
                                            src={image}
                                            alt="preview"
                                            className="w-full h-36 rounded-xl object-cover shadow"
                                        />

                                    ))}

                                </div>

                            )}

                        </div>

                        {/* Extra Details */}

                        <div className="grid md:grid-cols-3 gap-6">

                            <div>

                                <label className="font-semibold flex items-center gap-2 mb-3">

                                    <FaPalette />

                                    Color

                                </label>

                                <input
                                    type="text"
                                    placeholder="Black"
                                    className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    {...register("color")}
                                />

                            </div>

                            <div>

                                <label className="font-semibold flex items-center gap-2 mb-3">

                                    <FaRulerCombined />

                                    Size

                                </label>

                                <input
                                    type="text"
                                    placeholder="XL"
                                    className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    {...register("size")}
                                />

                            </div>

                            <div>

                                <label className="font-semibold flex items-center gap-2 mb-3">

                                    <FaWeight />

                                    Weight

                                </label>

                                <input
                                    type="text"
                                    placeholder="500g"
                                    className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    {...register("weight")}
                                />

                            </div>

                        </div>

                        {/* Button */}

                        <button
                            type="submit"
                            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition"
                        >

                            <FaSave />

                            Save Product

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default ProductForm;