import React, { useState } from 'react';
import { AppointmentBooking, AmbulanceDispatch, DonorRegistration } from '../types/hospital';
import { formatCurrency } from '../utils/hospitalLogic';

interface MyRecordsSectionProps {
  appointments: AppointmentBooking[];
  donors: DonorRegistration[];
  dispatches: AmbulanceDispatch[];
  onCancelAppointment: (id: string) => void;
}

export const MyRecordsSection: React.FC<MyRecordsSectionProps> = ({
  appointments,
  donors,
  dispatches,
  onCancelAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'donors' | 'ambulance'>('appointments');

  return (
    <section id="my-records" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal-700">08. Saved Session Records</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              My Bookings, Donor Passes & Dispatches
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              All booked appointment slots, checkup plans, donor discount passes, and ambulance
              dispatches are stored locally so they remain available across page reloads.
            </p>
          </div>

          <div role="tablist" aria-label="Record categories" className="flex flex-wrap gap-2">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'appointments'}
              onClick={() => setActiveTab('appointments')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'appointments'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Appointments & Checkups ({appointments.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'donors'}
              onClick={() => setActiveTab('donors')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'donors'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Blood Donor Passes ({donors.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'ambulance'}
              onClick={() => setActiveTab('ambulance')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'ambulance'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Ambulance Logs ({dispatches.length})
            </button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'appointments' && (
            <div data-testid="appointments-list" className="space-y-3">
              {appointments.length === 0 ? (
                <div className="p-8 rounded-xl border border-slate-200 bg-slate-50 text-center text-sm text-slate-600">
                  No appointments or checkup plans booked yet. Select any doctor or checkup plan
                  above to book a slot.
                </div>
              ) : (
                appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs font-mono text-teal-800">
                        Token {appt.tokenNumber} · {appt.status}
                      </p>
                      <h3 className="mt-0.5 text-base font-bold text-slate-900">
                        {appt.title} — <span className="font-medium text-slate-700">{appt.patientName}</span>
                      </h3>
                      <p className="mt-1 text-xs text-slate-600">
                        {appt.departmentOrCategory} · {appt.date} at{' '}
                        <span className="font-mono">{appt.timeSlot}</span> · Phone {appt.phone}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-base font-bold text-slate-900 font-mono tabular-nums">
                          {formatCurrency(appt.finalFee)}
                        </p>
                        {appt.discountApplied > 0 && (
                          <p className="text-xs text-teal-800 tabular-nums">
                            20% Donor off (−{formatCurrency(appt.discountApplied)})
                          </p>
                        )}
                      </div>
                      {appt.status === 'Confirmed' && (
                        <button
                          type="button"
                          onClick={() => onCancelAppointment(appt.id)}
                          aria-label={`Cancel booking ${appt.tokenNumber}`}
                          className="px-3 py-1.5 text-xs font-medium text-red-700 bg-white hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'donors' && (
            <div data-testid="donors-list" className="space-y-3">
              {donors.length === 0 ? (
                <div className="p-8 rounded-xl border border-slate-200 bg-slate-50 text-center text-sm text-slate-600">
                  No donor passes registered yet. Use the Free Blood Donation form above to
                  generate a 20% off pass.
                </div>
              ) : (
                donors.map((donor) => (
                  <div
                    key={donor.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-mono text-teal-800">
                        Pass {donor.donorPassCode} · {donor.discountPercent}% Total Bill Discount
                      </p>
                      <h3 className="mt-0.5 text-base font-bold text-slate-900">
                        {donor.fullName} · Blood Group {donor.bloodGroup}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600">
                        Scheduled {donor.preferredDate} · Age {donor.age} yrs · Weight{' '}
                        {donor.weightKg} kg
                      </p>
                    </div>
                    <span className="text-xs font-medium text-teal-800">Active Donor Credit</span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'ambulance' && (
            <div data-testid="ambulance-list" className="space-y-3">
              {dispatches.length === 0 ? (
                <div className="p-8 rounded-xl border border-slate-200 bg-slate-50 text-center text-sm text-slate-600">
                  No ambulance dispatches requested in this session.
                </div>
              ) : (
                dispatches.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-mono text-red-700">
                        {item.dispatchCode} · Vehicle {item.vehicleNumber} · {item.status}
                      </p>
                      <h3 className="mt-0.5 text-base font-bold text-slate-900">
                        {item.tierName} — {item.emergencyType}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600">
                        Caller: {item.callerName} ({item.phone}) · Pickup: {item.pickupAddress}
                      </p>
                    </div>
                    <p className="text-sm font-mono font-semibold text-teal-800 tabular-nums shrink-0">
                      ETA {item.etaMinutes} mins
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
