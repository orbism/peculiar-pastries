import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const LOCAL_DIR = path.join(process.cwd(), '.cms-data');

// Only active in local storage mode
const USE_LOCAL = process.env.CMS_STORAGE === 'local';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!USE_LOCAL) {
    return NextResponse.json({ error: 'Local storage not enabled' }, { status: 404 });
  }

  const { path: pathSegments } = await params;
  const filePath = path.join(LOCAL_DIR, ...pathSegments);

  // Security: ensure path stays within LOCAL_DIR
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(LOCAL_DIR)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
  }

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const content = await readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();

  const mimeTypes: Record<string, string> = {
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.csv': 'text/csv',
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  return new NextResponse(content, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}
