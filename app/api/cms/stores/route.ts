import { NextResponse } from 'next/server';
import { storageGetJson, storagePutJson, storagePutFile } from '@/lib/cms/storage';
import { parse } from 'csv-parse/sync';
import { verifySession } from '@/lib/auth';
import type { StoreLocation } from '@/lib/cms/types';

const STORES_KEY = 'content/stores.json';

async function getStoresFromStorage(): Promise<StoreLocation[]> {
  return (await storageGetJson<StoreLocation[]>(STORES_KEY)) ?? [];
}

async function saveStores(stores: StoreLocation[]) {
  await storagePutJson(STORES_KEY, stores);
}

export async function GET() {
  const stores = await getStoresFromStorage();
  return NextResponse.json(stores);
}

export async function POST(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;
  const replaceAll = formData.get('replaceAll') === 'true';

  if (!file || !file.name.endsWith('.csv')) {
    return NextResponse.json({ error: 'CSV file required' }, { status: 400 });
  }

  const text = await file.text();

  try {
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const existing = replaceAll ? [] : await getStoresFromStorage();
    const byLicense = new Map(
      existing.filter((s) => s.licenseNumber).map((s) => [s.licenseNumber!, s])
    );

    let added = 0;
    let updated = 0;

    const incoming: StoreLocation[] = (records as Record<string, string>[]).map((row, index) => {
      const licenseNumber = row['License #'] || undefined;
      const googleMapsLink = row['Google Maps Link'] || undefined;
      const name = row['Dispensary Name'] || `Store ${index + 1}`;
      const address = row['Street Address'] || '';
      const city = row['City'] || '';
      const state = row['State'] || 'NY';
      const zip = row['ZIP'] || '';
      const phone = row['phone'] || undefined;
      const website = row['Website'] || undefined;

      const match = licenseNumber ? byLicense.get(licenseNumber) : undefined;

      if (match) {
        updated++;
        return { ...match, name, address, city, state, zip, phone, website, licenseNumber, googleMapsLink };
      } else {
        added++;
        return { id: crypto.randomUUID(), name, address, city, state, zip, phone, website, licenseNumber, googleMapsLink };
      }
    });

    const incomingLicenses = new Set(incoming.filter((s) => s.licenseNumber).map((s) => s.licenseNumber!));
    const incomingIds = new Set(incoming.map((s) => s.id));

    const untouched = existing.filter((s) => {
      if (s.licenseNumber && incomingLicenses.has(s.licenseNumber)) return false;
      if (incomingIds.has(s.id)) return false;
      return true;
    });

    const merged = [...untouched, ...incoming];
    await saveStores(merged);

    // Archive original CSV
    await storagePutFile(
      `uploads/csv/stores-${Date.now()}.csv`,
      new File([text], file.name, { type: 'text/csv' })
    );

    return NextResponse.json({ success: true, added, updated, count: merged.length });
  } catch (e) {
    console.error('CSV parse error:', e);
    return NextResponse.json({ error: 'Failed to parse CSV' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const singleId = searchParams.get('id');

  let idsToDelete: string[];

  if (singleId) {
    idsToDelete = [singleId];
  } else {
    try {
      const body = await request.json();
      idsToDelete = body.ids ?? [];
    } catch {
      return NextResponse.json({ error: 'ID or ids required' }, { status: 400 });
    }
  }

  if (idsToDelete.length === 0) {
    return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
  }

  const idSet = new Set(idsToDelete);
  const stores = await getStoresFromStorage();
  const filtered = stores.filter((s) => !idSet.has(s.id));
  await saveStores(filtered);

  return NextResponse.json({ success: true, removed: stores.length - filtered.length });
}
