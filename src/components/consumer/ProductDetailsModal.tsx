import React, { useState } from 'react';
import { Product } from '../../types';
import {
  X,
  Star,
  MapPin,
  ShieldCheck,
  Calendar,
  Truck,
  Building,
  Plus,
  Minus,
  MessageSquare,
  Phone,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: (targetUser: any, orderId?: string, cropName?: string) => void;
  onOpenCart: () => void;
  onOpenCompare?: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  onOpenChat,
  onOpenCart,
  onOpenCompare,
}) => {
  const { addToCart, reviews, farmers } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');

  if (!isOpen || !product) return null;

  const farmer = farmers.find((f) => f.id === product.farmerId);
  const productReviews = reviews.filter((r) => r.productId === product.id || r.farmerId === product.farmerId);

  const minQty = product.minimumOrderQuantity || 1;
  const maxQty = product.availableQuantity || 1;

  const handleAddToCart = () => {
    addToCart(product, qty, fulfillment);
  };

  const handleBuyNow = () => {
    addToCart(product, qty, fulfillment);
    onClose();
    onOpenCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800 uppercase tracking-wide">
              {product.category}
            </span>
            {product.isOrganic && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                100% Organic Certified
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-200 text-slate-800">
              {product.qualityGrade}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Images */}
            <div>
              <div className="h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-3 shadow-inner">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.cropName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                        selectedImageIndex === idx ? 'border-forest-600 ring-2 ring-forest-600/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Farmer Info Card */}
              <div className="mt-6 p-4 rounded-2xl bg-forest-50/70 border border-forest-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    {farmer?.avatarUrl ? (
                      <img
                        src={farmer.avatarUrl}
                        alt={product.farmerName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-forest-600"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-forest-600 text-white font-bold flex items-center justify-center text-sm">
                        {product.farmerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1 font-bold text-xs text-slate-900">
                        <span>{product.farmerName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                      </div>
                      <p className="text-[11px] text-slate-500">{farmer?.farmName || product.farmerLocation}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{farmer?.rating || product.farmerRating}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      ({farmer?.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {farmer?.bio || 'Dedicated local farmer cultivating authentic native produce.'}
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-forest-200/60">
                  <button
                    onClick={() => {
                      onOpenChat(
                        {
                          id: product.farmerId,
                          name: product.farmerName,
                          phone: product.farmerPhone,
                          role: 'farmer',
                          farmName: farmer?.farmName,
                          location: product.farmerLocation,
                        },
                        undefined,
                        product.cropName
                      );
                    }}
                    className="flex-1 py-1.5 px-3 bg-white hover:bg-forest-100 text-forest-800 border border-forest-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-forest-600" />
                    <span>In-App Message</span>
                  </button>

                  {product.farmerPhone && (
                    <a
                      href={`tel:${product.farmerPhone}`}
                      className="py-1.5 px-3 bg-white hover:bg-forest-100 text-forest-800 border border-forest-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                      title="Direct phone call with farmer"
                    >
                      <Phone className="w-3.5 h-3.5 text-forest-600" />
                      <span>Call</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Details & Order Controls */}
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {product.cropName}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {product.farmerLocation}, {product.farmerDistrict}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Harvest: {product.harvestDate}
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Farm Gate Price</div>
                  <div className="text-2xl font-black text-forest-900">
                    ₹{product.pricePerUnit}
                    <span className="text-xs font-semibold text-slate-500 ml-1">/ {product.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-medium">Available Quantity</div>
                  <div className="text-base font-bold text-slate-800">
                    {product.availableQuantity} {product.unit}
                  </div>
                  <div className="text-[10px] text-slate-400">Min Order: {minQty} {product.unit}</div>
                </div>
              </div>

              {/* Crop Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Produce Description
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  {product.description || 'Fresh agricultural produce harvested with care and zero chemical ripening.'}
                </p>
              </div>

              {/* Fulfillment Method Selection (Section 10 & 15) */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Preferred Fulfillment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFulfillment('delivery')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      fulfillment === 'delivery'
                        ? 'border-forest-600 bg-forest-50/70 text-forest-900 ring-1 ring-forest-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Truck className="w-4 h-4 text-forest-600" />
                      <span className="text-[10px] font-bold text-forest-700 bg-forest-100 px-1.5 py-0.5 rounded">
                        Standard
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold">Farmer Delivery</div>
                      <div className="text-[10px] text-slate-500">Delivered directly to your doorstep</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillment('pickup')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      fulfillment === 'pickup'
                        ? 'border-forest-600 bg-forest-50/70 text-forest-900 ring-1 ring-forest-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Building className="w-4 h-4 text-forest-600" />
                      <span className="text-[10px] font-bold text-forest-700 bg-forest-100 px-1.5 py-0.5 rounded">
                        Zero Fee
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold">Farm Gate Pickup</div>
                      <div className="text-[10px] text-slate-500">Collect at farmer's Ponneri/local farm</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quantity Picker & Pricing Subtotal */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Quantity:</span>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => setQty((prev) => Math.max(minQty, prev - 1))}
                        disabled={qty <= minQty}
                        className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-800">
                        {qty} {product.unit}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty((prev) => Math.min(maxQty, prev + 1))}
                        disabled={qty >= maxQty}
                        className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Est. Subtotal</span>
                    <span className="text-lg font-black text-forest-900">
                      ₹{qty * product.pricePerUnit}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.availableQuantity <= 0}
                    className="flex-1 py-3 px-4 bg-forest-50 hover:bg-forest-100 border border-forest-300 text-forest-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.availableQuantity <= 0}
                    className="flex-1 py-3 px-4 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <span>Request Purchase Now</span>
                  </button>
                </div>

                {onOpenCompare && (
                  <button
                    type="button"
                    onClick={() => onOpenCompare(product)}
                    className="w-full mt-2 py-2 text-center text-xs font-semibold text-slate-600 hover:text-forest-700 transition flex items-center justify-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Compare with other farmers selling {product.cropName}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Verified Customer Reviews Section (Section 17) */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Verified Purchase Reviews</span>
                  <span className="text-xs font-medium text-slate-400">
                    ({productReviews.length})
                  </span>
                </h4>
                <p className="text-xs text-slate-500">
                  Reviews left by consumers after verified order delivery
                </p>
              </div>
            </div>

            {productReviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">
                No reviews yet for this harvest. Be the first to order and review!
              </p>
            ) : (
              <div className="space-y-3">
                {productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-800">{rev.consumerName}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block mt-2">
                      {new Date(rev.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

