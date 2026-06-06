import client from './client';
import type { ApiResponse } from '@/types';

export type UploadFolder = 'products' | 'services' | 'avatars' | 'reviews' | 'categories' | 'promotions';

export const uploadApi = {
  image: (file: File, folder: UploadFolder = 'products') => {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    return client.post<ApiResponse<{ url: string; publicId: string; width: number; height: number }>>(
      '/upload/image',
      form
    );
  },
};
