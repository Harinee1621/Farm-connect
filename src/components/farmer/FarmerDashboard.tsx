import React, { useState } from 'react';
import {
  Wheat,
  Plus,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Star,
  Edit2,
  Trash2,
  Truck,
  Building,
  Phone,
  MessageSquare,
  AlertTriangle,
  Layers,
  Sparkles,
  MapPin,
  Calendar,
  Eye,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, Order, OrderStatus } from '../../types';
import { AddEditCropModal } from './AddEditCropModal';

interface FarmerDashboardProps {
  onOpenChat: (targetUser: any, orderId?: string, cropName?: string) => void;
  onNavigateToProfile: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onOpenChat,
  onNavigateToProfile,
}) => {
  const {
    currentUser,
    userRole,
    products,
    deleteProduct,
    updateProduct,
    orders,
    farmerAcceptOrder,
    farmerRejectOrder,
    advanceOrderStatus,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'requests' | 'products' | 'fulfillment' | 'sales'>('requests');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Rejection modal prompt
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Out of stock in current field picking');

  // Inline edit state for quick price & quantity adjustment
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [editingQtyId, setEditingQtyId] = useState<string | null>(null);
  const [tempQty, setTempQty] = useState<number>(0);

  // Filter products belonging to current farmer
  const farmerProducts = products.filter((p) => p.farmerId === currentUser?.id);
  const farmerProfile = currentUser && 'farmName' in currentUser ? currentUser : null;

  // Filter orders belonging to current farmer
  const farmerOrders = orders.filter((o) => o.farmerId === currentUser?.id);

  const pendingRequests = farmerOrders.filter((o) => o.orderStatus === 'waiting_approval');
  const acceptedOrders = farmerOrders.filter((o) => ['accepted', 'preparing', 'ready_for_pickup', 'shipped'].includes(o.orderStatus));
  const completedOrders = farmerOrders.filter((o) => o.orderStatus === 'delivered');
  const rejectedOrders = farmerOrders.filter((o) => o.orderStatus === 'rejected');

  const totalSalesRevenue = completedOrders.reduce((sum, o) => sum + o.itemTotal, 0);

  const handleAccept = (orderId: string) => {
    const res = farmerAcceptOrder(orderId);
    if (!res.success) {
      alert(res.message);
    }
  };

  const handleConfirmReject = () => {
    if (rejectingOrderId && rejectionReason.trim()) {
      farmerRejectOrder(rejectingOrderId, rejectionReason.trim());
      setRejectingOrderId(null);
      setRejectionReason('Out of stock in current field picking');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Farmer Profile Header Banner */}
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-forest-700 border-2 border-forest-500/60 flex items-center justify-center font-bold text-2xl text-white shadow-inner">
                🌾
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-white">
                    {currentUser?.name || 'Farmer Portal'}
                  </h1>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    farmerProfile?.verified
                      ? 'bg-forest-600 text-forest-100'
                      : 'bg-amber-500 text-amber-950'
                  }`}>
                    {farmerProfile?.verified ? 'Verified Grower' : 'Verification Pending'}
                  </span>
                </div>
                <p className="text-xs text-forest-200 mt-0.5">
                  {farmerProfile?.farmName} • {farmerProfile?.district}, {farmerProfile?.state}
                </p>
                <div className="flex items-center gap-3 text-xs text-forest-300 mt-2">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <strong>{farmerProfile?.rating ?? 0}</strong> Rating
                  </span>
                  <span>•</span>
                  {farmerProfile?.collectionHubAssigned && <span>Hub: {farmerProfile.collectionHubAssigned}</span>}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setProductToEdit(null);
                  setIsAddEditModalOpen(true);
                }}
                className="py-2.5 px-4 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Crop</span>
              </button>
              <button
                onClick={onNavigateToProfile}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
              >
                Farm Profile & Bank Info
              </button>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-forest-700/80">
            <div className="bg-forest-950/40 p-3.5 rounded-2xl">
              <span className="text-[10px] text-forest-300 uppercase font-bold tracking-wider block">
                Pending Approval Requests
              </span>
              <div className="text-2xl font-extrabold text-amber-300 flex items-center gap-2 mt-0.5">
                <span>{pendingRequests.length}</span>
                {pendingRequests.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 animate-pulse">
                    Action Needed
                  </span>
                )}
              </div>
            </div>

            <div className="bg-forest-950/40 p-3.5 rounded-2xl">
              <span className="text-[10px] text-forest-300 uppercase font-bold tracking-wider block">
                Active Crop Listings
              </span>
              <div className="text-2xl font-extrabold text-white mt-0.5">
                {farmerProducts.length}
              </div>
            </div>

            <div className="bg-forest-950/40 p-3.5 rounded-2xl">
              <span className="text-[10px] text-forest-300 uppercase font-bold tracking-wider block">
                Accepted / In Progress
              </span>
              <div className="text-2xl font-extrabold text-white mt-0.5">
                {acceptedOrders.length}
              </div>
            </div>

            <div className="bg-forest-950/40 p-3.5 rounded-2xl">
              <span className="text-[10px] text-forest-300 uppercase font-bold tracking-wider block">
                Completed Sales Revenue
              </span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">
                ₹{totalSalesRevenue}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1 mb-8 text-xs font-bold shadow-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'requests'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Purchase Requests ({pendingRequests.length})</span>
            {pendingRequests.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Wheat className="w-4 h-4" />
            <span>My Crops & Inventory ({farmerProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fulfillment')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'fulfillment'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Active Deliveries & Pickups ({acceptedOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sales'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <IndianRupee className="w-4 h-4" />
            <span>Sales History & Completed ({completedOrders.length})</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: INCOMING PURCHASE REQUESTS & APPROVAL WORKFLOW (Section 11) */}
        {/* ============================================================== */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Incoming Consumer Purchase Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Step 4 of Order Pipeline: Review requested crop quantities and accept or reject.
                </p>
              </div>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <CheckCircle2 className="w-12 h-12 text-forest-600 mx-auto mb-3 opacity-40" />
                <h4 className="text-sm font-bold text-slate-800">No pending purchase requests</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  You are all caught up! New purchase requests from consumers will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl border-2 border-amber-300 shadow-md p-6 relative overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 font-mono">
                            {req.orderNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                            Waiting for Your Approval
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Consumer: <strong className="text-slate-800">{req.consumerName}</strong> • Phone:{' '}
                          <a href={`tel:${req.consumerPhone}`} className="text-forest-700 underline font-medium">
                            {req.consumerPhone}
                          </a>
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-forest-900">₹{req.totalAmount}</div>
                        <div className="text-[11px] text-slate-500 capitalize">
                          {req.fulfillmentMethod === 'delivery' ? 'Farmer Delivery' : 'Farm Gate Pickup'}
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items Summary */}
                    <div className="py-4 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Requested Harvest Items
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {req.items.map((it) => (
                          <div
                            key={it.productId}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                          >
                            <img
                              src={it.image}
                              alt={it.cropName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 truncate">
                                {it.cropName}
                              </h5>
                              <div className="text-xs text-slate-600 mt-0.5">
                                Requested:{' '}
                                <strong className="text-forest-800">
                                  {it.quantity} {it.unit}
                                </strong>{' '}
                                (₹{it.pricePerUnit}/{it.unit})
                              </div>
                            </div>
                            <div className="text-xs font-bold text-slate-800">₹{it.subtotal}</div>
                          </div>
                        ))}
                      </div>

                      {req.orderNotes && (
                        <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                          <strong>Consumer note:</strong> {req.orderNotes}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: Accept / Reject */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => {
                          onOpenChat(
                            {
                              id: req.consumerId,
                              name: req.consumerName,
                              phone: req.consumerPhone,
                              role: 'consumer',
                            },
                            req.id,
                            req.items[0]?.cropName
                          );
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-forest-600" />
                        <span>Chat with Consumer</span>
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setRejectingOrderId(req.id)}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>Reject Request</span>
                        </button>

                        <button
                          onClick={() => handleAccept(req.id)}
                          className="px-6 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept Order & Confirm</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MY CROPS & INVENTORY MANAGEMENT (Section 6) */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">My Listed Crops & Inventory</h3>
                <p className="text-xs text-slate-500">
                  Update quantities, adjust prices per unit, and publish fresh field harvests.
                </p>
              </div>

              <button
                onClick={() => {
                  setProductToEdit(null);
                  setIsAddEditModalOpen(true);
                }}
                className="px-4 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Crop</span>
              </button>
            </div>

            {farmerProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Wheat className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No crops listed yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Start listing your agricultural harvest to receive direct purchase requests from local households!
                </p>
                <button
                  onClick={() => setIsAddEditModalOpen(true)}
                  className="px-4 py-2 bg-forest-600 text-white rounded-xl text-xs font-bold"
                >
                  List First Crop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmerProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-slate-100">
                        <img
                          src={p.images[0]}
                          alt={p.cropName}
                          className="w-full h-full object-cover"
                        />
                        {p.isOrganic && (
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                            Organic
                          </span>
                        )}
                        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white">
                          {p.qualityGrade}
                        </span>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-forest-700 uppercase">{p.category}</span>
                          <span className="text-slate-400">Harvest: {p.harvestDate}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{p.cropName}</h4>

                        {/* Inline Fast Price & Qty Adjustments */}
                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                          {/* Price Inline Editor */}
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Price / {p.unit}:</span>
                            {editingPriceId === p.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  className="w-16 px-1.5 py-0.5 border border-forest-500 rounded text-xs font-bold"
                                  value={tempPrice}
                                  onChange={(e) => setTempPrice(Number(e.target.value))}
                                />
                                <button
                                  onClick={() => {
                                    updateProduct(p.id, { pricePerUnit: tempPrice });
                                    setEditingPriceId(null);
                                  }}
                                  className="p-1 bg-forest-600 text-white rounded hover:bg-forest-700"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingPriceId(p.id);
                                  setTempPrice(p.pricePerUnit);
                                }}
                                className="font-bold text-forest-900 hover:underline flex items-center gap-1"
                                title="Click to quickly edit price"
                              >
                                ₹{p.pricePerUnit} <Edit2 className="w-2.5 h-2.5 text-slate-400" />
                              </button>
                            )}
                          </div>

                          {/* Quantity Inline Editor */}
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Available Stock:</span>
                            {editingQtyId === p.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  className="w-16 px-1.5 py-0.5 border border-forest-500 rounded text-xs font-bold"
                                  value={tempQty}
                                  onChange={(e) => setTempQty(Number(e.target.value))}
                                />
                                <button
                                  onClick={() => {
                                    updateProduct(p.id, {
                                      availableQuantity: tempQty,
                                      availabilityStatus: tempQty === 0 ? 'out_of_stock' : 'available',
                                    });
                                    setEditingQtyId(null);
                                  }}
                                  className="p-1 bg-forest-600 text-white rounded hover:bg-forest-700"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingQtyId(p.id);
                                  setTempQty(p.availableQuantity);
                                }}
                                className="font-bold text-slate-800 hover:underline flex items-center gap-1"
                                title="Click to update available inventory"
                              >
                                {p.availableQuantity} {p.unit} <Edit2 className="w-2.5 h-2.5 text-slate-400" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                      <button
                        onClick={() => {
                          setProductToEdit(p);
                          setIsAddEditModalOpen(true);
                        }}
                        className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Full Details</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete crop listing "${p.cropName}"?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete crop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: FULFILLMENT & DELIVERIES (Section 12 & 15) */}
        {/* ============================================================== */}
        {activeTab === 'fulfillment' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Active Orders: Fulfillment & Dispatches
              </h3>
              <p className="text-xs text-slate-500">
                Advance order status as you harvest, pack, and prepare produce for pickup or delivery.
              </p>
            </div>

            {acceptedOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No active dispatches</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Once you accept purchase requests, manage crop packaging, dispatch, and pickup notifications here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {acceptedOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 font-mono">
                            {ord.orderNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-100 text-blue-800">
                            {ord.orderStatus.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Buyer: <strong>{ord.consumerName}</strong> ({ord.consumerPhone})
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-extrabold text-forest-900">₹{ord.totalAmount}</div>
                        <div className="text-xs text-slate-500">
                          {ord.fulfillmentMethod === 'delivery'
                            ? `Deliver to: ${ord.consumerAddress}`
                            : 'Customer Farm Gate Pickup'}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="text-xs text-slate-700 flex flex-wrap gap-2">
                      {ord.items.map((it) => (
                        <span key={it.productId} className="bg-slate-100 px-3 py-1 rounded-lg">
                          <strong>{it.cropName}</strong>: {it.quantity} {it.unit}
                        </span>
                      ))}
                    </div>

                    {/* Status Advancement Workflow Buttons */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-500">
                        Update customer on current status:
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {ord.orderStatus === 'accepted' && (
                          <button
                            onClick={() =>
                              advanceOrderStatus(ord.id, 'preparing', 'Harvesting and grading fresh produce in field.')
                            }
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
                          >
                            Mark as Preparing Harvest
                          </button>
                        )}

                        {ord.orderStatus === 'preparing' && (
                          <button
                            onClick={() =>
                              advanceOrderStatus(
                                ord.id,
                                'ready_for_pickup',
                                ord.fulfillmentMethod === 'pickup'
                                  ? 'Produce packed and kept ready at Ponneri farm gate desk.'
                                  : 'Packed into crates, ready for local delivery dispatch.'
                              )
                            }
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
                          >
                            Mark Ready for {ord.fulfillmentMethod === 'pickup' ? 'Farm Pickup' : 'Dispatch'}
                          </button>
                        )}

                        {ord.orderStatus === 'ready_for_pickup' && ord.fulfillmentMethod === 'delivery' && (
                          <button
                            onClick={() =>
                              advanceOrderStatus(ord.id, 'shipped', 'Produce dispatched in local delivery vehicle.')
                            }
                            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition"
                          >
                            Mark Out for Delivery
                          </button>
                        )}

                        {(ord.orderStatus === 'ready_for_pickup' || ord.orderStatus === 'shipped') && (
                          <button
                            onClick={() =>
                              advanceOrderStatus(
                                ord.id,
                                'delivered',
                                ord.fulfillmentMethod === 'pickup'
                                  ? 'Customer successfully picked up produce at farm gate.'
                                  : 'Delivered safely to customer doorstep.'
                              )
                            }
                            className="px-4 py-1.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold transition"
                          >
                            Mark Delivered / Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: SALES HISTORY */}
        {/* ============================================================== */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Completed Sales & History</h3>
              <p className="text-xs text-slate-500">
                Audit records of fulfilled agricultural transactions with direct payments received.
              </p>
            </div>

            {completedOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <IndianRupee className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No completed orders yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Once orders are marked delivered, verified sales summaries and reviews will be logged here.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Consumer</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {completedOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {ord.consumerName}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {ord.items.map((i) => `${i.cropName} (${i.quantity}${i.unit})`).join(', ')}
                        </td>
                        <td className="py-3 px-4 capitalize text-slate-500">
                          {ord.fulfillmentMethod}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-forest-900">
                          ₹{ord.totalAmount}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(ord.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Crop Modal */}
      <AddEditCropModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        productToEdit={productToEdit}
      />

      {/* Rejection Prompt Modal */}
      {rejectingOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Reject Purchase Request</h4>
            <p className="text-xs text-slate-600 mb-3">
              Please provide a reason so the consumer understands why the order could not be fulfilled:
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 focus:outline-hidden focus:bg-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingOrderId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
