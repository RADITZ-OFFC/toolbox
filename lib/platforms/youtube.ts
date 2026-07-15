import axios from 'axios';

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  platform: 'youtube';
  formats: VideoFormat[];
}

export interface VideoFormat {
  quality: string;
  url: string;
  mimeType: string;
  type: 'video' | 'audio';
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function getYouTubeInfo(url: string): Promise<VideoInfo> {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await axios.get(oembedUrl);
    const data = response.data;

    return {
      title: data.title || 'YouTube Video',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: 'Unknown',
      platform: 'youtube',
      formats: [
        {
          quality: 'Video (MP4)',
          url: `https://www.youtube.com/watch?v=${videoId}`,
          mimeType: 'video/mp4',
          type: 'video'
        },
        {
          quality: 'Audio (MP3)',
          url: `https://www.youtube.com/watch?v=${videoId}`,
          mimeType: 'audio/mpeg',
          type: 'audio'
        }
      ]
    };
  } catch (error) {
    return {
      title: 'YouTube Video',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: 'Unknown',
      platform: 'youtube',
      formats: [
        {
          quality: 'Video (MP4)',
          url: `https://www.youtube.com/watch?v=${videoId}`,
          mimeType: 'video/mp4',
          type: 'video'
        },
        {
          quality: 'Audio (MP3)',
          url: `https://www.youtube.com/watch?v=${videoId}`,
          mimeType: 'audio/mpeg',
          type: 'audio'
        }
      ]
    };
  }
}

export function isYouTubeUrl(url: string): boolean {
  return /(?:^https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/)/.test(url);
}
