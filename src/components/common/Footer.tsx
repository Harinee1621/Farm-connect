import React from 'react';
import { Sprout, Phone, Mail, MapPin, Heart, ShieldCheck, Truck, Scale } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  openAuthModal: (role?: 'farmer' | 'consumer') => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, openAuthModal }) => {
  const { userRole } = useStore();
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Farm<span className="text-forest-400">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-sm">
              Farm Connect is an agricultural marketplace bridging Indian farmers directly with
              conscious consumers. Eliminating unnecessary middlemen to secure fair remunerative
              prices for growers and harvest-fresh nutrition for families.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-forest-400" />
                Verified Farmers
              </span>
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-forest-400" />
                Transparent Pricing
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-forest-400" />
                Farm Gate Pickup
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setCurrentTab('marketplace')}
                  className="hover:text-forest-400 transition"
                >
                  Browse Fresh Produce
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('marketplace')}
                  className="hover:text-forest-400 transition"
                >
                  Organic Certified Crops
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('regional-hubs')}
                  className="hover:text-forest-400 transition"
                >
                  Regional Collection Hubs
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (userRole === 'consumer') {
                      setCurrentTab('my-orders');
                    } else {
                      openAuthModal('consumer');
                    }
                  }}
                  className="hover:text-forest-400 transition"
                >
                  Track Consumer Orders
                </button>
              </li>
            </ul>
          </div>

          {/* For Farmers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Farmers
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => openAuthModal('farmer')}
                  className="hover:text-forest-400 transition"
                >
                  Register Your Farm
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (userRole === 'farmer') {
                      setCurrentTab('farmer-dashboard');
                    } else {
                      openAuthModal('farmer');
                    }
                  }}
                  className="hover:text-forest-400 transition"
                >
                  Farmer Portal & Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('regional-hubs')}
                  className="hover:text-forest-400 transition"
                >
                  Ponneri Hub Drop-off
                </button>
              </li>
              <li>
                <span className="text-xs text-forest-400 block mt-2">
                  Toll-Free Helpline: 1800-FARM-DIRECT
                </span>
              </li>
            </ul>
          </div>

          {/* Regional Hubs & Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Key Locations
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-forest-400 shrink-0 mt-0.5" />
                <span>Ponneri Agri Hub, Thiruvallur District, Tamil Nadu 601204</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-forest-400 shrink-0" />
                <span>+91 94441 55667</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-forest-400 shrink-0" />
                <span>support@farmconnect.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Farm Connect Agricultural Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Direct Farmer Empowerment</span>
            <span>Zero Unregulated Markups</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Indian Agriculture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
