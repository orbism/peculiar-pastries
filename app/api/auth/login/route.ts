import { NextResponse } from 'next/server';
import { createSession, getCookieName } from '@/lib/auth';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== process.env.CMS_ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = await createSession();
  const response = NextResponse.json({ success: true });

  response.cookies.set(getCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}
