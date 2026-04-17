// ============================================================
// API CLIENT — Axios instance wired to real backend
// src/shared/services/api/apiClient.ts
// ============================================================
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL as string;

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
  withCredentials: false,
});

// ── Request interceptor: attach Bearer token ──────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Helper: clear all auth state and redirect to login ────────
function clearAuthAndRedirect() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('auth-store');
  window.location.href = '/login';
}

// ── Response interceptor: handle 401 + token refresh ─────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken  = localStorage.getItem('accessToken');

      // No refresh token — clear auth and redirect
      if (!refreshToken) {
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // FIX: Backend RefreshTokenCommand requires BOTH accessToken + refreshToken
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          { accessToken, refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAccessToken: string  = data.data.accessToken;
        const newRefreshToken: string = data.data.refreshToken;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Keep zustand persist store in sync so rehydration uses new tokens
        try {
          const raw = localStorage.getItem('auth-store');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.state) {
              parsed.state.accessToken  = newAccessToken;
              parsed.state.refreshToken = newRefreshToken;
              localStorage.setItem('auth-store', JSON.stringify(parsed));
            }
          }
        } catch {
          // non-critical — zustand will re-fetch on next mount
        }

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // FIX: clear auth-store too so rehydration doesn't restore stale state
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalise error shape for React Query
    const message: string =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.message ||
      'An unexpected error occurred';

    const apiError = {
      message,
      statusCode: error.response?.status ?? 0,
      errors: error.response?.data?.errors ?? null,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
