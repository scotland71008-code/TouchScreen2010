const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');
const { Resvg } = require('@resvg/resvg-js');

// Master Resolution: 1584 x 1224 px
const W = 1584;
const H = 1224;

function loadFont(relPath) {
  const full = path.join(__dirname, '..', relPath);
  const buf = fs.readFileSync(full);
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

const montExtra = loadFont('public/fonts/Montserrat-ExtraBold.ttf');
const montBold = loadFont('public/fonts/Montserrat-Bold.ttf');
const interReg = loadFont('public/fonts/Inter-Regular.ttf');
const interSemi = loadFont('public/fonts/Inter-SemiBold.ttf');
const greatVibes = loadFont('public/fonts/GreatVibes-Regular.ttf');

function createTextPath(font, text, centerX, baselineY, fontSize, letterSpacing = 0) {
  const scale = fontSize / font.unitsPerEm;
  let totalWidth = 0;
  const glyphs = [];
  for (let i = 0; i < text.length; i++) {
    const glyph = font.charToGlyph(text[i]);
    glyphs.push(glyph);
    const w = glyph.advanceWidth * scale;
    totalWidth += w + (i < text.length - 1 ? letterSpacing : 0);
  }
  let curX = centerX - totalWidth / 2;
  const fullPath = new opentype.Path();
  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];
    const p = glyph.getPath(curX, baselineY, fontSize);
    fullPath.commands.push(...p.commands);
    curX += glyph.advanceWidth * scale + letterSpacing;
  }
  return fullPath.toPathData(2);
}

// Generate vector paths for all static text
const pathCertificate = createTextPath(montExtra, 'CERTIFICATE', 792, 335, 58, 14);
const pathOfAchievement = createTextPath(montBold, 'OF ACHIEVEMENT', 792, 395, 22, 12);
const pathProudlyPresented = createTextPath(interReg, 'This certificate is proudly presented to', 792, 495, 22, 1.2);
const pathOctaveLogo = createTextPath(montExtra, 'OCTAVE', 1450, 155, 16, 4);
const pathDateLabel = createTextPath(interSemi, 'DATE', 345, 1052, 15, 4);
const pathSignatureLabel = createTextPath(interSemi, 'SIGNATURE', 1239, 1052, 15, 4);
const pathOctaveCommittee = createTextPath(greatVibes, 'Octave Committee', 1239, 992, 44, 0);
const pathAdipec2026 = createTextPath(montExtra, 'ADIPEC 2026', 792, 1048, 12, 3);

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <!-- Background obsidian gradient -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#12131b"/>
      <stop offset="50%" stop-color="#0e1017"/>
      <stop offset="100%" stop-color="#08090d"/>
    </linearGradient>

    <!-- Top Right Cascading Pink Waves -->
    <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#e0247d" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="#d946ef" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.3"/>
    </linearGradient>
    <linearGradient id="waveGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e11d48" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#ec4899" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0.25"/>
    </linearGradient>

    <!-- Border stroke gradient -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e0247d" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0.6"/>
    </linearGradient>
  </defs>

  <!-- Solid Obsidian Backdrop -->
  <rect width="${W}" height="${H}" fill="url(#bgGradient)"/>

  <!-- Elegant Inner Double Border -->
  <rect x="36" y="36" width="${W - 72}" height="${H - 72}" rx="8" fill="none" stroke="url(#borderGrad)" stroke-width="1.8" stroke-opacity="0.75"/>
  <rect x="44" y="44" width="${W - 88}" height="${H - 88}" rx="6" fill="none" stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.15"/>

  <!-- Top-Right Ribbon Wave Art -->
  <g opacity="0.92">
    <path d="M820,0 C1080,100 1340,240 ${W},450" fill="none" stroke="url(#waveGrad1)" stroke-width="2.2"/>
    <path d="M860,0 C1110,120 1360,280 ${W},500" fill="none" stroke="url(#waveGrad2)" stroke-width="2.8"/>
    <path d="M900,0 C1140,140 1380,320 ${W},550" fill="none" stroke="url(#waveGrad1)" stroke-width="3.2"/>
    <path d="M940,0 C1170,160 1400,360 ${W},600" fill="none" stroke="url(#waveGrad2)" stroke-width="2.4"/>
    <path d="M980,0 C1200,180 1420,400 ${W},660" fill="none" stroke="url(#waveGrad3)" stroke-width="3.8"/>
    <path d="M1020,0 C1230,200 1440,440 ${W},720" fill="none" stroke="url(#waveGrad1)" stroke-width="2.8"/>
    <path d="M1060,0 C1260,230 1460,490 ${W},780" fill="none" stroke="url(#waveGrad2)" stroke-width="3.4"/>
    <path d="M1100,0 C1290,260 1480,540 ${W},840" fill="none" stroke="url(#waveGrad1)" stroke-width="2.4"/>
    <path d="M1140,0 C1320,290 1500,590 ${W},910" fill="none" stroke="url(#waveGrad3)" stroke-width="4.0"/>
    <path d="M1190,0 C1360,330 1520,650 ${W},980" fill="none" stroke="url(#waveGrad2)" stroke-width="3.0"/>
    <path d="M1240,0 C1400,370 1540,710 ${W},1050" fill="none" stroke="url(#waveGrad1)" stroke-width="3.2"/>
    <path d="M1300,0 C1440,420 1560,770 ${W},1130" fill="none" stroke="url(#waveGrad2)" stroke-width="2.6"/>
  </g>

  <!-- Bottom-Left Ribbon Wave Art -->
  <g opacity="0.94">
    <path d="M0,770 C130,880 350,1070 630,${H}" fill="none" stroke="url(#waveGrad2)" stroke-width="2.2"/>
    <path d="M0,720 C160,850 390,1050 680,${H}" fill="none" stroke="url(#waveGrad1)" stroke-width="2.8"/>
    <path d="M0,670 C190,810 440,1030 730,${H}" fill="none" stroke="url(#waveGrad3)" stroke-width="3.2"/>
    <path d="M0,620 C220,770 490,1010 780,${H}" fill="none" stroke="url(#waveGrad2)" stroke-width="2.5"/>
    <path d="M0,570 C250,730 540,990 830,${H}" fill="none" stroke="url(#waveGrad1)" stroke-width="3.8"/>
    <path d="M0,510 C290,700 590,980 880,${H}" fill="none" stroke="url(#waveGrad2)" stroke-width="2.6"/>
    <path d="M0,450 C320,670 640,960 930,${H}" fill="none" stroke="url(#waveGrad3)" stroke-width="3.2"/>
    <path d="M0,390 C360,630 690,940 980,${H}" fill="none" stroke="url(#waveGrad1)" stroke-width="2.8"/>
    <path d="M0,330 C400,590 740,920 1030,${H}" fill="none" stroke="url(#waveGrad2)" stroke-width="4.0"/>
    <path d="M0,270 C440,550 790,900 1080,${H}" fill="none" stroke="url(#waveGrad1)" stroke-width="2.8"/>
    <path d="M0,200 C480,510 840,880 1130,${H}" fill="none" stroke="url(#waveGrad3)" stroke-width="3.2"/>
  </g>

  <!-- Top-Right Brand: OCTAVE -->
  <g transform="translate(1415, 65)">
    <path fill="#ffffff" d="M43.15,19.3l6.04-6.04c-3.49-1.43-8.31-2.44-15.02-2.44-11.14,0-20.16,5.3-20.16,11.83,0,5.37,6.09,9.9,14.44,11.35l-3.17,3.17c-8.75-3.87-18.35-0.29-18.35,4.6,0,2.86,3.27,5.27,7.74,6.01l-3.34,3.34c2.42,0.79,4.95,1.06,7.68,1.06,5.87,0,10.64-2.79,10.64-6.24,0-1.86-1.38-3.53-3.58-4.67,2.92,0.69,6.48,1.12,10.84,1.12,11.14,0,20.16-5.3,20.16-11.83,0-5.26-5.84-9.71-13.91-11.25ZM18.3,47.17c-4.38,0-7.93-1.62-7.93-3.62,0-2,3.55-3.62,7.93-3.62,4.38,0,7.93,1.62,7.93,3.62,0,2-3.55,3.62-7.93,3.62ZM35.72,33.6c-8.44,0-15.28-3.14-15.28-7.01,0-3.87,6.84-7.01,15.28-7.01,8.44,0,15.28,3.14,15.28,7.01,0,3.87-6.84,7.01-15.28,7.01Z" transform="scale(1.15)"/>
  </g>
  <path d="${pathOctaveLogo}" fill="#ffffff"/>

  <!-- Master Typography Headings (Pure Vector Paths) -->
  <path d="${pathCertificate}" fill="#ffffff"/>
  <path d="${pathOfAchievement}" fill="#e0247d"/>
  <path d="${pathProudlyPresented}" fill="#cbd5e1"/>

  <!-- ── The Name Line: centred at x=792, line at y=710 ── -->
  <!-- Name text is added above this line dynamically -->
  <line x1="442" y1="710" x2="1142" y2="710" stroke="#ffffff" stroke-opacity="0.8" stroke-width="2.5" stroke-linecap="round"/>

  <!-- ── Left Date Line: centred at x=345, line at y=1013 ── -->
  <!-- Date text is added above this line dynamically -->
  <line x1="215" y1="1013" x2="475" y2="1013" stroke="#ffffff" stroke-opacity="0.65" stroke-width="2" stroke-linecap="round"/>
  <path d="${pathDateLabel}" fill="#94a3b8"/>

  <!-- ── Right Signature Line: centred at x=1239, line at y=1013 ── -->
  <line x1="1109" y1="1013" x2="1369" y2="1013" stroke="#ffffff" stroke-opacity="0.65" stroke-width="2" stroke-linecap="round"/>
  <path d="${pathSignatureLabel}" fill="#94a3b8"/>
  
  <!-- Official Signature: Cursive Great Vibes vector path -->
  <path d="${pathOctaveCommittee}" fill="#ffffff" fill-opacity="0.95"/>

  <!-- ── Center Official Distinction Seal Emblem ── -->
  <g transform="translate(792, 1010)">
    <circle cx="0" cy="-14" r="38" fill="#e0247d" fill-opacity="0.16" stroke="#e0247d" stroke-width="2"/>
    <circle cx="0" cy="-14" r="31" fill="none" stroke="#e0247d" stroke-opacity="0.45" stroke-width="1.2" stroke-dasharray="4,3"/>
    <!-- Crisp 5-point vector Star -->
    <path fill="#ffffff" d="M 0,-28 L 3.8,-18.5 L 14,-18.5 L 5.8,-12.5 L 8.9,-3 L 0,-8.5 L -8.9,-3 L -5.8,-12.5 L -14,-18.5 L -3.8,-18.5 Z" />
  </g>
  <path d="${pathAdipec2026}" fill="#94a3b8"/>
</svg>`;

const outputPath = path.join(__dirname, '..', 'public', 'certificate_background.png');
const resvg = new Resvg(svgContent, {
  fitTo: { mode: 'width', value: W },
});
const pngData = resvg.render().asPng();
fs.writeFileSync(outputPath, pngData);
console.log(`Successfully generated vector master certificate at ${outputPath} (${W}x${H} px, ${pngData.length} bytes)`);
