import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  AppointmentBooking,
  AuthorizedDoctor,
  BloodGroupStock,
  CloudAppointment,
  CloudDonorPass,
  DonorRegistration,
  PatientProfile,
} from '../types/hospital';
import { sanitizeFirestoreId } from '../utils/portalLogic';

function timestampToIso(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
}

export function subscribePatientProfile(
  uid: string,
  onData: (profile: PatientProfile | null) => void,
  onError?: (err: Error) => void
): () => void {
  const path = `patients/${uid}`;
  const ref = doc(db, 'patients', uid);
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const d = snap.data();
      onData({
        uid: String(d.uid ?? uid),
        fullName: String(d.fullName ?? ''),
        email: String(d.email ?? ''),
        phone: String(d.phone ?? ''),
        age: Number(d.age ?? 25),
        bloodGroup: (d.bloodGroup ?? 'O+') as BloodGroupStock['group'],
      });
    },
    (error) => {
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // Error logged structurally by handleFirestoreError
      }
    }
  );
}

export async function savePatientProfile(
  uid: string,
  email: string,
  input: {
    fullName: string;
    phone: string;
    age: number;
    bloodGroup: BloodGroupStock['group'];
  },
  hasExistingProfile: boolean
): Promise<void> {
  const path = `patients/${uid}`;
  const ref = doc(db, 'patients', uid);
  const cleanPayload = {
    fullName: input.fullName.trim().slice(0, 80),
    phone: input.phone.trim().slice(0, 15),
    age: Math.round(input.age),
    bloodGroup: input.bloodGroup,
    updatedAt: serverTimestamp(),
  };

  try {
    if (hasExistingProfile) {
      await updateDoc(ref, cleanPayload);
    } else {
      await setDoc(ref, {
        uid,
        email: email.trim().slice(0, 120),
        ...cleanPayload,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, hasExistingProfile ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function fetchAuthorizedDoctor(uid: string): Promise<AuthorizedDoctor | null> {
  const path = `authorizedDoctors/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'authorizedDoctors', uid));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      uid: String(d.uid ?? uid),
      email: String(d.email ?? ''),
      doctorId: String(d.doctorId ?? ''),
      doctorName: String(d.doctorName ?? ''),
      department: String(d.department ?? ''),
      active: Boolean(d.active),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function grantAuthorizedDoctor(input: {
  uid: string;
  email: string;
  doctorId: string;
  doctorName: string;
  department: string;
}): Promise<void> {
  const uid = sanitizeFirestoreId(input.uid.trim());
  const path = `authorizedDoctors/${uid}`;
  try {
    const existing = await getDoc(doc(db, 'authorizedDoctors', uid));
    if (existing.exists()) {
      await updateDoc(doc(db, 'authorizedDoctors', uid), {
        doctorId: sanitizeFirestoreId(input.doctorId),
        doctorName: input.doctorName.trim().slice(0, 80),
        department: input.department.trim().slice(0, 50),
        active: true,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(doc(db, 'authorizedDoctors', uid), {
        uid,
        email: input.email.trim().slice(0, 120),
        doctorId: sanitizeFirestoreId(input.doctorId),
        doctorName: input.doctorName.trim().slice(0, 80),
        department: input.department.trim().slice(0, 50),
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

function mapDocToCloudAppointment(id: string, d: Record<string, unknown>): CloudAppointment {
  return {
    id: String(d.id ?? id),
    patientUid: String(d.patientUid ?? ''),
    patientEmail: String(d.patientEmail ?? ''),
    tokenNumber: String(d.tokenNumber ?? ''),
    bookingType: d.bookingType === 'checkup' ? 'checkup' : 'doctor',
    itemId: String(d.itemId ?? ''),
    title: String(d.title ?? ''),
    departmentOrCategory: String(d.departmentOrCategory ?? ''),
    patientName: String(d.patientName ?? ''),
    patientAge: Number(d.patientAge ?? 0),
    phone: String(d.phone ?? ''),
    date: String(d.date ?? ''),
    timeSlot: String(d.timeSlot ?? ''),
    originalFee: Number(d.originalFee ?? 0),
    donorPassCode: typeof d.donorPassCode === 'string' ? d.donorPassCode : undefined,
    discountApplied: Number(d.discountApplied ?? 0),
    finalFee: Number(d.finalFee ?? 0),
    status:
      d.status === 'Completed' || d.status === 'Cancelled' ? d.status : 'Confirmed',
    doctorNotes: typeof d.doctorNotes === 'string' ? d.doctorNotes : undefined,
    prescriptionSummary:
      typeof d.prescriptionSummary === 'string' ? d.prescriptionSummary : undefined,
    createdAt: timestampToIso(d.createdAt),
  };
}

export function subscribePatientAppointments(
  uid: string,
  onData: (appointments: CloudAppointment[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'appointments';
  const q = query(collection(db, path), where('patientUid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs
        .map((d) => mapDocToCloudAppointment(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch {
        // Logged structurally
      }
    }
  );
}

export function subscribeAllAppointmentsForDoctor(
  onData: (appointments: CloudAppointment[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'appointments';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items = snapshot.docs
        .map((d) => mapDocToCloudAppointment(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch {
        // Logged structurally
      }
    }
  );
}

export async function createCloudAppointment(
  uid: string,
  email: string,
  booking: AppointmentBooking
): Promise<void> {
  const docId = sanitizeFirestoreId(booking.id);
  const path = `appointments/${docId}`;
  const payload: Record<string, unknown> = {
    id: docId,
    patientUid: uid,
    patientEmail: email.trim().slice(0, 120),
    tokenNumber: booking.tokenNumber.trim().slice(0, 32),
    bookingType: booking.bookingType,
    itemId: sanitizeFirestoreId(booking.itemId).slice(0, 64),
    title: booking.title.trim().slice(0, 100),
    departmentOrCategory: booking.departmentOrCategory.trim().slice(0, 80),
    patientName: booking.patientName.trim().slice(0, 80),
    patientAge: Math.round(booking.patientAge),
    phone: booking.phone.trim().slice(0, 15),
    date: booking.date.trim().slice(0, 20),
    timeSlot: booking.timeSlot.trim().slice(0, 20),
    originalFee: booking.originalFee,
    discountApplied: booking.discountApplied,
    finalFee: booking.finalFee,
    status: 'Confirmed',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (booking.donorPassCode && booking.donorPassCode.trim()) {
    payload.donorPassCode = booking.donorPassCode.trim().slice(0, 32);
  }

  try {
    await setDoc(doc(db, 'appointments', docId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function cancelCloudAppointment(appointmentId: string): Promise<void> {
  const docId = sanitizeFirestoreId(appointmentId);
  const path = `appointments/${docId}`;
  try {
    await updateDoc(doc(db, 'appointments', docId), {
      status: 'Cancelled',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function completeCloudAppointmentWithNotes(
  appointmentId: string,
  doctorNotes: string,
  prescriptionSummary: string
): Promise<void> {
  const docId = sanitizeFirestoreId(appointmentId);
  const path = `appointments/${docId}`;
  try {
    await updateDoc(doc(db, 'appointments', docId), {
      status: 'Completed',
      doctorNotes: doctorNotes.trim().slice(0, 500),
      prescriptionSummary: prescriptionSummary.trim().slice(0, 500),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribePatientDonorPasses(
  uid: string,
  onData: (passes: CloudDonorPass[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'donorPasses';
  const q = query(collection(db, path), where('patientUid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: CloudDonorPass[] = snapshot.docs
        .map((snap) => {
          const d = snap.data();
          return {
            id: String(d.id ?? snap.id),
            patientUid: String(d.patientUid ?? uid),
            donorPassCode: String(d.donorPassCode ?? ''),
            fullName: String(d.fullName ?? ''),
            bloodGroup: (d.bloodGroup ?? 'O+') as BloodGroupStock['group'],
            age: Number(d.age ?? 18),
            weightKg: Number(d.weightKg ?? 50),
            phone: String(d.phone ?? ''),
            preferredDate: String(d.preferredDate ?? ''),
            discountPercent: Number(d.discountPercent ?? 20),
            createdAt: timestampToIso(d.createdAt),
          };
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch {
        // Logged structurally
      }
    }
  );
}

export async function createCloudDonorPass(
  uid: string,
  donor: DonorRegistration
): Promise<void> {
  const docId = sanitizeFirestoreId(donor.id);
  const path = `donorPasses/${docId}`;
  try {
    await setDoc(doc(db, 'donorPasses', docId), {
      id: docId,
      patientUid: uid,
      donorPassCode: donor.donorPassCode.trim().slice(0, 32),
      fullName: donor.fullName.trim().slice(0, 80),
      bloodGroup: donor.bloodGroup,
      age: Math.round(donor.age),
      weightKg: donor.weightKg,
      phone: donor.phone.trim().slice(0, 15),
      preferredDate: donor.preferredDate.trim().slice(0, 20),
      discountPercent: 20,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
