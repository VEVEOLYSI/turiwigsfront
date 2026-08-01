'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Shuffle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { homepageImagesApi } from '@/api/homepage-images.api';

type SlotPreset = { top: string; left: string; rotate: number; z: number; wPct: number; hPct: number };

const SLOTS_6: SlotPreset[] = [
  { top: '38%', left: '-2%', rotate: -18, z: 1, wPct: 30, hPct: 42 },
  { top: '18%', left: '14%', rotate: -10, z: 2, wPct: 32, hPct: 46 },
  { top: '4%',  left: '32%', rotate: -3,  z: 3, wPct: 35, hPct: 52 },
  { top: '12%', left: '54%', rotate: 6,   z: 4, wPct: 33, hPct: 47 },
  { top: '28%', left: '70%', rotate: 13,  z: 5, wPct: 30, hPct: 43 },
  { top: '42%', left: '82%', rotate: 20,  z: 6, wPct: 28, hPct: 40 },
];

const SLOTS_6_MOBILE: SlotPreset[] = [
  { top: '36%', left: '0%',  rotate: -14, z: 1, wPct: 34, hPct: 42 },
  { top: '14%', left: '18%', rotate: -7,  z: 2, wPct: 36, hPct: 46 },
  { top: '2%',  left: '36%', rotate: -2,  z: 3, wPct: 38, hPct: 50 },
  { top: '10%', left: '56%', rotate: 5,   z: 4, wPct: 36, hPct: 46 },
  { top: '26%', left: '66%', rotate: 11,  z: 5, wPct: 32, hPct: 42 },
  { top: '38%', left: '62%', rotate: 15,  z: 6, wPct: 30, hPct: 38 },
];

const SLOTS_3: SlotPreset[] = [
  { top: '10%', left: '8%',  rotate: -8, z: 1, wPct: 38, hPct: 55 },
  { top: '20%', left: '34%', rotate: 3,  z: 2, wPct: 40, hPct: 58 },
  { top: '6%',  left: '60%', rotate: 11, z: 3, wPct: 36, hPct: 52 },
];

const SLOTS_3_MOBILE: SlotPreset[] = [
  { top: '8%',  left: '4%',  rotate: -7, z: 1, wPct: 42, hPct: 58 },
  { top: '22%', left: '32%', rotate: 2,  z: 2, wPct: 46, hPct: 62 },
  { top: '4%',  left: '54%', rotate: 9,  z: 3, wPct: 42, hPct: 56 },
];

function getStageWidth(vw: number): number {
  if (vw < 640) return Math.min(vw - 48, 320);
  if (vw < 768) return Math.min(vw - 64, 400);
  if (vw < 1024) return Math.min((vw - 96) / 2, 380);
  if (vw < 1280) return Math.min((vw - 128) / 2, 430);
  return 460;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface PhotoFanProps {
  title: string;
  images: string[];
  slots: SlotPreset[];
  mobileSlots: SlotPreset[];
  heightRatio: number;
}

function PhotoFan({ title, images, slots, mobileSlots, heightRatio }: PhotoFanProps) {
  const [order, setOrder]         = useState<string[]>(() => images.slice(0, slots.length));
  const [animating, setAnimating] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [stageWidth, setStageWidth] = useState(420);
  const [isMobile, setIsMobile]   = useState(false);

  useEffect(() => {
    setOrder(shuffle(images).slice(0, slots.length));
  }, [images, slots.length]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function update() {
      const vw = window.innerWidth;
      setStageWidth(getStageWidth(vw));
      setIsMobile(vw < 640);
    }
    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(update, 120);
    }
    update();
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('resize', schedule);
      clearTimeout(timer);
    };
  }, []);

  const activeSlots = isMobile ? mobileSlots : slots;
  const stageHeight = Math.round(stageWidth * heightRatio);

  const handleShuffle = useCallback(() => {
    if (animating || images.length === 0) return;
    setAnimating(true);
    setTimeout(() => {
      setOrder(shuffle(images).slice(0, slots.length));
      setAnimating(false);
    }, 400);
  }, [animating, images, slots.length]);

  const openLightbox  = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImg = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + order.length) % order.length)),
    [order.length]
  );
  const nextImg = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % order.length)),
    [order.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImg();
      if (e.key === 'ArrowRight') nextImg();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, closeLightbox, prevImg, nextImg]);

  if (images.length === 0) {
    return null; // Keep section completely blank when no images uploaded by admin
  }

  return (
    <div className="flex flex-col items-center gap-5 sm:gap-6 w-full min-w-0">
      <p
        className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em]"
        style={{ color: '#0a2e1f' }}
      >
        {title}
      </p>

      <div
        className="relative w-full max-w-full overflow-hidden"
        style={{ height: stageHeight }}
      >
        {order.map((src, i) => {
          const s = activeSlots[i];
          if (!s) return null;
          const w = Math.round((s.wPct / 100) * stageWidth);
          const h = Math.round((s.hPct / 100) * stageHeight);
          return (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => openLightbox(i)}
              aria-label={`View ${title} photo ${i + 1} full size`}
              className="absolute group cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a227]"
              style={{
                top: s.top,
                left: s.left,
                width: w,
                height: h,
                zIndex: s.z,
                transform: `rotate(${s.rotate}deg)`,
                transition: animating
                  ? 'opacity 400ms ease, transform 400ms cubic-bezier(0.4,0,0.2,1), width 200ms ease, height 200ms ease'
                  : 'opacity 500ms ease, transform 500ms cubic-bezier(0.34,1.56,0.64,1), width 200ms ease, height 200ms ease',
                opacity: animating ? 0.4 : 1,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.12)',
                border: '2.5px solid #ffffff',
              }}
            >
              <Image
                src={src}
                alt={`${title} style ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-[9px] font-semibold tracking-[0.18em] uppercase bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  View
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleShuffle}
        disabled={animating}
        className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full px-5 py-3 sm:px-7 sm:py-3.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] transition-all duration-200 disabled:opacity-40"
        style={{ background: '#0a2e1f', color: '#f0d878', boxShadow: '0 4px 16px rgba(10,46,31,0.2)' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1e5038'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0a2e1f'; }}
      >
        <Shuffle className="h-3.5 w-3.5" />
        Shuffle {title}
      </button>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm px-3 sm:px-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image viewer`}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            style={{ width: 38, height: 38 }}
          >
            <X className="text-white" style={{ width: 16, height: 16 }} />
          </button>

          {order.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImg(); }}
                aria-label="Previous image"
                className="absolute left-1 sm:left-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                style={{ width: 38, height: 38 }}
              >
                <ChevronLeft className="text-white" style={{ width: 18, height: 18 }} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); nextImg(); }}
                aria-label="Next image"
                className="absolute right-1 sm:right-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                style={{ width: 38, height: 38 }}
              >
                <ChevronRight className="text-white" style={{ width: 18, height: 18 }} />
              </button>
            </>
          )}

          <div className="relative w-full h-full max-w-4xl max-h-[80vh] sm:max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={order[lightboxIndex]}
              alt={`${title} style ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <p className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-[10px] sm:text-[11px] tracking-[0.15em] px-2 text-center">
            {title} — {lightboxIndex + 1} / {order.length}
          </p>
        </div>
      )}
    </div>
  );
}

export function Philosophy() {
  const [nailsImages, setNailsImages] = useState<string[]>([]);
  const [wigsImages,  setWigsImages]  = useState<string[]>([]);

  useEffect(() => {
    homepageImagesApi.list()
      .then(({ data }) => {
        const grouped = data.data ?? {};
        setNailsImages((grouped.philosophy_nails ?? []).map((img) => img.url));
        setWigsImages((grouped.philosophy_wigs ?? []).map((img) => img.url));
      })
      .catch(() => {
        setNailsImages([]);
        setWigsImages([]);
      });
  }, []);

  if (nailsImages.length === 0 && wigsImages.length === 0) {
    return null; // Keep section completely blank when no images posted
  }

  return (
    <section className="py-14 sm:py-20 lg:py-28 overflow-x-hidden" style={{ background: '#ffffff' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 sm:gap-16 md:gap-8 lg:gap-10">
          <PhotoFan title="Nails" images={nailsImages} slots={SLOTS_6} mobileSlots={SLOTS_6_MOBILE} heightRatio={1.05} />
          <PhotoFan title="Wigs"  images={wigsImages}  slots={SLOTS_3} mobileSlots={SLOTS_3_MOBILE} heightRatio={0.95} />
        </div>
      </div>
    </section>
  );
}