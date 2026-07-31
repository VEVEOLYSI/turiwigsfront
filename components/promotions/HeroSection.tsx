'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import heroData from '@/data/hero.json';

/* ── constants ───────────────────────────────────────────────────────────── */
const HEADER_H = 66;
const CARD_MS  = 5500;

/* ── responsive card dimensions ─────────────────────────────────────────── */
interface Dims { CW: number; CH: number; SW: number; SH: number; GAP: number }

function getDims(vw: number): Dims {
  if (vw < 640) {
    const cw = Math.round(vw * 0.68);
    const sw = Math.round(vw * 0.36);
    return { CW: cw, CH: 290, SW: sw, SH: 240, GAP: 8 };
  }
  if (vw < 1024) {
    const cw = Math.min(Math.round(vw * 0.52), 520);
    const sw = Math.round(vw * 0.29);
    return { CW: cw, CH: 370, SW: sw, SH: 305, GAP: 24 };
  }
  return { CW: 640, CH: 430, SW: 375, SH: 360, GAP: 52 };
}

/* ── card roles ──────────────────────────────────────────────────────────── */
type Role = 'active' | 'prev' | 'next' | 'hidden-l' | 'hidden-r';

function getRole(i: number, active: number, n: number): Role {
  if (i === active) return 'active';
  const dist = ((i - active) + n) % n;
  if (dist === 1)     return 'next';
  if (dist === n - 1) return 'prev';
  return dist <= n / 2 ? 'hidden-r' : 'hidden-l';
}

/* ── transition ──────────────────────────────────────────────────────────── */
const TRANS = [
  'left 560ms cubic-bezier(0.4,0,0.2,1)',
  'width 560ms cubic-bezier(0.4,0,0.2,1)',
  'height 560ms cubic-bezier(0.4,0,0.2,1)',
  'opacity 560ms ease',
  'transform 560ms cubic-bezier(0.4,0,0.2,1)',
].join(',');

/*
 * Curved carousel: side cards rotate on Y-axis and recede in Z,
 * giving the illusion they sit along an invisible arc behind the active card.
 */
function cardStyle(role: Role, d: Dims): React.CSSProperties {
  const base: React.CSSProperties = {
    position:      'absolute',
    top:           0,
    display:       'flex',
    flexDirection: 'column',
    overflow:      'hidden',
    borderRadius:  14,
    transition:    TRANS,
    willChange:    'left, width, height, opacity, transform',
  };

  switch (role) {
    case 'active':
      return {
        ...base,
        left:            `calc(50% - ${d.CW / 2}px)`,
        width: d.CW,     height: d.CH,
        opacity:         1,
        zIndex:          10,
        /* sits closest to viewer — no rotation, full scale */
        transform:       'perspective(1100px) rotateY(0deg) translateZ(0px) scale(1)',
        transformOrigin: 'center bottom',
        boxShadow:       '0 28px 90px rgba(0,0,0,0.72)',
      };

    case 'prev':
      return {
        ...base,
        left:            `calc(50% - ${d.CW / 2 + d.GAP + d.SW}px)`,
        width: d.SW,     height: d.SH,
        opacity:         0.82,
        zIndex:          5,
        /* rotated toward viewer on the right edge, receding in Z */
        transform:       'perspective(1100px) rotateY(7deg) translateZ(-55px) scale(0.93)',
        transformOrigin: 'right bottom',
        boxShadow:       '0 16px 50px rgba(0,0,0,0.48)',
      };

    case 'next':
      return {
        ...base,
        left:            `calc(50% + ${d.CW / 2 + d.GAP}px)`,
        width: d.SW,     height: d.SH,
        opacity:         0.82,
        zIndex:          5,
        /* mirror of prev — rotates and recedes on the left edge */
        transform:       'perspective(1100px) rotateY(-7deg) translateZ(-55px) scale(0.93)',
        transformOrigin: 'left bottom',
        boxShadow:       '0 16px 50px rgba(0,0,0,0.48)',
      };

    /* hidden cards are pre-positioned on their eventual side so they fade
       in without flying across the screen when they become visible */
    case 'hidden-l':
      return {
        ...base,
        left:          `calc(50% - ${d.CW / 2 + d.GAP + d.SW}px)`,
        width: d.SW,   height: d.SH,
        opacity:       0,
        zIndex:        1,
        transform:     'perspective(1100px) rotateY(7deg) translateZ(-55px) scale(0.93)',
        transformOrigin: 'right bottom',
        pointerEvents: 'none',
      };

    case 'hidden-r':
      return {
        ...base,
        left:          `calc(50% + ${d.CW / 2 + d.GAP}px)`,
        width: d.SW,   height: d.SH,
        opacity:       0,
        zIndex:        1,
        transform:     'perspective(1100px) rotateY(-7deg) translateZ(-55px) scale(0.93)',
        transformOrigin: 'left bottom',
        pointerEvents: 'none',
      };
  }
}

/* ── component ───────────────────────────────────────────────────────────── */
export function HeroSection() {
  const [activeCard, setActiveCard] = useState(0);
  const [dims, setDims] = useState<Dims>({ CW: 640, CH: 430, SW: 375, SH: 360, GAP: 52 });

  const vidRefs   = useRef<(HTMLVideoElement | null)[]>([]);
  const cardTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const N           = heroData.gallery.length;
  const activeVideo = heroData.gallery[activeCard].videoSrc;

  /* responsive dimensions */
  useEffect(() => {
    function update() { setDims(getDims(window.innerWidth)); }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* auto-advance card — video follows via activeVideo */
  useEffect(() => {
    cardTimer.current = setTimeout(
      () => setActiveCard((c) => (c + 1) % N),
      CARD_MS,
    );
    return () => clearTimeout(cardTimer.current);
  }, [activeCard, N]);

  /* sync video playback to active card */
  useEffect(() => {
    vidRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (heroData.videos[i] === activeVideo) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [activeVideo]);

  return (
    <section
      className="relative w-full flex flex-col overflow-hidden"
      style={{
        minHeight: 'max(100svh, 680px)',
        marginTop: `-${HEADER_H}px`,
        background: '#080808',
      }}
    >
      {/* ══ Video background — cover fills the entire page ══════════════════ */}
      {heroData.videos.map((src, i) => (
        <video
          key={src}
          ref={(el) => { vidRefs.current[i] = el; }}
          src={src}
          muted loop playsInline preload="auto"
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            transition: 'opacity 700ms ease',
            opacity: src === activeVideo ? 1 : 0,
          }}
        />
      ))}

      {/* ══ Gradient overlay ════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: [
            'linear-gradient(to bottom,',
            'rgba(0,0,0,0.76)  0%,',
            'rgba(0,0,0,0.10) 40%,',
            'rgba(0,0,0,0.58) 68%,',
            'rgba(0,0,0,0.96) 100%)',
          ].join(' '),
        }}
      />

      {/* ══ Hero text ═══════════════════════════════════════════════════════ */}
      <div
        className="relative z-20 flex flex-1 flex-col items-center justify-center text-center px-5 sm:px-6"
        style={{ paddingTop: HEADER_H, paddingBottom: 28 }}
      >
        <p
          className="mb-4 sm:mb-5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.4em]"
          style={{ color: 'rgba(255,255,255,0.48)' }}
        >
          {heroData.brand}
        </p>

        <h1
          className="font-bold text-white leading-[1.02] tracking-tight"
          style={{ fontSize: 'clamp(2.6rem, 9vw, 7rem)' }}
        >
          {heroData.headline[0]}
          <br />
          {heroData.headline[1]}
        </h1>

        <div className="mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={heroData.cta.href}
            className="inline-flex items-center gap-2 sm:gap-2.5 bg-white text-black font-bold tracking-[0.12em] sm:tracking-[0.14em] px-8 sm:px-11 py-3.5 sm:py-4 hover:opacity-90 active:scale-[0.97] transition-all"
            style={{ fontSize: 12 }}
          >
            {heroData.cta.label}
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 sm:gap-2.5 font-bold tracking-[0.12em] sm:tracking-[0.14em] px-8 sm:px-11 py-3.5 sm:py-4 hover:opacity-90 active:scale-[0.97] transition-all"
            style={{
              fontSize: 12,
              color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.5)',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            Shop Wigs
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Link>
        </div>

        <p
          className="mt-2.5 sm:mt-3"
          style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}
        >
          {heroData.ctaSub}
        </p>
      </div>

      {/* ══ Curved card carousel ════════════════════════════════════════════ */}
      <div
        className="relative z-20 flex-shrink-0"
        style={{ height: dims.CH + 40 }}
      >
        {/* Prev arrow */}
        <button
          onClick={() => setActiveCard((c) => (c - 1 + N) % N)}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
          style={{ width: dims.CW < 400 ? 32 : 40, height: dims.CW < 400 ? 32 : 40 }}
        >
          <ChevronLeft className="text-white" style={{ width: dims.CW < 400 ? 14 : 18, height: dims.CW < 400 ? 14 : 18 }} />
        </button>

        {/* Next arrow */}
        <button
          onClick={() => setActiveCard((c) => (c + 1) % N)}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
          style={{ width: dims.CW < 400 ? 32 : 40, height: dims.CW < 400 ? 32 : 40 }}
        >
          <ChevronRight className="text-white" style={{ width: dims.CW < 400 ? 14 : 18, height: dims.CW < 400 ? 14 : 18 }} />
        </button>

        {/* Card stage */}
        <div className="relative w-full" style={{ height: dims.CH }}>
          {heroData.gallery.map((item, i) => {
            const role     = getRole(i, activeCard, N);
            const isActive = role === 'active';

            return (
              <div key={item.src} style={cardStyle(role, dims)}>

                {/* Mini website header */}
                <div
                  className="flex-shrink-0 flex items-center justify-between gap-2 px-3 sm:px-4"
                  style={{
                    height:       36,
                    background:   '#100e0a',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <span
                    className="font-bold tracking-[0.16em] text-white whitespace-nowrap"
                    style={{ fontSize: 9 }}
                  >
                    TIURI
                  </span>

                  <div className="hidden sm:flex items-center gap-3 flex-1 justify-center">
                    {['Shop', 'Services', 'Gallery', 'Book'].map((l) => (
                      <span
                        key={l}
                        style={{ fontSize: 8, color: 'rgba(255,255,255,0.36)', letterSpacing: '0.05em' }}
                      >
                        {l}
                      </span>
                    ))}
                  </div>

                  <div
                    className="rounded-full border px-2 sm:px-2.5 py-1 whitespace-nowrap"
                    style={{
                      fontSize:    8,
                      fontWeight:  600,
                      letterSpacing: '0.05em',
                      borderColor: 'rgba(255,255,255,0.2)',
                      color:       'rgba(255,255,255,0.68)',
                    }}
                  >
                    Book Now
                  </div>
                </div>

                {/* Full-bleed image */}
                <div className="relative flex-1">
                  <Image
                    src={item.src}
                    alt={item.text}
                    fill
                    className="object-cover"
                    sizes={`(max-width: 640px) 70vw, (max-width: 1024px) 52vw, 640px`}
                    priority={i < 3}
                  />

                  {/* Dark gradient for text contrast */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top,' +
                        'rgba(0,0,0,0.88) 0%,' +
                        'rgba(0,0,0,0.16) 50%,' +
                        'transparent 100%)',
                    }}
                  />

                  {/* Gold badge — tilted like the PLANTS sticker */}
                  <div
                    className="absolute top-3 left-3 sm:top-5 sm:left-5 rounded-full"
                    style={{
                      background:  '#c9a227',
                      padding:     isActive ? '7px 14px' : '5px 10px',
                      transform:   'rotate(-2deg)',
                      boxShadow:   '0 4px 16px rgba(0,0,0,0.35)',
                      transition:  'padding 560ms ease',
                    }}
                  >
                    <span
                      className="font-black text-white"
                      style={{ fontSize: isActive ? 10 : 8, letterSpacing: '0.2em' }}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 sm:px-6 sm:pb-5">
                    <p
                      className="text-white font-bold leading-tight"
                      style={{
                        fontSize:    isActive
                          ? (dims.CW < 350 ? 14 : dims.CW < 500 ? 17 : 21)
                          : (dims.SW < 160 ? 9  : 12),
                        textShadow:  '0 2px 8px rgba(0,0,0,0.6)',
                        transition:  'font-size 560ms ease',
                      }}
                    >
                      {item.text}
                    </p>

                    {isActive && (
                      <Link
                        href={item.href}
                        className="mt-2 sm:mt-3 inline-flex items-center gap-1 sm:gap-1.5 uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                        style={{ fontSize: 9, fontWeight: 600 }}
                      >
                        View More <ArrowRight style={{ width: 9, height: 9 }} />
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
