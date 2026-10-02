# Design Tokens Reference: Goethe- / ÖSD-Zertifikat B1

This document specifies the exact typography, color palettes, spacing metrics, and print geometry required to authentically replicate official Goethe-Institut and ÖSD Zertifikat B1 examination papers.

## 1. Typography & Hierarchy

| Token | Font Family | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| `font-header` | Source Sans 3, Open Sans | 10pt (13px) | Bold (700) | 1.2 | Grey running header bar (`ZERTIFIKAT B1 \| LESEN`) |
| `font-title-hero` | Source Sans 3, Open Sans | 36pt (48px) | Black (900) | 1.1 | Level hero mark (`B1`), primary exam title |
| `font-title-section` | Source Sans 3, Open Sans | 14pt (18px) | Extrabold (800) | 1.3 | Teil headers (`Teil 1`, `Teil 2`, etc.) |
| `font-body` | Source Sans 3, Arial | 10pt (13.3px) | Regular (400) | 1.45 | Body text, emails, reading articles |
| `font-mono` | JetBrains Mono, Courier | 9pt (12px) | Medium (500) | 1.2 | Candidate PTN boxes, scan-sheet barcodes, answer key |
| `font-caption` | Source Sans 3 | 8pt (10.5px) | Italic / Medium | 1.2 | Source attribution, footnotes, page numbers |

## 2. Color Palette

| Token | Hex Value | RGB | CMYK Print Approx. | Usage |
|---|---|---|---|---|
| `color-grey-bar` | `#D9D9D9` | `rgb(217, 217, 217)` | `C:0 M:0 Y:0 K:15` | Official section header bands |
| `color-goethe-orange` | `#E15B28` | `rgb(225, 91, 40)` | `C:0 M:75 Y:90 K:0` | B1 Level mark, primary badge |
| `color-goethe-lime` | `#8CB82A` | `rgb(140, 184, 42)` | `C:45 M:0 Y:95 K:0` | Goethe Institut emblem accent |
| `color-text-primary` | `#111827` | `rgb(17, 24, 39)` | `C:0 M:0 Y:0 K:95` | Primary body text and questions |
| `color-text-secondary` | `#4B5563` | `rgb(75, 85, 99)` | `C:0 M:0 Y:0 K:70` | Instructions, examples, subheaders |
| `color-border-subtle` | `#D1D5DB` | `rgb(209, 213, 219)` | `C:0 M:0 Y:0 K:20` | Card borders, table dividers |
| `color-paper-bg` | `#FFFFFF` | `rgb(255, 255, 255)` | `C:0 M:0 Y:0 K:0` | Candidate exam paper background |
| `color-ad-bg` | `#FEF3C7` | `rgb(254, 243, 199)` | `C:0 M:5 Y:25 K:0` | Teil 3 advertisement torn-paper cards |

## 3. Spacing, Geometry & Page Boundaries

- **Paper Size**: DIN A4 Portrait (`210 mm × 297 mm` / `8.27 in × 11.69 in`).
- **Standard Margins**: `20 mm` (top, bottom, left, right).
- **Narrow Margins**: `15 mm`.
- **Wide Margins**: `25 mm`.
- **Checkboxes**:
  - Size: `5 mm × 5 mm` (`18 px × 18 px`)
  - Border: `2 px` solid `#111827`
  - Marker: `☒` (Centered cross, black)
  - Correction: `⬛` (Filled black square)
- **Teil 3 Advertisement Tabs**:
  - Size: `6 mm × 6 mm` (`22 px × 22 px`)
  - Position: `-10 px` top, `-10 px` left (overlapping corner tab)
  - Color: `#111827` background, `#FFFFFF` text, `font-mono font-black`
  - Rotation: Random `-2.0°` to `+2.0°` with drop shadow (`0 2px 4px rgba(0,0,0,0.08)`).
- **Teil 5 Rules Sheet**:
  - Outer border: `2 px` solid `#111827`
  - Inner padding: `16 mm`
  - Drop shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
  - Subsections: Uppercase bold title, `1.5 mm` line spacing, justified body text.
