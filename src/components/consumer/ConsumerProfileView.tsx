import React, { useState } from 'react';
import { User, MapPin, Phone, Mail, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ConsumerProfile } from '../../types';

export const ConsumerProfileView: React.FC = () => {
  const { currentUser, userRole, updateConsumerProfile } = useStore();
  const consumer = currentUser as ConsumerProfile;

  const [name, setName] = useState(consumer?.name || '');
  const [phone, setPhone] = useState(consumer?.phone || '');
  const [address, setAddress] = useState(consumer?.address || '');
  const [city, setCity] = useState(consumer?.city || '');
  const [district, setDistrict] = useState(consumer?.district || '');
  const [state, setState] = useState(consumer?.state || '');
  const [pinCode, setPinCode] = useState(consumer?.pinCode || '');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'email' | 'whatsapp'>(
    consumer?.preferredContact || 'phone'
  );
  const [requirements, setRequirements] = useState(consumer?.additionalRequirements || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (userRole !== 'consumer' || !consumer) {
    return (
      <div className="p-12 text-center text-slate-500">
        Please sign in as a consumer to view and edit profile details.
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConsumerProfile(consumer.id, {
      name,
      phone,
      address,
      city,
      district,
      state,
      pinCode,
      preferredContact,
      additionalRequirements: requirements,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
              {consumer.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Consumer Profile & Addresses</h2>
              <p className="text-xs text-slate-500">Manage your contact info and default delivery preferences</p>
            </div>
          </div>

          {savedSuccess && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile and delivery address updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={consumer.email}
                  className="w-full px-3.5 py-2.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Contact Method</label>
                <select
                  value={preferredContact}
                  onChange={(e) => setPreferredContact(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                >
                  <option value="phone">Phone Call</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Complete Street Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / District</label>
                <input
                  type="text"
                  required
                  value={district || city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setDistrict(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">PIN Code</label>
                <input
                  type="text"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Additional Delivery Instructions</label>
              <textarea
                rows={2}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g. Ring doorbell, morning delivery preference, leave with security"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-forest-600 hover:bg-forest-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 mt-4"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

