import type {
  ApiResponse,
  CreateLinkDto,
  Link,
  TelemetryStats,
  UpdateLinkDto,
} from '@link-manager/shared-types';

const API = process.env.NEXT_PUBLIC_API_URL!;

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  const data = await res.json();
  if (!res.ok)
    return { data: null as T, error: data?.message ?? 'Request failed' };
  return { data };
}

export const linksApi = {
  list: () => request<Link[]>('/links'),

  create: (dto: CreateLinkDto) =>
    request<Link>('/links', { method: 'POST', body: JSON.stringify(dto) }),

  update: (id: string, dto: UpdateLinkDto) =>
    request<Link>(`/links/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  remove: (id: string) => request<Link>(`/links/${id}`, { method: 'DELETE' }),

  stats: (slug: string) => request<TelemetryStats>(`/telemetry/${slug}`),
};
