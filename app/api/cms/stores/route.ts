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

    const stores: StoreLocation[] = (records as Record<string, string>[]).map(
      (row, index) => ({
        id: crypto.randomUUID(),
        name: row.name || `Store ${index + 1}`,
        address: row.address || '',
        city: row.city || '',
        state: row.state || 'NY',
        zip: row.zip || '',
        phone: row.phone || undefined,
        website: row.website || undefined,
      })
    );

    await saveStores(stores);

    // Archive original CSV
    await storagePutFile(
      `uploads/csv/stores-${Date.now()}.csv`,
      new File([text], file.name, { type: 'text/csv' })
    );

    return NextResponse.json({ success: true, count: stores.length });
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
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const stores = await getStoresFromStorage();
  const filtered = stores.filter((s) => s.id !== id);
  await saveStores(filtered);

  return NextResponse.json({ success: true });
}
