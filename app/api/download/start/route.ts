import { NextRequest, NextResponse } from 'next/server';
import { spawn, execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import { createJob, setJob, getJob, parseYtDlpProgress } from '@/lib/download-state';

function findYtDlpPath(): string {
  const cmd = process.platform === 'win32' ? 'where yt-dlp' : 'which yt-dlp';
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim().split('\n')[0];
  } catch {
    throw new Error('yt-dlp not found. Install with: pip install yt-dlp');
  }
}

function findFfmpegPath(): string | null {
  const cmd = process.platform === 'win32' ? 'where ffmpeg' : 'which ffmpeg';
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim().split('\n')[0];
  } catch {
    return null;
  }
}

function startDownload(jobId: string, url: string, type: 'video' | 'audio'): void {
  const job = getJob(jobId);
  if (!job) return;

  const ytDlp = findYtDlpPath();
  const outTemplate = join(tmpdir(), `dld_${jobId}.%(ext)s`);

  const args: string[] = [
    '--no-playlist',
    '--no-warnings',
    '--no-check-certificates',
    '--no-part',
    '--newline',
  ];

  if (type === 'audio') {
    const ffmpeg = findFfmpegPath();
    if (!ffmpeg) {
      job.status = 'error';
      job.error = 'ffmpeg not found. Install ffmpeg and restart terminal.';
      setJob(job);
      return;
    }
    args.push(
      '-x',
      '--audio-format', 'mp3',
      '--audio-quality', '0',
      '--ffmpeg-location', dirname(ffmpeg),
      '-o', outTemplate,
      url
    );
  } else {
    args.push(
      '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
      '--merge-output-format', 'mp4',
      '-o', outTemplate,
      url
    );
  }

  const proc = spawn(ytDlp, args, { windowsHide: true });

  let stderrBuffer = '';

  proc.stdout?.on('data', (data: Buffer) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      const update = parseYtDlpProgress(line);
      if (update) {
        const current = getJob(jobId);
        if (current) {
          Object.assign(current, update);
          setJob(current);
        }
      }
    }
  });

  proc.stderr?.on('data', (data: Buffer) => {
    stderrBuffer += data.toString();
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.includes('[Merger]') || line.includes('[ExtractAudio]') || line.includes('Deleting original file')) {
        const current = getJob(jobId);
        if (current && current.status !== 'merging') {
          current.status = 'merging';
          current.progress = 100;
          setJob(current);
        }
        continue;
      }

      const update = parseYtDlpProgress(line);
      if (update) {
        const current = getJob(jobId);
        if (current) {
          Object.assign(current, update);
          setJob(current);
        }
      }
    }
  });

  proc.on('close', (code) => {
    const current = getJob(jobId);
    if (!current) return;

    if (code !== 0) {
      current.status = 'error';
      current.error = stderrBuffer.slice(0, 500) || `yt-dlp exited with code ${code}`;
      setJob(current);
      return;
    }

    const ext = type === 'audio' ? 'mp3' : 'mp4';
    const expectedFile = join(tmpdir(), `dld_${jobId}.${ext}`);
    if (existsSync(expectedFile)) {
      current.filePath = expectedFile;
    } else {
      const files = readdirSync(tmpdir()).filter((f: string) => f.startsWith(`dld_${jobId}`));
      if (files.length > 0) {
        current.filePath = join(tmpdir(), files[0]);
      }
    }

    if (!current.filePath) {
      current.status = 'error';
      current.error = 'Download completed but output file not found.';
      setJob(current);
      return;
    }

    const titleMatch = stderrBuffer.match(/\[download\]\s+Destination:\s+(.+)/);
    if (titleMatch) {
      const rawName = titleMatch[1].split('/').pop() || '';
      current.filename = rawName.replace(/\.[^.]+$/, `.${ext}`);
    } else {
      const safeName = current.title.replace(/[<>:"/\\|?*]/g, '_').trim();
      current.filename = `${safeName}.${ext}`;
    }

    current.status = 'completed';
    current.progress = 100;
    setJob(current);
  });

  proc.on('error', (err) => {
    const current = getJob(jobId);
    if (current) {
      current.status = 'error';
      current.error = err.message;
      setJob(current);
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, type, title, thumbnail } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }
    if (type !== 'video' && type !== 'audio') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const jobId = randomBytes(8).toString('hex');
    createJob(jobId, url, type, title || 'Unknown', thumbnail || '');

    startDownload(jobId, url, type);

    return NextResponse.json({ success: true, id: jobId });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to start download';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
