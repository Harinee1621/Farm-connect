import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Wheat,
  ShoppingCart,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Building2,
  Search,
  Scale,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { FarmerProfile, ConsumerProfile, Product, Order } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    farmers,
    consumers,
    products,
    orders,
    complaints,
    verifyFarmer,
    deleteProduct,
    resolveComplaint,
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'farmers' | 'consumers' | 'products' | 'orders' | 'complaints'>('overview');
  const [farmerSearch, setFarmerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Metrics
  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const deliveredOrdersCount = orders.filter((o) => o.orderStatus === 'delivered').length;
  const verifiedFarmersCount = farmers.filter((f) => f.verified).length;

  const filteredFarmers = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      f.farmName.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      f.district.toLowerCase().includes(farmerSearch.toLowerCase())
  );

  const filteredProducts = products.filter(
    (p) =>
      p.cropName.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.farmerName.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">Platform Administration</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40 uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Farm Connect Governance, Farmer Account Verification & Order Monitoring
              </p>
            </div>
          </div>

        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1 mb-8 text-xs font-bold shadow-xs overflow-x-auto">
          {[
            { id: 'overview', label: 'Platform KPIs' },
            { id: 'farmers', label: `Farmers (${farmers.length})` },
            { id: 'consumers', label: `Consumers (${consumers.length})` },
            { id: 'products', label: `Crops Moderation (${products.length})` },
            { id: 'orders', label: `Orders Monitor (${orders.length})` },
            { id: 'complaints', label: `Complaints & Reports (${complaints.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                activeAdminTab === tab.id
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: PLATFORM KPIS */}
        {/* ============================================================== */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Marketplace GMV
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">₹{totalGMV}</div>
                <span className="text-[11px] text-emerald-600 font-medium">100% Direct Farmer Payout</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Registered Farmers
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {farmers.length}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {verifiedFarmersCount} Verified Producers
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Crop Listings
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {products.length}
                </div>
                <span className="text-[11px] text-forest-700 font-medium">Across 8 Categories</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Consumer Orders
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {orders.length}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {deliveredOrdersCount} Successfully Completed
                </span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Live Order Activity</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                          {o.orderStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        {o.consumerName} → {o.farmerName} ({o.items.length} items)
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-900">₹{o.totalAmount}</div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: FARMERS DIRECTORY & VERIFICATION (Section 18) */}
        {/* ============================================================== */}
        {activeAdminTab === 'farmers' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registered Agricultural Producers</h3>
                <p className="text-xs text-slate-500">Verify farmer identity and inspect land location credentials</p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search farmer or district..."
                  value={farmerSearch}
                  onChange={(e) => setFarmerSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Farmer</th>
                    <th className="py-3 px-4">Farm & Location</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFarmers.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{f.name}</span>
                          {f.verified && <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{f.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{f.farmName}</div>
                        <div className="text-[11px] text-slate-500">{f.farmLocation}, {f.district}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{f.phone}</div>
                        <div className="text-[10px] text-slate-400">{f.email}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        ⭐ {f.rating} ({f.totalReviews})
                      </td>
                      <td className="py-3 px-4">
                        {f.verified ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => verifyFarmer(f.id, !f.verified)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            f.verified
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {f.verified ? 'Revoke Status' : 'Verify Farmer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CONSUMERS DIRECTORY */}
        {/* ============================================================== */}
        {activeAdminTab === 'consumers' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Registered Consumers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Consumer Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Delivery Address</th>
                    <th className="py-3 px-4">City / State</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consumers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{c.phone}</div>
                        <div className="text-[10px] text-slate-400">{c.email}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{c.address}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {c.city || c.district}, {c.state} ({c.pinCode})
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CROPS MODERATION */}
        {/* ============================================================== */}
        {activeAdminTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Crop Catalog Moderation</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter crops..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Crop</th>
                    <th className="py-3 px-4">Farmer</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Organic</th>
                    <th className="py-3 px-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.cropName}</div>
                        <div className="text-[10px] text-slate-400">{p.qualityGrade}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {p.farmerName} ({p.farmerDistrict})
                      </td>
                      <td className="py-3 px-4 text-forest-700 font-semibold">{p.category}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₹{p.pricePerUnit} / {p.unit}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {p.availableQuantity} {p.unit}
                      </td>
                      <td className="py-3 px-4">
                        {p.isOrganic ? (
                          <span className="text-emerald-700 font-bold">Yes (Organic)</span>
                        ) : (
                          <span className="text-slate-400">Conventional</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Remove listing "${p.cropName}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          title="Remove listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: ORDERS MONITOR */}
        {/* ============================================================== */}
        {activeAdminTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">All Marketplace Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Consumer</th>
                    <th className="py-3 px-4">Farmer</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Fulfillment</th>
                    <th className="py-3 px-4">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{o.orderNumber}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{o.consumerName}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{o.farmerName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                          {o.orderStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-forest-900">₹{o.totalAmount}</td>
                      <td className="py-3 px-4 capitalize text-slate-600">{o.fulfillmentMethod}</td>
                      <td className="py-3 px-4 text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: COMPLAINTS & DISPUTES */}
        {/* ============================================================== */}
        {activeAdminTab === 'complaints' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Complaints & Dispute Resolution</h3>
            {complaints.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No open consumer or farmer complaints.</div>
            ) : (
              <div className="space-y-3">
                {complaints.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{c.subject}</span>
                        <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">
                          {c.orderNumber}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          c.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <p className="text-slate-600 mb-2">{c.details}</p>
                    <div className="text-[11px] text-slate-500 mb-2">
                      Reported by <strong>{c.reporterName}</strong> against <strong>{c.targetName}</strong>
                    </div>

                    {c.resolution ? (
                      <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 font-medium">
                        Resolution: {c.resolution}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          const res = prompt('Enter resolution details:');
                          if (res) resolveComplaint(c.id, res);
                        }}
                        className="px-3 py-1 bg-forest-600 text-white rounded-lg text-xs font-bold"
                      >
                        Resolve Complaint
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
