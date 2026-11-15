import React, { useState } from 'react';
import { Microscope } from 'lucide-react';
import { MEDICAL_MACHINES } from '../data/hospitalData';
import { EquipmentCategory } from '../types/hospital';
import { formatCurrency } from '../utils/hospitalLogic';

const MRI_IMAGE = '/src/assets/images/medical_imaging_mri_1794718340990.jpg';

const CATEGORIES: Array<EquipmentCategory | 'All'> = [
  'All',
  'Imaging & Scans',
  'Laboratory & Blood',
  'Rehab & Critical Care',
];

export const EquipmentSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | 'All'>('All');
  const [imgError, setImgError] = useState(false);

  const visibleMachines =
    selectedCategory === 'All'
      ? MEDICAL_MACHINES
      : MEDICAL_MACHINES.filter((m) => m.category === selectedCategory);

  return (
    <section id="equipment" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-sm font-medium text-teal-700">03. Diagnostic & Treatment Equipment</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              In-House Scans, Lab Analyzers & Rehab Machines
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              Patients do not need to visit outside labs. Every major diagnostic scanner, blood
              analyzer, and physiotherapy unit is available inside Medplex with clear, student-ready
              explanations of how each machine assists treatment.
            </p>

            <div
              role="tablist"
              aria-label="Filter equipment by category"
              className="mt-6 flex flex-wrap gap-2"
            >
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="h-full min-h-[220px] rounded-xl overflow-hidden border border-slate-200 bg-white">
              {!imgError ? (
                <img
                  src={MRI_IMAGE}
                  alt="Medplex Hospital 3T MRI diagnostic imaging suite with technician workstation"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
                  <Microscope className="w-10 h-10 text-teal-700 mb-2" />
                  <p className="text-sm font-semibold text-slate-900">Diagnostic Radiology Suite</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {visibleMachines.map((machine) => (
            <article
              key={machine.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-medium text-teal-700">
                  {machine.category} · {machine.department}
                </p>
                <h3 className="mt-1.5 text-base font-bold text-slate-900 leading-snug">
                  {machine.name}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {machine.plainExplanation}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Used for:</span> {machine.clinicalUse}
                </p>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">{machine.availability}</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(machine.scanFee)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
