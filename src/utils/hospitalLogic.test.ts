import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBillSummary,
  filterDoctors,
  formatDonorPassCode,
  getTakenSlots,
  validateAmbulanceInput,
  validateAppointmentInput,
  validateDonorInput,
} from './hospitalLogic';
import { DOCTORS, SEED_APPOINTMENTS } from '../data/hospitalData';

test('calculateBillSummary applies 20% free blood donor discount on total bill', () => {
  const result = calculateBillSummary({
    consultationFee: 250,
    checkupFee: 450,
    equipmentFee: 300,
    hasBloodDonorDiscount: true,
    hasStudentOrSeniorConcession: false,
  });

  assert.equal(result.subtotal, 1000);
  assert.equal(result.bloodDonorDiscountAmount, 200);
  assert.equal(result.concessionDiscountAmount, 0);
  assert.equal(result.totalDiscount, 200);
  assert.equal(result.finalPayable, 800);
});

test('calculateBillSummary combines blood donor 20% and student/senior 10% concession cleanly', () => {
  const result = calculateBillSummary({
    consultationFee: 150,
    checkupFee: 899,
    equipmentFee: 0,
    hasBloodDonorDiscount: true,
    hasStudentOrSeniorConcession: true,
  });

  assert.equal(result.subtotal, 1049);
  assert.equal(result.bloodDonorDiscountAmount, 210);
  assert.equal(result.concessionDiscountAmount, 84);
  assert.equal(result.finalPayable, 755);
});

test('filterDoctors filters by specialty and search keyword', () => {
  const orthoDocs = filterDoctors(DOCTORS, 'Orthopedics', '');
  assert.equal(orthoDocs.length, 1);
  assert.equal(orthoDocs[0].name, 'Dr. Arvind Deshmukh');

  const neuroBySymptom = filterDoctors(DOCTORS, 'All', 'migraine');
  assert.equal(neuroBySymptom.length, 1);
  assert.equal(neuroBySymptom[0].department, 'Neurology');
});

test('getTakenSlots identifies confirmed slots for a doctor and date', () => {
  const taken = getTakenSlots(SEED_APPOINTMENTS, 'doc-arvind', '2026-11-15');
  assert.equal(taken.has('10:00 AM'), true);
  assert.equal(taken.has('11:15 AM'), false);
});

test('validateAppointmentInput rejects missing fields and invalid age/phone', () => {
  const invalid = validateAppointmentInput({
    patientName: '',
    patientAge: '0',
    phone: '123',
    date: '',
    timeSlot: '',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.patientName);
  assert.ok(invalid.errors.patientAge);
  assert.ok(invalid.errors.phone);

  const valid = validateAppointmentInput({
    patientName: 'Asha Menon',
    patientAge: '22',
    phone: '9876543210',
    date: '2026-11-15',
    timeSlot: '11:15 AM',
  });
  assert.equal(valid.valid, true);
});

test('validateDonorInput enforces eligible donor age and weight', () => {
  const underage = validateDonorInput({
    fullName: 'Kiran Rao',
    age: '16',
    weightKg: '44',
    phone: '9876543210',
    bloodGroup: 'O+',
    preferredDate: '2026-11-15',
  });
  assert.equal(underage.valid, false);
  assert.ok(underage.errors.age);
  assert.ok(underage.errors.weightKg);

  const eligible = validateDonorInput({
    fullName: 'Kiran Rao',
    age: '21',
    weightKg: '62',
    phone: '9876543210',
    bloodGroup: 'O+',
    preferredDate: '2026-11-15',
  });
  assert.equal(eligible.valid, true);
});

test('validateAmbulanceInput requires callback phone and landmark address', () => {
  const invalid = validateAmbulanceInput({
    callerName: 'Suresh',
    phone: '999',
    pickupAddress: 'Gate',
    emergencyType: '',
    tierId: 'bls',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.pickupAddress);
  assert.ok(invalid.errors.emergencyType);
});

test('formatDonorPassCode formats positive and negative blood groups without double hyphens', () => {
  assert.equal(formatDonorPassCode('B-', 100), 'DONOR-BNEG-205');
  assert.equal(formatDonorPassCode('O+', 5), 'DONOR-OPOS-110');
});

test('calculateBillSummary includes ₹400/day admit bed charges and applies 20% donor discount', () => {
  const result = calculateBillSummary({
    consultationFee: 200,
    checkupFee: 0,
    equipmentFee: 0,
    bedRatePerDay: 400,
    admitDays: 3,
    hasBloodDonorDiscount: true,
    hasStudentOrSeniorConcession: false,
  });

  assert.equal(result.bedCharges, 1200);
  assert.equal(result.subtotal, 1400);
  assert.equal(result.bloodDonorDiscountAmount, 280);
  assert.equal(result.finalPayable, 1120);
});
