'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Tiuri+Nails+%26+Wigs+Parlour,+Jewel+Complex,+Room+220,+2nd+Floor+TRM+Dr,+Nairobi';
const ADDRESS = 'Jewel Complex, Room 220, 2nd Floor, TRM Drive, Nairobi';

const links = {
  Shop: [
    { label: 'All Wigs', href: '/products' },
    { label: 'Human Hair', href: '/products?categorySlug=human-hair' },
    { label: 'Lace Front', href: '/products?categorySlug=lace-front' },
    { label: 'Flash Sales', href: '/promotions/flash-sales' },
  ],
  Services: [
    { label: 'All Services', href: '/services' },
    { label: 'Book Appointment', href: '/bookings' },
    { label: 'My Bookings', href: '/account/bookings' },
    { label: 'My Orders', href: '/account/orders' },
  ],
  Company: [
    { label: 'Blog', href: '/blog' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
};

/* SVG icons for platforms not in lucide-react */
function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.532-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const SOCIALS = [
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@tiurinails',
    Icon: TikTokIcon,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/tiurinails',
    Icon: FacebookIcon,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/tiurinails',
    Icon: InstagramIcon,
  },
];

export function Footer() {
  return (
    <footer style={{ background: '#0a2e1f', borderTop: '1px solid rgba(201,162,39,0.3)' }}>
      {/* Gold top divider */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #c9a227 30%, #f0d878 50%, #c9a227 70%, transparent)', opacity: 0.6 }} />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden"
                style={{ boxShadow: '0 2px 12px rgba(201,162,39,0.4)' }}>
                <Image src="/logo.jpeg" alt="Tiuri" fill className="object-cover" />
              </div>
              <div>
                <p className="font-bold text-base" style={{ color: '#f0d878' }}>Tiuri</p>
                <p className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(201,162,39,0.7)' }}>
                  Nails & Wigs Parlour
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Premium human hair wigs, nails, and professional wig styling in Nairobi, Kenya. Beauty is our craft.
            </p>

            {/* Address + directions */}
            <div className="mt-5">
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: '#c9a227' }} />
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {ADDRESS}
                </p>
              </div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-opacity hover:opacity-80"
                style={{ background: 'linear-gradient(135deg,#f0d878,#c9a227)', color: '#0a2e1f' }}
              >
                <MapPin className="h-3 w-3" />
                Get Directions
              </a>
            </div>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-150"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(201,162,39,0.2)';
                    el.style.color = '#f0d878';
                    el.style.borderColor = 'rgba(201,162,39,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(255,255,255,0.08)';
                    el.style.color = 'rgba(255,255,255,0.6)';
                    el.style.borderColor = 'rgba(255,255,255,0.12)';
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: '#c9a227', textShadow: '0 1px 4px rgba(201,162,39,0.4)' }}>
                {section}
              </h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}
                      className="text-sm transition-colors duration-150"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#f0d878'; }}
                      onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Gold divider */}
        <div className="my-10 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.3), transparent)' }} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Tiuri Nails & Wigs Parlour. All rights reserved. Nairobi, Kenya.
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Link href="/terms"
              className="transition-colors hover:text-gold"
              style={{ color: 'rgba(255,255,255,0.3)' }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#f0d878'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.3)'; }}>
              Terms & Conditions
            </Link>
            <span style={{ color: 'rgba(201,162,39,0.4)' }}>·</span>
            <span style={{ color: 'rgba(201,162,39,0.5)' }}>Payments secured by Paystack</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
