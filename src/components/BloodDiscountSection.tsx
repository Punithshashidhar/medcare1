import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Droplets, Calculator, CheckCircle2 } from 'lucide-react';
import {
  CHECKUP_PLANS,
  DOCTORS,
  MEDICAL_MACHINES,
  UPCOMING_DATES,
  WARD_OPTIONS,
} from '../data/hospitalData';
import { BloodGroupStock, DonorRegistration } from '../types/hospital';
import {
  calculateBillSummary,
  formatCurrency,
  formatDonorPassCode,
  validateDonorInput,
} from '../utils/hospitalLogic';

interface BloodDiscountSectionProps {
  bloodStock: BloodGroupStock[];
  onRegisterDonor: (donor: DonorRegistration) => void;
  activeDonorPassCode: string;
  selectedWardId: string;
  onSelectWardId: (wardId: string) => void;
}

const CLINIC_IMAGE = '/src/assets/images/blood_donation_care_1794718341963.jpg';

export const BloodDiscountSection: React.FC<BloodDiscountSectionProps> = ({
  bloodStock,
  onRegisterDonor,
  activeDonorPassCode,
  selectedWardId,
  onSelectWardId,
}) => {
  const [imgError, setImgError] = useState(false);

  // Free Blood Donor Registration form state
  const [fullName, setFullName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroupStock['group']>('O+');
  const [age, setAge] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState(UPCOMING_DATES[0].key);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdDonor, setCreatedDonor] = useState<DonorRegistration | null>(null);

  // Interactive Total Bill & Blood-Donor Discount Calculator state
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(DOCTORS[2].id);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(CHECKUP_PLANS[1].id);
  const [selectedMachineId, setSelectedMachineId] = useState<string>('none');
  const [admitDays, setAdmitDays] = useState<number>(0);
  const [applyDonorDiscount, setApplyDonorDiscount] = useState(true);
  const [applyStudentSenior, setApplyStudentSenior] = useState(false);
  const prevWardIdRef = useRef(selectedWardId);

  useEffect(() => {
    if (prevWardIdRef.current === 'none' && selectedWardId !== 'none') {
      setAdmitDays((days) => (days === 0 ? 1 : days));
    }
    prevWardIdRef.current = selectedWardId;
  }, [selectedWardId]);

  const selectedDoctorFee = useMemo(() => {
    if (selectedDoctorId === 'none') return 0;
    return DOCTORS.find((d) => d.id === selectedDoctorId)?.consultationFee ?? 0;
  }, [selectedDoctorId]);

  const selectedPlanFee = useMemo(() => {
    if (selectedPlanId === 'none') return 0;
    return CHECKUP_PLANS.find((p) => p.id === selectedPlanId)?.price ?? 0;
  }, [selectedPlanId]);

  const selectedMachineFee = useMemo(() => {
    if (selectedMachineId === 'none') return 0;
    return MEDICAL_MACHINES.find((m) => m.id === selectedMachineId)?.scanFee ?? 0;
  }, [selectedMachineId]);

  const selectedWardRate = useMemo(() => {
    if (selectedWardId === 'none') return 0;
    return WARD_OPTIONS.find((w) => w.id === selectedWardId)?.ratePerDay ?? 0;
  }, [selectedWardId]);

  const billSummary = useMemo(
    () =>
      calculateBillSummary({
        consultationFee: selectedDoctorFee,
        checkupFee: selectedPlanFee,
        equipmentFee: selectedMachineFee,
        bedRatePerDay: selectedWardRate,
        admitDays: selectedWardId === 'none' ? 0 : admitDays,
        hasBloodDonorDiscount: applyDonorDiscount,
        hasStudentOrSeniorConcession: applyStudentSenior,
      }),
    [
      selectedDoctorFee,
      selectedPlanFee,
      selectedMachineFee,
      selectedWardRate,
      selectedWardId,
      admitDays,
      applyDonorDiscount,
      applyStudentSenior,
    ]
  );

  const handleDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateDonorInput({
      fullName,
      age,
      weightKg,
      phone,
      bloodGroup,
      preferredDate,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const codeSuffix = Math.floor(100 + (fullName.trim().length * 37 + Number(age) * 11) % 899);
    const donorPassCode = formatDonorPassCode(bloodGroup, codeSuffix);

    const newDonor: DonorRegistration = {
      id: `donor-${Date.now()}`,
      donorPassCode,
      fullName: fullName.trim(),
      bloodGroup,
      age: Number(age),
      weightKg: Number(weightKg),
      phone: phone.trim(),
      preferredDate,
      discountPercent: 20,
      createdAt: new Date().toISOString(),
    };

    onRegisterDonor(newDonor);
    setCreatedDonor(newDonor);
    setApplyDonorDiscount(true);
    setFullName('');
    setAge('');
    setWeightKg('');
    setPhone('');
  };

  return (
    <section id="blood-discount" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-teal-700">
                05. Voluntary Blood Donation &amp; Bill Discount Program
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Donate Free Blood, Receive 20% Off Your Total Hospital Bill
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                To keep blood reserves strong for emergency patients, Medplex rewards every
                voluntary blood donor with an instant verified Donor Pass. Present your pass at
                billing or online booking to reduce your total bill by 20% across consultations,
                checkup plans, and diagnostic scans.
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Current Hospital Blood Bank Units
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                {bloodStock.map((item) => (
                  <div
                    key={item.group}
                    className={`p-2.5 rounded-lg border text-center ${
                      item.status === 'Priority Needed'
                        ? 'bg-red-50/70 border-red-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <p className="text-sm font-bold text-slate-900">{item.group}</p>
                    <p className="mt-0.5 text-xs font-mono tabular-nums text-slate-700">
                      {item.unitsAvailable} units
                    </p>
                    <p
                      className={`mt-0.5 text-[11px] font-medium ${
                        item.status === 'Priority Needed' ? 'text-red-700' : 'text-teal-700'
                      }`}
                    >
                      {item.status === 'Priority Needed' ? 'Needed' : 'Ready'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="h-full min-h-[230px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              {!imgError ? (
                <img
                  src={CLINIC_IMAGE}
                  alt="Medplex Hospital blood donation and preventive care checkup room"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
                  <Droplets className="w-10 h-10 text-red-600 mb-2" />
                  <p className="text-sm font-semibold text-slate-900">Medplex Blood Bank Unit</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Free Blood Donor Registration */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Register for Free Blood Donation
              </h3>
            </div>
            <p className="text-sm text-slate-600 mb-5">
              Eligible volunteers (18–65 yrs, min 50 kg) receive an instant 20% Total Bill Discount
              Pass.
            </p>

            {createdDonor && (
              <div
                role="status"
                className="mb-5 p-4 rounded-lg bg-teal-50 border border-teal-200 text-teal-950"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">
                      Donor Pass Issued: <span className="font-mono">{createdDonor.donorPassCode}</span>
                    </p>
                    <p className="text-xs text-teal-800 mt-1">
                      Registered for {createdDonor.fullName} ({createdDonor.bloodGroup}) on{' '}
                      {createdDonor.preferredDate}. Use this code in any appointment booking for 20%
                      off.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleDonorSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="donor-name" className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="donor-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-700">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="donor-group" className="block text-xs font-medium text-slate-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    id="donor-group"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroupStock['group'])}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    {bloodStock.map((item) => (
                      <option key={item.group} value={item.group}>
                        {item.group} ({item.unitsAvailable} units in bank)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="donor-age" className="block text-xs font-medium text-slate-700 mb-1">
                    Age (18–65)
                  </label>
                  <input
                    id="donor-age"
                    type="number"
                    min={18}
                    max={65}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="22"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                  {errors.age && <p className="mt-1 text-xs text-red-700">{errors.age}</p>}
                </div>

                <div>
                  <label htmlFor="donor-weight" className="block text-xs font-medium text-slate-700 mb-1">
                    Weight (min 50 kg)
                  </label>
                  <input
                    id="donor-weight"
                    type="number"
                    min={30}
                    max={200}
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="58"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                  {errors.weightKg && (
                    <p className="mt-1 text-xs text-red-700">{errors.weightKg}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="donor-phone" className="block text-xs font-medium text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    id="donor-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="donor-date" className="block text-xs font-medium text-slate-700 mb-1">
                  Preferred Donation Date
                </label>
                <select
                  id="donor-date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  {UPCOMING_DATES.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer"
              >
                Generate Free Blood Donor Pass (20% Off)
              </button>
            </form>
          </div>

          {/* Right: Total Bill & Blood Donor Discount Calculator */}
          <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-5 h-5 text-teal-700" />
              <h3 className="text-lg font-bold text-slate-900">
                Total Bill & Donor Discount Estimator
              </h3>
            </div>
            <p className="text-sm text-slate-600 mb-5">
              See exactly how affordable Medplex billing becomes when combining low OPD rates with
              the 20% free blood donation discount. Active pass:{' '}
              <span className="font-mono font-medium text-slate-900">{activeDonorPassCode}</span>
            </p>

            <div className="space-y-3.5">
              <div>
                <label htmlFor="calc-doctor" className="block text-xs font-medium text-slate-700 mb-1">
                  1. Doctor Consultation
                </label>
                <select
                  id="calc-doctor"
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  <option value="none">No Doctor Consultation (₹0)</option>
                  {DOCTORS.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.department} ({formatCurrency(doc.consultationFee)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="calc-plan" className="block text-xs font-medium text-slate-700 mb-1">
                  2. Preventive Checkup Plan
                </label>
                <select
                  id="calc-plan"
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  <option value="none">No Checkup Plan (₹0)</option>
                  {CHECKUP_PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} ({formatCurrency(plan.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="calc-machine" className="block text-xs font-medium text-slate-700 mb-1">
                  3. Diagnostic Machine / Scan (Optional)
                </label>
                <select
                  id="calc-machine"
                  value={selectedMachineId}
                  onChange={(e) => setSelectedMachineId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  <option value="none">No Additional Scan (₹0)</option>
                  {MEDICAL_MACHINES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({formatCurrency(m.scanFee)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label htmlFor="calc-ward" className="block text-xs font-medium text-slate-700 mb-1">
                    4. Admit Bed Type (Optional)
                  </label>
                  <select
                    id="calc-ward"
                    value={selectedWardId}
                    onChange={(e) => {
                      onSelectWardId(e.target.value);
                      if (e.target.value !== 'none' && admitDays === 0) {
                        setAdmitDays(1);
                      }
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="none">OPD Visit Only (No Bed)</option>
                    {WARD_OPTIONS.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({formatCurrency(w.ratePerDay)}/day)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="calc-days" className="block text-xs font-medium text-slate-700 mb-1">
                    Admit Days
                  </label>
                  <input
                    id="calc-days"
                    type="number"
                    min={0}
                    max={30}
                    disabled={selectedWardId === 'none'}
                    value={selectedWardId === 'none' ? 0 : admitDays}
                    onChange={(e) => setAdmitDays(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono tabular-nums disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2.5 text-sm text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyDonorDiscount}
                    onChange={(e) => setApplyDonorDiscount(e.target.checked)}
                    className="w-4 h-4 accent-teal-700 rounded"
                  />
                  <span>Apply Free Blood Donation Discount (20% off total bill)</span>
                </label>

                <label className="flex items-center gap-2.5 text-sm text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyStudentSenior}
                    onChange={(e) => setApplyStudentSenior(e.target.checked)}
                    className="w-4 h-4 accent-teal-700 rounded"
                  />
                  <span>Add College Student / Senior Citizen Concession (10% extra)</span>
                </label>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 space-y-2 text-sm">
              {billSummary.bedCharges > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Inpatient Admit Bed Charges</span>
                  <span className="font-mono tabular-nums">
                    {formatCurrency(billSummary.bedCharges)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Standard Subtotal</span>
                <span className="font-mono tabular-nums">{formatCurrency(billSummary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-teal-800">
                <span>Free Blood Donor Savings (20%)</span>
                <span className="font-mono tabular-nums">
                  −{formatCurrency(billSummary.bloodDonorDiscountAmount)}
                </span>
              </div>
              {billSummary.concessionDiscountAmount > 0 && (
                <div className="flex justify-between text-teal-800">
                  <span>Student / Senior Concession (10%)</span>
                  <span className="font-mono tabular-nums">
                    −{formatCurrency(billSummary.concessionDiscountAmount)}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900">Final Payable Bill</span>
                <span
                  data-testid="bill-final-payable"
                  className="text-2xl font-bold text-slate-900 font-mono tabular-nums"
                >
                  {formatCurrency(billSummary.finalPayable)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
