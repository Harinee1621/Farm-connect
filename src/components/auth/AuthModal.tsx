import React, { useEffect, useState } from 'react';
import { X, Sprout, ShoppingCart, UserCheck, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'farmer' | 'consumer';
  initialMode?: 'register' | 'login';
  onSuccess: (role: 'farmer' | 'consumer') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'farmer',
  initialMode = 'register',
  onSuccess,
}) => {
  const { registerFarmer, registerConsumer, login } = useStore();
  const [activeTab, setActiveTab] = useState<'farmer_register' | 'consumer_register' | 'login'>(
    initialRole === 'farmer' ? 'farmer_register' : 'consumer_register'
  );

  // Farmer Form state
  const [fName, setFName] = useState('');
  const [fEmail, setFEmail] = useState('');
  const [fPhone, setFPhone] = useState('');
  const [fFarmName, setFFarmName] = useState('');
  const [fLocation, setFLocation] = useState('');
  const [fDistrict, setFDistrict] = useState('');
  const [fState, setFState] = useState('');
  const [fPinCode, setFPinCode] = useState('');
  const [fPassword, setFPassword] = useState('');
  const [fBio, setFBio] = useState('');

  // Consumer Form state
  const [cName, setCName] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cAddress, setCAddress] = useState('');
  const [cCity, setCCity] = useState('');
  const [cDistrict, setCDistrict] = useState('');
  const [cState, setCState] = useState('');
  const [cPinCode, setCPinCode] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [cContactPref, setCContactPref] = useState<'phone' | 'email' | 'whatsapp'>('phone');
  const [cRequirements, setCRequirements] = useState('');

  // Login Form state
  const [loginRole, setLoginRole] = useState<'farmer' | 'consumer'>('consumer');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab(
      initialMode === 'login'
        ? 'login'
        : initialRole === 'farmer'
        ? 'farmer_register'
        : 'consumer_register'
    );
    setLoginRole(initialRole === 'farmer' ? 'farmer' : 'consumer');
    setLoginError('');
  }, [initialMode, initialRole, isOpen]);

  if (!isOpen) return null;

  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const result = await registerFarmer({
        name: fName.trim(),
        email: fEmail,
        phone: fPhone.trim(),
        farmName: fFarmName.trim() || `${fName.trim()}'s Farm`,
        farmLocation: fLocation.trim(),
        district: fDistrict.trim(),
        state: fState.trim(),
        pinCode: fPinCode.trim(),
        bio: fBio.trim(),
      }, fPassword);
      if (!result.success) {
        setLoginError(result.message);
        return;
      }
      onSuccess('farmer');
      onClose();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Farmer registration failed.');
    }
  };

  const handleConsumerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const result = await registerConsumer({
        name: cName.trim(),
        email: cEmail,
        phone: cPhone.trim(),
        address: cAddress.trim(),
        city: cCity.trim(),
        district: cDistrict.trim(),
        state: cState.trim(),
        pinCode: cPinCode.trim(),
        preferredContact: cContactPref,
        additionalRequirements: cRequirements.trim(),
      }, cPassword);
      if (!result.success) {
        setLoginError(result.message);
        return;
      }
      onSuccess('consumer');
      onClose();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Consumer registration failed.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    let success = false;
    try {
      success = await login(loginEmail, loginPassword, loginRole);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Sign in failed.');
      return;
    }
    if (success) {
      onSuccess(loginRole);
      onClose();
    } else {
      setLoginError(
        `No ${loginRole} account matched that email and password. Check your details. For an older profile without a password, use Register with the same role and email to restore it.`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-forest-700/80 border border-forest-600 flex items-center justify-center shadow-inner">
                <Sprout className="w-6 h-6 text-forest-200" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Join Farm Connect</h3>
                <p className="text-xs text-forest-200">
                  Direct Agricultural Marketplace • Fair Prices • Pure Transparency
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-forest-800/80 hover:bg-forest-700 text-forest-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex p-1 bg-forest-950/60 rounded-xl mt-5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('farmer_register')}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'farmer_register'
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'text-forest-200 hover:text-white'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>              Register as Farmer</span>
            </button>
            <button
              onClick={() => setActiveTab('consumer_register')}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'consumer_register'
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'text-forest-200 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>              Register as Consumer</span>
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'text-forest-200 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {loginError}
            </div>
          )}
          {/* ============================================================== */}
          {/* 1. FARMER REGISTRATION (Section 4) */}
          {/* ============================================================== */}
          {activeTab === 'farmer_register' && (
            <form onSubmit={handleFarmerSubmit} className="space-y-4">
              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
                🌱 <strong>Farmers:</strong> List your agricultural crops, get direct purchase
                requests from consumers, and sell at 100% fair prices without commission deductions!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Farm Name / Land Holding *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Green Acres Bio Farm"
                    value={fFarmName}
                    onChange={(e) => setFFarmName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={fEmail}
                    onChange={(e) => setFEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Your phone number"
                    value={fPhone}
                    onChange={(e) => setFPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Farm Location (Survey No., Village / Taluk) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Village, town, or farm address"
                  value={fLocation}
                  onChange={(e) => setFLocation(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your district"
                    value={fDistrict}
                    onChange={(e) => setFDistrict(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your state"
                    value={fState}
                    onChange={(e) => setFState(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="PIN code"
                    value={fPinCode}
                    onChange={(e) => setFPinCode(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Create secure password"
                  value={fPassword}
                  onChange={(e) => setFPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Farming Bio / Specialization (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your crops or farming methods"
                  value={fBio}
                  onChange={(e) => setFBio(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-4"
              >
                <span>Register Farm & Open Farmer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ============================================================== */}
          {/* 2. CONSUMER REGISTRATION (Section 7) */}
          {/* ============================================================== */}
          {activeTab === 'consumer_register' && (
            <form onSubmit={handleConsumerSubmit} className="space-y-4">
              <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-xs text-blue-900">
                🛒 <strong>Consumers:</strong> Buy freshly harvested crops directly from local
                farmers at transparent farm-gate rates with flexible delivery or pickup!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Your phone number"
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Contact Method *
                  </label>
                  <select
                    value={cContactPref}
                    onChange={(e) => setCContactPref(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  >
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complete Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street address and delivery details"
                  value={cAddress}
                  onChange={(e) => setCAddress(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your city or district"
                    value={cCity}
                    onChange={(e) => setCCity(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your state"
                    value={cState}
                    onChange={(e) => setCState(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="PIN code"
                    value={cPinCode}
                    onChange={(e) => setCPinCode(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Create secure password"
                  value={cPassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Requirements / Delivery Preferences (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deliver before 10 AM, prefer plastic-free packaging, gate security note"
                  value={cRequirements}
                  onChange={(e) => setCRequirements(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-4"
              >
                <span>Complete Registration & Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ============================================================== */}
          {/* 3. LOGIN TAB */}
          {/* ============================================================== */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginRole('consumer')}
                    className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition ${
                      loginRole === 'consumer'
                        ? 'border-forest-600 bg-forest-50 text-forest-800 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Consumer
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginRole('farmer')}
                    className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition ${
                      loginRole === 'farmer'
                        ? 'border-forest-600 bg-forest-50 text-forest-800 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Farmer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-4"
              >
                <span>Sign In to Farm Connect</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
