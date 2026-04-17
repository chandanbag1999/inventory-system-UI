// ============================================================
// AUTH SERVICE — thin wrapper around apiClient
// (Most callers should use authStore.login/logout directly)
// src/shared/services/authService.ts
// ============================================================
import apiClient from './api/apiClient';
import { API_ENDPOINTS } from './api/endpoints';
import type { LoginCredentials, RegisterData, AuthResponse } from '@/modules/auth/types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return data.data;
  },

  register: async (payload: RegisterData) => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
    return data.data;
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
    return data.data;
  },

  logout: async (refreshToken: string) => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  },

  getMe: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return data.data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return data;
  },

  resetPassword: async (payload: { token: string; email: string; newPassword: string }) => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
    return data;
  },

  verifyEmail: async (token: string) => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    return data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      oldPassword,
      newPassword,
    });
    return data;
  },
};
