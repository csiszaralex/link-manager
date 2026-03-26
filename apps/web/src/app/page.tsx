'use client';

import { useState } from 'react';
import { useLinks } from '../hooks/useLinks';
import { QrCode } from '../components/QrCode';
import type { Link } from '@link-manager/shared-types';

export default function Page() {
  const { links, loading, error, create, update, remove } = useLinks();
  const [form, setForm]     = useState({ slug: '', targetUrl: '', title: '' });
  const [qrLink, setQrLink] = useState<Link | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await create({ slug: form.slug, targetUrl: form.targetUrl, title: form.title || undefined });
      setForm({ slug: '', targetUrl: '', title: '' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-3xl font-bold">Link Manager</h1>

        {/* Create form */}
        <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-lg">New link</h2>
          <input
            required
            placeholder="slug (e.g. gh)"
            value={form.slug}
            onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <input
            required
            type="url"
            placeholder="Target URL"
            value={form.targetUrl}
            onChange={e => setForm(p => ({ ...p, targetUrl: e.target.value }))}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <input
            placeholder="Title (optional)"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Creating…' : 'Create'}
          </button>
        </form>

        {/* Links list */}
        {loading && <p className="text-gray-500">Loading…</p>}
        {error   && <p className="text-red-500">{error}</p>}

        <ul className="space-y-3">
          {links.map(link => (
            <li key={link.id} className="rounded-xl border bg-white p-4 shadow-sm flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-mono font-semibold text-indigo-700">/{link.slug}</p>
                <p className="truncate text-sm text-gray-500">{link.targetUrl}</p>
                {link.title && <p className="text-xs text-gray-400">{link.title}</p>}
              </div>
              <button
                onClick={() => setQrLink(qrLink?.id === link.id ? null : link)}
                className="text-xs text-gray-400 hover:text-gray-700"
              >QR</button>
              <button
                onClick={() => remove(link.id)}
                className="text-xs text-red-400 hover:text-red-700"
              >Delete</button>
            </li>
          ))}
        </ul>

        {/* QR modal */}
        {qrLink && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40" onClick={() => setQrLink(null)}>
            <div className="rounded-xl bg-white p-6 shadow-xl space-y-2" onClick={e => e.stopPropagation()}>
              <p className="font-semibold">/{qrLink.slug}</p>
              <QrCode value={qrLink.targetUrl} size={240} />
              <button onClick={() => setQrLink(null)} className="text-sm text-gray-400 hover:text-gray-700">Close</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
