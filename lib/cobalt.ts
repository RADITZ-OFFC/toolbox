const COBALT_API = process.env.COBALT_API_URL || 'https://cobalt.dzakii.my.id';
const COBALT_KEY = process.env.COBALT_API_KEY || '';

interface CobaltRequest {
  url: string;
  downloadMode?: 'auto' | 'audio' | 'mute';
  videoQuality?: string;
  audioBitrate?: string;
  audioFormat?: string;
  filenameStyle?: string;
  disableMetadata?: boolean;
}

interface CobaltResponse {
  status: 'tunnel' | 'redirect' | 'picker' | 'error' | 'local-processing';
  url?: string;
  filename?: string;
  audio?: string;
  audioFilename?: string;
  picker?: Array<{ type: string; url: string; thumb?: string }>;
  error?: { code: string; context?: { service?: string; limit?: number } };
}

export async function cobaltDownload(options: CobaltRequest): Promise<CobaltResponse> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (COBALT_KEY) {
    headers['Authorization'] = `Api-Key ${COBALT_KEY}`;
  }

  const response = await fetch(COBALT_API, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      url: options.url,
      downloadMode: options.downloadMode || 'auto',
      videoQuality: options.videoQuality || '1080',
      audioBitrate: options.audioBitrate || '320',
      audioFormat: options.audioFormat || 'best',
      filenameStyle: options.filenameStyle || 'pretty',
      disableMetadata: options.disableMetadata || false,
    }),
  });

  const data = await response.json();
  return data as CobaltResponse;
}

export async function getVideoInfo(url: string): Promise<{
  title: string;
  thumbnail: string;
  duration: string;
  platform: string;
  formats: Array<{ quality: string; url: string; mimeType: string; type: 'video' | 'audio' }>;
}> {
  // Get video info via cobalt
  const result = await cobaltDownload({ url, downloadMode: 'auto' });

  if (result.status === 'error') {
    throw new Error(result.error?.code || 'Failed to fetch video info');
  }

  // Extract platform from URL
  let platform = 'unknown';
  if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'youtube';
  else if (url.includes('tiktok.com')) platform = 'tiktok';
  else if (url.includes('instagram.com')) platform = 'instagram';

  const formats = [];

  if (result.status === 'tunnel' || result.status === 'redirect') {
    formats.push({
      quality: 'Video (MP4)',
      url: result.url || '',
      mimeType: 'video/mp4',
      type: 'video' as const,
    });
    formats.push({
      quality: 'Audio (MP3)',
      url: result.url || '',
      mimeType: 'audio/mpeg',
      type: 'audio' as const,
    });
  } else if (result.status === 'picker') {
    result.picker?.forEach((item, i) => {
      formats.push({
        quality: `Media ${i + 1}`,
        url: item.url,
        mimeType: item.type === 'video' ? 'video/mp4' : 'image/jpeg',
        type: item.type === 'video' ? 'video' as const : 'video' as const,
      });
    });
  }

  return {
    title: result.filename?.replace(/\.[^.]+$/, '') || 'Video',
    thumbnail: '',
    duration: 'Unknown',
    platform,
    formats,
  };
}
