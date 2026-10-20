import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { QuizTopic } from '../types/certificate';
import { CertificateData } from '../types/certificate';
import { buildCertificateData, QuizData, VisitorData } from '../utils/certificateAdapter';
import { calculateAdjustedScore, getTierBadge, TOPIC_CONFIGS } from '../utils/certificateConfig';
import EnhancedCertificate from './EnhancedCertificate';
import QuizWheelSpinner from './QuizWheelSpinner';

export interface QuizQuestion {
  id: string;
  type: 'SELECT' | 'TRUE_FALSE';
  category: string;
  categoryIcon: string;
  question: string;
  options?: { id: string; text: string }[];
  correctAnswer: string; // Option ID or 'TRUE' / 'FALSE'
  explanation: string;
  screenSource: string;
  topicTags?: QuizTopic[]; // Topics this question relates to
}

// Quiz Types Configuration - 10+ specializations
export const QUIZ_TYPES = {
  ARCHITECTURE: {
    name: 'Portfolio Architecture',
    description: 'Master the unified 4-pillar Octave ecosystem',
    icon: 'Layers',
    color: '#0ea5e9',
    difficulty: 'EXPERT',
    tags: ['ARCHITECTURE']
  },
  DESIGN_TOOLS: {
    name: 'Design & Engineering',
    description: 'Forte 3D, Facets 2D, and Aspect analysis',
    icon: 'Box',
    color: '#8b5cf6',
    difficulty: 'HARD',
    tags: ['DESIGN_TOOLS']
  },
  INFORMATION_MGMT: {
    name: 'Information Backbone',
    description: 'InConcert, Databridge, data integration',
    icon: 'FolderGit',
    color: '#06b6d4',
    difficulty: 'MODERATE',
    tags: ['INFORMATION_MGMT']
  },
  OPERATIONS: {
    name: 'Operations & Maintenance',
    description: 'Alto, Tempo, AssetSense, APM',
    icon: 'Gauge',
    color: '#10b981',
    difficulty: 'EASY',
    tags: ['OPERATIONS']
  },
  CYBERSECURITY: {
    name: 'Cybersecurity & OT',
    description: 'Cyber Integrity, zero-trust, IEC 62443',
    icon: 'ShieldAlert',
    color: '#ef4444',
    difficulty: 'HARD',
    tags: ['CYBERSECURITY']
  },
  GLOBAL_PRESENCE: {
    name: 'Global Presence',
    description: 'Octave offices, regions, and hubs',
    icon: 'Globe',
    color: '#f59e0b',
    difficulty: 'EASY',
    tags: ['ARCHITECTURE']
  },
  HERITAGE: {
    name: 'Brand Heritage',
    description: 'Company history, 50+ years of innovation',
    icon: 'History',
    color: '#ec4899',
    difficulty: 'EASY',
    tags: ['ARCHITECTURE']
  },
  DIGITAL_TWIN: {
    name: 'Digital Twin Concepts',
    description: 'Digital twin architecture and principles',
    icon: 'Network',
    color: '#06b6d4',
    difficulty: 'MODERATE',
    tags: ['ARCHITECTURE', 'INFORMATION_MGMT']
  },
  INTEGRATION: {
    name: 'Enterprise Integration',
    description: 'System integration, middleware, connectors',
    icon: 'Share2',
    color: '#8b5cf6',
    difficulty: 'MODERATE',
    tags: ['INFORMATION_MGMT']
  },
  ENTERPRISE_SOLUTIONS: {
    name: 'Enterprise Deployments',
    description: 'Multi-facility ops, global coordination',
    icon: 'Building',
    color: '#06b6d4',
    difficulty: 'MODERATE',
    tags: ['OPERATIONS', 'ARCHITECTURE']
  },
  ENGINEERING_ANALYSIS: {
    name: 'Engineering Analysis',
    description: 'Pipe stress, FEA, advanced simulation',
    icon: 'Compass',
    color: '#8b5cf6',
    difficulty: 'HARD',
    tags: ['DESIGN_TOOLS']
  },
  MAINTENANCE_STRATEGY: {
    name: 'Maintenance Strategy',
    description: 'Predictive analytics, APM, optimization',
    icon: 'Wrench',
    color: '#10b981',
    difficulty: 'MODERATE',
    tags: ['OPERATIONS']
  }
};

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    "id": "q1-pillars",
    "type": "SELECT",
    "category": "Architecture & Portfolio",
    "categoryIcon": "Layers",
    "question": "What are the four core pillars of the unified Octave asset lifecycle portfolio?",
    "options": [
      {
        "id": "A",
        "text": "Plan, Code, Test, Deploy"
      },
      {
        "id": "B",
        "text": "Design, Build, Operate, Protect"
      },
      {
        "id": "C",
        "text": "Ingest, Process, Store, Analyze"
      },
      {
        "id": "D",
        "text": "Discover, Implement, Monitor, Retire"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Octave structures its entire industrial digital twin ecosystem across four unified pillars: Design (Spatial & Engineering), Build (Information & Procurement), Operate (Maintenance & Operations), and Protect (Cybersecurity & Safety).",
    "screenSource": "Who is Octave & Portfolio Matrix",
    "topicTags": [
      "ARCHITECTURE",
      "INFORMATION_MGMT",
      "DESIGN_TOOLS",
      "OPERATIONS",
      "CYBERSECURITY"
    ]
  },
  {
    "id": "q2-dubai-branch",
    "type": "TRUE_FALSE",
    "category": "Global Presence",
    "categoryIcon": "Globe",
    "question": "True or False: Octave has an active regional office based in Dubai, serving the Middle East & Africa (MEA) market?",
    "correctAnswer": "TRUE",
    "explanation": "Yes! Octave operates a regional office in Dubai, UAE, serving as the hub for Middle East & Africa (MEA) operations — supporting industrial energy, oil & gas, and infrastructure clients across the region.",
    "screenSource": "Global Offices Map",
    "topicTags": [
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q3-forte",
    "type": "SELECT",
    "category": "Design & Engineering",
    "categoryIcon": "Box",
    "question": "Which Octave solution is the flagship next-generation 3D plant and marine spatial design platform?",
    "options": [
      {
        "id": "A",
        "text": "Octave OnCall"
      },
      {
        "id": "B",
        "text": "Octave Attune"
      },
      {
        "id": "C",
        "text": "Octave Forte (formerly Smart 3D)"
      },
      {
        "id": "D",
        "text": "Octave Reliance"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Octave Forte (formerly Smart 3D / SmartPlant) delivers rule-based 3D modeling for industrial piping, structural framing, equipment layouts, and marine vessels.",
    "screenSource": "Portfolio Matrix & Architecture Canvas",
    "topicTags": [
      "DESIGN_TOOLS",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q4-databridge",
    "type": "TRUE_FALSE",
    "category": "Enterprise Integration",
    "categoryIcon": "Share2",
    "question": "True or False: Octave Databridge Pro requires clients to completely decommission and replace their existing SAP, Oracle, and PI systems before it can be used?",
    "correctAnswer": "FALSE",
    "explanation": "False! Octave Databridge Pro is designed as non-invasive middleware that connects seamlessly with existing ERP, SCADA, and historian systems without requiring infrastructure replacement.",
    "screenSource": "Architecture Canvas & Middleware",
    "topicTags": [
      "INFORMATION_MGMT",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q5-cybersecurity",
    "type": "SELECT",
    "category": "Cybersecurity & OT",
    "categoryIcon": "ShieldAlert",
    "question": "Which solution defends industrial OT/ICS networks with zero-trust vulnerability management and configuration baselining?",
    "options": [
      {
        "id": "A",
        "text": "Octave Aspect"
      },
      {
        "id": "B",
        "text": "Octave InConcert"
      },
      {
        "id": "C",
        "text": "Octave GeoMedia"
      },
      {
        "id": "D",
        "text": "Octave Cyber Integrity (formerly PAS)"
      }
    ],
    "correctAnswer": "D",
    "explanation": "Octave Cyber Integrity provides automated inventory, vulnerability mapping, and configuration backup for DCS, PLC, and industrial control systems.",
    "screenSource": "Protect Pillar & Solution Finder",
    "topicTags": [
      "CYBERSECURITY",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q6-tempo",
    "type": "TRUE_FALSE",
    "category": "Operations Management",
    "categoryIcon": "Clock",
    "question": "True or False: Octave Tempo manages digital shift handovers, operator logbooks, and control room alarm rationalization?",
    "correctAnswer": "TRUE",
    "explanation": "True! Octave Tempo (formerly j5 Operations, AcceleratorKMS & PAS PlantState Integrity) delivers structured electronic shift handovers, operator logbooks, and alarm rationalization to eliminate operational blind spots.",
    "screenSource": "Operate Pillar & Solution Finder",
    "topicTags": [
      "OPERATIONS",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q7-inconcert",
    "type": "SELECT",
    "category": "Information Backbone",
    "categoryIcon": "FolderGit",
    "question": "What is the primary function of Octave InConcert in an enterprise asset ecosystem?",
    "options": [
      {
        "id": "A",
        "text": "Centralized Information Management & Digital Twin backbone"
      },
      {
        "id": "B",
        "text": "Consumer video streaming player"
      },
      {
        "id": "C",
        "text": "Standard office spreadsheet replacement"
      },
      {
        "id": "D",
        "text": "Direct hardware circuit board solderer"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Octave InConcert (formerly SmartPlant Foundation / SDx) unifies engineering tags, 1D/2D/3D models, vendor documents, and change management into a single source of truth.",
    "screenSource": "Build & Operate Pillars",
    "topicTags": [
      "INFORMATION_MGMT",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q8-aspect-stress",
    "type": "TRUE_FALSE",
    "category": "Engineering Analysis",
    "categoryIcon": "Compass",
    "question": "True or False: Octave Aspect is restricted to 2D line drafting and cannot perform 3D pipe stress or finite element structural analysis?",
    "correctAnswer": "FALSE",
    "explanation": "False! Octave Aspect unifies industry-standard 3D pipe stress analysis (CAESAR II, PIPESTRESS) and structural finite element analysis (GT STRUDL).",
    "screenSource": "Design Pillar & Engineering Simulation",
    "topicTags": [
      "DESIGN_TOOLS",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q9-hq-location",
    "type": "SELECT",
    "category": "Global Presence",
    "categoryIcon": "Building",
    "question": "According to our Global Offices Map, where is Octaves Global Headquarters and Core R&D Center located?",
    "options": [
      {
        "id": "A",
        "text": "Geneva, Switzerland"
      },
      {
        "id": "B",
        "text": "Huntsville, Alabama, United States"
      },
      {
        "id": "C",
        "text": "Sydney, Australia"
      },
      {
        "id": "D",
        "text": "Singapore"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Huntsville, AL houses Octaves Global Headquarters, executive leadership, and primary technology innovation center.",
    "screenSource": "Global Offices Map",
    "topicTags": [
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q10-heritage",
    "type": "TRUE_FALSE",
    "category": "Brand Legacy",
    "categoryIcon": "History",
    "question": "True or False: Octave is built on over 50 years of engineering innovation, uniting Intergraph and Hexagon Asset Lifecycle heritage into a next-gen brand?",
    "correctAnswer": "TRUE",
    "explanation": "True! Octave represents the latest evolution of M&S Computing, Intergraph, and Hexagon Asset Lifecycle Intelligence, trusted by the world's leading industrial operators.",
    "screenSource": "Who is Octave History Timeline",
    "topicTags": [
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q11-inconcert-smf",
    "type": "SELECT",
    "category": "Information Backbone",
    "categoryIcon": "FolderGit",
    "question": "What was the predecessor to Octave InConcert?",
    "options": [
      {
        "id": "A",
        "text": "Forte Legacy"
      },
      {
        "id": "B",
        "text": "Aspect Classic"
      },
      {
        "id": "C",
        "text": "SmartPlant Foundation (SPF)"
      },
      {
        "id": "D",
        "text": "OnCall Enterprise"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Octave InConcert evolved from SmartPlant Foundation, maintaining backward compatibility while adding modern digital twin capabilities.",
    "screenSource": "Product Roadmap",
    "topicTags": [
      "INFORMATION_MGMT",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q12-forte-modeling",
    "type": "TRUE_FALSE",
    "category": "Design & Engineering",
    "categoryIcon": "Box",
    "question": "True or False: Octave Forte is a legacy 2D drawing viewer that lacks rule-based automated 3D parametric modeling and clash detection?",
    "correctAnswer": "FALSE",
    "explanation": "False! Octave Forte is the flagship 3D spatial design platform featuring rule-based parametric modeling, automated routing, and real-time clash detection.",
    "screenSource": "Design Features",
    "topicTags": [
      "DESIGN_TOOLS",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q13-cyber-integrity-ieca",
    "type": "SELECT",
    "category": "Cybersecurity & OT",
    "categoryIcon": "ShieldAlert",
    "question": "Which security standards does Octave Cyber Integrity help comply with?",
    "options": [
      {
        "id": "A",
        "text": "Only NIST guidelines"
      },
      {
        "id": "B",
        "text": "GDPR only"
      },
      {
        "id": "C",
        "text": "ISO 9001 exclusively"
      },
      {
        "id": "D",
        "text": "IEC 62443 and ISA standards"
      }
    ],
    "correctAnswer": "D",
    "explanation": "Octave Cyber Integrity supports compliance with IEC 62443, ISA standards, and other industrial cybersecurity frameworks.",
    "screenSource": "Compliance Matrix",
    "topicTags": [
      "CYBERSECURITY",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q14-alto-operations",
    "type": "TRUE_FALSE",
    "category": "Operations Management",
    "categoryIcon": "Gauge",
    "question": "True or False: Octave Alto helps with real-time operational visibility across distributed assets?",
    "correctAnswer": "TRUE",
    "explanation": "True! Octave Alto (formerly j5 Visualizer) provides real-time visualization and operational control across global industrial assets.",
    "screenSource": "Operations Suite",
    "topicTags": [
      "OPERATIONS",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q15-facets-2d-design",
    "type": "SELECT",
    "category": "Design & Engineering",
    "categoryIcon": "Box",
    "question": "What type of engineering drawings does Octave Facets specialize in?",
    "options": [
      {
        "id": "A",
        "text": "Piping & Instrumentation Diagrams (P&ID)"
      },
      {
        "id": "B",
        "text": "3D volumetric models only"
      },
      {
        "id": "C",
        "text": "Architectural floor plans"
      },
      {
        "id": "D",
        "text": "Network topology diagrams"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Octave Facets is the 2D engineering design solution for P&IDs, schematics, and technical drawings integrated with the 3D portfolio.",
    "screenSource": "Design Tools Portfolio",
    "topicTags": [
      "DESIGN_TOOLS",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q16-databridge-connectors",
    "type": "TRUE_FALSE",
    "category": "Enterprise Integration",
    "categoryIcon": "Share2",
    "question": "True or False: Octave Databridge only supports manual flat-file CSV uploads and cannot handle real-time streaming APIs or OPC UA connectors?",
    "correctAnswer": "FALSE",
    "explanation": "False! Octave Databridge provides high-speed enterprise connectors for REST APIs, OPC UA, MQTT, and direct database replication.",
    "screenSource": "Integration Middleware",
    "topicTags": [
      "INFORMATION_MGMT",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q17-aspect-analysis",
    "type": "SELECT",
    "category": "Engineering Analysis",
    "categoryIcon": "Compass",
    "question": "Which engineering analysis tools are integrated in Octave Aspect?",
    "options": [
      {
        "id": "A",
        "text": "Only basic geometry checking"
      },
      {
        "id": "B",
        "text": "Pipe stress, pressure vessel, and FEA analysis"
      },
      {
        "id": "C",
        "text": "Weather simulation only"
      },
      {
        "id": "D",
        "text": "Electrical load calculations"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Octave Aspect integrates CAESAR II pipe stress analysis, pressure vessel design (PVE), and FEA structural calculation tools.",
    "screenSource": "Engineering Analysis Suite",
    "topicTags": [
      "DESIGN_TOOLS",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q18-tempo-handover",
    "type": "TRUE_FALSE",
    "category": "Operations Management",
    "categoryIcon": "Clock",
    "question": "True or False: Octave Tempo includes electronic shift handover documentation?",
    "correctAnswer": "TRUE",
    "explanation": "True! Octave Tempo modernizes shift handovers with structured digital documentation, replacing manual paper-based processes.",
    "screenSource": "Operations Excellence",
    "topicTags": [
      "OPERATIONS",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q19-four-pillars-integration",
    "type": "SELECT",
    "category": "Architecture & Portfolio",
    "categoryIcon": "Layers",
    "question": "How do the Four Pillars (Design, Build, Operate, Protect) integrate across Octave?",
    "options": [
      {
        "id": "A",
        "text": "Completely independent systems"
      },
      {
        "id": "B",
        "text": "One-way data flow only"
      },
      {
        "id": "C",
        "text": "Unified data spine with InConcert as backbone"
      },
      {
        "id": "D",
        "text": "Manual data synchronization required"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Octave InConcert serves as the unified information backbone connecting all Four Pillars, enabling seamless data flow across the lifecycle.",
    "screenSource": "Portfolio Architecture",
    "topicTags": [
      "ARCHITECTURE",
      "INFORMATION_MGMT"
    ]
  },
  {
    "id": "q20-octave-global-footprint",
    "type": "TRUE_FALSE",
    "category": "Global Presence",
    "categoryIcon": "Globe",
    "question": "True or False: Octave operates exclusively in North America with no regional offices or engineering presence across the Middle East or Asia?",
    "correctAnswer": "FALSE",
    "explanation": "False! Octave maintains regional hubs across the globe including Dubai, Abu Dhabi, London, Singapore, and Houston serving global energy leaders.",
    "screenSource": "Global Offices Map",
    "topicTags": [
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q21-cyber-threat-detection",
    "type": "SELECT",
    "category": "Cybersecurity & OT",
    "categoryIcon": "ShieldAlert",
    "question": "What type of cyber threats does Octave Cyber Integrity detect?",
    "options": [
      {
        "id": "A",
        "text": "Only external network attacks"
      },
      {
        "id": "B",
        "text": "Password strength only"
      },
      {
        "id": "C",
        "text": "None - it's only for compliance documentation"
      },
      {
        "id": "D",
        "text": "Unauthorized changes, anomalous behavior, and configuration drift"
      }
    ],
    "correctAnswer": "D",
    "explanation": "Octave Cyber Integrity detects unauthorized device changes, behavioral anomalies, configuration drift, and insider threats in OT networks.",
    "screenSource": "Threat Detection",
    "topicTags": [
      "CYBERSECURITY",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q22-assetsense-apm",
    "type": "TRUE_FALSE",
    "category": "Operations Management",
    "categoryIcon": "Gauge",
    "question": "True or False: Octave AssetSense provides predictive maintenance analytics?",
    "correctAnswer": "TRUE",
    "explanation": "Yes! Octave AssetSense uses AI-powered APM to predict equipment failures and optimize maintenance schedules before problems occur.",
    "screenSource": "Predictive Maintenance",
    "topicTags": [
      "OPERATIONS",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q23-design-build-handoff",
    "type": "SELECT",
    "category": "Information Backbone",
    "categoryIcon": "FolderGit",
    "question": "How does Octave ensure seamless handoff from Design (Forte/Facets) to Build (InConcert)?",
    "options": [
      {
        "id": "A",
        "text": "Unified data model with bidirectional synchronization"
      },
      {
        "id": "B",
        "text": "Manual file export/import process"
      },
      {
        "id": "C",
        "text": "Separate databases with no integration"
      },
      {
        "id": "D",
        "text": "Email-based document sharing"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Octave uses a unified data model with InConcert enabling seamless, bidirectional synchronization between design and build phases.",
    "screenSource": "Lifecycle Integration",
    "topicTags": [
      "INFORMATION_MGMT",
      "DESIGN_TOOLS",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q24-ot-security-zero-trust",
    "type": "TRUE_FALSE",
    "category": "Cybersecurity & OT",
    "categoryIcon": "ShieldAlert",
    "question": "True or False: Octave assumes all control room OT networks are completely secure by default and therefore disables configuration baselining?",
    "correctAnswer": "FALSE",
    "explanation": "False! Octave Cyber Integrity enforces strict Zero-Trust OT security with continuous configuration baselining and anomaly tracking.",
    "screenSource": "Security Architecture",
    "topicTags": [
      "CYBERSECURITY",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q25-real-time-operations-dashboard",
    "type": "SELECT",
    "category": "Operations Management",
    "categoryIcon": "Gauge",
    "question": "What does Octave Alto real-time dashboard display?",
    "options": [
      {
        "id": "A",
        "text": "Only historical data archives"
      },
      {
        "id": "B",
        "text": "Equipment status, alarms, KPIs, and operational metrics"
      },
      {
        "id": "C",
        "text": "Accounting and financial reports"
      },
      {
        "id": "D",
        "text": "Website analytics"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Octave Alto displays real-time operational dashboards with equipment status, critical alarms, performance KPIs, and maintenance alerts.",
    "screenSource": "Operations Portal",
    "topicTags": [
      "OPERATIONS",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q26-intergraph-hexagon-heritage",
    "type": "TRUE_FALSE",
    "category": "Brand Legacy",
    "categoryIcon": "History",
    "question": "True or False: Octave combines best practices from Intergraph, SmartPlant, and Hexagon heritage?",
    "correctAnswer": "TRUE",
    "explanation": "True! Octave represents the latest evolution combining decades of expertise from M&S Computing, Intergraph, and Hexagon leadership.",
    "screenSource": "Company Heritage",
    "topicTags": [
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q27-compliance-reporting",
    "type": "SELECT",
    "category": "Cybersecurity & OT",
    "categoryIcon": "ShieldAlert",
    "question": "What compliance reports can Octave Cyber Integrity generate?",
    "options": [
      {
        "id": "A",
        "text": "Only quarterly financial summaries"
      },
      {
        "id": "B",
        "text": "Employee attendance logs"
      },
      {
        "id": "C",
        "text": "IEC 62443, ISA, NERC CIP, and custom audit reports"
      },
      {
        "id": "D",
        "text": "No reporting available"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Octave Cyber Integrity generates automated compliance reports for IEC 62443, ISA standards, NERC CIP, and custom security audits.",
    "screenSource": "Compliance Reports",
    "topicTags": [
      "CYBERSECURITY",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q28-data-quality-management",
    "type": "TRUE_FALSE",
    "category": "Information Backbone",
    "categoryIcon": "FolderGit",
    "question": "True or False: Octave InConcert leaves engineering tag data validation entirely to manual human spreadsheet verification without automated data quality rules?",
    "correctAnswer": "FALSE",
    "explanation": "False! Octave InConcert features automated data quality rules, tag syntax verification, and multi-discipline cross-checking.",
    "screenSource": "Data Governance",
    "topicTags": [
      "INFORMATION_MGMT",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q29-multi-facility-operations",
    "type": "SELECT",
    "category": "Operations Management",
    "categoryIcon": "Gauge",
    "question": "Can Octave operate across multiple facilities, sites, and time zones?",
    "options": [
      {
        "id": "A",
        "text": "Only single-location installations"
      },
      {
        "id": "B",
        "text": "Maximum 3 facilities"
      },
      {
        "id": "C",
        "text": "Requires separate licenses per site"
      },
      {
        "id": "D",
        "text": "Yes - supports global multi-site operations with centralized control"
      }
    ],
    "correctAnswer": "D",
    "explanation": "Octave supports global multi-site operations with centralized dashboards, distributed gateways, and cross-timezone coordination.",
    "screenSource": "Global Operations",
    "topicTags": [
      "OPERATIONS",
      "ARCHITECTURE"
    ]
  },
  {
    "id": "q30-mobile-field-access",
    "type": "TRUE_FALSE",
    "category": "Operations Management",
    "categoryIcon": "Gauge",
    "question": "True or False: Field technicians can access Octave operations data via mobile devices?",
    "correctAnswer": "TRUE",
    "explanation": "True! Octave provides mobile-first interfaces for field technicians to access real-time data, alerts, and work orders on-site.",
    "screenSource": "Mobile Operations",
    "topicTags": [
      "OPERATIONS",
      "ARCHITECTURE"
    ]
  }
];

interface ClientKnowledgeQuizProps {
  onCertificateGenerated?: (certificateData: CertificateData) => void;
  onNavigateToCertificate?: (scoreData?: { score: number; total: number; badge: string; clientName: string; companyName?: string; jobTitle?: string }) => void;
  onNavigateToCanvas?: () => void;
}

export default function ClientKnowledgeQuiz({
  onCertificateGenerated,
  onNavigateToCertificate,
  onNavigateToCanvas
}: ClientKnowledgeQuizProps) {
  // Quiz Lifecycle State: 'QUIZ_SELECT' | 'INTRO' | 'ACTIVE' | 'SUMMARY'
  const [quizState, setQuizState] = useState<'QUIZ_SELECT' | 'INTRO' | 'ACTIVE' | 'SUMMARY'>('QUIZ_SELECT');
  // Selection Mode: 'MANUAL' (Choose Certificate Path) vs 'WHEEL' (Wheel Spinner Random Quiz)
  const [selectionMode, setSelectionMode] = useState<'MANUAL' | 'WHEEL'>('MANUAL');
  const [selectedQuizType, setSelectedQuizType] = useState<string | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [questionsPerQuiz, setQuestionsPerQuiz] = useState<number>(10);

  // Mandatory Client Details: Name, University/Organization, Specialization/Field (No Default Values)
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientJobTitle, setClientJobTitle] = useState('');
  const [formValidationError, setFormValidationError] = useState<string | null>(null);
  const [generatedCertificate, setGeneratedCertificate] = useState<CertificateData | null>(null);

  // Timer Configuration (120s = 2 mins, 150s = 2.5 mins, 180s = 3 mins)
  const [selectedDuration, setSelectedDuration] = useState<number>(150); // Default: 2.5 minutes
  const [timeLeft, setTimeLeft] = useState<number>(150);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Question navigation and answer selections
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: string]: string }>({});

  // Review expanded questions in summary
  const [expandedExplanationId, setExpandedExplanationId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer Countdown Effect
  useEffect(() => {
    if (timerActive && quizState === 'ACTIVE') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time expired -> Auto-finish quiz
            clearInterval(timerRef.current!);
            handleCompleteQuiz();
            return 0;
          }
          return prev - 1;
        });
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, quizState]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Quiz
  // Fisher-Yates shuffle
  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const handleStartQuiz = () => {
    // Validate mandatory fields
    if (!clientName.trim() || !clientCompany.trim() || !clientJobTitle.trim()) {
      setFormValidationError('Name, University/Organization, and Specialization/Field are mandatory to start the quiz and qualify for your official certificate.');
      return;
    }
    setFormValidationError(null);

    // Filter by quiz type tags
    const pool = selectedQuizType
      ? QUIZ_QUESTIONS.filter(q =>
          q.topicTags?.some(tag => QUIZ_TYPES[selectedQuizType as keyof typeof QUIZ_TYPES]?.tags.includes(tag))
        )
      : QUIZ_QUESTIONS;

    // Shuffle pool and pick subset, and randomize SELECT options with clean letters A, B, C, D
    const picked = shuffle(pool).slice(0, Math.min(questionsPerQuiz, pool.length)).map(q => {
      if (q.type === 'SELECT' && q.options && q.options.length > 0) {
        const correctOpt = q.options.find(o => o.id === q.correctAnswer);
        const correctText = correctOpt ? correctOpt.text : null;
        const shuffledOpts = shuffle(q.options);
        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        const remappedOpts = shuffledOpts.map((opt, idx) => ({
          id: letters[idx] || `${idx + 1}`,
          text: opt.text
        }));
        const newCorrectId = correctText
          ? (remappedOpts.find(o => o.text === correctText)?.id || q.correctAnswer)
          : q.correctAnswer;
        return {
          ...q,
          options: remappedOpts,
          correctAnswer: newCorrectId
        };
      }
      return q;
    });

    setActiveQuestions(picked);
    setUserAnswers({});
    setCurrentQuestionIdx(0);
    setTimeLeft(selectedDuration);
    setTimeElapsed(0);
    setQuizState('ACTIVE');
    setTimerActive(true);
  };

  // Select Answer
  const handleSelectAnswer = (questionId: string, answerValue: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerValue
    }));
  };

  // Finish Quiz & Generate Certificate
  const handleCompleteQuiz = () => {
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Generate certificate if mandatory participant details provided AND score passes (>= 70%)
    if (clientName.trim() && clientCompany.trim() && clientJobTitle.trim()) {
      const correctCount = activeQuestions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
      const rawScore = activeQuestions.length > 0 ? Math.round((correctCount / activeQuestions.length) * 100) : 0;
      const passingScore = 70; // 100 Platinum, 90 Gold, 80 Silver, 70 Bronze

      // Only generate certificate if they passed (>= 70%)
      if (rawScore >= passingScore) {
        // Build certificate
        const visitorData: VisitorData = {
          firstName: clientName.split(' ')[0] || 'Ali',
          lastName: clientName.split(' ').slice(1).join(' ') || 'Ibrahim',
          email: clientEmail || '',
          company: clientCompany || 'Company Name',
          jobTitle: clientJobTitle || 'Presales',
          department: 'Presales / Enterprise Solutions'
        };

        const categoryMap: { [key: string]: { correct: number; total: number } } = {};
        activeQuestions.forEach((q) => {
          if (!categoryMap[q.category]) categoryMap[q.category] = { correct: 0, total: 0 };
          categoryMap[q.category].total += 1;
          if (userAnswers[q.id] === q.correctAnswer) categoryMap[q.category].correct += 1;
        });

        const quizData: QuizData = {
          correctAnswers: correctCount,
          totalQuestions: activeQuestions.length,
          timeSpentSeconds: timeElapsed,
          categoryScores: Object.entries(categoryMap).map(([cat, { correct, total }]) => ({
            category: cat,
            score: correct,
            maxScore: total
          })),
          topic: selectedQuizType as QuizTopic || 'ARCHITECTURE'
        };

        const certificate = buildCertificateData(visitorData, quizData);
        setGeneratedCertificate(certificate);

        if (onCertificateGenerated) {
          onCertificateGenerated(certificate);
        }
      }
    }

    setQuizState('SUMMARY');
  };

  // Use active (randomized) questions during quiz; fall back to full pool before quiz starts
  const relevantQuestions = activeQuestions.length > 0 ? activeQuestions : QUIZ_QUESTIONS;
  const totalQuestions = relevantQuestions.length;
  const answeredCount = Object.keys(userAnswers).length;

  const correctCount = relevantQuestions.reduce((acc, q) => {
    if (userAnswers[q.id] === q.correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const rawScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const scorePercentage = rawScore;

  // Determine Badge & Rating
  const passingScore = 70; // Standard passing for unified quiz
  const hasPassed = rawScore >= passingScore;

  let scoreBadge = {
    tier: 'NONE',
    title: 'Participant',
    color: 'text-neutral-400 bg-neutral-900/60 border-neutral-700',
    icon: 'Sparkles',
    message: 'Score is below 70%. Retake the quiz to achieve 70%+ and earn your official Octave Certificate.'
  };

  if (scorePercentage === 100) {
    scoreBadge = {
      tier: 'PLATINUM',
      title: '💎 Platinum Certified Architect',
      color: 'text-cyan-200 bg-cyan-950/50 border-cyan-400/60 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/25',
      icon: 'Trophy',
      message: 'Flawless 100% score! You have earned the elite Platinum Certificate of Achievement.'
    };
  } else if (scorePercentage >= 90) {
    scoreBadge = {
      tier: 'GOLD',
      title: '🥇 Gold Certified Architect',
      color: 'text-amber-300 bg-amber-950/50 border-amber-400/60 ring-1 ring-amber-400/50 shadow-lg shadow-amber-500/25',
      icon: 'Award',
      message: 'Outstanding mastery! You scored 90%+ and earned the Gold Certificate of Achievement.'
    };
  } else if (scorePercentage >= 80) {
    scoreBadge = {
      tier: 'SILVER',
      title: '🥈 Silver Certified Specialist',
      color: 'text-slate-200 bg-slate-900/60 border-slate-300/50 shadow-lg shadow-slate-500/20',
      icon: 'CheckCircle2',
      message: 'Excellent technical acumen! You scored 80%+ and earned the Silver Certificate of Achievement.'
    };
  } else if (scorePercentage >= 70) {
    scoreBadge = {
      tier: 'BRONZE',
      title: '🥉 Bronze Certified Associate',
      color: 'text-amber-500 bg-amber-950/30 border-amber-600/40 shadow-lg shadow-amber-700/20',
      icon: 'Badge',
      message: 'Solid foundation! You passed with 70%+ and earned the Bronze Certificate of Achievement.'
    };
  }

  // Dynamic Lucide Icon
  const CategoryIcon = ({ name, className }: { name: string; className?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComp = (Icons as any)[name];
    if (!IconComp) return <Icons.HelpCircle className={className} />;
    return <IconComp className={className} />;
  };

  // Get current question from filtered list (by topic)
  const currentQ = relevantQuestions[currentQuestionIdx];

  return (
    <div id="client-knowledge-quiz-root" className="w-full max-w-6xl mx-auto flex flex-col gap-6 text-white animate-fade-in">

      {/* SECTION 0: QUIZ MODE SELECTION & TRACK SELECTION */}
      {quizState === 'QUIZ_SELECT' && (
        <div className="w-full flex flex-col gap-6 bg-gradient-to-b from-[#0e1626] via-[#090d17] to-[#06080e] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">

          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header & 2 Options Choice */}
          <div className="relative z-10 space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Icons.Award className="w-3.5 h-3.5 text-sky-400" />
              <span>Octave Client Knowledge Quiz</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Select Your Certification Challenge
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto">
              Choose how you want to start: pick a specific specialization path or spin the fortune wheel to get a randomized quiz.
            </p>

            {/* The 2 Primary Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
              <button
                type="button"
                onClick={() => setSelectionMode('MANUAL')}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center gap-4 ${
                  selectionMode === 'MANUAL'
                    ? 'bg-sky-500/20 border-sky-400 text-white shadow-xl shadow-sky-500/20 ring-1 ring-sky-400/40'
                    : 'bg-neutral-900/80 border-white/10 text-neutral-400 hover:border-white/30 hover:text-neutral-200'
                }`}
              >
                <div className={`p-3 rounded-xl border shrink-0 ${
                  selectionMode === 'MANUAL'
                    ? 'bg-sky-500 text-black border-sky-300 shadow-md'
                    : 'bg-black/50 border-white/10 text-neutral-400'
                }`}>
                  <Icons.Compass className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">Choose Your Certificate Path</span>
                    {selectionMode === 'MANUAL' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-400 text-black uppercase">Active</span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-400 block mt-0.5">
                    Browse and pick from 12 specialized portfolio tracks
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectionMode('WHEEL')}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center gap-4 ${
                  selectionMode === 'WHEEL'
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-xl shadow-amber-500/20 ring-1 ring-amber-400/40'
                    : 'bg-neutral-900/80 border-white/10 text-neutral-400 hover:border-white/30 hover:text-neutral-200'
                }`}
              >
                <div className={`p-3 rounded-xl border shrink-0 ${
                  selectionMode === 'WHEEL'
                    ? 'bg-amber-500 text-black border-amber-300 shadow-md'
                    : 'bg-black/50 border-white/10 text-neutral-400'
                }`}>
                  <Icons.Disc3 className={`w-6 h-6 stroke-[2.2] ${selectionMode === 'WHEEL' ? 'animate-spin-slow' : ''}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">Wheel Spinner</span>
                    {selectionMode === 'WHEEL' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-black uppercase">Active</span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-400 block mt-0.5">
                    Spin the wheel to get assigned a quiz randomly
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="w-full border-t border-white/10 my-2" />

          {/* OPTION 1: CHOOSE YOUR CERTIFICATE PATH (12 Tracks Grid) */}
          {selectionMode === 'MANUAL' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Icons.LayoutGrid className="w-4 h-4 text-sky-400" />
                    <span>Explore All 12 Specializations</span>
                  </h3>
                  <p className="text-xs text-neutral-400">Click any track below to configure your participant details and launch the quiz.</p>
                </div>
                <button
                  onClick={() => setSelectionMode('WHEEL')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Icons.Disc3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Try Wheel Spinner Instead 🎡</span>
                </button>
              </div>

              {/* Quiz Type Grid */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(QUIZ_TYPES).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedQuizType(key);
                      setQuizState('INTRO');
                    }}
                    className="p-5 rounded-xl border-2 hover:border-current transition-all group cursor-pointer text-left h-full"
                    style={{
                      borderColor: `${config.color}40`,
                      backgroundColor: `${config.color}08`
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl group-hover:scale-110 transition-transform">
                        {config.difficulty === 'EASY' && '⭐'}
                        {config.difficulty === 'MODERATE' && '⭐⭐'}
                        {config.difficulty === 'HARD' && '⭐⭐⭐'}
                        {config.difficulty === 'EXPERT' && '⭐⭐⭐⭐'}
                      </div>
                      <Icons.ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-bold text-white mb-1 text-sm">{config.name}</h3>
                    <p className="text-xs text-neutral-400">{config.description}</p>
                    <span className="text-[10px] font-mono text-neutral-500 mt-2 inline-block uppercase">{config.difficulty}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* OPTION 2: WHEEL SPINNER (RANDOM QUIZ) */}
          {selectionMode === 'WHEEL' && (
            <div className="relative z-10 w-full py-2">
              <QuizWheelSpinner
                onSelectQuiz={(key) => {
                  setSelectedQuizType(key);
                  setQuizState('INTRO');
                }}
                onSwitchToManual={() => setSelectionMode('MANUAL')}
              />
            </div>
          )}

        </div>
      )}

      {/* SECTION 1: INTRO SCREEN */}
      {quizState === 'INTRO' && (
        <div className="flex flex-col gap-6 bg-gradient-to-b from-[#0e1626] via-[#090d17] to-[#06080e] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-xs font-mono font-bold uppercase tracking-wider">
                <Icons.HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>Interactive Client Knowledge Quiz</span>
              </div>
              {selectedQuizType && QUIZ_TYPES[selectedQuizType as keyof typeof QUIZ_TYPES] && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${QUIZ_TYPES[selectedQuizType as keyof typeof QUIZ_TYPES].color}20`,
                    borderColor: `${QUIZ_TYPES[selectedQuizType as keyof typeof QUIZ_TYPES].color}60`,
                    color: QUIZ_TYPES[selectedQuizType as keyof typeof QUIZ_TYPES].color
                  }}
                >
                  <span>🎯 {QUIZ_TYPES[selectedQuizType as keyof typeof QUIZ_TYPES].name}</span>
                </div>
              )}
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Octave Booth Knowledge Challenge
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
                Test your expertise in {selectedQuizType && QUIZ_TYPES[selectedQuizType as keyof typeof QUIZ_TYPES] ? QUIZ_TYPES[selectedQuizType as keyof typeof QUIZ_TYPES].name.toLowerCase() : 'Octave portfolio'}.
              </p>
            </div>

            {/* Change Quiz / Spin Again Button */}
            <button
              onClick={() => setQuizState('QUIZ_SELECT')}
              className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-lg transition-all"
            >
              ← Change Path / Spin Again
            </button>

            {/* Quick Stats Pill */}
            <div className="p-4 bg-neutral-900/80 border border-white/10 rounded-xl flex items-center gap-4 shrink-0">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Icons.Timer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Duration</span>
                <span className="text-base font-bold text-white">2 – 3 Minutes</span>
              </div>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            
            {/* Left Box: Mandatory Client Identity */}
            <div className="p-5 bg-neutral-900/60 border border-white/10 rounded-xl space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300 font-bold uppercase">
                <div className="flex items-center gap-2">
                  <Icons.UserCheck className="w-4 h-4 text-sky-400" />
                  <span>Participant Details (Mandatory)</span>
                </div>
                <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  Required for Certificate
                </span>
              </div>

              {formValidationError && (
                <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-shake">
                  <Icons.AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formValidationError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1 mb-1">
                    <span>Name</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={clientName}
                    onChange={(e) => {
                      setClientName(e.target.value);
                      if (formValidationError) setFormValidationError(null);
                    }}
                    className={`w-full bg-[#080808] border rounded-lg px-3 py-2 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none ${
                      !clientName.trim() ? 'border-amber-500/50 focus:border-amber-400' : 'border-white/10 focus:border-sky-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1 mb-1">
                    <span>University / Organization</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Khalifa University or ADNOC"
                    value={clientCompany}
                    onChange={(e) => {
                      setClientCompany(e.target.value);
                      if (formValidationError) setFormValidationError(null);
                    }}
                    className={`w-full bg-[#080808] border rounded-lg px-3 py-2 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none ${
                      !clientCompany.trim() ? 'border-amber-500/50 focus:border-amber-400' : 'border-white/10 focus:border-sky-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1 mb-1">
                    <span>Specialization / Field</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Petroleum Engineering, Data Science..."
                    value={clientJobTitle}
                    onChange={(e) => {
                      setClientJobTitle(e.target.value);
                      if (formValidationError) setFormValidationError(null);
                    }}
                    className={`w-full bg-[#080808] border rounded-lg px-3 py-2 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none ${
                      !clientJobTitle.trim() ? 'border-amber-500/50 focus:border-amber-400' : 'border-white/10 focus:border-sky-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-neutral-400 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="e.g. participant@university.edu"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Box: Quiz Duration Selection */}
            <div className="p-5 bg-neutral-900/60 border border-white/10 rounded-xl space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300 font-bold uppercase">
                <div className="flex items-center gap-2">
                  <Icons.Clock className="w-4 h-4 text-amber-400" />
                  <span>Choose Time Limit</span>
                </div>
                <span className="text-[10px] text-amber-400 font-normal">[ Fast Touchscreen Pace ]</span>
              </div>

              {/* Questions Count Selector */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-neutral-400 font-bold uppercase flex items-center gap-1.5">
                  <Icons.ListChecks className="w-3.5 h-3.5 text-sky-400" />
                  <span>Number of Questions</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[5, 10, 15, 20].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setQuestionsPerQuiz(n)}
                      className={`py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                        questionsPerQuiz === n
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow ring-1 ring-emerald-400/40'
                          : 'bg-black/40 border-white/10 text-neutral-400 hover:border-white/20 hover:text-neutral-200'
                      }`}
                    >
                      {n} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { label: '2 Minutes', seconds: 120, desc: '12s / question' },
                  { label: '2.5 Minutes', seconds: 150, desc: '15s / question' },
                  { label: '3 Minutes', seconds: 180, desc: '18s / question' }
                ].map((dur) => (
                  <button
                    key={dur.seconds}
                    type="button"
                    onClick={() => setSelectedDuration(dur.seconds)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedDuration === dur.seconds
                        ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg ring-1 ring-sky-400/50'
                        : 'bg-black/40 border-white/10 text-neutral-400 hover:border-white/20 hover:text-neutral-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{dur.label}</span>
                    <span className="text-[9px] font-mono text-neutral-500 mt-0.5 block">{dur.desc}</span>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-black/40 border border-white/5 rounded-lg flex items-center gap-2 text-[11px] text-neutral-400">
                <Icons.CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Format includes <strong>Multiple Choice (Select)</strong> and <strong>True / False</strong> questions with instant scorecard & review.</span>
              </div>
            </div>
          </div>

          {/* Action Launch Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-white/10">
            <button
              id="btn-start-knowledge-quiz"
              onClick={handleStartQuiz}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-black font-black text-sm rounded-xl shadow-xl shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center gap-3 uppercase tracking-wider group"
            >
              <Icons.Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              <span>Start Client Quiz Now</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: ACTIVE QUESTION SCREEN */}
      {quizState === 'ACTIVE' && (
        <div className="flex flex-col gap-5 bg-gradient-to-b from-[#0b101c] via-[#090d16] to-[#05070d] border border-white/10 rounded-2xl p-5 sm:p-8 shadow-2xl min-h-[580px] justify-between">
          
          {/* Top Status Bar: Progress, Timer, Category */}
          <div className="space-y-3 border-b border-white/10 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              
              {/* Category Pill */}
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <CategoryIcon name={currentQ.categoryIcon} className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-200 uppercase tracking-wide block">
                    {currentQ.category}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Question {currentQuestionIdx + 1} of {totalQuestions} • {currentQ.type === 'SELECT' ? 'Multiple Choice' : 'True / False'}
                  </span>
                </div>
              </div>

              {/* Countdown Timer with Warning Color */}
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-xs tracking-wider transition-all ${
                timeLeft <= 20
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                  : timeLeft <= 60
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-neutral-900 border-white/10 text-sky-300'
              }`}>
                <Icons.Timer className="w-4 h-4" />
                <span>TIME LEFT: {formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text Prompt */}
          <div className="py-2 space-y-2">
            <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">
              [ {currentQ.type === 'SELECT' ? 'SELECT THE BEST OPTION' : 'TRUE OR FALSE STATEMENT'} ]
            </span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Interactive Answer Area */}
          <div className="py-2">
            {/* TYPE A: MULTIPLE CHOICE (4 Options) */}
            {currentQ.type === 'SELECT' && currentQ.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt) => {
                  const isSelected = userAnswers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => { handleSelectAnswer(currentQ.id, opt.id); console.log('Answer selected:', currentQ.id, opt.id); }}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3.5 group relative overflow-hidden ${
                        isSelected
                          ? 'bg-sky-500/20 border-sky-400 text-white ring-1 ring-sky-400/50 shadow-lg shadow-sky-500/10'
                          : 'bg-neutral-900/80 border-white/10 text-neutral-300 hover:border-white/30 hover:bg-neutral-800/80'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-all ${
                        isSelected
                          ? 'bg-sky-400 text-black border-sky-400 font-black'
                          : 'bg-black/40 border-white/15 text-neutral-400 group-hover:border-white/30 group-hover:text-white'
                      }`}>
                        {opt.id}
                      </div>
                      <div className="flex-1">
                        <span className={`text-xs sm:text-sm font-semibold leading-relaxed block ${isSelected ? 'text-white' : 'text-neutral-200 group-hover:text-white'}`}>
                          {opt.text}
                        </span>
                      </div>
                      {isSelected && (
                        <Icons.CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* TYPE B: TRUE / FALSE (2 Large Buttons) */}
            {currentQ.type === 'TRUE_FALSE' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto py-2">
                {[
                  { value: 'TRUE', label: 'TRUE', sub: 'The statement is accurate', icon: 'CheckCircle2', color: 'emerald' },
                  { value: 'FALSE', label: 'FALSE', sub: 'The statement is incorrect', icon: 'XCircle', color: 'rose' }
                ].map((tf) => {
                  const isSelected = userAnswers[currentQ.id] === tf.value;
                  return (
                    <button
                      key={tf.value}
                      type="button"
                      onClick={() => { handleSelectAnswer(currentQ.id, tf.value); console.log('True/False selected:', currentQ.id, tf.value); }}
                      className={`p-6 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group ${
                        isSelected
                          ? tf.value === 'TRUE'
                            ? 'bg-emerald-500/20 border-emerald-400 text-white ring-2 ring-emerald-400/50 shadow-xl shadow-emerald-500/10'
                            : 'bg-rose-500/20 border-rose-400 text-white ring-2 ring-rose-400/50 shadow-xl shadow-rose-500/10'
                          : 'bg-neutral-900/80 border-white/10 text-neutral-400 hover:border-white/30 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      <div className={`p-3 rounded-full border ${
                        isSelected
                          ? tf.value === 'TRUE'
                            ? 'bg-emerald-500 text-black border-emerald-400'
                            : 'bg-rose-500 text-white border-rose-400'
                          : 'bg-black/50 border-white/10 text-neutral-400 group-hover:text-white'
                      }`}>
                        <Icons.CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <span className="text-lg font-black tracking-wider text-white mt-1">{tf.label}</span>
                      <span className="text-[11px] text-neutral-400">{tf.sub}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Bar: Question Jumper & Controls */}
          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Quick Question Jumper Pills */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {relevantQuestions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIdx;
                const isAnswered = !!userAnswers[q.id];
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`w-7 h-7 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center justify-center cursor-pointer ${
                      isCurrent
                        ? 'bg-sky-400 text-black ring-2 ring-sky-400/50 font-black'
                        : isAnswered
                        ? 'bg-sky-500/20 border border-sky-500/40 text-sky-300'
                        : 'bg-neutral-900 border border-white/10 text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
                className="px-4 py-2.5 bg-neutral-900 disabled:opacity-30 text-neutral-300 rounded-xl hover:bg-neutral-800 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              >
                <Icons.ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQuestionIdx < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-black rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 text-xs shadow-md shadow-sky-500/20"
                >
                  <span>Next Question</span>
                  <Icons.ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="btn-finish-quiz"
                  onClick={handleCompleteQuiz}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black rounded-xl font-black transition-all cursor-pointer flex items-center gap-2 text-xs shadow-lg shadow-emerald-500/20 uppercase tracking-wider"
                >
                  <span>Submit & View Score</span>
                  <Icons.Award className="w-4 h-4 fill-current" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: RESULTS & SCORECARD SUMMARY */}
      {quizState === 'SUMMARY' && (
        <div className="flex flex-col gap-6">
          
          {/* Main Score Hero Card */}
          <div className="bg-gradient-to-b from-[#0b1424] via-[#090d19] to-[#04060c] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
            
            {/* Sparkle background */}
            <div className="absolute top-0 right-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Icons.Award className="w-4 h-4 text-sky-400" />
              <span>Assessment Results & Scorecard</span>
            </div>

            {/* Score Ring Display */}
            <div className="relative inline-block my-1">
              <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-sky-500/20 via-blue-600/10 to-transparent border-4 border-sky-400 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.35)]">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">{scorePercentage}%</span>
                <span className="text-[11px] font-mono font-bold text-sky-300 uppercase mt-0.5">
                  {correctCount} / {totalQuestions} Correct
                </span>
              </div>
            </div>

            {/* Title & Badge */}
            <div className="space-y-2 max-w-xl mx-auto">
              <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${hasPassed ? scoreBadge.color : 'text-rose-400 bg-rose-500/10 border-rose-500/30'}`}>
                {hasPassed ? scoreBadge.title : '❌ SCORE BELOW PASSING (70% Required)'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {hasPassed
                  ? (clientName ? `Congratulations, ${clientName}!` : 'Great Job on the Octave Booth Quiz!')
                  : (clientName ? `Keep Learning, ${clientName}` : 'Score Below Passing Threshold')
                }
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${hasPassed ? 'text-neutral-300' : 'text-rose-300'}`}>
                {hasPassed
                  ? scoreBadge.message
                  : `You scored ${rawScore}% but need 70% to pass and earn an official Octave certification. Try again!`
                }
              </p>
            </div>

            {/* Dedicated Thank You Acknowledgement */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-amber-500/15 border border-sky-400/30 text-left max-w-2xl mx-auto shadow-md">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-sky-500/20 text-sky-400 shrink-0 mt-0.5">
                  <Icons.HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    Thank You for Taking the Octave Client Knowledge Quiz!
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Thank you <strong className="text-sky-300">{clientName || 'Visitor'}</strong> ({clientJobTitle || 'Presales'} at <strong className="text-amber-300">{clientCompany || 'Company Name'}</strong>) for taking our booth quiz challenge. We appreciate your engagement with the Octave enterprise portfolio at ADIPEC 2026!
                  </p>
                </div>
              </div>
            </div>

            {/* Metric Pills */}
            <div className="grid gap-3 max-w-2xl mx-auto text-left pt-2 grid-cols-2 sm:grid-cols-4">
              <div className="p-3 bg-neutral-900/80 border border-white/10 rounded-xl">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Raw Score</span>
                <span className="text-sm font-bold text-sky-400">{rawScore} / 100 Pts</span>
              </div>
              <div className="p-3 bg-neutral-900/80 border border-white/10 rounded-xl">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Accuracy</span>
                <span className="text-sm font-bold text-emerald-400">{correctCount} of {totalQuestions}</span>
              </div>
              <div className="p-3 bg-neutral-900/80 border border-white/10 rounded-xl">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Time Taken</span>
                <span className="text-sm font-bold text-amber-400">{formatTime(timeElapsed)}</span>
              </div>
              <div className="p-3 bg-neutral-900/80 border border-white/10 rounded-xl">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Questions Answered</span>
                <span className="text-sm font-bold text-purple-400">{answeredCount} of {totalQuestions}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto w-full">
              <button
                onClick={handleStartQuiz}
                className="w-full sm:w-auto flex-1 px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Icons.RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>

              {onNavigateToCertificate && hasPassed && (
                <button
                  onClick={() => onNavigateToCertificate({
                    score: scorePercentage,
                    total: 100,
                    badge: scoreBadge.title,
                    clientName: clientName || 'Ali Ibrahim',
                    companyName: clientCompany || 'Company Name',
                    jobTitle: clientJobTitle || 'Presales'
                  })}
                  className="w-full sm:w-auto flex-1 px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Icons.Award className="w-4 h-4 fill-current" />
                  <span>View Certificate</span>
                </button>
              )}

              {onNavigateToCanvas && (
                <button
                  onClick={onNavigateToCanvas}
                  className="w-full sm:w-auto flex-1 px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Icons.Layers className="w-4 h-4" />
                  <span>Build Architecture</span>
                </button>
              )}
            </div>
          </div>

          {/* SECTION: DETAILED QUESTION REVIEW & SCREEN REFERENCES */}
          <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 sm:p-7 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Icons.CheckSquare className="w-5 h-5 text-sky-400" />
                  <span>Question Review & Screen Reference Explanations</span>
                </h4>
                <p className="text-xs text-neutral-400">
                  Review the correct answers and see exactly which booth screen and architectural concept answers each question:
                </p>
              </div>

              <span className="text-xs font-mono text-neutral-400">
                Score: <strong className="text-white">{correctCount}/{totalQuestions}</strong>
              </span>
            </div>

            {/* Question Breakdown List */}
            <div className="space-y-3">
              {relevantQuestions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                const isExpanded = expandedExplanationId === q.id;

                // Format display text for answers
                let userAnsText = 'Not Answered';
                let correctAnsText = q.correctAnswer;

                if (q.type === 'SELECT' && q.options) {
                  const userOpt = q.options.find(o => o.id === userAns);
                  if (userOpt) userAnsText = `${userOpt.id}) ${userOpt.text}`;
                  const correctOpt = q.options.find(o => o.id === q.correctAnswer);
                  if (correctOpt) correctAnsText = `${correctOpt.id}) ${correctOpt.text}`;
                } else if (q.type === 'TRUE_FALSE') {
                  if (userAns) userAnsText = userAns === 'TRUE' ? '✓ TRUE' : '✗ FALSE';
                  correctAnsText = q.correctAnswer === 'TRUE' ? '✓ TRUE' : '✗ FALSE';
                }

                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      isCorrect
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-rose-500/5 border-rose-500/20'
                    }`}
                  >
                    {/* Collapsible Header */}
                    <div
                      onClick={() => setExpandedExplanationId(isExpanded ? null : q.id)}
                      className="p-4 flex items-start justify-between gap-3 cursor-pointer hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                          isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {isCorrect ? <Icons.Check className="w-4 h-4 stroke-[3]" /> : <Icons.X className="w-4 h-4 stroke-[3]" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                              Q{idx + 1} • {q.category}
                            </span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                              isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>
                          <h5 className="text-xs sm:text-sm font-bold text-neutral-200">{q.question}</h5>
                        </div>
                      </div>

                      <button className="text-neutral-400 hover:text-white p-1">
                        <Icons.ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Detailed Content / Explanation */}
                    <div className={`px-4 pb-4 pt-1 border-t border-white/5 space-y-3 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-black/40 rounded-lg border border-white/5">
                          <span className="text-[10px] font-mono text-neutral-400 block mb-0.5 uppercase">Your Answer:</span>
                          <span className={`font-semibold ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                            {userAnsText}
                          </span>
                        </div>

                        <div className="p-2.5 bg-black/40 rounded-lg border border-white/5">
                          <span className="text-[10px] font-mono text-neutral-400 block mb-0.5 uppercase">Correct Answer:</span>
                          <span className="font-semibold text-emerald-300">
                            {correctAnsText}
                          </span>
                        </div>
                      </div>

                      {/* Screen Reference & Fact */}
                      <div className="p-3 bg-neutral-900 border border-sky-500/20 rounded-xl space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-sky-400 font-mono font-bold text-[10px] uppercase">
                          <Icons.Info className="w-3.5 h-3.5" />
                          <span>Screen Reference: {q.screenSource}</span>
                        </div>
                        <p className="text-neutral-300 text-[11px] leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: CERTIFICATE DISPLAY */}
      {quizState === 'SUMMARY' && generatedCertificate && hasPassed && (
        <EnhancedCertificate
          certificateData={generatedCertificate}
          onClose={() => setGeneratedCertificate(null)}
        />
      )}
    </div>
  );
}
