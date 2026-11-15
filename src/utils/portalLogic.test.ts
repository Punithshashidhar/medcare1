import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterDoctorQueue,
  isMedicalAdminUser,
  sanitizeFirestoreId,
  summarizeDoctorQueue,
  validateClinicalNotesInput,
  validateDoctorGrantInput,
  validatePatientProfileInput,
} from './portalLogic';
import { CloudAppointment } from '../types/hospital';

test('isMedicalAdminUser authorizes only verified medical admin email', () => {
  assert.equal(isMedicalAdminUser('punithshashidar1@gmail.com', true), true);
  assert.equal(isMedicalAdminUser('PUNITHSHASHIDAR1@gmail.com', true), true);
  assert.equal(isMedicalAdminUser('punithshashidar1@gmail.com', false), false);
  assert.equal(isMedicalAdminUser('patient@gmail.com', true), false);
  assert.equal(isMedicalAdminUser(null, true), false);
});

test('validatePatientProfileInput validates required fields and bounds', () => {
  assert.equal(
    validatePatientProfileInput({
      fullName: 'Aarav Menon',
      phone: '9845012345',
      age: 24,
      bloodGroup: 'O+',
    }),
    null
  );
  assert.ok(
    validatePatientProfileInput({
      fullName: 'A',
      phone: '9845012345',
      age: 24,
      bloodGroup: 'O+',
    })
  );
  assert.ok(
    validatePatientProfileInput({
      fullName: 'Aarav Menon',
      phone: '12345',
      age: 24,
      bloodGroup: 'O+',
    })
  );
  assert.ok(
    validatePatientProfileInput({
      fullName: 'Aarav Menon',
      phone: '9845012345',
      age: 130,
      bloodGroup: 'O+',
    })
  );
});

test('validateClinicalNotesInput enforces length limits matching Firestore rules', () => {
  assert.equal(
    validateClinicalNotesInput({
      doctorNotes: 'Mild knee sprain; advised rest and physiotherapy.',
      prescriptionSummary: 'Tab Paracetamol 500mg SOS, Cold pack 15 mins twice daily',
    }),
    null
  );
  assert.ok(
    validateClinicalNotesInput({
      doctorNotes: 'ok',
      prescriptionSummary: '',
    })
  );
  assert.ok(
    validateClinicalNotesInput({
      doctorNotes: 'Valid note',
      prescriptionSummary: 'x'.repeat(501),
    })
  );
});

test('validateDoctorGrantInput validates UID format and staff email', () => {
  assert.equal(
    validateDoctorGrantInput({
      uid: 'doc_uid_12345',
      email: 'dr.arvind@medplexhospital.org',
      doctorId: 'doc-arvind',
    }),
    null
  );
  assert.ok(
    validateDoctorGrantInput({
      uid: '../bad/id',
      email: 'dr@medplex.org',
      doctorId: 'doc-arvind',
    })
  );
});

test('sanitizeFirestoreId creates safe IDs matching rules regex', () => {
  const safe = sanitizeFirestoreId('appt:123/abc def');
  assert.match(safe, /^[a-zA-Z0-9_-]+$/);
});

test('filterDoctorQueue and summarizeDoctorQueue compute accurate clinical stats', () => {
  const sample: CloudAppointment[] = [
    {
      id: 'a1',
      patientUid: 'u1',
      patientEmail: 'u1@example.com',
      tokenNumber: 'MED-2026-101',
      bookingType: 'doctor',
      itemId: 'doc-arvind',
      title: 'Dr. Arvind Deshmukh',
      departmentOrCategory: 'Orthopedics · OPD 204',
      patientName: 'Rohan',
      patientAge: 28,
      phone: '9845012345',
      date: '2026-11-15',
      timeSlot: '10:00 AM',
      originalFee: 250,
      discountApplied: 50,
      finalFee: 200,
      status: 'Confirmed',
      createdAt: '2026-11-15T00:00:00Z',
    },
    {
      id: 'a2',
      patientUid: 'u2',
      patientEmail: 'u2@example.com',
      tokenNumber: 'MED-2026-102',
      bookingType: 'doctor',
      itemId: 'doc-rajeshwari',
      title: 'Dr. Rajeshwari Nair',
      departmentOrCategory: 'General Medicine · OPD 102',
      patientName: 'Meera',
      patientAge: 34,
      phone: '9845098765',
      date: '2026-11-15',
      timeSlot: '09:00 AM',
      originalFee: 150,
      discountApplied: 0,
      finalFee: 150,
      status: 'Completed',
      doctorNotes: 'Viral fever recovering',
      createdAt: '2026-11-15T00:00:00Z',
    },
  ];

  const stats = summarizeDoctorQueue(sample);
  assert.deepEqual(stats, { total: 2, pending: 1, completed: 1, cancelled: 0 });
  assert.equal(filterDoctorQueue(sample, 'doc-arvind', 'all').length, 1);
  assert.equal(filterDoctorQueue(sample, 'all', 'Completed').length, 1);
});
