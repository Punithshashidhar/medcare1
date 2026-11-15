import React, { useState } from 'react';
import { PhoneCall, CalendarCheck, Building2 } from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

interface HeroSectionProps {
  onOpenBooking: () => void;
  totalSavedRecords: number;
}

const HERO_IMAGE = '/src/assets/images/hero_medplex_hospital_1794718422766.jpg';

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  totalSavedRecords,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <p className="text-sm font-medium text-teal-700 mb-3">
                {HOSPITAL_INFO.shortTagline} · Emergency {HOSPITAL_INFO.emergencyPhone}
              </p>

              <h1 className="text-[clamp(2.15rem,3.6vw,3.35rem)] font-bold tracking-tight text-slate-900 leading-[1.12] text-balance">
                Quality healthcare with transparent, affordable fees for every family.
              </h1>

              <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-xl">
                Consult general physicians from <span className="font-semibold text-slate-900 tabular-nums">₹150</span> and
                specialists in orthopedics, neurology, gynecology, and cardiology. Donate blood
                voluntarily to unlock a flat <span className="font-semibold text-teal-800">20% discount</span> on your total hospital bill.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book Doctor Slot</span>
                </button>

                <a
                  href="#ambulance"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>24/7 Ambulance</span>
                </a>

                <a
                  href="#portals"
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Patient &amp; Doctor Login</span>
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-1.5">
              <p>{HOSPITAL_INFO.opdHours}</p>
              <p>{HOSPITAL_INFO.address}</p>
              <p className="pt-1 text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Class &amp; Viva Presentation:</span>
                <a
                  href="/Medplex_Hospital_Website_Guide.pptx"
                  download="Medplex_Hospital_Website_Guide.pptx"
                  className="font-semibold text-teal-700 hover:text-teal-900 underline underline-offset-2"
                >
                  Download PowerPoint (.pptx)
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="#presentation-guide"
                  className="font-medium text-slate-700 hover:text-slate-900 underline underline-offset-2"
                >
                  View 10-Slide Speaker Guide
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="#my-records"
                  className="font-medium text-slate-700 hover:text-teal-800 underline underline-offset-2"
                >
                  My Bookings ({totalSavedRecords})
                </a>
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[260px] lg:min-h-[380px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              {!imgError ? (
                <img
                  src={HERO_IMAGE}
                  alt="Medplex Hospital main glass entrance and landscaped courtyard"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-100 to-teal-50">
                  <Building2 className="w-12 h-12 text-teal-700 mb-3" />
                  <p className="text-base font-semibold text-slate-900">Medplex Hospital Campus</p>
                  <p className="text-sm text-slate-600 mt-1">{HOSPITAL_INFO.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500">General OPD Consultation</p>
            <p className="mt-1 text-xl font-bold text-slate-900 font-mono tabular-nums">₹150</p>
            <p className="mt-0.5 text-xs text-slate-600">Specialists from ₹200 – ₹350</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500">Emergency & Ambulance</p>
            <p className="mt-1 text-xl font-bold text-slate-900 font-mono tabular-nums">24 / 7</p>
            <p className="mt-0.5 text-xs text-slate-600">BLS free within 5 km radius</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500">Blood Donation Benefit</p>
            <p className="mt-1 text-xl font-bold text-teal-800 font-mono tabular-nums">20% Off</p>
            <p className="mt-0.5 text-xs text-slate-600">Applied on total hospital bill</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500">Checkups & Machines</p>
            <p className="mt-1 text-xl font-bold text-slate-900 font-mono tabular-nums">4 + 8</p>
            <p className="mt-0.5 text-xs text-slate-600">4 Checkup plans · 8 Diagnostic units</p>
          </div>
        </div>
      </div>
    </section>
  );
};
