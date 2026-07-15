import { isYouTubeUrl, getYouTubeInfo, VideoInfo as YouTubeInfo } from './platforms/youtube';
import { isTikTokUrl, getTikTokInfo, VideoInfo as TikTokInfo } from './platforms/tiktok';
import { isInstagramUrl, getInstagramInfo, VideoInfo as InstagramInfo } from './platforms/instagram';

export type Platform = 'youtube' | 'tiktok' | 'instagram';
export type VideoInfo = YouTubeInfo | TikTokInfo | InstagramInfo;

export function detectPlatform(url: string): Platform | null {
  if (isYouTubeUrl(url)) return 'youtube';
  if (isTikTokUrl(url)) return 'tiktok';
  if (isInstagramUrl(url)) return 'instagram';
  return null;
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  const platform = detectPlatform(url);
  
  if (!platform) {
    throw new Error('Unsupported platform. Please use YouTube, TikTok, or Instagram URLs.');
  }

  switch (platform) {
    case 'youtube':
      return getYouTubeInfo(url);
    case 'tiktok':
      return getTikTokInfo(url);
    case 'instagram':
      return getInstagramInfo(url);
    default:
      throw new Error('Unsupported platform');
  }
}

export function getPlatformIcon(platform: Platform): string {
  switch (platform) {
    case 'youtube':
      return 'YT';
    case 'tiktok':
      return 'TT';
    case 'instagram':
      return 'IG';
    default:
      return '?';
  }
}

export function getPlatformColor(platform: Platform): string {
  switch (platform) {
    case 'youtube':
      return '#FF0000';
    case 'tiktok':
      return '#00F2EA';
    case 'instagram':
      return '#E4405F';
    default:
      return '#666';
  }
}
