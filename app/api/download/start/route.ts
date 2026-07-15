import { NextRequest, NextResponse } from 'next/server';
import { cobaltDownload } from '@/lib/cobalt';
import { createJob, setJob, getJob } from '@/lib/download-state';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, type, title, thumbnail } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }
    if (type !== 'video' && type !== 'audio') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Use cobalt to get download URL
    const downloadMode = type === 'audio' ? 'audio' : 'auto';
    const result = await cobaltDownload({
      url,
      downloadMode,
      videoQuality: '1080',
      audioFormat: 'best',
      filenameStyle: 'pretty',
    });

    if (result.status === 'error') {
      return NextResponse.json({ error: result.error?.code || 'Download failed' }, { status: 400 });
    }

    let downloadUrl = '';
    if (result.status === 'tunnel' || result.status === 'redirect') {
      downloadUrl = result.url || '';
    } else if (result.status === 'picker' && result.picker && result.picker.length > 0) {
      downloadUrl = result.picker[0].url;
    }

    if (!downloadUrl) {
      return NextResponse.json({ error: 'No download URL available' }, { status: 400 });
    }

    // Create job with the direct download URL
    const jobId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const job = createJob(jobId, downloadUrl, type, title || 'Unknown', thumbnail || '');

    // Mark as completed immediately since we have the direct URL
    job.status = 'completed';
    job.progress = 100;
    job.filename = result.filename || `download.${type === 'audio' ? 'mp3' : 'mp4'}`;
    job.filePath = downloadUrl; // Store the URL as the "file path"
    setJob(job);

    return NextResponse.json({ success: true, id: jobId });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to start download';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
