import React, { useState, useEffect } from 'react';
import { X, Sprout, Plus, Trash2, Calendar, IndianRupee, Layers } from 'lucide-react';
import { Product, ProductCategory, ProductUnit, QualityGrade, AvailabilityStatus } from '../../types';
import { useStore } from '../../context/StoreContext';

interface AddEditCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const CATEGORIES: ProductCategory[] = [
  'Vegetables',
  'Fruits',
  'Grains & Pulses',
  'Tubers & Roots',
  'Spices',
  'Oilseeds',
  'Dairy & Poultry',
  'Organic Specials',
];

const UNITS: ProductUnit[] = ['kg', 'quintal', 'ton', 'bunch', 'crate', 'box'];

const QUALITY_GRADES: QualityGrade[] = [
  'Grade A (Export)',
  'Grade A (Premium)',
  'Grade B (Standard)',
  'Organic Certified',
];

export const AddEditCropModal: React.FC<AddEditCropModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, currentUser } = useStore();

  const [cropName, setCropName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Vegetables');
  const [imageUrl, setImageUrl] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState<number>(100);
  const [unit, setUnit] = useState<ProductUnit>('kg');
  const [pricePerUnit, setPricePerUnit] = useState<number>(40);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A (Premium)');
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isOrganic, setIsOrganic] = useState<boolean>(true);
  const [description, setDescription] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('available');
  const [minOrderQty, setMinOrderQty] = useState<number>(1);

  useEffect(() => {
    if (productToEdit) {
      setCropName(productToEdit.cropName);
      setCategory(productToEdit.category);
      setImageUrl(productToEdit.images[0] || '');
      setAvailableQuantity(productToEdit.availableQuantity);
      setUnit(productToEdit.unit);
      setPricePerUnit(productToEdit.pricePerUnit);
      setQualityGrade(productToEdit.qualityGrade);
      setHarvestDate(productToEdit.harvestDate);
      setIsOrganic(productToEdit.isOrganic);
      setDescription(productToEdit.description);
      setAvailabilityStatus(productToEdit.availabilityStatus);
      setMinOrderQty(productToEdit.minimumOrderQuantity || 1);
    } else {
      setCropName('');
      setCategory('Vegetables');
      setImageUrl('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600');
      setAvailableQuantity(200);
      setUnit('kg');
      setPricePerUnit(35);
      setQualityGrade('Grade A (Premium)');
      setHarvestDate(new Date().toISOString().split('T')[0]);
      setIsOrganic(true);
      setDescription('');
      setAvailabilityStatus('available');
      setMinOrderQty(2);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const defaultImages = [
      imageUrl.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    ];

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        cropName,
        category,
        images: defaultImages,
        availableQuantity,
        unit,
        pricePerUnit,
        qualityGrade,
        harvestDate,
        isOrganic,
        description,
        availabilityStatus,
        minimumOrderQuantity: minOrderQty,
      });
    } else {
      addProduct({
        farmerId: currentUser.id,
        farmerName: currentUser.name,
        farmerLocation: (currentUser as any).farmLocation || 'Farm Estate',
        farmerDistrict: (currentUser as any).district || 'Thiruvallur',
        farmerState: (currentUser as any).state || 'Tamil Nadu',
        farmerPhone: (currentUser as any).phone || '',
        cropName,
        category,
        images: defaultImages,
        availableQuantity,
        unit,
        pricePerUnit,
        qualityGrade,
        harvestDate,
        isOrganic,
        description,
        availabilityStatus,
        minimumOrderQuantity: minOrderQty,
        hubId: (currentUser as any).collectionHubAssigned?.includes('Ponneri') ? 'hub-ponneri' : undefined,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="p-5 bg-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-forest-300">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {productToEdit ? 'Edit Agricultural Crop' : 'List New Agricultural Crop'}
              </h3>
              <p className="text-xs text-forest-300">
                Direct listing on the Farm Connect transparent marketplace
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Crop Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Country Tomatoes (Nattu Thakkali)"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Product Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Price per Unit (₹) *</label>
              <input
                type="number"
                min="1"
                step="0.5"
                required
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Measuring Unit *</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Available Quantity *</label>
              <input
                type="number"
                min="0"
                required
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Minimum Order Qty</label>
              <input
                type="number"
                min="1"
                value={minOrderQty}
                onChange={(e) => setMinOrderQty(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quality / Grade *</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              >
                {QUALITY_GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Harvest Date *</label>
              <input
                type="date"
                required
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Crop Image URL (High Resolution)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
            {imageUrl && (
              <div className="mt-2 h-24 w-24 rounded-xl overflow-hidden border border-slate-200">
                <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Availability Status</label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              >
                <option value="available">Available in Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-600 accent-forest-600 focus:ring-forest-500"
                />
                <span className="font-bold text-slate-800">100% Organic / Zero Pesticides</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Produce Description</label>
            <textarea
              rows={3}
              placeholder="Describe aroma, soil conditions, variety details, packaging details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-forest-600 hover:bg-forest-700 text-white font-bold rounded-xl shadow-xs transition"
            >
              {productToEdit ? 'Save Changes' : 'Publish Crop Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
