import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import type { User, UserRequest, UserSummary } from '@/types';

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: async () => {
      const { data } = await api.get<UserSummary[]>('/users');
      return data;
    },
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ''),
    enabled: Boolean(id),
    queryFn: async () => {
      const { data } = await api.get<User>(`/users/${id}`);
      return data;
    },
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserRequest) => {
      const { data } = await api.put<User>(`/users/${id}`, payload);
      return data;
    },
    onSuccess: (data) => {
      qc.setQueryData(userKeys.detail(id), data);
      qc.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
}
