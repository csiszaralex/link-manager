import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class KvSyncService {
  private readonly logger = new Logger(KvSyncService.name);

  private get baseUrl() {
    const account = process.env.CF_ACCOUNT_ID;
    const ns = process.env.CF_KV_NAMESPACE_ID;
    return `https://api.cloudflare.com/client/v4/accounts/${account}/storage/kv/namespaces/${ns}/values`;
  }

  private get headers() {
    return { Authorization: `Bearer ${process.env.CF_API_TOKEN}` };
  }

  async put(slug: string, targetUrl: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      headers: this.headers,
      body: targetUrl,
    });
    if (!res.ok) {
      this.logger.error(`KV put failed for slug="${slug}": ${res.status}`);
    }
  }

  async delete(slug: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      headers: this.headers,
    });
    if (!res.ok) {
      this.logger.error(`KV delete failed for slug="${slug}": ${res.status}`);
    }
  }
}
