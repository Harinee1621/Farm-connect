import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Package,
  ThermometerSnowflake,
  FlaskConical,
  Truck,
  Scale,
  Users,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { RegionalHub } from '../../types';

export const RegionalHubsView: React.FC = () => {
  const { regionalHubs, products } = useStore();
  const [selectedHubId, setSelectedHubId] = useState<string>('hub-ponneri');

  const selectedHub = regionalHubs.find((h) => h.id === selectedHubId) || regionalHubs[0];
  const hubProducts = products.filter((p) => p.hubId === selectedHub?.id);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Module 19 Banner */}
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 text-forest-300 text-xs font-bold mb-4 border border-forest-700">
            <Building2 className="w-3.5 h-3.5" />
            <span>FUTURE EXPANSION ARCHITECTURE • MODULE 19</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Regional Agricultural Collection Hubs
          </h1>
          <p className="text-sm text-forest-100 max-w-3xl leading-relaxed">
            While Farm Connect Version 1 prioritizes pure direct farmer-to-consumer transactions,
            our scalable database and application architecture are pre-built to support centralized
            regional consolidation centres, starting with the flagship <strong>Ponneri Collection Hub</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-forest-800">
            <div>
              <div className="text-2xl font-black text-forest-200">4 Hubs</div>
              <div className="text-xs text-forest-300">Across Key Farming Corridors</div>
            </div>
            <div>
              <div className="text-2xl font-black text-forest-200">4,150 MT</div>
              <div className="text-xs text-forest-300">Total Planned Holding Capacity</div>
            </div>
            <div>
              <div className="text-2xl font-black text-forest-200">Individual Batching</div>
              <div className="text-xs text-forest-300">Separate Grower Records & Payouts</div>
            </div>
            <div>
              <div className="text-2xl font-black text-forest-200">Cold Chain</div>
              <div className="text-xs text-forest-300">Integrated Sorting & Inspection</div>
            </div>
          </div>
        </div>

        {/* Hub Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {regionalHubs.map((hub) => (
            <div
              key={hub.id}
              onClick={() => setSelectedHubId(hub.id)}
              className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                selectedHub?.id === hub.id
                  ? 'bg-white border-forest-600 shadow-md ring-2 ring-forest-600/20'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      hub.status === 'operational'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hub.status}
                  </span>
                  <span className="text-[10px] text-slate-400">{hub.state}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{hub.name}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{hub.district}, {hub.pinCode}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Capacity:</span>
                <span className="font-extrabold text-forest-900">{hub.capacityMetricTons} MT</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Hub Deep Dive Blueprint */}
        {selectedHub && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-900">{selectedHub.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800">
                    Flagship Center
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  {selectedHub.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-600 mt-3">
                  <span>Manager: <strong>{selectedHub.managerName}</strong></span>
                  <span>•</span>
                  <span>Contact: <strong>{selectedHub.contactPhone}</strong></span>
                  <span>•</span>
                  <span>Established: <strong>{selectedHub.establishedDate}</strong></span>
                </div>
              </div>

              <div className="bg-forest-50 p-4 rounded-2xl border border-forest-200 text-center min-w-[200px]">
                <span className="text-[10px] font-bold text-forest-700 uppercase tracking-wide block">
                  Current Inflow Capacity
                </span>
                <div className="text-2xl font-black text-forest-900 mt-1">
                  {selectedHub.currentStockMetricTons} / {selectedHub.capacityMetricTons} MT
                </div>
                <div className="w-full bg-forest-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-forest-600 h-full rounded-full"
                    style={{
                      width: `${(selectedHub.currentStockMetricTons / selectedHub.capacityMetricTons) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Hub Architecture 5-Step Pipeline */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                How Regional Consolidation Works in Farm Connect
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-xs mb-3">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 mb-1">1. Farmer Drop-off</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Ponneri farmers bring paddy, shallots, and vegetables to the hub. Every lot is tagged with the grower's digital ID.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-xs mb-3">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 mb-1">2. Quality Inspection</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Moisture meter verification, pesticide residue check, and sorting into Grade A Export vs Standard Grade B.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-xs mb-3">
                    <ThermometerSnowflake className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 mb-1">3. Eco-Sorting & Cold Hold</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Standardized breathable packaging in jute/cellulose bags. Pre-cooled holding preserves vine ripeness.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-xs mb-3">
                    <Package className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 mb-1">4. Order Consolidation</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    When consumer carts contain multiple farmers' produce, the hub aggregates them into a single consolidated parcel!
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-xs mb-3">
                    <Scale className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 mb-1">5. Direct Settlement</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Automated UPI payouts directly to each individual farmer’s bank account upon order delivery confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Crops Linked to This Hub */}
            {hubProducts.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Crops Linked to {selectedHub.name} ({hubProducts.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {hubProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.cropName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-800 truncate">{p.cropName}</div>
                        <div className="text-[10px] text-slate-500">
                          Grower: {p.farmerName} • ₹{p.pricePerUnit}/{p.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

