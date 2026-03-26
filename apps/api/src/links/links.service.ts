import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/drizzle.module';
import * as schema from '../db/schema';
import { KvSyncService } from '../kv/kv-sync.service';
import type { CreateLinkDto, UpdateLinkDto } from '@link-manager/shared-types';

type DB = NodePgDatabase<typeof schema>;

@Injectable()
export class LinksService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DB,
    private readonly kv: KvSyncService,
  ) {}

  async findAll() {
    return this.db.select().from(schema.links);
  }

  async findOne(id: string) {
    const [link] = await this.db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, id));
    if (!link) throw new NotFoundException(`Link ${id} not found`);
    return link;
  }

  async create(dto: CreateLinkDto) {
    const [link] = await this.db
      .insert(schema.links)
      .values({ ...dto })
      .returning();
    await this.kv.put(link.slug, link.targetUrl);
    return link;
  }

  async update(id: string, dto: UpdateLinkDto) {
    const [link] = await this.db
      .update(schema.links)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(schema.links.id, id))
      .returning();
    if (!link) throw new NotFoundException(`Link ${id} not found`);
    if (dto.targetUrl) await this.kv.put(link.slug, link.targetUrl);
    return link;
  }

  async remove(id: string) {
    const [link] = await this.db
      .delete(schema.links)
      .where(eq(schema.links.id, id))
      .returning();
    if (!link) throw new NotFoundException(`Link ${id} not found`);
    await this.kv.delete(link.slug);
    return link;
  }
}
