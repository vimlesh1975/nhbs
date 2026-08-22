import { NextResponse } from 'next/server';
import { testDbConnection } from '../../../../lib/db';

export async function GET() {
  try {
    const result = await testDbConnection();
    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
