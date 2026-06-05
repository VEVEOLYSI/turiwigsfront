import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, User } from 'lucide-react';

const POSTS = [
  {
    slug: 'how-to-care-for-your-human-hair-wig',
    title: 'How to Care for Your Human Hair Wig',
    excerpt: 'Proper maintenance extends the life of your wig significantly. Here are our top tips from the Tiuri studio for washing, conditioning and storing your investment.',
    img: '/images/salon-4.jpeg',
    category: 'Wig Care',
    author: 'Tiuri Team',
    date: 'May 28, 2025',
    readTime: '4 min read',
  },
  {
    slug: 'nail-trends-2025',
    title: 'Top Nail Trends to Try in 2025',
    excerpt: 'From glazed donut acrylics to bold chrome finishes, 2025 is a year of stunning nail art. Discover what our nail technicians are loving right now.',
    img: '/images/nails-9.jpeg',
    category: 'Nail Art',
    author: 'Tiuri Team',
    date: 'May 14, 2025',
    readTime: '3 min read',
  },
  {
    slug: 'lace-front-vs-full-lace-wig',
    title: 'Lace Front vs Full Lace: Which Is Right for You?',
    excerpt: 'Not sure which wig type suits your lifestyle and budget? We break down the key differences so you can walk in with confidence.',
    img: '/images/tiuri-wigs.jpeg',
    category: 'Wigs 101',
    author: 'Tiuri Team',
    date: 'April 30, 2025',
    readTime: '5 min read',
  },
  {
    slug: 'pedicure-guide',
    title: 'Why a Proper Pedicure Is More Than Just Pretty Toes',
    excerpt: 'A luxury pedicure is as much about foot health as it is about aesthetics. Learn what our pedicure service includes and why it matters.',
    img: '/images/nails-2.jpeg',
    category: 'Pedicure',
    author: 'Tiuri Team',
    date: 'April 15, 2025',
    readTime: '3 min read',
  },
  {
    slug: 'gel-vs-acrylic-nails',
    title: 'Gel vs Acrylic Nails: What You Need to Know',
    excerpt: 'Both are beautiful, but each comes with different strengths. Our nail technicians break down durability, cost and removal for you.',
    img: '/images/nails-4.jpeg',
    category: 'Nail Art',
    author: 'Tiuri Team',
    date: 'March 28, 2025',
    readTime: '4 min read',
  },
  {
    slug: 'wig-fitting-tips',
    title: '5 Things to Know Before Your First Wig Fitting',
    excerpt: 'First-time wig wearers often feel nervous — but it doesn\'t have to be. Here\'s everything you need to know before you come in for your fitting.',
    img: '/images/salon-5.jpeg',
    category: 'Wigs 101',
    author: 'Tiuri Team',
    date: 'March 10, 2025',
    readTime: '4 min read',
  },
];

const CATEGORIES = ['All', 'Wig Care', 'Wigs 101', 'Nail Art', 'Pedicure'];

export default function BlogPage() {
  const featured = POSTS[0];
  const rest = POSTS.slice(1);

  return (
    <main style={{ background: '#ffffff' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 text-center" style={{ background: '#faf6ed' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] mb-4"
            style={{ color: '#c9a227' }}>
            Beauty Insights
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5"
            style={{ color: '#0a2e1f' }}>
            The Tiuri Blog
          </h1>
          <p className="text-base sm:text-lg leading-relaxed"
            style={{ color: 'rgba(10,46,31,0.55)' }}>
            Tips, trends and expert advice from our Nairobi nail and wig studio.
          </p>
        </div>

        {/* Category filter (visual only — no routing) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 px-4">
          {CATEGORIES.map((cat, i) => (
            <span key={cat}
              className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
              style={i === 0 ? {
                background: '#0a2e1f', color: '#f0d878',
              } : {
                background: 'rgba(10,46,31,0.07)', color: '#0a2e1f',
              }}>
              {cat}
            </span>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">

        {/* ── Featured post ────────────────────────────────────────────── */}
        <Link href={`/blog/${featured.slug}`}
          className="group mb-14 grid lg:grid-cols-2 gap-8 items-center rounded-2xl overflow-hidden"
          style={{ background: '#faf6ed', border: '1px solid rgba(201,162,39,0.2)' }}>
          <div className="relative" style={{ aspectRatio: '16/10', minHeight: 280 }}>
            <Image src={featured.img} alt={featured.title} fill
              className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div className="p-8 lg:p-10">
            <span className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ background: '#c9a227', color: '#fff' }}>
              {featured.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold leading-snug mb-4"
              style={{ color: '#0a2e1f' }}>
              {featured.title}
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(10,46,31,0.6)' }}>
              {featured.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(10,46,31,0.4)' }}>
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {featured.author}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readTime}</span>
                <span>{featured.date}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors group-hover:text-gold"
                style={{ color: '#c9a227' }}>
                Read More <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* ── Post grid ────────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border transition-shadow hover:shadow-lg"
              style={{ borderColor: 'rgba(201,162,39,0.15)' }}>
              {/* Image */}
              <div className="relative flex-shrink-0" style={{ aspectRatio: '4/3' }}>
                <Image src={post.img} alt={post.title} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <div className="absolute top-3 left-3">
                  <span className="rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest"
                    style={{ background: '#c9a227', color: '#fff' }}>
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5">
                <h3 className="font-bold text-base leading-snug mb-2 group-hover:opacity-80 transition-opacity"
                  style={{ color: '#0a2e1f' }}>
                  {post.title}
                </h3>
                <p className="text-xs leading-relaxed flex-1 mb-4"
                  style={{ color: 'rgba(10,46,31,0.55)' }}>
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-3 border-t"
                  style={{ borderColor: 'rgba(201,162,39,0.15)' }}>
                  <div className="flex items-center gap-3 text-[10px]" style={{ color: 'rgba(10,46,31,0.4)' }}>
                    <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
                    style={{ color: '#c9a227' }}>
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
