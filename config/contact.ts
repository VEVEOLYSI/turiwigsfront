// Single source of truth for the shop's WhatsApp line — the number printed
// on the price list. Every "via WhatsApp" button builds its link from here.
export const WHATSAPP_NUMBER = '254748786737';
export const WHATSAPP_DISPLAY = '0748 786 737';

// wa.me opens the WhatsApp app on phones and WhatsApp Web on desktop, with
// `message` already typed in the chat box. The customer can edit it or send.
export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
