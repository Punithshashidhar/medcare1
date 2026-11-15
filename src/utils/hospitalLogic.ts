import {
  AmbulanceTierId,
  AppointmentBooking,
  BillInput,
  BillSummary,
  BloodGroupStock,
  DepartmentName,
  Doctor,
} from '../types/hospital';

export function calculateBillSummary(input: BillInput): BillSummary {
  const consultation = Math.max(0, Number(input.consultationFee) || 0);
  const checkup = Math.max(0, Number(input.checkupFee) || 0);
  const equipment = Math.max(0, Number(input.equipmentFee) || 0);
  const bedRate = Math.max(0, Number(input.bedRatePerDay) || 0);
  const days = Math.max(0, Math.floor(Number(input.admitDays) || 0));
  const bedCharges = Math.round(bedRate * days);

  const subtotal = Math.round(consultation + checkup + equipment + bedCharges);

  const bloodDonorDiscountAmount = input.hasBloodDonorDiscount
    ? Math.round(subtotal * 0.2)
    : 0;

  const afterDonor = subtotal - bloodDonorDiscountAmount;
  const concessionDiscountAmount = input.hasStudentOrSeniorConcession
    ? Math.round(afterDonor * 0.1)
    : 0;

  const totalDiscount = bloodDonorDiscountAmount + concessionDiscountAmount;
  const finalPayable = Math.max(0, subtotal - totalDiscount);

  return {
    bedCharges,
    subtotal,
    bloodDonorDiscountAmount,
    concessionDiscountAmount,
    totalDiscount,
    finalPayable,
  };
}

export function filterDoctors(
  doctors: Doctor[],
  department: DepartmentName | 'All',
  searchQuery: string
): Doctor[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return doctors.filter((doc) => {
    const matchesDept = department === 'All' || doc.department === department;
    if (!matchesDept) return false;
    if (!normalizedQuery) return true;
    return (
      doc.name.toLowerCase().includes(normalizedQuery) ||
      doc.department.toLowerCase().includes(normalizedQuery) ||
      doc.focusAreas.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function getTakenSlots(
  bookings: AppointmentBooking[],
  itemId: string,
  date: string
): Set<string> {
  const taken = new Set<string>();
  for (const booking of bookings) {
    if (
      booking.status === 'Confirmed' &&
      booking.itemId === itemId &&
      booking.date === date
    ) {
      taken.add(booking.timeSlot);
    }
  }
  return taken;
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateAppointmentInput(data: {
  patientName: string;
  patientAge: string;
  phone: string;
  date: string;
  timeSlot: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.patientName.trim() || data.patientName.trim().length < 2) {
    errors.patientName = 'Please enter the patient full name (at least 2 characters).';
  }

  const age = Number(data.patientAge);
  if (!data.patientAge.trim() || Number.isNaN(age) || age < 1 || age > 115) {
    errors.patientAge = 'Enter a valid age between 1 and 115.';
  }

  if (!isValidPhone(data.phone)) {
    errors.phone = 'Enter a valid 10-digit mobile number.';
  }

  if (!data.date) {
    errors.date = 'Select an appointment date.';
  }

  if (!data.timeSlot) {
    errors.timeSlot = 'Select an available time slot.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateDonorInput(data: {
  fullName: string;
  age: string;
  weightKg: string;
  phone: string;
  bloodGroup: BloodGroupStock['group'];
  preferredDate: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName.trim() || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter donor full name.';
  }

  const age = Number(data.age);
  if (!data.age.trim() || Number.isNaN(age) || age < 18 || age > 65) {
    errors.age = 'Voluntary blood donors must be between 18 and 65 years old.';
  }

  const weight = Number(data.weightKg);
  if (!data.weightKg.trim() || Number.isNaN(weight) || weight < 50) {
    errors.weightKg = 'Minimum donor weight required is 50 kg.';
  }

  if (!isValidPhone(data.phone)) {
    errors.phone = 'Enter a valid 10-digit contact number.';
  }

  if (!data.preferredDate) {
    errors.preferredDate = 'Select a preferred donation date.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateAmbulanceInput(data: {
  callerName: string;
  phone: string;
  pickupAddress: string;
  emergencyType: string;
  tierId: AmbulanceTierId;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.callerName.trim() || data.callerName.trim().length < 2) {
    errors.callerName = 'Enter caller or patient name.';
  }

  if (!isValidPhone(data.phone)) {
    errors.phone = 'Enter an active 10-digit callback number.';
  }

  if (!data.pickupAddress.trim() || data.pickupAddress.trim().length < 8) {
    errors.pickupAddress = 'Enter full street address and nearest landmark.';
  }

  if (!data.emergencyType.trim()) {
    errors.emergencyType = 'Select the emergency category.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateTokenCode(prefix: string, count: number): string {
  const num = 105 + count;
  return `${prefix}-${num}`;
}

export function formatDonorPassCode(group: BloodGroupStock['group'], count: number): string {
  const safeGroup = group.replace('+', 'POS').replace('-', 'NEG');
  return `DONOR-${safeGroup}-${105 + count}`;
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
