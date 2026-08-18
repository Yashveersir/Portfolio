import { NextResponse, NextRequest } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const adminToken = req.cookies.get('adminToken')?.value;
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    const baseUrl = backendUrl ? backendUrl.replace(/\/$/, '') : '';

    const res = await fetch(`${baseUrl}/api/portfolio`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: data.error || 'Update failed' }, { status: res.status });
    }
  } catch (err) {
    console.error('Proxy Update Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
