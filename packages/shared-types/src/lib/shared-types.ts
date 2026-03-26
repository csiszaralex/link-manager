// ─── Link ────────────────────────────────────────────────────────────────────

export interface Link {
  id: string;
  slug: string;
  targetUrl: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLinkDto {
  slug: string;
  targetUrl: string;
  title?: string;
}

export interface UpdateLinkDto {
  targetUrl?: string;
  title?: string;
}

// ─── Telemetry ───────────────────────────────────────────────────────────────

export interface TelemetryEvent {
  slug: string;
  ip?: string;
  country?: string;
  city?: string;
  ua?: string;
  ts: number;
}

export interface TelemetryStats {
  slug: string;
  totalClicks: number;
  countries: Record<string, number>;
  cities: Record<string, number>;
  lastClickAt?: string;
}

// ─── Generic response wrapper ─────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
