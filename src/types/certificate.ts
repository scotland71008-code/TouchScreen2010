// Enhanced Certificate Data Structure with 20+ Fields

export type CertificateTier = 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE';
export type QuizTopic = 'INFORMATION_MGMT' | 'DESIGN_TOOLS' | 'CYBERSECURITY' | 'OPERATIONS' | 'ARCHITECTURE';

export interface CategoryPerformance {
  category: string;
  icon: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'EXCELLENT' | 'STRONG' | 'GOOD' | 'PASSING';
}

export interface CertificateData {
  // === 1. CERTIFICATE IDENTITY ===
  certificateId: string;               // Unique serial: OCT-2026-000487
  certificateVersion: string;           // v1.0
  issuingAuthority: string;             // Octave Enterprise Certification Board

  // === 2. RECIPIENT INFORMATION ===
  recipientFirstName: string;
  recipientLastName: string;
  recipientEmail: string;
  recipientCompany: string;
  recipientJobTitle: string;
  recipientDepartment: string;

  // === 3. QUIZ DETAILS ===
  quizTopic: QuizTopic;                 // Selected specialization
  topicDisplayName: string;             // "Information Management Architect"
  totalQuestions: number;
  correctAnswers: number;

  // === 4. SCORING ===
  score: number;                        // Raw score (e.g., 87)
  maxScore: number;                     // Out of (100)
  percentage: number;                   // 87%
  passingPercentage: number;            // 60%

  // === 5. PERFORMANCE METRICS ===
  categoryPerformance: CategoryPerformance[];  // Per-category breakdown
  strengths: string[];                  // Top 3 strong categories
  improvementAreas: string[];           // Categories needing work
  performancePercentile: number;        // 78th percentile

  // === 6. CERTIFICATION TIER ===
  tier: CertificateTier;
  tierTitle: string;                    // "GOLD CERTIFIED ARCHITECT"
  tierDescription: string;              // "Demonstrates strong understanding..."
  tierColor: string;                    // hex code for tier

  // === 7. TIMESTAMPS ===
  issueDate: string;                    // "2026-09-13"
  expiryDate?: string;                  // Optional - not used (no expiry)
  validityPeriodMonths?: number;        // Optional - not used (no expiry)

  // === 8. QUIZ METADATA ===
  quizAttemptNumber: number;            // 1st attempt, 2nd attempt, etc.
  timeSpentSeconds: number;             // Total time taken
  timeSpentFormatted: string;           // "12 min 34 sec"

  // === 9. SECURITY & VERIFICATION ===
  verificationCode: string;             // 6-digit code for manual verification
  qrCodeUrl: string;                    // QR code data/URL
  digitalSignature: string;             // Cryptographic signature
  verificationUrl: string;              // https://octave.com/verify/OCT-2026-000487

  // === 10. ORGANIZATION INFO ===
  issuedBy: string;                     // "Octave Enterprise"
  issuedByOffice: string;               // "Huntsville Global Headquarters"
  endorsedBy: string;                   // "Chief Architect, Octave"
  referenceNumber: string;              // Batch/Run number

  // === 11. CREDENTIAL STATUS ===
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'PENDING';
  renewalEligibilityDate?: string;      // When they can retake
  renewalStatus: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'RENEWED';

  // === 12. ADDITIONAL METADATA ===
  certificateLanguage: string;          // "en-US"
  printableFormat: 'PDF' | 'PNG' | 'BOTH';
  sharingEnabled: boolean;
  publiclyVisible: boolean;             // For portfolio/LinkedIn
}

// Certificate Tier Definitions
export const TIER_CONFIGS: Record<CertificateTier, {
  minScore: number;
  title: string;
  description: string;
  color: string;
  icon: string;
  badgeEmoji: string;
}> = {
  PLATINUM: {
    minScore: 100,
    title: 'PLATINUM ARCHITECT',
    description: 'Perfect 100% mastery of Octave enterprise portfolio with elite distinction.',
    color: '#0284c7', // Distinct platinum-cyan sheen (#E5E4E2 / #38BDF8)
    icon: 'Crown',
    badgeEmoji: '💎'
  },
  GOLD: {
    minScore: 90,
    title: 'GOLD ARCHITECT',
    description: 'Advanced comprehensive knowledge (90%+) across all Octave solutions and integrations.',
    color: '#FFD700',
    icon: 'Award',
    badgeEmoji: '🥇'
  },
  SILVER: {
    minScore: 80,
    title: 'SILVER ARCHITECT',
    description: 'Solid understanding (80%+) of core Octave capabilities and architecture patterns.',
    color: '#94A3B8',
    icon: 'CheckCircle',
    badgeEmoji: '🥈'
  },
  BRONZE: {
    minScore: 70,
    title: 'BRONZE ARCHITECT',
    description: 'Foundational knowledge (70%+) of Octave ecosystem and enterprise architecture.',
    color: '#CD7F32',
    icon: 'Badge',
    badgeEmoji: '🥉'
  }
};

// Quiz Topic Configurations
export const QUIZ_TOPICS: Record<QuizTopic, {
  displayName: string;
  description: string;
  icon: string;
  color: string;
  focusAreas: string[];
}> = {
  INFORMATION_MGMT: {
    displayName: 'Information Management Specialist',
    description: 'Master data integration, digital twins, and enterprise information backbone',
    icon: 'Database',
    color: '#0284C7',
    focusAreas: ['InConcert', 'Data Bridge', 'Tag Management', 'CFIHOS Standards']
  },
  DESIGN_TOOLS: {
    displayName: 'Design & Engineering Expert',
    description: 'Advanced 3D modeling, P&ID design, and engineering analysis',
    icon: 'Box',
    color: '#7C3AED',
    focusAreas: ['Forte 3D', 'Facets 2D', 'Aspect Analysis', 'CAESAR II Integration']
  },
  CYBERSECURITY: {
    displayName: 'OT Security & Compliance Architect',
    description: 'Industrial cybersecurity, vulnerability management, and threat mitigation',
    icon: 'ShieldAlert',
    color: '#DC2626',
    focusAreas: ['Cyber Integrity', 'IEC 62443', 'SCADA Defense', 'Zero-Trust Architecture']
  },
  OPERATIONS: {
    displayName: 'Operations & Maintenance Professional',
    description: 'Predictive maintenance, shift management, and operational excellence',
    icon: 'Gauge',
    color: '#16A34A',
    focusAreas: ['Alto Visualizer', 'Tempo Operations', 'AssetSense APM', 'Handover Management']
  },
  ARCHITECTURE: {
    displayName: 'Enterprise Architecture Master',
    description: 'Complete ecosystem integration and enterprise-wide solution design',
    icon: 'Layers',
    color: '#EA580C',
    focusAreas: ['Full Portfolio', 'Integration Patterns', 'Legacy Mapping', 'Strategic Vision']
  }
};
