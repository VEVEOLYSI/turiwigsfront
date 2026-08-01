import client from './client';
import type { ApiResponse } from '@/types';

export type HomepageSection = 'hero' | 'philosophy_nails' | 'philosophy_wigs' | 'cta';

export interface HomepageImage {
  id: string;
  section: HomepageSection;
  url: string;
  public_id: string;
  width: number | null;
  height: number | null;
  label: string | null;
  caption: string | null;
  href: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type HomepageImagesGrouped = Partial<Record<HomepageSection, HomepageImage[]>>;

export interface CreateHomepageImagePayload {
  file: File;
  section: HomepageSection;
  label?: string;
  caption?: string;
  href?: string;
  sort_order?: number;
}

export interface UpdateHomepageImagePayload {
  label?: string;
  caption?: string;
  href?: string;
  sort_order?: number;
  is_active?: boolean;
}

export const homepageImagesApi = {
  // Public — fetches active images grouped by section
  list: (section?: HomepageSection) =>
    client.get<ApiResponse<HomepageImagesGrouped>>(
      '/homepage-images',
      section ? { params: { section } } : undefined
    ),

  // Admin — fetches all images including inactive ones
  listAdmin: (section?: HomepageSection) =>
    client.get<ApiResponse<HomepageImagesGrouped>>(
      '/homepage-images/admin',
      section ? { params: { section } } : undefined
    ),

  // Admin — upload a new image (multipart/form-data)
  create: (payload: CreateHomepageImagePayload) => {
    const form = new FormData();
    form.append('file', payload.file);
    form.append('section', payload.section);
    if (payload.label)      form.append('label',      payload.label);
    if (payload.caption)    form.append('caption',    payload.caption);
    if (payload.href)       form.append('href',       payload.href);
    if (payload.sort_order !== undefined)
      form.append('sort_order', String(payload.sort_order));

    return client.post<ApiResponse<HomepageImage>>(
      '/homepage-images',
      form,
      { headers: { 'Content-Type': undefined } }
    );
  },

  // Admin — update metadata (label, caption, href, sort_order, is_active)
  update: (id: string, payload: UpdateHomepageImagePayload) =>
    client.patch<ApiResponse<HomepageImage>>(`/homepage-images/${id}`, payload),

  // Admin — delete image from DB + Cloudinary
  remove: (id: string) =>
    client.delete<ApiResponse<null>>(`/homepage-images/${id}`),
};
