import { put, list, del } from '@vercel/blob';
import { readFile, writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const USE_LOCAL = process.env.CMS_STORAGE === 'local';
const LOCAL_DIR = path.join(process.cwd(), '.cms-data');

// Ensure local directory exists
async function ensureLocalDir(subdir?: string) {
  const dir = subdir ? path.join(LOCAL_DIR, subdir) : LOCAL_DIR;
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  return dir;
}

export async function storageGet(key: string): Promise<string | null> {
  if (USE_LOCAL) {
    const filePath = path.join(LOCAL_DIR, key);
    if (existsSync(filePath)) {
      return readFile(filePath, 'utf-8');
    }
    return null;
  }

  // Vercel Blob
  try {
    const { blobs } = await list({ prefix: key });
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      if (response.ok) {
        return response.text();
      }
    }
  } catch (e) {
    console.error(`Storage get error for ${key}:`, e);
  }
  return null;
}

export async function storageGetJson<T>(key: string): Promise<T | null> {
  const content = await storageGet(key);
  if (content) {
    try {
      return JSON.parse(content) as T;
    } catch {
      return null;
    }
  }
  return null;
}

export async function storagePut(key: string, content: string | Buffer): Promise<string> {
  if (USE_LOCAL) {
    const filePath = path.join(LOCAL_DIR, key);
    const dir = path.dirname(filePath);
    await ensureLocalDir(path.relative(LOCAL_DIR, dir));
    await writeFile(filePath, content);
    return `/api/cms-file/${key}`; // Local URL path
  }

  // Vercel Blob
  const blob = await put(key, content, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return blob.url;
}

export async function storagePutJson(key: string, data: unknown): Promise<string> {
  return storagePut(key, JSON.stringify(data, null, 2));
}

export async function storagePutFile(
  key: string,
  file: File
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (USE_LOCAL) {
    const filePath = path.join(LOCAL_DIR, key);
    const dir = path.dirname(filePath);
    await ensureLocalDir(path.relative(LOCAL_DIR, dir));
    await writeFile(filePath, buffer);
    return `/_cms/${key}`;
  }

  // Vercel Blob - use random suffix for uploads to avoid collisions
  const blob = await put(key, buffer, {
    access: 'public',
  });
  return blob.url;
}

export async function storageDelete(key: string): Promise<void> {
  if (USE_LOCAL) {
    const filePath = path.join(LOCAL_DIR, key);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
    return;
  }

  // Vercel Blob
  try {
    const { blobs } = await list({ prefix: key });
    if (blobs.length > 0) {
      await del(blobs[0].url);
    }
  } catch (e) {
    console.error(`Storage delete error for ${key}:`, e);
  }
}

export async function storageList(prefix: string): Promise<string[]> {
  if (USE_LOCAL) {
    const dir = path.join(LOCAL_DIR, prefix);
    if (!existsSync(dir)) return [];
    const { readdir } = await import('fs/promises');
    const files = await readdir(dir, { recursive: true });
    return files.map((f) => path.join(prefix, f.toString()));
  }

  // Vercel Blob
  try {
    const { blobs } = await list({ prefix });
    return blobs.map((b) => b.pathname);
  } catch {
    return [];
  }
}

export function isLocalStorage(): boolean {
  return USE_LOCAL;
}
