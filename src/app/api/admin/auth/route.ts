import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    const baseUrl = backendUrl ? backendUrl.replace(/\/$/, '') : '';

    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      // Create the response
      const response = NextResponse.json({ success: true });
      
      // Set the HttpOnly cookie
      response.cookies.set({
        name: 'adminToken',
        value: data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    } else {
      return NextResponse.json({ error: data.error || 'Login failed' }, { status: 401 });
    }
  } catch (err) {
    console.error('Auth Proxy Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
