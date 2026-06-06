'use client';

import { Check } from 'lucide-react';

interface BookingStepBarProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
}

const STEPS = [
  { number: 1, label: 'Service' },
  { number: 2, label: 'Technician' },
  { number: 3, label: 'Schedule' },
  { number: 4, label: 'Summary' },
  { number: 5, label: 'Confirm' },
];

export function BookingStepBar({ currentStep }: BookingStepBarProps) {
  return (
    <div className="w-full">
      {/* Mobile: step x of 5 + label */}
      <div className="flex items-center justify-between sm:hidden mb-1">
        <span className="text-xs font-medium" style={{ color: '#143d2a' }}>
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="text-xs font-semibold" style={{ color: '#c9a227' }}>
          {STEPS.find((s) => s.number === currentStep)?.label}
        </span>
      </div>
      {/* Mobile progress bar */}
      <div
        className="h-1.5 rounded-full overflow-hidden sm:hidden mb-4"
        style={{ background: '#e0d8c8' }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            background: 'linear-gradient(90deg, #c9a227, #f0d878)',
            width: `${(currentStep / STEPS.length) * 100}%`,
          }}
        />
      </div>

      {/* Desktop: full step row */}
      <div className="hidden sm:flex items-center w-full mb-6">
        {STEPS.map((step, idx) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isUpcoming = step.number > currentStep;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step bubble + label */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={
                    isCompleted
                      ? {
                          background: '#143d2a',
                          border: '2px solid #143d2a',
                          color: '#fff',
                        }
                      : isActive
                      ? {
                          background: 'linear-gradient(135deg, #c9a227, #f0d878)',
                          border: '2px solid #c9a227',
                          color: '#1a0e00',
                          boxShadow: '0 0 0 3px rgba(201,162,39,0.2)',
                        }
                      : {
                          background: '#fff',
                          border: '2px solid #d1d5db',
                          color: '#9ca3af',
                        }
                  }
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className="text-xs font-medium whitespace-nowrap"
                  style={{
                    color: isActive
                      ? '#c9a227'
                      : isCompleted
                      ? '#143d2a'
                      : '#9ca3af',
                  }}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line */}
              {idx < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-2 mt-[-18px]"
                  style={{
                    background: isCompleted ? '#143d2a' : '#e5e7eb',
                    transition: 'background 0.3s',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
