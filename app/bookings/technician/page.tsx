'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setTechnician, selectWizard } from '@/store/slices/booking-wizard.slice';
import { TechnicianCard } from '@/components/bookings/TechnicianCard';
import { BookingStepBar } from '@/components/bookings/BookingStepBar';
import techniciansData from '@/data/technicians.json';

interface Technician {
  id: string;
  name: string;
  title: string;
  experience: string;
  languages: string[];
  skills: string[];
  rating: number;
  reviews: number;
  photo: string;
  bio: string;
  slots: string[];
  certifications: string[];
}

const technicians = techniciansData as Technician[];

export default function TechnicianPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const wizard = useAppSelector(selectWizard);

  function handleSelect(tech: Technician) {
    dispatch(
      setTechnician({
        id: tech.id,
        name: tech.name,
        title: tech.title,
        photo: tech.photo,
      })
    );
    router.push('/bookings/schedule');
  }

  function handleAnyAvailable() {
    dispatch(setTechnician(null));
    router.push('/bookings/schedule');
  }

  return (
    <div className="min-h-screen" style={{ background: '#faf6ed' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/bookings/services"
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: '#fff', border: '1px solid #e0d8c8' }}
          >
            <ArrowLeft className="h-4 w-4" style={{ color: '#143d2a' }} />
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#0a2e1f' }}>
              Choose Your Technician
            </h1>
            {wizard.service && (
              <p className="text-sm" style={{ color: '#7a8694' }}>
                for {wizard.service.name}
              </p>
            )}
          </div>
        </div>

        {/* Step bar */}
        <div className="mb-5 mt-3">
          <BookingStepBar currentStep={2} />
        </div>

        {/* Any available card */}
        <button
          onClick={handleAnyAvailable}
          className="w-full card-sku p-4 flex items-center gap-4 mb-4 text-left transition-all duration-200 hover:border-[#c9a227]"
          style={
            wizard.technician === null
              ? {
                  borderColor: '#c9a227',
                  boxShadow: '0 0 0 2px #c9a227, 0 4px 16px rgba(201,162,39,0.2)',
                }
              : {}
          }
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#f0e8d0', border: '2px dashed #c9a227' }}
          >
            <Users className="h-7 w-7" style={{ color: '#c9a227' }} />
          </div>
          <div>
            <p className="font-semibold text-base" style={{ color: '#0a2e1f' }}>
              Any Available
            </p>
            <p className="text-sm" style={{ color: '#7a8694' }}>
              We&apos;ll assign the best available technician for your appointment
            </p>
          </div>
        </button>

        {/* Divider */}
        <div className="gold-divider mb-4" />

        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9a8060' }}>
          Or choose a specific technician
        </p>

        {/* Technician grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {technicians.map((tech) => (
            <TechnicianCard
              key={tech.id}
              tech={tech}
              onSelect={() => handleSelect(tech)}
              selected={wizard.technician?.id === tech.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
