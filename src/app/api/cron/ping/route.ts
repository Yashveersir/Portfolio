import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const baseUrl = backendUrl.replace(/\/$/, '');

  try {
    const res = await fetch(`${baseUrl}/api/portfolio`);
    if (res.ok) {
      return NextResponse.json({ success: true, message: 'Pinged Render successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Render returned non-OK status' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to ping Render' }, { status: 500 });
  }
}
