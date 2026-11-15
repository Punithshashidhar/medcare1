import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { createCloudAppointment, createCloudDonorPass } from './services/hospitalFirestore';
import {
  INITIAL_BLOOD_STOCK,
  SEED_APPOINTMENTS,
  SEED_DISPATCHES,
  SEED_DONORS,
} from './data/hospitalData';
import {
  AmbulanceDispatch,
  AppointmentBooking,
  BloodGroupStock,
  CheckupPlan,
  Doctor,
  DonorRegistration,
} from './types/hospital';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DoctorsSection } from './components/DoctorsSection';
import { CheckupPlansSection } from './components/CheckupPlansSection';
import { EquipmentSection } from './components/EquipmentSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { BloodDiscountSection } from './components/BloodDiscountSection';
import { AmbulanceSection } from './components/AmbulanceSection';
import { PortalsSection } from './components/PortalsSection';
import { MyRecordsSection } from './components/MyRecordsSection';
import { PresentationGuideSection } from './components/PresentationGuideSection';
import { BookingModal, BookingTarget } from './components/BookingModal';
import { Footer } from './components/Footer';

const STORAGE_KEYS = {
  appointments: 'medplex_appointments_v1',
  donors: 'medplex_donors_v1',
  dispatches: 'medplex_dispatches_v1',
  bloodStock: 'medplex_blood_stock_v1',
};

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [appointments, setAppointments] = useState<AppointmentBooking[]>(() =>
    readStored(STORAGE_KEYS.appointments, SEED_APPOINTMENTS)
  );
  const [donors, setDonors] = useState<DonorRegistration[]>(() =>
    readStored(STORAGE_KEYS.donors, SEED_DONORS)
  );
  const [dispatches, setDispatches] = useState<AmbulanceDispatch[]>(() =>
    readStored(STORAGE_KEYS.dispatches, SEED_DISPATCHES)
  );
  const [bloodStock, setBloodStock] = useState<BloodGroupStock[]>(() =>
    readStored(STORAGE_KEYS.bloodStock, INITIAL_BLOOD_STOCK)
  );

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingTarget, setBookingTarget] = useState<BookingTarget | null>(null);
  const [selectedWardId, setSelectedWardId] = useState<string>('none');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.donors, JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.dispatches, JSON.stringify(dispatches));
  }, [dispatches]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.bloodStock, JSON.stringify(bloodStock));
  }, [bloodStock]);

  const openGeneralBooking = () => {
    setBookingTarget(null);
    setBookingModalOpen(true);
  };

  const handleSelectDoctorSlot = (doctor: Doctor, preselectedSlot?: string) => {
    setBookingTarget({ type: 'doctor', doctor, preselectedSlot });
    setBookingModalOpen(true);
  };

  const handleSelectCheckupPlan = (plan: CheckupPlan) => {
    setBookingTarget({ type: 'checkup', plan });
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = (newBooking: AppointmentBooking) => {
    setAppointments((prev) => [newBooking, ...prev]);
    if (authUser && authUser.emailVerified && authUser.email) {
      void createCloudAppointment(authUser.uid, authUser.email, newBooking).catch(() => {
        // Error handled structurally by handleFirestoreError
      });
    }
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Cancelled' } : item))
    );
  };

  const handleRegisterDonor = (newDonor: DonorRegistration) => {
    setDonors((prev) => [newDonor, ...prev]);
    setBloodStock((prev) =>
      prev.map((stock) => {
        if (stock.group !== newDonor.bloodGroup) return stock;
        const nextUnits = stock.unitsAvailable + 1;
        return {
          ...stock,
          unitsAvailable: nextUnits,
          status: nextUnits >= 10 ? 'Adequate' : 'Priority Needed',
        };
      })
    );
    if (authUser && authUser.emailVerified) {
      void createCloudDonorPass(authUser.uid, newDonor).catch(() => {
        // Error handled structurally by handleFirestoreError
      });
    }
  };

  const handleDispatchAmbulance = (dispatch: AmbulanceDispatch) => {
    setDispatches((prev) => [dispatch, ...prev]);
  };

  const totalSavedRecords = appointments.length + donors.length + dispatches.length;
  const activeDonorPassCode = donors[0]?.donorPassCode ?? 'DONOR-O+-712';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar onOpenBooking={openGeneralBooking} />

      <main className="flex-1">
        <HeroSection
          onOpenBooking={openGeneralBooking}
          totalSavedRecords={totalSavedRecords}
        />

        <DoctorsSection onSelectDoctorSlot={handleSelectDoctorSlot} />

        <CheckupPlansSection onSelectCheckupPlan={handleSelectCheckupPlan} />

        <EquipmentSection />

        <FacilitiesSection onEstimateStay={(wardId) => setSelectedWardId(wardId)} />

        <BloodDiscountSection
          bloodStock={bloodStock}
          onRegisterDonor={handleRegisterDonor}
          activeDonorPassCode={activeDonorPassCode}
          selectedWardId={selectedWardId}
          onSelectWardId={setSelectedWardId}
        />

        <AmbulanceSection onDispatchAmbulance={handleDispatchAmbulance} />

        <PortalsSection
          authUser={authUser}
          authReady={authReady}
          onOpenBooking={openGeneralBooking}
        />

        <MyRecordsSection
          appointments={appointments}
          donors={donors}
          dispatches={dispatches}
          onCancelAppointment={handleCancelAppointment}
        />

        <PresentationGuideSection />
      </main>

      <Footer />

      <BookingModal
        isOpen={bookingModalOpen}
        target={bookingTarget}
        existingBookings={appointments}
        registeredDonors={donors}
        onClose={() => setBookingModalOpen(false)}
        onConfirmBooking={handleConfirmBooking}
      />
    </div>
  );
}
