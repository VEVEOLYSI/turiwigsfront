// Transcribed from public/document/pricelist.jpg. Keep the two in step when
// prices change — the page shows this text first and the image beside it.

export interface PriceSection {
  title: string;
  items: Array<{ name: string; price: number }>;
}

export const PRICE_LIST: PriceSection[] = [
  {
    title: 'Manicure',
    items: [
      { name: 'Classic Manicure', price: 1800 },
      { name: 'Glow Manicure', price: 2500 },
      { name: 'Signature Manicure', price: 3000 },
      { name: 'Tiuri Spa Manicure', price: 4000 },
    ],
  },
  {
    title: 'Pedicure',
    items: [
      { name: 'Classic Pedicure', price: 2000 },
      { name: 'Glow Pedicure', price: 2800 },
      { name: 'Signature Pedicure', price: 4000 },
      { name: 'Tiuri Spa Pedicure', price: 4500 },
    ],
  },
  {
    title: 'Nail Extensions',
    items: [
      { name: 'Acrylic Sculpting', price: 5500 },
      { name: 'Ombre Acrylics', price: 4500 },
      { name: 'Acrylics + Tips', price: 4000 },
      { name: 'Acrylics + Gel', price: 3500 },
      { name: 'Sculpting Overlays', price: 4500 },
      { name: 'Overlays', price: 3000 },
      { name: 'Gel Nails', price: 3500 },
    ],
  },
  {
    title: 'Stickons',
    items: [
      { name: 'Stickons + Gel', price: 2000 },
      { name: 'Normal Polish', price: 1000 },
      { name: 'Gel Application', price: 1200 },
    ],
  },
  {
    title: 'Refills',
    items: [
      { name: 'Acrylics', price: 3000 },
      { name: 'Gel Nails', price: 3000 },
      { name: 'Hard Gel', price: 2500 },
    ],
  },
  {
    title: 'Toe Nail',
    items: [
      { name: 'Gel Application', price: 1200 },
      { name: 'Sculpting', price: 3000 },
      { name: 'Acrylics', price: 3000 },
      { name: 'Stickons', price: 2000 },
      { name: 'Overlays', price: 2500 },
    ],
  },
  {
    title: 'Soak Off',
    items: [
      { name: 'Gel', price: 200 },
      { name: 'Overlays / Acrylics', price: 400 },
      { name: 'Gel Nails / Acrylic Tip', price: 500 },
    ],
  },
  {
    title: 'Treatment',
    items: [{ name: 'Nail Treatment', price: 2500 }],
  },
];
