'use client';

import Image from 'next/image';
import { Clock } from 'lucide-react';
import { StarRating } from '@/components/ui/StarRating';

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

interface TechnicianCardProps {
  tech: Technician;
  onSelect: () => void;
  selected?: boolean;
}

export function TechnicianCard({ tech, onSelect, selected }: TechnicianCardProps) {
  return (
    <div
      className="card-sku p-4 cursor-pointer transition-all duration-200"
      style={
        selected
          ? {
              borderColor: '#c9a227',
              boxShadow:
                '0 0 0 2px #c9a227, 0 4px 16px rgba(201,162,39,0.2)',
            }
          : {}
      }
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <div className="flex gap-4">
        {/* Photo */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={tech.photo}
              alt={tech.name}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          {selected && (
            <div
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs"
              style={{ background: '#c9a227', color: '#1a0e00' }}
            >
              ✓
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h4 className="font-semibold text-base" style={{ color: '#0a2e1f' }}>
              {tech.name}
            </h4>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-xs font-semibold" style={{ color: '#c9a227' }}>
                {tech.rating}
              </span>
              <StarRating value={Math.round(tech.rating)} size="sm" />
            </div>
          </div>

          <p className="text-sm mb-0.5" style={{ color: '#143d2a' }}>
            {tech.title}
          </p>

          <div className="flex items-center gap-1 text-xs mb-3" style={{ color: '#7a8694' }}>
            <Clock className="h-3 w-3" />
            <span>{tech.experience} experience</span>
            <span>·</span>
            <span>{tech.reviews} reviews</span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tech.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs rounded-full px-2 py-0.5 font-medium"
                style={{
                  background: 'rgba(10,46,31,0.08)',
                  color: '#143d2a',
                  border: '1px solid rgba(10,46,31,0.12)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Available slots */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tech.slots.map((slot) => (
              <span
                key={slot}
                className="text-xs rounded-lg px-2 py-0.5 font-medium"
                style={{
                  background: '#faf6ed',
                  color: '#143d2a',
                  border: '1px solid #e0d8c8',
                }}
              >
                {slot}
              </span>
            ))}
          </div>

          {/* Select button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="btn-gold rounded-xl px-4 text-sm font-semibold"
            style={{ height: '34px' }}
          >
            {selected ? 'Selected ✓' : 'Select'}
          </button>
        </div>
      </div>
    </div>
  );
}
