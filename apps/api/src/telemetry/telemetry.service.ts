import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/drizzle.module';
import * as schema from '../db/schema';
import type { TelemetryEvent, TelemetryStats } from '@link-manager/shared-types';

type DB = NodePgDatabase<typeof schema>;

@Injectable()
export class TelemetryService {
  constructor(@Inject(DRIZZLE) private readonly db: DB) {}

  async record(event: TelemetryEvent) {
    await this.db.insert(schema.telemetry).values({
      slug:      event.slug,
      ip:        event.ip,
      country:   event.country,
      city:      event.city,
      ua:        event.ua,
      clickedAt: new Date(event.ts),
    });
  }

  async stats(slug: string): Promise<TelemetryStats> {
    const rows = await this.db
      .select()
      .from(schema.telemetry)
      .where(eq(schema.telemetry.slug, slug));

    const countries: Record<string, number> = {};
    const cities: Record<string, number> = {};
    let lastClickAt: string | undefined;

    for (const r of rows) {
      if (r.country) countries[r.country] = (countries[r.country] ?? 0) + 1;
      if (r.city)    cities[r.city]       = (cities[r.city]       ?? 0) + 1;
      const ts = r.clickedAt.toISOString();
      if (!lastClickAt || ts > lastClickAt) lastClickAt = ts;
    }

    return { slug, totalClicks: rows.length, countries, cities, lastClickAt };
  }
}
