// Certificate Configuration with Topic-Based Difficulty Levels

import { QuizTopic } from '../types/certificate';

export interface TopicConfig {
  displayName: string;
  description: string;
  icon: string;
  color: string;
  focusAreas: string[];
  difficulty: 'EASY' | 'MODERATE' | 'HARD' | 'EXPERT';
  difficultyMultiplier: number; // Score adjustment: 1.0 = normal, 1.15 = harder questions
  passingScore: number; // Adjusted based on difficulty
}

/**
 * Topic Difficulty Configuration
 *
 * Difficulty Levels:
 * - EASY (Operations): Most accessible, practical focus
 * - MODERATE (Design, InfoMgmt): Balanced technical depth
 * - HARD (Cybersecurity): Advanced security concepts
 * - EXPERT (Architecture): Strategic enterprise-wide knowledge
 *
 * Difficulty Multiplier: Adjusts the perceived difficulty
 * - 0.95 = 5% easier (lower passing threshold)
 * - 1.0 = standard difficulty
 * - 1.15 = 15% harder (higher passing threshold)
 * - 1.25 = 25% harder (highest barrier)
 */

export const TOPIC_CONFIGS: Record<QuizTopic, TopicConfig> = {
  INFORMATION_MGMT: {
    displayName: 'Information Management Specialist',
    description: 'Master data integration, digital twins, and enterprise information backbone',
    icon: 'Database',
    color: '#0284C7',
    focusAreas: ['InConcert', 'Data Bridge', 'Tag Management', 'CFIHOS Standards'],
    difficulty: 'MODERATE',
    difficultyMultiplier: 1.0,
    passingScore: 60 // Standard passing
  },

  DESIGN_TOOLS: {
    displayName: 'Design & Engineering Expert',
    description: 'Advanced 3D modeling, P&ID design, and engineering analysis',
    icon: 'Box',
    color: '#7C3AED',
    focusAreas: ['Forte 3D', 'Facets 2D', 'Aspect Analysis', 'CAESAR II Integration'],
    difficulty: 'MODERATE',
    difficultyMultiplier: 1.0,
    passingScore: 60 // Standard passing
  },

  CYBERSECURITY: {
    displayName: 'OT Security & Compliance Architect',
    description: 'Industrial cybersecurity, vulnerability management, and threat mitigation',
    icon: 'ShieldAlert',
    color: '#DC2626',
    focusAreas: ['Cyber Integrity', 'IEC 62443', 'SCADA Defense', 'Zero-Trust Architecture'],
    difficulty: 'HARD',
    difficultyMultiplier: 1.15, // 15% harder - more technical depth required
    passingScore: 65 // Higher passing threshold for harder topic
  },

  OPERATIONS: {
    displayName: 'Operations & Maintenance Professional',
    description: 'Predictive maintenance, shift management, and operational excellence',
    icon: 'Gauge',
    color: '#16A34A',
    focusAreas: ['Alto Visualizer', 'Tempo Operations', 'AssetSense APM', 'Handover Management'],
    difficulty: 'EASY',
    difficultyMultiplier: 0.95, // 5% easier - practical, accessible content
    passingScore: 55 // Lower passing threshold for easier topic
  },

  ARCHITECTURE: {
    displayName: 'Enterprise Architecture Master',
    description: 'Complete ecosystem integration and enterprise-wide solution design',
    icon: 'Layers',
    color: '#EA580C',
    focusAreas: ['Full Portfolio', 'Integration Patterns', 'Legacy Mapping', 'Strategic Vision'],
    difficulty: 'EXPERT',
    difficultyMultiplier: 1.25, // 25% harder - most challenging, strategic thinking
    passingScore: 70 // Highest passing threshold for expert certification
  }
};

/**
 * Calculate adjusted tier based on difficulty
 * Same raw score gets different tier depending on topic difficulty
 *
 * Example:
 * - 75% on Operations (EASY) = GOLD
 * - 75% on Cybersecurity (HARD) = SILVER (adjusted down)
 * - 75% on Architecture (EXPERT) = SILVER (adjusted significantly down)
 */
export function calculateAdjustedScore(
  rawScore: number,
  topic: QuizTopic
): {
  rawScore: number;
  adjustedScore: number;
  difficulty: string;
  multiplier: number;
} {
  const config = TOPIC_CONFIGS[topic];
  const adjustedScore = Math.min(100, Math.round(rawScore * config.difficultyMultiplier));

  return {
    rawScore,
    adjustedScore,
    difficulty: config.difficulty,
    multiplier: config.difficultyMultiplier
  };
}

/**
 * Determine tier with difficulty adjustment
 */
export function determineTierWithDifficulty(
  rawScore: number,
  topic: QuizTopic
): 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' {
  const { adjustedScore } = calculateAdjustedScore(rawScore, topic);

  if (adjustedScore >= 90) return 'PLATINUM';
  if (adjustedScore >= 80) return 'GOLD';
  if (adjustedScore >= 70) return 'SILVER';
  return 'BRONZE';
}

/**
 * Get tier badge with difficulty context
 */
export function getTierBadge(
  rawScore: number,
  topic: QuizTopic
): {
  tier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE';
  title: string;
  difficulty: string;
  message: string;
} {
  const config = TOPIC_CONFIGS[topic];
  const tier = determineTierWithDifficulty(rawScore, topic);

  const messages: Record<string, string> = {
    PLATINUM: `Elite mastery of ${config.displayName}`,
    GOLD: `Advanced expertise in ${config.displayName}`,
    SILVER: `Solid knowledge of ${config.displayName}`,
    BRONZE: `Foundational understanding of ${config.displayName}`
  };

  const titles: Record<string, string> = {
    PLATINUM: 'PLATINUM ARCHITECT',
    GOLD: 'GOLD ARCHITECT',
    SILVER: 'SILVER ARCHITECT',
    BRONZE: 'BRONZE ARCHITECT'
  };

  return {
    tier,
    title: titles[tier],
    difficulty: config.difficulty,
    message: messages[tier]
  };
}

/**
 * Generate difficulty-adjusted certificate note
 */
export function generateCertificateNote(
  rawScore: number,
  topic: QuizTopic,
  userName: string
): string {
  const config = TOPIC_CONFIGS[topic];
  const { adjustedScore } = calculateAdjustedScore(rawScore, topic);

  const notes: Record<string, string> = {
    PLATINUM: `${userName} has demonstrated elite-level mastery and strategic vision in ${config.displayName}, achieving PLATINUM status. This reflects exceptional understanding of complex enterprise architecture concepts.`,
    GOLD: `${userName} has achieved GOLD certification in ${config.displayName}, demonstrating advanced comprehensive knowledge and practical application of enterprise solutions.`,
    SILVER: `${userName} has earned SILVER certification in ${config.displayName}, showing solid understanding of core capabilities and architectural patterns.`,
    BRONZE: `${userName} has achieved BRONZE certification in ${config.displayName}, establishing foundational knowledge of the enterprise platform.`
  };

  const tier = determineTierWithDifficulty(rawScore, topic);
  return notes[tier] || notes['BRONZE'];
}

/**
 * Display difficulty context on certificate
 */
export function getDifficultyDisplay(topic: QuizTopic): {
  level: string;
  emoji: string;
  description: string;
} {
  const config = TOPIC_CONFIGS[topic];

  const displays: Record<string, any> = {
    EASY: {
      level: '⭐ ACCESSIBLE',
      emoji: '📚',
      description: 'Practical, foundational knowledge'
    },
    MODERATE: {
      level: '⭐⭐ BALANCED',
      emoji: '🎯',
      description: 'Technical depth with practical application'
    },
    HARD: {
      level: '⭐⭐⭐ ADVANCED',
      emoji: '🔒',
      description: 'Deep technical expertise required'
    },
    EXPERT: {
      level: '⭐⭐⭐⭐ EXPERT',
      emoji: '👑',
      description: 'Strategic enterprise architecture mastery'
    }
  };

  return displays[config.difficulty];
}

/**
 * Live Quiz & Tournament Achievement Certificate Layout Specifications
 * Native template: 1584 x 1224 px (landscape)
 */
export interface CertificateLayoutConfig {
  canvas: { width: number; height: number };
  name: { x: number; y: number; lineY: number; fontSize: number; font: string };
  date: { x: number; y: number; lineY: number; fontSize: number };
  signature: { x: number; y: number; lineY: number; fontSize: number; title: string };
  bodySentence: { x: number; y: number; fontSize: number; enabled: boolean; template: string };
  credentials: { x: number; y: number; fontSize: number; enabled: boolean };
  seal: { x: number; y: number; radius: number; enabled: boolean };
}

export const CERTIFICATE_POSITIONS: CertificateLayoutConfig = {
  canvas: { width: 1584, height: 1224 },
  name: {
    x: 792, // Centred at x=792
    y: 700, // Just above name line (y=710)
    lineY: 710,
    fontSize: 88,
    font: "'Great Vibes', cursive, 'Brush Script MT', 'Times New Roman', serif"
  },
  date: {
    x: 345, // Centred at x=345
    y: 1000, // Just above date line (y=1013)
    lineY: 1013,
    fontSize: 18
  },
  signature: {
    x: 1239, // Centred at x=1239
    y: 995, // Above signature line (y=1013)
    lineY: 1013,
    fontSize: 34,
    title: 'Octave Committee'
  },
  bodySentence: {
    x: 792,
    y: 820,
    fontSize: 20,
    enabled: true,
    template: 'In recognition of your participation in the ADIPEC interactive quiz and for securing {placeWord}'
  },
  credentials: {
    x: 792,
    y: 748,
    fontSize: 15,
    enabled: true
  },
  seal: {
    x: 792,
    y: 1010,
    radius: 36,
    enabled: true
  }
};

