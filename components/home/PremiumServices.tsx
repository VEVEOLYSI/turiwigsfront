'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

const SERVICES = [
  {
    label: 'Nail Art',
    desc: 'Intricate, long-lasting designs crafted by expert nail technicians.',
    href: '/services',
    img: '/images/nails-1.jpeg',
    tag: 'NAILS',
  },
  {
    label: 'Gel & Acrylics',
    desc: 'Flawless gel and acrylic sets in any shape or colour you love.',
    href: '/services',
    img: '/images/nails-4.jpeg',
    tag: 'GEL',
  },
  {
    label: 'Pedicure',
    desc: 'Luxury foot care and vibrant toe nail treatments.',
    href: '/services',
    img: '/images/nails-2.jpeg',
    tag: 'PEDICURE',
  },
  {
    label: 'Wig Styling',
    desc: 'Custom wig fitting, styling and maintenance by specialists.',
    href: '/services',
    img: '/images/tiuri-wigs.jpeg',
    tag: 'WIGS',
  },
];

export function PremiumServices() {
  return (
    <section className="py-20 sm:py-28" style={{ background: '#faf6ed' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] mb-3"
              style={{ color: '#c9a227' }}>
              What We Offer
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: '#0a2e1f' }}>
              Premium Services
            </h2>
          </div>
          <Link href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
            style={{ color: '#0a2e1f' }}>
            View All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid — Squarespace-style asymmetric */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {SERVICES.map((s, i) => (
            <Link
              key={s.label}
              href={s.href}
              className="group relative overflow-hidden"
              style={{
                borderRadius: 16,
                aspectRatio: i === 0 ? '3/4' : '3/4',
              }}
            >
              <Image
                src={s.img}
                alt={s.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
                }} />

              {/* Gold tag */}
              <div className="absolute top-3 left-3 rounded-full px-2.5 py-1"
                style={{ background: '#c9a227' }}>
                <span className="text-[9px] font-black text-white tracking-[0.2em]">{s.tag}</span>
              </div>

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <h3 className="text-white font-bold text-sm sm:text-base leading-tight">{s.label}</h3>
                <p className="mt-1 text-white/60 text-xs leading-snug line-clamp-2 hidden sm:block">{s.desc}</p>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-black transition-opacity group-hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#f0d878,#c9a227)' }}>
                    <Calendar className="h-2.5 w-2.5" /> Book Now
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
