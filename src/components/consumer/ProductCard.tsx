import React from 'react';
import { Product } from '../../types';
import { Star, MapPin, CheckCircle, Plus, Calendar, Layers, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
  isCompared?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onToggleCompare,
  isCompared = false,
}) => {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.minimumOrderQuantity || 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare(product);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col relative"
    >
      {/* Product Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'}
          alt={product.cropName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur text-slate-400 hover:text-red-500 hover:bg-white shadow-xs transition"
          title="Save to wishlist"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`}
          />
        </button>

        {/* Organic Badge */}
        {product.isOrganic && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-600 text-white shadow-xs">
            100% Organic
          </span>
        )}

        {/* Quality Grade Badge */}
        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 backdrop-blur text-white shadow-xs">
          {product.qualityGrade}
        </span>

        {/* Stock / Availability Status */}
        {product.availabilityStatus === 'low_stock' && (
          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-xs">
            Low Stock
          </span>
        )}
        {product.availabilityStatus === 'out_of_stock' && (
          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white shadow-xs">
            Out of Stock
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold text-forest-700 uppercase tracking-wide">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{product.farmerRating.toFixed(1)}</span>
            </div>
          </div>

          {/* Crop Name */}
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-forest-700 transition">
            {product.cropName}
          </h3>

          {/* Farmer Details */}
          <div className="mt-2 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1 font-medium text-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              <span className="truncate">{product.farmerName}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-[11px]">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{product.farmerLocation}, {product.farmerDistrict}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Harvested: {new Date(product.harvestDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 mt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xl font-extrabold text-forest-900">
                ₹{product.pricePerUnit}
              </span>
              <span className="text-xs text-slate-500 ml-1">/ {product.unit}</span>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              Available: <span className="font-semibold text-slate-800">{product.availableQuantity} {product.unit}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Compare checkbox / button */}
            {onToggleCompare && (
              <button
                type="button"
                onClick={handleCompareClick}
                className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1 ${
                  isCompared
                    ? 'bg-forest-100 border-forest-400 text-forest-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="Compare with other farmers selling this crop"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Compare</span>
              </button>
            )}

            {/* Add to Cart button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.availabilityStatus === 'out_of_stock' || product.availableQuantity <= 0}
              className="flex-1 py-2 px-3 bg-forest-600 hover:bg-forest-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

