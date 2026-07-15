# ToolBox Dark Theme Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign ToolBox from light theme to dark theme matching raditz-offc aesthetic — dark backgrounds, indigo-purple accents, glassmorphism, glow effects, and animations.

**Architecture:** Rewrite `globals.css` as the design system foundation, then update each page and component to use the new dark theme classes. All visual changes, no functional changes.

**Tech Stack:** Next.js App Router, Tailwind CSS, Poppins (Google Fonts), CSS animations

## Global Constraints

- Background: `#030014` (deep navy)
- Primary accent: `#6366f1` (indigo)
- Secondary accent: `#a855f7` (purple)
- Card style: glassmorphism (`backdrop-blur(12px)` + `rgba(255,255,255,0.03)` + `rgba(255,255,255,0.08)` border)
- Font: Poppins 400/500/600/700
- No functional changes to download/conversion logic

---

### Task 1: Add Poppins Font to Layout

**Covers:** [S3]

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: Poppins font available globally

- [ ] **Step 1: Update layout.tsx to add Poppins font**

Replace the existing Geist font imports with Poppins. Add Google Fonts link in `<head>` and apply to body.

```tsx
// app/layout.tsx — key changes:
// 1. Add Poppins link in head or use next/font
// 2. Apply font class to body
```

- [ ] **Step 2: Verify font loads**

Run: `npm run dev`, open browser, inspect body — should show Poppins font.

---

### Task 2: Rewrite globals.css — Dark Theme Foundation

**Covers:** [S2, S4, S5]

**Files:**
- Rewrite: `app/globals.css`

**Interfaces:**
- Consumes: Poppins font from Task 1
- Produces: All dark theme classes used by pages/components

- [ ] **Step 1: Rewrite globals.css**

Replace entire file with dark theme system:

```css
@import "tailwindcss";

:root {
  --background: #030014;
  --foreground: #ffffff;
  --surface: rgba(255,255,255,0.03);
  --border: rgba(255,255,255,0.08);
  --muted: #9ca3af;
  --accent: #6366f1;
  --accent-secondary: #a855f7;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: 'Poppins', system-ui, sans-serif;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: 'Poppins', system-ui, sans-serif;
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: rgba(3,0,20,0.4); backdrop-filter: blur(8px); border-left: 1px solid rgba(99,102,241,0.1); }
::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 20px; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1); }
::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.5); box-shadow: inset 0 0 20px rgba(168,85,247,0.2), 0 0 10px rgba(99,102,241,0.2); }

/* Glassmorphism Card */
.card {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.card:hover {
  border-color: rgba(99,102,241,0.3);
  box-shadow: 0 0 30px rgba(99,102,241,0.15);
  transform: translateY(-4px);
}

/* Glassmorphism Input */
.input-clean {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #ffffff;
  border-radius: 12px;
  transition: all 0.2s;
}
.input-clean::placeholder { color: #6b7280; }
.input-clean:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  outline: none;
}

/* Primary Button with Glow */
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(99,102,241,0.3);
  transition: all 0.2s;
}
.btn-primary:hover {
  box-shadow: 0 0 30px rgba(99,102,241,0.5);
  transform: translateY(-2px);
}
.btn-primary:active { transform: scale(0.98); }
.btn-primary:disabled { opacity: 0.4; transform: none; box-shadow: none; }

/* Hero CTA Button */
.btn-hero {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 12px 24px;
  border-radius: 14px;
  box-shadow: 0 0 30px rgba(99,102,241,0.3);
  font-weight: 600;
  transition: all 0.2s;
}
.btn-hero:hover {
  box-shadow: 0 0 50px rgba(99,102,241,0.5);
  transform: translateY(-3px);
}

/* Feature Pill */
.feature-pill {
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 999px;
  padding: 8px 16px;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-weight: 500;
  color: #a5b4fc;
  font-size: 0.85rem;
}

/* Hero */
.hero-gradient {
  background: radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%);
}
.hero-title-unique { font-size: 2.5rem; line-height: 1.05; font-weight: 800; }
.hero-subtitle { color: #9ca3af; font-size: 1.05rem; margin-top: 12px; }

/* Background Blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(128px);
  pointer-events: none;
  animation: blob-float 8s ease-in-out infinite;
}
.blob-1 { width: 400px; height: 400px; background: rgba(99,102,241,0.15); top: -100px; left: -100px; }
.blob-2 { width: 350px; height: 350px; background: rgba(168,85,247,0.12); top: 50px; right: -80px; animation-delay: 2s; }
.blob-3 { width: 300px; height: 300px; background: rgba(99,102,241,0.08); bottom: -50px; left: 30%; animation-delay: 4s; }

@keyframes blob-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

/* Grid Overlay */
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}

/* Animations */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.anim-fade-up { animation: fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
.anim-fade-in { animation: fade-in 0.5s ease-out both; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }

/* Tools Card Hover */
.tools-card-hover { transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s; }
.tools-card-hover:hover {
  transform: translateY(-6px);
  border-color: rgba(99,102,241,0.3);
  box-shadow: 0 0 40px rgba(99,102,241,0.2);
}

/* Tool Icon Gradients */
.tools-icon-video { background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05)); color: #818cf8; }
.tools-icon-image { background: linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.05)); color: #c084fc; }
.tools-icon-file { background: linear-gradient(135deg, rgba(148,163,184,0.2), rgba(148,163,184,0.05)); color: #94a3b8; }

/* Tool Card Accent Bars */
.tools-card-accent { height: 2px; border-radius: 1px; margin-top: 14px; }
.tools-accent-video { background: linear-gradient(90deg, #6366f1, #818cf8); }
.tools-accent-image { background: linear-gradient(90deg, #a855f7, #c084fc); }
.tools-accent-file { background: linear-gradient(90deg, #64748b, #94a3b8); }

/* Tools Hero */
.tools-hero {
  background: radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 60%);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.tools-hero-title { font-size: 1.75rem; font-weight: 800; color: #ffffff; line-height: 1.1; }
.tools-hero-subtitle { color: #9ca3af; font-size: 0.95rem; margin-top: 8px; }

/* FAQ */
.faq { display: flex; flex-direction: column; gap: 12px; width: 100%; }
.faq-item {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
}
.faq-item:hover { border-color: rgba(99,102,241,0.2); }
.faq-question { display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; padding: 16px 18px; }
.faq-qtext { font-weight: 600; color: #ffffff; font-size: 0.95rem; flex: 1; }
.faq-toggle {
  width: 32px; height: 32px; border-radius: 999px;
  background: rgba(255,255,255,0.05); display: inline-grid; place-items: center;
  border: 1px solid rgba(255,255,255,0.08); color: #9ca3af;
  transition: all 0.2s; flex-shrink: 0;
}
.faq-toggle:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); color: #818cf8; }
.faq-answer { color: #9ca3af; font-size: 0.9rem; line-height: 1.6; display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 0.25s ease, opacity 0.2s ease; }
.faq-answer > div { overflow: hidden; }
.faq-open .faq-answer { grid-template-rows: 1fr; opacity: 1; }
.faq-open .faq-answer > div { padding: 0 18px 18px; }
.faq-chevron { transition: transform 0.18s ease; display: block; }
.faq-open .faq-chevron { transform: rotate(90deg); }

/* Logo Image */
.logo-img {
  width: 34px; height: 34px; border-radius: 9px; object-fit: cover;
  box-shadow: 0 0 15px rgba(99,102,241,0.2);
  border: 1px solid rgba(255,255,255,0.1);
}

/* Progress Bar */
.progress-shimmer { position: relative; overflow: hidden; }
.progress-shimmer::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: shimmer 1.5s infinite;
}

/* Accent Bar */
.accent-bar { width: 40px; height: 3px; background: linear-gradient(90deg, #6366f1, #a855f7); border-radius: 2px; }

/* Footer */
footer {
  background: transparent;
  border-top: 1px solid rgba(255,255,255,0.06);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify dark theme renders**

Run: `npm run dev`, open browser — should see dark background, glassmorphism cards, glow effects.

---

### Task 3: Update Homepage

**Covers:** [S3]

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: dark theme classes from Task 2
- Produces: dark homepage with blobs, glassmorphism, glow CTA

- [ ] **Step 1: Rewrite homepage JSX**

Update `app/page.tsx` to use dark theme:

- Nav: `bg-[rgba(3,0,20,0.8)] backdrop-blur-md border-[rgba(255,255,255,0.06)]`
- Hero: add `blob blob-1`, `blob blob-2`, `blob blob-3`, `grid-overlay`
- Heading text: white
- Subtitle: gray-400
- CTA button: `btn-hero` class
- FAQ section: glassmorphism
- Footer: dark border

- [ ] **Step 2: Verify homepage**

Run: `npm run dev` — homepage should have dark background, floating blobs, glassmorphism FAQ, glow CTA button.

---

### Task 4: Update /tools Page

**Covers:** [S3]

**Files:**
- Modify: `app/tools/page.tsx`

**Interfaces:**
- Consumes: dark theme classes from Task 2
- Produces: dark tools listing with glassmorphism cards

- [ ] **Step 1: Update tools page colors**

Change all light colors to dark equivalents:
- Nav: dark glassmorphism
- Hero: `tools-hero` with gradient
- Cards: glassmorphism with accent icons
- Text: white/gray-300/gray-400

- [ ] **Step 2: Verify /tools page**

Run: `npm run dev` → `/tools` — dark cards with indigo/purple icon gradients, glow on hover.

---

### Task 5: Update Tool Pages (video-downloader, image-converter, file-to-pdf)

**Covers:** [S3]

**Files:**
- Modify: `app/tools/video-downloader/page.tsx`
- Modify: `app/tools/image-converter/page.tsx`
- Modify: `app/tools/file-to-pdf/page.tsx`

**Interfaces:**
- Consumes: dark theme classes from Task 2
- Produces: dark tool pages

- [ ] **Step 1: Update video-downloader page**

Change nav and card colors to dark theme. Update feature highlight cards to glassmorphism.

- [ ] **Step 2: Update image-converter page**

Change nav, drop zone, format buttons, and result card to dark theme.

- [ ] **Step 3: Update file-to-pdf page**

Change nav and "coming soon" card to dark theme.

- [ ] **Step 4: Verify all tool pages**

Run: `npm run dev`, visit each tool page — all should have consistent dark theme.

---

### Task 6: Update Components

**Covers:** [S3]

**Files:**
- Modify: `components/DownloadForm.tsx`
- Modify: `components/VideoPreview.tsx`
- Modify: `components/DownloadHistory.tsx`
- Modify: `components/FaqSection.tsx`

**Interfaces:**
- Consumes: dark theme classes from Task 2
- Produces: dark-themed components

- [ ] **Step 1: Update DownloadForm**

- Input: `input-clean` (dark glassmorphism)
- Button: `btn-primary` (indigo gradient + glow)
- Error: dark red bg with red text
- Platform detected text: keep colored

- [ ] **Step 2: Update VideoPreview**

- Card: glassmorphism
- Thumbnail bg: dark
- Video button: `btn-primary` (indigo glow)
- Audio button: dark surface with white text

- [ ] **Step 3: Update DownloadHistory**

- Cards: glassmorphism
- Progress bar: indigo gradient with shimmer
- Status colors: adjust for dark bg

- [ ] **Step 4: Update FaqSection**

- Already styled via globals.css faq classes — verify it renders correctly

- [ ] **Step 5: Full visual verification**

Run: `npm run dev`, test complete flow: homepage → /tools → video-downloader → paste URL → download → FAQ. All should be consistent dark theme.

---

### Task 7: Final Cleanup

**Covers:** [S6]

**Files:**
- Review: all modified files

**Interfaces:**
- Consumes: all tasks above
- Produces: clean, consistent codebase

- [ ] **Step 1: Remove unused CSS classes**

Check `globals.css` for any leftover light-theme classes that are no longer used. Remove them.

- [ ] **Step 2: Verify no light-theme remnants**

Search all `.tsx` files for light-theme color values (`#FAFAFA`, `#E5E7EB`, `#111827` as background, etc.) that should have been changed to dark equivalents.

- [ ] **Step 3: Commit all changes**

```bash
git add -A
git commit -m "feat: redesign to dark theme with glassmorphism, glow effects, and animations"
```
