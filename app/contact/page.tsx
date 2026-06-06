'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import client from '@/api/client';
import type { Metadata } from 'next';

// Note: metadata export doesn't work in 'use client' components — move to a layout if needed
// export const metadata: Metadata = { title: 'Contact Us | Tiuri Nails & Wigs Parlour' };

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: 'Location',
    lines: ['Nairobi, Kenya'],
  },
  {
    icon: Phone,
    label: 'Phone / WhatsApp',
    lines: ['+254 700 000 000'],
  },
  {
    icon: Mail,
    label: 'Email',
    lines: ['hello@tiuri.co.ke'],
  },
  {
    icon: Clock,
    label: 'Hours',
    lines: ['Mon – Sat: 8 am – 7 pm', 'Sunday: 10 am – 5 pm'],
  },
];

const SUBJECTS = [
  'General Enquiry',
  'Wig Order',
  'Booking / Appointment',
  'Wig Repair / Service',
  'Nail Appointment',
  'Wholesale / Partnership',
  'Other',
];

const fieldStyle = {
  background: '#fff',
  border: '1px solid #e0d0b0',
  boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.07)',
  color: '#1a1a1a',
  outline: 'none',
  width: '100%',
  borderRadius: 12,
  padding: '12px 16px',
  fontSize: 14,
  transition: 'border-color 0.15s',
};

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: SUBJECTS[0], message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSending(true);
    try {
      await client.post('/contact', form);
      setSent(true);
      toast.success('Message sent! We\'ll be in touch soon.');
    } catch {
      toast.error('Failed to send message. Please try again or email us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ background: '#faf6ed', minHeight: '100vh' }}>

      {/* Header */}
      <div className="py-16 sm:py-20 text-center"
        style={{ background: 'linear-gradient(135deg, #0a2e1f 0%, #1e5038 100%)' }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] mb-3"
          style={{ color: '#c9a227' }}>
          Reach Out
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-white">Get in Touch</h1>
        <p className="mt-4 text-sm max-w-md mx-auto leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.55)' }}>
          Have a question, need a booking, or just want to say hello? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">

          {/* ── Contact info ────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: '#0a2e1f' }}>
                Tiuri Nails &amp; Wigs Parlour
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                Nairobi&apos;s premier destination for premium human hair wigs and professional nail services.
              </p>
            </div>

            {CONTACT_INFO.map(({ icon: Icon, label, lines }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-xl p-3 mt-0.5"
                  style={{ background: 'rgba(201,162,39,0.12)' }}>
                  <Icon className="h-4 w-4" style={{ color: '#c9a227' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: '#9a8060' }}>{label}</p>
                  {lines.map((l) => (
                    <p key={l} className="text-sm" style={{ color: '#0a2e1f' }}>{l}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Social */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: '#9a8060' }}>Follow Us</p>
              <div className="flex gap-3">
                {[
                  { label: 'TikTok', href: 'https://www.tiktok.com/@tiurinails' },
                  { label: 'Instagram', href: 'https://www.instagram.com/tiurinails' },
                  { label: 'Facebook', href: 'https://www.facebook.com/tiurinails' },
                ].map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors hover:border-gold/50"
                    style={{ borderColor: '#e0d0b0', color: '#0a2e1f' }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Contact form ─────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center rounded-2xl border p-16 gap-5"
                style={{ borderColor: '#e0d0b0', background: '#fff' }}>
                <div className="rounded-full p-5" style={{ background: 'rgba(34,197,94,0.1)' }}>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: '#0a2e1f' }}>Message Sent!</h3>
                <p className="text-sm leading-relaxed max-w-sm" style={{ color: '#6b7280' }}>
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' }); }}
                  className="mt-2 text-sm font-semibold underline underline-offset-2"
                  style={{ color: '#c9a227' }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}
                className="rounded-2xl border p-6 sm:p-8 space-y-5"
                style={{ borderColor: '#e0d0b0', background: '#fff' }}>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: '#143d2a' }}>
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input value={form.name} onChange={(e) => set('name', e.target.value)}
                      placeholder="Jane Wanjiku" required style={fieldStyle} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: '#143d2a' }}>
                      Email <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                      placeholder="jane@example.com" required style={fieldStyle} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: '#143d2a' }}>
                      Phone <span className="font-normal text-neutral-400">(optional)</span>
                    </label>
                    <input value={form.phone} onChange={(e) => set('phone', e.target.value)}
                      placeholder="+254 7XX XXX XXX" style={fieldStyle} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: '#143d2a' }}>Subject</label>
                    <select value={form.subject} onChange={(e) => set('subject', e.target.value)}
                      style={{ ...fieldStyle, appearance: 'none', cursor: 'pointer' }}>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: '#143d2a' }}>
                    Message <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea value={form.message} onChange={(e) => set('message', e.target.value)}
                    rows={6} placeholder="Tell us how we can help you…" required
                    style={{ ...fieldStyle, resize: 'vertical' }} />
                </div>

                <button type="submit" disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #1e5038 0%, #0a2e1f 100%)', color: '#f0d878', border: '1px solid rgba(201,162,39,0.4)' }}>
                  {sending
                    ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-gold/30 border-t-gold" /> Sending…</>
                    : <><Send className="h-4 w-4" /> Send Message</>}
                </button>

                <p className="text-center text-xs" style={{ color: '#9a8060' }}>
                  We typically reply within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
