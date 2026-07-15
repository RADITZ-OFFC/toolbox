export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'facebook' | 'other';

export function detectPlatform(url: string): Platform {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  if (url.includes('facebook.com')) return 'facebook';
  return 'other';
}

export function getPlatformIcon(platform: Platform): string {
  switch (platform) {
    case 'youtube': return 'YT';
    case 'tiktok': return 'TT';
    case 'instagram': return 'IG';
    case 'twitter': return 'X';
    case 'facebook': return 'FB';
    default: return '?';
  }
}

export function getPlatformColor(platform: Platform): string {
  switch (platform) {
    case 'youtube': return '#FF0000';
    case 'tiktok': return '#00F2EA';
    case 'instagram': return '#E4405F';
    case 'twitter': return '#1DA1F2';
    case 'facebook': return '#1877F2';
    default: return '#666';
  }
}
