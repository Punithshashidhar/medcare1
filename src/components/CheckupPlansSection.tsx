import React from 'react';
import { Check, Clock } from 'lucide-react';
import { CHECKUP_PLANS } from '../data/hospitalData';
import { CheckupPlan } from '../types/hospital';
import { formatCurrency } from '../utils/hospitalLogic';

interface CheckupPlansSectionProps {
  onSelectCheckupPlan: (plan: CheckupPlan) => void;
}

export const CheckupPlansSection: React.FC<CheckupPlansSectionProps> = ({
  onSelectCheckupPlan,
}) => {
  return (
    <section id="checkups" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium text-teal-700">02. Preventive Health Checkup Plans</p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            All-In-One Affordable Checkup Packages
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Dedicated screening plans for eyes, blood panels, bone & joint mobility, and complete
            full-body wellness with same-day digital reports.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {CHECKUP_PLANS.map((plan) => {
            const donorPrice = Math.round(plan.price * 0.8);
            return (
              <article
                key={plan.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-teal-700">
                        {plan.category} · {plan.duration}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-slate-900">{plan.name}</h3>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                        {formatCurrency(plan.price)}
                      </p>
                      <p className="text-xs text-teal-800 font-medium tabular-nums">
                        {formatCurrency(donorPrice)} with Blood Donor Pass
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{plan.summary}</p>

                  <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{plan.fastingRequired}</span>
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                    {plan.includedTests.map((testName) => (
                      <li key={testName} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                        <span>{testName}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">{plan.recommendedFor}</span>
                  <button
                    type="button"
                    onClick={() => onSelectCheckupPlan(plan)}
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Book Checkup
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
