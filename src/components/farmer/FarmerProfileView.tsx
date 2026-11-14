import React, { useState } from 'react';
import { User, MapPin, Phone, Mail, Save, CheckCircle2, Building2, CreditCard, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { FarmerProfile } from '../../types';

export const FarmerProfileView: React.FC = () => {
  const { currentUser, userRole, updateFarmerProfile, regionalHubs } = useStore();
  const farmer = currentUser as FarmerProfile;

  const [name, setName] = useState(farmer?.name || '');
  const [farmName, setFarmName] = useState(farmer?.farmName || '');
  const [phone, setPhone] = useState(farmer?.phone || '');
  const [location, setLocation] = useState(farmer?.farmLocation || '');
  const [district, setDistrict] = useState(farmer?.district || '');
  const [state, setState] = useState(farmer?.state || '');
  const [pinCode, setPinCode] = useState(farmer?.pinCode || '');
  const [bio, setBio] = useState(farmer?.bio || '');
  const [upiId, setUpiId] = useState(farmer?.upiId || '');
  const [accountNumber, setAccountNumber] = useState(farmer?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(farmer?.ifscCode || '');
  const [hub, setHub] = useState(farmer?.collectionHubAssigned || 'Ponneri Regional Agricultural Hub');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (userRole !== 'farmer' || !farmer) {
    return (
      <div className="p-12 text-center text-slate-500">
        Please sign in as a farmer to view and edit farm profile details.
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFarmerProfile(farmer.id, {
      name,
      farmName,
      phone,
      farmLocation: location,
      district,
      state,
      pinCode,
      bio,
      upiId,
      accountNumber,
      ifscCode,
      collectionHubAssigned: hub,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-lg">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">{farmer.farmName}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-100 text-forest-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-forest-600" /> Verified Producer
                </span>
              </div>
              <p className="text-xs text-slate-500">Edit farm information, contact, and direct bank settlement details</p>
            </div>
          </div>

          {savedSuccess && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Farm profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farmer Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farm / Enterprise Name *</label>
                <input
                  type="text"
                  required
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={farmer.email}
                  className="w-full px-3.5 py-2.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Farm Location (Survey No., Village / Taluk) *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">District *</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Direct Bank Settlement Info */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-forest-600" />
                Direct Settlement Bank & UPI Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">UPI ID (e.g. name@upi)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Regional Hub Linkage */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Regional Collection Hub (Future Logistics Network)
              </label>
              <select
                value={hub}
                onChange={(e) => setHub(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              >
                {regionalHubs.map((h) => (
                  <option key={h.id} value={h.name}>
                    {h.name} ({h.district}, {h.state})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Farm Bio / Cultivation Philosophy</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-forest-600 hover:bg-forest-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 mt-4"
            >
              <Save className="w-4 h-4" />
              <span>Save Farm Profile</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

