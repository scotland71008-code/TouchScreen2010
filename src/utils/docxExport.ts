import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  ImageRun,
  Header,
  Footer,
  PageNumber
} from 'docx';
import { saveAs } from 'file-saver';

// Helper to convert Canvas to Uint8Array for docx ImageRun
export function canvasToUint8Array(canvas: HTMLCanvasElement): Uint8Array {
  const dataUrl = canvas.toDataURL('image/png');
  const base64 = dataUrl.split(',')[1];
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Generate Screenshot Canvas for Architecture Builder Canvas
export function generateArchitectureCanvasScreenshot(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 680;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#060a14';
  ctx.fillRect(0, 0, 1200, 680);

  // Grid dots
  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  for (let x = 20; x < 1200; x += 30) {
    for (let y = 20; y < 680; y += 30) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Top Bar
  ctx.fillStyle = '#0b1329';
  ctx.fillRect(0, 0, 1200, 60);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 60);
  ctx.lineTo(1200, 60);
  ctx.stroke();

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Segoe UI", sans-serif';
  ctx.fillText('OCTAVE ARCHITECTURE CANVAS — DIGITAL TWIN TOPOLOGY', 30, 38);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '13px monospace';
  ctx.fillText('STATUS: SYNCHRONIZED | ACTIVE BLUEPRINT: EPC HANDOVER', 760, 38);

  // Draw Nodes
  const drawNode = (
    x: number,
    y: number,
    w: number,
    h: number,
    pillar: string,
    pillarColor: string,
    name: string,
    subtitle: string
  ) => {
    // Glow & Shadow
    ctx.fillStyle = 'rgba(11, 19, 41, 0.95)';
    ctx.strokeStyle = pillarColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fill();
    ctx.stroke();

    // Pillar badge
    ctx.fillStyle = pillarColor;
    ctx.beginPath();
    ctx.roundRect(x + 16, y + 14, 70, 20, 4);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(pillar, x + 24, y + 28);

    // Node Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Segoe UI", sans-serif';
    ctx.fillText(name, x + 16, y + 60);

    // Subtitle
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Segoe UI", sans-serif';
    ctx.fillText(subtitle, x + 16, y + 82);

    // Connection port
    ctx.fillStyle = pillarColor;
    ctx.beginPath();
    ctx.arc(x + w, y + h / 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y + h / 2, 6, 0, Math.PI * 2);
    ctx.fill();
  };

  // Node 1: Forte (DESIGN)
  drawNode(80, 140, 260, 110, 'DESIGN', '#38bdf8', 'Octave Forte', '3D Engineering CAD & Spatial Modeling');

  // Node 2: Facets (DESIGN)
  drawNode(80, 420, 260, 110, 'DESIGN', '#38bdf8', 'Octave Facets', '2D Schematics, P&ID & Electrical');

  // Node 3: InConcert (DESIGN - Digital Twin Central Hub)
  drawNode(470, 280, 280, 120, 'DESIGN', '#818cf8', 'Octave InConcert', 'Information Management & Digital Twin Hub');

  // Node 4: Databridge Pro (MIDDLEWARE)
  drawNode(840, 160, 280, 110, 'MIDDLEWARE', '#f59e0b', 'Databridge Pro', 'Enterprise Integration & API Shield');

  // Node 5: Alto (OPERATE)
  drawNode(840, 420, 280, 110, 'OPERATE', '#ec4899', 'Octave Alto', 'Multi-Dimensional Digital Twin Viewer');

  // Draw Connector Lines with Badges
  const drawLink = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    label: string,
    color: string,
    unidirectional = true
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo((x1 + x2) / 2, y1, (x1 + x2) / 2, y2, x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Midpoint Badge
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    ctx.fillStyle = '#030712';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(midX - 85, midY - 14, 170, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${unidirectional ? '→' : '⇆'} ${label}`, midX, midY + 4);
    ctx.textAlign = 'left';
  };

  // Links
  drawLink(340, 195, 470, 340, 'Native REST / 3D Sync', '#38bdf8', true);
  drawLink(340, 475, 470, 340, 'Direct OData / Tags', '#38bdf8', true);
  drawLink(750, 340, 840, 215, 'Kafka / JSON API', '#f59e0b', true);
  drawLink(750, 340, 840, 475, 'Live Telemetry Bus', '#ec4899', true);

  // Bottom Status Bar
  ctx.fillStyle = '#0b1329';
  ctx.fillRect(0, 630, 1200, 50);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.beginPath();
  ctx.moveTo(0, 630);
  ctx.lineTo(1200, 630);
  ctx.stroke();

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('● 5 NODES ACTIVE | 4 SYNCHRONIZED INTERCONNECTS | AI SANITY CHECK: 100% VALID', 30, 660);

  return canvas;
}

// Generate Screenshot Canvas for Four Pillars Lifecycle
export function generateFourPillarsScreenshot(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 600;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#060a14';
  ctx.fillRect(0, 0, 1200, 600);

  // Header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Segoe UI", sans-serif';
  ctx.fillText('OCTAVE INDUSTRIAL LIFECYCLE — THE FOUR PILLARS', 40, 50);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Segoe UI", sans-serif';
  ctx.fillText('Complete continuity from conceptual capital project design to safe autonomous operations', 40, 80);

  const pillars = [
    {
      title: 'DESIGN',
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.08)',
      tag: 'CAPEX PHASE',
      tools: ['Octave Forte (3D CAD)', 'Octave Facets (P&ID & Electrical)', 'Octave InConcert (Digital Twin Spine)', 'Octave Schematics']
    },
    {
      title: 'BUILD',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.08)',
      tag: 'CONSTRUCTION',
      tools: ['Databridge Pro (API Shield)', 'OnSite Construction Packager', 'Loop Verification Engine', 'Material & Logistics Flow']
    },
    {
      title: 'OPERATE',
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.08)',
      tag: 'OPEX LIFECYCLE',
      tools: ['Octave Alto (Multi-D Twin)', 'Octave AssetSense (Predictive APM)', 'PlantPulse (Process Telemetry)', 'Tempo / J5 (Shift Operations)']
    },
    {
      title: 'PROTECT',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.08)',
      tag: 'GOVERNANCE & OT',
      tools: ['Cyber Integrity (OT Security)', 'SafetyNet (Alarm Rationalization)', 'ComplianceTrack (Audit)', 'OnCall (Crisis & Dispatch)']
    }
  ];

  pillars.forEach((p, idx) => {
    const x = 40 + idx * 280;
    const y = 120;
    const w = 260;
    const h = 420;

    // Card box
    ctx.fillStyle = '#0c1322';
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 14);
    ctx.fill();
    ctx.stroke();

    // Top accent bar
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, 6, [14, 14, 0, 0]);
    ctx.fill();

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Segoe UI", sans-serif';
    ctx.fillText(p.title, x + 20, y + 45);

    // Tag
    ctx.fillStyle = p.color;
    ctx.font = 'bold 10px monospace';
    ctx.fillText(p.tag, x + 20, y + 68);

    // Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 85);
    ctx.lineTo(x + w - 20, y + 85);
    ctx.stroke();

    // Tools
    p.tools.forEach((tool, tIdx) => {
      const ty = y + 120 + tIdx * 65;

      ctx.fillStyle = '#161f33';
      ctx.beginPath();
      ctx.roundRect(x + 16, ty - 18, w - 32, 50, 8);
      ctx.fill();

      ctx.fillStyle = p.color;
      ctx.font = 'bold 12px "Segoe UI", sans-serif';
      ctx.fillText(`●  ${tool}`, x + 28, ty + 12);
    });
  });

  return canvas;
}

// Generate Screenshot Canvas for Global Offices Map
export function generateGlobalOfficesScreenshot(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 600;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#060a14';
  ctx.fillRect(0, 0, 1200, 600);

  // Header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Segoe UI", sans-serif';
  ctx.fillText('OCTAVE GLOBAL HUBS & SPATIAL PRESENCE', 40, 50);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '13px monospace';
  ctx.fillText('8 STRATEGIC CENTERS | LIVE TELEMETRY & LOW-LATENCY INTERCONNECTS', 40, 80);

  // World grid stylized outline
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.lineWidth = 1;
  for (let lat = 120; lat < 540; lat += 50) {
    ctx.beginPath();
    ctx.moveTo(40, lat);
    ctx.lineTo(1160, lat);
    ctx.stroke();
  }
  for (let lon = 40; lon < 1160; lon += 80) {
    ctx.beginPath();
    ctx.moveTo(lon, 120);
    ctx.lineTo(lon, 540);
    ctx.stroke();
  }

  // Office nodes
  const offices = [
    { city: 'Huntsville', role: 'Global HQ', x: 260, y: 260, color: '#f59e0b', ping: true },
    { city: 'Khobar', role: 'Eastern Province Hub (LEAP)', x: 680, y: 310, color: '#10b981', ping: true },
    { city: 'Dubai', role: 'Middle East Regional HQ', x: 730, y: 320, color: '#8b5cf6', ping: true },
    { city: 'Houston', role: 'Energy & Offshore Tech', x: 230, y: 290, color: '#38bdf8' },
    { city: 'London', role: 'Europe Regional Operations', x: 530, y: 220, color: '#38bdf8' },
    { city: 'Singapore', role: 'Asia-Pacific Tech Hub', x: 920, y: 380, color: '#38bdf8' },
    { city: 'Tokyo', role: 'East Asia R&D Center', x: 1040, y: 270, color: '#38bdf8' },
    { city: 'Calgary', role: 'Energy & Mining Hub', x: 200, y: 210, color: '#38bdf8' }
  ];

  // Draw inter-hub arcs to Huntsville HQ
  const hq = offices[0];
  offices.slice(1).forEach((off) => {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(hq.x, hq.y);
    ctx.quadraticCurveTo((hq.x + off.x) / 2, Math.min(hq.y, off.y) - 60, off.x, off.y);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Draw Office Pins
  offices.forEach((off) => {
    // Pulse
    if (off.ping) {
      ctx.fillStyle = off.color;
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.arc(off.x, off.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Dot
    ctx.fillStyle = off.color;
    ctx.beginPath();
    ctx.arc(off.x, off.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // City card
    ctx.fillStyle = '#0a101f';
    ctx.strokeStyle = off.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(off.x - 70, off.y + 14, 140, 42, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(off.city, off.x, off.y + 30);

    ctx.fillStyle = off.color;
    ctx.font = '9px monospace';
    ctx.fillText(off.role, off.x, off.y + 45);
    ctx.textAlign = 'left';
  });

  return canvas;
}

// Generate Screenshot Canvas for Executive KPI & Value Simulator
export function generateKpiSimulatorScreenshot(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 600;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#060a14';
  ctx.fillRect(0, 0, 1200, 600);

  // Header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Segoe UI", sans-serif';
  ctx.fillText('OCTAVE EXECUTIVE VALUE SIMULATOR — ROI & KPI IMPACT', 40, 50);

  ctx.fillStyle = '#10b981';
  ctx.font = '13px monospace';
  ctx.fillText('FINANCIAL & OPERATIONAL BENEFITS PROJECTED OVER 3-YEAR DEPLOYMENT', 40, 80);

  const kpis = [
    { title: 'Engineering Rework Reduction', value: '-42%', color: '#38bdf8', sub: 'Single digital twin single source of truth' },
    { title: 'OPEX Maintenance Cost Savings', value: '-28%', color: '#10b981', sub: 'Predictive APM and automated work orders' },
    { title: 'Project Handover Time Cut', value: '-65%', color: '#f59e0b', sub: 'Zero paper data handover via InConcert' },
    { title: 'Unplanned Downtime Avoided', value: '310 Hrs', color: '#ec4899', sub: 'Real-time telemetry and cyber shield' }
  ];

  kpis.forEach((kpi, idx) => {
    const x = 40 + idx * 280;
    const y = 120;
    const w = 260;
    const h = 180;

    ctx.fillStyle = '#0c1322';
    ctx.strokeStyle = kpi.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Segoe UI", sans-serif';
    ctx.fillText(kpi.title, x + 20, y + 40);

    ctx.fillStyle = kpi.color;
    ctx.font = 'bold 44px "Segoe UI", sans-serif';
    ctx.fillText(kpi.value, x + 20, y + 105);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px "Segoe UI", sans-serif';
    ctx.fillText(kpi.sub, x + 20, y + 145);
  });

  // Chart Frame
  ctx.fillStyle = '#0b1222';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(40, 330, 1100, 230, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px "Segoe UI", sans-serif';
  ctx.fillText('Projected 3-Year Cumulative Value Realization ($ Millions)', 60, 365);

  // Simple stylized bar chart
  const bars = [
    { label: 'Year 0 (Setup)', val: 25, color: '#64748b' },
    { label: 'Year 1 (Go-Live)', val: 80, color: '#38bdf8' },
    { label: 'Year 2 (Full Scale)', val: 175, color: '#818cf8' },
    { label: 'Year 3 (Mature Twin)', val: 290, color: '#10b981' }
  ];

  bars.forEach((b, idx) => {
    const bx = 160 + idx * 240;
    const barHeight = b.val * 0.45;
    const by = 500 - barHeight;

    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.roundRect(bx, by, 110, barHeight, [6, 6, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`$${b.val}M`, bx + 55, by - 10);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Segoe UI", sans-serif';
    ctx.fillText(b.label, bx + 55, 525);
    ctx.textAlign = 'left';
  });

  return canvas;
}

// Generate Screenshot Canvas for AI Presales Copilot
export function generateAiCopilotScreenshot(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 600;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#060a14';
  ctx.fillRect(0, 0, 1200, 600);

  // Header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Segoe UI", sans-serif';
  ctx.fillText('OCTAVE PRESALES AI COPILOT (GEMINI-POWERED INTELLIGENCE)', 40, 50);

  ctx.fillStyle = '#a855f7';
  ctx.font = '13px monospace';
  ctx.fillText('TOPOLOGY-AWARE CONVERSATIONAL ARCHITECT & RFP ACCELERATOR', 40, 80);

  // Main chat card
  ctx.fillStyle = '#0c1322';
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(40, 110, 1120, 450, 14);
  ctx.fill();
  ctx.stroke();

  // Active Topology Pill
  ctx.fillStyle = '#1e1b4b';
  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(65, 135, 620, 34, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#818cf8';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('ACTIVE CANVAS CONTEXT: 5 NODES (FORTE, FACETS, INCONCERT) | REST & ODATA BOUND', 80, 156);

  // User Message
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(600, 195, 520, 60, 10);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '13px "Segoe UI", sans-serif';
  ctx.fillText('How does Octave InConcert guarantee seamless tag synchronization', 620, 220);
  ctx.fillText('with 3D models coming from Octave Forte?', 620, 240);

  // AI Response
  ctx.fillStyle = '#171c2f';
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(65, 280, 800, 240, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 13px "Segoe UI", sans-serif';
  ctx.fillText('Octave Copilot AI Architect', 90, 310);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '13px "Segoe UI", sans-serif';
  ctx.fillText('1. Automated Tag Extraction: Forte streams 3D bounding boxes and tag attributes via Native REST.', 90, 345);
  ctx.fillText('2. Digital Twin Relationship Graph: InConcert binds the 3D model with 2D P&IDs from Octave Facets.', 90, 375);
  ctx.fillText('3. Bidirectional Reconciliation: Modifications in engineering attributes trigger automated change notices.', 90, 405);
  ctx.fillText('4. Interoperability Standards: Compliant with ISO 15926 and CFIHOS class libraries for rapid handover.', 90, 435);

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('✓ ARCHITECTURAL VERIFICATION PASSED — ZERO ORPHANED TAGS DETECTED', 90, 485);

  return canvas;
}

// MAIN DOCX GENERATION FUNCTION
export async function exportSystemDocumentationWord(): Promise<void> {
  // 1. Generate Screenshots
  const archCanvas = generateArchitectureCanvasScreenshot();
  const pillarsCanvas = generateFourPillarsScreenshot();
  const officesCanvas = generateGlobalOfficesScreenshot();
  const kpiCanvas = generateKpiSimulatorScreenshot();
  const copilotCanvas = generateAiCopilotScreenshot();

  const archBytes = canvasToUint8Array(archCanvas);
  const pillarsBytes = canvasToUint8Array(pillarsCanvas);
  const officesBytes = canvasToUint8Array(officesCanvas);
  const kpiBytes = canvasToUint8Array(kpiCanvas);
  const copilotBytes = canvasToUint8Array(copilotCanvas);

  // Helper styles
  const primaryNavy = '081028';
  const accentSky = '0284C7';
  const tableBorderColor = 'D1D5DB';

  // Build Document
  const doc = new Document({
    title: 'Octave Enterprise Presales & Architecture Platform Documentation',
    description: 'Complete system functionality specification, module architecture, and user operation guide.',
    creator: 'Octave Global Presales Engineering',
    styles: {
      default: {
        document: {
          run: {
            font: 'Segoe UI',
            size: 22, // 11pt
            color: '1E293B'
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'OCTAVE ENTERPRISE PLATFORM — SYSTEM DOCUMENTATION',
                    size: 16,
                    color: '64748B',
                    font: 'Segoe UI'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Page ',
                    size: 16,
                    color: '64748B'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: '64748B'
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 16,
                    color: '64748B'
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: '64748B'
                  })
                ]
              })
            ]
          })
        },
        children: [
          // TITLE / COVER PAGE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 1000, after: 300 },
            children: [
              new TextRun({
                text: 'OCTAVE ENTERPRISE PLATFORM',
                size: 52,
                bold: true,
                color: primaryNavy
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [
              new TextRun({
                text: 'Complete System Functionality, Module Architecture & User Operation Guide',
                size: 28,
                color: accentSky,
                bold: true
              })
            ]
          }),

          // Metadata Table
          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Document Version:', bold: true })] })]
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun('3.4.0 (Enterprise Release)')] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Target Audience:', bold: true })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun('CTOs, VPs of Engineering, EPC Contractors, Presales Solution Architects, Plant Operations Directors')] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Generated Date:', bold: true })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Classification:', bold: true })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun('Confidential — Octave Technical & Presales Specification')] })]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 500, after: 300 } }),

          // EXECUTIVE SUMMARY
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: '1. Executive Summary & Platform Overview',
                size: 32,
                bold: true,
                color: primaryNavy
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'The Octave Enterprise Presales & Architecture Platform is a next-generation interactive solution hub designed to showcase the unified digital twin and industrial software portfolio of Octave. Transitioning from legacy standalone systems (including Smart 3D, Smart P&ID, SmartPlant Foundation, and HxGN industrial suites), Octave delivers an integrated lifecycle fabric across '
              }),
              new TextRun({ text: 'DESIGN', bold: true }),
              new TextRun(', '),
              new TextRun({ text: 'BUILD', bold: true }),
              new TextRun(', '),
              new TextRun({ text: 'OPERATE', bold: true }),
              new TextRun(', and '),
              new TextRun({ text: 'PROTECT', bold: true }),
              new TextRun('. The platform empowers prospective enterprise clients, EPC partners, and owner-operators to explore solutions, construct bespoke architectures, simulate financial ROI, and consult an AI solution copilot.')
            ]
          }),

          // SECTION 2: THE FOUR PILLARS
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: '2. The Four Industrial Lifecycle Pillars',
                size: 32,
                bold: true,
                color: primaryNavy
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun(
                'Octave organizes enterprise industrial capabilities across four cohesive pillars that accompany an industrial asset from initial conceptual engineering to lifelong autonomous operations:'
              )
            ]
          }),

          // SCREENSHOT 1: FOUR PILLARS
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new ImageRun({
                data: pillarsBytes,
                transformation: {
                  width: 580,
                  height: 290
                },
                type: 'png'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figure 1: Octave Industrial Lifecycle Architecture — Four Unified Pillars',
                italics: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Pillar details
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '2.1 DESIGN Pillar', bold: true, color: accentSky })]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Octave Forte (Formerly Smart 3D): ', bold: true }),
              new TextRun('Next-generation multi-discipline 3D spatial plant, piping, structural, and electrical modeling engine.')
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Octave Facets (Formerly Smart P&ID & Electrical): ', bold: true }),
              new TextRun('Intelligent 2D schematic authoring, instrumentation engineering, and electrical tag topology.')
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Octave InConcert (Formerly SmartPlant Foundation): ', bold: true }),
              new TextRun('The central digital twin spine and information management orchestrator, binding all engineering data, 3D tags, and revisions into a coherent federated graph.')
            ]
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200 },
            children: [new TextRun({ text: '2.2 BUILD Pillar', bold: true, color: 'D97706' })]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Databridge Pro (Middleware): ', bold: true }),
              new TextRun('High-throughput enterprise integration bus and API shielding gateway ensuring secure bidirectional data flow between engineering, construction, and corporate ERP.')
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'OnSite Construction Packager: ', bold: true }),
              new TextRun('Automated work packaging, spool status tracking, and 4D/5D field assembly scheduling.')
            ]
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200 },
            children: [new TextRun({ text: '2.3 OPERATE Pillar', bold: true, color: 'DB2777' })]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Octave Alto: ', bold: true }),
              new TextRun('Multi-dimensional, high-performance web visualization canvas for operations, integrating point clouds, 3D CAD, and real-time SCADA telemetry.')
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Octave AssetSense & PlantPulse: ', bold: true }),
              new TextRun('Predictive asset performance management (APM), reliability analytics, and operator round scheduling.')
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Tempo / J5: ', bold: true }),
              new TextRun('Standardized shift handover management, electronic logbooks, and incident tracking.')
            ]
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200 },
            children: [new TextRun({ text: '2.4 PROTECT Pillar', bold: true, color: '059669' })]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Cyber Integrity (OT Cybersecurity): ', bold: true }),
              new TextRun('IEC 62443-compliant operational technology security, asset vulnerability inventory, and baseline drift detection.')
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'SafetyNet: ', bold: true }),
              new TextRun('Advanced alarm management, rationalization, and operator flood prevention.')
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'OnCall: ', bold: true }),
              new TextRun('Integrated crisis dispatch, emergency command, and public safety coordination.')
            ]
          }),

          // SECTION 3: ARCHITECTURE BUILDER
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: '3. Interactive Architecture Builder & Digital Twin Canvas',
                size: 32,
                bold: true,
                color: primaryNavy
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun(
                'The Architecture Builder is the flagship interactive engineering workbench. It allows users to drag-and-drop solution nodes onto a spatial canvas, establish unidirectional or bidirectional integration channels, and review interface protocols.'
              )
            ]
          }),

          // SCREENSHOT 2: ARCHITECTURE CANVAS
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new ImageRun({
                data: archBytes,
                transformation: {
                  width: 580,
                  height: 328
                },
                type: 'png'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figure 2: Interactive Digital Twin Architecture Canvas with Real-Time Interconnects',
                italics: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Core Architecture Builder Capabilities:', bold: true })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Dynamic Node Dragging & Snapping: ', bold: true }),
              new TextRun('Add solutions from the 4 pillars or middleware layers and adjust their coordinates freely.')
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Directional Protocol Binding: ', bold: true }),
              new TextRun('Connect nodes via Unidirectional (A → B) or Bidirectional (A ⇆ B) links with specific protocols (Native REST, OData, OPC UA, ISO 15926, Kafka, gRPC).')
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Pre-Engineered Industry Blueprints: ', bold: true }),
              new TextRun('One-click loading of proven enterprise templates including EPC Handover, Control Room Safety, Geospatial Digital Twin, and Information Management.')
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'AI Architectural Sanity Review: ', bold: true }),
              new TextRun('Embedded Gemini AI validates topologies for missing middleware, orphaned nodes, or data protocol bottlenecks.')
            ]
          }),

          // SECTION 4: VALUE SIMULATOR
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: '4. Octave Value Simulator & Executive KPI Modeling',
                size: 32,
                bold: true,
                color: primaryNavy
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun(
                'The Executive Value Simulator models financial returns, capital efficiency, and operational risk mitigation over a 3-year enterprise deployment.'
              )
            ]
          }),

          // SCREENSHOT 3: KPI SIMULATOR
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new ImageRun({
                data: kpiBytes,
                transformation: {
                  width: 580,
                  height: 290
                },
                type: 'png'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figure 3: Octave Executive Value Simulator — ROI & Key Performance Indicators',
                italics: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // SECTION 5: AI COPILOT
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: '5. Presales AI Assistant (Copilot Engine)',
                size: 32,
                bold: true,
                color: primaryNavy
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun(
                'Powered by the Gemini 2.5 Flash model, the Presales AI Copilot provides live conversational architecture consultation. Crucially, the AI is dynamically injected with the active canvas state (current nodes, protocols, and blueprint selection).'
              )
            ]
          }),

          // SCREENSHOT 4: AI COPILOT
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new ImageRun({
                data: copilotBytes,
                transformation: {
                  width: 580,
                  height: 290
                },
                type: 'png'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figure 4: Topology-Aware Conversational AI Copilot Interface',
                italics: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // SECTION 6: GLOBAL OFFICES
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: '6. Global Offices & Spatial Presence',
                size: 32,
                bold: true,
                color: primaryNavy
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun(
                'Octave operates across eight major technological centers worldwide, delivering 24/7 global engineering follow-the-sun support, R&D innovation, and localized regional client execution.'
              )
            ]
          }),

          // SCREENSHOT 5: GLOBAL OFFICES
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new ImageRun({
                data: officesBytes,
                transformation: {
                  width: 580,
                  height: 290
                },
                type: 'png'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figure 5: Octave Global Office Footprint & Inter-Hub Telemetry Network',
                italics: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Table of Offices
          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Hub / City', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Region', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Role & Primary Competency', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Staff', bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Huntsville, USA')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Americas')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Global Headquarters & Core R&D Technology Center')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('180')] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Khobar, Saudi Arabia')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('EMEA')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Eastern Province Hub & Regional Operations (LEAP)')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('52')] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Dubai, UAE')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('EMEA')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Middle East Regional HQ & AI Design Center')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('88')] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Houston, USA')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Americas')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Energy & Offshore Solutions Center')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('65')] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('London, UK')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('EMEA')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Europe & UK Regional Operations & Compliance')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('74')] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Singapore')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('APAC')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Asia-Pacific Tech Hub & Cloud Operations')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('60')] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Tokyo, Japan')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('APAC')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('East Asia Enterprise Engineering & Robotics Center')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('45')] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Calgary, Canada')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('Americas')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('North America Energy & Mining Hub')] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun('40')] })] })
                ]
              })
            ]
          }),

          // SECTION 7: QUIZ & CERTIFICATION
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: '7. Client Knowledge Quiz & Certification System',
                size: 32,
                bold: true,
                color: primaryNavy
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun(
                'To validate understanding and gamify exhibition engagements, the platform embeds a 10-question evaluation test. Users receive instant feedback, detailed technical explanations, and upon completion are issued an official downloadable Octave Certified Enterprise Architect Certificate.'
              )
            ]
          }),

          // SECTION 8: CONCLUSION
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: '8. Technical Specifications & Architecture Protocols',
                size: 32,
                bold: true,
                color: primaryNavy
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Data Protocols Supported Across Octave Solutions:', bold: true })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'REST API & Webhooks: ', bold: true }),
              new TextRun('Standard JSON payload data exchange for design metadata and external ERP/PLM integrations.')
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'OData v4: ', bold: true }),
              new TextRun('High-efficiency structured query data transfer for equipment lists, line registers, and instrument indices.')
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'OPC UA & MQTT: ', bold: true }),
              new TextRun('Industrial IoT and SCADA stream ingestion into Alto and AssetSense APM engines.')
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'ISO 15926 & CFIHOS: ', bold: true }),
              new TextRun('Standardized oil & gas / energy class library compliance for capital project handover.')
            ]
          }),
          new Paragraph({
            spacing: { before: 300, after: 400 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '— END OF SYSTEM DOCUMENTATION —',
                bold: true,
                color: '64748B'
              })
            ]
          })
        ]
      }
    ]
  });

  // Export Blob via file-saver
  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'Octave_System_Functionality_Documentation.docx');
}
