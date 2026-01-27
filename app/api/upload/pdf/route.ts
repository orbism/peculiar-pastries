import { NextResponse } from 'next/server';
import { storagePutFile } from '@/lib/cms/storage';
import { verifySession } from '@/lib/auth';

export async function POST(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files allowed' }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
  }

  const url = await storagePutFile(`uploads/pdfs/${Date.now()}-${file.name}`, file);
  return NextResponse.json({ url });
}
