import React, { useEffect, useState } from 'react';
import { User, signInWithPopup, signOut } from 'firebase/auth';
import { LogIn, LogOut, ShieldCheck, CalendarPlus } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { DOCTORS, INITIAL_BLOOD_STOCK } from '../data/hospitalData';
import {
  AuthorizedDoctor,
  BloodGroupStock,
  CloudAppointment,
  CloudDonorPass,
  PatientProfile,
  PortalRole,
} from '../types/hospital';
import {
  cancelCloudAppointment,
  completeCloudAppointmentWithNotes,
  fetchAuthorizedDoctor,
  grantAuthorizedDoctor,
  savePatientProfile,
  subscribeAllAppointmentsForDoctor,
  subscribePatientAppointments,
  subscribePatientDonorPasses,
  subscribePatientProfile,
} from '../services/hospitalFirestore';
import { formatCurrency } from '../utils/hospitalLogic';
import {
  filterDoctorQueue,
  isMedicalAdminUser,
  summarizeDoctorQueue,
  validateClinicalNotesInput,
  validateDoctorGrantInput,
  validatePatientProfileInput,
} from '../utils/portalLogic';

interface PortalsSectionProps {
  authUser: User | null;
  authReady: boolean;
  onOpenBooking: () => void;
}

export const PortalsSection: React.FC<PortalsSectionProps> = ({
  authUser,
  authReady,
  onOpenBooking,
}) => {
  const [activePortalRole, setActivePortalRole] = useState<PortalRole>('patient');
  const [selectedDoctorDeskId, setSelectedDoctorDeskId] = useState<string>(DOCTORS[0].id);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Patient Portal state
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [profileFullName, setProfileFullName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAge, setProfileAge] = useState('25');
  const [profileBloodGroup, setProfileBloodGroup] = useState<BloodGroupStock['group']>('O+');
  const [profileStatus, setProfileStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [patientAppointments, setPatientAppointments] = useState<CloudAppointment[]>([]);
  const [patientDonorPasses, setPatientDonorPasses] = useState<CloudDonorPass[]>([]);

  // Doctor Portal state
  const [authorizedDoctorDoc, setAuthorizedDoctorDoc] = useState<AuthorizedDoctor | null>(null);
  const [doctorAuthChecked, setDoctorAuthChecked] = useState(false);
  const [doctorQueue, setDoctorQueue] = useState<CloudAppointment[]>([]);
  const [doctorDeskFilter, setDoctorDeskFilter] = useState<string>('all');
  const [doctorStatusFilter, setDoctorStatusFilter] = useState<
    'all' | 'Confirmed' | 'Completed' | 'Cancelled'
  >('all');
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [prescriptionSummary, setPrescriptionSummary] = useState('');
  const [doctorActionMsg, setDoctorActionMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  // Admin staff grant form
  const [grantUid, setGrantUid] = useState('');
  const [grantEmail, setGrantEmail] = useState('');
  const [grantDoctorId, setGrantDoctorId] = useState(DOCTORS[2].id);
  const [grantMsg, setGrantMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const isAdmin = isMedicalAdminUser(authUser?.email, authUser?.emailVerified);
  const isDoctorAuthorized = Boolean(isAdmin || authorizedDoctorDoc?.active);

  useEffect(() => {
    if (!authUser) {
      setPatientProfile(null);
      setPatientAppointments([]);
      setPatientDonorPasses([]);
      setAuthorizedDoctorDoc(null);
      setDoctorQueue([]);
      setDoctorAuthChecked(false);
      return;
    }

    setProfileFullName((prev) => prev || authUser.displayName || '');

    const unsubProfile = subscribePatientProfile(authUser.uid, (profile) => {
      setPatientProfile(profile);
      if (profile) {
        setProfileFullName(profile.fullName);
        setProfilePhone(profile.phone);
        setProfileAge(String(profile.age));
        setProfileBloodGroup(profile.bloodGroup);
      }
    });

    const unsubPatientAppts = subscribePatientAppointments(authUser.uid, (items) => {
      setPatientAppointments(items);
    });

    const unsubDonorPasses = subscribePatientDonorPasses(authUser.uid, (passes) => {
      setPatientDonorPasses(passes);
    });

    let active = true;
    fetchAuthorizedDoctor(authUser.uid)
      .then((docRecord) => {
        if (!active) return;
        setAuthorizedDoctorDoc(docRecord);
        setDoctorAuthChecked(true);
        if (docRecord?.doctorId) {
          setSelectedDoctorDeskId(docRecord.doctorId);
        }
      })
      .catch(() => {
        if (active) setDoctorAuthChecked(true);
      });

    return () => {
      active = false;
      unsubProfile();
      unsubPatientAppts();
      unsubDonorPasses();
    };
  }, [authUser]);

  useEffect(() => {
    if (!authUser || activePortalRole !== 'doctor' || !isDoctorAuthorized) {
      setDoctorQueue([]);
      return;
    }

    const unsubQueue = subscribeAllAppointmentsForDoctor(
      (items) => {
        setDoctorQueue(items);
      },
      (err) => {
        setDoctorActionMsg({
          type: 'err',
          text: `Doctor queue access failed: ${err.message}`,
        });
      }
    );

    return () => unsubQueue();
  }, [authUser, activePortalRole, isDoctorAuthorized]);

  const handleGooglePortalLogin = async (role: PortalRole) => {
    setAuthError(null);
    setActivePortalRole(role);
    setIsAuthenticating(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in with Google.';
      setAuthError(message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    setProfileStatus(null);
    setDoctorActionMsg(null);
    await signOut(auth);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser || !authUser.email) return;
    setProfileStatus(null);
    const parsedAge = Number(profileAge);
    const validationErr = validatePatientProfileInput({
      fullName: profileFullName,
      phone: profilePhone,
      age: parsedAge,
      bloodGroup: profileBloodGroup,
    });
    if (validationErr) {
      setProfileStatus({ type: 'err', text: validationErr });
      return;
    }

    setIsSavingProfile(true);
    try {
      await savePatientProfile(
        authUser.uid,
        authUser.email,
        {
          fullName: profileFullName,
          phone: profilePhone,
          age: parsedAge,
          bloodGroup: profileBloodGroup,
        },
        Boolean(patientProfile)
      );
      setProfileStatus({
        type: 'ok',
        text: 'Patient profile saved to Medplex Cloud Portal.',
      });
    } catch (err) {
      setProfileStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Could not save patient profile.',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelCloudAppt = async (id: string) => {
    try {
      await cancelCloudAppointment(id);
    } catch (err) {
      setProfileStatus({
        type: 'err',
        text: err instanceof Error ? err.message : 'Could not cancel appointment.',
      });
    }
  };

  const openClinicalNotesEditor = (appt: CloudAppointment) => {
    setEditingAppointmentId(appt.id);
    setClinicalNotes(appt.doctorNotes ?? '');
    setPrescriptionSummary(appt.prescriptionSummary ?? '');
    setDoctorActionMsg(null);
  };

  const handleCompleteConsultation = async (e: React.FormEvent, appointmentId: string) => {
    e.preventDefault();
    setDoctorActionMsg(null);
    const err = validateClinicalNotesInput({
      doctorNotes: clinicalNotes,
      prescriptionSummary,
    });
    if (err) {
      setDoctorActionMsg({ type: 'err', text: err });
      return;
    }

    try {
      await completeCloudAppointmentWithNotes(appointmentId, clinicalNotes, prescriptionSummary);
      setEditingAppointmentId(null);
      setClinicalNotes('');
      setPrescriptionSummary('');
      setDoctorActionMsg({
        type: 'ok',
        text: 'Consultation notes saved and appointment marked Completed.',
      });
    } catch (error) {
      setDoctorActionMsg({
        type: 'err',
        text: error instanceof Error ? error.message : 'Failed to update consultation.',
      });
    }
  };

  const handleGrantDoctorAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setGrantMsg(null);
    const err = validateDoctorGrantInput({
      uid: grantUid,
      email: grantEmail,
      doctorId: grantDoctorId,
    });
    if (err) {
      setGrantMsg({ type: 'err', text: err });
      return;
    }

    const docInfo = DOCTORS.find((d) => d.id === grantDoctorId);
    if (!docInfo) return;

    try {
      await grantAuthorizedDoctor({
        uid: grantUid,
        email: grantEmail,
        doctorId: docInfo.id,
        doctorName: docInfo.name,
        department: docInfo.department,
      });
      setGrantUid('');
      setGrantEmail('');
      setGrantMsg({
        type: 'ok',
        text: `Authorized ${docInfo.name} staff access for UID ${grantUid.trim()}.`,
      });
    } catch (error) {
      setGrantMsg({
        type: 'err',
        text: error instanceof Error ? error.message : 'Failed to authorize doctor UID.',
      });
    }
  };

  const activeDoctorInfo =
    DOCTORS.find((d) => d.id === selectedDoctorDeskId) ?? DOCTORS[0];
  const doctorStats = summarizeDoctorQueue(doctorQueue);
  const filteredDoctorQueue = filterDoctorQueue(
    doctorQueue,
    doctorDeskFilter,
    doctorStatusFilter
  );

  return (
    <section id="portals" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-teal-700">
            07. Patient &amp; Doctor Authentication Portals
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Patient Portal Login &amp; Doctor Login Portal
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Separate role-protected portals powered by Firebase Authentication and Cloud Firestore.
            Patients manage personal bookings, prescriptions, and blood donor passes, while verified
            doctors manage OPD queues and clinical notes.
          </p>
        </div>

        {authError && (
          <div
            role="alert"
            className="mt-5 p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-800"
          >
            {authError}
          </div>
        )}

        {!authReady ? (
          <div className="mt-8 p-8 rounded-xl border border-slate-200 bg-white text-sm text-slate-600">
            Checking Firebase authentication session...
          </div>
        ) : !authUser ? (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Portal Login Card */}
            <article className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-teal-700">For Patients &amp; Families</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">Patient Portal Login</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Sign in with your Google account to sync appointments across devices, read doctor
                  prescriptions, and keep your 20% Blood Donor Pass ready at billing.
                </p>

                <ul className="mt-5 pt-5 border-t border-slate-200 space-y-2 text-sm text-slate-700">
                  <li>· View confirmed OPD tokens &amp; cancel slots online</li>
                  <li>· Read doctor diagnosis &amp; prescription notes after visits</li>
                  <li>· Save mobile number, age &amp; blood group securely</li>
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200">
                <button
                  type="button"
                  disabled={isAuthenticating}
                  onClick={() => handleGooglePortalLogin('patient')}
                  data-testid="patient-login-btn"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>
                    {isAuthenticating && activePortalRole === 'patient'
                      ? 'Signing in...'
                      : 'Sign in with Google (Patient Portal)'}
                  </span>
                </button>
              </div>
            </article>

            {/* Doctor Login Portal Card */}
            <article className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">
                  For Medplex Consultants &amp; Staff
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">Doctor Login Portal</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Authorized Medplex specialists sign in to inspect incoming patient tokens, write
                  diagnosis notes &amp; prescriptions, and mark consultations completed.
                </p>

                <div className="mt-5 pt-5 border-t border-slate-200 space-y-3">
                  <div>
                    <label
                      htmlFor="doctor-desk-login-select"
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      Select Consultant OPD Desk
                    </label>
                    <select
                      id="doctor-desk-login-select"
                      value={selectedDoctorDeskId}
                      onChange={(e) => setSelectedDoctorDeskId(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      {DOCTORS.map((docItem) => (
                        <option key={docItem.id} value={docItem.id}>
                          {docItem.name} — {docItem.department} ({docItem.roomNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Role-protected by Firestore Security Rules. Only verified staff accounts can
                    read hospital queues or update patient consultation records.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200">
                <button
                  type="button"
                  disabled={isAuthenticating}
                  onClick={() => handleGooglePortalLogin('doctor')}
                  data-testid="doctor-login-btn"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isAuthenticating && activePortalRole === 'doctor'
                      ? 'Signing in...'
                      : 'Sign in with Google (Doctor Portal)'}
                  </span>
                </button>
              </div>
            </article>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {/* Authenticated Session Header Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-teal-800">
                  Signed in · {authUser.email}
                </p>
                <h3 className="mt-0.5 text-lg font-bold text-slate-900">
                  {authUser.displayName || 'Medplex Portal User'} ·{' '}
                  <span className="font-medium text-slate-600">
                    {activePortalRole === 'doctor' ? 'Doctor Login Portal' : 'Patient Portal'}
                  </span>
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div
                  role="tablist"
                  aria-label="Portal role switcher"
                  className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activePortalRole === 'patient'}
                    onClick={() => setActivePortalRole('patient')}
                    className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activePortalRole === 'patient'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Patient Portal
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activePortalRole === 'doctor'}
                    onClick={() => setActivePortalRole('doctor')}
                    className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activePortalRole === 'doctor'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Doctor Portal
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {activePortalRole === 'patient' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Patient Profile Form */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6">
                  <h4 className="text-base font-bold text-slate-900">My Patient Profile</h4>
                  <p className="mt-1 text-xs text-slate-600">
                    Stored privately in your patient record for faster OPD check-in.
                  </p>

                  <form onSubmit={handleSaveProfile} className="mt-4 space-y-3" noValidate>
                    <div>
                      <label
                        htmlFor="patient-portal-name"
                        className="block text-xs font-medium text-slate-700 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        id="patient-portal-name"
                        type="text"
                        value={profileFullName}
                        onChange={(e) => setProfileFullName(e.target.value)}
                        placeholder="e.g. Aarav Menon"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="patient-portal-age"
                          className="block text-xs font-medium text-slate-700 mb-1"
                        >
                          Age
                        </label>
                        <input
                          id="patient-portal-age"
                          type="number"
                          min={1}
                          max={115}
                          value={profileAge}
                          onChange={(e) => setProfileAge(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="patient-portal-phone"
                          className="block text-xs font-medium text-slate-700 mb-1"
                        >
                          Mobile Number
                        </label>
                        <input
                          id="patient-portal-phone"
                          type="tel"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          placeholder="9845012345"
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="patient-portal-blood"
                        className="block text-xs font-medium text-slate-700 mb-1"
                      >
                        Blood Group
                      </label>
                      <select
                        id="patient-portal-blood"
                        value={profileBloodGroup}
                        onChange={(e) =>
                          setProfileBloodGroup(e.target.value as BloodGroupStock['group'])
                        }
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                      >
                        {INITIAL_BLOOD_STOCK.map((item) => (
                          <option key={item.group} value={item.group}>
                            {item.group}
                          </option>
                        ))}
                      </select>
                    </div>

                    {profileStatus && (
                      <p
                        role="status"
                        className={`text-xs font-medium ${
                          profileStatus.type === 'ok' ? 'text-teal-800' : 'text-red-700'
                        }`}
                      >
                        {profileStatus.text}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Patient Profile'}
                    </button>
                  </form>

                  <div className="mt-6 pt-5 border-t border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900">
                      Cloud Blood Donor Passes ({patientDonorPasses.length})
                    </h4>
                    {patientDonorPasses.length === 0 ? (
                      <p className="mt-1 text-xs text-slate-600">
                        No donor passes registered under this Google account yet. Use Section 05 to
                        generate a 20% off Donor Pass.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {patientDonorPasses.map((pass) => (
                          <li
                            key={pass.id}
                            className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                          >
                            <p className="font-mono font-semibold text-teal-800">
                              {pass.donorPassCode} · 20% Off
                            </p>
                            <p className="mt-0.5 text-slate-700">
                              {pass.fullName} · Blood Group {pass.bloodGroup} · {pass.preferredDate}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Patient Cloud Appointments & Prescriptions */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        My Cloud Appointments &amp; Prescriptions ({patientAppointments.length})
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Synced live from Firestore. Doctor consultation notes appear here once
                        completed.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenBooking}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      <span>Book New Slot</span>
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {patientAppointments.length === 0 ? (
                      <div className="p-8 rounded-xl border border-slate-200 bg-slate-50 text-center">
                        <p className="text-sm font-medium text-slate-900">
                          No cloud appointments under this account yet
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          Book any doctor slot or preventive checkup plan while signed in to view it
                          here and receive doctor notes.
                        </p>
                      </div>
                    ) : (
                      patientAppointments.map((appt) => (
                        <article
                          key={appt.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-mono text-teal-800">
                                Token {appt.tokenNumber} · {appt.status}
                              </p>
                              <h5 className="mt-0.5 text-sm font-bold text-slate-900">
                                {appt.title}
                              </h5>
                              <p className="text-xs text-slate-600">
                                {appt.departmentOrCategory} · {appt.date} at{' '}
                                <span className="font-mono">{appt.timeSlot}</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <p className="text-sm font-bold font-mono tabular-nums text-slate-900">
                                  {formatCurrency(appt.finalFee)}
                                </p>
                                {appt.discountApplied > 0 && (
                                  <p className="text-xs text-teal-800 tabular-nums">
                                    20% Donor off
                                  </p>
                                )}
                              </div>
                              {appt.status === 'Confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelCloudAppt(appt.id)}
                                  className="px-3 py-1.5 text-xs font-medium text-red-700 bg-white hover:bg-red-50 border border-red-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>

                          {(appt.doctorNotes || appt.prescriptionSummary) && (
                            <div className="pt-2 border-t border-slate-200 text-xs text-slate-700 space-y-1">
                              {appt.doctorNotes && (
                                <p>
                                  <span className="font-semibold text-slate-900">
                                    Doctor Notes:
                                  </span>{' '}
                                  {appt.doctorNotes}
                                </p>
                              )}
                              {appt.prescriptionSummary && (
                                <p>
                                  <span className="font-semibold text-slate-900">
                                    Prescription:
                                  </span>{' '}
                                  {appt.prescriptionSummary}
                                </p>
                              )}
                            </div>
                          )}
                        </article>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : !doctorAuthChecked ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-sm text-slate-600">
                Verifying doctor staff authorization...
              </div>
            ) : !isDoctorAuthorized ? (
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 max-w-2xl">
                <p className="text-xs font-mono text-red-700">Staff Authorization Required</p>
                <h4 className="mt-1 text-lg font-bold text-slate-900">
                  Doctor Login Portal is restricted to verified Medplex staff
                </h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Your signed-in Google account ({authUser.email}) does not currently have active
                  doctor staff authorization in Firestore Security Rules. Switch to the Patient
                  Portal to view your own bookings, or share your User UID below with the Medical
                  Admin to enable staff access.
                </p>
                <p className="mt-3 text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 break-all">
                  UID: {authUser.uid}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setActivePortalRole('patient')}
                    className="px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Switch to Patient Portal
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Doctor KPI Strip */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500">Total Appointments</p>
                    <p className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-900">
                      {doctorStats.total}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500">Pending OPD Queue</p>
                    <p className="mt-1 text-xl font-bold font-mono tabular-nums text-teal-800">
                      {doctorStats.pending}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500">Completed Visits</p>
                    <p className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-900">
                      {doctorStats.completed}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500">Active Doctor Desk</p>
                    <p className="mt-1 text-sm font-bold text-slate-900 truncate">
                      {activeDoctorInfo.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{activeDoctorInfo.department}</p>
                  </div>
                </div>

                {/* Doctor Queue Controls & List */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Doctor Consultation Queue
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Review scheduled patients, record diagnosis notes &amp; prescriptions, and
                        mark consultations completed.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        aria-label="Filter queue by doctor"
                        value={doctorDeskFilter}
                        onChange={(e) => setDoctorDeskFilter(e.target.value)}
                        className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      >
                        <option value="all">All Hospital Departments</option>
                        {DOCTORS.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.department})
                          </option>
                        ))}
                      </select>

                      <select
                        aria-label="Filter queue by status"
                        value={doctorStatusFilter}
                        onChange={(e) =>
                          setDoctorStatusFilter(
                            e.target.value as 'all' | 'Confirmed' | 'Completed' | 'Cancelled'
                          )
                        }
                        className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      >
                        <option value="all">All Statuses</option>
                        <option value="Confirmed">Pending (Confirmed)</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {doctorActionMsg && (
                    <p
                      role="status"
                      className={`mt-4 text-xs font-medium ${
                        doctorActionMsg.type === 'ok' ? 'text-teal-800' : 'text-red-700'
                      }`}
                    >
                      {doctorActionMsg.text}
                    </p>
                  )}

                  <div className="mt-5 space-y-3">
                    {filteredDoctorQueue.length === 0 ? (
                      <div className="p-8 rounded-xl border border-slate-200 bg-slate-50 text-center text-sm text-slate-600">
                        No patient bookings match the current filter yet. Book a slot while signed
                        in to see it appear in the doctor queue in real time.
                      </div>
                    ) : (
                      filteredDoctorQueue.map((appt) => (
                        <article
                          key={appt.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-mono text-teal-800">
                                Token {appt.tokenNumber} · {appt.status} · {appt.date}{' '}
                                {appt.timeSlot}
                              </p>
                              <h5 className="mt-0.5 text-sm font-bold text-slate-900">
                                {appt.patientName} ({appt.patientAge} yrs · Phone {appt.phone})
                              </h5>
                              <p className="text-xs text-slate-600">
                                {appt.title} · {appt.departmentOrCategory} · Fee{' '}
                                <span className="font-mono tabular-nums">
                                  {formatCurrency(appt.finalFee)}
                                </span>
                              </p>
                            </div>

                            {appt.status === 'Confirmed' && (
                              <button
                                type="button"
                                onClick={() => openClinicalNotesEditor(appt)}
                                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                              >
                                {editingAppointmentId === appt.id
                                  ? 'Editing Notes...'
                                  : 'Add Notes & Complete'}
                              </button>
                            )}
                          </div>

                          {(appt.doctorNotes || appt.prescriptionSummary) && (
                            <div className="pt-2 border-t border-slate-200 text-xs text-slate-700 space-y-1">
                              {appt.doctorNotes && (
                                <p>
                                  <span className="font-semibold text-slate-900">Diagnosis:</span>{' '}
                                  {appt.doctorNotes}
                                </p>
                              )}
                              {appt.prescriptionSummary && (
                                <p>
                                  <span className="font-semibold text-slate-900">
                                    Prescription:
                                  </span>{' '}
                                  {appt.prescriptionSummary}
                                </p>
                              )}
                            </div>
                          )}

                          {editingAppointmentId === appt.id && (
                            <form
                              onSubmit={(e) => handleCompleteConsultation(e, appt.id)}
                              className="pt-3 border-t border-slate-200 space-y-3"
                              noValidate
                            >
                              <div>
                                <label
                                  htmlFor={`notes-${appt.id}`}
                                  className="block text-xs font-medium text-slate-700 mb-1"
                                >
                                  Clinical Diagnosis / Consultation Notes
                                </label>
                                <textarea
                                  id={`notes-${appt.id}`}
                                  rows={2}
                                  value={clinicalNotes}
                                  onChange={(e) => setClinicalNotes(e.target.value)}
                                  placeholder="e.g. Mild ligament strain; advised rest and cold compress."
                                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor={`rx-${appt.id}`}
                                  className="block text-xs font-medium text-slate-700 mb-1"
                                >
                                  Prescription Summary
                                </label>
                                <input
                                  id={`rx-${appt.id}`}
                                  type="text"
                                  value={prescriptionSummary}
                                  onChange={(e) => setPrescriptionSummary(e.target.value)}
                                  placeholder="e.g. Tab Paracetamol 500mg SOS, Follow-up in 5 days"
                                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="submit"
                                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                  Save Notes &amp; Mark Completed
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingAppointmentId(null)}
                                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}
                        </article>
                      ))
                    )}
                  </div>
                </div>

                {/* Admin Staff Authorization Tool */}
                {isAdmin && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h4 className="text-sm font-bold text-slate-900">
                      Authorize Additional Staff Doctor (Medical Admin)
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      Grant Doctor Portal access to another specialist&apos;s Google Firebase UID.
                    </p>
                    <form
                      onSubmit={handleGrantDoctorAccess}
                      className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
                      noValidate
                    >
                      <div>
                        <label
                          htmlFor="grant-doctor-uid"
                          className="block text-xs font-medium text-slate-700 mb-1"
                        >
                          Staff Firebase UID
                        </label>
                        <input
                          id="grant-doctor-uid"
                          type="text"
                          value={grantUid}
                          onChange={(e) => setGrantUid(e.target.value)}
                          placeholder="Paste staff UID"
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="grant-doctor-email"
                          className="block text-xs font-medium text-slate-700 mb-1"
                        >
                          Staff Google Email
                        </label>
                        <input
                          id="grant-doctor-email"
                          type="email"
                          value={grantEmail}
                          onChange={(e) => setGrantEmail(e.target.value)}
                          placeholder="doctor@gmail.com"
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="grant-doctor-profile"
                          className="block text-xs font-medium text-slate-700 mb-1"
                        >
                          Assign OPD Desk
                        </label>
                        <select
                          id="grant-doctor-profile"
                          value={grantDoctorId}
                          onChange={(e) => setGrantDoctorId(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                        >
                          {DOCTORS.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({d.department})
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="py-2 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Authorize Doctor
                      </button>
                    </form>
                    {grantMsg && (
                      <p
                        role="status"
                        className={`mt-2 text-xs font-medium ${
                          grantMsg.type === 'ok' ? 'text-teal-800' : 'text-red-700'
                        }`}
                      >
                        {grantMsg.text}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
