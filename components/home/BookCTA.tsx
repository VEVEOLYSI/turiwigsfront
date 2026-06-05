'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

/* 9 photos spread left-to-right across the full section */
const BG_PHOTOS = [
  { src: '/images/nails-8.jpeg',    rotate: -9,  left: '0%',   top: '8%',  w: '13%', h: '72%', z: 1 },
  { src: '/images/nails-5.jpeg',    rotate: -4,  left: '11%',  top: '28%', w: '12%', h: '56%', z: 2 },
  { src: '/images/nails-3.jpeg',    rotate: -1,  left: '21%',  top: '3%',  w: '13%', h: '70%', z: 3 },
  { src: '/images/nails-6.jpeg',    rotate:  3,  left: '32%',  top: '0%',  w: '11%', h: '58%', z: 2 },
  { src: '/images/salon-3.jpeg',    rotate: -4,  left: '31%',  top: '55%', w: '15%', h: '38%', z: 4 },
  { src: '/images/nails-10.jpeg',   rotate: -2,  left: '57%',  top: '1%',  w: '11%', h: '60%', z: 2 },
  { src: '/images/nails-9.jpeg',    rotate:  5,  left: '66%',  top: '22%', w: '13%', h: '58%', z: 3 },
  { src: '/images/salon-4.jpeg',    rotate:  8,  left: '77%',  top: '5%',  w: '12%', h: '66%', z: 2 },
  { src: '/images/tiuri-wigs.jpeg', rotate: 11,  left: '87%',  top: '16%', w: '13%', h: '62%', z: 1 },
];

export function BookCTA() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#ffffff', minHeight: 640 }}
    >
      {/* ── Photo collage background ──────────────────────────────────── */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none" aria-hidden>
        {BG_PHOTOS.map((p, i) => (
          <div
            key={i}
            className="absolute overflow-hidden"
            style={{
              left:         p.left,
              top:          p.top,
              width:        p.w,
              height:       p.h,
              zIndex:       p.z,
              transform:    `rotate(${p.rotate}deg)`,
              borderRadius: 14,
              border:       '4px solid #ffffff',
              boxShadow:    '0 16px 40px rgba(0,0,0,0.14), 0 4px 10px rgba(0,0,0,0.08)',
            }}
          >
            <Image
              src={p.src}
              alt=""
              fill
              className="object-cover"
              sizes="14vw"
            />
          </div>
        ))}
      </div>

      {/* ── White radial overlay — clear centre for text ──────────────── */}
      <div
        className="hidden lg:block absolute inset-0 pointer-events-none"
        style={{
          zIndex: 6,
          background:
            'radial-gradient(ellipse 32% 85% at 50% 50%,' +
            'rgba(255,255,255,0.97) 0%,' +
            'rgba(255,255,255,0.72) 40%,' +
            'rgba(255,255,255,0) 68%)',
        }}
      />

      {/* Gold accent lines */}
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{ zIndex: 20,
        background: 'linear-gradient(90deg,transparent,#c9a227 30%,#f0d878 50%,#c9a227 70%,transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none" style={{ zIndex: 20, opacity: 0.4,
        background: 'linear-gradient(90deg,transparent,#c9a227 30%,#f0d878 50%,#c9a227 70%,transparent)' }} />

      {/* ── Text — centred over the collage ───────────────────────────── */}
      <div
        className="relative hidden lg:flex items-center justify-center py-24"
        style={{ zIndex: 10, minHeight: 640 }}
      >
        <div className="text-center max-w-lg px-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-8"
            style={{ borderColor: 'rgba(201,162,39,0.5)', background: 'rgba(255,255,255,0.95)' }}>
            <Calendar className="h-3.5 w-3.5" style={{ color: '#c9a227' }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: '#c9a227' }}>
              Book an Appointment
            </span>
          </div>

          <h2 className="font-bold leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.6rem, 4.5vw, 4.2rem)', color: '#0a2e1f' }}>
            Ready to Look
            <br />
            <span style={{ color: '#c9a227' }}>Your Best?</span>
          </h2>

          <p className="text-sm sm:text-base leading-relaxed mb-8 mx-auto max-w-sm"
            style={{ color: 'rgba(10,46,31,0.6)' }}>
            Secure your spot at Tiuri Nails & Wigs Parlour — manicures, pedicures,
            and premium wig styling all in one beautiful place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/bookings"
              className="inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-black transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#f0d878 0%,#c9a227 100%)' }}>
              <Calendar className="h-4 w-4" />
              Book Your Appointment
            </Link>
            <Link href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest transition-colors"
              style={{ color: 'rgba(10,46,31,0.45)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0a2e1f'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(10,46,31,0.45)'; }}>
              Browse Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="text-xs" style={{ color: 'rgba(10,46,31,0.3)' }}>
            Walk-ins welcome · Located in Nairobi · Mon – Sat 9am – 7pm
          </p>
        </div>
      </div>

      {/* ── Mobile — simple grid + text ───────────────────────────────── */}
      <div className="lg:hidden py-16 px-4">
        <div className="grid grid-cols-3 gap-2 mb-10">
          {BG_PHOTOS.slice(0, 6).map((p, i) => (
            <div key={i} className="relative overflow-hidden"
              style={{ borderRadius: 10, border: '3px solid #fff',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)', aspectRatio: '3/4' }}>
              <Image src={p.src} alt="" fill className="object-cover" sizes="33vw" />
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-6"
            style={{ borderColor: 'rgba(201,162,39,0.5)', background: 'rgba(201,162,39,0.07)' }}>
            <Calendar className="h-3.5 w-3.5" style={{ color: '#c9a227' }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em]"
              style={{ color: '#c9a227' }}>Book an Appointment</span>
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#0a2e1f' }}>
            Ready to Look <span style={{ color: '#c9a227' }}>Your Best?</span>
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(10,46,31,0.55)' }}>
            Manicures, pedicures, and premium wig styling — walk in feeling good,
            walk out feeling extraordinary.
          </p>
          <Link href="/bookings"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-black"
            style={{ background: 'linear-gradient(135deg,#f0d878 0%,#c9a227 100%)' }}>
            <Calendar className="h-4 w-4" /> Book Now
          </Link>
        </div>
      </div>

    </section>
  );
}
