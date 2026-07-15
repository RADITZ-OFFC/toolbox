const COBALT_API = process.env.COBALT_API_URL || 'https://cobalt.dzakii.my.id';

export interface CobaltVideoInfo {
  url: string;
  title: string;
  thumbnail: string;
  duration: number;
  service: string;
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

  return {
    url: streamUrl,
    title: data.title || 'Unknown',
    thumbnail: data.thumbnail || '',
    duration: data.duration || 0,
    service: data.service || 'unknown',
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
