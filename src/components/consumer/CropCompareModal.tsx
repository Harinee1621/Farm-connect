import React from 'react';
import { Product } from '../../types';
import { X, Check, Star, MapPin, Calendar, Plus, ShieldCheck, Scale } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CropCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productsToCompare: Product[];
  onRemoveFromCompare: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const CropCompareModal: React.FC<CropCompareModalProps> = ({
  isOpen,
  onClose,
  productsToCompare,
  onRemoveFromCompare,
  onAddToCart,
}) => {
  if (!isOpen || productsToCompare.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-forest-300">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Compare Farmers & Crops</h3>
              <p className="text-xs text-forest-300">
                Direct side-by-side comparison of genuine database listings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-forest-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 font-bold text-slate-400 uppercase tracking-wider w-40">
                  Feature / Crop
                </th>
                {productsToCompare.map((prod) => (
                  <th key={prod.id} className="py-3 px-4 min-w-[200px]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={prod.images[0]}
                          alt={prod.cropName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                            {prod.cropName}
                          </h4>
                          <span className="text-[10px] text-forest-700 font-semibold">
                            {prod.category}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveFromCompare(prod.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Farmer Name & District */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Farmer</td>
                {productsToCompare.map((prod) => (
                  <td key={prod.id} className="py-3 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <span>{prod.farmerName}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{prod.farmerLocation}, {prod.farmerDistrict}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price per unit */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Price per Unit</td>
                {productsToCompare.map((prod) => (
                  <td key={prod.id} className="py-3 px-4">
                    <span className="text-base font-extrabold text-forest-900">
                      ₹{prod.pricePerUnit}
                    </span>
                    <span className="text-slate-500 text-[11px] ml-1">/ {prod.unit}</span>
                  </td>
                ))}
              </tr>

              {/* Farmer Rating */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Farmer Rating</td>
                {productsToCompare.map((prod) => (
                  <td key={prod.id} className="py-3 px-4">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{prod.farmerRating.toFixed(1)} / 5.0</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Organic / Non-Organic */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Organic Status</td>
                {productsToCompare.map((prod) => (
                  <td key={prod.id} className="py-3 px-4">
                    {prod.isOrganic ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> 100% Organic
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                        Conventional Farm Cultivated
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Quality Grade */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Quality Grade</td>
                {productsToCompare.map((prod) => (
                  <td key={prod.id} className="py-3 px-4 font-medium text-slate-800">
                    {prod.qualityGrade}
                  </td>
                ))}
              </tr>

              {/* Harvest Date */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Harvest Date</td>
                {productsToCompare.map((prod) => (
                  <td key={prod.id} className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prod.harvestDate}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Available Stock */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Available Stock</td>
                {productsToCompare.map((prod) => (
                  <td key={prod.id} className="py-3 px-4">
                    <span className="font-semibold text-slate-900">
                      {prod.availableQuantity} {prod.unit}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Min Order: {prod.minimumOrderQuantity} {prod.unit}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Regional Hub Linkage */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/50">Regional Hub</td>
                {productsToCompare.map((prod) => (
                  <td key={prod.id} className="py-3 px-4 text-[11px] text-slate-600">
                    {prod.hubId === 'hub-ponneri'
                      ? 'Ponneri Collection Hub'
                      : prod.hubId === 'hub-nashik'
                      ? 'Nashik Horticulture Hub'
                      : 'Direct Farm Dispatch'}
                  </td>
                ))}
              </tr>

              {/* Action: Add to Cart */}
              <tr>
                <td className="py-4 px-4 bg-slate-50/50"></td>
                {productsToCompare.map((prod) => (
                  <td key={prod.id} className="py-4 px-4">
                    <button
                      onClick={() => onAddToCart(prod)}
                      disabled={prod.availableQuantity <= 0}
                      className="w-full py-2 px-3 bg-forest-600 hover:bg-forest-700 disabled:bg-slate-200 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

