import { BloodGroupStock, CloudAppointment } from '../types/hospital';

export const MEDICAL_ADMIN_EMAIL = 'punithshashidar1@gmail.com';

const VALID_BLOOD_GROUPS: BloodGroupStock['group'][] = [
  'O+',
  'O-',
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
];

export function isMedicalAdminUser(
  email?: string | null,
  emailVerified?: boolean | null
): boolean {
  if (!email || !emailVerified) return false;
  return email.trim().toLowerCase() === MEDICAL_ADMIN_EMAIL;
}

export function sanitizeFirestoreId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  return cleaned || `med-${Date.now()}`;
}

export function validatePatientProfileInput(input: {
  fullName: string;
  phone: string;
  age: number;
  bloodGroup: string;
}): string | null {
  const name = input.fullName.trim();
  if (name.length < 2 || name.length > 80) {
    return 'Full name must be between 2 and 80 characters.';
  }
  const digits = input.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    return 'Please enter a valid 10-digit mobile number.';
  }
  const ageInt = Math.round(input.age);
  if (!Number.isFinite(ageInt) || ageInt < 1 || ageInt > 115) {
    return 'Patient age must be between 1 and 115.';
  }
  if (!VALID_BLOOD_GROUPS.includes(input.bloodGroup as BloodGroupStock['group'])) {
    return 'Please select a valid blood group.';
  }
  return null;
}

export function validateClinicalNotesInput(input: {
  doctorNotes: string;
  prescriptionSummary: string;
}): string | null {
  const notes = input.doctorNotes.trim();
  const prescription = input.prescriptionSummary.trim();
  if (notes.length < 3 || notes.length > 500) {
    return 'Clinical diagnosis notes must be between 3 and 500 characters.';
  }
  if (prescription.length > 500) {
    return 'Prescription summary must be 500 characters or fewer.';
  }
  return null;
}

export function validateDoctorGrantInput(input: {
  uid: string;
  email: string;
  doctorId: string;
}): string | null {
  const uid = input.uid.trim();
  if (uid.length < 4 || uid.length > 128 || !/^[a-zA-Z0-9_-]+$/.test(uid)) {
    return 'Enter a valid Firebase User UID (alphanumeric, hyphens, underscores).';
  }
  const email = input.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    return 'Enter a valid staff Google email address.';
  }
  if (!input.doctorId.trim()) {
    return 'Select a Medplex doctor profile to assign.';
  }
  return null;
}

export function filterDoctorQueue(
  appointments: CloudAppointment[],
  doctorItemIdFilter: string | 'all',
  statusFilter: 'all' | 'Confirmed' | 'Completed' | 'Cancelled'
): CloudAppointment[] {
  return appointments.filter((appt) => {
    const matchesDoctor = doctorItemIdFilter === 'all' || appt.itemId === doctorItemIdFilter;
    const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
    return matchesDoctor && matchesStatus;
  });
}

export function summarizeDoctorQueue(appointments: CloudAppointment[]): {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
} {
  let pending = 0;
  let completed = 0;
  let cancelled = 0;
  for (const appt of appointments) {
    if (appt.status === 'Confirmed') pending += 1;
    else if (appt.status === 'Completed') completed += 1;
    else if (appt.status === 'Cancelled') cancelled += 1;
  }
  return {
    total: appointments.length,
    pending,
    completed,
    cancelled,
  };
}
