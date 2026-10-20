import React, { useState, useRef, useMemo } from 'react';
import * as Icons from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import OctaveLogo from './OctaveLogo';

export interface GroupMember {
  id: string;
  name: string;
  title: string;
}

export interface ThankYouVisitingProps {
  initialVisitorName?: string;
  initialCompanyName?: string;
  initialJobTitle?: string;
  initialQuizScore?: { score: number; total: number; badge: string; clientName: string; companyName?: string; jobTitle?: string } | null;
  onNavigateToQuiz?: () => void;
}

export default function ThankYouVisiting({
  initialVisitorName,
  initialCompanyName,
  initialJobTitle,
  initialQuizScore,
  onNavigateToQuiz
}: ThankYouVisitingProps = {}) {
  // Core Visitor Details with defaults
  const [visitorName, setVisitorName] = useState(initialVisitorName || 'Ali Ibrahim');
  const [visitorTitle, setVisitorTitle] = useState(initialJobTitle || 'Presales');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [companyName, setCompanyName] = useState(initialCompanyName || 'Company Name');
  const [visitDate, setVisitDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [boothLocation, setBoothLocation] = useState('Octave - ADIPEC Hall 12 - Stand #12610');
  
  // Gratitude note focused on taking quiz or visiting booth
  const [personalNote, setPersonalNote] = useState(() => {
    if (initialQuizScore) {
      const s = initialQuizScore.score;
      const tierName = s >= 100 ? 'Platinum' : s >= 90 ? 'Gold' : s >= 80 ? 'Silver' : 'Bronze';
      return `Thank you for taking the Octave Client Knowledge Quiz, achieving ${initialQuizScore.score}%, and earning your official ${tierName} Certificate of Achievement!`;
    }
    return 'Thank you for visiting our booth and taking the time to have an insightful conversation with our team!';
  });

  // Certificate Theme selection: Platinum (100), Gold (90), Silver (80), Bronze (70)
  const [certificateTheme, setCertificateTheme] = useState<'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE'>(() => {
    if (!initialQuizScore) return 'PLATINUM';
    const s = initialQuizScore.score;
    if (s >= 100) return 'PLATINUM';
    if (s >= 90) return 'GOLD';
    if (s >= 80) return 'SILVER';
    return 'BRONZE';
  });

  // Certificate Reference Code: S12610-ADIPEC-2026 suffixed by first letter of certificate tier (e.g. S12610-ADIPEC-2026-P for Platinum)
  const certificateId = useMemo(() => {
    const tierLetter = certificateTheme ? certificateTheme.charAt(0).toUpperCase() : 'P';
    return `S12610-ADIPEC-2026-${tierLetter}`;
  }, [certificateTheme]);

  // Ref for certificate printing
  const certificateRef = useRef<HTMLDivElement>(null);

// Helper to rasterize the crisp Octave SVG emblem to PNG Data URL for jsPDF
const createSvgLogoPng = (fillColor: string, size = 512): Promise<string> => {
  return new Promise((resolve) => {
    try {
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
        <path fill="${fillColor}" d="M345.2258,154.4092l48.3546-48.3545c-27.9454-11.4647-66.4618-19.5342-120.1795-19.5342-89.0889,0-161.3097,42.386-161.3097,94.6717,0,42.9558,48.746,79.2298,115.544,90.8075l-25.3316,25.3315c-70.0282-30.953-146.837-2.3193-146.837,36.843,0,22.8683,26.1903,42.1465,61.9273,48.0667l-26.7324,26.7323c19.373,6.3267,39.5785,8.5061,61.4075,8.5061,46.9944,0,85.0908-22.3587,85.0908-49.9394,0-14.8649-11.0703-28.2104-28.6316-37.3587,23.3335,5.528,51.8043,8.9352,86.6953,8.9352,89.0889,0,161.3096-42.3859,161.3096-94.6717,0-42.0424-46.6949-77.684-111.3075-90.0356ZM146.3564,377.3511c-35.0264,0-63.4209-12.9627-63.4209-28.953,0-15.9903,28.3945-28.953,63.4209-28.953,35.0264,0,63.4209,12.9627,63.4209,28.953,0,15.9903-28.3945,28.953-63.4209,28.953ZM285.7908,268.8329c-67.5146,0-122.2461-25.1023-122.2461-56.0678,0-30.9653,54.7315-56.0677,122.2461-56.0677,67.5147,0,122.246,25.1024,122.246,56.0678,0,30.9654-54.7314,56.0677-122.2461,56.0677Z"/>
      </svg>`;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, size, size);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve('');
        }
      };
      img.onerror = () => resolve('');
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    } catch {
      resolve('');
    }
  });
};

  // PDF Export loading state & Notice
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfNotice, setPdfNotice] = useState<{ type: 'success' | 'error'; message: string; url?: string } | null>(null);

  // Vector PDF export via jsPDF (100% reliable, zero DOM dependencies or oklch color parsing errors)
  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    setPdfNotice(null);

    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 297;
      const pageHeight = 210;

      // Theme color definitions [R, G, B]
      let bgColor = [10, 15, 29]; // Slate Platinum
      let borderColor = [148, 163, 184]; // Platinum Slate
      let titleColor = [248, 250, 252]; // Pure Platinum White
      let textColor = [255, 255, 255];
      let subTextColor = [148, 163, 184];
      let accentColor = [56, 189, 248]; // Sky Ice
      let editionLabel = 'PLATINUM EDITION';
      let headerLogoColor = '#38bdf8'; // Bright Cyan-Sky
      let watermarkLogoColor = 'rgba(56, 189, 248, 0.12)';

      if (certificateTheme === 'GOLD') {
        bgColor = [14, 9, 0];
        borderColor = [252, 211, 77];
        titleColor = [254, 240, 138];
        textColor = [255, 255, 255];
        subTextColor = [180, 130, 30];
        accentColor = [252, 211, 77];
        editionLabel = 'GOLD EDITION';
        headerLogoColor = '#fcd34d';
        watermarkLogoColor = 'rgba(252,211,77,0.10)';
      } else if (certificateTheme === 'SILVER') {
        bgColor = [11, 17, 32];
        borderColor = [203, 213, 225];
        titleColor = [241, 245, 249];
        textColor = [255, 255, 255];
        subTextColor = [148, 163, 184];
        accentColor = [226, 232, 240];
        editionLabel = 'SILVER EDITION';
        headerLogoColor = '#e2e8f0';
        watermarkLogoColor = 'rgba(203,213,225,0.10)';
      } else if (certificateTheme === 'BRONZE') {
        bgColor = [21, 8, 0];
        borderColor = [217, 119, 6];
        titleColor = [254, 215, 170];
        textColor = [255, 255, 255];
        subTextColor = [180, 90, 20];
        accentColor = [251, 146, 60];
        editionLabel = 'BRONZE EDITION';
        headerLogoColor = '#f97316';
        watermarkLogoColor = 'rgba(217,119,6,0.10)';
      }

      // ── 1. Background Fill ──
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // ── 2. Left vertical accent bar ──
      doc.setFillColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.rect(0, 0, 5, pageHeight, 'F');

      // ── 3. Top accent stripe ──
      doc.setFillColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.rect(5, 0, pageWidth - 5, 4, 'F');

      // ── 4. Event banner strip (just below top stripe) ──
      const bannerBg = [bgColor[0] + 8, bgColor[1] + 8, bgColor[2] + 8].map(v => Math.min(255, v));
      doc.setFillColor(bannerBg[0], bannerBg[1], bannerBg[2]);
      doc.rect(5, 4, pageWidth - 5, 10, 'F');
      // Event text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.text('ADIPEC 2026  |  ABU DHABI, UAE  |  HALL 12  |  STAND #12610', pageWidth / 2 + 2.5, 10.5, { align: 'center' });

      // ── 5. Outer border frame ──
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(0.9);
      doc.rect(9, 16, pageWidth - 14, pageHeight - 22);

      // ── 6. Inner dashed border ──
      doc.setLineWidth(0.3);
      doc.setLineDashPattern([1.8, 1.8], 0);
      doc.rect(12, 19, pageWidth - 20, pageHeight - 28);
      doc.setLineDashPattern([], 0);

      // ── 7. Corner L-brackets — all 4 consistently 4mm inset from outer border ──
      // Outer border: left=9, right=pageWidth-5(292), top=16, bottom=pageHeight-6(204)
      const inset = 4; const arm = 12;
      const bL = 9 + inset;          // 13
      const bR = pageWidth - 5 - inset; // 288
      const bT = 16 + inset;         // 20
      const bB = pageHeight - 6 - inset; // 200
      const drawCorner = (x: number, y: number, dx: number, dy: number) => {
        doc.setLineWidth(1.4);
        doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
        doc.line(x, y, x + dx, y);
        doc.line(x, y, x, y + dy);
      };
      drawCorner(bL, bT,  arm,  arm);
      drawCorner(bR, bT, -arm,  arm);
      drawCorner(bL, bB,  arm, -arm);
      drawCorner(bR, bB, -arm, -arm);

      // ── 8. Watermark logo ──
      try {
        const watermarkPng = await createSvgLogoPng(watermarkLogoColor, 512);
        if (watermarkPng) {
          const wmSize = 90;
          doc.addImage(watermarkPng, 'PNG', (pageWidth - wmSize) / 2, (pageHeight - wmSize) / 2, wmSize, wmSize);
        }
      } catch (e) { console.warn('Watermark note:', e); }

      // ── 9. Header: Logo left + OCTAVE text ──
      try {
        const headerLogoPng = await createSvgLogoPng(headerLogoColor, 512);
        if (headerLogoPng) {
          doc.addImage(headerLogoPng, 'PNG', 18, 22, 12, 12);
        }
      } catch (e) { console.warn('Header logo note:', e); }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.text('OCTAVE', 33, 31);

      // ── 10. Tier badge (top right) ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.text(`[ ${editionLabel} ]`, pageWidth - 18, 31, { align: 'right' });

      // ── 11. Decorative separator below header ──
      doc.setDrawColor(subTextColor[0], subTextColor[1], subTextColor[2]);
      doc.setLineWidth(0.25);
      doc.line(16, 37, pageWidth - 11, 37);

      // ── 12. Certificate Title ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
      doc.text('CERTIFICATE OF APPRECIATION', pageWidth / 2 + 2.5, 50, { align: 'center' });

      // ── 13. Subtitle ──
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2]);
      doc.text('PRESENTED FOR VISITING OUR BOOTH & HAVING A CONVERSATION WITH US', pageWidth / 2 + 2.5, 57, { align: 'center' });

      // ── 14. Ornamental separator ──
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(0.3);
      doc.line(55, 62, pageWidth / 2 - 8, 62);
      doc.line(pageWidth / 2 + 8, 62, pageWidth - 50, 62);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.text('*', pageWidth / 2 + 2.5, 63.5, { align: 'center' });

      // ── 15. Presented to ──
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2]);
      doc.text('THIS CERTIFICATE IS PROUDLY PRESENTED TO', pageWidth / 2 + 2.5, 71, { align: 'center' });

      // ── 16. Company Name ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(companyName || 'Valued Visitor', pageWidth / 2 + 2.5, 84, { align: 'center' });

      // ── 17. Visitor Name & Role ──
      if (visitorName) {
        doc.setFontSize(12);
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        const leadLabel = `${visitorName}${visitorTitle ? `  |  ${visitorTitle}` : ''}`;
        doc.text(leadLabel, pageWidth / 2 + 2.5, 93, { align: 'center' });
      }

      // ── 17b. Email ──
      let currentY = 98;
      if (visitorEmail) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2]);
        doc.text(visitorEmail, pageWidth / 2 + 2.5, currentY, { align: 'center' });
        currentY += 6;
      }

      // ── 19. Quote separator line ──
      doc.setLineWidth(0.25);
      doc.setDrawColor(subTextColor[0], subTextColor[1], subTextColor[2]);
      doc.line(40, currentY + 2, pageWidth - 35, currentY + 2);
      currentY += 8;

      // ── 20. Quote message ──
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      const quoteStr = `"${personalNote || 'Thank you for visiting our booth and taking the time to have an insightful conversation with our team!'}"`;
      const splitQuote = doc.splitTextToSize(quoteStr, pageWidth - 80);
      doc.text(splitQuote, pageWidth / 2 + 2.5, currentY, { align: 'center' });

      // ── 21. Footer area ──
      const footerY = pageHeight - 28;
      doc.setLineWidth(0.25);
      doc.setDrawColor(subTextColor[0], subTextColor[1], subTextColor[2]);
      doc.line(16, footerY - 6, pageWidth - 11, footerY - 6);

      // Left: Date & Venue
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2]);
      doc.text('DATE & VENUE', 20, footerY);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(formattedDateDisplay, 20, footerY + 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2]);
      doc.text(boothLocation, 20, footerY + 9.5);

      // Center: Multi-ring official seal
      const sealX = pageWidth / 2 + 2.5;
      const sealY = footerY + 6;
      const sealR = 11;
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(0.8);
      doc.circle(sealX, sealY, sealR);
      doc.setLineWidth(0.3);
      doc.circle(sealX, sealY, sealR - 2);
      doc.setLineDashPattern([1, 1], 0);
      doc.circle(sealX, sealY, sealR - 4);
      doc.setLineDashPattern([], 0);
      // Seal logo
      try {
        const sealLogoPng = await createSvgLogoPng(headerLogoColor, 256);
        if (sealLogoPng) {
          const sl = 9;
          doc.addImage(sealLogoPng, 'PNG', sealX - sl / 2, sealY - sl / 2, sl, sl);
        }
      } catch (e) { /* silent */ }
      // REF — outside bottom-right corner (below outer border at y≈204, page ends at 210)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.setTextColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.text(`REF: ${certificateId}`, pageWidth - 10, 207, { align: 'right' });

      // Right: Signature
      const sigX = pageWidth - 16;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(11);
      doc.setTextColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.text('Octave Executive Team', sigX, footerY + 3, { align: 'right' });
      doc.setLineWidth(0.3);
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.line(sigX - 55, footerY + 5, sigX, footerY + 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2]);
      doc.text('SENIOR VICE PRESIDENT', sigX, footerY + 10, { align: 'right' });
      doc.text('OCTAVE INTELLIGENCE PLC', sigX, footerY + 14.5, { align: 'right' });

      // Output & Download
      const filename = `Octave_Certificate_${certificateId}.pdf`;
      doc.save(filename);

      // Generate Blob URL as fallback viewer
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);

      setPdfNotice({
        type: 'success',
        message: `Certificate PDF (${certificateId}) generated successfully!`,
        url: blobUrl
      });
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback: create canvas print or window print
      try {
        if (certificateRef.current) {
          const canvas = await html2canvas(certificateRef.current, { scale: 1.5, logging: false });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
          pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
          pdf.save(`Octave_Certificate_${certificateId}.pdf`);
          const blobUrl = URL.createObjectURL(pdf.output('blob'));
          setPdfNotice({
            type: 'success',
            message: `Certificate PDF generated successfully!`,
            url: blobUrl
          });
          return;
        }
      } catch (fallbackErr) {
        console.error('Fallback canvas error:', fallbackErr);
      }
      window.print();
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Format Date for Certificate
  const formattedDateDisplay = React.useMemo(() => {
    if (!visitDate) return 'July 26, 2026';
    const d = new Date(visitDate);
    if (isNaN(d.getTime())) return visitDate;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [visitDate]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 select-none">
      
      {/* Printable CSS Rules for A4 Landscape Export */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #app-root, #brand-ribbon, #workspace-sidebar, #app-footer, .no-print {
            display: none !important;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible !important;
          }
          #printable-certificate {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-sky-950/80 via-neutral-900 to-amber-950/80 border border-white/10 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5">
                <Icons.Sparkles className="w-3.5 h-3.5" />
                Booth Visitor Appreciation
              </span>
              <span className="px-2.5 py-1 bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-[10px] font-bold rounded-full flex items-center gap-1">
                <Icons.Clock className="w-3 h-3 text-red-400" />
                Approval Pending (Emailed Upon Approval)
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Thank You For Visiting Us
            </h1>
            <p className="text-sm text-neutral-300 max-w-xl leading-relaxed">
              Simple visitor certificate creation for guests who stopped by our booth and had a conversation with our team.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 no-print">
            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/50 text-black font-extrabold rounded-xl text-xs font-mono transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              {isExportingPDF ? (
                <Icons.Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Icons.Download className="w-4 h-4" />
              )}
              {isExportingPDF ? 'Generating PDF...' : 'Export Certificate (PDF)'}
            </button>
          </div>
        </div>

        {pdfNotice && (
          <div className={`mt-4 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono transition-all animate-fadeIn ${
            pdfNotice.type === 'success' ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
          }`}>
            <div className="flex items-center gap-2.5">
              <Icons.CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{pdfNotice.message}</span>
            </div>
            {pdfNotice.url && (
              <a
                href={pdfNotice.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold rounded-lg text-xs font-mono transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
              >
                <Icons.ExternalLink className="w-4 h-4" />
                Open / View PDF
              </a>
            )}
          </div>
        )}
      </div>

      {/* 2. Main Two-Column View: Simple Visitor Form (Col 5) & Certificate Preview (Col 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: Simplified Visitor Form (Col 5) */}
        <div className="lg:col-span-5 bg-[#0c0c10] border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl no-print">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Icons.UserCheck className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-extrabold text-white">Visitor Information</h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 bg-black/60 px-2.5 py-1 rounded-md border border-white/5">
              ID: {certificateId}
            </span>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 pt-1">

            {/* Company */}
            <div>
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                Company / Organization Name
              </label>
              <div className="relative">
                <Icons.Building2 className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Company Name"
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-all font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                  Visitor Name *
                </label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="e.g. Ali Ibrahim"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                  Title / Role
                </label>
                <input
                  type="text"
                  value={visitorTitle}
                  onChange={(e) => setVisitorTitle(e.target.value)}
                  placeholder="e.g. Presales"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 font-semibold"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                Email Address
                <span className="text-neutral-500 ml-1 normal-case font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Icons.Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  placeholder="e.g. ali.ibrahim@example.com"
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-all font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                  Booth / Exhibition Location
                </label>
                <input
                  type="text"
                  value={boothLocation}
                  onChange={(e) => setBoothLocation(e.target.value)}
                  placeholder="e.g. Octave - ADIPEC Hall 12 - Stand #12610"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                  Visit Date
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Simple Thanks Message Textarea */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
              Booth Visit Conversation Message
            </label>
            <textarea
              rows={3}
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="Thank you for visiting our booth and having a conversation with us..."
              className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-all leading-relaxed"
            />
          </div>

          {/* Certificate Theme Choice: Platinum, Gold, Silver, Bronze */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
              <span>Certificate Tier Theme</span>
              <span className="text-[10px] text-amber-400 font-normal">Platinum • Gold • Silver • Bronze</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* PLATINUM */}
              <button
                type="button"
                onClick={() => setCertificateTheme('PLATINUM')}
                className={`p-2.5 rounded-xl border text-[11px] font-extrabold transition-all text-center cursor-pointer flex flex-col items-center gap-1 ${
                  certificateTheme === 'PLATINUM'
                    ? 'bg-gradient-to-b from-sky-950/80 to-slate-900 border-sky-400 text-sky-200 shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/50'
                    : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icons.Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Platinum</span>
                </div>
                <span className="text-[9px] font-mono font-normal opacity-70">Ice Slate</span>
              </button>

              {/* GOLD */}
              <button
                type="button"
                onClick={() => setCertificateTheme('GOLD')}
                className={`p-2.5 rounded-xl border text-[11px] font-extrabold transition-all text-center cursor-pointer flex flex-col items-center gap-1 ${
                  certificateTheme === 'GOLD'
                    ? 'bg-gradient-to-b from-amber-950/80 to-neutral-900 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/50'
                    : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icons.Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gold</span>
                </div>
                <span className="text-[9px] font-mono font-normal opacity-70">Obsidian Amber</span>
              </button>

              {/* SILVER */}
              <button
                type="button"
                onClick={() => setCertificateTheme('SILVER')}
                className={`p-2.5 rounded-xl border text-[11px] font-extrabold transition-all text-center cursor-pointer flex flex-col items-center gap-1 ${
                  certificateTheme === 'SILVER'
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-300 text-slate-100 shadow-lg shadow-slate-400/20 ring-1 ring-slate-300/50'
                    : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icons.Medal className="w-3.5 h-3.5 text-slate-300" />
                  <span>Silver</span>
                </div>
                <span className="text-[9px] font-mono font-normal opacity-70">Sterling Metallic</span>
              </button>

              {/* BRONZE */}
              <button
                type="button"
                onClick={() => setCertificateTheme('BRONZE')}
                className={`p-2.5 rounded-xl border text-[11px] font-extrabold transition-all text-center cursor-pointer flex flex-col items-center gap-1 ${
                  certificateTheme === 'BRONZE'
                    ? 'bg-gradient-to-b from-amber-950/90 via-orange-950/70 to-neutral-950 border-amber-600 text-amber-300 shadow-lg shadow-amber-600/20 ring-1 ring-amber-500/50'
                    : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icons.Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>Bronze</span>
                </div>
                <span className="text-[9px] font-mono font-normal opacity-70">Copper Antique</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Exportable Certificate (Col 7) */}
        <div className="lg:col-span-7 space-y-4">

          {/* Actions Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c0c10] border border-white/10 rounded-2xl p-4 no-print shadow-lg">
            <div className="flex items-center gap-2">
              <Icons.Award className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>Certificate Preview</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    certificateTheme === 'PLATINUM'
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : certificateTheme === 'GOLD'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : certificateTheme === 'SILVER'
                      ? 'bg-slate-400/20 border-slate-300 text-slate-200'
                      : 'bg-amber-600/20 border-amber-500 text-amber-300'
                  }`}>
                    {certificateTheme} TIER
                  </span>
                </h3>
                <p className="text-[10px] text-neutral-400">Ready for instant PDF print & export</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] sm:text-xs font-mono text-neutral-300 tracking-tight">
                Excited to see you at our booth!
              </span>
              <button
                onClick={handleExportPDF}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Icons.Download className="w-3.5 h-3.5" />
                Export PDF
              </button>
            </div>
          </div>

          {/* DYNAMIC CERTIFICATE FRAME — Premium Redesign */}
          {(() => {
            const ac = {
              PLATINUM: { accent: '#7dd3fc', accentDim: 'rgba(125,211,252,0.15)', border: 'border-sky-300',   borderDim: 'border-sky-300/25',   glow: 'shadow-sky-400/30',    bg: 'from-[#040c1e] via-[#071528] to-[#030a18]', titleGrad: 'from-white via-sky-100 to-sky-300',        nameTxt: 'text-sky-300',   badgeBg: 'bg-sky-400/10 border-sky-300/50 text-sky-100',   sealBg: 'border-sky-300 bg-sky-400/10 shadow-sky-400/40',   tag: 'bg-sky-950 border-sky-400/50 text-sky-200',   icon: 'text-sky-300' },
              GOLD:     { accent: '#fcd34d', accentDim: 'rgba(252,211,77,0.18)',  border: 'border-yellow-400', borderDim: 'border-yellow-400/30', glow: 'shadow-yellow-500/30', bg: 'from-[#0e0900] via-[#1a1100] to-[#080600]', titleGrad: 'from-yellow-100 via-amber-300 to-yellow-500', nameTxt: 'text-yellow-300', badgeBg: 'bg-yellow-400/10 border-yellow-400/50 text-yellow-100', sealBg: 'border-yellow-400 bg-yellow-400/10 shadow-yellow-500/40', tag: 'bg-amber-950 border-yellow-500/50 text-yellow-200', icon: 'text-yellow-400' },
              SILVER:   { accent: '#cbd5e1', accentDim: 'rgba(203,213,225,0.14)', border: 'border-slate-300',  borderDim: 'border-slate-300/25', glow: 'shadow-slate-300/20',  bg: 'from-[#0b1120] via-[#10192e] to-[#080d1a]', titleGrad: 'from-white via-slate-200 to-slate-400',    nameTxt: 'text-slate-200', badgeBg: 'bg-slate-300/10 border-slate-300/40 text-slate-100', sealBg: 'border-slate-300 bg-slate-300/10 shadow-slate-300/30', tag: 'bg-slate-900 border-slate-400/40 text-slate-200',   icon: 'text-slate-300' },
              BRONZE:   { accent: '#d97706', accentDim: 'rgba(217,119,6,0.18)',   border: 'border-amber-600',  borderDim: 'border-amber-600/30', glow: 'shadow-amber-700/30',  bg: 'from-[#150800] via-[#1f0f00] to-[#0d0500]', titleGrad: 'from-orange-100 via-amber-500 to-orange-600',  nameTxt: 'text-amber-400', badgeBg: 'bg-amber-700/15 border-amber-600/50 text-amber-100', sealBg: 'border-amber-600 bg-amber-700/15 shadow-amber-600/40', tag: 'bg-orange-950 border-amber-600/50 text-amber-200', icon: 'text-amber-500' },
            }[certificateTheme];
            return (
          <div
            id="printable-certificate"
            ref={certificateRef}
            className={`relative overflow-hidden rounded-2xl border-2 shadow-2xl bg-gradient-to-br ${ac.bg} ${ac.border} ${ac.glow}`}
          >
            {/* TOP ACCENT STRIPE */}
            <div className="absolute top-0 left-0 right-0 h-1.5 z-20" style={{ background: `linear-gradient(90deg, transparent, ${ac.accent}, transparent)` }} />

            {/* LEFT VERTICAL ACCENT BAR */}
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: `linear-gradient(180deg, transparent 5%, ${ac.accent} 30%, ${ac.accent} 70%, transparent 95%)` }} />

            {/* INNER DASHED BORDER */}
            <div className={`absolute inset-4 rounded-xl border border-dashed pointer-events-none ${ac.borderDim}`} />

            {/* CORNER BRACKETS — larger, more ornate */}
            {[['top-6 left-6','border-t-2 border-l-2'],['top-6 right-6','border-t-2 border-r-2'],['bottom-6 left-6','border-b-2 border-l-2'],['bottom-6 right-6','border-b-2 border-r-2']].map(([pos, cls]) => (
              <div key={pos} className={`absolute ${pos} w-7 h-7 pointer-events-none ${cls} ${ac.border} opacity-70`} />
            ))}

            {/* LARGE WATERMARK LOGO */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.06 }}>
              <OctaveLogo variant="icon-only" iconSize={380} markColor={ac.accent} />
            </div>

            {/* AMBIENT GLOW ORBS */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: ac.accentDim }} />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: ac.accentDim, opacity: 0.5 }} />

            {/* ═══════════════════ CERTIFICATE CONTENT ═══════════════════ */}
            <div className="relative z-10 px-10 py-8 flex flex-col gap-5">

              {/* ── ROW 1: Header — Logo left, Event badge right ── */}
              <div className="flex items-center justify-between">
                <OctaveLogo variant="full" iconSize={36} markColor={ac.accent} textColor={ac.nameTxt} />
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold tracking-widest uppercase ${ac.tag}`}>
                  <Icons.MapPin className={`w-3 h-3 ${ac.icon}`} />
                  ADIPEC 2026 &nbsp;·&nbsp; HALL 12 &nbsp;·&nbsp; STAND #12610
                </div>
              </div>

              {/* ── ROW 2: Tier + Title ── */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(to right, transparent, ${ac.accent})` }} />
                  <span className={`text-[10px] font-mono font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full border ${ac.badgeBg}`}>
                    * &nbsp;{certificateTheme} CERTIFICATE &nbsp;*
                  </span>
                  <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(to left, transparent, ${ac.accent})` }} />
                </div>

                <h2 className={`text-3xl sm:text-[2.1rem] font-black uppercase tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r ${ac.titleGrad}`}>
                  Certificate of Appreciation
                </h2>
                <p className="text-[10px] font-mono tracking-[0.18em] uppercase text-neutral-500">
                  Presented for Visiting Our Booth &amp; Exhibition Conversation
                </p>
              </div>

              {/* ── ROW 3: Recipient ── */}
              <div className="text-center space-y-2 py-4 border-y" style={{ borderColor: `${ac.accentDim}` }}>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-500 block">
                  This Certificate Is Proudly Presented To
                </span>
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  {companyName || 'Valued Visitor'}
                </h3>
                {visitorName && (
                  <p className={`text-sm font-bold ${ac.nameTxt}`}>
                    {visitorName}
                    {visitorTitle ? ` — ${visitorTitle}` : ''}
                  </p>
                )}
                {visitorEmail && (
                  <p className="text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-1">
                    <Icons.Mail className="w-3 h-3" />{visitorEmail}
                  </p>
                )}
              </div>

              {/* ── ROW 4: Quote ── */}
              <div className="text-center max-w-2xl mx-auto">
                <p className="text-sm italic font-serif leading-relaxed text-neutral-300">
                  <span className={`text-2xl leading-none font-serif mr-1 ${ac.nameTxt}`}>"</span>
                  {personalNote || 'Thank you for visiting our booth and taking the time to have an insightful conversation with our team!'}
                  <span className={`text-2xl leading-none font-serif ml-1 ${ac.nameTxt}`}>"</span>
                </p>
              </div>

              {/* ── ROW 5: Footer ── */}
              <div className="pt-4 border-t border-white/8 grid grid-cols-3 gap-4 items-center">

                {/* Left: Date & Venue */}
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 block">Date &amp; Venue</span>
                  <p className="text-xs font-extrabold text-white">{formattedDateDisplay}</p>
                  <p className="text-[10px] font-mono text-neutral-500 truncate">{boothLocation}</p>
                </div>

                {/* Center: Premium Seal */}
                <div className="flex flex-col items-center gap-1">
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-lg ${ac.sealBg}`}>
                    <div className={`absolute inset-1.5 rounded-full border border-dashed ${ac.borderDim}`} />
                    <OctaveLogo variant="icon-only" iconSize={28} markColor={ac.accent} />
                  </div>
                  <span className={`text-[9px] font-mono tracking-wider font-bold ${ac.icon}`}>
                    {certificateId}
                  </span>
                </div>

                {/* Right: Signature */}
                <div className="text-right space-y-0.5">
                  <div className={`text-sm font-serif italic font-bold pb-0.5 border-b inline-block ${ac.nameTxt}`}
                    style={{ borderColor: ac.accent + '50' }}>
                    Octave Executive Team
                  </div>
                  <p className="text-[9px] font-mono uppercase text-neutral-500">Senior Vice President</p>
                  <p className="text-[9px] font-mono uppercase text-neutral-600">Octave Intelligence PLC</p>
                </div>

              </div>
            </div>
          </div>
            );
          })()}

        </div>

      </div>

    </div>
  );
}
