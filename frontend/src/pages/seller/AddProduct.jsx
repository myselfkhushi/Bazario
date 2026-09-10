import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { createProduct } from "../../features/product/productAPI";
import ProductForm from "../../component/product/ProductForm";

export default function AddProduct() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Parse highlightsText to array
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

      await createProduct(formData);
      toast.success("Product published to marketplace successfully!");
      navigate("/seller/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Add New Product
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            List your inventory on Bazario marketplace with complete pricing, warranty, and specifications.
          </p>
        </div>
        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
            <PackagePlus className="w-6 h-6" />
        </div>
      </div>

      <ProductForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}