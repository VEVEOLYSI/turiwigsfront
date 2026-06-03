'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { servicesApi } from '@/api/services.api';
import { formatPrice } from '@/utils/formatters';
import { PageSpinner } from '@/components/ui/Spinner';
import type { Service } from '@/types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesApi.list().then(({ data }) => setServices(data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Expert Care</p>
        <h1 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">Wig Services</h1>
        <p className="mt-3 text-neutral-500 max-w-lg mx-auto">
          Professional wig care, styling, and repair from our expert team.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {services.map((service) => (
          <Link key={service.id} href={`/services/${service.slug}`}
            className="group flex flex-col rounded-2xl border border-neutral-200 p-6 hover:border-neutral-400 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-neutral-900 group-hover:text-black">{service.name}</h2>
              <ArrowRight className="h-5 w-5 text-neutral-300 group-hover:text-neutral-900 flex-shrink-0 transition-colors" />
            </div>
            {service.description && (
              <p className="mt-2 text-sm text-neutral-500 flex-1 leading-relaxed">{service.description}</p>
            )}
            <div className="mt-5 flex items-center justify-between pt-4 border-t border-neutral-100">
              <span className="text-lg font-bold text-neutral-900">{formatPrice(service.price)}</span>
              <span className="flex items-center gap-1.5 text-sm text-neutral-400">
                <Clock className="h-4 w-4" />
                {service.duration_minutes} min
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
