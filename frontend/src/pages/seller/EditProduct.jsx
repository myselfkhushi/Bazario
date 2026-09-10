import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaEdit,
} from "react-icons/fa";

import ProductForm from "../../component/product/ProductForm";

import {
    getSingleProduct,
    updateProduct,
} from "../../features/product/productAPI";

function EditProduct() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {

            const response = await getSingleProduct(id);

            setProduct(response.product);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                    "Something went wrong"
            );

        } finally {

            setLoading(false);

        }
    };

    const onSubmit = async (data) => {
        try {

            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("category", data.category);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("stock", data.stock);
            formData.append("color", data.color);
            formData.append("size", data.size);
            formData.append("weight", data.weight);

            if (data.images && data.images.length > 0) {

                for (let i = 0; i < data.images.length; i++) {

                    formData.append(
                        "images",
                        data.images[i]
                    );

                }

            }

            await updateProduct(id, formData);

            alert("Product Updated Successfully");

            navigate("/seller/products");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                    "Something went wrong"
            );

        }
    };

    if (loading) {

        return (

            <div className="min-h-screen bg-gray-50 flex items-center justify-center">

                <div className="text-center">

                    <div className="w-14 h-14 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

                    <p className="mt-5 text-gray-600">
                        Loading Product...
                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

            <div className="max-w-5xl mx-auto">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

                    <div>

                        <h1 className="text-4xl font-bold flex items-center gap-3">

                            <FaEdit className="text-blue-600" />

                            Edit Product

                        </h1>

                        <p className="text-gray-500 mt-2">

                            Update product information and save your changes.

                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate("/seller/products")
                        }
                        className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-xl transition"
                    >

                        <FaArrowLeft />

                        Back to Products

                    </button>

                </div>

                <ProductForm
                    defaultValues={product}
                    onSubmit={onSubmit}
                />

            </div>

        </div>

    );

}

export default EditProduct;
