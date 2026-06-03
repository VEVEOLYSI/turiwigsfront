'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { servicesApi } from '@/api/services.api';
import { formatPrice } from '@/utils/formatters';
import type { Service } from '@/types';

export function ServicesPreview() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    servicesApi.list().then(({ data }) => setServices(data.data.slice(0, 4))).catch(() => {});
  }, []);

  if (!services.length) return null;

  return (
    <section className="bg-neutral-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Expert Care</p>
            <h2 className="mt-1 text-2xl font-bold text-neutral-900 sm:text-3xl">Wig Services</h2>
          </div>
          <Link href="/services" className="flex items-center gap-1 text-sm font-medium text-neutral-900 hover:opacity-70 transition-opacity">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group flex flex-col rounded-2xl bg-white p-6 border border-neutral-200 hover:border-neutral-400 hover:shadow-sm transition-all"
            >
              <h3 className="font-semibold text-neutral-900 group-hover:text-black">{service.name}</h3>
              {service.description && (
                <p className="mt-1.5 text-sm text-neutral-500 line-clamp-2 flex-1">{service.description}</p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-neutral-900">{formatPrice(service.price)}</span>
                <span className="flex items-center gap-1 text-xs text-neutral-400">
                  <Clock className="h-3 w-3" />
                  {service.duration_minutes} min
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
