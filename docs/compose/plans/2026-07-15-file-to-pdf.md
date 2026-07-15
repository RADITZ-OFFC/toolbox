# File to PDF — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a File to PDF tool that converts images, text, and HTML to PDF entirely in the browser using jsPDF.

**Architecture:** Single page with 3 tabs (Images, Text, HTML). Each tab has its own input UI and conversion logic. All processing client-side via jsPDF + html2canvas for HTML rendering.

**Tech Stack:** jsPDF, html2canvas, Next.js App Router, Tailwind CSS

## Global Constraints

- All conversion browser-side, no server processing
- Dark theme consistent with existing ToolBox design
- Glassmorphism cards, indigo-purple accents
- Poppins font
- Must work on mobile and desktop

---

### Task 1: Install Dependencies + Create Page Structure

**Covers:** [S1, S2]

**Files:**
- Run: `npm install jspdf html2canvas`
- Modify: `app/tools/file-to-pdf/page.tsx`
- Modify: `app/tools/page.tsx` (remove "Soon" badge)

**Interfaces:**
- Consumes: nothing
- Produces: page shell with 3 tabs

- [ ] **Step 1: Install dependencies**

```bash
cd "C:\Users\ADVAN\Documents\WEB DOWLOADER\web-downloader"
npm install jspdf html2canvas
```

- [ ] **Step 2: Create page with tab structure**

Rewrite `app/tools/file-to-pdf/page.tsx` with:
- Dark nav (same as other tool pages)
- 3 tab buttons: Images | Text | HTML
- Tab state management
- Content area that renders based on active tab

- [ ] **Step 3: Remove "Soon" badge from tools listing**

In `app/tools/page.tsx`, change File to PDF entry:
- Remove `disabled: true`
- Remove "Soon" badge rendering

- [ ] **Step 4: Verify**

Run: `npm run dev` → `/tools/file-to-pdf` — page loads with 3 tabs, no "Soon" on tools page.

---

### Task 2: Images to PDF Tab

**Covers:** [S3]

**Files:**
- Modify: `app/tools/file-to-pdf/page.tsx`

**Interfaces:**
- Consumes: jsPDF
- Produces: image upload, preview, reorder, PDF generation

- [ ] **Step 1: Implement Images tab**

Add to the Images tab:
- Drag & drop zone with file input
- Multiple file support (`accept="image/*"`, `multiple`)
- Thumbnail preview grid with remove button per image
- File name display
- "Convert to PDF" button
- Conversion logic using jsPDF: iterate images, add each as page

```typescript
const handleImagesToPDF = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  for (let i = 0; i < imageFiles.length; i++) {
    const img = imageFiles[i];
    const dataUrl = await readFileAsDataUrl(img.file);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    if (i > 0) pdf.addPage();
    pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  }
  pdf.save('images.pdf');
};
```

- [ ] **Step 2: Test image conversion**

Upload 2+ images → click Convert → PDF downloads with all images as separate pages.

---

### Task 3: Text to PDF Tab

**Covers:** [S4]

**Files:**
- Modify: `app/tools/file-to-pdf/page.tsx`

**Interfaces:**
- Consumes: jsPDF
- Produces: text input, font size option, PDF generation

- [ ] **Step 1: Implement Text tab**

Add to the Text tab:
- Large textarea for text input
- Font size dropdown (10, 12, 14, 16, 18, 20)
- Character count display
- "Convert to PDF" button
- Conversion logic: split text into lines that fit page width, add pages as needed

```typescript
const handleTextToPDF = () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  pdf.setFontSize(textFontSize);
  const lines = pdf.splitTextToSize(textContent, 180);
  let y = 20;
  for (const line of lines) {
    if (y > 270) { pdf.addPage(); y = 20; }
    pdf.text(line, 15, y);
    y += textFontSize * 0.5;
  }
  pdf.save('text.pdf');
};
```

- [ ] **Step 2: Test text conversion**

Type text → click Convert → PDF downloads with properly formatted text.

---

### Task 4: HTML to PDF Tab

**Covers:** [S5]

**Files:**
- Modify: `app/tools/file-to-pdf/page.tsx`

**Interfaces:**
- Consumes: html2canvas, jsPDF
- Produces: HTML input, preview, PDF generation

- [ ] **Step 1: Implement HTML tab**

Add to the HTML tab:
- Textarea for HTML code input
- Live preview panel (rendered HTML in an iframe or div)
- "Convert to PDF" button
- Conversion logic using html2canvas to render preview, then add to jsPDF

```typescript
const handleHTMLToPDF = async () => {
  const previewEl = document.getElementById('html-preview');
  if (!previewEl) return;
  const canvas = await html2canvas(previewEl);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('html.pdf');
};
```

- [ ] **Step 2: Test HTML conversion**

Paste HTML → see preview → click Convert → PDF downloads with rendered HTML.

---

### Task 5: Polish + Dark Theme Consistency

**Covers:** [S6]

**Files:**
- Modify: `app/tools/file-to-pdf/page.tsx`
- Modify: `app/globals.css` (if needed)

**Interfaces:**
- Consumes: all tasks above
- Produces: polished, consistent dark theme UI

- [ ] **Step 1: Style all inputs with dark theme**

- Drop zone: glassmorphism card with dashed border
- Textarea: dark glassmorphism with indigo focus ring
- Buttons: btn-primary with glow
- File previews: dark cards with remove button
- Tab buttons: active = indigo gradient, inactive = dark surface

- [ ] **Step 2: Add loading state**

Show "Converting..." with spinner during PDF generation (especially for HTML which uses html2canvas).

- [ ] **Step 3: Add success feedback**

Show "PDF downloaded!" toast or inline message after successful conversion.

- [ ] **Step 4: Final verification**

Run: `npm run dev`, test all 3 tabs on desktop and mobile:
- Images: upload 2 images → convert → PDF with 2 pages
- Text: type text → convert → PDF with text
- HTML: paste `<h1>Hello</h1>` → convert → PDF with rendered HTML
- All UI elements follow dark theme

---

### Task 6: Commit

**Files:** All modified files

- [ ] **Step 1: Commit all changes**

```bash
git add -A
git commit -m "feat: add File to PDF tool with images, text, and HTML conversion"
```
