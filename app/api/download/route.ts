import { NextRequest, NextResponse } from 'next/server';
import { cobaltDownload } from '@/lib/cobalt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Detect platform
    let platform = 'unknown';
    if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'YouTube';
    else if (url.includes('tiktok.com')) platform = 'TikTok';
    else if (url.includes('instagram.com')) platform = 'Instagram';
    else {
      return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    // Get video info via cobalt
    const result = await cobaltDownload({
      url,
      downloadMode: 'auto',
      videoQuality: '1080',
      filenameStyle: 'pretty',
    });

    if (result.status === 'error') {
      const errorCode = result.error?.code || 'Unknown error';
      let errorMessage = 'Failed to fetch video info';

      if (errorCode === 'error.fetch.empty') {
        errorMessage = 'No video found - this may be a private account or image post';
      } else if (errorCode === 'error.fetch.failed') {
        errorMessage = 'Failed to fetch video - please check the URL';
      } else if (errorCode === 'error.fetch.rate-limited') {
        errorMessage = 'Rate limited - please try again later';
      } else if (errorCode === 'error.fetch.unsupported') {
        errorMessage = 'Unsupported URL - please use YouTube, TikTok, or Instagram';
      }

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Build response based on status
    let videoUrl = '';
    let thumbnail = '';

    if (result.status === 'tunnel' || result.status === 'redirect') {
      videoUrl = result.url || '';
    } else if (result.status === 'picker' && result.picker && result.picker.length > 0) {
      videoUrl = result.picker[0].url;
      thumbnail = result.picker[0].thumb || '';
    }

    if (!videoUrl) {
      return NextResponse.json({ error: 'No download URL available' }, { status: 400 });
    }

    // Return video info in the format the frontend expects
    return NextResponse.json({
      data: {
        title: result.filename?.replace(/\.[^.]+$/, '') || 'Video',
        thumbnail: thumbnail,
        duration: 'Unknown',
        platform: platform.toLowerCase(),
        formats: [
          {
            quality: 'Video (MP4)',
            url: videoUrl,
            mimeType: 'video/mp4',
            type: 'video',
          },
          {
            quality: 'Audio (MP3)',
            url: videoUrl,
            mimeType: 'audio/mpeg',
            type: 'audio',
          },
        ],
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch video info';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
