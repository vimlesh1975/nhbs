import { NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table') || 'headlines';
    const search = searchParams.get('search') || '';
    const date = searchParams.get('date') || '';
    const bulletin = searchParams.get('bulletin') || '';
    const newsTitle = searchParams.get('newsTitle') || '';

    const result = await executeQuery(table, search, date, bulletin, newsTitle);

    return NextResponse.json({
      success: true,
      table,
      count: result.data.length,
      data: result.data,
      isMock: result.isMock,
      source: result.source,
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
