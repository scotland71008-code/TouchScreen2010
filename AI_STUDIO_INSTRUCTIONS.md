# AI Studio Instructions: Live Quiz & Tournament Achievement Certificate

## 1. Overview & Image Specifications
- **Template File**: `/public/certificate_background.png`
- **Native Resolution**: `1584 × 1224 px` (Landscape, 11" × 8.5" Letter at 144 PPI)
- **Aspect Ratio**: `1.2941 : 1` (`132 : 102`)
- **Horizontal Center**: `x = 792` (`1584 / 2 = 792`)
- **Nature of Background**: Pure blank certificate with Octave branding, ribbons, header typography, and divider lines. Contains **no placeholder text** baked in. Recipient name, date, credentials, and optional recognition body sentence are dynamically composited at exact pixel coordinates.

---

## 2. Text Positions & Coordinate Reference Table

| Element | Alignment | X Position | Y Position | Reference / Anchor Line | Font & Styling | Default Text / Example |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Recipient Name** | Centered (`center`) | **`792`** | **`700`** *(just above line)* | Line at `y = 710`, width 700px (`442` to `1142`) | `Great Vibes`, cursive, `64px-72px`, White `#ffffff` | Participant Name (e.g., *Ali Ibrahim*) |
| **Name Line** | Centered | `792` (`x1: 442, x2: 1142`) | **`710`** | Horizontal white stroke (`2.5px`, opacity 0.8) | SVG `<line>` / Canvas | — |
| **Participant Credentials** | Centered (`center`) | **`792`** | **`748`** | Positioned directly below name line | Monospace / Sans-serif, `16px`, `#94a3b8` | `Specialization · University/Org (email)` |
| **Body Sentence** *(Optional)* | Centered (`center`) | **`792`** | **`820`** | Positioned in lower mid-section | `Plus Jakarta Sans`, `20px`, `#e2e8f0` | *"In recognition of your participation in the ADIPEC interactive quiz and for securing 1st place"* |
| **Tournament Date** | Centered (`center`) | **`345`** | **`1000`** *(just above line)* | Date line at `y = 1013`, width 260px (`215` to `475`) | `Plus Jakarta Sans`, `18px`, `#f1f5f9` | `October 19, 2026` |
| **Date Line** | Centered | `345` (`x1: 215, x2: 475`) | **`1013`** | Horizontal white stroke (`2px`, opacity 0.65) | SVG `<line>` / Canvas | — |
| **Date Label** | Centered (`center`) | **`345`** | **`1052`** | Underneath date line | `Plus Jakarta Sans`, `15px`, bold, `#94a3b8` | `DATE` |
| **Committee Signature** | Centered (`center`) | **`1239`** | **`995`** *(just above line)* | Signature line at `y = 1013`, width 260px (`1109` to `1369`) | `Great Vibes`, cursive, `34px`, White `#ffffff` | *Octave Committee* |
| **Signature Line** | Centered | `1239` (`x1: 1109, x2: 1369`) | **`1013`** | Horizontal white stroke (`2px`, opacity 0.65) | SVG `<line>` / Canvas | — |
| **Signature Label** | Centered (`center`) | **`1239`** | **`1052`** | Underneath signature line | `Plus Jakarta Sans`, `15px`, bold, `#94a3b8` | `SIGNATURE` |
| **Tournament Seal** | Centered (`center`) | **`792`** | **`1010`** | Centered between Date and Signature | Circular badge with Pink accent `#e0247d` | 🥇/🥈/🥉 `ADIPEC 2026` |

---

## 3. Two Key Checks & Customization Guidelines

### 1. Font Selection
- **Name Script**: Uses `Great Vibes` (Google Font loaded via `index.html`) instead of Microsoft Office's proprietary `Palace Script MT`.
- **Fallbacks**: `'Great Vibes', cursive, 'Brush Script MT', 'Times New Roman', serif`.
- **Typography Hierarchy**:
  - Headings: `Montserrat` (800 / 900 bold, tracking `12px - 14px`)
  - Subheadings & Body: `Plus Jakarta Sans` / `-apple-system`
  - Accent Color: Hot Pink `#e0247d` and Rose Pink `#ec4899`

### 2. Body Sentence
- Original Word template wording:
  > *"In recognition of your participation in the ADIPEC interactive quiz and for securing [1st place / 2nd place / 3rd place]"*
- This sentence is dynamically composited at `x = 792, y = 820`.
- Configurable toggle (`bodySentenceEnabled: true/false`) in `src/utils/certificateConfig.ts`.

---

## 4. Fine-Tuning & Nudge Adjustments

If visual fine-tuning is desired, simply adjust the values in `src/utils/certificateConfig.ts`:

```typescript
export const CERTIFICATE_POSITIONS = {
  canvas: { width: 1584, height: 1224 },
  name: { x: 792, y: 700, lineY: 710, fontSize: 68 },
  date: { x: 345, y: 1000, lineY: 1013, fontSize: 18 },
  signature: { x: 1239, y: 995, lineY: 1013, fontSize: 34 },
  bodySentence: { x: 792, y: 820, fontSize: 20, enabled: true },
  credentials: { x: 792, y: 748, fontSize: 16, enabled: true },
  seal: { x: 792, y: 1010, radius: 36, enabled: true }
};
```
