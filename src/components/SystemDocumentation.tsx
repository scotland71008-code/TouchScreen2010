import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';
import { exportSystemDocumentationWord } from '../utils/docxExport';
import { OCTAVE_PORTFOLIO } from '../types';

interface SystemDocumentationProps {
  onNavigateToSection?: (section: string) => void;
}

interface DocSection {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  icon: string;
  badge: string;
  badgeColor: string;
  overview: string;
  userWorkflow: string[];
  keyCapabilities: { title: string; desc: string; icon: string }[];
  targetAudience: string;
  protocolsOrMetrics: { label: string; value: string }[];
  navTarget?: string;
  screenshotType: 'pillars' | 'canvas' | 'kpi' | 'copilot' | 'offices' | 'matrix' | 'finder' | 'quiz';
  screenshotCaption: string;
  callouts: { x: number; y: number; label: string; desc: string }[];
}

const DOC_SECTIONS: DocSection[] = [
  {
    id: 'overview',
    number: '01',
    title: 'Platform Overview & Rebranding Architecture',
    shortTitle: 'Platform Overview',
    icon: 'Layers',
    badge: 'ENTERPRISE CORE',
    badgeColor: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    overview:
      'The Octave Enterprise Presales & Architecture Platform represents the strategic culmination of over 50 years of computer-aided engineering and industrial digital twin leadership. Transitioning from legacy standalone systems (including Smart 3D, Smart P&ID, SmartPlant Foundation, and HxGN industrial software), Octave unifies capital project execution and operational lifecycle into a singular data-centric fabric.',
    targetAudience: 'Chief Technology Officers, VPs of Engineering, EPC Consortiums, Owner-Operators',
    userWorkflow: [
      'Navigate the touchscreen exhibition or desktop portal via high-contrast visual HUD navigation.',
      'Explore corporate timeline milestones from 1969 interactive CAD through modern autonomous digital twins.',
      'Authenticate with role-based access for client presales or internal solution architecting mode.'
    ],
    keyCapabilities: [
      {
        title: 'Unified Lifecycle Continuity',
        desc: 'Zero-loss data handover from FEED (Front End Engineering Design) into construction and lifelong operations.',
        icon: 'Repeat'
      },
      {
        title: 'Federated Digital Twin Spine',
        desc: 'Centralized tag-to-model graph relationships powered by Octave InConcert information hub.',
        icon: 'Database'
      },
      {
        title: 'Enterprise Touchscreen Ready',
        desc: 'Optimized for 4K exhibition touchscreen displays, touch kiosks (LEAP KSA), and executive boardrooms.',
        icon: 'Monitor'
      }
    ],
    protocolsOrMetrics: [
      { label: 'Deployment Model', value: 'Cloud-Native SaaS / Hybrid Edge' },
      { label: 'Data Standards', value: 'ISO 15926, CFIHOS, Dexpi' },
      { label: 'Legacy Lineage', value: 'Intergraph → Hexagon PPM → Octave' }
    ],
    navTarget: 'WHO_IS_OCTAVE',
    screenshotType: 'pillars',
    screenshotCaption: 'Figure 1.1: Octave Industrial Digital Lifecycle Hierarchy across DESIGN, BUILD, OPERATE, and PROTECT',
    callouts: [
      { x: 15, y: 30, label: 'DESIGN Pillar', desc: 'Forte 3D, Facets 2D & InConcert digital twin spine' },
      { x: 38, y: 30, label: 'BUILD Pillar', desc: 'Databridge Pro middleware & OnSite construction packager' },
      { x: 62, y: 30, label: 'OPERATE Pillar', desc: 'Alto multi-D visualizer & AssetSense predictive APM' },
      { x: 85, y: 30, label: 'PROTECT Pillar', desc: 'Cyber Integrity OT security & SafetyNet compliance' }
    ]
  },
  {
    id: 'pillars',
    number: '02',
    title: 'The Four Industrial Lifecycle Pillars',
    shortTitle: '4 Lifecycle Pillars',
    icon: 'Grid',
    badge: 'SOLUTION SUITE',
    badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    overview:
      'Octave divides complex industrial software capabilities into four cohesive operational phases. Each pillar provides specialized tooling designed for engineering disciplines while continuously synchronizing with the central information model.',
    targetAudience: 'Engineering Discipline Leads, Piping/Structural Engineers, Maintenance Directors, CISO/OT Security',
    userWorkflow: [
      'Filter solutions in the Portfolio Matrix by specific lifecycle phase (DESIGN, BUILD, OPERATE, PROTECT).',
      'Examine replacement mapping showing how Octave modernizes and replaces legacy industrial software suites.',
      'One-click bind solutions directly into the interactive Architecture Builder canvas.'
    ],
    keyCapabilities: [
      {
        title: 'DESIGN (CAPEX Phase)',
        desc: 'Octave Forte (Smart 3D multi-discipline modeling), Octave Facets (Smart P&ID & Electrical), and InConcert.',
        icon: 'PenTool'
      },
      {
        title: 'BUILD (Construction Phase)',
        desc: 'Databridge Pro API gateway, automated work packaging, loop verification, and spool delivery tracking.',
        icon: 'Hammer'
      },
      {
        title: 'OPERATE (OPEX Phase)',
        desc: 'Octave Alto web-based 3D digital twin, AssetSense predictive maintenance, and Tempo/J5 shift handovers.',
        icon: 'Activity'
      },
      {
        title: 'PROTECT (Security & Compliance)',
        desc: 'Cyber Integrity OT threat mitigation (IEC 62443), SafetyNet alarm rationalization, and OnCall crisis dispatch.',
        icon: 'ShieldCheck'
      }
    ],
    protocolsOrMetrics: [
      { label: 'Active Catalog', value: '25+ Enterprise Solutions' },
      { label: 'Legacy Mapping', value: '100% Backwards Compatible' },
      { label: 'Data Sync', value: 'Near Real-Time Event Streams' }
    ],
    navTarget: 'PORTFOLIO_MATRIX',
    screenshotType: 'matrix',
    screenshotCaption: 'Figure 2.1: Portfolio Matrix with Pillar filtering, Legacy Translations, and Solution Capabilities',
    callouts: [
      { x: 20, y: 15, label: 'Pillar Filter Pills', desc: 'Instant multi-discipline filtering across the enterprise' },
      { x: 75, y: 15, label: 'Legacy Search', desc: 'Type legacy names (e.g. Smart 3D) to find Octave equivalents' },
      { x: 30, y: 55, label: 'Solution Card', desc: 'Displays capabilities, products, and direct canvas binder' }
    ]
  },
  {
    id: 'canvas',
    number: '03',
    title: 'Interactive Architecture Builder & Digital Twin Canvas',
    shortTitle: 'Architecture Builder',
    icon: 'Network',
    badge: 'CORE WORKBENCH',
    badgeColor: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    overview:
      'The Architecture Builder is an interactive graphical digital twin topology workbench. Engineers and presales architects can assemble custom IT/OT architectures, define data flow protocols, test blueprints, and invoke AI sanity verification.',
    targetAudience: 'Enterprise Solution Architects, Presales Systems Engineers, System Integrators, IT/OT Specialists',
    userWorkflow: [
      'Select solutions from the categorized drawer or load an industry template (EPC Handover, Control Room Safety, Geospatial Twin).',
      'Drag and position nodes across the canvas; coordinate changes preserve topological relationships.',
      'Click port connectors between nodes to generate Unidirectional (A → B) or Bidirectional (A ⇆ B) links.',
      'Configure protocol parameters (REST, OData v4, OPC UA, ISO 15926, Kafka, gRPC).',
      'Run "AI Architectural Review" to inspect missing links, bottlenecks, and security gaps.'
    ],
    keyCapabilities: [
      {
        title: 'Dynamic Vector Interconnects',
        desc: 'Curved bezier links with animated signal pulses and inline protocol badges.',
        icon: 'GitBranch'
      },
      {
        title: 'Pre-Packaged Blueprints',
        desc: 'Instant one-click loading of verified architectures for chemical refineries, offshore rigs, and utilities.',
        icon: 'FileText'
      },
      {
        title: 'AI Sanity Review Engine',
        desc: 'Analyzes node compatibility, recommends Databridge Pro middleware where direct coupling poses risk.',
        icon: 'Sparkles'
      }
    ],
    protocolsOrMetrics: [
      { label: 'Protocols Supported', value: 'REST, OData, OPC UA, ISO 15926, Kafka, gRPC' },
      { label: 'Link Topologies', value: 'Unidirectional, Bidirectional' },
      { label: 'Export Options', value: 'JSON Topology, PDF Architecture Brief, Word Doc' }
    ],
    navTarget: 'BUILDER',
    screenshotType: 'canvas',
    screenshotCaption: 'Figure 3.1: Architecture Builder Canvas with multi-node graph and protocol badges',
    callouts: [
      { x: 18, y: 35, label: 'Source Engineering Node', desc: 'Octave Forte 3D CAD node with native output ports' },
      { x: 50, y: 50, label: 'Central Hub', desc: 'Octave InConcert digital twin spine coordinating all tags' },
      { x: 35, y: 40, label: 'Protocol Link Badge', desc: 'Click to toggle protocol (REST, OData, Kafka) and direction' },
      { x: 85, y: 30, label: 'Middleware API Shield', desc: 'Databridge Pro isolating corporate and external integrations' }
    ]
  },
  {
    id: 'kpi',
    number: '04',
    title: 'Octave Value Simulator & Executive ROI Modeling',
    shortTitle: 'Value & ROI Simulator',
    icon: 'TrendingUp',
    badge: 'EXECUTIVE METRICS',
    badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    overview:
      'The Value Simulator enables C-suite executives and financial evaluators to quantify bottom-line savings and risk mitigation. Driven by real-world benchmarks from over 1,200 industrial implementations, the model dynamically calculates CAPEX savings, OPEX reductions, and project acceleration.',
    targetAudience: 'Chief Financial Officers, VPs of Project Management, Operations Economists, Business Development',
    userWorkflow: [
      'Select an industry archetype (Oil & Gas, Petrochemicals, Power Generation, Offshore, Mining).',
      'Adjust operational parameters such as Capital Project Size ($500M - $5B+) and Annual Facility OPEX.',
      'Inspect dynamic calculation gauges showing Rework Reduction, Maintenance Cost Savings, and Unplanned Downtime avoided.',
      'Review cumulative 3-year Cash Flow and Net Present Value (NPV) graphs.'
    ],
    keyCapabilities: [
      {
        title: '42% Engineering Rework Reduction',
        desc: 'Eliminates field clash re-welds through synchronous 3D/P&ID tag integrity in Octave InConcert.',
        icon: 'Scissors'
      },
      {
        title: '28% OPEX Maintenance Savings',
        desc: 'Predictive APM and operator rounds reduce emergency breakdown callouts and overtime costs.',
        icon: 'DollarSign'
      },
      {
        title: '65% Accelerated Handover',
        desc: 'Automates EPC-to-Owner digital data validation, shaving months off commissioning schedules.',
        icon: 'Zap'
      }
    ],
    protocolsOrMetrics: [
      { label: 'Payback Period', value: '7.2 - 11.4 Months Average' },
      { label: '3-Year ROI Ratio', value: '4.8x - 6.2x Capital Outlay' },
      { label: 'Handover Quality', value: '99.8% Tag Verification Rate' }
    ],
    navTarget: 'INDUSTRIES',
    screenshotType: 'kpi',
    screenshotCaption: 'Figure 4.1: Executive KPI Simulator with Real-Time Metric Gauges and 3-Year Projection Chart',
    callouts: [
      { x: 18, y: 25, label: 'Rework Reduction Gauge', desc: '-42% fewer field changes and clash errors' },
      { x: 42, y: 25, label: 'OPEX Savings Metric', desc: '-28% annual maintenance expenditure savings' },
      { x: 68, y: 25, label: 'Handover Velocity', desc: '-65% reduction in digital twin acceptance time' },
      { x: 50, y: 75, label: '3-Year Value Chart', desc: 'Dynamic cumulative savings forecast by year' }
    ]
  },
  {
    id: 'finder',
    number: '05',
    title: 'Solutions Fit for Your Purpose (Guided Assessment)',
    shortTitle: 'Fit for Purpose',
    icon: 'Sparkles',
    badge: 'GUIDED ADVISOR',
    badgeColor: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    overview:
      'An intelligent self-service qualification wizard tailored for prospective clients exploring Octave. Through a 4-step guided assessment, the engine analyzes industry vertical, lifecycle maturity, pain points, and budget targets to recommend a targeted software bundle.',
    targetAudience: 'Prospective Buyers, Plant Managers, Procurement Teams, Digital Transformation Leads',
    userWorkflow: [
      'Step 1: Choose operational domain (Offshore Oil & Gas, Refining, Power Generation, Smart Infrastructure).',
      'Step 2: Define primary pain points (Manual data handover, high downtime, legacy 3D CAD fragmentation).',
      'Step 3: Select targeted digital twin maturity goal (Static 3D Model → Dynamic Living Asset Twin).',
      'Review customized recommended solution stack, total estimated ROI, and one-click launch into Architecture Builder.'
    ],
    keyCapabilities: [
      {
        title: 'Algorithmic Stack Assembly',
        desc: 'Maps specific client operational bottlenecks to verified Octave solution pairings.',
        icon: 'Cpu'
      },
      {
        title: 'Instant Canvas Deployment',
        desc: 'Sends recommended software stack directly into the interactive Architecture Builder with pre-wired links.',
        icon: 'ArrowRight'
      },
      {
        title: 'Budget & Timeline Estimates',
        desc: 'Provides realistic pilot implementation timelines and phased rollout milestones.',
        icon: 'Calendar'
      }
    ],
    protocolsOrMetrics: [
      { label: 'Assessment Time', value: '2 Minutes' },
      { label: 'Recommendation Accuracy', value: 'Rule-Engine Validated' },
      { label: 'Direct Transfer', value: '1-Click to Canvas' }
    ],
    navTarget: 'SOLUTION_FINDER',
    screenshotType: 'finder',
    screenshotCaption: 'Figure 5.1: Fit for Purpose Guided Questionnaire & Tailored Solution Stack Generator',
    callouts: [
      { x: 25, y: 20, label: 'Step Progress Tracker', desc: 'Guided 4-step consultative questionnaire' },
      { x: 50, y: 45, label: 'Interactive Criteria Cards', desc: 'Multi-select operational bottlenecks and objectives' },
      { x: 80, y: 70, label: 'Generate Stack Action', desc: 'Assembles matching software nodes and ROI metrics' }
    ]
  },
  {
    id: 'copilot',
    number: '06',
    title: 'Presales AI Assistant (Copilot Engine)',
    shortTitle: 'AI Presales Copilot',
    icon: 'Bot',
    badge: 'GEMINI AI',
    badgeColor: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    overview:
      'Powered by Google Gemini 2.5 Flash, the Presales AI Copilot functions as a 24/7 technical solutions architect. Uniquely, the copilot is dynamically injected with the active canvas state, understanding exactly what nodes and integrations the user has assembled.',
    targetAudience: 'Presales Engineers, Technical Bidders, System Architects, Client Project Sponsors',
    userWorkflow: [
      'Open the Presales AI Assistant tab from the primary navigation rail.',
      'Notice the Active Canvas context badge indicating synchronized nodes and protocols.',
      'Ask technical questions regarding protocols, migration paths, compliance, or architecture best practices.',
      'Use quick prompt chips (e.g. "Explain Forte to InConcert sync", "How does Databridge protect APIs?").'
    ],
    keyCapabilities: [
      {
        title: 'Topology-Aware Reasoning',
        desc: 'The AI inspects your exact canvas nodes (e.g. Forte, InConcert, Databridge) and crafts specific answers.',
        icon: 'Eye'
      },
      {
        title: 'Competitive & Migration Guidance',
        desc: 'Answers questions comparing Octave to legacy suites and outlines seamless upgrade paths.',
        icon: 'Shuffle'
      },
      {
        title: 'Security & Protocol Validation',
        desc: 'Explains OT isolation strategies, DMZ configurations, and IEC 62443 cybersecurity safeguards.',
        icon: 'Lock'
      }
    ],
    protocolsOrMetrics: [
      { label: 'AI Engine', value: 'Google Gemini 2.5 Flash' },
      { label: 'Context Injection', value: 'Real-Time Canvas Graph' },
      { label: 'Response Latency', value: '< 1.5 Seconds' }
    ],
    navTarget: 'COPILOT',
    screenshotType: 'copilot',
    screenshotCaption: 'Figure 6.1: Presales AI Copilot with Canvas Topology Ingestion & Technical Architecture Reasoning',
    callouts: [
      { x: 30, y: 20, label: 'Synchronized Topology Badge', desc: 'Shows active canvas nodes injected into prompt context' },
      { x: 75, y: 40, label: 'User Engineering Query', desc: 'Inquiring about tag synchronization protocols' },
      { x: 35, y: 65, label: 'Gemini Technical Response', desc: 'Detailed, protocol-level response with standards citation' }
    ]
  },
  {
    id: 'offices',
    number: '07',
    title: 'Global Offices & Spatial Presence',
    shortTitle: 'Global Offices',
    icon: 'Globe',
    badge: 'WORLDWIDE REACH',
    badgeColor: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    overview:
      'Octave operates eight world-class technology hubs spanning North America, Europe, the Middle East, and Asia-Pacific. The Global Offices Map provides spatial visibility, regional competencies, live local clocks, and real-time network latency telemetry.',
    targetAudience: 'Global Clients, Regional EPC Contractors, Multi-National Energy Enterprises',
    userWorkflow: [
      'Navigate the global interactive world map or click region filter buttons (ALL, Americas, EMEA, APAC).',
      'Select individual hubs to view address, headcount, primary technical disciplines, and current local time.',
      'Observe regional highlights including Global HQ (Huntsville, AL) and Middle East Hubs (Khobar & Dubai).'
    ],
    keyCapabilities: [
      {
        title: 'Global Engineering Continuity',
        desc: 'Follow-the-sun 24/7 technical support and mission-critical cloud telemetry monitoring.',
        icon: 'Clock'
      },
      {
        title: 'Strategic Energy & AI Hubs',
        desc: 'Dedicated regional hubs in Khobar (Saudi Arabia / Vision 2030) and Dubai (Regional AI & Cloud Operations).',
        icon: 'MapPin'
      },
      {
        title: 'Live Telemetry & Clocks',
        desc: 'Real-time timezone synchronization, local weather, and low-latency network interconnects.',
        icon: 'Radio'
      }
    ],
    protocolsOrMetrics: [
      { label: 'Global Centers', value: '8 Enterprise Locations' },
      { label: 'Total Personnel', value: '600+ Engineers & Architects' },
      { label: 'Primary HQ', value: 'Huntsville, Alabama, USA' }
    ],
    navTarget: 'OFFICES',
    screenshotType: 'offices',
    screenshotCaption: 'Figure 7.1: Global Office Footprint with Live Hub Indicators and Regional Interconnect Arcs',
    callouts: [
      { x: 25, y: 45, label: 'Huntsville Global HQ', desc: '180 staff, Core R&D and Global Executive Leadership' },
      { x: 60, y: 55, label: 'Khobar Hub (Saudi Arabia)', desc: 'Eastern Province Hub serving Middle East Energy (LEAP)' },
      { x: 65, y: 58, label: 'Dubai Regional HQ', desc: 'Regional operations, cloud systems & innovation lab' },
      { x: 80, y: 65, label: 'Singapore APAC Center', desc: 'Asia-Pacific regional technical expansion hub' }
    ]
  },
  {
    id: 'quiz',
    number: '08',
    title: 'Client Knowledge Quiz & Executive Certification',
    shortTitle: 'Knowledge Quiz',
    icon: 'Award',
    badge: 'CERTIFICATION',
    badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    overview:
      'An interactive 10-question evaluation designed for exhibition booth visitors and client teams to test their comprehension of the Octave portfolio. Upon successful completion, the platform generates a personalized, downloadable Enterprise Architect Certificate.',
    targetAudience: 'Exhibition Visitors, Client Engineers, System Evaluators, Training Participants',
    userWorkflow: [
      'Launch the 2-3 minute quiz from the main navigation bar.',
      'Answer multi-choice questions covering DESIGN, BUILD, OPERATE, PROTECT, and integration middleware.',
      'Receive instant explanations after each answer clarifying legacy product names and architectural benefits.',
      'Enter visitor name to generate an official Octave Certificate of Completion with verification badge.'
    ],
    keyCapabilities: [
      {
        title: '10 Core Architecture Questions',
        desc: 'Covers Smart 3D to Forte migration, InConcert digital twin spine, and Databridge Pro security.',
        icon: 'HelpCircle'
      },
      {
        title: 'Tiered Certification Badges',
        desc: 'Awards Enterprise Certified Architect (90%+), Senior Architect (70-89%), or Associate (50-69%).',
        icon: 'Shield'
      },
      {
        title: 'Printable Certificate of Merit',
        desc: 'Interactive certificate with gold foil seal, serial number, and one-click PDF/print export.',
        icon: 'Download'
      }
    ],
    protocolsOrMetrics: [
      { label: 'Evaluation Format', value: '10 Multiple Choice Questions' },
      { label: 'Passing Score', value: '70% for Senior Certification' },
      { label: 'Certificate Format', value: 'High-Res Digital & PDF' }
    ],
    navTarget: 'KNOWLEDGE_QUIZ',
    screenshotType: 'quiz',
    screenshotCaption: 'Figure 8.1: Client Knowledge Quiz with Real-Time Feedback and Tiered Executive Certification',
    callouts: [
      { x: 25, y: 25, label: 'Question Card', desc: 'Detailed scenario testing architectural portfolio knowledge' },
      { x: 50, y: 50, label: 'Multi-Choice Options', desc: 'Immediate visual feedback with technical explanation' },
      { x: 80, y: 80, label: 'Certificate Generator', desc: 'Generates personalized executive diploma upon completion' }
    ]
  }
];

export default function SystemDocumentation({ onNavigateToSection }: SystemDocumentationProps) {
  const [activeTabId, setActiveTabId] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExportingWord, setIsExportingWord] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [activeCalloutModal, setActiveCalloutModal] = useState<string | null>(null);

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleExportWord = async () => {
    try {
      setIsExportingWord(true);
      await exportSystemDocumentationWord();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to export Word document:', err);
      alert('Unable to export Word document. Please try again.');
    } finally {
      setIsExportingWord(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleScrollTo = (id: string) => {
    setActiveTabId(id);
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter sections by search query
  const filteredSections = DOC_SECTIONS.filter((sec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sec.title.toLowerCase().includes(q) ||
      sec.overview.toLowerCase().includes(q) ||
      sec.keyCapabilities.some((c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
    );
  });

  const activeSection = DOC_SECTIONS.find((s) => s.id === activeTabId) || DOC_SECTIONS[0];

  // Helper for dynamic Lucide Icons
  const LucideIcon = ({ name, className }: { name: string; className?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return <Icons.HelpCircle className={className} />;
    return <IconComponent className={className} />;
  };

  return (
    <div id="system-documentation-container" className="flex flex-col gap-6 w-full text-white animate-fade-in">
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[#090e1d]/95 border border-sky-950/80 shadow-2xl backdrop-blur-md">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-400/40 text-sky-400 shrink-0 shadow-lg">
            <Icons.BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/50 text-sky-300 font-mono text-[9.5px] font-bold uppercase tracking-widest">
                OFFICIAL SPECIFICATION
              </span>
              <span className="text-[10px] font-mono text-neutral-400">v3.4.0 Enterprise</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-1 flex items-center gap-2">
              <span>Octave System Functionality & Architecture Guide</span>
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-0.5">
              End-to-end operational handbook, technical specifications, and system screenshot diagrams.
            </p>
          </div>
        </div>

        {/* Action Buttons: Export to Word, Print PDF */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportWord}
            disabled={isExportingWord}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-sky-400/40 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isExportingWord ? (
              <>
                <Icons.Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generating Word (.docx)...</span>
              </>
            ) : (
              <>
                <Icons.FileText className="w-4 h-4 text-sky-200 group-hover:scale-110 transition-transform" />
                <span>Export as Word File (.docx)</span>
                <Icons.Download className="w-3.5 h-3.5 text-sky-300 ml-0.5" />
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl bg-[#0e172a] hover:bg-[#1e293b] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Icons.Printer className="w-4 h-4 text-neutral-400" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {exportSuccess && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-200 font-mono text-xs shadow-lg animate-bounce">
          <div className="flex items-center gap-2.5">
            <Icons.CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Word Document Downloaded:</strong> "Octave_System_Functionality_Documentation.docx" has been compiled with all embedded screenshot figures and tables!
            </span>
          </div>
          <button onClick={() => setExportSuccess(false)} className="text-emerald-400 hover:text-white cursor-pointer">
            <Icons.X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Search & Section Jump Rail */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-[#060a14] border border-white/10">
        <div className="relative flex-1 max-w-md">
          <Icons.Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documentation (e.g. InConcert, Forte, OData, REST, KPI, Quiz)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0c1322] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-400 font-mono"
          />
        </div>

        {/* Horizontal Quick Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {DOC_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => handleScrollTo(sec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTabId === sec.id
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'bg-[#0b1220] text-neutral-400 hover:text-white hover:bg-[#131d33] border border-white/5'
              }`}
            >
              <span>{sec.number}.</span>
              <span>{sec.shortTitle}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Content Grid (Two-Column: Table of Contents + Active Document Body) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Table of Contents Nav (Col-span 3) */}
        <div className="xl:col-span-3 p-4 rounded-2xl bg-[#090e1d]/90 border border-sky-950/80 shadow-2xl flex flex-col gap-3 sticky top-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest">
              SYSTEM SECTIONS
            </span>
            <span className="text-[9.5px] font-mono text-neutral-400">
              {filteredSections.length} of {DOC_SECTIONS.length}
            </span>
          </div>

          <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
            {filteredSections.map((sec) => {
              const isSelected = activeTabId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleScrollTo(sec.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400/70 shadow-md text-white font-bold'
                      : 'bg-[#040711] border-white/10 hover:border-white/20 text-neutral-300'
                  }`}
                >
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                    isSelected ? 'bg-sky-400 text-slate-950 font-bold' : 'bg-white/10 text-neutral-400'
                  }`}>
                    {sec.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold leading-tight truncate">{sec.shortTitle}</p>
                    <span className="text-[9px] font-mono text-neutral-400 block mt-0.5 uppercase tracking-wider">
                      {sec.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
            <span className="text-[10px] font-mono text-neutral-400">Quick Word Export:</span>
            <button
              onClick={handleExportWord}
              disabled={isExportingWord}
              className="w-full py-2 px-3 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-300 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
            >
              <Icons.FileDown className="w-3.5 h-3.5" />
              <span>Download .docx File</span>
            </button>
          </div>
        </div>

        {/* Right Active Document Body (Col-span 9) */}
        <div className="xl:col-span-9 flex flex-col gap-8">
          {filteredSections.map((sec) => (
            <div
              key={sec.id}
              ref={(el) => {
                sectionRefs.current[sec.id] = el;
              }}
              className="p-5 sm:p-7 rounded-2xl bg-[#090e1d]/95 border border-sky-950/80 shadow-2xl flex flex-col gap-6 relative overflow-hidden"
            >
              <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-sky-400 via-emerald-400 to-purple-400" />

              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-black bg-sky-400 text-slate-950">
                      SECTION {sec.number}
                    </span>
                    <span className={`px-2 py-0.5 rounded border text-[9.5px] font-mono font-bold uppercase tracking-wider ${sec.badgeColor}`}>
                      {sec.badge}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-2">
                    {sec.title}
                  </h2>
                </div>

                {sec.navTarget && onNavigateToSection && (
                  <button
                    onClick={() => onNavigateToSection(sec.navTarget!)}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    <span>Launch Module</span>
                    <Icons.ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Overview Text */}
              <div>
                <h4 className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider mb-1.5">
                  1. Functional Overview & Scope
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-neutral-300 font-normal">
                  {sec.overview}
                </p>
              </div>

              {/* INTERACTIVE SECTION INFO - Removed outdated screenshots */}
              <div className="rounded-xl border border-sky-900/50 bg-[#040814] overflow-hidden shadow-2xl flex flex-col">
                {/* Section Info Header */}
                <div className="flex items-center justify-between px-3.5 py-2 bg-[#0a1122] border-b border-white/10 text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block animate-pulse" />
                    <span className="ml-2 font-bold text-neutral-200 text-[11px]">
                      {sec.screenshotCaption}
                    </span>
                  </div>
                  <span className="text-[10px] text-sky-400 font-bold">
                    ✓ LIVE IN APP
                  </span>
                </div>

                {/* Section Info Canvas */}
                <div className="relative w-full bg-gradient-to-b from-[#060b18] to-[#02050c] p-4 flex flex-col gap-4 overflow-hidden min-h-[200px]">

                  {/* Info Box - Cleaner alternative to mock screenshots */}
                  <div className="relative z-10 flex flex-col items-center justify-center gap-3 my-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                      LIVE FEATURE IN APPLICATION
                    </div>
                    <p className="text-sm text-neutral-300 max-w-xs">
                      {sec.screenshotCaption}
                    </p>
                    {sec.navTarget && onNavigateToSection && (
                      <button
                        onClick={() => onNavigateToSection(sec.navTarget!)}
                        className="mt-2 px-4 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/60 text-sky-300 hover:text-sky-200 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Icons.ExternalLink className="w-3.5 h-3.5" />
                        View Live Demo
                      </button>
                    )}
                  </div>

                  {/* Old code - commented for reference - remove in future:
                  {sec.screenshotType === 'pillars' && (
                    <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto">
                      {[
                        { title: 'DESIGN', color: 'border-sky-400 text-sky-300 bg-sky-500/10', sub: 'Forte 3D, Facets, InConcert' },
                        { title: 'BUILD', color: 'border-amber-400 text-amber-300 bg-amber-500/10', sub: 'Databridge Pro, OnSite Packages' },
                        { title: 'OPERATE', color: 'border-pink-400 text-pink-300 bg-pink-500/10', sub: 'Alto Digital Twin, AssetSense' },
                        { title: 'PROTECT', color: 'border-emerald-400 text-emerald-300 bg-emerald-500/10', sub: 'Cyber Integrity, SafetyNet' }
                      ].map((item, i) => (
                        <div key={i} className={`p-3 rounded-xl border ${item.color} flex flex-col gap-1 shadow-lg`}>
                          <span className="font-mono text-xs font-black uppercase">{item.title}</span>
                          <span className="text-[10px] font-mono text-neutral-400">{item.sub}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.screenshotType === 'canvas' && (
                    <div className="relative z-10 flex flex-col gap-4 my-auto">
                      <div className="flex items-center justify-between bg-[#0b1428] border border-sky-400/40 p-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs font-mono font-bold text-white">Octave Forte (3D CAD)</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/40">
                          Native REST ⇆ OData
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                          <span className="text-xs font-mono font-bold text-white">Octave InConcert Hub</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-[10px] font-mono animate-pulse">
                          ↓ Continuous Tag & Bounding Box Synchronizer
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-[#0b1428] border border-amber-400/40 p-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span className="text-xs font-mono font-bold text-white">Databridge Pro (API Shield)</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                          Kafka Bus / JSON API
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                          <span className="text-xs font-mono font-bold text-white">Octave Alto Visualizer</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {sec.screenshotType === 'kpi' && (
                    <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-auto">
                      {[
                        { label: 'Rework Reduction', val: '-42%', col: 'text-sky-400 border-sky-400/40' },
                        { label: 'OPEX Savings', val: '-28%', col: 'text-emerald-400 border-emerald-400/40' },
                        { label: 'Handover Velocity', val: '-65%', col: 'text-amber-400 border-amber-400/40' },
                        { label: 'Downtime Avoided', val: '310 Hrs', col: 'text-pink-400 border-pink-400/40' }
                      ].map((item, i) => (
                        <div key={i} className={`p-3 rounded-xl bg-[#091020] border ${item.col} flex flex-col items-center justify-center`}>
                          <span className="text-[9.5px] font-mono text-neutral-400">{item.label}</span>
                          <span className="text-2xl font-black font-mono mt-1">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.screenshotType === 'copilot' && (
                    <div className="relative z-10 flex flex-col gap-2.5 my-auto max-w-xl mx-auto w-full">
                      <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs font-mono text-purple-300 flex items-center gap-2">
                        <Icons.Bot className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>Topology Context: 5 Active Nodes (Forte, Facets, InConcert, Databridge, Alto)</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0d162d] border border-white/10 text-xs text-neutral-200">
                        <p className="font-mono text-[10px] text-sky-400 font-bold mb-1">USER QUERY:</p>
                        "How does InConcert prevent orphaned tags during 3D model handover?"
                      </div>
                      <div className="p-3 rounded-xl bg-[#091124] border border-purple-500/40 text-xs text-neutral-200">
                        <p className="font-mono text-[10px] text-purple-400 font-bold mb-1">GEMINI 2.5 COPILOT:</p>
                        "Octave InConcert registers a unified relationship graph. When tags are authored in Forte or Facets, CFIHOS class rules automatically flag discrepancies before final sign-off."
                      </div>
                    </div>
                  )}

                  {sec.screenshotType === 'offices' && (
                    <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5 my-auto">
                      {[
                        { city: 'Huntsville', role: 'Global HQ', color: 'text-amber-400 border-amber-400/50' },
                        { city: 'Khobar', role: 'Eastern Province (LEAP)', color: 'text-emerald-400 border-emerald-400/50' },
                        { city: 'Dubai', role: 'Regional HQ', color: 'text-purple-400 border-purple-500/50' },
                        { city: 'Houston', role: 'Offshore Energy', color: 'text-sky-400 border-sky-400/50' },
                        { city: 'London', role: 'Europe Ops', color: 'text-sky-400 border-sky-400/50' },
                        { city: 'Singapore', role: 'Asia-Pacific', color: 'text-sky-400 border-sky-400/50' }
                      ].map((item, i) => (
                        <div key={i} className={`p-2 rounded-xl bg-[#080e1e] border ${item.color} flex items-center gap-2`}>
                          <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                          <div>
                            <p className="text-xs font-bold leading-none">{item.city}</p>
                            <p className="text-[9px] font-mono text-neutral-400">{item.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.screenshotType === 'matrix' && (
                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-auto">
                      {[
                        { name: 'Octave Forte', legacy: 'Formerly Smart 3D', pillar: 'DESIGN' },
                        { name: 'Octave InConcert', legacy: 'Formerly SmartPlant Foundation', pillar: 'DESIGN' },
                        { name: 'Databridge Pro', legacy: 'Formerly HxGN DataBridge', pillar: 'MIDDLEWARE' }
                      ].map((item, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#0b1428] border border-sky-400/30 flex flex-col gap-1">
                          <span className="text-[9px] font-mono font-bold text-sky-400">{item.pillar}</span>
                          <span className="text-sm font-bold">{item.name}</span>
                          <span className="text-[10px] font-mono text-neutral-400">{item.legacy}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.screenshotType === 'finder' && (
                    <div className="relative z-10 flex flex-col gap-2 my-auto max-w-lg mx-auto w-full">
                      <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-400/40 flex items-center justify-between text-xs font-mono">
                        <span className="text-purple-300">Domain: Refining & Petrochem</span>
                        <span className="text-emerald-400 font-bold">Recommended: 4 Solutions</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#091122] border border-white/10 text-xs font-mono flex items-center justify-between">
                        <span>● Octave Forte (3D) + InConcert + Alto + AssetSense</span>
                        <span className="text-sky-400 font-bold">1-Click To Canvas</span>
                      </div>
                    </div>
                  )}

                  {sec.screenshotType === 'quiz' && (
                    <div className="relative z-10 flex flex-col items-center justify-center gap-2 my-auto text-center">
                      <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/60 text-amber-300 flex items-center gap-2">
                        <Icons.Award className="w-6 h-6" />
                        <span className="font-mono text-sm font-black">OCTAVE CERTIFIED ENTERPRISE ARCHITECT</span>
                      </div>
                      <p className="text-xs font-mono text-neutral-300">
                        Score: 10/10 (100%) &bull; Issued to: Client Executive
                      </p>
                    </div>
                  )}

                  */}
                </div>
              </div>

              {/* Step-by-Step User Workflow */}
              <div>
                <h4 className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider mb-2">
                  2. User Operation & Step-by-Step Execution Workflow
                </h4>
                <div className="space-y-2">
                  {sec.userWorkflow.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#050813] border border-white/5">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-mono">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Capabilities */}
              <div>
                <h4 className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider mb-2">
                  3. Key Architectural Capabilities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {sec.keyCapabilities.map((cap, cIdx) => (
                    <div key={cIdx} className="p-3.5 rounded-xl bg-[#050813] border border-white/10 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <LucideIcon name={cap.icon} className="w-4 h-4 text-sky-400" />
                        <h5 className="text-xs font-bold text-white">{cap.title}</h5>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        {cap.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Specifications & Protocols Table */}
              <div>
                <h4 className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider mb-2">
                  4. Data Specifications & Target Benchmark Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sec.protocolsOrMetrics.map((item, mIdx) => (
                    <div key={mIdx} className="p-2.5 rounded-lg bg-[#040711] border border-white/10 flex flex-col">
                      <span className="text-[9px] font-mono text-neutral-400 uppercase">{item.label}</span>
                      <span className="text-xs font-mono font-bold text-sky-300 mt-0.5">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
