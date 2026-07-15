const COBALT_API = process.env.COBALT_API_URL || 'https://cobalt.dzakii.my.id';
const COBALT_API_KEY = process.env.COBALT_API_KEY || '';

export interface VideoFormat {
  quality: string;
  url: string;
  mimeType: string;
  type: 'video' | 'audio';
}

export interface CobaltVideoInfo {
  originalUrl: string;
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

function parseTitleFromFilename(filename: string): string {
  // Remove extension and quality info like "(1080p, h264)"
  let title = filename.replace(/\.[^.]+$/, '');
  title = title.replace(/\s*\([^)]*\)\s*$/, '');
  return title.trim() || 'Unknown';
}

function extractYouTubeId(url: string): string | null {
  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/embed/ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  return null;
}

function getThumbnailUrl(url: string): string {
  // YouTube
  const ytId = extractYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;

  // TikTok, Instagram, etc - no easy thumbnail extraction
  return '';
}

export async function getVideoInfo(url: string): Promise<CobaltVideoInfo> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (COBALT_API_KEY) {
    headers['Authorization'] = `Api-Key ${COBALT_API_KEY}`;
  }

  const response = await fetch(`${COBALT_API}/`, {
    method: 'POST',
    headers,
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

  const streamUrl = data.url;
  const title = data.filename ? parseTitleFromFilename(data.filename) : 'Unknown';

  // Detect platform from URL
  let platform: 'youtube' | 'tiktok' | 'instagram' = 'youtube';
  if (url.includes('tiktok.com')) platform = 'tiktok';
  else if (url.includes('instagram.com')) platform = 'instagram';

  // Cobalt returns direct streaming URL
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
    originalUrl: url,
    title,
    thumbnail: getThumbnailUrl(url),
    duration: '',
    platform,
    formats,
  };
}

export async function getStreamingUrl(
  url: string,
  type: 'video' | 'audio' = 'video'
): Promise<CobaltStreamUrl> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (COBALT_API_KEY) {
    headers['Authorization'] = `Api-Key ${COBALT_API_KEY}`;
  }

  const response = await fetch(`${COBALT_API}/`, {
    method: 'POST',
    headers,
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
