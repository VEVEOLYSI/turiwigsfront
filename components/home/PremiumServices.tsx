'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { servicesApi } from '@/api/services.api';
import { formatPrice } from '@/utils/formatters';
import type { Service } from '@/types';

const FALLBACK_IMAGES = [
  '/images/nails-1.jpeg',
  '/images/nails-4.jpeg',
  '/images/nails-2.jpeg',
  '/images/tiuri-wigs.jpeg',
];

function getImage(service: Service, index: number) {
  return service.images?.[0]?.url ?? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border overflow-hidden" style={{ borderColor: '#e0d0b0', background: '#fff' }}>
      <div className="w-full aspect-[4/3]" style={{ background: '#e8dfc8' }} />
      <div className="p-5">
        <div className="h-5 w-2/3 rounded-lg mb-3" style={{ background: '#e8dfc8' }} />
        <div className="h-3 w-full rounded mb-2" style={{ background: '#f0e8d0' }} />
        <div className="h-3 w-4/5 rounded mb-5" style={{ background: '#f0e8d0' }} />
        <div className="flex justify-between pt-4 border-t" style={{ borderColor: '#f0e8d0' }}>
          <div className="h-5 w-20 rounded" style={{ background: '#e8dfc8' }} />
          <div className="h-4 w-16 rounded" style={{ background: '#f0e8d0' }} />
        </div>
      </div>
    </div>
  );
}

export function PremiumServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesApi
      .list()
      .then(({ data }) => {
        const all = data.data as Service[];
        const featured = all.filter((s) => s.is_featured);
        const rest = all.filter((s) => !s.is_featured);
        setServices([...featured, ...rest].slice(0, 4));
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 sm:py-28" style={{ background: '#faf6ed' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] mb-3" style={{ color: '#c9a227' }}>
              What We Offer
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: '#0a2e1f' }}>
              Premium Services
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
            style={{ color: '#0a2e1f' }}
          >
            View All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : services.map((service, i) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group flex flex-col rounded-2xl border overflow-hidden transition-all hover:shadow-lg"
                  style={{ borderColor: '#e0d0b0', background: '#fff' }}
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                      src={getImage(service, i)}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold leading-snug" style={{ color: '#0a2e1f' }}>
                        {service.name}
                      </h3>
                      <ArrowRight
                        className="h-4 w-4 flex-shrink-0 mt-0.5"
                        style={{ color: '#c9a227' }}
                      />
                    </div>

                    {service.description && (
                      <p className="mt-2 text-sm leading-relaxed flex-1 line-clamp-2" style={{ color: '#6b7280' }}>
                        {service.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t pt-4" style={{ borderColor: '#f0e8d0' }}>
                      <span className="text-base font-bold" style={{ color: '#0a2e1f' }}>
                        {formatPrice(service.price)}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm" style={{ color: '#9a8060' }}>
                        <Clock className="h-3.5 w-3.5" />
                        {service.duration_minutes} min
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
