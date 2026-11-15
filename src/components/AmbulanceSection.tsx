import React, { useState } from 'react';
import { PhoneCall, Siren, CheckCircle2 } from 'lucide-react';
import { AMBULANCE_TIERS, HOSPITAL_INFO } from '../data/hospitalData';
import { AmbulanceDispatch, AmbulanceTierId } from '../types/hospital';
import { generateTokenCode, validateAmbulanceInput } from '../utils/hospitalLogic';

interface AmbulanceSectionProps {
  onDispatchAmbulance: (dispatch: AmbulanceDispatch) => void;
}

const EMERGENCY_TYPES = [
  'Accident / Bone Trauma',
  'Chest Pain / Cardiac Care',
  'Breathing Difficulty',
  'Maternity / Labor Support',
  'High Fever / Seizure',
  'Inter-Hospital Transfer',
];

export const AmbulanceSection: React.FC<AmbulanceSectionProps> = ({ onDispatchAmbulance }) => {
  const [callerName, setCallerName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [emergencyType, setEmergencyType] = useState(EMERGENCY_TYPES[0]);
  const [tierId, setTierId] = useState<AmbulanceTierId>('bls');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [latestDispatch, setLatestDispatch] = useState<AmbulanceDispatch | null>(null);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAmbulanceInput({
      callerName,
      phone,
      pickupAddress,
      emergencyType,
      tierId,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const selectedTier = AMBULANCE_TIERS.find((t) => t.id === tierId) ?? AMBULANCE_TIERS[0];
    const unitNum = 12 + (callerName.trim().length % 70);

    const dispatch: AmbulanceDispatch = {
      id: `amb-${Date.now()}`,
      dispatchCode: generateTokenCode('AMB', unitNum),
      callerName: callerName.trim(),
      phone: phone.trim(),
      pickupAddress: pickupAddress.trim(),
      emergencyType,
      tierId,
      tierName: selectedTier.name,
      vehicleNumber: `KA-01-MG-${4100 + unitNum}`,
      driverName: tierId === 'als' ? 'Ramesh Gowda' : tierId === 'trauma' ? 'Imran Khan' : 'Suresh Babu',
      driverPhone: '+91 98450 77812',
      etaMinutes: tierId === 'als' ? 9 : 11,
      status: 'Dispatched',
      createdAt: new Date().toISOString(),
    };

    onDispatchAmbulance(dispatch);
    setLatestDispatch(dispatch);
    setCallerName('');
    setPhone('');
    setPickupAddress('');
  };

  return (
    <section id="ambulance" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div>
              <p className="text-sm font-medium text-red-700">06. 24/7 Emergency & Ambulance Desk</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Rapid 24/7 Ambulance Dispatch
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                GPS-equipped Basic, Cardiac ICU, and Trauma ambulances stationed round the clock.
                Basic Life Support pickup is completely free within 5 km of Medplex Hospital.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-red-800">24/7 Direct Emergency Helpline</p>
                <p className="mt-0.5 text-xl font-bold text-red-900 font-mono tabular-nums">
                  {HOSPITAL_INFO.emergencyPhone}
                </p>
              </div>
              <a
                href="tel:108"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 108</span>
              </a>
            </div>

            <div className="space-y-3">
              {AMBULANCE_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{tier.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-600">{tier.equipmentSummary}</p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <p className="text-xs font-mono font-semibold text-teal-800 tabular-nums">
                      ETA {tier.responseTarget}
                    </p>
                    <p className="text-xs text-slate-500">{tier.feeLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 rounded-xl bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-1">
              <Siren className="w-5 h-5 text-red-700" />
              <h3 className="text-lg font-bold text-slate-900">Request Ambulance Pickup</h3>
            </div>
            <p className="text-sm text-slate-600 mb-5">
              Submit pickup details to assign the nearest available ambulance and driver immediately.
            </p>

            {latestDispatch && (
              <div
                role="status"
                className="mb-5 p-4 rounded-lg bg-teal-50 border border-teal-200 text-teal-950"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">
                      Ambulance Dispatched · Code{' '}
                      <span className="font-mono">{latestDispatch.dispatchCode}</span>
                    </p>
                    <p className="text-xs text-teal-900 mt-1">
                      Vehicle <span className="font-mono">{latestDispatch.vehicleNumber}</span> ({latestDispatch.tierName})
                      with driver {latestDispatch.driverName} ({latestDispatch.driverPhone}) —
                      Estimated arrival in <span className="font-semibold">{latestDispatch.etaMinutes} mins</span>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleDispatch} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amb-caller" className="block text-xs font-medium text-slate-700 mb-1">
                    Caller / Patient Name
                  </label>
                  <input
                    id="amb-caller"
                    type="text"
                    value={callerName}
                    onChange={(e) => setCallerName(e.target.value)}
                    placeholder="e.g. Karthik Reddy"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                  />
                  {errors.callerName && (
                    <p className="mt-1 text-xs text-red-700">{errors.callerName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="amb-phone" className="block text-xs font-medium text-slate-700 mb-1">
                    Callback Mobile Number
                  </label>
                  <input
                    id="amb-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9845012345"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-red-700"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="amb-address" className="block text-xs font-medium text-slate-700 mb-1">
                  Pickup Address & Nearest Landmark
                </label>
                <input
                  id="amb-address"
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="e.g. Hostel Block B, University Road, near Main Gate"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                />
                {errors.pickupAddress && (
                  <p className="mt-1 text-xs text-red-700">{errors.pickupAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amb-type" className="block text-xs font-medium text-slate-700 mb-1">
                    Emergency Category
                  </label>
                  <select
                    id="amb-type"
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                  >
                    {EMERGENCY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="amb-tier" className="block text-xs font-medium text-slate-700 mb-1">
                    Ambulance Unit Type
                  </label>
                  <select
                    id="amb-tier"
                    value={tierId}
                    onChange={(e) => setTierId(e.target.value as AmbulanceTierId)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                  >
                    {AMBULANCE_TIERS.map((tier) => (
                      <option key={tier.id} value={tier.id}>
                        {tier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors cursor-pointer"
              >
                Dispatch 24/7 Ambulance Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
