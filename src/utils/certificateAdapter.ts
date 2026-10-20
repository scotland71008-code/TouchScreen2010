// Certificate Adapter: Bridge existing ThankYouVisiting with new 42-field system

import { CertificateData, CertificateTier, QuizTopic, TIER_CONFIGS } from '../types/certificate';

/**
 * Generate unique Certificate ID
 * Format: OCT-YYYY-XXXXX (e.g., OCT-2026-000487)
 */
export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `OCT-${year}-${random}`;
}

/**
 * Generate 6-digit verification code
 */
export function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Determine certificate tier based on percentage score
 */
export function determineTier(percentage: number): CertificateTier {
  if (percentage >= 100) return 'PLATINUM';
  if (percentage >= 90) return 'GOLD';
  if (percentage >= 80) return 'SILVER';
  return 'BRONZE';
}

/**
 * Calculate performance metrics from quiz data
 */
export interface QuizData {
  correctAnswers: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  categoryScores: { category: string; score: number; maxScore: number }[];
  topic: QuizTopic;
}

export interface VisitorData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  department?: string;
  boothLocation?: string;
  visitDate?: string;
}

/**
 * Build complete CertificateData from quiz + visitor info
 */
export function buildCertificateData(
  visitorData: VisitorData,
  quizData: QuizData,
  additionalNote?: string
): CertificateData {
  const certificateId = generateCertificateId();
  const verificationCode = generateVerificationCode();

  const percentage = Math.round((quizData.correctAnswers / quizData.totalQuestions) * 100);
  const tier = determineTier(percentage);
  const tierConfig = TIER_CONFIGS[tier];

  // Calculate category performance
  const categoryPerformance = quizData.categoryScores.map(cat => ({
    category: cat.category,
    icon: 'CheckCircle',
    score: cat.score,
    maxScore: cat.maxScore,
    percentage: Math.round((cat.score / cat.maxScore) * 100),
    status: (
      (cat.score / cat.maxScore) >= 0.9 ? 'EXCELLENT' :
      (cat.score / cat.maxScore) >= 0.8 ? 'STRONG' :
      (cat.score / cat.maxScore) >= 0.7 ? 'GOOD' : 'PASSING'
    ) as 'EXCELLENT' | 'STRONG' | 'GOOD' | 'PASSING'
  }));

  // Identify strengths (top 3 categories)
  const strengths = categoryPerformance
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3)
    .map(c => `${c.category} (${c.percentage}%)`);

  // Identify improvement areas (lower 2 categories)
  const improvementAreas = categoryPerformance
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 2)
    .map(c => `${c.category} (${c.percentage}%)`);

  // Calculate percentile (simplified: based on score)
  const percentile = Math.min(99, Math.round((percentage / 100) * 99));

  // Calculate expiry date
  const issueDate = new Date();
  const expiryDate = new Date(issueDate);
  expiryDate.setMonth(expiryDate.getMonth() + 12);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return {
    // Group 1: Certificate Identity
    certificateId,
    certificateVersion: 'v1.0',
    issuingAuthority: 'Octave Enterprise Certification Board',

    // Group 2: Recipient Information
    recipientFirstName: visitorData.firstName,
    recipientLastName: visitorData.lastName,
    recipientEmail: visitorData.email,
    recipientCompany: visitorData.company,
    recipientJobTitle: visitorData.jobTitle,
    recipientDepartment: visitorData.department || 'Enterprise Solutions',

    // Group 3: Quiz Details
    quizTopic: quizData.topic,
    topicDisplayName: getTopicDisplayName(quizData.topic),
    totalQuestions: quizData.totalQuestions,
    correctAnswers: quizData.correctAnswers,

    // Group 4: Scoring
    score: percentage,
    maxScore: 100,
    percentage,
    passingPercentage: 70,

    // Group 5: Performance Metrics
    categoryPerformance,
    strengths,
    improvementAreas,
    performancePercentile: percentile,

    // Group 6: Certification Tier
    tier,
    tierTitle: tierConfig.title,
    tierDescription: tierConfig.description,
    tierColor: tierConfig.color,

    // Group 7: Timestamps
    issueDate: formatDate(issueDate),
    expiryDate: formatDate(expiryDate),
    validityPeriodMonths: 12,

    // Group 8: Quiz Metadata
    quizAttemptNumber: 1,
    timeSpentSeconds: quizData.timeSpentSeconds,
    timeSpentFormatted: formatSeconds(quizData.timeSpentSeconds),

    // Group 9: Security & Verification
    verificationCode,
    qrCodeUrl: `https://octave.com/verify/${certificateId}`,
    digitalSignature: generateDigitalSignature(certificateId),
    verificationUrl: `https://octave.com/verify/${certificateId}`,

    // Group 10: Organization Info
    issuedBy: 'Octave Enterprise',
    issuedByOffice: visitorData.boothLocation || 'Huntsville Global Headquarters',
    endorsedBy: 'Chief Architect, Octave',
    referenceNumber: `BATCH-${new Date().getFullYear()}-${formatDate(issueDate).substring(5, 7)}-001`,

    // Group 11: Credential Status
    status: 'ACTIVE',
    renewalEligibilityDate: formatDate(expiryDate),
    renewalStatus: 'ELIGIBLE',

    // Group 12: Additional Metadata
    certificateLanguage: 'en-US',
    printableFormat: 'BOTH',
    sharingEnabled: true,
    publiclyVisible: true
  };
}

/**
 * Get display name for quiz topic
 */
function getTopicDisplayName(topic: QuizTopic): string {
  const topics: Record<QuizTopic, string> = {
    INFORMATION_MGMT: 'Information Management Specialist',
    DESIGN_TOOLS: 'Design & Engineering Expert',
    CYBERSECURITY: 'OT Security & Compliance Architect',
    OPERATIONS: 'Operations & Maintenance Professional',
    ARCHITECTURE: 'Enterprise Architecture Master'
  };
  return topics[topic] || 'Octave Professional';
}

/**
 * Format seconds to readable time string
 */
function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} min ${secs} sec`;
}

/**
 * Generate digital signature (mock - use real crypto in production)
 */
function generateDigitalSignature(certificateId: string): string {
  // In production, use real cryptographic signing
  return `sig_${certificateId}_${Date.now()}`.substring(0, 32);
}

/**
 * Convert existing ThankYouVisiting data to new certificate format
 */
export function convertThankYouToCertificate(
  visitorName: string,
  visitorTitle: string,
  companyName: string,
  quizScore?: { score: number; total: number },
  theme?: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE',
  certificateId?: string
): Partial<CertificateData> {
  const percentage = quizScore ? Math.round((quizScore.score / quizScore.total) * 100) : 75;
  const tier = theme || determineTier(percentage);
  const tierConfig = TIER_CONFIGS[tier];

  return {
    certificateId: certificateId || generateCertificateId(),
    verificationCode: generateVerificationCode(),
    recipientFirstName: visitorName.split(' ')[0] || 'Visitor',
    recipientLastName: visitorName.split(' ')[1] || '',
    recipientCompany: companyName,
    recipientJobTitle: visitorTitle,
    score: percentage,
    percentage,
    tier,
    tierTitle: tierConfig.title,
    tierColor: tierConfig.color,
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString().split('T')[0],
    status: 'ACTIVE'
  };
}
