'use client';

interface VideoFormat {
  quality: string;
  url: string;
  mimeType: string;
  type: 'video' | 'audio';
}

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
  formats: VideoFormat[];
}

interface VideoPreviewProps {
  videoInfo: VideoInfo;
  onDownload: (format: VideoFormat) => void;
}

export default function VideoPreview({ videoInfo, onDownload }: VideoPreviewProps) {
  return (
    <div className="w-full mt-6">
      <div className="card rounded-2xl overflow-hidden">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-[rgba(255,255,255,0.03)] overflow-hidden">
          {videoInfo.thumbnail ? (
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#6b7280]">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}

          {videoInfo.duration && videoInfo.duration !== 'Unknown' && (
            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[10px] font-medium bg-black/70 text-white rounded">
              {videoInfo.duration}
            </span>
          )}
        </div>

        {/* Info + Buttons */}
        <div className="p-3 sm:p-4">
          <h3 className="text-white text-sm font-medium line-clamp-2 mb-3 leading-relaxed">
            {videoInfo.title}
          </h3>

          <div className="flex flex-col sm:flex-row gap-2">
            {videoInfo.formats.map((format, index) => {
              const isAudio = format.type === 'audio';
              return (
                <button
                  key={index}
                  onClick={() => onDownload(format)}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-all ${
                    isAudio
                      ? 'bg-[rgba(255,255,255,0.05)] text-[#d1d5db] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)]'
                      : 'btn-primary'
                  }`}
                >
                  {isAudio ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                  {isAudio ? 'Audio' : 'Video'}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
