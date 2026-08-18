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

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Backend returned non-JSON:', text.substring(0, 200));
      return NextResponse.json({ error: `Backend Error: ${res.status} - ${res.statusText}. Payload might be too large.` }, { status: res.status });
    }

    if (res.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: data.error || 'Update failed' }, { status: res.status });
    }
  } catch (err: any) {
    console.error('Proxy Update Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
