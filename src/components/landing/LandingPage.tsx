import React from 'react';
import {
  Sprout,
  ShoppingCart,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Scale,
  Building2,
  ChevronRight,
  HeartHandshake,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
  openAuthModal: (role: 'farmer' | 'consumer') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setCurrentTab,
  openAuthModal,
}) => {
  const { products, farmers, userRole } = useStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* ============================================================== */}
      {/* HERO SECTION */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-950 via-forest-900 to-forest-800 text-white pt-16 pb-24 lg:pt-20 lg:pb-32">
        {/* Subtle patterned background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800/80 border border-forest-600/50 text-forest-200 text-xs font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-top-4 duration-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>India's Direct Agricultural Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none mb-6">
              Fresh From Farm To Fork.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-300 via-forest-400 to-amber-300">
                Zero Middlemen.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-forest-100 font-normal leading-relaxed max-w-2xl mx-auto">
              Connecting local farmers directly with household consumers. Direct purchase requests,
              fair remunerative pricing for growers, and harvest-fresh quality for families.
            </p>
          </div>

          {/* ============================================================== */}
          {/* PROMINENT ROLE SELECTION CARDS (Section 3) */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {/* Farmer Card */}
            <div className="relative group bg-white/95 text-slate-900 rounded-3xl p-8 shadow-2xl border-2 border-forest-400/40 hover:border-forest-500 transition-all duration-200 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 transition-transform">
                <Sprout className="w-8 h-8 text-forest-700" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-forest-100 text-forest-800 mb-2 uppercase tracking-wide">
                Role 1: Agricultural Producers
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                I am a Farmer
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                List your agricultural crops, set your own fair prices per kg/quintal, receive direct purchase
                requests, and sell with complete transparency and zero commission markups.
              </p>

              <ul className="space-y-2 mb-8 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                  <span>Direct purchase requests with Accept / Reject control</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                  <span>Manage available stock, harvest dates & quality grades</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                  <span>Choose farm gate pickup or farmer local delivery</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => openAuthModal('farmer')}
                  className="flex-1 py-3 px-5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>Register as Farmer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (userRole === 'farmer') {
                      setCurrentTab('farmer-dashboard');
                    } else {
                      openAuthModal('farmer');
                    }
                  }}
                  className="py-3 px-4 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 font-bold text-xs border border-forest-200 transition text-center"
                >
                  Farmer Portal
                </button>
              </div>
            </div>

            {/* Consumer Card */}
            <div className="relative group bg-white/95 text-slate-900 rounded-3xl p-8 shadow-2xl border-2 border-forest-400/40 hover:border-forest-500 transition-all duration-200 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-8 h-8 text-amber-700" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-2 uppercase tracking-wide">
                Role 2: Household & Bulk Buyers
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                I am a Consumer
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Discover genuine farm-fresh produce, compare farmers selling the same crop,
                view exact harvest dates, place purchase requests, and track your orders end-to-end.
              </p>

              <ul className="space-y-2 mb-8 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Compare farmers by price, location, quality & harvest date</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Support multiple farmers in a single cart</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Live order tracking from farmer approval to doorstep</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => openAuthModal('consumer')}
                  className="flex-1 py-3 px-5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>Register as Consumer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (userRole === 'consumer') {
                      setCurrentTab('marketplace');
                    } else {
                      openAuthModal('consumer');
                    }
                  }}
                  className="py-3 px-4 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 font-bold text-xs border border-forest-200 transition text-center"
                >
                  Browse Crops
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-forest-800/80 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest-200">{farmers.length}+</div>
              <div className="text-xs text-forest-300">Registered Local Farmers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest-200">{products.length}+</div>
              <div className="text-xs text-forest-300">Live Crop Listings</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest-200">0%</div>
              <div className="text-xs text-forest-300">Intermediary Markup</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest-200">24-48h</div>
              <div className="text-xs text-forest-300">Harvest-to-Door Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* HOW THE DIRECT PIPELINE WORKS (Section 11 Highlight) */}
      {/* ============================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-forest-600 uppercase tracking-wider">
              Transparent Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1 mb-4">
              How Farm Connect Operates
            </h2>
            <p className="text-sm text-slate-600">
              Unlike ordinary grocery delivery apps that source from middlemen warehouses, Farm Connect
              operates an authentic, farmer-empowered purchase request approval pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-forest-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                01
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Search & Compare</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consumer searches crops like Tomato or Ponni Rice, comparing registered farmers side-by-side
                on price, organic certification, and harvest dates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-forest-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                02
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Send Purchase Request</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consumer submits order request. Status is strictly set to <strong>"Waiting for Farmer Approval"</strong>.
                No premature confirmation until the farmer confirms stock.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-forest-50 p-6 rounded-2xl border-2 border-forest-300 relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-forest-700 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                03
              </div>
              <h4 className="text-base font-bold text-forest-950 mb-2">Farmer Reviews & Accepts</h4>
              <p className="text-xs text-forest-800 leading-relaxed">
                Farmer reviews order details, checks crop readiness, and chooses to <strong>Accept</strong> or Reject.
                Only upon acceptance is official confirmation issued!
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-forest-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                04
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Harvest & Fulfill</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Farmer prepares fresh harvest for local delivery or farm gate pickup. Real-time timeline
                updates keep the consumer informed at every step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FEATURED CROPS PREVIEW */}
      {/* ============================================================== */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-forest-600 uppercase tracking-wider">
                Harvest Season Produce
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                Featured Crops From Local Farmers
              </h2>
            </div>
            <button
              onClick={() => setCurrentTab('marketplace')}
              className="text-xs font-bold text-forest-700 hover:text-forest-800 flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>Explore All {products.length} Crops</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => setCurrentTab('marketplace')}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={p.images[0]}
                    alt={p.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {p.isOrganic && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                      Organic
                    </span>
                  )}
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur text-slate-800 shadow-xs">
                    {p.qualityGrade.split(' ')[0]}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-forest-600 uppercase tracking-wide">
                      {p.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                      {p.cropName}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{p.farmerName} • {p.farmerDistrict}</span>
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-base font-extrabold text-forest-900">
                        ₹{p.pricePerUnit} <span className="text-xs font-normal text-slate-500">/ {p.unit}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Stock: {p.availableQuantity} {p.unit}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-forest-600 group-hover:underline">
                      View Crop →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FUTURE EXPANSION: REGIONAL COLLECTION HUBS SPOTLIGHT */}
      {/* ============================================================== */}
      <section className="py-20 bg-forest-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800 text-forest-300 text-xs font-bold mb-4">
                <Building2 className="w-3.5 h-3.5" />
                <span>Future Expansion Architecture • Module 19</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                Regional Agricultural Collection Centres
              </h2>
              <p className="text-sm text-forest-100 leading-relaxed mb-6">
                Farm Connect is engineered to scale from individual farm dispatches to centralized
                regional consolidation centres. Discover our flagship blueprint: <strong>Ponneri Collection Hub</strong> in Thiruvallur District.
              </p>

              <div className="space-y-3 mb-8 text-xs text-forest-200">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-400 shrink-0 mt-0.5" />
                  <span>Farmers from Ponneri & surrounding villages consolidate produce at a single point</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-400 shrink-0 mt-0.5" />
                  <span>Quality inspection, moisture grading, and standardized eco-sorting & packaging</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-400 shrink-0 mt-0.5" />
                  <span>Direct distribution network connecting hubs to urban consumers in Chennai & beyond</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentTab('regional-hubs')}
                className="py-3 px-6 rounded-xl bg-white text-forest-900 font-bold text-xs hover:bg-forest-50 transition shadow-lg flex items-center gap-2"
              >
                <span>Explore Ponneri Collection Hub & Architecture</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-forest-800/80 p-6 rounded-3xl border border-forest-700/60 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-forest-700/80 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-sm text-white">Ponneri Regional Hub Specs</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-forest-600 text-white">
                  Operational Blueprint
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                <div className="bg-forest-900/60 p-3 rounded-xl">
                  <span className="text-forest-400 block text-[10px] uppercase font-semibold">Location</span>
                  <span className="font-bold text-white text-sm">Ponneri, Thiruvallur</span>
                </div>
                <div className="bg-forest-900/60 p-3 rounded-xl">
                  <span className="text-forest-400 block text-[10px] uppercase font-semibold">Capacity</span>
                  <span className="font-bold text-white text-sm">650 Metric Tons</span>
                </div>
                <div className="bg-forest-900/60 p-3 rounded-xl">
                  <span className="text-forest-400 block text-[10px] uppercase font-semibold">Registered Farmers</span>
                  <span className="font-bold text-white text-sm">94 Certified Growers</span>
                </div>
                <div className="bg-forest-900/60 p-3 rounded-xl">
                  <span className="text-forest-400 block text-[10px] uppercase font-semibold">Cold Storage</span>
                  <span className="font-bold text-white text-sm">120 MT Climate-Controlled</span>
                </div>
              </div>

              <p className="text-[11px] text-forest-300 leading-normal italic">
                "Our vision ensures that smallholder farmers cultivating less than 2 acres receive the same
                market power, cold chain access, and premium urban customer reach as corporate agribusinesses."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
