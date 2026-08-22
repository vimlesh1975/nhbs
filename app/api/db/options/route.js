import { NextResponse } from 'next/server';
import { fetchBulletinOptions } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await fetchBulletinOptions();
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
