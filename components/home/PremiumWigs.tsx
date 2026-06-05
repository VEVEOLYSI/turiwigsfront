'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const WIGS = [
  {
    name: 'Brazilian Lace Front',
    price: 'From KES 8,500',
    tag: 'BESTSELLER',
    img: '/images/salon-4.jpeg',
    href: '/products',
  },
  {
    name: 'Human Hair Bob',
    price: 'From KES 6,200',
    tag: 'NEW IN',
    img: '/images/salon-5.jpeg',
    href: '/products',
  },
  {
    name: 'Kinky Curly Full Wig',
    price: 'From KES 7,800',
    tag: 'POPULAR',
    img: '/images/salon-7.png',
    href: '/products',
  },
];

export function PremiumWigs() {
  return (
    <section className="py-20 sm:py-28" style={{ background: '#ffffff' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] mb-3"
              style={{ color: '#c9a227' }}>
              Shop Our Collection
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: '#0a2e1f' }}>
              Premium Wigs
            </h2>
          </div>
          <Link href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest transition-colors"
            style={{ color: 'rgba(10,46,31,0.5)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0a2e1f'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(10,46,31,0.5)'; }}>
            Shop All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Big asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Featured large card */}
          <Link href={WIGS[0].href} className="group relative overflow-hidden" style={{ borderRadius: 18, minHeight: 480 }}>
            <Image src={WIGS[0].img} alt={WIGS[0].name} fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw" priority />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)' }} />
            <div className="absolute top-4 left-4 rounded-full px-3 py-1.5"
              style={{ background: '#c9a227' }}>
              <span className="text-[9px] font-black text-white tracking-[0.2em]">{WIGS[0].tag}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <h3 className="text-white font-bold text-xl sm:text-2xl">{WIGS[0].name}</h3>
              <p className="mt-1 text-white/50 text-sm">{WIGS[0].price}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-opacity group-hover:opacity-90"
                style={{ background: '#c9a227' }}>
                <ShoppingBag className="h-3.5 w-3.5" /> Shop Now
              </div>
            </div>
          </Link>

          {/* Two stacked smaller cards */}
          <div className="flex flex-col gap-5">
            {WIGS.slice(1).map((wig) => (
              <Link key={wig.name} href={wig.href}
                className="group relative overflow-hidden flex-1"
                style={{ borderRadius: 18, minHeight: 220 }}>
                <Image src={wig.img} alt={wig.name} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)' }} />
                <div className="absolute top-3 left-3 rounded-full px-2.5 py-1"
                  style={{ background: '#c9a227' }}>
                  <span className="text-[9px] font-black text-white tracking-[0.2em]">{wig.tag}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-white font-bold text-base sm:text-lg">{wig.name}</h3>
                      <p className="mt-0.5 text-white/50 text-xs">{wig.price}</p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full text-black transition-opacity group-hover:opacity-90"
                      style={{ background: '#c9a227' }}>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
