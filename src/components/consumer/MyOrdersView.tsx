import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building,
  Phone,
  MessageSquare,
  Star,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  XCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

interface MyOrdersViewProps {
  onOpenChat: (targetUser: any, orderId?: string, cropName?: string) => void;
  onOpenReview: (order: Order) => void;
  onBrowseCrops: () => void;
}

const ORDER_STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  {
    status: 'waiting_approval',
    label: 'Waiting for Approval',
    desc: 'Purchase request sent. Farmer reviewing stock.',
  },
  {
    status: 'accepted',
    label: 'Order Confirmed',
    desc: 'Farmer accepted request. Official confirmation issued!',
  },
  {
    status: 'preparing',
    label: 'Harvesting & Packing',
    desc: 'Farmer sorting produce at field.',
  },
  {
    status: 'ready_for_pickup',
    label: 'Ready for Pickup / Dispatch',
    desc: 'Packed and ready for pickup or dispatch.',
  },
  {
    status: 'shipped',
    label: 'In Transit',
    desc: 'Out for delivery to your address.',
  },
  {
    status: 'delivered',
    label: 'Delivered / Completed',
    desc: 'Produce safely received.',
  },
];

export const MyOrdersView: React.FC<MyOrdersViewProps> = ({
  onOpenChat,
  onOpenReview,
  onBrowseCrops,
}) => {
  const { currentUser, userRole, orders, cancelOrder } = useStore();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'delivered' | 'cancelled'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const consumerOrders = orders.filter((o) => o.consumerId === currentUser?.id);

  const filteredOrders = consumerOrders.filter((order) => {
    if (filterStatus === 'pending') return order.orderStatus === 'waiting_approval';
    if (filterStatus === 'active')
      return ['accepted', 'preparing', 'ready_for_pickup', 'shipped'].includes(order.orderStatus);
    if (filterStatus === 'delivered') return order.orderStatus === 'delivered';
    if (filterStatus === 'cancelled') return ['rejected', 'cancelled'].includes(order.orderStatus);
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'waiting_approval':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            Waiting for Farmer Approval
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Accepted (Confirmed)
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Package className="w-3.5 h-3.5" />
            Preparing Fresh Harvest
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            <Building className="w-3.5 h-3.5" />
            Ready for Pickup / Dispatch
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <Truck className="w-3.5 h-3.5" />
            Out for Delivery
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-forest-100 text-forest-800 border border-forest-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
            Delivered & Completed
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3.5 h-3.5" />
            Rejected by Farmer
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getStepProgressIndex = (status: OrderStatus) => {
    switch (status) {
      case 'waiting_approval':
        return 0;
      case 'accepted':
        return 1;
      case 'preparing':
        return 2;
      case 'ready_for_pickup':
        return 3;
      case 'shipped':
        return 4;
      case 'delivered':
        return 5;
      default:
        return -1;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Orders & Live Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Direct transparency: Track purchase approval and farm-gate dispatch in real time.
            </p>
          </div>

          <button
            onClick={onBrowseCrops}
            className="px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Browse More Crops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1 mb-6 text-xs font-bold shadow-xs overflow-x-auto">
          {[
            { id: 'all', label: `All Orders (${consumerOrders.length})` },
            {
              id: 'pending',
              label: `Waiting Approval (${consumerOrders.filter((o) => o.orderStatus === 'waiting_approval').length})`,
            },
            {
              id: 'active',
              label: `Active (${consumerOrders.filter((o) => ['accepted', 'preparing', 'ready_for_pickup', 'shipped'].includes(o.orderStatus)).length})`,
            },
            {
              id: 'delivered',
              label: `Delivered (${consumerOrders.filter((o) => o.orderStatus === 'delivered').length})`,
            },
            {
              id: 'cancelled',
              label: `Rejected / Cancelled (${consumerOrders.filter((o) => ['rejected', 'cancelled'].includes(o.orderStatus)).length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No orders found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              You haven't placed any orders in this category yet. Support local farmers and get
              harvest-fresh produce delivered!
            </p>
            <button
              onClick={onBrowseCrops}
              className="px-4 py-2 bg-forest-600 text-white rounded-xl text-xs font-bold hover:bg-forest-700 transition"
            >
              Explore Fresh Produce
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const stepIndex = getStepProgressIndex(order.orderStatus);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden"
                >
                  {/* Order Top Summary Bar */}
                  <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-xs">
                        🌾
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 font-mono">
                            {order.orderNumber}
                          </span>
                          {getStatusBadge(order.orderStatus)}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>Farmer: <strong>{order.farmerName}</strong> ({order.farmerDistrict})</span>
                          <span>•</span>
                          <span>{new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-base font-extrabold text-forest-900">
                          ₹{order.totalAmount}
                        </div>
                        <div className="text-[10px] text-slate-500 capitalize">
                          {order.fulfillmentMethod === 'delivery' ? 'Farmer Delivery' : 'Farm Pickup'} •{' '}
                          {order.paymentMethod === 'upi_online' ? 'Online Paid' : 'Cash on Delivery'}
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Crucial Order Approval Workflow Alert Banner for Waiting Status */}
                  {order.orderStatus === 'waiting_approval' && (
                    <div className="bg-amber-50 px-5 py-3 border-b border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-spin" />
                      <div>
                        <span className="font-bold">Status: Waiting for Farmer Approval</span>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          Farmer {order.farmerName} has received your purchase request. Official confirmation
                          will be confirmed only once the farmer checks physical crop inventory and clicks "Accept Order".
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Rejection / Cancellation Notice */}
                  {order.orderStatus === 'rejected' && (
                    <div className="bg-red-50 px-5 py-3 border-b border-red-200 flex items-start gap-2 text-xs text-red-900">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Purchase Request Rejected:</span> {order.rejectionReason || 'Crop currently unavailable or field harvest issue.'}
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <img
                            src={item.image}
                            alt={item.cropName}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-800 truncate">
                              {item.cropName}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              {item.quantity} {item.unit} × ₹{item.pricePerUnit} = ₹{item.subtotal}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* INTERACTIVE ORDER TRACKING TIMELINE (Section 12) */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-forest-600" />
                        Order Tracking Timeline
                      </h4>

                      {/* Visual Stepper */}
                      {['rejected', 'cancelled'].includes(order.orderStatus) ? (
                        <div className="p-4 bg-slate-100 rounded-2xl text-xs text-slate-600 text-center font-medium">
                          This order was {order.orderStatus}. Tracking is concluded.
                        </div>
                      ) : (
                        <div className="relative">
                          {/* Stepper Bar for Desktop */}
                          <div className="hidden sm:grid grid-cols-6 gap-2 text-center relative mb-4">
                            {ORDER_STATUS_STEPS.map((s, idx) => {
                              const isCompleted = stepIndex >= idx;
                              const isCurrent = stepIndex === idx;

                              return (
                                <div key={s.status} className="flex flex-col items-center">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 z-10 transition ${
                                      isCompleted
                                        ? 'bg-forest-600 text-white'
                                        : 'bg-slate-200 text-slate-500'
                                    } ${isCurrent ? 'ring-4 ring-forest-500/20 animate-pulse' : ''}`}
                                  >
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                  </div>
                                  <span
                                    className={`text-[11px] font-bold ${
                                      isCurrent
                                        ? 'text-forest-900'
                                        : isCompleted
                                        ? 'text-slate-800'
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    {s.label}
                                  </span>
                                  <span className="text-[9px] text-slate-400 leading-tight mt-0.5 hidden md:block">
                                    {s.desc}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Detailed Tracking Events Log */}
                      <div className="mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Verified Audit Trail
                        </span>
                        {order.trackingHistory.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-forest-600 mt-1.5 shrink-0" />
                            <div className="flex-1">
                              <span className="text-slate-800 font-medium">{step.note}</span>
                              <span className="text-[10px] text-slate-400 ml-2">
                                {new Date(step.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar (Contact Farmer, Review, Cancel) */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {/* In-app Message to Farmer */}
                        <button
                          onClick={() => {
                            onOpenChat(
                              {
                                id: order.farmerId,
                                name: order.farmerName,
                                phone: order.farmerPhone,
                                role: 'farmer',
                                location: order.farmerLocation,
                              },
                              order.id,
                              order.items[0]?.cropName
                            );
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-forest-600" />
                          <span>Chat with Farmer</span>
                        </button>

                        {/* Call Farmer */}
                        {order.farmerPhone && (
                          <a
                            href={`tel:${order.farmerPhone}`}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                          >
                            <Phone className="w-3.5 h-3.5 text-forest-600" />
                            <span>Call Farmer</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Review button if delivered (Section 17) */}
                        {order.orderStatus === 'delivered' && !order.hasRated && (
                          <button
                            onClick={() => onOpenReview(order)}
                            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>Rate & Review Produce</span>
                          </button>
                        )}
                        {order.hasRated && (
                          <span className="text-xs text-forest-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
                          </span>
                        )}

                        {/* Cancel button if waiting approval */}
                        {['waiting_approval', 'accepted'].includes(order.orderStatus) && (
                          <button
                            onClick={() => {
                              if (confirm('Cancel this order request?')) {
                                cancelOrder(order.id, 'Cancelled by consumer request');
                              }
                            }}
                            className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1"
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

