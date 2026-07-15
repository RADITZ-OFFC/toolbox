# ToolBox Dark Theme Redesign — Design Spec

## [S1] Problem
ToolBox website currently uses a plain light theme that looks generic and "AI slop". User wants it redesigned with a dark theme matching the premium feel of https://raditz-offc.vercel.app — dark backgrounds, indigo-purple accents, glassmorphism, glow effects, and animations.

## [S2] Design System

### Colors
| Role | Color | Hex |
|------|-------|-----|
| Background | Deep navy | `#030014` |
| Surface/Cards | Semi-transparent white | `rgba(255,255,255,0.03)` with `backdrop-blur(12px)` |
| Card border | Subtle white | `rgba(255,255,255,0.08)` |
| Primary accent | Indigo | `#6366f1` |
| Secondary accent | Purple | `#a855f7` |
| Primary text | White | `#ffffff` |
| Secondary text | Gray-300 | `#d1d5db` |
| Muted text | Gray-400 | `#9ca3af` |
| Success | Green | `#22c55e` |
| Error | Red | `#ef4444` |
| Border | Subtle | `rgba(255,255,255,0.06)` |

### Typography
- Font: **Poppins** (Google Fonts), fallback system-ui
- Weights: 400, 500, 600, 700
- Headings: bold, white, tracking-tight
- Body: gray-300, regular weight

### Effects
- **Glassmorphism**: `backdrop-blur(12px)` + `rgba(255,255,255,0.03)` bg + `rgba(255,255,255,0.08)` border
- **Glow**: `box-shadow: 0 0 20px rgba(99,102,241,0.15)` on cards, `0 0 40px rgba(99,102,241,0.2)` on hover
- **Background blobs**: 2-3 large blurred circles (`blur-[128px]`) with slow float animation
- **Grid overlay**: 24px grid lines at very low opacity
- **Shimmer**: Shine sweep on buttons
- **Scroll animations**: Staggered fade-in-up on cards

## [S3] Pages to Update

### Global
- `app/globals.css` — Complete rewrite: dark theme variables, glassmorphism classes, glow effects, animations, scrollbar, blob keyframes
- `app/layout.tsx` — Add Poppins font, dark background

### Pages
- `app/page.tsx` — Homepage: dark hero with blobs, glassmorphism cards, glow CTA
- `app/tools/page.tsx` — Tools grid: dark cards with accent gradients, staggered animation
- `app/tools/video-downloader/page.tsx` — Dark nav, glassmorphism cards
- `app/tools/image-converter/page.tsx` — Dark nav, glassmorphism drop zone
- `app/tools/file-to-pdf/page.tsx` — Dark nav, glassmorphism "coming soon" card

### Components
- `components/DownloadForm.tsx` — Dark input, indigo button with glow
- `components/VideoPreview.tsx` — Glassmorphism card, glow buttons
- `components/DownloadHistory.tsx` — Dark cards, indigo progress bar
- `components/FaqSection.tsx` — Glassmorphism accordion items

## [S4] Visual Effects

### Background (all pages)
```
#030014 solid background
+ 2-3 animated blobs (blur-128px, indigo/purple, slow float)
+ subtle grid overlay (24px, rgba(255,255,255,0.03))
```

### Cards
```
background: rgba(255,255,255,0.03)
backdrop-filter: blur(12px)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 16px
transition: all 0.3s
hover: border-color rgba(99,102,241,0.3), box-shadow: 0 0 30px rgba(99,102,241,0.15)
```

### Buttons (primary)
```
background: linear-gradient(135deg, #6366f1, #8b5cf6)
box-shadow: 0 0 20px rgba(99,102,241,0.3)
hover: box-shadow: 0 0 30px rgba(99,102,241,0.5), translateY(-2px)
```

### Scrollbar
```
thin, indigo-tinted, with purple glow on hover
```

## [S5] Animations

1. **Blob float** — `translateY(0) → translateY(-20px) → translateY(0)`, 8s infinite
2. **Fade-in-up** — `opacity:0 + translateY(16px) → opacity:1 + translateY(0)`, 0.6s
3. **Shine sweep** — highlight moves left to right, 1.5s
4. **Card hover lift** — `translateY(-4px)` + glow intensify
5. **Staggered entry** — cards get increasing `animation-delay` (0.1s, 0.2s, 0.3s...)

## [S6] Scope Exclusion
- No new pages or features added
- No functional changes to download/conversion logic
- API routes untouched
- Only visual/CSS changes
