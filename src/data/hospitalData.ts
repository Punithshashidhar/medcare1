import {
  AmbulanceDispatch,
  AmbulanceTier,
  AppointmentBooking,
  BloodGroupStock,
  CanteenMenuItem,
  CheckupPlan,
  DepartmentName,
  DonorRegistration,
  MedicalMachine,
  WardOption,
} from '../types/hospital';

export const HOSPITAL_INFO = {
  name: 'Medplex Hospital',
  shortTagline: 'Affordable Multi-Specialty & Community Care',
  address: '42 University Road, Health Science Campus, Bengaluru 560012',
  emergencyPhone: '108 / +91 80 4120 2400',
  receptionPhone: '+91 80 4120 2100',
  email: 'care@medplexhospital.org',
  opdHours: 'Mon – Sat: 8:00 AM – 8:00 PM · Sunday Urgent OPD: 9:00 AM – 2:00 PM',
  bloodDonorDiscountPercent: 20,
  studentSeniorConcessionPercent: 10,
};

export const DEPARTMENTS: DepartmentName[] = [
  'General Medicine',
  'Orthopedics',
  'Neurology',
  'Gynecology',
  'Cardiology',
  'Pediatrics',
  'Ophthalmology',
  'ENT',
];

export const DOCTORS = [
  {
    id: 'doc-rajeshwari',
    name: 'Dr. Rajeshwari Nair',
    department: 'General Medicine' as DepartmentName,
    qualification: 'MBBS, MD (Internal Medicine)',
    experienceYears: 12,
    consultationFee: 150,
    roomNumber: 'OPD 102',
    scheduleDays: 'Mon – Sat',
    languages: 'English, Hindi, Malayalam',
    focusAreas: 'Fever, diabetes management, hypertension, seasonal infections',
    slots: ['09:00 AM', '09:45 AM', '10:30 AM', '11:30 AM', '04:00 PM', '05:15 PM'],
  },
  {
    id: 'doc-harishankar',
    name: 'Dr. Harishankar Verma',
    department: 'General Medicine' as DepartmentName,
    qualification: 'MBBS, DNB (Family Medicine)',
    experienceYears: 9,
    consultationFee: 150,
    roomNumber: 'OPD 104',
    scheduleDays: 'Mon – Sun',
    languages: 'English, Hindi, Kannada',
    focusAreas: 'Primary care, preventive screenings, student health, respiratory illness',
    slots: ['09:30 AM', '10:15 AM', '12:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'],
  },
  {
    id: 'doc-arvind',
    name: 'Dr. Arvind Deshmukh',
    department: 'Orthopedics' as DepartmentName,
    qualification: 'MBBS, MS (Orthopedics)',
    experienceYears: 15,
    consultationFee: 250,
    roomNumber: 'OPD 204',
    scheduleDays: 'Mon – Sat',
    languages: 'English, Hindi, Marathi',
    focusAreas: 'Fracture care, knee & spine pain, sports injuries, arthritis mobility',
    slots: ['09:15 AM', '10:00 AM', '11:15 AM', '02:30 PM', '04:30 PM', '06:00 PM'],
  },
  {
    id: 'doc-kavitha',
    name: 'Dr. Kavitha Subramanian',
    department: 'Neurology' as DepartmentName,
    qualification: 'MBBS, MD, DM (Neurology)',
    experienceYears: 11,
    consultationFee: 300,
    roomNumber: 'OPD 301',
    scheduleDays: 'Mon – Fri',
    languages: 'English, Tamil, Kannada',
    focusAreas: 'Migraine, epilepsy, stroke recovery, nerve compression & neuropathy',
    slots: ['10:00 AM', '10:45 AM', '11:45 AM', '03:00 PM', '04:15 PM'],
  },
  {
    id: 'doc-sneha',
    name: 'Dr. Sneha Kulkarni',
    department: 'Gynecology' as DepartmentName,
    qualification: 'MBBS, MS (OBG)',
    experienceYears: 14,
    consultationFee: 250,
    roomNumber: 'OPD 208',
    scheduleDays: 'Mon – Sat',
    languages: 'English, Hindi, Kannada',
    focusAreas: 'Antenatal care, PCOS clinic, adolescent & maternal wellness',
    slots: ['09:00 AM', '10:30 AM', '12:00 PM', '04:00 PM', '05:30 PM'],
  },
  {
    id: 'doc-vikramaditya',
    name: 'Dr. Vikramaditya Rao',
    department: 'Cardiology' as DepartmentName,
    qualification: 'MBBS, MD, DM (Cardiology)',
    experienceYears: 16,
    consultationFee: 350,
    roomNumber: 'OPD 305',
    scheduleDays: 'Mon – Sat',
    languages: 'English, Telugu, Hindi',
    focusAreas: 'ECG & Echo evaluation, chest pain triage, lipid & blood pressure care',
    slots: ['09:30 AM', '11:00 AM', '12:15 PM', '04:30 PM', '05:45 PM'],
  },
  {
    id: 'doc-farhan',
    name: 'Dr. Farhan Siddiqui',
    department: 'Pediatrics' as DepartmentName,
    qualification: 'MBBS, MD (Pediatrics)',
    experienceYears: 10,
    consultationFee: 200,
    roomNumber: 'OPD 109',
    scheduleDays: 'Mon – Sun',
    languages: 'English, Hindi, Urdu',
    focusAreas: 'Child immunization, growth tracking, pediatric nutrition & fever',
    slots: ['09:00 AM', '10:00 AM', '11:30 AM', '04:30 PM', '06:00 PM', '07:00 PM'],
  },
  {
    id: 'doc-ananya',
    name: 'Dr. Ananya Chatterjee',
    department: 'Ophthalmology' as DepartmentName,
    qualification: 'MBBS, MS (Ophthalmology)',
    experienceYears: 8,
    consultationFee: 200,
    roomNumber: 'OPD 212',
    scheduleDays: 'Mon – Sat',
    languages: 'English, Bengali, Hindi',
    focusAreas: 'Vision correction, cataract screening, glaucoma & diabetic retina exam',
    slots: ['09:15 AM', '10:30 AM', '11:45 AM', '03:15 PM', '04:45 PM'],
  },
  {
    id: 'doc-raghuveer',
    name: 'Dr. Raghuveer Bhat',
    department: 'ENT' as DepartmentName,
    qualification: 'MBBS, MS (ENT)',
    experienceYears: 13,
    consultationFee: 200,
    roomNumber: 'OPD 206',
    scheduleDays: 'Mon – Sat',
    languages: 'English, Kannada, Hindi',
    focusAreas: 'Sinusitis, ear infections, throat care, hearing & vertigo evaluation',
    slots: ['09:30 AM', '10:45 AM', '12:00 PM', '04:00 PM', '05:30 PM'],
  },
];

export const CHECKUP_PLANS: CheckupPlan[] = [
  {
    id: 'plan-eye',
    name: 'Eye Checkup Plan',
    category: 'Ophthalmology Screening',
    price: 299,
    duration: '45 mins',
    fastingRequired: 'No fasting required',
    summary:
      'Complete vision refraction, intraocular pressure check for glaucoma, and retinal exam for screen fatigue or diabetes.',
    includedTests: [
      'Digital Visual Acuity & Power Refraction',
      'Slit-Lamp Cornea & Lens Examination',
      'Intraocular Pressure (Glaucoma) Check',
      'Ophthalmologist Consultation Review',
    ],
    recommendedFor: 'Students, daily screen users, and adults over 35',
  },
  {
    id: 'plan-blood',
    name: 'Blood Checkup Plan',
    category: 'Hematology & Metabolic Lab',
    price: 450,
    duration: '30 mins sample + same-day report',
    fastingRequired: '8–10 hours overnight water-only fasting',
    summary:
      'Essential laboratory blood panel checking hemoglobin, blood sugar, cholesterol, and thyroid function in one visit.',
    includedTests: [
      'Complete Blood Count (CBC) & ESR',
      'Fasting Blood Sugar & HbA1c',
      'Lipid Profile (Cholesterol & Triglycerides)',
      'Thyroid Stimulating Hormone (TSH)',
    ],
    recommendedFor: 'Annual metabolic health tracking and fatigue evaluation',
  },
  {
    id: 'plan-mobility',
    name: 'Mobility & Joint Checkup Plan',
    category: 'Orthopedics & Rehabilitation',
    price: 599,
    duration: '60 mins',
    fastingRequired: 'No fasting required',
    summary:
      'Designed for joint stiffness, back pain, and sports recovery with bone mineral density screening and gait assessment.',
    includedTests: [
      'Bone Mineral Density (DEXA Hip & Spine)',
      'Serum Vitamin D & Calcium Levels',
      'Joint Range-of-Motion & Gait Analysis',
      'Orthopedic Specialist Consultation',
    ],
    recommendedFor: 'Athletes, desk workers with back/neck strain, and seniors',
  },
  {
    id: 'plan-overall',
    name: 'General Overall Body Checkup',
    category: 'Comprehensive Preventive Panel',
    price: 899,
    duration: '2.5 hours · Breakfast included',
    fastingRequired: '10 hours overnight fasting',
    summary:
      'Head-to-toe preventive baseline covering heart, liver, kidney, blood count, chest imaging, and doctor review.',
    includedTests: [
      'CBC, Fasting Sugar, Lipid, Liver (LFT) & Kidney (KFT) Panels',
      '12-Lead Resting ECG & Chest X-Ray',
      'Urine Routine & Blood Pressure Screening',
      'Full Report Review with General Physician',
    ],
    recommendedFor: 'Complete yearly family health checkup',
  },
];

export const MEDICAL_MACHINES: MedicalMachine[] = [
  {
    id: 'mach-mri',
    name: '3T Wide-Bore MRI Scanner',
    category: 'Imaging & Scans',
    department: 'Neurology & Orthopedics',
    availability: '24/7 Emergency & Scheduled Slots',
    scanFee: 2400,
    plainExplanation:
      'Uses strong magnetic fields and radio waves—no X-ray radiation—to create sharp 3D pictures of the brain, spine, and knee ligaments.',
    clinicalUse: 'Brain migraine/stroke evaluation, slipped disc, ACL ligament tears',
  },
  {
    id: 'mach-ct',
    name: '128-Slice Low-Dose CT Scanner',
    category: 'Imaging & Scans',
    department: 'Emergency, Chest & Neurology',
    availability: '24/7 Emergency Ready',
    scanFee: 1450,
    plainExplanation:
      'Takes rapid cross-section X-ray slices in under 15 seconds to spot internal bleeding, lung infections, or bone fractures quickly.',
    clinicalUse: 'Head trauma triage, chest imaging, kidney stone detection',
  },
  {
    id: 'mach-dexa',
    name: 'Digital X-Ray & DEXA Bone Densitometer',
    category: 'Imaging & Scans',
    department: 'Orthopedics & Mobility',
    availability: 'Mon – Sun · 8:00 AM – 8:00 PM',
    scanFee: 350,
    plainExplanation:
      'Digital X-ray checks bone fractures immediately, while DEXA measures bone calcium strength to detect early osteoporosis.',
    clinicalUse: 'Fracture confirmation, chest screening, bone density measurement',
  },
  {
    id: 'mach-ultrasound',
    name: '4D Color Doppler Ultrasound',
    category: 'Imaging & Scans',
    department: 'Gynecology & Cardiology',
    availability: 'Mon – Sat · 8:30 AM – 7:00 PM',
    scanFee: 650,
    plainExplanation:
      'Uses safe sound waves with zero radiation to view live organ motion, pregnancy growth, and blood flow speed inside arteries.',
    clinicalUse: 'Antenatal baby scans, abdominal checkups, vein blood-flow Doppler',
  },
  {
    id: 'mach-hematology',
    name: 'Automated Hematology & Biochemistry Analyzer',
    category: 'Laboratory & Blood',
    department: 'Central Pathology Lab',
    availability: '24/7 Lab Processing',
    scanFee: 250,
    plainExplanation:
      'Automatically counts red cells, white cells, platelets, and measures blood sugar, liver, and kidney markers from a single small vial.',
    clinicalUse: 'CBC, blood grouping, HbA1c, liver & kidney function panels',
  },
  {
    id: 'mach-oct',
    name: 'Slit-Lamp Biomicroscope & OCT Retinal Scanner',
    category: 'Laboratory & Blood',
    department: 'Ophthalmology',
    availability: 'Mon – Sat · 9:00 AM – 6:30 PM',
    scanFee: 300,
    plainExplanation:
      'Magnifies the front lens of the eye and scans microscopic retinal layers non-invasively to catch glaucoma or diabetic eye changes early.',
    clinicalUse: 'Eye checkup plans, cataract grading, retinal nerve mapping',
  },
  {
    id: 'mach-gait',
    name: 'Robotic Gait & Mobility Rehabilitation Trainer',
    category: 'Rehab & Critical Care',
    department: 'Orthopedics & Physiotherapy',
    availability: 'Mon – Sat · 8:30 AM – 6:00 PM',
    scanFee: 400,
    plainExplanation:
      'Body-weight supported walking harness with pressure sensors that guides joint recovery after knee surgery, fractures, or stroke.',
    clinicalUse: 'Post-surgery walking rehab, balance training, posture correction',
  },
  {
    id: 'mach-icu',
    name: 'ICU Multi-Para Ventilator, Defibrillator & Dialysis Unit',
    category: 'Rehab & Critical Care',
    department: 'Emergency & Critical Care',
    availability: '24/7 Critical Support',
    scanFee: 1200,
    plainExplanation:
      'Continuous life-support machines that monitor heart rhythm and oxygen, assist breathing when needed, and filter blood during kidney care.',
    clinicalUse: 'Cardiac emergencies, respiratory support, scheduled kidney dialysis',
  },
];

export const INITIAL_BLOOD_STOCK: BloodGroupStock[] = [
  { group: 'O+', unitsAvailable: 28, status: 'Adequate' },
  { group: 'O-', unitsAvailable: 6, status: 'Priority Needed' },
  { group: 'A+', unitsAvailable: 19, status: 'Adequate' },
  { group: 'A-', unitsAvailable: 5, status: 'Priority Needed' },
  { group: 'B+', unitsAvailable: 24, status: 'Adequate' },
  { group: 'B-', unitsAvailable: 7, status: 'Priority Needed' },
  { group: 'AB+', unitsAvailable: 14, status: 'Adequate' },
  { group: 'AB-', unitsAvailable: 4, status: 'Priority Needed' },
];

export const AMBULANCE_TIERS: AmbulanceTier[] = [
  {
    id: 'bls',
    name: 'Basic Life Support (BLS)',
    responseTarget: '8–12 mins',
    feeLabel: 'Free within 5 km · ₹250 beyond',
    equipmentSummary: 'Oxygen cylinders, stretcher, spine board, first-aid & trained EMT',
  },
  {
    id: 'als',
    name: 'Advanced Cardiac Support (ALS)',
    responseTarget: '8–10 mins',
    feeLabel: '₹500 flat city dispatch',
    equipmentSummary: 'Defibrillator, 12-lead ECG monitor, infusion pumps, cardiac paramedic',
  },
  {
    id: 'trauma',
    name: 'Trauma & Neonatal ICU Van',
    responseTarget: '10–14 mins',
    feeLabel: '₹650 flat city dispatch',
    equipmentSummary: 'Portable ventilator, neonatal incubator, trauma stabilization kit',
  },
];

export const WARD_OPTIONS: WardOption[] = [
  {
    id: 'ward-general',
    name: 'General Ward Bed (Standard Admit)',
    ratePerDay: 400,
    availableBeds: 18,
    totalBeds: 40,
    includedCare: '24/7 nursing care, daily physician round, vitals monitoring & clean linen',
  },
  {
    id: 'ward-maternity',
    name: 'Maternity & Pediatric Ward',
    ratePerDay: 450,
    availableBeds: 6,
    totalBeds: 12,
    includedCare: 'Dedicated mother-child nursing, warmer access & attendant seating',
  },
  {
    id: 'ward-semi',
    name: 'Semi-Private Twin-Sharing Room',
    ratePerDay: 750,
    availableBeds: 5,
    totalBeds: 12,
    includedCare: '2-bed room with privacy curtain, attached washroom & attendant cot',
  },
  {
    id: 'ward-icu',
    name: 'Intensive Care Unit (ICU) Bed',
    ratePerDay: 1500,
    availableBeds: 4,
    totalBeds: 10,
    includedCare: 'Continuous cardiac monitor, oxygen pipeline & 1:1 critical care nurse',
  },
];

export const CANTEEN_INFO = {
  location: 'Ground Floor, East Wing (Adjacent to OPD Lobby)',
  hours: '6:30 AM – 10:00 PM Daily · Night Attendant Tea & Milk Counter: 24/7',
  hygieneNote: 'FSSAI certified kitchen · Doctor-approved low-oil patient diets & free ward tray delivery',
};

export const CANTEEN_MENU: CanteenMenuItem[] = [
  {
    id: 'cant-breakfast',
    name: 'Morning Breakfast Plate',
    timing: '6:30 AM – 10:30 AM',
    price: 35,
    details: 'Steamed idli / vegetable upma or warm oats porridge with milk',
  },
  {
    id: 'cant-soft-diet',
    name: 'Patient Soft Recovery Diet',
    timing: '11:30 AM – 9:30 PM',
    price: 45,
    details: 'Low-salt moong dal khichdi, fresh curd, boiled vegetables & clear soup',
  },
  {
    id: 'cant-thali',
    name: 'Wholesome Veg Hospital Thali',
    timing: '12:00 PM – 3:30 PM & 7:00 PM – 9:45 PM',
    price: 65,
    details: '2 whole-wheat rotis, steamed rice, dal, seasonal sabzi & buttermilk',
  },
  {
    id: 'cant-protein',
    name: 'High-Protein Recovery Bowl & Juice',
    timing: '10:00 AM – 8:30 PM',
    price: 80,
    details: 'Sprouts & paneer/egg-white salad with fresh unsweetened fruit juice',
  },
];

export const UPCOMING_DATES = [
  { key: '2026-11-15', label: 'Tomorrow · Sun, Nov 15' },
  { key: '2026-11-16', label: 'Mon, Nov 16' },
  { key: '2026-11-17', label: 'Tue, Nov 17' },
];

export const SEED_APPOINTMENTS: AppointmentBooking[] = [
  {
    id: 'seed-appt-1',
    tokenNumber: 'MED-2026-104',
    bookingType: 'doctor',
    itemId: 'doc-arvind',
    title: 'Dr. Arvind Deshmukh',
    departmentOrCategory: 'Orthopedics · OPD 204',
    patientName: 'Rohan Kulkarni',
    patientAge: 28,
    phone: '9845012345',
    date: '2026-11-15',
    timeSlot: '10:00 AM',
    originalFee: 250,
    donorPassCode: 'DONOR-O+-712',
    discountApplied: 50,
    finalFee: 200,
    status: 'Confirmed',
    createdAt: '2026-11-14T18:30:00Z',
  },
];

export const SEED_DONORS: DonorRegistration[] = [
  {
    id: 'seed-donor-1',
    donorPassCode: 'DONOR-O+-712',
    fullName: 'Rohan Kulkarni',
    bloodGroup: 'O+',
    age: 28,
    weightKg: 68,
    phone: '9845012345',
    preferredDate: '2026-11-15',
    discountPercent: 20,
    createdAt: '2026-11-14T18:10:00Z',
  },
];

export const SEED_DISPATCHES: AmbulanceDispatch[] = [];
