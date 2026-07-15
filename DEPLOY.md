# Deploy ke Vercel — Guide Lengkap

## Persiapan

1. **Push ke GitHub** (sudah done)
2. **Daftar Vercel** — https://vercel.com (gratis, tanpa credit card)

## Deploy

1. **Buka Vercel Dashboard**
- Klik "Add New..." → "Project"

2. **Import GitHub Repo**
- Pilih repo `RADITZ-OFFC/toolbox`
- Klik "Import"

3. **Configure Project**
- **Framework Preset**: Next.js (otomatis terdeteksi)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

4. **Tambah Environment Variables**
Klik "Environment Variables" → tambah satu per satu:

| Name | Value |
|------|-------|
| `IMGBB_API_KEY` | `52b881415e2aa0858493beb6216213aa` |
| `COBALT_API_URL` | `https://cobalt.dzakii.my.id` |
| `COBALT_API_KEY` | `41ede3f5-fc07-434f-ac6c-7cd4d6368d70` |

5. **Deploy**
- Klik "Deploy"
- Tunggu 1-2 menit

## Selesai!

Setelah deploy selesai, Vercel akan kasih URL seperti:
`https://toolbox-xxx.vercel.app`

**Semua fitur akan jalan:**
- ✓ Video Downloader (via cobalt API)
- ✓ Image Converter
- ✓ Image to URL
- ✓ File to PDF
- ✓ QR Code Generator
- ✓ Background Remover
- ✓ Image Compressor

## Fitur yang Berubah

**Video Downloader:**
- Sebelumnya: pakai yt-dlp (butuh server)
- Sekarang: pakai cobalt API (works di Vercel)

**Cara kerja:**
1. User paste URL video
2. Frontend panggil `/api/download` → cobalt API
3. Cobalt kembalikan direct download URL
4. User download langsung dari cobalt

## Custom Domain (Optional)

1. Buka Project Settings → "Domains"
2. Tambah domain kamu
3. Ikuti instruksi DNS setup

## Catatan

- **Gratis**: Vercel free tier cukup untuk personal/small group use
- **No cold start**: Berbeda dengan Render, Vercel tidak sleep
- **Global CDN**: Akses cepat dari mana saja
