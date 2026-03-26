'use client';

import type { Link } from '@link-manager/shared-types';
import { useState } from 'react';
import { QrCode } from '../components/QrCode';
import { useLinks } from '../hooks/useLinks';

// Feltételezett shadcn importok
import {
  Link as LinkIcon,
  Loader2,
  PlusCircle,
  QrCode as QrCodeIcon,
  Trash2,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';

export default function Page() {
  const { links, loading, error, create, remove } = useLinks();
  const [form, setForm] = useState({ slug: '', targetUrl: '', title: '' });
  const [qrLink, setQrLink] = useState<Link | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await create({
        slug: form.slug,
        targetUrl: form.targetUrl,
        title: form.title || undefined,
      });
      setForm({ slug: '', targetUrl: '', title: '' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container max-w-4xl mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <LinkIcon className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Link Manager</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Létrehozás űrlap */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Új hivatkozás</CardTitle>
              <CardDescription>
                Rövid link és átirányítás beállítása.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    required
                    placeholder="Slug (pl. gh)"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, slug: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    required
                    type="url"
                    placeholder="Cél URL (https://...)"
                    value={form.targetUrl}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, targetUrl: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Cím (opcionális)"
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <PlusCircle className="w-4 h-4 mr-2" />
                  )}
                  {submitting ? 'Létrehozás...' : 'Létrehozás'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Link lista */}
        <div className="md:col-span-2 space-y-4">
          {error && (
            <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          {loading && links.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Betöltés...
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <Card
                  key={link.id}
                  className="group hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono font-bold text-primary">
                          /{link.slug}
                        </span>
                        {link.title && (
                          <span className="text-sm font-medium text-foreground truncate">
                            {link.title}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {link.targetUrl}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setQrLink(link)}
                        title="QR kód mutatása"
                      >
                        <QrCodeIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(link.id)}
                        title="Törlés"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {!loading && links.length === 0 && (
                <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-xl">
                  Nincsenek linkek. Hozz létre egyet bal oldalon.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* QR Modális (shadcn Dialog) */}
      <Dialog open={!!qrLink} onOpenChange={(open) => !open && setQrLink(null)}>
        <DialogContent className="sm:max-w-md flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="font-mono text-center text-xl">
              /{qrLink?.slug}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-white rounded-lg border">
            {qrLink && <QrCode value={qrLink.targetUrl} size={256} />}
          </div>
          <p className="text-sm text-muted-foreground text-center break-all">
            {qrLink?.targetUrl}
          </p>
        </DialogContent>
      </Dialog>
    </main>
  );
}
