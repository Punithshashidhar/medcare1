import React from 'react';
import { HOSPITAL_INFO } from '../data/hospitalData';
import { MedplexLogo } from './MedplexLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-3">
            <MedplexLogo variant="horizontal" tone="dark" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Affordable multi-specialty medical care, transparent consultation fees, 24/7 emergency
              ambulance support, and community blood donation benefits.
            </p>
            <p className="text-xs text-slate-400">{HOSPITAL_INFO.address}</p>
          </div>

          <div className="md:col-span-4 space-y-2 text-sm">
            <h3 className="text-sm font-semibold text-white">Hospital Contacts</h3>
            <p className="text-slate-400">
              24/7 Emergency:{' '}
              <span className="font-mono text-white">{HOSPITAL_INFO.emergencyPhone}</span>
            </p>
            <p className="text-slate-400">
              OPD Reception:{' '}
              <span className="font-mono text-slate-200">{HOSPITAL_INFO.receptionPhone}</span>
            </p>
            <p className="text-slate-400">Email: {HOSPITAL_INFO.email}</p>
            <p className="text-xs text-slate-400 pt-1">{HOSPITAL_INFO.opdHours}</p>
          </div>

          <div className="md:col-span-3 space-y-2 text-sm">
            <h3 className="text-sm font-semibold text-white">Quick Sections</h3>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a href="#doctors" className="hover:text-white transition-colors">
                  Doctors & Slot Booking
                </a>
              </li>
              <li>
                <a href="#checkups" className="hover:text-white transition-colors">
                  Preventive Checkup Plans
                </a>
              </li>
              <li>
                <a href="#equipment" className="hover:text-white transition-colors">
                  Diagnostic Machines
                </a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-white transition-colors">
                  Bed Charges (₹400/day) &amp; Canteen
                </a>
              </li>
              <li>
                <a href="#blood-discount" className="hover:text-white transition-colors">
                  Free Blood Donation &amp; 20% Off
                </a>
              </li>
              <li>
                <a href="#ambulance" className="hover:text-white transition-colors">
                  24/7 Ambulance Dispatch
                </a>
              </li>
              <li>
                <a href="#portals" className="hover:text-white transition-colors">
                  Patient &amp; Doctor Login Portals
                </a>
              </li>
              <li>
                <a href="#presentation-guide" className="hover:text-white transition-colors">
                  10-Slide Viva &amp; Speaker Guide
                </a>
              </li>
              <li>
                <a
                  href="/Medplex_Hospital_Website_Guide.pptx"
                  download="Medplex_Hospital_Website_Guide.pptx"
                  className="text-teal-300 hover:text-white transition-colors"
                >
                  Download Patient Guide (.pptx)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© 2026 {HOSPITAL_INFO.name}. All patient fee schedules published transparently.</p>
          <p>Community Healthcare & Academic Project Portal</p>
        </div>
      </div>
    </footer>
  );
};
