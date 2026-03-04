import { NextResponse } from 'next/server';
import { storageGetJson, storagePutJson } from '@/lib/cms/storage';
import { verifySession } from '@/lib/auth';
import type { StoreLocation } from '@/lib/cms/types';

const STORES_KEY = 'content/stores.json';

async function getStores(): Promise<StoreLocation[]> {
  return (await storageGetJson<StoreLocation[]>(STORES_KEY)) ?? [];
}

function findDuplicateGroups(stores: StoreLocation[]) {
  // Group by licenseNumber first, then by name+address
  const byLicense = new Map<string, StoreLocation[]>();
  const byNameAddr = new Map<string, StoreLocation[]>();
  const noKey: StoreLocation[] = [];

  for (const store of stores) {
    if (store.licenseNumber) {
      const key = store.licenseNumber.trim().toUpperCase();
      if (!byLicense.has(key)) byLicense.set(key, []);
      byLicense.get(key)!.push(store);
    } else {
      const key = `${store.name.trim().toLowerCase()}|${store.address.trim().toLowerCase()}`;
      if (!byNameAddr.has(key)) byNameAddr.set(key, []);
      byNameAddr.get(key)!.push(store);
    }
  }

  const groups: { key: string; stores: StoreLocation[] }[] = [];

  for (const [key, group] of byLicense) {
    if (group.length > 1) groups.push({ key: `license:${key}`, stores: group });
  }
  for (const [key, group] of byNameAddr) {
    if (group.length > 1) groups.push({ key: `name+addr:${key}`, stores: group });
  }

  return groups;
}

export async function GET() {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stores = await getStores();
  const groups = findDuplicateGroups(stores);
  const totalDupes = groups.reduce((sum, g) => sum + g.stores.length - 1, 0);

  return NextResponse.json({ duplicateGroups: groups, totalDuplicates: totalDupes });
}

export async function POST() {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stores = await getStores();
  const groups = findDuplicateGroups(stores);

  // Collect IDs to remove (all but first in each group)
  const toRemove = new Set<string>();
  for (const group of groups) {
    for (const store of group.stores.slice(1)) {
      toRemove.add(store.id);
    }
  }

  const deduped = stores.filter((s) => !toRemove.has(s.id));
  await storagePutJson(STORES_KEY, deduped);

  return NextResponse.json({ removed: toRemove.size, kept: deduped.length });
}
