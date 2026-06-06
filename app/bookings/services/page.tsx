'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { servicesApi } from '@/api/services.api';
import { BookingServiceCard } from '@/components/bookings/BookingServiceCard';
import { BookingStepBar } from '@/components/bookings/BookingStepBar';
import type { Service } from '@/types';

const CATEGORIES = ['All', 'Nails', 'Wigs', 'Pedicure', 'Gel'];

function matchesCategory(service: Service, cat: string): boolean {
  if (cat === 'All') return true;
  const n = service.name.toLowerCase();
  return n.includes(cat.toLowerCase());
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    servicesApi
      .list()
      .then(({ data }) => setServices(data.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter((s) => {
    const matchesSearch =
      search.trim() === '' ||
      s.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && matchesCategory(s, activeCategory);
  });

  return (
    <div className="min-h-screen" style={{ background: '#faf6ed' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <Link
            href="/bookings"
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: '#fff', border: '1px solid #e0d8c8' }}
          >
            <ArrowLeft className="h-4 w-4" style={{ color: '#143d2a' }} />
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#0a2e1f' }}>
              Choose a Service
            </h1>
            <p className="text-sm" style={{ color: '#7a8694' }}>
              Select the service you&apos;d like to book
            </p>
          </div>
        </div>

        {/* Step bar */}
        <BookingStepBar currentStep={1} />

        {/* Search */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: '#9ca3af' }}
          />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-sku w-full rounded-xl text-sm pl-10 pr-4 h-11 focus:outline-none"
            style={{ color: '#0a2e1f' }}
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 rounded-full px-4 h-8 text-sm font-medium transition-all"
              style={
                activeCategory === cat
                  ? {
                      background: 'linear-gradient(135deg, #0a2e1f, #1e5038)',
                      color: '#f0d878',
                      border: '1px solid #143d2a',
                    }
                  : {
                      background: '#fff',
                      color: '#143d2a',
                      border: '1px solid #e0d8c8',
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl animate-pulse"
                style={{ aspectRatio: '3/4', background: '#e0d8c8' }}
              />
            ))}
          </div>
        )}

        {/* Services grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filtered.map((service, i) => (
              <BookingServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="font-semibold text-base mb-1" style={{ color: '#0a2e1f' }}>
              No services found
            </p>
            <p className="text-sm" style={{ color: '#7a8694' }}>
              Try a different search term or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
