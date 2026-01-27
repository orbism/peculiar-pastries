import { NextResponse } from 'next/server';
import { storageGetJson, storagePutJson } from '@/lib/cms/storage';
import { verifySession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Key required' }, { status: 400 });
  }

  try {
    const data = await storageGetJson(`content/${key}.json`);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { key, data } = await request.json();

  if (!key || data === undefined) {
    return NextResponse.json({ error: 'Key and data required' }, { status: 400 });
  }

  try {
    const url = await storagePutJson(`content/${key}.json`, data);
    return NextResponse.json({ success: true, url });
  } catch (e) {
    console.error('Failed to save content:', e);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
