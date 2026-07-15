const COBALT_API = process.env.COBALT_API_URL || 'https://cobalt.dzakii.my.id';

export interface VideoFormat {
  quality: string;
  url: string;
  mimeType: string;
  type: 'video' | 'audio';
}

export interface CobaltVideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  platform: string;
  formats: VideoFormat[];
}

export interface CobaltStreamUrl {
  url: string;
  filename: string;
  type: string;
}

export async function getVideoInfo(url: string): Promise<CobaltVideoInfo> {
  const response = await fetch(`${COBALT_API}/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      videoQuality: '1080',
      filenameStyle: 'basic',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cobalt API error: ${error}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'Failed to fetch video info');
  }

  const streamUrl = Array.isArray(data.url) ? data.url[0] : data.url;

  // Format duration as MM:SS or HH:MM:SS
  const durationSec = data.duration || 0;
  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;
  const duration = durationSec > 0
    ? `${minutes}:${seconds.toString().padStart(2, '0')}`
    : 'Unknown';

  // Detect platform from URL
  let platform: 'youtube' | 'tiktok' | 'instagram' = 'youtube';
  if (url.includes('tiktok.com')) platform = 'tiktok';
  else if (url.includes('instagram.com')) platform = 'instagram';

  // Cobalt returns direct streaming URL, create video + audio formats
  const formats: VideoFormat[] = [
    {
      quality: '1080p',
      url: streamUrl,
      mimeType: 'video/mp4',
      type: 'video',
    },
    {
      quality: '128kbps',
      url: streamUrl,
      mimeType: 'audio/mpeg',
      type: 'audio',
    },
  ];

  return {
    title: data.title || 'Unknown',
    thumbnail: data.thumbnail || '',
    duration,
    platform,
    formats,
  };
}

export async function getStreamingUrl(
  url: string,
  type: 'video' | 'audio' = 'video'
): Promise<CobaltStreamUrl> {
  const response = await fetch(`${COBALT_API}/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      downloadMode: type === 'audio' ? 'audio' : 'auto',
      audioFormat: type === 'audio' ? 'mp3' : undefined,
      videoQuality: '1080',
      filenameStyle: 'basic',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cobalt API error: ${error}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'Failed to get streaming URL');
  }

  const streamUrl = Array.isArray(data.url) ? data.url[0] : data.url;
  const ext = type === 'audio' ? 'mp3' : 'mp4';
  const filename = `${data.title || 'download'}.${ext}`;

  return {
    url: streamUrl,
    filename,
    type: data.contentType || `video/${ext}`,
  };
}
