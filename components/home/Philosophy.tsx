'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Shuffle } from 'lucide-react';

const ALL_IMAGES = [
  '/images/nails-1.jpeg',
  '/images/nails-2.jpeg',
  '/images/nails-3.jpeg',
  '/images/nails-4.jpeg',
  '/images/nails-5.jpeg',
  '/images/nails-6.jpeg',
  '/images/nails-7.jpeg',
  '/images/nails-8.jpeg',
  '/images/nails-9.jpeg',
  '/images/nails-10.jpeg',
  '/images/salon-4.jpeg',
  '/images/salon-5.jpeg',
  '/images/tiuri-wigs.jpeg',
  '/images/tiuri-nails.jpeg',
];

/*
 * Each card has a fixed visual slot matching the reference image's fan scatter:
 * cards spread in an arc across the right panel, overlapping each other naturally.
 * top/left are percentage offsets within the scatter container.
 */
const SLOTS = [
  /* far-left, angled back */
  { top: '38%', left: '-2%',  rotate: -18, z: 1, w: 155, h: 210 },
  /* left, slightly less angled */
  { top: '18%', left: '12%',  rotate: -10, z: 2, w: 165, h: 225 },
  /* centre-left portrait — largest, most upright */
  { top:  '5%', left: '30%',  rotate:  -3, z: 3, w: 185, h: 265 },
  /* centre-right */
  { top: '12%', left: '52%',  rotate:   6, z: 4, w: 170, h: 235 },
  /* right */
  { top: '28%', left: '68%',  rotate:  13, z: 5, w: 158, h: 215 },
  /* far-right, most angled */
  { top: '42%', left: '80%',  rotate:  20, z: 6, w: 145, h: 198 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Philosophy() {
  /* Use a fixed initial order (same on server + client) to avoid hydration mismatch.
     After mount, shuffle once so the gallery looks random on every page load. */
  const [images, setImages]       = useState(ALL_IMAGES.slice(0, SLOTS.length));
  const [animating, setAnimating] = useState(false);
  const [tick, setTick]           = useState(0);

  useEffect(() => {
    setImages(shuffle(ALL_IMAGES).slice(0, SLOTS.length));
  }, []);

  const handleShuffle = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setImages(shuffle(ALL_IMAGES).slice(0, SLOTS.length));
      setTick((t) => (t + 1) % 4);
      setAnimating(false);
    }, 400);
  }, [animating]);

  return (
    <section className="py-20 sm:py-28 overflow-hidden" style={{ background: '#ffffff' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* ── Top tagline row ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-14">
          <div className="flex items-center gap-3">
            {['Nails', 'Wigs', 'Confidence'].map((w, i) => (
              <span key={w} className="flex items-center gap-3">
                {i > 0 && <span style={{ color: '#c9a227', fontSize: 12 }}>·</span>}
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.28em]"
                  style={{ color: '#0a2e1f' }}>
                  {w}
                </span>
              </span>
            ))}
          </div>

          {/* Italic headline right-aligned (mirrors reference) */}
          <div className="text-right hidden sm:block">
            <p className="font-bold italic leading-tight" style={{ fontSize: 'clamp(1.1rem,2vw,1.5rem)', color: '#0a2e1f' }}>
              Beauty that speaks for you
            </p>
            {/* tiny crown */}
            <div className="mt-1 flex justify-end">
              <svg width="18" height="15" viewBox="0 0 24 20" fill="none">
                <path d="M2 18L4 8L8 13L12 4L16 13L20 8L22 18H2Z"
                  stroke="#c9a227" strokeWidth="1.5" strokeLinejoin="round"
                  fill="rgba(201,162,39,0.15)" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Main two-column ───────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[420px_1fr] gap-12 items-start">

          {/* Left — text */}
          <div className="lg:pt-4">
            <h2 className="font-bold leading-[1.06] mb-6"
              style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)', color: '#0a2e1f' }}>
              Luxury Nails &amp; Wig Parlour
            </h2>

            <p className="text-sm sm:text-base leading-relaxed mb-8"
              style={{ color: 'rgba(10,46,31,0.55)' }}>
              Create a stylish, high-end experience at Tiuri. Our studio features a curated
              collection of premium nail art and luxury wigs — overlapping artistry with
              a fashionable, dynamic energy every visit.
            </p>

            {/* Visual pillars */}
            <div className="space-y-5 mb-10">
              {[
                { icon: '✦', title: 'Visual Style',       desc: 'Luxury, elegant, modern, and feminine — a colour palette of black, gold, blush pink, nude and cream.' },
                { icon: '✦', title: 'Gallery of Work',    desc: 'Multiple images displayed in an overlapping, shuffled stack — each a card with rounded corners and soft shadows.' },
                { icon: '✦', title: 'Shuffle Experience', desc: 'Images reshuffle smoothly. Cards slide, rotate slightly, and settle into a new stylish stack every time.' },
                { icon: '✦', title: 'Content',            desc: 'Nails: luxury nail designs, close-up shots, bling, acrylics, art. Wigs: lace fronts, curls, straight hair, short bobs, long waves.' },
              ].map((p) => (
                <div key={p.title} className="flex gap-3">
                  <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: '#c9a227' }}>{p.icon}</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#0a2e1f' }}>{p.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(10,46,31,0.5)' }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-6 border-t" style={{ borderColor: 'rgba(201,162,39,0.2)' }}>
              {[
                { value: '500+', label: 'Happy Clients' },
                { value: '5★',   label: 'Rated Salon'   },
                { value: '3+yrs', label: 'Of Artistry'   },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-8">
                  {i > 0 && <div className="w-px h-7" style={{ background: 'rgba(201,162,39,0.3)' }} />}
                  <div>
                    <p className="text-xl font-black" style={{ color: '#0a2e1f' }}>{s.value}</p>
                    <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: '#c9a227' }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — scattered fan of photos */}
          <div className="flex flex-col items-center gap-6">

            {/* Scatter stage — fixed height, cards positioned absolutely */}
            <div className="relative w-full" style={{ height: 480 }}>
              {images.map((src, i) => {
                const s = SLOTS[i];
                return (
                  <div
                    key={`${src}-${i}`}
                    className="absolute"
                    style={{
                      top:       s.top,
                      left:      s.left,
                      width:     s.w,
                      height:    s.h,
                      zIndex:    s.z,
                      transform: `rotate(${s.rotate}deg)`,
                      transition: animating
                        ? 'opacity 400ms ease, transform 400ms cubic-bezier(0.4,0,0.2,1)'
                        : 'opacity 500ms ease, transform 500ms cubic-bezier(0.34,1.56,0.64,1)',
                      opacity:    animating ? 0.4 : 1,
                      borderRadius: 16,
                      overflow: 'hidden',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.12)',
                      border: '2.5px solid #ffffff',
                    }}
                  >
                    <Image
                      src={src}
                      alt={`Tiuri gallery ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                );
              })}
            </div>

            {/* Shuffle button */}
            <button
              onClick={handleShuffle}
              disabled={animating}
              className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-200 disabled:opacity-40"
              style={{
                background: '#0a2e1f',
                color: '#f0d878',
                boxShadow: '0 4px 16px rgba(10,46,31,0.2)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#1e5038';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#0a2e1f';
              }}
            >
              <Shuffle className="h-3.5 w-3.5" />
              Shuffle
            </button>

            <p className="text-[11px] uppercase tracking-[0.25em]"
              style={{ color: 'rgba(10,46,31,0.3)' }}>
              New look. New vibe. Every time.
            </p>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width:  tick === i ? 22 : 6,
                    height: 6,
                    background: tick === i ? '#c9a227' : 'rgba(10,46,31,0.15)',
                  }}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
