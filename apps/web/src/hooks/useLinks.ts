'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CreateLinkDto, Link, UpdateLinkDto } from '@link-manager/shared-types';
import { linksApi } from '../lib/api';

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await linksApi.list();
    if (error) setError(error);
    else setLinks(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (dto: CreateLinkDto) => {
    const { data, error } = await linksApi.create(dto);
    if (error) throw new Error(error);
    setLinks((prev) => [...prev, data]);
    return data;
  };

  const update = async (id: string, dto: UpdateLinkDto) => {
    const { data, error } = await linksApi.update(id, dto);
    if (error) throw new Error(error);
    setLinks((prev) => prev.map((l) => (l.id === id ? data : l)));
    return data;
  };

  const remove = async (id: string) => {
    const { error } = await linksApi.remove(id);
    if (error) throw new Error(error);
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  return { links, loading, error, refresh, create, update, remove };
}
