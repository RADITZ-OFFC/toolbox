import axios from 'axios';

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  platform: 'tiktok';
  formats: VideoFormat[];
}

export interface VideoFormat {
  quality: string;
  url: string;
  mimeType: string;
  type: 'video' | 'audio';
}

export async function getTikTokInfo(url: string): Promise<VideoInfo> {
  try {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/json',
      }
    });

    const data = response.data;

    if (data.code !== 0 || !data.data) {
      throw new Error('Failed to fetch TikTok video');
    }

    const videoData = data.data;

    return {
      title: videoData.title || 'TikTok Video',
      thumbnail: videoData.cover || '',
      duration: videoData.duration ? `${videoData.duration}s` : 'Unknown',
      platform: 'tiktok',
      formats: [
        ...(videoData.hdplay ? [{
          quality: 'HD Video (MP4)',
          url: videoData.hdplay,
          mimeType: 'video/mp4',
          type: 'video' as const
        }] : []),
        {
          quality: 'Video (MP4)',
          url: videoData.play || videoData.hdplay || '',
          mimeType: 'video/mp4',
          type: 'video'
        },
        {
          quality: 'Audio (MP3)',
          url: videoData.play || videoData.hdplay || '',
          mimeType: 'audio/mpeg',
          type: 'audio'
        }
      ]
    };
  } catch (error) {
    throw new Error('Failed to fetch TikTok video info');
  }
}

export function isTikTokUrl(url: string): boolean {
  return /(?:tiktok\.com|vm\.tiktok\.com)/.test(url);
}
