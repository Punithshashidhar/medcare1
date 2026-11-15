# Security Specification — Medplex Hospital Patient & Doctor Portals

## 1. Data Invariants
1. **Identity Integrity**: Every `PatientProfile`, `AppointmentRecord`, and `DonorPassRecord` created by a patient must carry `uid` / `patientUid == request.auth.uid` and `request.auth.token.email_verified == true`.
2. **Prevent Self-Assigned Doctor Roles**: Only the verified Medical Admin (`punithshashidar1@gmail.com` with `email_verified == true`) can create, update, or delete `/authorizedDoctors/{userId}` records. Patients cannot promote themselves to doctors.
3. **PII Isolation**: Patient profiles (`/patients/{userId}`), appointments (`/appointments/{appointmentId}`), and donor passes (`/donorPasses/{donorId}`) deny unauthenticated access and prevent blanket signed-in list scraping. Patients can only read/list records matching `resource.data.patientUid == request.auth.uid`.
4. **Temporal & Financial Integrity**: `createdAt` and `updatedAt` must equal server `request.time`. Appointment `originalFee`, `finalFee`, `tokenNumber`, and `patientUid` are immutable after creation.
5. **Terminal State Locking**: Once an `AppointmentRecord` reaches `Completed` or `Cancelled`, no further state transitions or clinical edits are permitted on that record by patients or doctors.
6. **Cost-Safe Queries**: `allow list` rules evaluate strictly against `request.auth` and `resource.data` with zero `get()` or `exists()` lookups.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Read/Write**: Reading `/patients/user1` or creating `/appointments/appt1` with `request.auth == null`.
2. **Identity Spoofing on Create**: Signed-in User A (`uid: "userA"`) creating `/appointments/appt1` with `patientUid: "userB"`.
3. **Role Self-Escalation**: Signed-in patient creating `/authorizedDoctors/userA` with `{ active: true, role: "doctor" }`.
4. **Ghost / Shadow Field Injection**: Creating `/patients/userA` with all valid fields plus an extra `"isAdmin": true` or `"isVerified": true` field (blocked by `keys().hasOnly(...)`).
5. **Unverified Email Spoof**: Signed-in user with `email: "punithshashidar1@gmail.com"` and `email_verified: false` attempting admin list or doctor update.
6. **PII Cross-Patient Get**: Signed-in Patient A requesting `get` on `/patients/patientB` or `/appointments/apptOwnedByB`.
7. **Blanket List Query Scraping**: Signed-in Patient A executing `collection('appointments')` without a `where('patientUid', '==', 'patientA')` constraint.
8. **ID Poisoning**: Creating `/appointments/` with a 500-character document ID or invalid characters (`"../admin"`).
9. **Resource Poisoning (Oversized String)**: Doctor updating `doctorNotes` with a 5,000-character string (exceeds `<= 500` cap).
10. **Client Timestamp Forgery**: Creating an appointment with `createdAt` set to a past client date instead of `request.time`.
11. **Fee Tampering on Update**: Patient updating their appointment `finalFee` from `250` to `0` while cancelling.
12. **Terminal State Violation**: Doctor or patient attempting to update an appointment whose `existing().status == 'Cancelled'` or `'Completed'`.
