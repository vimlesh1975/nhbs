import { NextResponse } from 'next/server';
import { fetchScriptByBulletinAndDate } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bulletin = searchParams.get('bulletin') || '';
    const date = searchParams.get('date') || '';
    const slug = searchParams.get('slug') || 'headlines';

    const result = await fetchScriptByBulletinAndDate(bulletin, date, slug);

    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
