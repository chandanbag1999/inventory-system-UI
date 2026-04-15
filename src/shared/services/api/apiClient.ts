// ============================================================
// API CLIENT - Axios Instance with Interceptors
// src/shared/services/api/apiClient.ts
// ============================================================

import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import type { ApiError } from '@/shared/types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';
const IS_MOCK  = import.meta.env.VITE_MOCK_API === 'true';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

export const tokenStorage = {
  getAccess:  () => localStorage.getItem('accessToken'),
  getRefresh: () => localStorage.getItem('refreshToken'),
  setAccess:  (t: string) => localStorage.setItem('accessToken', t),
  setRefresh: (t: string) => localStorage.setItem('refreshToken', t),
  clearAll:   () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Don't clear auth-store here, let the auth store handle it
  },
};

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => { if (error) p.reject(error); else p.resolve(token!); });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) throw new Error('No refresh token');

  const refreshUrl = API_URL + '/auth/refresh';
  const res = await axios.post(
    refreshUrl,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  );

  // Backend returns: { success: true, data: { accessToken, refreshToken, ... } }
  const backendResponse = res.data;
  const responseData = backendResponse.success ? backendResponse.data : backendResponse;
  
  const { accessToken, refreshToken: newRefresh } = responseData;
  
  if (!accessToken) {
    throw new Error('Failed to refresh token: No access token in response');
  }

  tokenStorage.setAccess(accessToken);
  if (newRefresh) tokenStorage.setRefresh(newRefresh);
  
  return accessToken;
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (IS_MOCK) return config;
    const token = tokenStorage.getAccess();
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry && !IS_MOCK) {
      // Skip refresh for the refresh endpoint itself to avoid infinite loop
      if (originalRequest.url?.includes('/auth/refresh')) {
        tokenStorage.clearAll();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = 'Bearer ' + newToken;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clearAll();
        // Redirect to login only if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const apiError: ApiError = {
      code:       error.code ?? 'UNKNOWN',
      message:    'Something went wrong',
      statusCode: error.response?.status ?? 0,
    };

    if (error.response?.data) {
      const data = error.response.data as Record<string, unknown>;
      apiError.message = (data.message as string) ?? apiError.message;
      apiError.details = data.errors as Record<string, string[]>;
    } else if (error.request) {
      apiError.code    = 'NETWORK_ERROR';
      apiError.message = 'Network error. Please check your connection.';
    }

    // Skip toast for certain status codes
    const skipToastCodes = [401, 422];
    if (error.response?.status && !skipToastCodes.includes(error.response.status)) {
      toast.error(apiError.message);
    }
    if (error.response?.status === 403) toast.error('Access denied. You do not have permission.');
    if (error.response?.status === 500) toast.error('Server error. Please try again later.');

    return Promise.reject(apiError);
  }
);

// Wrapper type for backend ApiResponse<T>
export interface BackendResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  statusCode: number;
}

export const http = {
  get:    <T>(url: string, params?: object): Promise<BackendResponse<T>> =>
    apiClient.get<BackendResponse<T>>(url, { params }).then((r) => r.data),

  post:   <T>(url: string, data?: unknown): Promise<BackendResponse<T>> =>
    apiClient.post<BackendResponse<T>>(url, data).then((r) => r.data),

  postNoBody: <T>(url: string): Promise<BackendResponse<T>> =>
    apiClient.post<BackendResponse<T>>(url).then((r) => r.data),

  put:    <T>(url: string, data?: unknown): Promise<BackendResponse<T>> =>
    apiClient.put<BackendResponse<T>>(url, data).then((r) => r.data),

  patch:  <T>(url: string, data?: unknown): Promise<BackendResponse<T>> =>
    apiClient.patch<BackendResponse<T>>(url, data).then((r) => r.data),

  delete: <T>(url: string): Promise<BackendResponse<T>> =>
    apiClient.delete<BackendResponse<T>>(url).then((r) => r.data),

  upload: <T>(url: string, formData: FormData): Promise<BackendResponse<T>> =>
    apiClient
      .post<BackendResponse<T>>(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
};

export default apiClient;
