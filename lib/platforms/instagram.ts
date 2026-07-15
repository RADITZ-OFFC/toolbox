import axios from 'axios';

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  platform: 'instagram';
  formats: VideoFormat[];
}

export interface VideoFormat {
  quality: string;
  url: string;
  mimeType: string;
  type: 'video' | 'audio';
}

export async function getInstagramInfo(url: string): Promise<VideoInfo> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    const html = response.data;
    const videoMatch = html.match(/"video_url":"([^"]+)"/);
    const thumbnailMatch = html.match(/"image_url":"([^"]+)"/);
    const titleMatch = html.match(/"title":"([^"]+)"/);

    const videoUrl = videoMatch?.[1] || '';
    const thumbnail = thumbnailMatch?.[1] || '';
    const title = titleMatch?.[1] || 'Instagram Video';

    if (!videoUrl) {
      throw new Error('No video found - this may be a private account or image post');
    }

    return {
      title,
      thumbnail,
      duration: 'Unknown',
      platform: 'instagram',
      formats: [
        {
          quality: 'Video (MP4)',
          url: videoUrl,
          mimeType: 'video/mp4',
          type: 'video'
        },
        {
          quality: 'Audio (MP3)',
          url: videoUrl,
          mimeType: 'audio/mpeg',
          type: 'audio'
        }
      ]
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Post not found - it may be private or deleted');
      }
      if (error.response?.status === 401) {
        throw new Error('Authentication required - this is a private account');
      }
    }
    throw new Error('Failed to fetch Instagram video');
  }
}

export function isInstagramUrl(url: string): boolean {
  return /(?:instagram\.com|instagr\.am)/.test(url);
}
