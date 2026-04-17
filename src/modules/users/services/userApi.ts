// ============================================================
// USER API — React Query hooks
// Backend: GET    /api/v1/users
//          GET    /api/v1/users/{id}
//          POST   /api/v1/users   JSON
//          PUT    /api/v1/users/{id} JSON
//          DELETE /api/v1/users/{id}
//          PATCH  /api/v1/users/{id}/activate
//          PATCH  /api/v1/users/{id}/deactivate
//          POST   /api/v1/users/{id}/assign-role   { roleId }
//          DELETE /api/v1/users/{id}/revoke-role/{roleId}
//          GET    /api/v1/roles
// src/modules/users/services/userApi.ts
// ============================================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/services/api/apiClient';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { QUERY_KEYS } from '@/shared/services/api/queryKeys';

export interface GetAllUsersParams {
  pageNumber?: number;
  pageSize?:   number;
  search?:     string;
  status?:     string;
  roleId?:     string;
}

export interface CreateUserPayload {
  fullName:  string;
  email:     string;
  password:  string;
  phone?:    string;
}

export interface UpdateUserPayload {
  fullName?: string;
  phone?:    string;
}

export const userApiClient = {
  getAll: async (params?: GetAllUsersParams) => {
    const { data } = await apiClient.get(API_ENDPOINTS.USERS.BASE, { params });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
    return data.data;
  },

  create: async (payload: CreateUserPayload) => {
    const { data } = await apiClient.post(API_ENDPOINTS.USERS.BASE, payload);
    return data.data;
  },

  update: async (id: string, payload: UpdateUserPayload) => {
    const { data } = await apiClient.put(API_ENDPOINTS.USERS.BY_ID(id), payload);
    return data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));
  },

  activate: async (id: string) => {
    await apiClient.patch(API_ENDPOINTS.USERS.ACTIVATE(id));
  },

  deactivate: async (id: string) => {
    await apiClient.patch(API_ENDPOINTS.USERS.DEACTIVATE(id));
  },

  assignRole: async (id: string, roleId: string) => {
    await apiClient.post(API_ENDPOINTS.USERS.ASSIGN_ROLE(id), { roleId });
  },

  revokeRole: async (id: string, roleId: string) => {
    await apiClient.delete(API_ENDPOINTS.USERS.REVOKE_ROLE(id, roleId));
  },

  uploadProfileImage: async (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await apiClient.post(API_ENDPOINTS.USERS.PROFILE_IMAGE(id), form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.imageUrl as string;
  },

  getRoles: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.ROLES.BASE);
    return data.data;
  },

  getPermissions: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.ROLES.PERMISSIONS);
    return data.data;
  },
};

export function useUsers(params?: GetAllUsersParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, params],
    queryFn:  () => userApiClient.getAll(params),
    staleTime: 3 * 60 * 1000,
  });
}

export function useUserById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.USER(id),
    queryFn:  () => userApiClient.getById(id),
    enabled:  !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateUserPayload) => userApiClient.create(p),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS }); },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      userApiClient.update(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS }); },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApiClient.delete(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS }); },
  });
}

export function useActivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApiClient.activate(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS }); },
  });
}

export function useDeactivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApiClient.deactivate(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS }); },
  });
}

export function useAssignRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, roleId }: { id: string; roleId: string }) =>
      userApiClient.assignRole(id, roleId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS }); },
  });
}

export function useRevokeRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, roleId }: { id: string; roleId: string }) =>
      userApiClient.revokeRole(id, roleId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.USERS }); },
  });
}

export function useRoles() {
  return useQuery({
    queryKey: QUERY_KEYS.ROLES,
    queryFn:  () => userApiClient.getRoles(),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: QUERY_KEYS.PERMISSIONS,
    queryFn:  () => userApiClient.getPermissions(),
    staleTime: 10 * 60 * 1000,
  });
}
