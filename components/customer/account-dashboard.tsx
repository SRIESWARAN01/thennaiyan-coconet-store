"use client";

import { useState, useTransition } from "react";
import { 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  MapPin, 
  Settings, 
  User, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  Loader2,
  Calendar,
  Lock,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { updateProfile, saveAddress, deleteAddress } from "@/app/actions/customer";
import Link from "next/link";

type Tab = "orders" | "wishlist" | "enquiries" | "addresses" | "settings";

type AccountDashboardProps = {
  profile: any;
  user: any;
  orders: any[];
  enquiries: any[];
  addresses: any[];
  allProducts: any[];
};

const INR = "₹";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  packed: "bg-indigo-100 text-indigo-800 border-indigo-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
  refunded: "bg-slate-100 text-slate-800 border-slate-200",
};

export function AccountDashboard({
  profile,
  user,
  orders,
  enquiries,
  addresses,
  allProducts
}: AccountDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [isPending, startTransition] = useTransition();

  // Settings State
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrLine1, setAddrLine1] = useState("");
  const [addrLine2, setAddrLine2] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrPincode, setAddrPincode] = useState("");
  const [addrError, setAddrError] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSettingsError("");
    setSettingsSuccess(false);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phone", phone);

    startTransition(async () => {
      const res = await updateProfile({}, formData);
      if (res.error) {
        setSettingsError(res.error);
      } else {
        setSettingsSuccess(true);
      }
    });
  };

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddrError("");

    const formData = new FormData();
    if (editingAddress?.id) formData.append("id", editingAddress.id);
    formData.append("fullName", addrName);
    formData.append("phone", addrPhone);
    formData.append("line1", addrLine1);
    formData.append("line2", addrLine2);
    formData.append("city", addrCity);
    formData.append("state", addrState);
    formData.append("pincode", addrPincode);

    startTransition(async () => {
      const res = await saveAddress({}, formData);
      if (res.error) {
        setAddrError(res.error);
      } else {
        setShowAddressForm(false);
        setEditingAddress(null);
        // Clear form
        setAddrName("");
        setAddrPhone("");
        setAddrLine1("");
        setAddrLine2("");
        setAddrCity("");
        setAddrState("");
        setAddrPincode("");
      }
    });
  };

  const handleStartEditAddress = (addr: any) => {
    setEditingAddress(addr);
    setAddrName(addr.full_name || "");
    setAddrPhone(addr.phone || "");
    setAddrLine1(addr.line1 || "");
    setAddrLine2(addr.line2 || "");
    setAddrCity(addr.city || "");
    setAddrState(addr.state || "");
    setAddrPincode(addr.pincode || "");
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    startTransition(async () => {
      await deleteAddress(addrId);
    });
  };

  // Profile Image Initials
  const initials = (profile?.full_name || user?.email || "C")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] items-start">
      {/* Left Sidebar */}
      <div className="bg-white rounded-[16px] p-6 shadow-[0_8px_30px_rgba(31,107,59,0.04)] border border-[#1f6b3b]/5">
        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-[#1f6b3b] to-[#356f3b] text-white flex items-center justify-center font-display text-2xl font-bold shadow-md">
            {initials}
          </div>
          <h2 className="mt-4 font-body text-lg font-extrabold text-[#111827]">
            {profile?.full_name || "Customer"}
          </h2>
          <p className="font-body text-xs font-medium text-gray-500 mt-1">
            {profile?.email || user?.email}
          </p>
          {profile?.phone && (
            <p className="font-body text-xs font-semibold text-[#1f6b3b] mt-1.5 bg-[#edf6ee] px-2.5 py-0.5 rounded-full">
              {profile.phone}
            </p>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 space-y-1">
          {[
            { id: "orders", label: "My Orders", icon: ShoppingBag, count: orders.length },
            { id: "wishlist", label: "My Wishlist", icon: Heart },
            { id: "enquiries", label: "My Enquiries", icon: MessageSquare, count: enquiries.length },
            { id: "addresses", label: "Address Book", icon: MapPin, count: addresses.length },
            { id: "settings", label: "Account Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setShowAddressForm(false);
                  setEditingAddress(null);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-body text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#1f6b3b] text-white shadow-sm"
                    : "text-gray-600 hover:bg-[#edf6ee] hover:text-[#1f6b3b]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Content Panel */}
      <div className="bg-white rounded-[16px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(31,107,59,0.04)] border border-[#1f6b3b]/5 min-h-[480px]">
        {/* Tab 1: My Orders */}
        {activeTab === "orders" && (
          <div>
            <h3 className="font-display text-xl font-bold text-[#111827] mb-6">
              Order History
            </h3>
            {orders.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-xl">
                <ShoppingBag className="mx-auto text-gray-300 mb-4 animate-pulse" size={40} />
                <h4 className="font-body text-base font-extrabold text-[#111827]">No orders placed yet</h4>
                <p className="font-body text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Browse our range of wood-pressed oils and add items to your cart to make an enquiry.
                </p>
                <Link
                  href="/shop"
                  className="mt-5 inline-flex items-center justify-center bg-[#1f6b3b] text-white px-5 py-2.5 rounded-lg font-body text-xs font-bold shadow-md hover:bg-[#1b5c32] transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-all bg-gray-50/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3 mb-3">
                      <div>
                        <p className="font-body text-sm font-extrabold text-[#111827]">
                          Order {order.order_no}
                        </p>
                        <p className="font-body text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                          <Calendar size={12} />
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                          statusColors[order.status] ?? "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-body text-xs text-gray-500">Total Amount</p>
                        <p className="font-body text-base font-extrabold text-[#1f6b3b] mt-0.5">
                          {INR}{Number(order.total_inr).toFixed(2)}
                        </p>
                      </div>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-flex items-center gap-1 bg-[#1f6b3b]/10 text-[#1f6b3b] hover:bg-[#1f6b3b] hover:text-white px-4 py-2 rounded-lg font-body text-xs font-bold transition-all"
                      >
                        Track Order
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Wishlist */}
        {activeTab === "wishlist" && (
          <div>
            <h3 className="font-display text-xl font-bold text-[#111827] mb-6">
              My Wishlist
            </h3>
            {/* Wishlist Mock with Seed Products */}
            <div className="grid gap-4 sm:grid-cols-2">
              {allProducts.slice(0, 2).map((product) => (
                <div
                  key={product.slug}
                  className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col"
                >
                  <div
                    className="h-32 flex items-center justify-center p-4"
                    style={{ background: `linear-gradient(135deg, ${product.hueA}10, ${product.hueB}20)` }}
                  >
                    <span className="font-display text-xs font-bold text-[#1f6b3b] bg-white px-2.5 py-1 rounded-full shadow-sm">
                      {product.variant}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-body text-sm font-extrabold text-[#111827] truncate">
                        {product.name}
                      </h4>
                      <p className="font-body text-xs text-gray-500 mt-1 line-clamp-2">
                        {product.tagline}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                      <span className="font-body text-sm font-extrabold text-[#1f6b3b]">
                        Starting {INR}{product.startingFrom}
                      </span>
                      <Link
                        href="/shop"
                        className="text-xs font-bold text-gray-600 hover:text-[#1f6b3b] flex items-center gap-1"
                      >
                        View Options
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {allProducts.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-xl">
                <Heart className="mx-auto text-gray-300 mb-4" size={40} />
                <h4 className="font-body text-base font-extrabold text-[#111827]">Your Wishlist is empty</h4>
                <p className="font-body text-xs text-gray-500 mt-1">
                  Save your favorite items here to enquire about them later.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Enquiries */}
        {activeTab === "enquiries" && (
          <div>
            <h3 className="font-display text-xl font-bold text-[#111827] mb-6">
              My WhatsApp Enquiries
            </h3>
            {enquiries.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-xl">
                <MessageSquare className="mx-auto text-gray-300 mb-4" size={40} />
                <h4 className="font-body text-base font-extrabold text-[#111827]">No enquiries found</h4>
                <p className="font-body text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Click on "Enquire on WhatsApp" on any product to register your enquiry.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.map((lead) => (
                  <div
                    key={lead.id}
                    className="border border-gray-100 rounded-xl p-5 bg-emerald-50/20 border-l-4 border-l-emerald-600"
                  >
                    <div className="flex items-center justify-between gap-4 pb-2 border-b border-gray-100 mb-2">
                      <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                        {lead.status}
                      </span>
                      <span className="font-body text-[11px] text-gray-400">
                        {new Date(lead.created_at).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <p className="font-body text-xs text-gray-600 italic">
                      "{lead.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Address Book */}
        {activeTab === "addresses" && (
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <h3 className="font-display text-xl font-bold text-[#111827]">
                Address Book
              </h3>
              {!showAddressForm && (
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddressForm(true);
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#1f6b3b] text-white px-3.5 py-1.5 rounded-lg font-body text-xs font-bold shadow-md hover:bg-[#1b5c32] transition-colors"
                >
                  <Plus size={14} />
                  Add Address
                </button>
              )}
            </div>

            {showAddressForm ? (
              <form onSubmit={handleSaveAddress} className="space-y-4 border border-gray-100 rounded-xl p-5 bg-gray-50/50">
                <h4 className="font-body text-sm font-extrabold text-[#111827] mb-2">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h4>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-gray-500">Contact Name</label>
                    <input
                      type="text"
                      required
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 font-body text-sm bg-white outline-none focus:border-[#1f6b3b]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-gray-500">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 font-body text-sm bg-white outline-none focus:border-[#1f6b3b]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-gray-500">Address Line 1</label>
                  <input
                    type="text"
                    required
                    value={addrLine1}
                    onChange={(e) => setAddrLine1(e.target.value)}
                    placeholder="House/Flat No, Building Name, Street"
                    className="w-full border border-gray-200 rounded-lg p-2.5 font-body text-sm bg-white outline-none focus:border-[#1f6b3b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-gray-500">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={addrLine2}
                    onChange={(e) => setAddrLine2(e.target.value)}
                    placeholder="Landmark, Area"
                    className="w-full border border-gray-200 rounded-lg p-2.5 font-body text-sm bg-white outline-none focus:border-[#1f6b3b]"
                  />
                </div>

                <div className="grid gap-4 grid-cols-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-gray-500">City</label>
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 font-body text-sm bg-white outline-none focus:border-[#1f6b3b]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-gray-500">State</label>
                    <input
                      type="text"
                      required
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 font-body text-sm bg-white outline-none focus:border-[#1f6b3b]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-gray-500">Pincode</label>
                    <input
                      type="text"
                      required
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 font-body text-sm bg-white outline-none focus:border-[#1f6b3b]"
                    />
                  </div>
                </div>

                {addrError && (
                  <p className="text-xs text-red-600 font-body font-semibold">{addrError}</p>
                )}

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressForm(false);
                      setEditingAddress(null);
                    }}
                    className="px-4 py-2 border border-gray-200 rounded-lg font-body text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 bg-[#1f6b3b] text-white px-4 py-2 rounded-lg font-body text-xs font-bold shadow-md hover:bg-[#1b5c32]"
                  >
                    {isPending && <Loader2 size={12} className="animate-spin" />}
                    Save Address
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-all flex justify-between items-start"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-body text-sm font-extrabold text-[#111827]">{addr.full_name}</p>
                        {addr.is_default && (
                          <span className="font-mono text-[8px] font-bold text-[#1f6b3b] bg-[#edf6ee] px-2 py-0.5 rounded-full uppercase">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="font-body text-xs text-gray-500 mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                      <p className="font-body text-xs text-gray-500 mt-0.5">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="font-body text-xs font-semibold text-gray-600 mt-2 flex items-center gap-1.5">
                        <Phone size={12} />
                        {addr.phone}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEditAddress(addr)}
                        className="text-xs font-bold text-gray-600 hover:text-[#1f6b3b] p-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-xs font-bold text-gray-400 hover:text-red-600 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {addresses.length === 0 && (
                  <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-xl">
                    <MapPin className="mx-auto text-gray-300 mb-4 animate-bounce" size={40} />
                    <h4 className="font-body text-base font-extrabold text-[#111827]">No addresses saved</h4>
                    <p className="font-body text-xs text-gray-500 mt-1">
                      Add a shipping address to speed up your checkout and order processes.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Account Settings */}
        {activeTab === "settings" && (
          <div>
            <h3 className="font-display text-xl font-bold text-[#111827] mb-6">
              Account Settings
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] uppercase tracking-wider text-gray-500">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 font-body text-sm bg-white outline-none focus:border-[#1f6b3b]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] uppercase tracking-wider text-gray-500">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 font-body text-sm bg-white outline-none focus:border-[#1f6b3b]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] uppercase tracking-wider text-gray-500">
                  Email Address (Unchangeable)
                </label>
                <div className="relative opacity-65">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    disabled
                    value={profile?.email || user?.email}
                    className="w-full border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 font-body text-sm bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {settingsError && (
                <p className="text-xs font-body font-semibold text-red-600">{settingsError}</p>
              )}

              {settingsSuccess && (
                <p className="text-xs font-body font-semibold text-emerald-600">Profile updated successfully!</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 bg-[#1f6b3b] text-white px-5 py-2.5 rounded-lg font-body text-xs font-bold shadow-md hover:bg-[#1b5c32] transition-colors"
              >
                {isPending && <Loader2 size={12} className="animate-spin" />}
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
