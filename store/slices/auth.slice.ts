import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@/api/auth.api';
import { storage, AUTH_TOKEN_KEY, AUTH_REFRESH_KEY } from '@/utils/storage';
import type { AuthUser, Session } from '@/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: storage.get<string>(AUTH_TOKEN_KEY),
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login(credentials);
      return data.data.session;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error ?? 'Login failed';
      return rejectWithValue(msg);
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.register(payload);
      return data.data;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error ?? 'Registration failed';
      return rejectWithValue(msg);
    }
  }
);

export const fetchMeThunk = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authApi.me();
    return data.data;
  } catch {
    return rejectWithValue('Session expired');
  }
});

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try { await authApi.logout(); } catch { /* ignore */ }
  storage.remove(AUTH_TOKEN_KEY);
  storage.remove(AUTH_REFRESH_KEY);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Session>) {
      state.token = action.payload.access_token;
      storage.set(AUTH_TOKEN_KEY, action.payload.access_token);
      storage.set(AUTH_REFRESH_KEY, action.payload.refresh_token);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.access_token;
        storage.set(AUTH_TOKEN_KEY, payload.access_token);
        storage.set(AUTH_REFRESH_KEY, payload.refresh_token);
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(registerThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerThunk.fulfilled, (state) => { state.loading = false; })
      .addCase(registerThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(fetchMeThunk.fulfilled, (state, { payload }) => { state.user = payload; })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.user = null;
        state.token = null;
        storage.remove(AUTH_TOKEN_KEY);
        storage.remove(AUTH_REFRESH_KEY);
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { setSession, clearError } = authSlice.actions;
export default authSlice.reducer;
