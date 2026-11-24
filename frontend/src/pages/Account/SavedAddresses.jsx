import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  MapPin,
  Plus,
  Home,
  Briefcase,
  Check,
  Edit2,
  Trash2,
  Phone,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import AccountSidebar from "../../component/account/AccountSidebar.jsx";
import { getMyOrders } from "../../features/order/orderAPI";

export default function SavedAddresses() {
  const { user } = useSelector((state) => state.auth);
  const storageKey = `bazario_saved_addresses_${user?._id || "guest"}`;
  const activeAddressKey = `bazario_active_address_${user?._id || "guest"}`;

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home",
  };
  const [form, setForm] = useState(initialForm);

  // Load addresses from localStorage AND past orders
  useEffect(() => {
    const loadAllAddresses = async () => {
      setLoading(true);
      try {
        let list = [];

        // 1. From localStorage
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) list.push(...parsed);
          } catch (e) {
            console.error("Failed to parse saved addresses:", e);
          }
        }

        // 2. Fetch past delivery locations from orders
        try {
          const res = await getMyOrders();
          const orders = res?.orders || res?.order || [];
          orders.forEach((o, index) => {
            const sa = o.shippingAddress;
            if (sa && (sa.street || sa.address) && sa.city) {
              const streetStr = (sa.street || sa.address || "").trim();
              const cityStr = (sa.city || "").trim();
              const pinStr = (sa.pincode || sa.postalCode || "").trim();

              // Deduplicate against existing addresses in list
              const exists = list.some(
                (existing) =>
                  (existing.street || existing.address || "").toLowerCase() === streetStr.toLowerCase() &&
                  (existing.city || "").toLowerCase() === cityStr.toLowerCase() &&
                  (existing.pincode || existing.postalCode || "").toString() === pinStr.toString()
              );

              if (!exists) {
                list.push({
                  id: `order_addr_${o._id || index}`,
                  fullName: sa.fullName || user?.name || "Customer",
                  phone: sa.phone || user?.phone || "9876543210",
                  street: streetStr,
                  address: streetStr,
                  city: cityStr,
                  state: sa.state || "State",
                  pincode: pinStr,
                  postalCode: pinStr,
                  addressType: "Home",
                  isDefault: list.length === 0,
                });
              }
            }
          });
        } catch (orderErr) {
          console.log("Past order address sync:", orderErr);
        }

        // If list is empty, provide a clean starter template based on profile
        if (list.length === 0 && user?.name) {
          list = [
            {
              id: "addr_default_1",
              fullName: user.name,
              phone: user.phone || "9876543210",
              street: "B-42, Metro Residency, Station Road",
              address: "B-42, Metro Residency, Station Road",
              city: "New Delhi",
              state: "Delhi",
              pincode: "110001",
              postalCode: "110001",
              addressType: "Home",
              isDefault: true,
            },
          ];
        }

        // Save back synchronized addresses
        setAddresses(list);
        localStorage.setItem(storageKey, JSON.stringify(list));
      } catch (err) {
        console.error("Address loader error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllAddresses();
  }, [user, storageKey]);

  // Handle Form Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      fullName: user?.name || "",
      phone: user?.phone || "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      addressType: "Home",
    });
    setShowAddModal(true);
  };

  // Open Edit modal
  const handleOpenEdit = (addr) => {
    setEditingId(addr.id);
    setForm({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      street: addr.street || addr.address || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || addr.postalCode || "",
      addressType: addr.addressType || "Home",
    });
    setShowAddModal(true);
  };

  // Save or Update Address
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.street.trim() || !form.city.trim() || !form.pincode.trim()) {
      toast.error("Please fill in all required address fields.");
      return;
    }

    let updatedList = [];
    if (editingId) {
      updatedList = addresses.map((a) =>
        a.id === editingId
          ? {
              ...a,
              ...form,
              address: form.street,
              postalCode: form.pincode,
            }
          : a
      );
      toast.success("Delivery address updated!");
    } else {
      const newAddr = {
        id: `addr_${Date.now()}`,
        ...form,
        address: form.street,
        postalCode: form.pincode,
        isDefault: addresses.length === 0,
      };
      updatedList = [newAddr, ...addresses];
      toast.success("New delivery location added!");
    }

    setAddresses(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));
    setShowAddModal(false);
  };

  // Delete Address
  const handleDeleteAddress = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    toast.success("Address removed from saved locations.");
  };

  // Set as Default
  const handleSetDefault = (id) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Also update active address for checkout
    const active = updated.find((a) => a.id === id);
    if (active) {
      localStorage.setItem(activeAddressKey, JSON.stringify(active));
    }
    toast.success("Set as default delivery address!");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1">
            Account Management
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Saved Delivery Addresses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your delivery locations, home addresses, and office landmarks for 1-click checkout.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Flipkart-Style Account Sidebar */}
          <AccountSidebar activeTab="addresses" />

          {/* Main Addresses Area */}
          <main className="flex-1 space-y-6">
            
            {/* Top Action Header */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Delivery Locations ({addresses.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Addresses used in your previous orders are automatically synced here.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </button>
            </div>

            {/* Address Cards List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-36 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
                ))}
              </div>
            ) : addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {addresses.map((addr) => {
                  const isHome = (addr.addressType || "Home").toLowerCase() === "home";

                  return (
                    <div
                      key={addr.id}
                      className={`bg-white rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
                        addr.isDefault
                          ? "border-purple-500 ring-2 ring-purple-100 shadow-sm"
                          : "border-slate-200/80 hover:border-slate-300 shadow-2xs"
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                            isHome
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {isHome ? <Home className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                          {addr.addressType || "Home"}
                        </span>

                        {addr.isDefault ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                            <Check className="w-3 h-3 stroke-[3]" /> Default
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(addr.id)}
                            className="text-[11px] font-bold text-slate-500 hover:text-purple-600 transition cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>

                      {/* Recipient info & full address */}
                      <div className="space-y-1.5 mb-5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">{addr.fullName}</h4>
                          <span className="text-slate-300">|</span>
                          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {addr.phone}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {addr.street || addr.address}
                        </p>
                        <p className="text-xs font-semibold text-slate-800">
                          {addr.city}, {addr.state} - <span className="font-mono font-bold text-slate-900">{addr.pincode || addr.postalCode}</span>
                        </p>
                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                          Verified Location
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(addr)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-purple-600 hover:bg-slate-50 transition cursor-pointer"
                            title="Edit Address"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No Saved Delivery Locations</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                  Save your home, apartment, or office address once to enjoy lightning fast checkout.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="px-5 py-2.5 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-purple-700 transition"
                >
                  Add Your First Address
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Add / Edit Address Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                {editingId ? "Edit Delivery Address" : "Add New Delivery Address"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Contact Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Recipient Name"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 !outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    10-Digit Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 !outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  House / Flat / Street / Landmark *
                </label>
                <textarea
                  name="street"
                  rows={2}
                  value={form.street}
                  onChange={handleChange}
                  placeholder="e.g. Flat 304, Green Park Heights, Near Metro Station"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 !outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 !outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 !outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 !outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Address Type
                </label>
                <div className="flex items-center gap-3">
                  {["Home", "Work"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, addressType: type })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        form.addressType === type
                          ? "bg-purple-600 text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {type === "Home" ? <Home className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  Save Delivery Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
