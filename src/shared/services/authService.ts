import { http, type BackendResponse } from './api/apiClient';
import { ENDPOINTS } from './api/endpoints';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    roles: string[];
    role: string;
    permissions: string[];
    lastLoginAt?: string;
  };
}

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  role: string;
  permissions: string[];
  lastLoginAt?: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>(ENDPOINTS.auth.login, {
      ...data,
      ipAddress: typeof window !== 'undefined' ? window.location.hostname : undefined,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
    });
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const registerData = {
      name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      role: data.role,
    };
    const response = await http.post<AuthResponse>(ENDPOINTS.auth.register, registerData);
    return response.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await http.post(ENDPOINTS.auth.logout, { refreshToken });
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>(ENDPOINTS.auth.refresh, {
      refreshToken,
    });
    return response.data;
  },

  async getCurrentUser(): Promise<CurrentUser> {
    const response = await http.get<CurrentUser>(ENDPOINTS.auth.me);
    return response.data;
  },
};