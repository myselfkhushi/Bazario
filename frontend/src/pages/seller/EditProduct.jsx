import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit3 } from "lucide-react";
import toast from "react-hot-toast";
import ProductForm from "../../component/product/ProductForm";
import { getSingleProduct, updateProduct } from "../../features/product/productAPI";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await getSingleProduct(id);
      setProduct(response.product);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("stock", data.stock);

      if (data.brand) formData.append("brand", data.brand);
      if (data.mrp) formData.append("mrp", data.mrp);
      if (data.warranty) formData.append("warranty", data.warranty);
      if (data.returnPolicy) formData.append("returnPolicy", data.returnPolicy);
      if (data.color) formData.append("color", data.color);
      if (data.size) formData.append("size", data.size);
      if (data.weight) formData.append("weight", data.weight);

      if (data.highlightsText) {
        const highlightsArray = data.highlightsText
          .split("\n")
          .map((h) => h.trim())
          .filter(Boolean);
        formData.append("highlights", JSON.stringify(highlightsArray));
      }

      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          formData.append("images", data.images[i]);
        }
      }

      await updateProduct(id, formData);
      toast.success("Product updated successfully!");
      navigate("/seller/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs font-medium text-slate-500">Loading Product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Edit3 className="w-6 h-6 text-purple-600" />
            Edit Product
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update pricing, inventory, guarantees, and product specifications.
          </p>
        </div>

        <Link
          to="/seller/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory
        </Link>
      </div>

      <ProductForm defaultValues={product} onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
