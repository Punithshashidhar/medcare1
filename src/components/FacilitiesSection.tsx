import React from 'react';
import { BedDouble, UtensilsCrossed } from 'lucide-react';
import { CANTEEN_INFO, CANTEEN_MENU, WARD_OPTIONS } from '../data/hospitalData';
import { formatCurrency } from '../utils/hospitalLogic';

interface FacilitiesSectionProps {
  onEstimateStay: (wardId: string) => void;
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({ onEstimateStay }) => {
  return (
    <section id="facilities" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium text-teal-700">
            04. Inpatient Bed Charges &amp; Hospital Canteen
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Affordable Admit Beds (₹400/day) &amp; Hygienic Canteen
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Transparent daily bed charges for admitted patients starting at ₹400 per day in the
            General Ward, paired with a clean in-house hospital canteen serving nutritious meals
            for patients, families, and students.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Admit Bed Charges */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-teal-700" />
                <h3 className="text-lg font-bold text-slate-900">Admit Ward &amp; Bed Charges</h3>
              </div>
              <span className="text-xs font-medium text-teal-800">
                20% off with Blood Donor Pass
              </span>
            </div>

            <div className="space-y-3">
              {WARD_OPTIONS.map((ward) => {
                const isGeneral = ward.id === 'ward-general';
                return (
                  <article
                    key={ward.id}
                    className={`p-4 rounded-xl border ${
                      isGeneral
                        ? 'bg-teal-50/50 border-teal-200'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-teal-700">
                          {ward.availableBeds} of {ward.totalBeds} beds available
                        </p>
                        <h4 className="mt-0.5 text-base font-bold text-slate-900">{ward.name}</h4>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                          {formatCurrency(ward.ratePerDay)}
                          <span className="text-xs font-sans font-normal text-slate-500"> / day</span>
                        </p>
                        <p className="text-xs text-teal-800 tabular-nums">
                          {formatCurrency(Math.round(ward.ratePerDay * 0.8))}/day donor rate
                        </p>
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">{ward.includedCare}</p>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex justify-end">
                      <a
                        href="#blood-discount"
                        onClick={() => onEstimateStay(ward.id)}
                        className="text-xs font-semibold text-teal-800 hover:underline"
                      >
                        Estimate stay in Bill Calculator
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Right: Hospital Canteen Facility */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-teal-700" />
              <h3 className="text-lg font-bold text-slate-900">Hospital Canteen &amp; Patient Diet</h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-1">
              <p className="font-medium text-slate-900">{CANTEEN_INFO.location}</p>
              <p className="text-xs text-slate-600">{CANTEEN_INFO.hours}</p>
              <p className="text-xs text-teal-800 pt-1">{CANTEEN_INFO.hygieneNote}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
              {CANTEEN_MENU.map((item) => (
                <div key={item.id} className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">{item.timing}</p>
                    <h4 className="mt-0.5 text-sm font-bold text-slate-900">{item.name}</h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.details}</p>
                  </div>
                  <p className="text-base font-bold text-slate-900 font-mono tabular-nums shrink-0">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
