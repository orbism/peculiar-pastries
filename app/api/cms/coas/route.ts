import { NextResponse } from 'next/server';
import { storageGetJson, storagePutJson } from '@/lib/cms/storage';
import { verifySession } from '@/lib/auth';
import type { COAEntry } from '@/lib/cms/types';

const COAS_KEY = 'content/coas.json';

async function getCOAsFromStorage(): Promise<COAEntry[]> {
  return (await storageGetJson<COAEntry[]>(COAS_KEY)) ?? [];
}

async function saveCOAs(coas: COAEntry[]) {
  await storagePutJson(COAS_KEY, coas);
}

export async function GET() {
  const coas = await getCOAsFromStorage();
  return NextResponse.json(coas);
}

export async function POST(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const newCOA: COAEntry = await request.json();
  const coas = await getCOAsFromStorage();
  coas.push(newCOA);
  await saveCOAs(coas);

  return NextResponse.json({ success: true, coa: newCOA });
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

  const coas = await getCOAsFromStorage();
  const filtered = coas.filter((c) => c.id !== id);
  await saveCOAs(filtered);

  return NextResponse.json({ success: true });
}
