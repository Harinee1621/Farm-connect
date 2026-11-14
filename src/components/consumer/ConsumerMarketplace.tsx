import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  X,
  ChevronDown,
  RefreshCw,
  Scale,
  Award,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductDetailsModal } from './ProductDetailsModal';
import { CropCompareModal } from './CropCompareModal';

interface ConsumerMarketplaceProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenCart: () => void;
  onOpenChat: (targetUser: any, orderId?: string, cropName?: string) => void;
}

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains & Pulses',
  'Tubers & Roots',
  'Spices',
  'Oilseeds',
  'Organic Specials',
];

export const ConsumerMarketplace: React.FC<ConsumerMarketplaceProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenCart,
  onOpenChat,
}) => {
  const { products, farmers, addToCart } = useStore();

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'freshness' | 'rating'>('recommended');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Available unique districts
  const districts = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.farmerDistrict)));
    return ['All', ...list];
  }, [products]);

  // Filtering and Sorting logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search text matches crop name, farmer name, district, or category
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.cropName.toLowerCase().includes(query);
        const matchesFarmer = p.farmerName.toLowerCase().includes(query);
        const matchesDistrict = p.farmerDistrict.toLowerCase().includes(query);
        const matchesLocation = p.farmerLocation.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesFarmer && !matchesDistrict && !matchesLocation && !matchesCategory) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // District filter
      if (selectedDistrict !== 'All' && p.farmerDistrict !== selectedDistrict) {
        return false;
      }

      // Organic filter
      if (organicOnly && !p.isOrganic) {
        return false;
      }

      // In-stock filter
      if (inStockOnly && (p.availabilityStatus === 'out_of_stock' || p.availableQuantity <= 0)) {
        return false;
      }

      // Max price filter
      if (p.pricePerUnit > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePerUnit - b.pricePerUnit;
      if (sortBy === 'price_desc') return b.pricePerUnit - a.pricePerUnit;
      if (sortBy === 'freshness') return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
      if (sortBy === 'rating') return b.farmerRating - a.farmerRating;
      return 0; // recommended default
    });
  }, [products, searchQuery, selectedCategory, selectedDistrict, organicOnly, inStockOnly, maxPrice, sortBy]);

  // Quick comparison toggler
  const toggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 crops at a time.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleOpenCompareWithSimilar = (product: Product) => {
    // Automatically find other products with same category or similar crop name
    const similar = products.filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.cropName.toLowerCase().includes(product.cropName.split(' ')[0].toLowerCase()))
    ).slice(0, 3);

    setCompareList([product, ...similar]);
    setIsCompareModalOpen(true);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDistrict('All');
    setOrganicOnly(false);
    setInStockOnly(false);
    setMaxPrice(1000);
    setSortBy('recommended');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedDistrict !== 'All' ||
    organicOnly ||
    inStockOnly ||
    maxPrice < 1000;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Marketplace Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                <span>DIRECT FARMER MARKETPLACE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Discover Fresh Crops Directly From Growers
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Zero commission markups. Filter by location (Ponneri, Nashik, Mandya), organic status & compare farmers.
              </p>
            </div>

            {/* Compare Drawer Pill */}
            {compareList.length > 0 && (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border-2 border-forest-500 shadow-md animate-in fade-in slide-in-from-bottom-2">
                <Scale className="w-4 h-4 text-forest-600" />
                <span className="text-xs font-bold text-slate-800">
                  {compareList.length} crops selected to compare
                </span>
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="ml-2 px-3 py-1 bg-forest-600 hover:bg-forest-700 text-white rounded-lg text-xs font-bold transition"
                >
                  View Matrix
                </button>
                <button
                  onClick={() => setCompareList([])}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            {/* Main Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by crop (Tomato, Onion, Rice...), farmer name, or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white text-xs sm:text-sm border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3.5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-forest-500/20 shadow-xs"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="freshness">Freshest Harvest First</option>
                <option value="rating">Farmer Rating</option>
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                className={`md:hidden px-4 py-3 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition ${
                  hasActiveFilters ? 'bg-forest-600 text-white border-forest-600' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Category Horizontal Pills */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition shadow-xs ${
                  selectedCategory === cat
                    ? 'bg-forest-700 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Marketplace Grid Layout with Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Filter Sidebar (Desktop & Collapsible on Mobile) */}
          <div
            className={`md:block ${
              showFilterDrawer
                ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto block'
                : 'hidden'
            } md:static md:z-auto md:p-0 md:bg-transparent`}
          >
            {showFilterDrawer && (
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 md:hidden">
                <h3 className="text-base font-bold text-slate-900">Crop Filters</h3>
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="p-1 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-forest-600" />
                  Filter Listings
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] font-semibold text-forest-700 hover:underline"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* Location / District Filter (Section 9) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Farm District / Location
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d === 'All' ? 'All Districts / Locations' : `${d}`}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  e.g., Thiruvallur (Ponneri delta), Nashik, Mandya
                </span>
              </div>

              {/* Price Range Filter */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700">Max Price per Unit</span>
                  <span className="font-extrabold text-forest-800">Up to ₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-forest-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹20</span>
                  <span>₹500</span>
                  <span>₹1000</span>
                </div>
              </div>

              {/* Organic Toggle Filter */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">Organic Certified Only</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={organicOnly}
                    onChange={(e) => setOrganicOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500 accent-forest-600"
                  />
                </label>
              </div>

              {/* Availability Filter */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-xs font-semibold text-slate-800">In Stock Produce Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500 accent-forest-600"
                  />
                </label>
              </div>

              {/* Featured Farmers preview in sidebar (Section 8) */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Featured Local Farmers
                </h4>
                <div className="space-y-2">
                  {farmers.slice(0, 3).map((f) => (
                    <div
                      key={f.id}
                      onClick={() => {
                        setSearchQuery(f.name);
                        setShowFilterDrawer(false);
                      }}
                      className="p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-2 border border-slate-100"
                    >
                      <img
                        src={f.avatarUrl}
                        alt={f.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 truncate">{f.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{f.farmName} • {f.district}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {showFilterDrawer && (
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="w-full py-2.5 bg-forest-600 text-white rounded-xl text-xs font-bold"
                >
                  Apply Filters ({filteredProducts.length} Results)
                </button>
              )}
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="md:col-span-3">
            {/* Active filter summary pill bar */}
            {hasActiveFilters && (
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Active Filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="bg-forest-100 text-forest-800 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedDistrict !== 'All' && (
                  <span className="bg-forest-100 text-forest-800 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    District: {selectedDistrict}
                    <button onClick={() => setSelectedDistrict('All')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {organicOnly && (
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    Organic Only
                    <button onClick={() => setOrganicOnly(false)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-slate-500 hover:text-slate-800 underline text-[11px] ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results counter */}
            <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
              <span>
                Showing <strong className="text-slate-800">{filteredProducts.length}</strong> genuine
                crop listing(s)
              </span>
              <span className="text-[11px] text-slate-400">
                100% verified agricultural database
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  No crops matching your search criteria
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Try clearing some filters or searching for popular produce like "Tomato", "Rice",
                  "Onion", or "Carrot".
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-forest-600 text-white rounded-xl text-xs font-bold hover:bg-forest-700 transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={(p) => setSelectedProduct(p)}
                    onToggleCompare={(p) => toggleCompare(p)}
                    isCompared={compareList.some((c) => c.id === product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onOpenChat={onOpenChat}
        onOpenCart={onOpenCart}
        onOpenCompare={handleOpenCompareWithSimilar}
      />

      {/* Crop Compare Modal */}
      <CropCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        productsToCompare={compareList}
        onRemoveFromCompare={(id) => setCompareList((prev) => prev.filter((p) => p.id !== id))}
        onAddToCart={(prod) => {
          addToCart(prod, prod.minimumOrderQuantity || 1);
          setIsCompareModalOpen(false);
          onOpenCart();
        }}
      />
    </div>
  );
};

