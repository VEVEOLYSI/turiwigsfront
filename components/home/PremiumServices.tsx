'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
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

function tagFromName(name: string) {
  return name.split(/[\s&]/)[0].toUpperCase().slice(0, 8);
}

function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-2xl bg-neutral-200"
      style={{ aspectRatio: '3/4' }}
    />
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

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : services.map((service, i) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group relative overflow-hidden"
                  style={{ borderRadius: 16, aspectRatio: '3/4' }}
                >
                  <Image
                    src={getImage(service, i)}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  />

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
                    }}
                  />

                  {/* Gold tag */}
                  <div
                    className="absolute top-3 left-3 rounded-full px-2.5 py-1"
                    style={{ background: '#c9a227' }}
                  >
                    <span className="text-[9px] font-black text-white tracking-[0.2em]">
                      {tagFromName(service.name)}
                    </span>
                  </div>

                  {/* Bottom text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <h3 className="text-white font-bold text-sm sm:text-base leading-tight">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="mt-1 text-white/60 text-xs leading-snug line-clamp-2 hidden sm:block">
                        {service.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-black transition-opacity group-hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg,#f0d878,#c9a227)' }}
                      >
                        <Calendar className="h-2.5 w-2.5" /> Book Now
                      </span>
                      <span className="text-sm font-bold" style={{ color: '#f0d878' }}>
                        {formatPrice(service.price)}
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
