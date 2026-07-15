---
feature: cobalt-integration
status: delivered
specs: []
plans:
  - docs/compose/plans/2026-07-15-cobalt-integration.md
branch: main
commits: none
---

# Cobalt API Integration — Final Report

## What Was Built

Integrated Cobalt API to replace the yt-dlp based download system. The app now uses a self-hosted Cobalt instance at `cobalt.dzakii.my.id` for all video/audio downloads. This eliminates the need for yt-dlp, ffmpeg, and platform-specific helpers, while adding support for 20+ platforms including YouTube, TikTok, Instagram, Twitter, Facebook, Reddit, and more.

## Architecture

**Before:** Platform-specific helpers (`lib/platforms/*.ts`) → yt-dlp spawn → local file → serve to browser

**After:** Single Cobalt API helper (`lib/cobalt.ts`) → direct streaming URL → browser downloads from Cobalt CDN

### Components

| File | Purpose |
|------|---------|
| `lib/cobalt.ts` | Cobalt API helper with `getVideoInfo()` and `getStreamingUrl()` |
| `app/api/download/route.ts` | Returns video info via Cobalt |
| `app/api/download/start/route.ts` | Returns direct download URL |
| `app/tools/video-downloader/page.tsx` | Simplified frontend (no polling) |

### Data Flow

1. User enters URL → POST `/api/download`
2. Frontend receives video info + available formats
3. User selects format → POST `/api/download/start`
4. API returns direct Cobalt streaming URL
5. Browser opens URL → file downloads from Cobalt CDN

## Usage

No configuration needed — `.env.local` already has `COBALT_API_URL=https://cobalt.dzakii.my.id`.

Supported platforms: YouTube, TikTok, Instagram, Twitter/X, Facebook, Reddit, Pinterest, Twitch, Vimeo, Dailymotion, SoundCloud, Tumblr, Snapchat, and more.

## Verification

- Build passes: `npm run build` ✓
- All API routes compiled: `/api/download`, `/api/download/start` ✓
- TypeScript: no errors ✓

## Journey Log

- [pivot] Replaced full yt-dlp stack with single Cobalt API call
- [simplification] Removed progress polling — direct URL download is simpler
- [expansion] Added Twitter/Facebook support via Cobalt (previously only YouTube/TikTok/Instagram)

## Source Materials

| File | Role |
|------|------|
| `docs/compose/plans/2026-07-15-cobalt-integration.md` | Implementation plan |
