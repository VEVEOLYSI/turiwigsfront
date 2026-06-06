'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setDateTime, selectWizard } from '@/store/slices/booking-wizard.slice';
import { servicesApi } from '@/api/services.api';
import { BookingStepBar } from '@/components/bookings/BookingStepBar';
import type { ServiceSlot } from '@/types';

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function padDate(n: number) {
  return String(n).padStart(2, '0');
}

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${padDate(month + 1)}-${padDate(day)}`;
}

export default function SchedulePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const wizard = useAppSelector(selectWizard);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [slots, setSlots] = useState<ServiceSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate || !wizard.service) return;
    setLoadingSlots(true);
    setSlots([]);
    setSelectedTime(null);
    setSelectedSlotId(null);
    servicesApi
      .getSlots(wizard.service.id, selectedDate)
      .then(({ data }) => setSlots(data.data))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, wizard.service]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleDateSelect(year: number, month: number, day: number) {
    const d = new Date(year, month, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (d < todayStart) return; // past
    if (d.getDay() === 0) return; // Sunday
    setSelectedDate(toIsoDate(year, month, day));
  }

  function handleContinue() {
    if (!selectedDate || !selectedTime) return;
    dispatch(setDateTime({ date: selectedDate, time: selectedTime, slotId: selectedSlotId }));
    router.push('/bookings/summary');
  }

  // Build calendar days
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr = toIsoDate(today.getFullYear(), today.getMonth(), today.getDate());

  const calendarCells: Array<{ day: number | null }> = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push({ day: d });

  return (
    <div className="min-h-screen" style={{ background: '#faf6ed' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/bookings/technician"
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: '#fff', border: '1px solid #e0d8c8' }}
          >
            <ArrowLeft className="h-4 w-4" style={{ color: '#143d2a' }} />
          </Link>
          <h1 className="text-xl font-bold" style={{ color: '#0a2e1f' }}>
            Pick a Date & Time
          </h1>
        </div>

        <div className="mb-5 mt-3">
          <BookingStepBar currentStep={3} />
        </div>

        {/* Selected service + technician summary */}
        {(wizard.service || wizard.technician) && (
          <div className="card-sku p-4 mb-5 flex items-center gap-3">
            {wizard.service && (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={wizard.service.imageUrl}
                  alt={wizard.service.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: '#0a2e1f' }}>
                {wizard.service?.name ?? 'Service'}
              </p>
              <p className="text-xs" style={{ color: '#7a8694' }}>
                with{' '}
                {wizard.technician ? wizard.technician.name : 'Any Available Technician'}
              </p>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="card-sku p-4 mb-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: '#faf6ed', border: '1px solid #e0d8c8' }}
            >
              <ChevronLeft className="h-4 w-4" style={{ color: '#143d2a' }} />
            </button>
            <span className="font-semibold text-base" style={{ color: '#0a2e1f' }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: '#faf6ed', border: '1px solid #e0d8c8' }}
            >
              <ChevronRight className="h-4 w-4" style={{ color: '#143d2a' }} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_HEADERS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-semibold py-1"
                style={{ color: '#9a8060' }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {calendarCells.map((cell, i) => {
              if (!cell.day) return <div key={i} />;

              const dateStr = toIsoDate(viewYear, viewMonth, cell.day);
              const cellDate = new Date(viewYear, viewMonth, cell.day);
              const todayStart = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              );
              const isPast = cellDate < todayStart;
              const isSunday = cellDate.getDay() === 0;
              const isDisabled = isPast || isSunday;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;

              return (
                <button
                  key={i}
                  onClick={() =>
                    !isDisabled && handleDateSelect(viewYear, viewMonth, cell.day!)
                  }
                  disabled={isDisabled}
                  className="relative flex flex-col items-center justify-center rounded-full mx-auto"
                  style={{
                    width: '36px',
                    height: '36px',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    background: isSelected
                      ? '#0a2e1f'
                      : 'transparent',
                    color: isSelected
                      ? '#fff'
                      : isDisabled
                      ? '#d1d5db'
                      : '#0a2e1f',
                    fontWeight: isToday || isSelected ? 600 : 400,
                    fontSize: '13px',
                  }}
                >
                  {cell.day}
                  {isToday && !isSelected && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: '#c9a227' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        {selectedDate && (
          <div className="mb-6">
            <h3 className="font-semibold text-sm mb-3" style={{ color: '#0a2e1f' }}>
              Available Times
            </h3>

            {loadingSlots && (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-xl animate-pulse"
                    style={{ background: '#e0d8c8' }}
                  />
                ))}
              </div>
            )}

            {!loadingSlots && slots.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: '#7a8694' }}>
                No slots available for this date.
              </p>
            )}

            {!loadingSlots && slots.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => {
                  const isBooked = slot.booked_count >= slot.capacity;
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => {
                        if (isBooked) return;
                        setSelectedSlotId(slot.id);
                        setSelectedTime(slot.start_time);
                      }}
                      disabled={isBooked}
                      className="h-10 rounded-xl text-sm font-medium transition-all"
                      style={
                        isBooked
                          ? {
                              background: '#f3f4f6',
                              color: '#9ca3af',
                              cursor: 'not-allowed',
                              border: '1px solid #e5e7eb',
                            }
                          : isSelected
                          ? {
                              background: '#0a2e1f',
                              color: '#fff',
                              border: '1px solid #0a2e1f',
                            }
                          : {
                              background: '#fff',
                              color: '#0a2e1f',
                              border: '1px solid #e0d8c8',
                            }
                      }
                    >
                      {slot.start_time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className="btn-gold w-full rounded-xl font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ height: '52px' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
