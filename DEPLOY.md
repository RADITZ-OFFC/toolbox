# Deploy ke Render.com — Guide Lengkap

## Persiapan

1. **Push ke GitHub**
```bash
cd "C:\Users\ADVAN\Documents\WEB DOWLOADER\web-downloader"
git init
git add .
git commit -m "Initial commit"
# Buat repo baru di GitHub, lalu:
git remote add origin https://github.com/YOUR_USERNAME/web-downloader.git
git push -u origin main
```

2. **Daftar Render**
- Buka https://render.com
- Klik "Get Started for Free"
- Daftar pakai GitHub account

## Deploy

1. **Buka Render Dashboard**
- Klik "New +" → "Web Service"

2. **Connect GitHub Repo**
- Pilih repo `web-downloader`
- Klik "Connect"

3. **Configure Service**
- **Name**: `web-downloader` (atau nama bebas)
- **Runtime**: `Docker`
- **Instance Type**: `Free` (gratis)
- **Port**: `3000`

4. **Tambah Environment Variables**
Klik "Advanced" → "Add Environment Variable":
- `IMGBB_API_KEY` = `52b881415e2aa0858493beb6216213aa`

5. **Deploy**
- Klik "Create Web Service"
- Tunggu 3-5 menit untuk build dan deploy

## Selesai!

Setelah deploy selesai, Render akan kasih URL seperti:
`https://web-downloader.onrender.com`

Semua fitur akan jalan:
- ✓ Video Downloader (yt-dlp + ffmpeg)
- ✓ Image Converter
- ✓ Image to URL
- ✓ File to PDF
- ✓ QR Code Generator
- ✓ Background Remover
- ✓ Image Compressor

## Catatan

- **Cold start**: Saat tidak ada traffic selama 15 menit, app akan sleep. Saat ada request pertama, butuh ~30 detik untuk wake up.
- **750 jam/bulan**: Cukup untuk personal use (24 jam/hari × 31 hari = 744 jam)
- **Custom domain**: Bisa tambah domain sendiri di settings
- **HTTPS**: Otomatis dari Render
