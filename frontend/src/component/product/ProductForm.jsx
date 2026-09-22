import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  Package, 
  Tag, 
  FileText, 
  IndianRupee, 
  Warehouse, 
  Shield, 
  RotateCcw, 
  UploadCloud, 
  Sparkles, 
  Palette, 
  Ruler, 
  Scale, 
  Save, 
  X, 
  Info 
} from "lucide-react";

export default function ProductForm({ onSubmit, defaultValues = {}, isSubmitting = false }) {
  const [previews, setPreviews] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: defaultValues.title || "",
      category: defaultValues.category || "",
      brand: defaultValues.brand || "",
      description: defaultValues.description || "",
      price: defaultValues.price || "",
      mrp: defaultValues.mrp || "",
      stock: defaultValues.stock || "",
      warranty: defaultValues.warranty || "1 Year Brand Warranty",
      returnPolicy: defaultValues.returnPolicy || "7 Days Doorstep Replacement",
      highlightsText: defaultValues.highlights ? (Array.isArray(defaultValues.highlights) ? defaultValues.highlights.join("\n") : defaultValues.highlights) : "",
      color: defaultValues.color || "",
      size: defaultValues.size || "",
      weight: defaultValues.weight || ""
    }
  });

  // Load existing images if in edit mode
  useEffect(() => {
    if (defaultValues?.images && defaultValues.images.length > 0) {
      setPreviews(defaultValues.images.map((img) => img.url));
    }
  }, [defaultValues]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
    }
  };

  const handleFormSubmit = (data) => {
    // Pass processed data to parent onSubmit
    onSubmit(data);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-slate-900 px-6 py-6 sm:px-8 text-white">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          Merchant Inventory Manager
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Product Specifications & Pricing</h2>
        <p className="text-slate-400 text-xs mt-1">
          Configure accurate pricing, brand details, warranty terms, and media for your catalog item.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 sm:p-8 space-y-8">
        {/* Section 1: Basic Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-purple-600" />
            Basic Product Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sony WH-1000XM5 Wireless Noise Cancelling Headphones"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("title", { required: true })}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                {...register("category", { required: true })}
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Footwear">Footwear</option>
                <option value="Watches">Watches</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Beauty">Beauty</option>
                <option value="Health">Health</option>
                <option value="Sports">Sports</option>
                <option value="Books">Books</option>
                <option value="Toys">Toys</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                list="brand-options-list"
                placeholder="e.g. Apple, Sony, Nike, Bazario Official"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("brand")}
              />
              <datalist id="brand-options-list">
                <option value="Apple" />
                <option value="Samsung" />
                <option value="Sony" />
                <option value="Nike" />
                <option value="Adidas" />
                <option value="Zara" />
                <option value="Levi's" />
                <option value="H&M" />
                <option value="IKEA" />
                <option value="Bazario Official" />
              </datalist>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Product Description *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write a comprehensive description explaining key benefits, build quality, and intended usage..."
                className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("description", { required: true })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing, MRP & Inventory */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            Pricing & Inventory
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Selling Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                min={1}
                placeholder="e.g. 2499"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                {...register("price", { required: true, min: 1 })}
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Final price buyer pays</span>
            </div>

            {/* Original MRP */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Original MRP (₹)
              </label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 3999"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("mrp")}
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Used for calculating discount %</span>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Warehouse Stock Units *
              </label>
              <input
                type="number"
                required
                min={0}
                placeholder="e.g. 50"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("stock", { required: true, min: 0 })}
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Available quantity</span>
            </div>
          </div>
        </div>

        {/* Section 3: Warranty, Return Policy & Bullet Highlights */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            Warranty, Guarantees & Bullet Highlights
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            {/* Warranty */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Warranty Period
              </label>
              <input
                type="text"
                placeholder="e.g. 1 Year Brand Domestic Warranty"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("warranty")}
              />
            </div>

            {/* Return Policy */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Return & Replacement Window
              </label>
              <input
                type="text"
                placeholder="e.g. 7 Days Doorstep Replacement"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("returnPolicy")}
              />
            </div>
          </div>

          {/* Highlights / Key Features */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Key Highlights (Write each bullet feature on a new line)
            </label>
            <textarea
              rows={4}
              placeholder={`Active Noise Cancellation with dual microphones\nHigh-resolution audio streaming with LDAC support\nUp to 30 hours of continuous playback\nFast USB Type-C charging (3 min charge = 3 hours playback)`}
              className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-xs"
              {...register("highlightsText")}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              These points appear as clean checklist bullet points on the customer's product detail page.
            </p>
          </div>
        </div>

        {/* Section 4: Physical Attributes (Color, Size, Weight) */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-600" />
            Physical Attributes (Optional)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Color / Finish
              </label>
              <input
                type="text"
                placeholder="e.g. Midnight Black"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("color")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Size / Dimensions
              </label>
              <input
                type="text"
                placeholder="e.g. Medium / 42mm / 15-inch"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("size")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Weight / Capacity
              </label>
              <input
                type="text"
                placeholder="e.g. 250 grams / 1 Litre"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("weight")}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Image Upload */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-purple-600" />
            Product Media
          </h3>

          <label className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-purple-50/30 transition group">
            <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-purple-600 transition mb-3" />
            <span className="text-sm font-bold text-slate-800">
              Click to browse or drag & drop high-resolution photos
            </span>
            <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP formats supported (up to 5 images)</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              {...register("images")}
              onChange={handleFileChange}
            />
          </label>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-600 block mb-2">Image Previews ({previews.length}):</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl border border-slate-200 overflow-hidden bg-white">
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-purple-600 text-white text-sm font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving Product...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Publish Product to Marketplace
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}