import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/store/provider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Toaster } from 'react-hot-toast';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: { default: 'Tiuri Nails & Wigs Parlour', template: '%s · Tiuri' },
  description: 'Tiuri Nails & Wigs Parlour — premium human hair wigs, nail services, and expert wig styling in Kenya.',
  keywords: ['wigs Kenya', 'human hair wigs', 'lace front wigs', 'nail parlour', 'Tiuri wigs', 'wig styling Nairobi'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-neutral-900">
        <StoreProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
