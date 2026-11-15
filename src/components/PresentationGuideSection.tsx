import React from 'react';
import { Download, Presentation } from 'lucide-react';

interface SlideGuideItem {
  number: string;
  title: string;
  talkingPoint: string;
}

const SLIDE_OUTLINE: SlideGuideItem[] = [
  {
    number: '01',
    title: 'Cover: Hospital Website Information & Patient Guide',
    talkingPoint:
      'Introduce Medplex Hospital as a college-level community portal built with clear fees and simple navigation.',
  },
  {
    number: '02',
    title: 'Overview & Why It Is Easy to Explain',
    talkingPoint:
      'Highlight real doctor profiles (no placeholder entries), plain-language labels, and affordable ₹150 OPD access.',
  },
  {
    number: '03',
    title: 'Website Structure: 7 Clear Sections',
    talkingPoint:
      'Walk through the top-to-bottom layout from Doctors and Checkups down to Facilities, Blood Discount, and Ambulance.',
  },
  {
    number: '04',
    title: 'Step 1: Specialist Search & Slot Booking',
    talkingPoint:
      'Explain how patients filter by Orthopedics, Neurology, Gynecology, Cardiology, or General Medicine and pick a free time slot.',
  },
  {
    number: '05',
    title: 'Step 2: Preventive Checkup Plans',
    talkingPoint:
      'Show the 4 transparent packages: Eye (₹299), Blood (₹450), Mobility (₹599), and Overall Body Checkup (₹899).',
  },
  {
    number: '06',
    title: 'Step 3: Diagnostic & Treatment Machines',
    talkingPoint:
      'Explain how MRI, 128-Slice CT, Digital X-Ray/DEXA, 4D Ultrasound, and ICU gear are described in plain words for patients.',
  },
  {
    number: '07',
    title: 'Step 4: Admit Bed Charges (₹400/day) & Canteen',
    talkingPoint:
      'Point out the ₹400/day General Ward bed rate and the FSSAI-certified hospital canteen menu (₹35–₹80).',
  },
  {
    number: '08',
    title: 'Step 5: Free Blood Donation & 20% Total Bill Discount',
    talkingPoint:
      'Demonstrate how donating blood generates a Donor Pass that cuts 20% off consultations, checkups, scans, and bed stays.',
  },
  {
    number: '09',
    title: 'Steps 6 & 7: 24/7 Ambulance & Saved Patient Portal',
    talkingPoint:
      'Show instant BLS/ALS/Trauma ambulance dispatch (108 helpline) and localStorage persistence in My Bookings.',
  },
  {
    number: '10',
    title: 'Quick Viva Summary: Requirements to Features',
    talkingPoint:
      'Use this final slide for teacher Q&A to map every project requirement directly to its working website module.',
  },
];

const DEMO_STEPS = [
  'Book Dr. Arvind Deshmukh (Orthopedics, ₹250) at 10:00 AM and show that the booked slot automatically locks.',
  'Register a blood donor in Section 05 to generate a DONOR- pass and watch the blood bank unit count increase by 1.',
  'Select General Ward Bed (₹400/day × 3 days) in the Bill Calculator with the 20% Donor Discount applied live.',
];

export const PresentationGuideSection: React.FC = () => {
  return (
    <section id="presentation-guide" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 sm:p-7">
            <p className="text-sm font-medium text-teal-700">
              09. Separate PowerPoint &amp; Viva Kit
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Download Presentation (.pptx)
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Use this standalone 10-slide PowerPoint deck to explain what information the Medplex
              Hospital website contains and how patients use each facility during class or project
              viva.
            </p>

            <div className="mt-5 pt-5 border-t border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>File Name</span>
                <span className="font-mono text-slate-900 truncate">
                  Medplex_Hospital_Website_Guide.pptx
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Format &amp; Length</span>
                <span className="font-mono tabular-nums text-slate-900">
                  10 Slides · 16:9 Widescreen
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Compatible With</span>
                <span className="text-slate-900">PowerPoint, Google Slides, LibreOffice</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href="/Medplex_Hospital_Website_Guide.pptx"
                download="Medplex_Hospital_Website_Guide.pptx"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download PowerPoint (.pptx)</span>
              </a>

              <a
                href="#doctors"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Presentation className="w-4 h-4" />
                <span>Start Live Website Walkthrough</span>
              </a>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">
                2-Minute Live Demo Flow for Teacher
              </h3>
              <ol className="mt-3 space-y-2.5">
                {DEMO_STEPS.map((step, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                    <span className="font-mono font-semibold text-teal-800 tabular-nums shrink-0">
                      {index + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  10-Slide Speaker Notes for Students &amp; Faculty
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Follow these talking points alongside the downloaded PowerPoint slides.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 tabular-nums shrink-0">
                Slides 01 – 10
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SLIDE_OUTLINE.map((slide) => (
                <article
                  key={slide.number}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-mono font-semibold text-teal-800 tabular-nums">
                      Slide {slide.number}
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-slate-900 leading-snug">
                      {slide.title}
                    </h4>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {slide.talkingPoint}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
