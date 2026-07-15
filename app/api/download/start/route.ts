import { NextRequest, NextResponse } from 'next/server';
import { getStreamingUrl } from '@/lib/cobalt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, type, title } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }
    if (type !== 'video' && type !== 'audio') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const stream = await getStreamingUrl(url, type);

    return NextResponse.json({
      success: true,
      downloadUrl: stream.url,
      filename: title ? `${title}.${type === 'audio' ? 'mp3' : 'mp4'}` : stream.filename,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to start download';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
