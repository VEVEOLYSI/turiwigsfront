import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />

      {/* Decorative gradient orbs */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-white/3 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
            Tiuri Nails & Wigs Parlour
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Look Your Best,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
              Every Day.
            </span>
          </h1>
          <p className="mt-6 text-lg text-neutral-400 leading-relaxed max-w-lg">
            Premium human hair wigs, expert nail services, and professional wig styling — all in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/products">
              <Button size="lg" className="bg-white text-black hover:bg-neutral-100 gap-2">
                Shop Wigs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10">
                Book a Service
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
