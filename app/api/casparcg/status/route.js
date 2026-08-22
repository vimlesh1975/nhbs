import { NextResponse } from 'next/server';
import { checkCasparCgStatus } from '../../../../lib/casparcg';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const host = searchParams.get('host') || undefined;
    const port = searchParams.get('port') ? parseInt(searchParams.get('port'), 10) : undefined;

    const result = await checkCasparCgStatus(host, port);
    return NextResponse.json({
      connected: result.connected && result.success,
      response: result.response,
      code: result.code,
      host: host || process.env.CASPARCG_HOST || '127.0.0.1',
      port: port || process.env.CASPARCG_PORT || 5250,
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
