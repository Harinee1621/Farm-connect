import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Truck,
  Building,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  ShieldCheck,
  ArrowRight,
  Info,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ConsumerProfile } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (orderIds: string[]) => void;
  onOpenAuthModal: (role: 'consumer') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderPlaced,
  onOpenAuthModal,
}) => {
  const {
    cart,
    updateCartQuantity,
    updateCartFulfillment,
    removeFromCart,
    clearCart,
    placeOrder,
    currentUser,
    userRole,
    farmers,
  } = useStore();

  const [fulfillmentMethod, setFulfillmentMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi_online'>('cash');
  const [orderNotes, setOrderNotes] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const consumer = currentUser as ConsumerProfile;
  const isConsumerLoggedIn = userRole === 'consumer' && consumer;

  // Group items by farmer (Requirement 11: Support multiple farmers in a single cart)
  const groupedByFarmer = cart.reduce((acc, item) => {
    const fId = item.product.farmerId;
    if (!acc[fId]) {
      acc[fId] = [];
    }
    acc[fId].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  const farmerCount = Object.keys(groupedByFarmer).length;

  const itemTotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.product.pricePerUnit,
    0
  );

  // Delivery charge is flat ₹50 per farmer if delivery chosen
  const deliveryCharge = fulfillmentMethod === 'delivery' ? 50 * farmerCount : 0;
  const grandTotal = itemTotal + deliveryCharge;

  const handleCheckout = () => {
    setErrorMessage('');

    if (!isConsumerLoggedIn) {
      onOpenAuthModal('consumer');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    const result = placeOrder({
      fulfillmentMethod,
      paymentMethod,
      orderNotes: orderNotes.trim(),
      consumerAddressOverride: customAddress.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      onClose();
      onOrderPlaced(result.orderIds);
    } else {
      setErrorMessage(result.message || 'Failed to place order.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col">
          {/* Cart Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Fresh Cart</h3>
              <p className="text-xs text-slate-500">
                {cart.length} item(s) from {farmerCount} local farm(s)
              </p>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-2xl">
                  🛒
                </div>
                <h4 className="text-sm font-bold text-slate-700">Your cart is empty</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Browse fresh seasonal vegetables, grains, fruits, and millets listed directly by local farmers!
                </p>
              </div>
            ) : (
              <>
                {/* Multi-farmer notice (Section 11) */}
                {farmerCount > 1 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Multi-Farmer Order Request:</span> Your cart contains
                      produce from <strong>{farmerCount} separate farmers</strong>. Farm Connect will automatically create individual purchase requests for each farmer to review and approve!
                    </div>
                  </div>
                )}

                {/* Items grouped by farmer */}
                <div className="space-y-5">
                  {Object.entries(groupedByFarmer).map(([farmerId, items]) => {
                    const farmer = farmers.find((f) => f.id === farmerId);
                    const farmerName = farmer?.name || items[0]?.product.farmerName;
                    const farmerLoc = farmer?.farmLocation || items[0]?.product.farmerLocation;

                    return (
                      <div
                        key={farmerId}
                        className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">
                              🌾 {farmerName}
                            </span>
                            <span className="text-[10px] text-slate-500">({farmerLoc})</span>
                          </div>
                          <span className="text-[10px] font-bold text-forest-700 bg-forest-100 px-2 py-0.5 rounded-full">
                            Direct Request
                          </span>
                        </div>

                        {items.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-100"
                          >
                            <img
                              src={item.product.images[0]}
                              alt={item.product.cropName}
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 truncate">
                                {item.product.cropName}
                              </h5>
                              <div className="text-[11px] text-slate-500">
                                ₹{item.product.pricePerUnit} / {item.product.unit}
                              </div>
                              <div className="text-xs font-extrabold text-forest-800 mt-0.5">
                                ₹{item.quantity * item.product.pricePerUnit}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Qty changer */}
                              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateCartQuantity(item.product.id, item.quantity - 1)
                                  }
                                  className="p-1 hover:bg-slate-200 text-slate-600"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 text-xs font-bold text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateCartQuantity(
                                      item.product.id,
                                      Math.min(item.product.availableQuantity, item.quantity + 1)
                                    )
                                  }
                                  className="p-1 hover:bg-slate-200 text-slate-600"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-slate-400 hover:text-red-500 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Fulfillment Method Selector (Section 10 & 15) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Select Fulfillment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFulfillmentMethod('delivery')}
                      className={`p-3 rounded-xl border text-left transition ${
                        fulfillmentMethod === 'delivery'
                          ? 'border-forest-600 bg-forest-50 text-forest-900 ring-1 ring-forest-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <Truck className="w-4 h-4 text-forest-600" />
                        <span>Farmer Delivery</span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Delivered directly by farmer to your home address (+₹50 delivery charge)
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillmentMethod('pickup')}
                      className={`p-3 rounded-xl border text-left transition ${
                        fulfillmentMethod === 'pickup'
                          ? 'border-forest-600 bg-forest-50 text-forest-900 ring-1 ring-forest-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <Building className="w-4 h-4 text-forest-600" />
                        <span>Consumer Farm Pickup</span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Pick up crops at farmer's farm gate in Ponneri/district (₹0 Fee)
                      </p>
                    </button>
                  </div>
                </div>

                {/* Delivery Address Details */}
                {fulfillmentMethod === 'delivery' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                      Delivery Address
                    </label>
                    {isConsumerLoggedIn ? (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-forest-600" />
                          <span>{consumer.name} ({consumer.phone})</span>
                        </div>
                        <p className="text-slate-600 mt-1">
                          {consumer.address}, {consumer.city || consumer.district}, {consumer.state} - {consumer.pinCode}
                        </p>
                        <input
                          type="text"
                          placeholder="Override address or add landmarks if different..."
                          value={customAddress}
                          onChange={(e) => setCustomAddress(e.target.value)}
                          className="mt-2 w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
                        />
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                        Please sign in as a consumer to autofill your delivery address and receive status notifications.
                      </div>
                    )}
                  </div>
                )}

                {/* Payment Selection (Section 16) */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-3 rounded-xl border text-left transition ${
                        paymentMethod === 'cash'
                          ? 'border-forest-600 bg-forest-50 text-forest-900 ring-1 ring-forest-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Banknote className="w-4 h-4 text-forest-600" />
                        <span>Pay on Delivery / Pickup</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Cash or UPI upon receiving fresh crops
                      </p>
                    </button>

                    <button
                      type="button"
                      disabled
                      aria-describedby="online-payment-unavailable"
                      className="p-3 rounded-xl border border-slate-200 text-left text-slate-400 bg-slate-50 cursor-not-allowed"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        <span>Online Payment</span>
                      </div>
                      <p id="online-payment-unavailable" className="text-[10px] text-slate-500 mt-0.5">
                        Unavailable until a payment provider is configured
                      </p>
                    </button>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Order Notes / Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please deliver before 10 AM, use eco-friendly packing"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer & Order Placement */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              {/* Order Cost Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Produce Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{itemTotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>
                    Delivery Charge ({fulfillmentMethod === 'delivery' ? `${farmerCount} farm(s)` : 'Farm Gate Pickup'})
                  </span>
                  <span className="font-semibold text-slate-800">
                    {deliveryCharge > 0 ? `₹${deliveryCharge}` : 'FREE (Pickup)'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-forest-900 text-base">₹{grandTotal}</span>
                </div>
              </div>

              {/* Crucial Order Approval Workflow Notice */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-snug">
                ⚠️ <strong>Approval Workflow:</strong> Clicking "Place Order Request" sends a
                purchase request to the farmer. Your initial status will be{' '}
                <strong>"Waiting for Farmer Approval"</strong>. Official confirmation will only be
                issued after the farmer accepts!
              </div>

              {/* Place Order Request Button */}
              {isConsumerLoggedIn ? (
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-forest-600 hover:bg-forest-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Submitting Request...' : 'Place Purchase Request (Waiting Approval)'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('consumer')}
                  className="w-full py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Sign In as Consumer to Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
