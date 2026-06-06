import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

// ─── Snapshot types ──────────────────────────────────────────────────────────
export interface TechnicianSnapshot {
  id: string;
  name: string;
  title: string;
  photo: string;
}

export interface ServiceSnapshot {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
  slug: string;
  imageUrl: string;
}

// ─── State ───────────────────────────────────────────────────────────────────
export interface BookingWizardState {
  service: ServiceSnapshot | null;
  technician: TechnicianSnapshot | null;
  date: string | null;      // ISO date YYYY-MM-DD
  time: string | null;      // HH:MM
  slotId: string | null;
  notes: string;
  depositAmount: number;    // 30% of service price
  createdBookingId: string | null;
  createdBookingNumber: string | null;
}

const initialState: BookingWizardState = {
  service: null,
  technician: null,
  date: null,
  time: null,
  slotId: null,
  notes: '',
  depositAmount: 0,
  createdBookingId: null,
  createdBookingNumber: null,
};

// ─── Slice ───────────────────────────────────────────────────────────────────
const bookingWizardSlice = createSlice({
  name: 'bookingWizard',
  initialState,
  reducers: {
    setService(state, action: PayloadAction<ServiceSnapshot>) {
      state.service = action.payload;
      state.depositAmount = Math.round(action.payload.price * 0.3);
      // Reset downstream selections when service changes
      state.technician = null;
      state.date = null;
      state.time = null;
      state.slotId = null;
    },

    setTechnician(state, action: PayloadAction<TechnicianSnapshot | null>) {
      state.technician = action.payload;
    },

    setDateTime(
      state,
      action: PayloadAction<{ date: string; time: string; slotId: string | null }>
    ) {
      state.date = action.payload.date;
      state.time = action.payload.time;
      state.slotId = action.payload.slotId;
    },

    setNotes(state, action: PayloadAction<string>) {
      state.notes = action.payload;
    },

    setCreatedBooking(
      state,
      action: PayloadAction<{ id: string; booking_number: string }>
    ) {
      state.createdBookingId = action.payload.id;
      state.createdBookingNumber = action.payload.booking_number;
    },

    resetWizard() {
      return initialState;
    },
  },
});

// ─── Exports ─────────────────────────────────────────────────────────────────
export const {
  setService,
  setTechnician,
  setDateTime,
  setNotes,
  setCreatedBooking,
  resetWizard,
} = bookingWizardSlice.actions;

export const selectWizard = (state: RootState) => state.bookingWizard;

export default bookingWizardSlice.reducer;
