# Cobalt API Integration Implementation Plan

> [!NOTE]
> This document may not reflect the current implementation.
> See the final report for up-to-date state:
> [Final Report](../reports/cobalt-integration.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace yt-dlp based download system with Cobalt API integration for simpler, more reliable multi-platform video downloading.

**Architecture:** Single Cobalt API helper module replaces all platform-specific helpers and yt-dlp spawn logic. User sends URL to our API, we forward to Cobalt, return streaming URLs for direct browser download.

**Tech Stack:** Next.js API routes, TypeScript, Cobalt API (self-hosted at cobalt.dzakii.my.id)

## Global Constraints

- Cobalt API URL: `https://cobalt.dzakii.my.id` (no auth required)
- Direct download: user downloads from Cobalt streaming URL, no server proxy
- Platform support: YouTube, TikTok, Instagram, Twitter, Facebook, and all Cobalt-supported services
- Keep existing UI/API contracts where possible

---

### Task 1: Create Cobalt API Helper Module

**Covers:** Core API integration

**Files:**
- Create: `lib/cobalt.ts`

**Interfaces:**
- Produces: `CobaltResponse`, `getVideoInfo(url)`, `getStreamingUrl(url, type)`

- [ ] **Step 1: Create `lib/cobalt.ts`**

```typescript
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

  // Cobalt returns streaming URLs directly
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
```

- [ ] **Step 2: Verify module exports**

Run: `npx tsc --noEmit lib/cobalt.ts`
Expected: No errors

---

### Task 2: Update Download Info API Route

**Covers:** API route update

**Files:**
- Modify: `app/api/download/route.ts`

**Interfaces:**
- Consumes: `getVideoInfo()` from `lib/cobalt.ts`
- Produces: Same API contract (POST returns video info)

- [ ] **Step 1: Replace route implementation**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getVideoInfo } from '@/lib/cobalt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    const data = await getVideoInfo(url);
    return NextResponse.json({ data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch video info';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
```

- [ ] **Step 2: Test API route**

Run: `curl -X POST http://localhost:3000/api/download -H "Content-Type: application/json" -d '{"url":"https://youtube.com/watch?v=dQw4w9WgXcQ"}'`
Expected: JSON response with video info

---

### Task 3: Update Download Start API Route

**Covers:** Download initiation

**Files:**
- Modify: `app/api/download/start/route.ts`

**Interfaces:**
- Consumes: `getStreamingUrl()` from `lib/cobalt.ts`
- Produces: Direct streaming URL for browser download

- [ ] **Step 1: Replace route implementation**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getStreamingUrl } from '@/lib/cobalt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, type, title } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }
    if (type !== 'video' && type !== 'audio') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const stream = await getStreamingUrl(url, type);

    return NextResponse.json({
      success: true,
      downloadUrl: stream.url,
      filename: title ? `${title}.${type === 'audio' ? 'mp3' : 'mp4'}` : stream.filename,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to start download';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
```

- [ ] **Step 2: Test API route**

Run: `curl -X POST http://localhost:3000/api/download/start -H "Content-Type: application/json" -d '{"url":"https://youtube.com/watch?v=dQw4w9WgXcQ","type":"video","title":"test"}'`
Expected: JSON response with `downloadUrl`

---

### Task 4: Delete Unused Platform Helpers

**Covers:** Cleanup

**Files:**
- Delete: `lib/platforms/youtube.ts`
- Delete: `lib/platforms/tiktok.ts`
- Delete: `lib/platforms/instagram.ts`
- Modify: `lib/utils.ts`

- [ ] **Step 1: Delete platform files**

```bash
rm lib/platforms/youtube.ts lib/platforms/tiktok.ts lib/platforms/instagram.ts
```

- [ ] **Step 2: Simplify `lib/utils.ts`**

```typescript
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
```

- [ ] **Step 3: Remove empty platforms directory**

```bash
rmdir lib/platforms
```

---

### Task 5: Update Frontend Download Handler

**Covers:** UI integration

**Files:**
- Modify: Frontend component that calls `/api/download/start`

- [ ] **Step 1: Update download handler to use direct URL**

Find the component that handles download and update it to:
1. Call `/api/download/start` to get `downloadUrl`
2. Open `downloadUrl` in new tab or trigger direct download

Example pattern:
```typescript
const handleDownload = async (url: string, type: 'video' | 'audio') => {
  const res = await fetch('/api/download/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, type, title }),
  });
  const data = await res.json();
  
  if (data.downloadUrl) {
    window.open(data.downloadUrl, '_blank');
  }
};
```

- [ ] **Step 2: Remove yt-dlp progress tracking UI**

Since Cobalt handles download directly, remove or simplify progress indicators.

---

### Task 6: Add Environment Variable Configuration

**Covers:** Configuration

**Files:**
- Modify: `.env.local` (or `.env.example`)

- [ ] **Step 1: Add Cobalt API URL config**

```bash
# Cobalt API (self-hosted)
COBALT_API_URL=https://cobalt.dzakii.my.id
```

- [ ] **Step 2: Update `.env.example`**

```bash
# Cobalt API
COBALT_API_URL=https://cobalt.dzakii.my.id
```

---

### Task 7: Test End-to-End Flow

**Covers:** Verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test with YouTube URL**

1. Open http://localhost:3000
2. Paste YouTube URL
3. Click fetch/analyze
4. Verify video info displays
5. Click download
6. Verify file downloads from Cobalt CDN

- [ ] **Step 3: Test with TikTok URL**

Repeat steps with TikTok video URL

- [ ] **Step 4: Test audio-only download**

Select audio option, verify MP3 download works

---

## Summary

| Task | Description | Est. Time |
|------|-------------|-----------|
| 1 | Create `lib/cobalt.ts` | 5 min |
| 2 | Update `/api/download` route | 3 min |
| 3 | Update `/api/download/start` route | 3 min |
| 4 | Delete unused platform files | 2 min |
| 5 | Update frontend handler | 5 min |
| 6 | Add env config | 2 min |
| 7 | End-to-end test | 10 min |

**Total estimated time:** ~30 minutes
