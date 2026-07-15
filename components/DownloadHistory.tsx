'use client';

export interface DownloadItem {
  id: string;
  title: string;
  thumbnail: string;
  type: 'video' | 'audio';
  status: 'preparing' | 'downloading' | 'merging' | 'completed' | 'error';
  progress: number;
  totalSize: string;
  speed: string;
  eta: string;
  filename: string;
  error: string | null;
}

interface DownloadHistoryProps {
  downloads: DownloadItem[];
  onRemove: (id: string) => void;
}

export default function DownloadHistory({ downloads, onRemove }: DownloadHistoryProps) {
  if (downloads.length === 0) return null;

  const getStatusText = (item: DownloadItem): string => {
    switch (item.status) {
      case 'preparing': return 'Preparing...';
      case 'downloading': {
        if (item.speed && item.eta) {
          return `${item.progress.toFixed(1)}% · ${item.speed} · ETA ${item.eta}`;
        }
        return `${item.progress.toFixed(1)}%`;
      }
      case 'merging': return 'Merging...';
      case 'completed': return 'Selesai';
      case 'error': return item.error || 'Failed';
      default: return '';
    }
  };

  const getStatusColor = (status: DownloadItem['status']) => {
    switch (status) {
      case 'preparing': return 'text-[#6b7280]';
      case 'downloading': return 'text-[#818cf8]';
      case 'merging': return 'text-[#818cf8]';
      case 'completed': return 'text-[#4ade80]';
      case 'error': return 'text-[#f87171]';
    }
  };

  return (
    <div className="w-full mt-6">
      <h2 className="text-[#6b7280] text-xs font-medium uppercase tracking-wider mb-3">
        Downloads
      </h2>

      <div className="space-y-2">
        {downloads.map((item) => {
          const isActive = item.status === 'downloading' || item.status === 'merging';
          return (
            <div
              key={item.id}
              className={`card rounded-xl p-3 ${
                isActive ? 'border-[#6366f1]/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Thumbnail */}
                <div className="w-12 h-9 rounded overflow-hidden bg-[rgba(255,255,255,0.05)] flex-shrink-0">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6b7280]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-medium truncate">{item.title}</h3>
                  <span className={`text-xs ${getStatusColor(item.status)}`}>
                    {getStatusText(item)}
                  </span>
                </div>

                {/* Actions */}
                {(item.status === 'completed' || item.status === 'error') && (
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-1 text-[#6b7280] hover:text-[#f87171] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Progress bar */}
              {(item.status === 'downloading' || item.status === 'preparing' || item.status === 'merging') && (
                <div className="mt-2.5 h-1 bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full transition-all duration-300 progress-shimmer ${
                      item.status === 'merging' ? 'animate-pulse' : ''
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
