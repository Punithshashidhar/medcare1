export type DepartmentName =
  | 'General Medicine'
  | 'Orthopedics'
  | 'Neurology'
  | 'Gynecology'
  | 'Cardiology'
  | 'Pediatrics'
  | 'Ophthalmology'
  | 'ENT';

export type EquipmentCategory =
  | 'Imaging & Scans'
  | 'Laboratory & Blood'
  | 'Rehab & Critical Care';

export type AmbulanceTierId = 'bls' | 'als' | 'trauma';

export interface Doctor {
  id: string;
  name: string;
  department: DepartmentName;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  roomNumber: string;
  scheduleDays: string;
  languages: string;
  focusAreas: string;
  slots: string[];
}

export interface CheckupPlan {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  fastingRequired: string;
  summary: string;
  includedTests: string[];
  recommendedFor: string;
}

export interface MedicalMachine {
  id: string;
  name: string;
  category: EquipmentCategory;
  department: string;
  availability: string;
  scanFee: number;
  plainExplanation: string;
  clinicalUse: string;
}

export interface BloodGroupStock {
  group: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
  unitsAvailable: number;
  status: 'Adequate' | 'Priority Needed';
}

export interface AmbulanceTier {
  id: AmbulanceTierId;
  name: string;
  responseTarget: string;
  feeLabel: string;
  equipmentSummary: string;
}

export interface AppointmentBooking {
  id: string;
  tokenNumber: string;
  bookingType: 'doctor' | 'checkup';
  itemId: string;
  title: string;
  departmentOrCategory: string;
  patientName: string;
  patientAge: number;
  phone: string;
  date: string;
  timeSlot: string;
  originalFee: number;
  donorPassCode?: string;
  discountApplied: number;
  finalFee: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  doctorNotes?: string;
  prescriptionSummary?: string;
  createdAt: string;
}

export interface DonorRegistration {
  id: string;
  donorPassCode: string;
  fullName: string;
  bloodGroup: BloodGroupStock['group'];
  age: number;
  weightKg: number;
  phone: string;
  preferredDate: string;
  discountPercent: number;
  createdAt: string;
}

export interface AmbulanceDispatch {
  id: string;
  dispatchCode: string;
  callerName: string;
  phone: string;
  pickupAddress: string;
  emergencyType: string;
  tierId: AmbulanceTierId;
  tierName: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  etaMinutes: number;
  status: 'Dispatched';
  createdAt: string;
}

export interface WardOption {
  id: string;
  name: string;
  ratePerDay: number;
  availableBeds: number;
  totalBeds: number;
  includedCare: string;
}

export interface CanteenMenuItem {
  id: string;
  name: string;
  timing: string;
  price: number;
  details: string;
}

export interface BillInput {
  consultationFee: number;
  checkupFee: number;
  equipmentFee: number;
  bedRatePerDay?: number;
  admitDays?: number;
  hasBloodDonorDiscount: boolean;
  hasStudentOrSeniorConcession: boolean;
}

export interface BillSummary {
  bedCharges: number;
  subtotal: number;
  bloodDonorDiscountAmount: number;
  concessionDiscountAmount: number;
  totalDiscount: number;
  finalPayable: number;
}

export type PortalRole = 'patient' | 'doctor';

export interface PatientProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  bloodGroup: BloodGroupStock['group'];
}

export interface AuthorizedDoctor {
  uid: string;
  email: string;
  doctorId: string;
  doctorName: string;
  department: string;
  active: boolean;
}

export interface CloudAppointment extends AppointmentBooking {
  patientUid: string;
  patientEmail: string;
}

export interface CloudDonorPass extends DonorRegistration {
  patientUid: string;
}
