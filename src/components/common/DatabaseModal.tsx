import React, { useState } from 'react';
import { X, Database, CheckCircle2, ExternalLink, Trash2, Key, Server } from 'lucide-react';
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured, saveSupabaseConfig, clearSupabaseConfig } from '../../lib/supabase';
import { useStore } from '../../context/StoreContext';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const { clearAllData, products, orders, farmers, consumers } = useStore();
  const [url, setUrl] = useState(supabaseUrl);
  const [key, setKey] = useState(supabaseAnonKey);
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'env'>('status');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(url, key);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-forest-300">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Database & Backend Architecture</h3>
              <p className="text-xs text-forest-300">
                Supabase schema reference and local demo data
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-600 gap-4">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'status'
                ? 'border-forest-600 text-forest-800'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Backend Status & Configuration
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'sql'
                ? 'border-forest-600 text-forest-800'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            PostgreSQL Schema (DDL)
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'env'
                ? 'border-forest-600 text-forest-800'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Environment Variables (.env)
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Connection Pill */}
              <div className="p-4 rounded-xl border flex items-center justify-between bg-slate-50 border-slate-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3.5 h-3.5 rounded-full ${
                      isSupabaseConfigured ? 'bg-forest-500 animate-ping' : 'bg-blue-500'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <span>Engine Mode:</span>
                      {isSupabaseConfigured ? (
                        <span className="px-2 py-0.5 rounded text-[11px] bg-forest-100 text-forest-800 font-bold">
                          Credentials configured
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] bg-blue-100 text-blue-800 font-bold">
                          Browser demo mode
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isSupabaseConfigured
                        ? 'Supabase credentials are present, but marketplace data is not connected or synchronized.'
                        : 'Marketplace data is stored in this browser only. It is not shared across devices or users.'}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-bold text-slate-700">{products.length}</span> Crops •{' '}
                  <span className="font-bold text-slate-700">{orders.length}</span> Orders
                </div>
              </div>

              {/* Supabase credentials form */}
              <form onSubmit={handleSave} className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-forest-600" />
                  Supabase Credentials (Not Connected)
                </h4>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Supabase Anon Public Key
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {isSupabaseConfigured ? (
                    <button
                      type="button"
                      onClick={clearSupabaseConfig}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold"
                    >
                      Remove Saved Credentials
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Found in Supabase Project Settings → API
                    </span>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Save Credentials
                  </button>
                </div>
              </form>

              {/* Local data controls */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Browser Data Management</span>
                  <span className="text-[11px] text-slate-500">
                    Registered accounts and marketplace activity are stored in this browser.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm('Delete all browser-stored accounts, listings, orders, and messages? This cannot be undone.')) {
                        clearAllData();
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                    Clear Browser Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-700">
                Schema reference: <code className="text-forest-700">supabase/schema.sql</code>
              </span>
              <div className="max-h-72 overflow-y-auto bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] leading-relaxed">
                <pre>{`-- 1. FARMERS TABLE
CREATE TABLE public.farmers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  farm_name VARCHAR(255) NOT NULL,
  farm_location TEXT NOT NULL,
  district VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pin_code VARCHAR(10) NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  verified BOOLEAN DEFAULT FALSE,
  collection_hub_assigned VARCHAR(150),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES public.farmers(id),
  crop_name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  available_quantity NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  price_per_unit NUMERIC(10, 2) NOT NULL,
  quality_grade VARCHAR(50) NOT NULL,
  harvest_date DATE NOT NULL,
  is_organic BOOLEAN DEFAULT FALSE,
  availability_status VARCHAR(20) DEFAULT 'available'
);

-- 3. ORDERS (Waiting Approval -> Accepted -> Delivered)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(30) UNIQUE NOT NULL,
  consumer_id UUID REFERENCES public.consumers(id),
  farmer_id UUID REFERENCES public.farmers(id),
  total_amount NUMERIC(10, 2) NOT NULL,
  order_status VARCHAR(30) DEFAULT 'waiting_approval'
);`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Supabase client settings can be provided through a{' '}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">.env</code>{' '}
                file in the project root:
              </p>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] space-y-2">
                <div className="text-slate-400"># Farm Connect Supabase Configuration</div>
                <div className="text-emerald-400">VITE_SUPABASE_URL=https://your-project.supabase.co</div>
                <div className="text-emerald-400">VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...</div>
              </div>
              <p className="text-slate-500 text-[11px]">
                These values are not currently used for marketplace authentication or data synchronization.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
