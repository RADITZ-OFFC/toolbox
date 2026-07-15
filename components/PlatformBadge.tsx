'use client';

interface PlatformBadgeProps {
  platform: 'youtube' | 'tiktok' | 'instagram';
}

export default function PlatformBadge({ platform }: PlatformBadgeProps) {
  const badges: Record<'youtube' | 'tiktok' | 'instagram', { label: string; color: string; icon: string }> = {
    youtube: {
      label: 'YouTube',
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: 'YT'
    },
    tiktok: {
      label: 'TikTok',
      color: 'bg-cyan-400/20 text-cyan-400 border-cyan-400/30',
      icon: 'TT'
    },
    instagram: {
      label: 'Instagram',
      color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      icon: 'IG'
    },
  };

  const badge = badges[platform] || { label: platform, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: '?' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${badge.color}`}>
      <span className="w-4 h-4 rounded bg-current/20 flex items-center justify-center text-[10px]">
        {badge.icon}
      </span>
      {badge.label}
    </span>
  );
}
