export type PillarType = 'DESIGN' | 'BUILD' | 'OPERATE' | 'PROTECT' | 'MIDDLEWARE' | 'THIRD_PARTY';

export interface ProductInfo {
  name: string;
  legacyName?: string;
}

export interface OctaveSolution {
  id: string;
  name: string;
  pillar: PillarType;
  category: string;
  description: string;
  legacyDescription?: string;
  replacesWith?: string[]; // Legacy systems replaced
  products: ProductInfo[];
  icon: string; // lucide icon name
}

export interface CanvasNode {
  id: string;
  solutionId: string;
  name: string;
  pillar: PillarType;
  x: number;
  y: number;
}

export interface CanvasIntegration {
  id: string;
  sourceId: string;
  targetId: string;
  direction: 'unidirectional' | 'bidirectional';
  protocol: string;
  purpose: string;
}

export interface BlueprintTemplate {
  name: string;
  description: string;
  icon: string;
  nodes: { solutionId: string; x: number; y: number }[];
  integrations: {
    sourceIdx: number;
    targetIdx: number;
    direction: 'unidirectional' | 'bidirectional';
    protocol: string;
    purpose: string;
  }[];
}

export const OCTAVE_PORTFOLIO: OctaveSolution[] = [
  // --- MIDDLEWARE ---
  {
    id: 'node-databridge',
    name: 'Databridge Pro',
    pillar: 'MIDDLEWARE',
    category: 'Middleware & Integration',
    description: 'Central data integration middleware that guarantees secure API traffic shielding, cross-platform lifecycle data flow, and minimal security risk.',
    legacyDescription: 'Formerly HxGN DataBridge Pro',
    replacesWith: ['HxGN DataBridge Pro', 'External Integration Brokers'],
    products: [
      { name: 'Databridge Core Engine', legacyName: 'DataBridge Server' },
      { name: 'Databridge REST API Client', legacyName: 'REST Link' },
      { name: 'Databridge SAP Integration', legacyName: 'SAP RF Link' }
    ],
    icon: 'Shuffle'
  },
  // --- THIRD PARTY ---
  {
    id: 'node-sappm',
    name: 'SAP PM / ERP',
    pillar: 'THIRD_PARTY',
    category: 'Enterprise Asset Management & ERP',
    description: 'Third-party SAP Plant Maintenance & S/4HANA ERP system for enterprise work orders, inventory, and procurement.',
    products: [
      { name: 'SAP PM Work Orders' },
      { name: 'SAP S/4HANA Asset Management' },
      { name: 'SAP MM Materials Mgmt' }
    ],
    icon: 'Database'
  },
  {
    id: 'node-oracle-primavera',
    name: 'Oracle Primavera P6',
    pillar: 'THIRD_PARTY',
    category: 'Project Controls & Scheduling',
    description: 'Third-party Oracle Primavera P6 & Unifier enterprise project portfolio and schedule management system.',
    products: [
      { name: 'Primavera P6 Schedules' },
      { name: 'Primavera Unifier Capital Projects' }
    ],
    icon: 'Calendar'
  },
  {
    id: 'node-ibm-maximo',
    name: 'IBM Maximo EAM',
    pillar: 'THIRD_PARTY',
    category: 'Enterprise Asset Management',
    description: 'Third-party IBM Maximo Application Suite for asset maintenance, work orders, and reliability tracking.',
    products: [
      { name: 'Maximo Work Management' },
      { name: 'Maximo Asset Health' }
    ],
    icon: 'Server'
  },
  {
    id: 'node-salesforce',
    name: 'Salesforce CRM',
    pillar: 'THIRD_PARTY',
    category: 'Customer Relationship & Service',
    description: 'Third-party Salesforce Service Cloud & Field Service for customer requests and dispatching field technicians.',
    products: [
      { name: 'Salesforce Field Service' },
      { name: 'Salesforce Service Cloud' }
    ],
    icon: 'Users'
  },
  {
    id: 'node-osisoft-pi',
    name: 'OSIsoft PI / AVEVA Historian',
    pillar: 'THIRD_PARTY',
    category: 'Operational Historian',
    description: 'Third-party OSIsoft PI System & AVEVA Historian for real-time sensor, time-series, and telemetry ingestion.',
    products: [
      { name: 'PI Asset Framework (PI AF)' },
      { name: 'PI Vision Real-time Dashboards' }
    ],
    icon: 'Activity'
  },
  {
    id: 'node-ms-dynamics',
    name: 'Microsoft Dynamics 365',
    pillar: 'THIRD_PARTY',
    category: 'Enterprise Resource Planning',
    description: 'Third-party Microsoft Dynamics 365 Finance & Supply Chain ERP system.',
    products: [
      { name: 'Dynamics Supply Chain' },
      { name: 'Dynamics Asset Management' }
    ],
    icon: 'Briefcase'
  },
  {
    id: 'node-scada-gateway',
    name: 'SCADA / OPC UA Gateway',
    pillar: 'THIRD_PARTY',
    category: 'Industrial Control & OT',
    description: 'Industrial SCADA, DCS, and OPC UA telemetry collector for live operational plant data.',
    products: [
      { name: 'OPC UA Telemetry Stream' },
      { name: 'Modbus / Profibus Gateway' }
    ],
    icon: 'Radio'
  },
  {
    id: 'node-custom-thirdparty',
    name: 'Custom Legacy Enterprise System',
    pillar: 'THIRD_PARTY',
    category: 'Generic REST / Webhook API',
    description: 'User-defined third-party enterprise system or legacy SQL database endpoint.',
    products: [
      { name: 'Custom REST API Connector' },
      { name: 'Webhook Event Receiver' },
      { name: 'Legacy SQL Database Link' }
    ],
    icon: 'Globe'
  },
  // --- DESIGN PILLAR ---
  {
    id: 'node-forte',
    name: 'Octave Forte',
    pillar: 'DESIGN',
    category: 'Schematics and 3D modeling',
    description: 'Advanced design and 3D visualization platform for industrial plants, marine vessels, and structural engineering projects.',
    legacyDescription: 'Formerly Design & Visualization',
    replacesWith: ['Intergraph Smart 3D', 'Smart Review', 'Smart Interop Publisher'],
    products: [
      { name: 'Forte 3D', legacyName: 'Intergraph Smart 3D' },
      { name: 'Forte Review', legacyName: 'Intergraph Smart Review' },
      { name: 'Forte Interop', legacyName: 'Intergraph Smart Interop Publisher' },
      { name: 'Forte Isogen', legacyName: 'Isogen' },
      { name: 'Forte Isometrics', legacyName: 'Intergraph Smart Isometrics' },
      { name: 'Forte Reference Data', legacyName: 'Intergraph Smart Reference Data' },
      { name: 'Standard Database for Forte Reference Data', legacyName: 'Standard Database for Smart Reference Data' },
      { name: 'CloudWorx for Forte 3D', legacyName: 'CloudWorx for Smart 3D' },
      { name: 'CloudWorx for Forte Review', legacyName: 'CloudWorx for Smart Review' },
      { name: 'CloudWorx for Forte Isometrics', legacyName: 'CloudWorx for Smart Isometrics' },
      { name: 'Forte 3DWorx', legacyName: 'CADWorx Plant Professional' },
      { name: 'Forte StructureWorx', legacyName: 'CADWorx Structure' },
      { name: 'Forte ReviewWorx', legacyName: 'CADWorx Design Review' },
      { name: 'Orthogen for Forte 3DWorx', legacyName: 'Orthogen for CADWorx' }
    ],
    icon: 'Wrench'
  },
  {
    id: 'node-facets',
    name: 'Octave Facets',
    pillar: 'DESIGN',
    category: 'Schematics and 3D modeling',
    description: 'Comprehensive electrical, instrumentation, and piping schematic generation and process flow design tools.',
    legacyDescription: 'Formerly Engineering & Schematics',
    replacesWith: ['Intergraph Smart P&ID', 'Intergraph Smart Instrumentation', 'Intergraph Smart Electrical'],
    products: [
      { name: 'Facets P&ID', legacyName: 'Intergraph Smart P&ID' },
      { name: 'Facets P&ID Design Validation', legacyName: 'Intergraph Smart P&ID Design Validation' },
      { name: 'Facets Instrumentation', legacyName: 'Intergraph Smart Instrumentation' },
      { name: 'Facets Electrical', legacyName: 'Intergraph Smart Electrical' },
      { name: 'Facets P&IDWorx', legacyName: 'CADWorx P&ID' },
      { name: 'SmartSketch' }
    ],
    icon: 'Network'
  },
  {
    id: 'node-bricscad',
    name: 'Octave BricsCAD',
    pillar: 'DESIGN',
    category: 'Schematics and 3D modeling',
    description: 'High-performance DWG-based CAD software offering an familiar interface with advanced 2D drafting and 3D modeling capabilities.',
    legacyDescription: 'Formerly Bricsys BricsCAD',
    replacesWith: ['Bricsys BricsCAD'],
    products: [
      { name: 'BricsCAD Lite' },
      { name: 'BricsCAD Pro' },
      { name: 'BricsCAD BIM' },
      { name: 'BricsCAD Mechanical' },
      { name: 'BricsCAD Ultimate' }
    ],
    icon: 'Compass'
  },
  {
    id: 'node-aspect',
    name: 'Octave Aspect',
    pillar: 'DESIGN',
    category: 'Engineering Analysis',
    description: 'Advanced structural, piping system stress, and pressurized vessel engineering and mathematical design analysis.',
    legacyDescription: 'Formerly Engineering Analysis',
    replacesWith: ['CAESAR II', 'PV Elite', 'GT STRUDL', 'PIPESTRESS', 'TANK'],
    products: [
      { name: 'Aspect Pipe Stress', legacyName: 'CAESAR II' },
      { name: 'Aspect Pressure Vessel', legacyName: 'PV Elite' },
      { name: 'Aspect Structure', legacyName: 'GT STRUDL' },
      { name: 'Aspect Nuclear Pipe Stress', legacyName: 'PIPESTRESS' },
      { name: 'Aspect Tank', legacyName: 'TANK' }
    ],
    icon: 'Layers'
  },
  {
    id: 'node-inconcert',
    name: 'Octave InConcert',
    pillar: 'DESIGN',
    category: 'Engineering information management',
    description: 'Centralized engineering information and document management repository, establishing an integrated digital twin core.',
    legacyDescription: 'Formerly Information Management',
    replacesWith: ['HxGN SDx2', 'HxGN SDx', 'SmartPlant Foundation'],
    products: [
      { name: 'InConcert', legacyName: 'HxGN SDx2' },
      { name: 'InConcert Core', legacyName: 'HxGN SDx' },
      { name: 'SmartPlant Foundation' }
    ],
    icon: 'FolderGit'
  },
  {
    id: 'node-geomedia',
    name: 'Octave GeoMedia',
    pillar: 'DESIGN',
    category: 'Geospatial Intelligence',
    description: 'Powerful geographic information system (GIS) tailored for mapping, intelligence processing, and geospatial databases.',
    legacyDescription: 'Formerly GeoMedia',
    replacesWith: ['GeoMedia', 'GeoMedia WebMap', 'GeoMedia Portal', 'Geospatial SDI', 'ImageStation'],
    products: [
      { name: 'GeoMedia' },
      { name: 'GeoMedia WebMap' },
      { name: 'GeoMedia Portal', legacyName: 'Geospatial Portal' },
      { name: 'GeoMedia Data Infrastructure', legacyName: 'Geospatial SDI' },
      { name: 'ImageStation' },
      { name: 'SafeHaul', legacyName: 'HxGN SafeHaul' },
      { name: 'SafeRoads', legacyName: 'HxGN SafeRoads' }
    ],
    icon: 'Map'
  },
  {
    id: 'node-alto',
    name: 'Octave Alto',
    pillar: 'DESIGN',
    category: 'Geospatial Intelligence',
    description: 'High-performance geospatial visualization development platforms and smart digital site twins for instant situational analysis.',
    legacyDescription: 'Formerly Luciad',
    replacesWith: ['LuciadRIA', 'LuciadFusion', 'LuciadLightspeed', 'LuciadCPillar', 'M.App Enterprise'],
    products: [
      { name: 'Alto Browser', legacyName: 'LuciadRIA' },
      { name: 'Alto Server', legacyName: 'LuciadFusion' },
      { name: 'Alto Lightspeed', legacyName: 'LuciadLightspeed' },
      { name: 'Alto Universal', legacyName: 'LuciadCPillar' },
      { name: 'Alto Enterprise', legacyName: 'M.App Enterprise' },
      { name: 'Alto Data Management', legacyName: 'ERDAS APOLLO' },
      { name: 'Alto Twin', legacyName: 'HxGN Smart Sites' },
      { name: 'Alto Mass Transit', legacyName: 'HxGN Mass Transit' }
    ],
    icon: 'Globe'
  },
  {
    id: 'node-imagine',
    name: 'Octave Imagine',
    pillar: 'DESIGN',
    category: 'Geospatial Intelligence',
    description: 'Remote sensing imagery analysis and spatial modeling environment to process aerial and satellite data.',
    legacyDescription: 'Formerly ERDAS IMAGINE',
    replacesWith: ['ERDAS IMAGINE', 'GeoCompressor', 'PRO600', 'ECW Compression'],
    products: [
      { name: 'Imagine', legacyName: 'ERDAS IMAGINE' },
      { name: 'GeoCompressor' },
      { name: 'Pro600', legacyName: 'PRO600' },
      { name: 'ECW Compression' },
      { name: 'Imagine Web', legacyName: 'M.App X' }
    ],
    icon: 'Eye'
  },

  // --- BUILD PILLAR ---
  {
    id: 'node-onsite',
    name: 'Octave OnSite',
    pillar: 'BUILD',
    category: 'Construction and supply chain management',
    description: 'Comprehensive construction execution management suite, spanning detailing, completions tracking, and field assembly.',
    legacyDescription: 'Formerly Construction Suite',
    replacesWith: ['Intergraph Smart Construction', 'Intergraph Smart Completions', 'Intergraph Smart Production', 'iConstruct PRO'],
    products: [
      { name: 'OnSite Construction Planning', legacyName: 'Intergraph Smart Construction' },
      { name: 'OnSite Completions', legacyName: 'Intergraph Smart Completions' },
      { name: 'OnSite Production', legacyName: 'Intergraph Smart Production' },
      { name: 'OnSite Visualize', legacyName: 'iConstruct PRO' },
      { name: 'OnSite Visualize Max', legacyName: 'iConstruct MAX' },
      { name: 'OnSite Spool Design', legacyName: 'Intergraph Spoolgen' }
    ],
    icon: 'Hammer'
  },
  {
    id: 'node-loop',
    name: 'Octave Loop',
    pillar: 'BUILD',
    category: 'Construction and supply chain management',
    description: 'Enterprise material procurement, supply chain tracking, and digital site warehousing tools for engineering projects.',
    legacyDescription: 'Formerly HxGN Supply Chain',
    replacesWith: ['HxGN Supply Chain Core', 'HxGN Supply Chain Contracts', 'Jovix', 'Smart Materials'],
    products: [
      { name: 'Loop Core', legacyName: 'HxGN Supply Chain Core' },
      { name: 'Loop Contracts', legacyName: 'HxGN Supply Chain Contracts' },
      { name: 'Loop Material Readiness', legacyName: 'Jovix' },
      { name: 'Smart Materials' }
    ],
    icon: 'RotateCw'
  },
  {
    id: 'node-sequence',
    name: 'Octave Sequence',
    pillar: 'BUILD',
    category: 'Project Performance',
    description: 'Capital project controls, performance analytics, and dynamic project budgeting and scheduling alignment.',
    legacyDescription: 'Formerly EcoSys & Projectmates',
    replacesWith: ['EcoSys', 'EcoSys Connect', 'Projectmates'],
    products: [
      { name: 'Sequence Enterprise', legacyName: 'EcoSys' },
      { name: 'Sequence Data Integration', legacyName: 'EcoSys Connect' },
      { name: 'Projectmates' }
    ],
    icon: 'LineChart'
  },

  // --- OPERATE PILLAR ---
  {
    id: 'node-inservice',
    name: 'Octave InService',
    pillar: 'OPERATE',
    category: 'Operations Optimization',
    description: 'Real-time utility network operations, outage management, and field technician dispatch software.',
    legacyDescription: 'Formerly HxGN InService',
    replacesWith: ['HxGN InService Foundation'],
    products: [
      { name: 'InService', legacyName: 'HxGN Inservice Foundation' }
    ],
    icon: 'Activity'
  },
  {
    id: 'node-networks',
    name: 'Octave NetWorks',
    pillar: 'OPERATE',
    category: 'Operations Optimization',
    description: 'Geospatial network mapping, asset tracking, and infrastructure management system for communication and utility networks.',
    legacyDescription: 'Formerly HxGN NetWorks',
    replacesWith: ['HxGN NetWorks Comms', 'HxGN NetWorks Utilities', 'HxGN NetWorks Framework'],
    products: [
      { name: 'NetWorks Comms', legacyName: 'HxGN NetWorks Comms' },
      { name: 'NetWorks Utilities', legacyName: 'HxGN NetWorks Utilities' },
      { name: 'NetWorks Framework', legacyName: 'HxGN NetWorks Framework' }
    ],
    icon: 'Cpu'
  },
  {
    id: 'node-tempo',
    name: 'Octave Tempo',
    pillar: 'OPERATE',
    category: 'Operations Optimization',
    description: 'Operations management, control room shift handover, and control system software and safety compliance tools.',
    legacyDescription: 'Formerly Operations Mgmt',
    replacesWith: ['j5 Operations Management Solutions', 'AcceleratorKMS', 'PAS PlantState Integrity', 'PAS Automation Integrity'],
    products: [
      { name: 'Tempo Operations Management', legacyName: 'j5 Operations Management Solutions' },
      { name: 'Tempo Operating Procedures', legacyName: 'AcceleratorKMS' },
      { name: 'Tempo Control System Effectiveness', legacyName: 'PAS PlantState Integrity' },
      { name: 'Tempo Automation Integrity', legacyName: 'PAS Automation Integrity' }
    ],
    icon: 'Clock'
  },
  {
    id: 'node-attune',
    name: 'Octave Attune',
    pillar: 'OPERATE',
    category: 'Asset performance and quality assurance',
    description: 'Enterprise Asset Management (EAM) and Asset Performance Management (APM) for plant optimization and uptime analytics.',
    legacyDescription: 'Formerly HxGN EAM / HxGN APM',
    replacesWith: ['HxGN EAM', 'HxGN APM'],
    products: [
      { name: 'Attune EAM', legacyName: 'HxGN EAM' },
      { name: 'Attune APM', legacyName: 'HxGN APM' }
    ],
    icon: 'Sliders'
  },
  {
    id: 'node-reliance',
    name: 'Octave Reliance',
    pillar: 'OPERATE',
    category: 'Asset performance and quality assurance',
    description: 'Operational health and safety, enterprise risk analysis, compliance audits, and total quality assurance.',
    legacyDescription: 'Formerly ETQ Reliance',
    replacesWith: ['ETQ Reliance Platform', 'ETQ Reliance Core'],
    products: [
      { name: 'Reliance Platform', legacyName: 'ETQ Reliance Platform' },
      { name: 'Reliance Core', legacyName: 'ETQ Reliance Core' },
      { name: 'Reliance New Product Introduction' },
      { name: 'Reliance Nonconformance Handling' },
      { name: 'Reliance Supply Chain' },
      { name: 'Reliance Enterprise Risk Management' },
      { name: 'Reliance Life Science Compliance' },
      { name: 'Reliance Health and Safety' },
      { name: 'Reliance Quality Events' },
      { name: 'Reliance Lab Investigation' },
      { name: 'Reliance Quality Data Lake' },
      { name: 'Reliance Insights' }
    ],
    icon: 'ShieldCheck'
  },

  // --- PROTECT PILLAR ---
  {
    id: 'node-oncall',
    name: 'Octave OnCall',
    pillar: 'PROTECT',
    category: 'Public safety and physical security',
    description: 'Mission-critical dispatch, record management, public emergency safety call-taking, and emergency planning suites.',
    legacyDescription: 'Formerly HxGN OnCall',
    replacesWith: ['HxGN OnCall Dispatch', 'HxGN OnCall Analytics', 'I/CAD', 'OnCall Connect'],
    products: [
      { name: 'OnCall Dispatch' },
      { name: 'OnCall Analytics' },
      { name: 'OnCall Records' },
      { name: 'OnCall Security', legacyName: 'HxGN OnCall Security | Guardian' },
      { name: 'OnCall Planning and Response' },
      { name: 'OnCall Dispatch Advisor', legacyName: 'Smart Advisor' },
      { name: 'I/CAD', legacyName: 'Intergraph Computer-Aided Dispatch' },
      { name: 'OnCall Connect', legacyName: 'HxGN Connect' },
      { name: 'Unified Communications Radio Suite' }
    ],
    icon: 'Radio'
  },
  {
    id: 'node-coda',
    name: 'Octave Coda',
    pillar: 'PROTECT',
    category: 'Public safety and physical security',
    description: 'Multi-sensor data orchestration, video surveillance cloud platforms, and spatial radar security processing.',
    legacyDescription: 'Formerly HxGN dC3',
    replacesWith: ['HxGN dC3 Orchestrator', 'HxGN dC3 Designer', 'HxGN dC3 LidarVision', 'Ocularis'],
    products: [
      { name: 'Coda Orchestrator', legacyName: 'HxGN dC3 Orchestrator' },
      { name: 'Coda Designer', legacyName: 'HxGN dC3 Designer' },
      { name: 'Coda Spatial', legacyName: 'HxGN dC3 LidarVision' },
      { name: 'Coda Video' },
      { name: 'Coda Video Cloud', legacyName: 'HxGN dC3 Video | Cloud' },
      { name: 'Coda Umbrella' },
      { name: 'Ocularis' }
    ],
    icon: 'Video'
  },
  {
    id: 'node-cyber',
    name: 'Octave Cyber Integrity',
    pillar: 'PROTECT',
    category: 'Industrial cybersecurity',
    description: 'Enterprise industrial control system (ICS) and OT asset cybersecurity, configuration tracking, and threat vulnerability analysis.',
    legacyDescription: 'Formerly PAS Cyber Integrity',
    replacesWith: ['PAS Cyber Integrity'],
    products: [
      { name: 'Cyber Integrity', legacyName: 'PAS Cyber Integrity' }
    ],
    icon: 'Lock'
  }
];

export const PILLAR_META = {
  DESIGN: {
    color: '#00E5FF',
    hoverBg: 'hover:bg-[#00E5FF]/10',
    border: 'border-[#00E5FF]',
    text: 'text-[#00E5FF]',
    bg: 'bg-[#00E5FF]/5',
    title: 'DESIGN',
    description: 'Engineering schematics, 3D plant layouts, stress analysis, and GIS models.'
  },
  BUILD: {
    color: '#FFD54F',
    hoverBg: 'hover:bg-[#FFD54F]/10',
    border: 'border-[#FFD54F]',
    text: 'text-[#FFD54F]',
    bg: 'bg-[#FFD54F]/5',
    title: 'BUILD',
    description: 'Procurement, material readiness, construction execution, and project controls.'
  },
  OPERATE: {
    color: '#E040FB',
    hoverBg: 'hover:bg-[#E040FB]/10',
    border: 'border-[#E040FB]',
    text: 'text-[#E040FB]',
    bg: 'bg-[#E040FB]/5',
    title: 'OPERATE',
    description: 'Real-time utilities mapping, asset management, and quality compliance control.'
  },
  PROTECT: {
    color: '#00E676',
    hoverBg: 'hover:bg-[#00E676]/10',
    border: 'border-[#00E676]',
    text: 'text-[#00E676]',
    bg: 'bg-[#00E676]/5',
    title: 'PROTECT',
    description: 'Control room shift procedures, physical security dispatch, and OT cyber integrity.'
  },
  MIDDLEWARE: {
    color: '#90CAF9',
    hoverBg: 'hover:bg-[#90CAF9]/10',
    border: 'border-[#90CAF9]',
    text: 'text-[#90CAF9]',
    bg: 'bg-[#90CAF9]/5',
    title: 'MIDDLEWARE',
    description: 'Data replication, restful connections, and integration brokerage.'
  },
  THIRD_PARTY: {
    color: '#FF8A65',
    hoverBg: 'hover:bg-[#FF8A65]/10',
    border: 'border-[#FF8A65]',
    text: 'text-[#FF8A65]',
    bg: 'bg-[#FF8A65]/5',
    title: 'THIRD PARTY',
    description: 'Existing SAP PM, Oracle ERP, or specialized customer systems.'
  }
};

export const BLUEPRINTS: BlueprintTemplate[] = [
  {
    name: 'Information Management Platform',
    description: 'Integrated Information Management platform unifying Octave InConcert (central SDx digital twin repository), Octave Forte (3D Design), and Octave Facets (2D P&ID & Schematics) via native direct connectors.',
    icon: 'FolderGit',
    nodes: [
      { solutionId: 'node-inconcert', x: 70, y: 50 },  // Information Management Core
      { solutionId: 'node-forte', x: 25, y: 30 },     // Octave Forte (3D Design)
      { solutionId: 'node-facets', x: 25, y: 70 }     // Octave Facets (P&ID & Electrical)
    ],
    integrations: [
      { sourceIdx: 1, targetIdx: 0, direction: 'unidirectional', protocol: 'Native Direct Connector / REST', purpose: 'Direct 3D spatial models & tag attribute export into InConcert' },
      { sourceIdx: 2, targetIdx: 0, direction: 'unidirectional', protocol: 'Native Direct Connector / OData', purpose: 'Direct 2D P&ID schematics & instrument index export into InConcert' }
    ]
  },
  {
    name: 'Octave Core 5-Tier Stack',
    description: 'Complete end-to-end integration topology spanning Forte (Design), InConcert (Build), Databridge Pro (Middleware), Attune (Operate), and SAP PM (Third Party).',
    icon: 'Layers',
    nodes: [
      { solutionId: 'node-forte', x: 22, y: 30 },
      { solutionId: 'node-inconcert', x: 22, y: 70 },
      { solutionId: 'node-databridge', x: 50, y: 50 },
      { solutionId: 'node-attune', x: 78, y: 30 },
      { solutionId: 'node-sappm', x: 78, y: 70 }
    ],
    integrations: [
      { sourceIdx: 0, targetIdx: 2, direction: 'unidirectional', protocol: '500in / REST', purpose: 'Publish engineering 3D models & CAD specs' },
      { sourceIdx: 1, targetIdx: 2, direction: 'bidirectional', protocol: 'REST API', purpose: 'Bi-directional sync of digital twin engineering tags & active construction packages' },
      { sourceIdx: 2, targetIdx: 3, direction: 'unidirectional', protocol: 'JSON/HTTPS', purpose: 'Sync live asset telemetry and operational digital twin' },
      { sourceIdx: 2, targetIdx: 4, direction: 'unidirectional', protocol: '3000 OPC', purpose: 'Dispatch PM maintenance work orders' }
    ]
  },
  {
    name: 'Closed-Loop Asset Lifecycle',
    description: 'Ensures plant engineering changes flow into the central databridge and sync directly into operations and third-party SAP PM work orders.',
    icon: 'RefreshCw',
    nodes: [
      { solutionId: 'node-forte', x: 20, y: 25 },
      { solutionId: 'node-databridge', x: 50, y: 45 },
      { solutionId: 'node-attune', x: 80, y: 25 },
      { solutionId: 'node-sappm', x: 80, y: 65 }
    ],
    integrations: [
      { sourceIdx: 0, targetIdx: 1, direction: 'unidirectional', protocol: 'OData / REST', purpose: 'Publish design details' },
      { sourceIdx: 1, targetIdx: 2, direction: 'bidirectional', protocol: 'JSON/HTTPS', purpose: 'Sync active assets' },
      { sourceIdx: 2, targetIdx: 3, direction: 'unidirectional', protocol: 'IDOC RFC', purpose: 'Send equipment PM updates' }
    ]
  },
  {
    name: 'Edge OT Telemetry Pipeline',
    description: 'Automates industrial OT control system compliance, shift updates, and quality incident logs through Databridge Pro.',
    icon: 'RadioTower',
    nodes: [
      { solutionId: 'node-inservice', x: 20, y: 20 },
      { solutionId: 'node-networks', x: 20, y: 70 },
      { solutionId: 'node-databridge', x: 50, y: 45 },
      { solutionId: 'node-reliance', x: 80, y: 45 }
    ],
    integrations: [
      { sourceIdx: 0, targetIdx: 2, direction: 'unidirectional', protocol: 'REST API', purpose: 'Ingest outage events' },
      { sourceIdx: 1, targetIdx: 2, direction: 'unidirectional', protocol: 'REST Web Service', purpose: 'Update GIS assets' },
      { sourceIdx: 2, targetIdx: 3, direction: 'unidirectional', protocol: 'JSON/HTTPS', purpose: 'Raise compliance issues' }
    ]
  },
  {
    name: 'Engineering-to-Field Handover',
    description: 'Coordinates design engineering data flows into onsite construction planning and tracks material loop readiness.',
    icon: 'ArrowRightLeft',
    nodes: [
      { solutionId: 'node-facets', x: 15, y: 45 },
      { solutionId: 'node-databridge', x: 45, y: 45 },
      { solutionId: 'node-onsite', x: 75, y: 25 },
      { solutionId: 'node-loop', x: 75, y: 65 }
    ],
    integrations: [
      { sourceIdx: 0, targetIdx: 1, direction: 'unidirectional', protocol: 'OData / REST', purpose: 'Publish schematics and electricals' },
      { sourceIdx: 1, targetIdx: 2, direction: 'unidirectional', protocol: 'REST API', purpose: 'Populate construction package' },
      { sourceIdx: 2, targetIdx: 3, direction: 'bidirectional', protocol: 'REST Web Service', purpose: 'Reconcile material availability' }
    ]
  },
  {
    name: 'Geospatial Digital Twin Network',
    description: 'Consolidates GeoMedia GIS maps, Imagine remote sensing imagery, and Alto multi-dimensional visualizations through Databridge Pro.',
    icon: 'Globe',
    nodes: [
      { solutionId: 'node-geomedia', x: 20, y: 25 },
      { solutionId: 'node-imagine', x: 20, y: 65 },
      { solutionId: 'node-databridge', x: 50, y: 45 },
      { solutionId: 'node-alto', x: 80, y: 45 }
    ],
    integrations: [
      { sourceIdx: 0, targetIdx: 2, direction: 'unidirectional', protocol: 'OData / REST', purpose: 'Publish GIS mapping registries' },
      { sourceIdx: 1, targetIdx: 2, direction: 'unidirectional', protocol: 'REST API', purpose: 'Push satellite imagery tiles' },
      { sourceIdx: 2, targetIdx: 3, direction: 'unidirectional', protocol: 'JSON/HTTPS', purpose: 'Feed live visual multi-sensor layers' }
    ]
  },
  {
    name: 'Industrial Cyber & Control Room safety',
    description: 'Establishes safety compliance feedback loops between control room handovers, Cyber Integrity OT security alarms, and OnCall public response units.',
    icon: 'ShieldCheck',
    nodes: [
      { solutionId: 'node-cyber', x: 20, y: 25 },
      { solutionId: 'node-tempo', x: 20, y: 65 },
      { solutionId: 'node-databridge', x: 50, y: 45 },
      { solutionId: 'node-oncall', x: 80, y: 45 }
    ],
    integrations: [
      { sourceIdx: 0, targetIdx: 2, direction: 'unidirectional', protocol: 'REST API', purpose: 'Publish OT system critical vulnerability metrics' },
      { sourceIdx: 1, targetIdx: 2, direction: 'unidirectional', protocol: 'Event Bus', purpose: 'Forward shift handover safety incidents' },
      { sourceIdx: 2, targetIdx: 3, direction: 'unidirectional', protocol: 'JSON/HTTPS', purpose: 'Alert emergency command and crew dispatch' }
    ]
  }
];
