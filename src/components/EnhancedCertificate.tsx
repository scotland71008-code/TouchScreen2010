import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CertificateData, TIER_CONFIGS, QUIZ_TOPICS } from '../types/certificate';

interface EnhancedCertificateProps {
  certificateData: CertificateData;
  onClose?: () => void;
}

export default function EnhancedCertificate({ certificateData, onClose }: EnhancedCertificateProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const certificateRef = React.useRef<HTMLDivElement>(null);

  const tierConfig = TIER_CONFIGS[certificateData.tier];
  const topicConfig = QUIZ_TOPICS[certificateData.quizTopic];

  // Export to PDF
  const exportToPDF = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#fff',
        logging: false
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.save(`Octave_Certificate_${certificateData.certificateId}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export certificate');
    } finally {
      setIsExporting(false);
    }
  };

  // Export as PNG
  const exportToPNG = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#fff',
        logging: false
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `Octave_Certificate_${certificateData.certificateId}.png`;
      link.click();
    } catch (error) {
      console.error('PNG export failed:', error);
      alert('Failed to export certificate');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/50 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
            <Icons.Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Certificate of Achievement</h2>
            <p className="text-xs text-neutral-400 font-mono">{certificateData.certificateId}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Icons.FileDown className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </button>
          <button
            onClick={exportToPNG}
            disabled={isExporting}
            className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Icons.Image className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Download PNG'}
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Icons.Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* ===== MAIN CERTIFICATE ===== */}
      <div ref={certificateRef} className="w-full bg-white text-slate-900 p-12 rounded-2xl shadow-2xl" style={{ aspectRatio: '1.4 / 1' }}>

        {/* Certificate Border */}
        <div className="w-full h-full border-8 rounded-xl p-8 flex flex-col justify-between" style={{ borderColor: tierConfig.color }}>

          {/* Top Section: Header */}
          <div className="flex flex-col items-center gap-2 border-b-2 pb-6" style={{ borderColor: tierConfig.color }}>
            <div className="text-4xl font-black" style={{ color: tierConfig.color }}>
              {tierConfig.badgeEmoji} OCTAVE ENTERPRISE
            </div>
            <div className="text-xl font-bold text-slate-700">CERTIFICATE OF ACHIEVEMENT</div>
            <div className="text-xs font-mono text-slate-500 mt-1">{certificateData.certificateVersion}</div>
          </div>

          {/* Middle Section: Award Details */}
          <div className="flex flex-col items-center gap-4 my-6">
            <div className="text-center">
              <div className="text-3xl font-black mb-2" style={{ color: tierConfig.color }}>
                {tierConfig.title}
              </div>
              <div className="text-sm font-semibold text-slate-600">
                {topicConfig.displayName}
              </div>
            </div>

            {/* Recipient */}
            <div className="text-center">
              <div className="text-xs font-mono text-slate-500 mb-1">AWARDED TO</div>
              <div className="text-2xl font-black text-slate-800">
                {certificateData.recipientFirstName} {certificateData.recipientLastName}
              </div>
              <div className="text-sm text-slate-600">{certificateData.recipientJobTitle}</div>
              <div className="text-xs text-slate-500">{certificateData.recipientCompany}</div>
            </div>

            {/* Performance Summary */}
            <div className="flex gap-8 justify-center mt-2">
              <div className="text-center">
                <div className="text-3xl font-black" style={{ color: tierConfig.color }}>
                  {certificateData.percentage}%
                </div>
                <div className="text-[10px] font-mono text-slate-500">SCORE</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-slate-700">
                  {certificateData.performancePercentile}
                </div>
                <div className="text-[10px] font-mono text-slate-500">PERCENTILE</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-slate-700">
                  {certificateData.correctAnswers}/{certificateData.totalQuestions}
                </div>
                <div className="text-[10px] font-mono text-slate-500">CORRECT</div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Certificate Details */}
          <div className="grid grid-cols-4 gap-4 text-[9px] border-t pt-4" style={{ borderColor: tierConfig.color }}>
            <div>
              <div className="font-mono font-bold text-slate-700">ISSUED</div>
              <div>{certificateData.issueDate}</div>
            </div>
            <div>
              <div className="font-mono font-bold text-slate-700">EXPIRES</div>
              <div>{certificateData.expiryDate}</div>
            </div>
            <div>
              <div className="font-mono font-bold text-slate-700">CERTIFICATE ID</div>
              <div className="font-mono">{certificateData.certificateId}</div>
            </div>
            <div>
              <div className="font-mono font-bold text-slate-700">VERIFICATION</div>
              <div className="font-mono">{certificateData.verificationCode}</div>
            </div>
          </div>

          {/* Signature Line */}
          <div className="flex justify-between items-end">
            <div className="text-center">
              <div className="w-24 h-1 border-t-2 border-slate-400 mb-1"></div>
              <div className="text-[9px] font-mono font-bold">{certificateData.endorsedBy}</div>
              <div className="text-[8px] text-slate-600">{certificateData.issuedBy}</div>
            </div>
            <div className="text-right text-[8px] text-slate-500 font-mono">
              Verify at: {certificateData.verificationUrl.split('/').pop()}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Card */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <button
          onClick={() => setShowFullDetails(!showFullDetails)}
          className="flex items-center justify-between w-full cursor-pointer"
        >
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Icons.BarChart3 className="w-5 h-5 text-sky-400" />
            Detailed Performance Metrics
          </h3>
          <Icons.ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform ${showFullDetails ? 'rotate-180' : ''}`} />
        </button>

        {showFullDetails && (
          <div className="mt-6 space-y-6">
            {/* Category Breakdown */}
            <div>
              <h4 className="text-sm font-bold text-sky-400 mb-3">CATEGORY PERFORMANCE</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {certificateData.categoryPerformance.map((cat, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#0f1729] border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{cat.category}</span>
                      <span className="text-sm font-bold text-sky-400">{cat.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-sky-500 h-2 rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Areas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-bold text-emerald-400 mb-2">STRENGTHS</h4>
                <ul className="space-y-1">
                  {certificateData.strengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-neutral-300 flex items-center gap-2">
                      <Icons.CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {str}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-400 mb-2">IMPROVEMENT AREAS</h4>
                <ul className="space-y-1">
                  {certificateData.improvementAreas.map((area, idx) => (
                    <li key={idx} className="text-xs text-neutral-300 flex items-center gap-2">
                      <Icons.AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-[#0f1729]">
              <div>
                <div className="text-[10px] font-mono text-neutral-500">TIME TAKEN</div>
                <div className="text-lg font-bold text-white">{certificateData.timeSpentFormatted}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-neutral-500">ATTEMPT</div>
                <div className="text-lg font-bold text-white">#{certificateData.quizAttemptNumber}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-neutral-500">STATUS</div>
                <div className={`text-lg font-bold ${
                  certificateData.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {certificateData.status}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
