import React, { useMemo, useState } from 'react';
import { Search, Clock, Calendar } from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { DepartmentName, Doctor } from '../types/hospital';
import { filterDoctors, formatCurrency } from '../utils/hospitalLogic';

interface DoctorsSectionProps {
  onSelectDoctorSlot: (doctor: Doctor, preselectedSlot?: string) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ onSelectDoctorSlot }) => {
  const [selectedDept, setSelectedDept] = useState<DepartmentName | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = useMemo(
    () => filterDoctors(DOCTORS, selectedDept, searchQuery),
    [selectedDept, searchQuery]
  );

  return (
    <section id="doctors" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal-700">01. Doctors & Appointment Slots</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              General & Specialized Doctors
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Fixed, low-cost consultation fees across every department. Pick any specialist and
              reserve an exact time slot with zero hidden charges.
            </p>
          </div>

          <div className="w-full md:w-72">
            <label htmlFor="doctor-search" className="sr-only">
              Search doctors or symptoms
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="doctor-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctor, knee, migraine..."
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
              />
            </div>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Filter doctors by specialty"
          className="mt-6 flex flex-wrap gap-2"
        >
          {(['All', ...DEPARTMENTS] as const).map((dept) => {
            const isActive = selectedDept === dept;
            return (
              <button
                key={dept}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="mt-8 p-8 bg-white rounded-xl border border-slate-200 text-center">
            <p className="text-base font-semibold text-slate-900">
              No doctors matched &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Try clearing the search box or switching back to All departments.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDept('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-sm font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-teal-700">
                        {doctor.department} · {doctor.roomNumber}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">{doctor.name}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-500">OPD Fee</p>
                      <p className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                        {formatCurrency(doctor.consultationFee)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {doctor.qualification} · {doctor.experienceYears} yrs experience
                  </p>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {doctor.focusAreas}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {doctor.scheduleDays}
                    </span>
                    <span>{doctor.languages}</span>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Quick Slots</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {doctor.slots.slice(0, 3).map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => onSelectDoctorSlot(doctor, slot)}
                          className="px-2.5 py-1.5 text-xs font-mono tabular-nums text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 hover:border-teal-300 rounded-md transition-colors cursor-pointer"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 tabular-nums">
                    Donor discount: {formatCurrency(Math.round(doctor.consultationFee * 0.8))}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectDoctorSlot(doctor)}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-teal-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Book Slot
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
