import axios from 'axios';
import { API_BASE_URL } from '@/config/api.config';
import { storage, AUTH_TOKEN_KEY, AUTH_REFRESH_KEY } from '@/utils/storage';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// Attach JWT to every request
client.interceptors.request.use((config) => {
  const token = storage.get<string>(AUTH_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, try to refresh token once
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = storage.get<string>(AUTH_REFRESH_KEY);
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        storage.set(AUTH_TOKEN_KEY, data.data.session.access_token);
        storage.set(AUTH_REFRESH_KEY, data.data.session.refresh_token);
        original.headers.Authorization = `Bearer ${data.data.session.access_token}`;
        return client(original);
      } catch {
        storage.remove(AUTH_TOKEN_KEY);
        storage.remove(AUTH_REFRESH_KEY);
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client;
