import React, { useEffect, useMemo, useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { CHECKUP_PLANS, DOCTORS, UPCOMING_DATES } from '../data/hospitalData';
import { AppointmentBooking, CheckupPlan, Doctor, DonorRegistration } from '../types/hospital';
import {
  formatCurrency,
  generateTokenCode,
  getTakenSlots,
  validateAppointmentInput,
} from '../utils/hospitalLogic';

export type BookingTarget =
  | { type: 'doctor'; doctor: Doctor; preselectedSlot?: string }
  | { type: 'checkup'; plan: CheckupPlan };

interface BookingModalProps {
  isOpen: boolean;
  target: BookingTarget | null;
  existingBookings: AppointmentBooking[];
  registeredDonors: DonorRegistration[];
  onClose: () => void;
  onConfirmBooking: (booking: AppointmentBooking) => void;
}

const CHECKUP_SLOTS = ['07:30 AM', '08:15 AM', '09:00 AM', '10:30 AM'];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  target,
  existingBookings,
  registeredDonors,
  onClose,
  onConfirmBooking,
}) => {
  const [mode, setMode] = useState<'doctor' | 'checkup'>('doctor');
  const [selectedDoctorId, setSelectedDoctorId] = useState(DOCTORS[0].id);
  const [selectedPlanId, setSelectedPlanId] = useState(CHECKUP_PLANS[0].id);
  const [date, setDate] = useState(UPCOMING_DATES[0].key);
  const [timeSlot, setTimeSlot] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [phone, setPhone] = useState('');
  const [donorPassInput, setDonorPassInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<AppointmentBooking | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setConfirmed(null);

    if (target?.type === 'doctor') {
      setMode('doctor');
      setSelectedDoctorId(target.doctor.id);
      setTimeSlot(target.preselectedSlot ?? target.doctor.slots[0]);
    } else if (target?.type === 'checkup') {
      setMode('checkup');
      setSelectedPlanId(target.plan.id);
      setTimeSlot(CHECKUP_SLOTS[0]);
    } else {
      setMode('doctor');
      setSelectedDoctorId(DOCTORS[0].id);
      setTimeSlot(DOCTORS[0].slots[0]);
    }
  }, [isOpen, target]);

  const activeDoctor = useMemo(
    () => DOCTORS.find((d) => d.id === selectedDoctorId) ?? DOCTORS[0],
    [selectedDoctorId]
  );

  const activePlan = useMemo(
    () => CHECKUP_PLANS.find((p) => p.id === selectedPlanId) ?? CHECKUP_PLANS[0],
    [selectedPlanId]
  );

  const itemId = mode === 'doctor' ? activeDoctor.id : activePlan.id;
  const slotsList = mode === 'doctor' ? activeDoctor.slots : CHECKUP_SLOTS;
  const takenSlots = useMemo(
    () => getTakenSlots(existingBookings, itemId, date),
    [existingBookings, itemId, date]
  );

  const originalFee = mode === 'doctor' ? activeDoctor.consultationFee : activePlan.price;
  const normalizedPass = donorPassInput.trim().toUpperCase();
  const isDonorPassValid =
    normalizedPass.length > 0 &&
    (registeredDonors.some((d) => d.donorPassCode.toUpperCase() === normalizedPass) ||
      normalizedPass.startsWith('DONOR-'));

  const discountApplied = isDonorPassValid ? Math.round(originalFee * 0.2) : 0;
  const finalFee = originalFee - discountApplied;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAppointmentInput({
      patientName,
      patientAge,
      phone,
      date,
      timeSlot,
    });

    if (takenSlots.has(timeSlot)) {
      validation.valid = false;
      validation.errors.timeSlot = 'This slot is already reserved. Please pick another time.';
    }

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const booking: AppointmentBooking = {
      id: `appt-${Date.now()}`,
      tokenNumber: generateTokenCode('MED-2026', existingBookings.length + 1),
      bookingType: mode,
      itemId,
      title: mode === 'doctor' ? activeDoctor.name : activePlan.name,
      departmentOrCategory:
        mode === 'doctor'
          ? `${activeDoctor.department} · ${activeDoctor.roomNumber}`
          : activePlan.category,
      patientName: patientName.trim(),
      patientAge: Number(patientAge),
      phone: phone.trim(),
      date,
      timeSlot,
      originalFee,
      donorPassCode: isDonorPassValid ? normalizedPass : undefined,
      discountApplied,
      finalFee,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    onConfirmBooking(booking);
    setConfirmed(booking);
    setPatientName('');
    setPatientAge('');
    setPhone('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]"
    >
      <div className="bg-white w-full max-w-xl rounded-xl border border-slate-200 shadow-xl max-h-[92vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <h2 id="booking-modal-title" className="text-lg font-bold text-slate-900">
            {confirmed ? 'Appointment Slot Confirmed' : 'Book Doctor Slot or Checkup Plan'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking dialog"
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmed ? (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-lg bg-teal-50 border border-teal-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-teal-950">
                  Booking Token: <span className="font-mono">{confirmed.tokenNumber}</span>
                </p>
                <p className="text-xs text-teal-800 mt-1">
                  Saved to My Bookings below. Please arrive 10 minutes before your slot.
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div>
                <dt className="text-xs text-slate-500">Patient</dt>
                <dd className="font-semibold text-slate-900">
                  {confirmed.patientName} ({confirmed.patientAge} yrs)
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Service</dt>
                <dd className="font-semibold text-slate-900">{confirmed.title}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Date & Time</dt>
                <dd className="font-mono text-slate-900 tabular-nums">
                  {confirmed.date} · {confirmed.timeSlot}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Payable Fee</dt>
                <dd className="font-mono font-bold text-teal-800 tabular-nums">
                  {formatCurrency(confirmed.finalFee)}
                  {confirmed.discountApplied > 0 && (
                    <span className="ml-1.5 text-xs font-normal text-slate-500">
                      (Saved {formatCurrency(confirmed.discountApplied)})
                    </span>
                  )}
                </dd>
              </div>
            </dl>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setMode('doctor');
                  setTimeSlot(activeDoctor.slots[0]);
                }}
                className={`py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
                  mode === 'doctor'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Doctor Appointment
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('checkup');
                  setTimeSlot(CHECKUP_SLOTS[0]);
                }}
                className={`py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
                  mode === 'checkup'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Health Checkup Plan
              </button>
            </div>

            {mode === 'doctor' ? (
              <div>
                <label htmlFor="modal-doctor" className="block text-xs font-medium text-slate-700 mb-1">
                  Select Doctor & Department
                </label>
                <select
                  id="modal-doctor"
                  value={selectedDoctorId}
                  onChange={(e) => {
                    const nextDoc = DOCTORS.find((d) => d.id === e.target.value) ?? DOCTORS[0];
                    setSelectedDoctorId(nextDoc.id);
                    setTimeSlot(nextDoc.slots[0]);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  {DOCTORS.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.department} ({formatCurrency(doc.consultationFee)})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label htmlFor="modal-plan" className="block text-xs font-medium text-slate-700 mb-1">
                  Select Checkup Plan
                </label>
                <select
                  id="modal-plan"
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  {CHECKUP_PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} ({formatCurrency(plan.price)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="modal-date" className="block text-xs font-medium text-slate-700 mb-1">
                Appointment Date
              </label>
              <select
                id="modal-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
              >
                {UPCOMING_DATES.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="block text-xs font-medium text-slate-700 mb-1.5">
                Available Time Slots
              </p>
              <div className="grid grid-cols-3 gap-2">
                {slotsList.map((slot) => {
                  const isTaken = takenSlots.has(slot);
                  const isSelected = timeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 px-2 text-xs font-mono tabular-nums rounded-lg border transition-colors ${
                        isTaken
                          ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                          : isSelected
                          ? 'bg-teal-700 text-white border-teal-700 cursor-pointer'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-teal-700 cursor-pointer'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {errors.timeSlot && <p className="mt-1 text-xs text-red-700">{errors.timeSlot}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label htmlFor="modal-name" className="block text-xs font-medium text-slate-700 mb-1">
                  Patient Full Name
                </label>
                <input
                  id="modal-name"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Asha Menon"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
                {errors.patientName && (
                  <p className="mt-1 text-xs text-red-700">{errors.patientName}</p>
                )}
              </div>

              <div>
                <label htmlFor="modal-age" className="block text-xs font-medium text-slate-700 mb-1">
                  Age
                </label>
                <input
                  id="modal-age"
                  type="number"
                  min={1}
                  max={115}
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="24"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
                {errors.patientAge && (
                  <p className="mt-1 text-xs text-red-700">{errors.patientAge}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="modal-phone" className="block text-xs font-medium text-slate-700 mb-1">
                  Mobile Number
                </label>
                <input
                  id="modal-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="modal-donor" className="block text-xs font-medium text-slate-700 mb-1">
                  Blood Donor Pass (Optional 20% off)
                </label>
                <input
                  id="modal-donor"
                  type="text"
                  value={donorPassInput}
                  onChange={(e) => setDonorPassInput(e.target.value)}
                  placeholder="e.g. DONOR-O+-712"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
                {registeredDonors.length > 0 && !donorPassInput && (
                  <button
                    type="button"
                    onClick={() => setDonorPassInput(registeredDonors[0].donorPassCode)}
                    className="mt-1 text-xs font-medium text-teal-700 hover:underline cursor-pointer"
                  >
                    Use {registeredDonors[0].donorPassCode}
                  </button>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-sm">
              <div>
                <p className="text-slate-600">
                  Payable at Reception{' '}
                  {isDonorPassValid && (
                    <span className="text-teal-800 font-medium">(20% Donor Discount Applied)</span>
                  )}
                </p>
              </div>
              <p className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                {formatCurrency(finalFee)}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer"
              >
                Confirm Slot
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
