import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import { userKeys } from './users';
import type { Address, AddressRequest } from '@/types';

export const addressKeys = {
  all: ['addresses'] as const,
  list: (userId: string) => [...addressKeys.all, 'list', userId] as const,
};

export function useAddresses(userId: string | undefined) {
  return useQuery({
    queryKey: addressKeys.list(userId ?? ''),
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data } = await api.get<Address[]>(`/users/${userId}/addresses`);
      return data;
    },
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>, userId: string) {
  qc.invalidateQueries({ queryKey: addressKeys.list(userId) });
  qc.invalidateQueries({ queryKey: userKeys.detail(userId) });
  qc.invalidateQueries({ queryKey: userKeys.list() });
}

export function useAddAddress(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddressRequest) => {
      const { data } = await api.post<Address>(`/users/${userId}/addresses`, payload);
      return data;
    },
    onSuccess: () => invalidate(qc, userId),
  });
}

export function useUpdateAddress(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { addressId: string; payload: AddressRequest }) => {
      const { data } = await api.put<Address>(
        `/users/${userId}/addresses/${vars.addressId}`,
        vars.payload,
      );
      return data;
    },
    onSuccess: () => invalidate(qc, userId),
  });
}

export function useDeleteAddress(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (addressId: string) => {
      await api.delete(`/users/${userId}/addresses/${addressId}`);
    },
    onSuccess: () => invalidate(qc, userId),
  });
}
