import { NextResponse } from 'next/server';
import { storageGetJson, storagePutJson, storagePut } from '@/lib/cms/storage';
import { verifySession } from '@/lib/auth';
import type { StoreLocation } from '@/lib/cms/types';

const STORES_KEY = 'content/stores.json';

async function generateThumb(store: StoreLocation): Promise<string> {
  const apiKey = process.env.GEOAPIFY_API;
  const addressText = `${store.address}, ${store.city}, ${store.state} ${store.zip}`;

  console.log(`[map-thumb] Geocoding: "${addressText}"`);
  const geoRes = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressText)}&apiKey=${apiKey}`
  );
  if (!geoRes.ok) throw new Error(`Geocode request failed: ${geoRes.status}`);

  const geoData = await geoRes.json();
  const feature = geoData.features?.[0];
  if (!feature) throw new Error(`No geocode result for: ${addressText}`);

  const { lon, lat } = feature.properties;
  console.log(`[map-thumb] Geocoded "${store.name}" → ${lat}, ${lon}`);

  console.log(`[map-thumb] Fetching static map for "${store.name}" (positron-blue)...`);
  const imgRes = await fetch(`https://maps.geoapify.com/v1/staticmap?apiKey=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      style: 'positron-blue',
      width: 400,
      height: 240,
      center: { lon, lat },
      zoom: 15,
      markers: [{ lat, lon, type: 'awesome', color: '#7C2F1F', size: 'medium' }],
    }),
  });
  if (!imgRes.ok) {
    const body = await imgRes.text();
    throw new Error(`Static map fetch failed: ${imgRes.status} — ${body}`);
  }

  const buffer = Buffer.from(await imgRes.arrayBuffer());
  console.log(`[map-thumb] Got ${buffer.byteLength} bytes — storing map-thumbs/${store.id}.png`);

  const url = await storagePut(`map-thumbs/${store.id}.png`, buffer);
  console.log(`[map-thumb] Stored → ${url}`);
  return url;
}

export async function POST(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.GEOAPIFY_API) {
    return NextResponse.json({ error: 'GEOAPIFY_API env var not configured' }, { status: 500 });
  }

  const body = await request.json();
  const stores = (await storageGetJson<StoreLocation[]>(STORES_KEY)) ?? [];

  // Single store
  if (body.storeId) {
    const store = stores.find((s) => s.id === body.storeId);
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

    try {
      const url = await generateThumb(store);
      store.mapThumbUrl = url;
      await storagePutJson(STORES_KEY, stores);
      return NextResponse.json({ url, storeId: store.id });
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 });
    }
  }

  // Batch
  if (body.all) {
    const force = body.force === true;
    const targets = force ? stores : stores.filter((s) => !s.mapThumbUrl);
    const skipped = stores.length - targets.length;
    let generated = 0;
    const errors: string[] = [];

    console.log(`[map-thumb] Batch: ${targets.length} to generate, ${skipped} already have thumbs`);

    for (const store of targets) {
      try {
        const url = await generateThumb(store);
        store.mapThumbUrl = url;
        generated++;
        console.log(`[map-thumb] ✓ ${generated}/${targets.length} — ${store.name}`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'unknown';
        console.error(`[map-thumb] ✗ ${store.name}: ${msg}`);
        errors.push(`${store.name}: ${msg}`);
      }
    }

    console.log(`[map-thumb] Batch done — ${generated} generated, ${errors.length} errors. Saving stores.json...`);
    await storagePutJson(STORES_KEY, stores);
    console.log(`[map-thumb] stores.json saved.`);
    return NextResponse.json({ generated, skipped, errors });
  }

  return NextResponse.json({ error: 'Provide storeId or all:true' }, { status: 400 });
}
