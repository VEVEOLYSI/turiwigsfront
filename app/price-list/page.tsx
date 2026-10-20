import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PRICE_LIST } from '@/data/price-list';
import { formatPrice } from '@/utils/formatters';
import { whatsappLink } from '@/config/contact';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
// A static import gives Next the image's size and a blur placeholder at
// build time, so the frame holds its shape and fills in without a jump.
import priceListImage from '@/public/document/pricelist.jpg';

export const metadata: Metadata = {
  title: 'Price List · Tiuri Nails & Wigs Parlour',
  description: 'Manicure, pedicure, nail extension, refill and treatment prices at Tiuri, TRM Drive, Nairobi.',
};

/* Server-rendered and static: the prices arrive as text in the first HTML
   response, so they are readable before any image or script has loaded. The
   printed list sits beside them for anyone who wants to save or share it. */

export default function PriceListPage() {
  return (
    <div className="bg-sand px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 sm:mb-10">
          <h1 className="display text-[2.4rem] leading-[1.05] sm:text-[3rem]">Price list</h1>
          <p className="measure mt-3 text-[15px] leading-relaxed text-slate">
            All prices in Kenyan shillings. Nail art is charged separately.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/bookings/services" className="btn btn-primary w-full sm:w-auto">
              Book an appointment
            </Link>
            <a
              href={whatsappLink("Hi Tiuri, I'm looking at your price list and have a question.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline w-full sm:w-auto"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              Ask on WhatsApp
            </a>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
          {/* ── Text version ─────────────────────────────────────────────── */}
          <div className="card grid gap-x-10 gap-y-8 p-6 sm:grid-cols-2 sm:p-8">
            {PRICE_LIST.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-mute">
                  {section.title}
                </h2>
                <ul className="space-y-2.5">
                  {section.items.map((item) => (
                    <li key={item.name} className="flex items-baseline gap-2 text-[15px]">
                      <span>{item.name}</span>
                      <span className="flex-1 translate-y-[-3px] border-b border-dotted border-line-2" aria-hidden />
                      <span className="font-semibold tabular-nums">{formatPrice(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* ── The printed list ─────────────────────────────────────────── */}
          <figure className="lg:sticky lg:top-24 lg:self-start">
            <a href={priceListImage.src} target="_blank" rel="noopener" className="print relative block overflow-hidden">
              <Image
                src={priceListImage}
                alt="Tiuri printed price list"
                placeholder="blur"
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 26rem"
                className="h-auto w-full"
              />
            </a>
            <figcaption className="mt-3 text-center text-[13px] text-mute">
              Tap the image to open it full size.
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
