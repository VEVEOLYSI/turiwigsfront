import Link from 'next/link';
import Image from 'next/image';

const links = {
  Shop: [
    { label: 'All Wigs', href: '/products' },
    { label: 'Human Hair', href: '/products?categorySlug=human-hair' },
    { label: 'Lace Front', href: '/products?categorySlug=lace-front' },
    { label: 'Flash Sales', href: '/promotions/flash-sales' },
  ],
  Services: [
    { label: 'Wig Washing', href: '/services/wig-washing' },
    { label: 'Wig Styling', href: '/services/wig-styling' },
    { label: 'Wig Repair', href: '/services/wig-repair' },
    { label: 'Book Now', href: '/services' },
  ],
  Account: [
    { label: 'My Orders', href: '/account/orders' },
    { label: 'My Bookings', href: '/account/bookings' },
    { label: 'Wishlist', href: '/account/wishlist' },
    { label: 'Profile', href: '/account/profile' },
  ],
};

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
                <Image src="/logo.svg" alt="Tiuri" fill className="object-contain p-0.5" />
              </div>
              <div>
                <p className="font-bold text-base" style={{ color: '#f0d878' }}>Tiuri</p>
                <p className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(201,162,39,0.7)' }}>
                  Nails & Wigs Parlour
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Premium human hair wigs, nails, and professional wig styling. Beauty is our craft.
            </p>
          </div>

          {/* Links */}
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
            © {new Date().getFullYear()} Tiuri Nails & Wigs Parlour. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'rgba(201,162,39,0.5)' }}>Payments secured by Paystack</p>
        </div>
      </div>
    </footer>
  );
}
