// ─── Octave Live Quiz Questions Bank ──────────────────────────────────────────
// 4 days × 4 difficulty levels × 20 questions = 320 questions total
// Fully aligned with ADIPEC 2026 Exhibition & Octave Intelligence Portfolio
// Correct answer positions are evenly distributed across all 4 option slots (0, 1, 2, 3)

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'DIFFICULT';

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  points: number;
  difficulty: Difficulty;
}

export interface QuizDay {
  id: number;
  label: string;
  theme: string;
  color: string;
  icon: string;
}

export const QUIZ_DAYS: QuizDay[] = [
  {
    "id": 1,
    "label": "Day 1",
    "theme": "Octave Products & Portfolio",
    "color": "#38bdf8",
    "icon": "Boxes"
  },
  {
    "id": 2,
    "label": "Day 2",
    "theme": "Industry Standards & Compliance",
    "color": "#34d399",
    "icon": "ShieldCheck"
  },
  {
    "id": 3,
    "label": "Day 3",
    "theme": "Digital Engineering & Technology",
    "color": "#fbbf24",
    "icon": "CircuitBoard"
  },
  {
    "id": 4,
    "label": "Day 4",
    "theme": "Energy Industry & Business Value",
    "color": "#f87171",
    "icon": "TrendingUp"
  }
];

export const DIFFICULTY_CONFIG = {
  "EASY": {
    "label": "Easy",
    "color": "#34d399",
    "points": 100,
    "icon": "Target"
  },
  "MEDIUM": {
    "label": "Medium",
    "color": "#38bdf8",
    "points": 200,
    "icon": "Sliders"
  },
  "HARD": {
    "label": "Hard",
    "color": "#fbbf24",
    "points": 300,
    "icon": "Zap"
  },
  "DIFFICULT": {
    "label": "Difficult",
    "color": "#f87171",
    "points": 400,
    "icon": "Crown"
  }
};

export const QUIZ_BANK: Record<number, Record<Difficulty, QuizQuestion[]>> = {
  "1": {
    "EASY": [
      {
        "question": "What does Octave's Tempo solution primarily manage?",
        "options": [
          "Operator shift logs and alarm management",
          "GIS mapping",
          "3D plant design",
          "OT cybersecurity"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which Octave product draws intelligent P&ID schematics?",
        "options": [
          "Alto",
          "Facets",
          "Reliance",
          "Forte"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does Octave CyberIntegrity protect?",
        "options": [
          "Document records",
          "Satellite imagery",
          "OT/ICS industrial networks",
          "3D plant models"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which Octave product is used for 3D plant spatial design?",
        "options": [
          "Reliance",
          "Forte",
          "Facets",
          "Tempo"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which Octave product manages enterprise asset lifecycle?",
        "options": [
          "Forte",
          "Tempo",
          "Facets",
          "Attune"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does Octave InConcert primarily provide for engineering teams?",
        "options": [
          "Digital twin spatial data and document tag management",
          "Accounting payroll",
          "Emergency dispatch",
          "Piping welding inspection"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which Octave solution delivers professional DWG-compatible CAD drafting?",
        "options": [
          "Tempo",
          "Loop",
          "BricsCAD",
          "Reliance"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does Octave GeoMedia primarily provide?",
        "options": [
          "Geospatial GIS mapping and asset analysis",
          "Piping stress analysis",
          "Operator shift handover",
          "3D laser scanning"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which Octave product handles 911 emergency dispatch and response for industrial complexes?",
        "options": [
          "Coda",
          "Attune",
          "Loop",
          "OnCall"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which Octave tool focuses on electrical wiring and loop diagrams?",
        "options": [
          "Facets",
          "CyberIntegrity",
          "Aspect Structure",
          "Tempo"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is the primary role of Octave Reliance in a plant?",
        "options": [
          "Public safety reporting",
          "Cyber threat hunting",
          "3D pipe modeling",
          "Maintenance strategy and asset reliability analysis"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does Octave Loop simulate for process plant operators?",
        "options": [
          "Offshore wave fatigue",
          "Control loop dynamics and PID controller tuning",
          "Financial budgets",
          "Fire and gas dispersion"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which Octave product functions as a law enforcement and security Records Management System (RMS)?",
        "options": [
          "Alto",
          "DataBridge",
          "Coda",
          "InConcert"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which Octave tool is dedicated to structural steel frame design for offshore platforms?",
        "options": [
          "Loop",
          "Aspect Structure",
          "Facets",
          "Tempo"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does Octave Scout utilize AI for?",
        "options": [
          "Autonomous drone navigation",
          "Pipeline corrosion prediction",
          "Operator biometric authentication",
          "Automated tag and symbol extraction from engineering drawings"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does Octave DataBridge connect across an industrial enterprise?",
        "options": [
          "Internet browsers to social media",
          "Field radios to mobile phones",
          "Disparate engineering databases and operational systems",
          "Satellite GPS to survey buoys"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which Octave product is used for collaborative 3D model web review?",
        "options": [
          "Coda",
          "Alto",
          "CyberIntegrity",
          "Reliance"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What engineering sector is the primary target for Octave's solutions at ADIPEC?",
        "options": [
          "Consumer mobile gaming",
          "Fashion retail manufacturing",
          "Commercial real estate leasing",
          "Oil & gas, petrochemicals, energy, and process industries"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does Octave Aspect Pipe Stress verify in a plant layout?",
        "options": [
          "Building HVAC airflow",
          "Fire sprinkler water flow",
          "Piping flexibility, thermal expansion, and nozzle stresses",
          "Instrument cable resistance"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "In Octave's architecture, what connects physical asset tags to digital models?",
        "options": [
          "The digital thread managed in InConcert",
          "A single hard-coded database column",
          "Printed QR stickers on paper folders",
          "Manual spreadsheets sent via email"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "question": "Which legacy piping software does Octave Aspect Pipe Stress modernize and replace?",
        "options": [
          "Revit",
          "AutoCAD LT",
          "SolidWorks",
          "CAESAR II"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does Octave InConcert primarily manage in brownfield facilities?",
        "options": [
          "Human resources payroll",
          "3D spatial master models and engineering document tags",
          "Shipping dock container logistics",
          "Security access badges"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does Octave Forte enable for piping design engineers?",
        "options": [
          "Financial cost estimating",
          "Cybersecurity firewall configuration",
          "Intelligent rules-based 3D plant modeling with spec-driven routing",
          "Raw unconstrained mesh sculpting"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In Octave's three-pillar framework, which pillar does Tempo reside in?",
        "options": [
          "Build pillar",
          "Operate pillar",
          "Design pillar",
          "Procure pillar"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "How does Octave Facets synchronize with Octave Forte 3D models?",
        "options": [
          "Exporting DXF files manually each night",
          "Printing PDF schematics for visual cross-checking",
          "Direct SQL table editing in production",
          "Bi-directional engineering tag synchronization via DataBridge"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What standard BIM and CAD exchange formats does BricsCAD natively support?",
        "options": [
          "Raster JPEG images only",
          "Adobe Flash animations",
          "DWG, DXF, and IFC format models",
          "Proprietary locked binary files only"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "How does Octave CyberIntegrity discover unauthorized devices on an industrial OT network?",
        "options": [
          "Passive deep packet inspection without pinging fragile PLCs",
          "Requiring operators to manually register MAC addresses",
          "Using Bluetooth beacons installed on each valve",
          "Sending aggressive port scans that restart controllers"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "Which engineering discipline uses Octave Aspect Structure for topside module design?",
        "options": [
          "Process safety psychologists",
          "Instrumentation technicians",
          "Structural and civil engineering teams",
          "Pipeline cathodic protection crews"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What capability does Octave Attune provide for asset maintenance planning?",
        "options": [
          "Audio transcription of radio calls",
          "Equipment hierarchy management and warranty tracking",
          "3D piping stress FEA calculation",
          "Live satellite weather forecasting"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "How does Octave OnCall integrate with plant emergency response protocols?",
        "options": [
          "Sending email surveys to contractors",
          "Creating social media alert posts",
          "Automatic shutdown of all plant electricity",
          "Automated incident geofencing and first-responder notification"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is the core benefit of Octave DataBridge's publish-subscribe messaging architecture?",
        "options": [
          "Eliminates the need for any network firewalls",
          "Decouples data producers from consumers across the enterprise",
          "Forces all applications to use one monolithic database",
          "Slows data transmission for manual human review"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "How does Octave Loop assist control engineers during commissioning?",
        "options": [
          "Determines optimal PID parameters to minimize overshoot and settling time",
          "Draws P&ID electrical schematics automatically",
          "Calibrates physical pressure gauges with a wrench",
          "Orders replacement control valves from vendors"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In Octave InConcert, what role does an 'Asset Tag' perform?",
        "options": [
          "Acts as an operator login password",
          "Serves as the unique digital key connecting drawings, specs, and maintenance records",
          "Indicates the physical weight of equipment in kilograms",
          "Represents the RFID purchase order number"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does Octave Scout do when processing scanned legacy plant drawings?",
        "options": [
          "Extracts text tags and graphic symbols into structured searchable metadata",
          "Converts colored drawings into black and white images",
          "Deletes unreadable engineering annotations",
          "Compresses drawings into low-resolution thumbnails"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "Which lifecycle pillar does Octave Aspect Pipe Stress support?",
        "options": [
          "Plant decommissioning pillar",
          "Financial accounting pillar",
          "Human talent recruitment pillar",
          "Design and engineering verification pillar"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "How does Octave Tempo assist with Process Safety Management (PSM) compliance?",
        "options": [
          "Randomly triggers drill alarms to test response speed",
          "Locks all control room doors during hazardous operations",
          "Maintains an immutable digital audit trail of shift handovers and bypasses",
          "Prevents operators from taking lunch breaks during high pressure"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What rendering acceleration technique allows Octave Forte to handle multi-million component refineries?",
        "options": [
          "Hierarchical level-of-detail (LOD) and occlusion culling",
          "Hiding all pipes smaller than 12 inches diameter",
          "Rendering only one equipment item at a time",
          "Rasterizing all objects into flat 2D sprites"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "How does Octave InConcert incorporate high-density 3D laser scan surveys?",
        "options": [
          "Converts point clouds into text descriptions",
          "Replaces laser scans with stock photographs",
          "Approximates points into low-poly spheres",
          "Overlays registered point clouds directly into the 3D spatial coordinate space"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What calculation does Octave Reliance perform to optimize maintenance intervals?",
        "options": [
          "Mean Time Between Failures (MTBF) and Weibull hazard rate curves",
          "Daily currency exchange fluctuations",
          "Carbon credit market pricing trends",
          "Employee overtime salary totals"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "Which coordinate reference system standard does Octave GeoMedia use for offshore pipeline assets?",
        "options": [
          "Imperial mile grids without datum reference",
          "Screen percentage offsets",
          "EPSG geodesy registry and projected UTM grid coordinates",
          "Local arbitrary pixel coordinates"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "question": "What message orchestration protocol does Octave DataBridge use for high-throughput enterprise event streams?",
        "options": [
          "Unencrypted FTP polling",
          "Direct serial RS-232 connections",
          "Daily tape backup transfers",
          "OData REST and AMQP/MQTT event broker routing"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In Octave InConcert, what open protocol enables bi-directional cross-discipline data exchange?",
        "options": [
          "DDE (Dynamic Data Exchange)",
          "OData (Open Data Protocol) REST API",
          "Proprietary binary RPC sockets only",
          "SOAP XML envelopes over dial-up"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does Octave CyberIntegrity verify PLC logic solver integrity without interrupting runtime operations?",
        "options": [
          "Injects random test inputs into live safety outputs",
          "Monitors ambient cabinet temperature only",
          "Computes cryptographic hashes of ladder logic blocks and compares to approved baseline snapshots",
          "Restarts the controller into debug mode during active production"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In Octave Facets, what is the role of an Instrumentation Loop Diagram?",
        "options": [
          "Calculates structural steel wind load coefficients",
          "Documents financial equipment depreciation",
          "Illustrates operator shift rotation schedules",
          "Maps field sensor wiring through junction boxes to DCS marshaling cabinets and I/O channels"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What finite element solver engine is embedded in Octave Aspect Structure for offshore dynamic wave fatigue?",
        "options": [
          "Physics simulation game engine",
          "Standard spreadsheet formula evaluator",
          "GT STRUDL structural finite element solver",
          "OpenCV image processing engine"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does Octave DataBridge maintain transactional consistency across distributed engineering checkouts?",
        "options": [
          "Locking the entire enterprise network until one user finishes",
          "Two-phase commit semantics and idempotent retry message queues",
          "Overwriting any conflicting record with the latest timestamp",
          "Canceling all pending transactions immediately"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "Which international standard does Octave Attune implement for oil & gas asset classification schemas?",
        "options": [
          "ISO 14224 and CFIHOS asset information standards",
          "ISO 216 paper size standards",
          "IEEE 802.11 wireless standard",
          "W3C HTML5 document specification"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In Octave Aspect Pipe Stress, how are equipment nozzle loads verified?",
        "options": [
          "Approximated using pipe wall weight alone",
          "Assumed safe if pipe diameter is under 10 inches",
          "Checked against standard residential plumbing guidelines",
          "Validated against API 610 (pumps), API 617 (compressors), and NEMA SM 23 nozzle limits"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does Octave Tempo interface with disparate DCS and SCADA systems in a refinery control room?",
        "options": [
          "Screen-scraping control monitors with webcam OCR",
          "OPC UA (Unified Architecture) and secure industrial gateways",
          "Manual paper shift sheets entered by interns",
          "Direct analog 4-20mA current loops to PC sound cards"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What spatial indexing structure powers Octave InConcert's sub-second querying across billion-polygon mega-projects?",
        "options": [
          "Octree and BVH (Bounding Volume Hierarchy) spatial partitioning",
          "Single unindexed relational database table",
          "Linked list without spatial sorting",
          "Flat linear array scan from beginning to end"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In Octave Loop, what tuning method is implemented for dead-time dominant chemical processes?",
        "options": [
          "Setting proportional gain to maximum and disabling integral action",
          "Trial-and-error manual knob adjustments during upset conditions",
          "Random number parameter generation",
          "Internal Model Control (IMC) and Lambda tuning algorithms"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What structured data formats does Octave Scout generate from scanned P&ID symbols?",
        "options": [
          "Unformatted plain text strings without hierarchy",
          "Vector PostScript print spool files",
          "Structured JSON, XML, and CFIHOS-compliant tag schemas",
          "Proprietary locked binary blobs"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does Octave CyberIntegrity implement IEC 62443 zone and conduit segmentation rules?",
        "options": [
          "Monitors and enforces protocol white-listing across inter-zone communication conduits",
          "Blocks all network traffic regardless of authorization",
          "Physically cuts Ethernet cables between control cabinets",
          "Applies desktop antivirus software to field transmitters"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does Octave Forte facilitate brownfield revamps with zero clash surprises during installation?",
        "options": [
          "Relying on historical drawings from original construction",
          "Fabricating spools on-site by eye without 3D verification",
          "Clash detection between proposed CAD models and high-resolution point cloud scans",
          "Measuring distances with manual tape measures"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What geospatial capability distinguishes Octave GeoMedia for offshore pipeline routing?",
        "options": [
          "Weather radar storm prediction only",
          "Multi-criteria bathymetric slope, coral reef exclusion, and anchor hazard routing algorithms",
          "Satellite television broadcast reception",
          "Standard street map turn-by-turn vehicle directions"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In Octave InConcert, what prevents simultaneous conflicting modifications in mega-engineering projects?",
        "options": [
          "Restricting project access to one engineer per week",
          "Allowing last write to overwrite previous engineering calculations",
          "Manual verbal coordination during weekly staff meetings",
          "Granular work-package spatial reservations and object-level checkouts"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What telemetry update frequency does Octave DataBridge support for industrial IoT streaming?",
        "options": [
          "Hourly polling intervals only",
          "Daily batch updates run at midnight",
          "Sub-second event-driven latency for critical process alarms and tag changes",
          "Weekly synchronizations via manual trigger"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In Octave Aspect Structure, how are wave slamming and vortex-induced vibrations (VIV) modeled?",
        "options": [
          "Morison equation hydrodynamic load formulation coupled with modal dynamic solvers",
          "Thermal expansion equations adapted for sea water",
          "Constant horizontal wind pressure applied uniformly",
          "Static point load approximation at deck center"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What compliance framework does Octave CyberIntegrity use to evaluate OT vulnerability risk?",
        "options": [
          "Physical age of the control room building",
          "CVSS (Common Vulnerability Scoring System) weighted by operational plant impact",
          "General consumer IT malware rankings",
          "Number of lines of code in controller software"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does Octave Facets manage revision control when a design change notice (DCN) is issued?",
        "options": [
          "Automated redline tracking with side-by-side graphical and tag delta comparison",
          "Overwriting original files and deleting previous revisions",
          "Renaming files with suffix '_FINAL_v2_really_final'",
          "Printing paper copies and filing in offsite warehouses"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      }
    ],
    "DIFFICULT": [
      {
        "question": "In Octave's architecture, what defines the 'digital thread' across an asset lifecycle?",
        "options": [
          "The legal contract signed between EPC contractor and asset owner",
          "The sequence of email approval chains for change requests",
          "A continuous, validated data flow linking design, procurement, fabrication, construction, and operations",
          "The fiber optic physical cable connecting field junction boxes to the DCS"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What is the primary business value of Octave's multi-discipline integration framework?",
        "options": [
          "Eliminating data silos and handover friction between engineering, construction, and operations",
          "Replacing all field instrumentation with software simulations",
          "Cutting plant power consumption by turning off control systems",
          "Outsourcing engineering review to consumer crowdsourcing apps"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does Octave CyberIntegrity differ fundamentally from standard enterprise IT security tools?",
        "options": [
          "It requires internet connectivity to commercial cloud servers to function",
          "It disables all firewalls to maximize network throughput",
          "It understands proprietary OT protocols (Modbus, DNP3, CIP) without sending traffic that trips safety PLCs",
          "It only operates on desktop Windows laptops outside the plant"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What architectural pattern ensures global data consistency across Octave's design and operate pillars?",
        "options": [
          "Nightly flat-file FTP dumps across WAN connections",
          "A federated hub-and-spoke model orchestrated by DataBridge with canonical schemas",
          "Peer-to-peer ad hoc synchronization without conflict resolution",
          "A single monolithic database hosted on one physical server without replication"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What key distinction separates Octave Forte from Octave InConcert?",
        "options": [
          "Forte runs exclusively on mobile phones; InConcert runs on mainframes",
          "Forte is an accounting tool; InConcert is a CAD viewer",
          "Forte is for upstream drilling; InConcert is for downstream petrol stations",
          "Forte executes detailed rules-based 3D physical modeling; InConcert manages the master spatial digital twin and tags"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In high-pressure piping design, how does Aspect Pipe Stress calculate thermal expansion stress range?",
        "options": [
          "Evaluates displacement stress range SE against allowable stress SA per ASME B31.3 equation 1a",
          "Uses structural Euler column buckling formulas exclusively",
          "Assumes thermal stress is zero if insulation is installed",
          "Multiplies pipe operating pressure by pipe outer diameter"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does Octave DataBridge resolve semantic discrepancies between heterogeneous engineering databases?",
        "options": [
          "Drops all non-matching columns during data synchronization",
          "Forces all systems to adopt the newest database table structure immediately",
          "Prompts users with manual popups for every single tag transferred",
          "Transforms source schemas into a common ontology aligned with ISO 15926 and CFIHOS"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In Octave InConcert, what concurrency control prevents clash anomalies when 500+ engineers collaborate simultaneously?",
        "options": [
          "Restricting 3D modeling access to after-hours shifts only",
          "3D spatial bounding volume checkouts with real-time dynamic collision boundary reservations",
          "Permitting silent overwrites based on network packet arrival order",
          "Locking the entire refinery unit whenever any user opens a drawing"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does Octave CyberIntegrity detect unauthorized logic solver tampering in Safety Instrumented Systems (SIS)?",
        "options": [
          "Checks whether the control room door key was used",
          "Monitors operator heartbeat using wearable wristbands",
          "Detects unauthorized changes to Safety PLC logic rungs, force tables, and firmware checksums",
          "Scans the facility perimeter with thermal infrared cameras"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In Octave Facets, how are complex instrument signals validated against physical DCS I/O card capacity?",
        "options": [
          "Estimating I/O capacity based on the square footage of the control room",
          "Automated marshalling algorithms that calculate terminal density, intrinsically safe barriers, and channel loading",
          "Leaving cable assignment to field electricians during site construction",
          "Limiting facilities to a maximum of 100 instruments"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What numerical method does Aspect Structure employ for offshore jacket structural wave fatigue assessment?",
        "options": [
          "Spectral fatigue analysis using directional ocean wave scatter diagrams and S-N stress curves",
          "Static equivalent gravity load calculation multiplied by a safety factor of 1.5",
          "Simulating waves as static solid concrete blocks impacting legs",
          "Linear elastic beam bending formulas without cyclic load evaluation"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does Octave Attune calculate remaining useful life (RUL) of high-temperature refinery reformer tubes?",
        "options": [
          "Depreciates asset book value linearly over a standard 20-year accounting schedule",
          "Replaces reformer tubes annually regardless of operating condition",
          "Measures external paint discoloration using computer vision",
          "Couples operating temperature and pressure history with Larson-Miller creep damage equations"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In Octave Scout's neural network pipeline, how is P&ID topological connectivity extracted from raw scans?",
        "options": [
          "Manual mechanical arm scanning across paper blueprints",
          "Applying edge detection filters and converting all lines to straight vectors",
          "Coupled deep learning object detection for symbols with graph neural networks for process line tracing",
          "Simple optical character recognition (OCR) of text characters only"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does Octave Loop compensate for long transportation delay in chemical distillation columns?",
        "options": [
          "Implements Smith Predictor and model-predictive dead-time compensation algorithms",
          "Adds larger physical pipes to reduce transit time",
          "Increases proportional gain until the valve oscillates continuously",
          "Disables feedback control and runs the process in manual mode"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What enterprise data architecture enables seamless bi-directional synchronization between InConcert and SAP S/4HANA?",
        "options": [
          "Sending nightly CSV files via unencrypted SMTP email attachments",
          "Direct writing to production SQL database tables via administrative credentials",
          "OData v4 REST connectors with delta-token change tracking and transactional message queues",
          "Printing work orders and re-typing them into the ERP"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In Octave CyberIntegrity, how is forensic non-repudiation ensured during an OT security audit?",
        "options": [
          "Relying on operator handwritten logbooks",
          "Storing logs in editable text files on the local operator console",
          "Overwriting logs every 24 hours to preserve hard drive capacity",
          "Cryptographically sealed, append-only immutable audit logs timestamped to NTP master clocks"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What ISO 19650 Common Data Environment (CDE) state transitions does Octave InConcert enforce?",
        "options": [
          "Only supports two states: 'Draft' and 'Deleted'",
          "Strict progression from Work-in-Progress (WIP) to Shared, Published, and Archived states with gate approvals",
          "Allows any user to mark unverified drafts directly as Published",
          "Bypasses review states for projects with tight construction schedules"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does Octave Aspect Pipe Stress evaluate dynamic fluid surge shocks such as water hammer?",
        "options": [
          "Ignores fluid inertia and models pipe as an empty beam",
          "Multiplies static internal design pressure by a constant surge factor of 1.1",
          "Assumes water hammer energy is absorbed entirely by pipe insulation",
          "Converts transient fluid velocity and pressure wave time-histories into structural node force vectors"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In Octave Forte, what governs automated routing of multi-discipline pipe racks?",
        "options": [
          "Finding the shortest straight diagonal line between two equipment nozzles regardless of collisions",
          "Rule-based engineering specifications enforcing slope, insulation clearance, and maintenance access envelopes",
          "Placing all pipes in a single horizontal plane without vertical staggering",
          "Allowing pipes to penetrate structural steel columns whenever convenient"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What measurable operational outcome has been validated from deploying the complete Octave connected lifecycle portfolio?",
        "options": [
          "15-25% reduction in plant OPEX and up to 40% reduction in unplanned downtime events",
          "100% elimination of all maintenance personnel on site",
          "Doubling plant crude oil processing capacity without physical equipment",
          "Zero need for safety inspections or regulatory compliance audits"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      }
    ]
  },
  "2": {
    "EASY": [
      {
        "question": "Which standard is the internationally recognized code for process plant piping design?",
        "options": [
          "ASME B31.3",
          "ISO 9001",
          "NFPA 101",
          "API 650"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does API 650 govern in energy and industrial facilities?",
        "options": [
          "Computer network security",
          "Offshore drilling riser design",
          "Operator shift handover procedures",
          "Welded steel tanks for oil storage"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is the primary focus of the ISO 55000 family of standards?",
        "options": [
          "Quality control in food production",
          "Asset management systems and best practices",
          "Environmental greenhouse gas metrics",
          "Software user interface guidelines"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does IEC 62443 address in industrial plants?",
        "options": [
          "Cybersecurity for operational technology and industrial control systems",
          "Welding inspection protocols",
          "Helipad lighting standards",
          "Pressure vessel wall thickness calculations"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which API standard governs in-service inspection, repair, and alteration of pressure vessels?",
        "options": [
          "ASME B31.1",
          "NFPA 70",
          "API 650",
          "API 510"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which API standard governs in-service inspection of metallic piping systems?",
        "options": [
          "ISO 14001",
          "API 570",
          "ASME Section I",
          "API 620"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does OSHA 1910.119 regulate in the United States and global chemical facilities?",
        "options": [
          "Company cafeteria hygiene",
          "Vehicle parking lot line markings",
          "Process Safety Management (PSM) of highly hazardous chemicals",
          "Standard office ergonomic desk heights"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does the abbreviation HAZOP stand for in safety engineering?",
        "options": [
          "Hazard and Operability Study",
          "Hydraulic Asset Zone Optimization",
          "High Altitude Zero-Oxygen Protocol",
          "Hazardous Area Zone Operating Plan"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does NACE MR0175 / ISO 15156 specify for upstream oil & gas equipment?",
        "options": [
          "Standard paint colors for offshore lifeboats",
          "Acceptable noise levels in control rooms",
          "Fire sprinkler water flow rates",
          "Materials resistant to sulfide stress cracking in sour (H2S) environments"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which ASME code section covers the design and fabrication of unfired pressure vessels?",
        "options": [
          "ASME Section VIII",
          "ASME Section IX",
          "ASME Section I",
          "ASME Section V"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does ISO 14001 specify for industrial organizations?",
        "options": [
          "Pipeline welding procedures",
          "Environmental Management Systems (EMS)",
          "Financial auditing guidelines",
          "Information security controls"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does the abbreviation SIL stand for in functional safety standards?",
        "options": [
          "Structural Impact Loading",
          "Standard Industrial Lubricant",
          "Safety Integrity Level",
          "System Insulation Limit"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which standard specifies the welding of pipelines and related facilities across North America?",
        "options": [
          "ISO 27001",
          "API 1104",
          "NFPA 85",
          "ASME B31.4"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is the primary objective of a Management of Change (MOC) procedure in a refinery?",
        "options": [
          "Reduce the number of engineering staff required on site",
          "Speed up equipment installations without paperwork",
          "Lower vendor purchasing prices automatically",
          "Ensure safety, health, and environmental impacts are evaluated before implementing changes"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does the European ATEX directive regulate in process facilities?",
        "options": [
          "Maximum daily working hours for operators",
          "Tax calculations for exported natural gas",
          "Equipment and protective systems intended for use in potentially explosive atmospheres",
          "Standard sizes for shipping pallets"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does ISO 9001 define for industrial service and product providers?",
        "options": [
          "Cybersecurity firewall configurations",
          "Cathodic protection voltage limits",
          "Boiler steam drum water chemistry",
          "Quality Management Systems (QMS) requirements"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which standard establishes the National Electrical Code (NEC) in industrial installations?",
        "options": [
          "NFPA 70",
          "IEEE 802.3",
          "ASME B16.5",
          "API 500"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is an ASME B16.5 standard primarily used for in plant design?",
        "options": [
          "Storage tank foundation design",
          "Relief valve sizing calculations",
          "Pipe flanges and flanged fittings specifications",
          "Centrifugal pump vibration limits"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does ISO 45001 specify for industrial workplace operations?",
        "options": [
          "BIM model exchange schema standards",
          "Occupational Health and Safety (OH&S) management systems",
          "Chemical laboratory calibration procedures",
          "Gas turbine thermal efficiency ratings"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "In safety engineering, what is the 'ALARP' principle?",
        "options": [
          "Asset Lifecycle And Reliability Plan",
          "Automated Logic And Relay Protection",
          "As Low As Reasonably Practicable",
          "Always Lower Asset Replacement Prices"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "question": "What is the key difference between ASME Section VIII Division 1 and Division 2?",
        "options": [
          "Division 1 is for cryogenic vessels; Division 2 is for steam boilers",
          "Division 2 does not require radiographic testing of welds",
          "Division 1 is restricted to nuclear power generation",
          "Division 2 allows higher allowable stresses through design-by-analysis and rigorous stress linearization"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "Which standard provides the recognized methodology for Risk-Based Inspection (RBI)?",
        "options": [
          "ASME B31.3 Chapter IX",
          "ISO 9001 Section 7",
          "API RP 580 and API RP 581",
          "NFPA 70E"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does the IEC 61511 standard govern in process plant automation?",
        "options": [
          "Programming languages for mobile phone apps",
          "Color coding of high-voltage wiring",
          "Standard dimensions of 19-inch server racks",
          "Functional safety and Safety Instrumented Systems (SIS) for the process industry"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does API 520 / API 521 specify for chemical and refinery facilities?",
        "options": [
          "Sizing, selection, and installation of pressure-relieving devices and flare disposal systems",
          "Lubrication schedules for reciprocating compressors",
          "Cathodic protection of buried cross-country pipelines",
          "Structural welding qualification tests"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "Which standard defines the classification of collection of reliability and maintenance data for equipment in oil & gas?",
        "options": [
          "ISO 27001",
          "ISO 14224",
          "ASME Section II",
          "API 653"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is the primary difference between ASME B31.1 and ASME B31.3?",
        "options": [
          "B31.1 is for underground pipes; B31.3 is for offshore platforms",
          "B31.1 is an obsolete standard no longer in use",
          "B31.1 covers Power Piping (power stations/boilers); B31.3 covers Process Piping (refineries/chemical plants)",
          "B31.1 covers plastic pipes; B31.3 covers metallic pipes"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "Under IEC 62443, what is a 'Zone' in an industrial network?",
        "options": [
          "A physical room in the administration building",
          "The offshore maritime boundary around an oil platform",
          "The range of a plant Wi-Fi router",
          "A logical grouping of cyber assets that share the same security requirements"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "Under IEC 62443, what is a 'Conduit' in industrial network segmentation?",
        "options": [
          "A sewer line handling stormwater runoff",
          "An exhaust vent for cooling computer servers",
          "A dedicated logical or physical communication pathway connecting two distinct security zones",
          "A steel pipe carrying electrical wiring across the deck"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does API 653 specify for plant asset integrity engineers?",
        "options": [
          "Inspection, repair, alteration, and reconstruction of aboveground atmospheric storage tanks",
          "Vibration analysis of electric motors",
          "Emergency shutdown valve testing intervals",
          "Design of floating production storage and offloading (FPSO) hulls"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In Safety Instrumented Systems (SIS), how is the required Safety Integrity Level (SIL 1 to 4) determined?",
        "options": [
          "By picking the highest SIL level for every instrument regardless of risk",
          "Through risk assessment techniques such as Layer of Protection Analysis (LOPA) or Risk Graphs",
          "By asking the equipment vendor to set the level",
          "Based on the physical size of the control valve"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does API RP 571 catalog for plant integrity and inspection personnel?",
        "options": [
          "Damage mechanisms affecting fixed equipment in the refining industry",
          "Purchasing catalog numbers for API pumps",
          "Addresses of licensed oil testing laboratories",
          "Standard salary scales for certified inspectors"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does the ISO 19650 standard series define for capital project delivery?",
        "options": [
          "Fire endurance testing of offshore blast walls",
          "Organization and digitization of information about buildings and civil engineering works (BIM)",
          "Crude oil assay testing standards",
          "Turbine efficiency calculations at ISO baseline conditions"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In hazardous area classification per IEC 60079, what defines a 'Zone 0' location?",
        "options": [
          "An area where explosive atmosphere is unlikely to occur in normal operation",
          "A safe administrative office space with zero explosive hazards",
          "An area where explosive atmosphere is expected occasionally during normal operation",
          "An area where an explosive gas atmosphere is present continuously or for long periods"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In hazardous area classification per IEC 60079, what defines a 'Zone 1' location?",
        "options": [
          "A totally safe non-hazardous control room",
          "An area in which an explosive gas atmosphere is likely to occur in normal operation",
          "An area where gas is present 100% of the time",
          "An area where only combustible dust is present"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does the ASME Boiler and Pressure Vessel Code (BPVC) Section IX govern?",
        "options": [
          "Welding, brazing, and fusing qualifications for procedures and personnel",
          "Hydrostatic testing safety barriers",
          "Nuclear reactor containment vessel stress analysis",
          "Fiberglass reinforced plastic pipe fabrication"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does API 620 cover that is outside the scope of API 650?",
        "options": [
          "Offshore subsea production flowlines",
          "Centrifugal gas compressor casings",
          "Design and construction of large, welded, low-pressure storage tanks (up to 15 psig)",
          "High-pressure catalytic cracking reactors"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is the primary function of a Rupture Disk per ASME Section VIII?",
        "options": [
          "Non-reclosing pressure relief device that bursts at a calibrated differential pressure",
          "An electrical switch that trips pump motors on high pressure",
          "A manual drain plug at the bottom of a vessel",
          "A mechanical valve that opens and closes continuously"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does NFPA 85 specify for industrial energy facilities?",
        "options": [
          "Fire resistance rating of office drywall",
          "First aid kit contents for hazardous chemical exposure",
          "Boiler and Combustion Systems Hazards Code",
          "Storage of Class 3 flammable liquids in drums"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does API 579-1 / ASME FFS-1 provide to plant operators?",
        "options": [
          "Standard prices for replacement heat exchanger tubes",
          "Fitness-for-Service (FFS) assessment methodologies for flawed or degraded equipment",
          "Guidelines for hiring qualified offshore welders",
          "Environmental emissions permit application templates"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In electrical engineering, what does IEC 60529 define with 'IP' ratings (e.g. IP66, IP68)?",
        "options": [
          "Internet Protocol packet routing rules for field transmitters",
          "Instantaneous Peak voltage limits for surge arrestors",
          "Intrinsically safe power limitation curves",
          "Degrees of protection provided by electrical enclosures against ingress of solids and water"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "question": "Under IEC 62443-3-3, what does Security Level 3 (SL 3) protect against?",
        "options": [
          "Intentional attack by sophisticated means with moderate resources, domain skills, and specific motivation",
          "Casual or coincidental violation with no motivation or resources",
          "Simple mistakes made by untrained internal operators (SL 1)",
          "Nation-state actors with extended resources and zero-day exploits (SL 4)"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In API 579-1 / ASME FFS-1, what distinguishes a Level 3 Fitness-for-Service assessment?",
        "options": [
          "Intermediate engineering calculation using standardized charts and spreadsheets (Level 2)",
          "Advanced numerical analysis such as non-linear finite element analysis (FEA) performed by specialists",
          "Simple screening using visual inspection hand calculations (Level 1)",
          "Routine ultrasonic thickness gauge checks on clean pipe"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does ASME B31.3 evaluate displacement stress range (SE) under thermal cyclic loading?",
        "options": [
          "Compares SE against SA = f [ 1.25(Sc + Sh) - SL ], where f is the stress range factor",
          "Calculates static yield stress divided by a factor of 4.0",
          "Ignores cold condition stress Sc and uses hot allowable Sh only",
          "Requires SE to remain below atmospheric pressure at all times"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In IEC 61508 / 61511, what is PFDavg and how is it used?",
        "options": [
          "Primary Foundation Deflection allowable under hurricane wind loads",
          "Process Fluid Density average in multiphase separator vessels",
          "Peak Flow Discharge average across relief valve flare headers",
          "Average Probability of Failure on Demand, used to quantify whether an SIS meets its target SIL"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What does NACE MR0103 / ISO 17945 govern in downstream operations?",
        "options": [
          "Materials resistant to sulfide stress cracking in downstream petroleum refining environments",
          "Coating selection for atmospheric storage tank roofs",
          "Inhibitor injection rates for gas dehydrators",
          "Cathodic protection for subsea pipelines in deep water"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In API 653, what is the minimum allowable remaining thickness of a tank bottom plate before repair is mandatory?",
        "options": [
          "1.00 inch (25.4 mm) regardless of product stored",
          "50% of the original nominal thickness in all cases",
          "0.01 inches (0.25 mm) if painted with epoxy",
          "0.10 inches (2.5 mm) for tanks with no bottom leak detection, or per calculated tmin"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "Under ASME Section VIII Division 1, what is the maximum joint efficiency (E) for a fully radiographed (RT-1) Category A butt weld?",
        "options": [
          "0.85",
          "0.55",
          "1.00",
          "0.70"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What failure mechanism does API RP 571 categorize under High Temperature Hydrogen Attack (HTHA)?",
        "options": [
          "Stress corrosion cracking of austenitic stainless steels in chlorinated water",
          "Galvanic corrosion between carbon steel and bronze fittings",
          "Hydrogen blistering on internal vessel walls at ambient temperature",
          "Reaction of absorbed hydrogen with metal carbides at elevated temperature producing methane voids and microfissures"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In functional safety, what does a '1oo2' (one-out-of-two) voting architecture optimize?",
        "options": [
          "Allows operators to manually override safety trips without a bypass key",
          "Safety availability (either channel can trigger a trip), but increases susceptibility to nuisance spurious trips",
          "Reduces hardware cost by eliminating duplicate field sensors",
          "Plant uptime by preventing any automatic trips until both channels fail"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What distinguishes ISO 19650-2 information management from traditional EPC drawing handovers?",
        "options": [
          "Permits subcontractors to use any drawing naming convention they prefer",
          "Eliminates revision history logs from project documentation",
          "Enforces an Information Delivery Plan (IDP) and structured Common Data Environment (CDE) milestones",
          "Requires all drawings to be delivered as scanned PDF image files"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In API 521 flare system design, what is 'choked flow' (sonic velocity) at a relief valve nozzle?",
        "options": [
          "When piping is completely blocked by solid hydrate formation",
          "When downstream pressure ratio drops below critical pressure ratio and velocity reaches local speed of sound",
          "When liquid droplets extinguish the flare pilot burner flame",
          "When valve spring fails to lift under design relieving pressure"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "Under IEC 62443, what does FR 4 (Data Confidentiality) mandate for industrial communications?",
        "options": [
          "Requiring all operators to sign non-disclosure agreements before entering the control room",
          "Deleting all historical process data immediately after shift ends",
          "Hiding all HMI computer monitors behind privacy curtains",
          "Cryptographic protection of sensitive process data in transit and at rest against eavesdropping"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In ASME B31.3 Chapter IX (High Pressure Piping), what triggers high pressure classification?",
        "options": [
          "Design pressure exceeding that allowed by the ASME B16.5 Class 2500 flange rating for specified temperature",
          "Any piping operating above 100 psig (7 bar)",
          "Only piping carrying supercritical steam inside boiler tubes",
          "Any offshore pipeline deeper than 100 meters underwater"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What does the CFIHOS (Capital Facilities Information HandOver Standard) define?",
        "options": [
          "Fire resistance ratings for control room glass windows",
          "Standard tariffs for maritime chemical tanker shipments",
          "A standardized corporate dictionary and tag property hierarchy for digital handover between EPCs and operators",
          "Maximum allowable crane lift weights for modular plant modules"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "Under OSHA 1910.119 PSM, how often must a Process Hazard Analysis (PHA) be revalidated?",
        "options": [
          "Every 20 years during major refinery turnarounds",
          "Annually by the plant general manager alone",
          "Only after a catastrophic explosion has occurred",
          "At least every 5 years by a qualified multi-disciplinary team"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In API 570, what is a Class 1 piping service classification?",
        "options": [
          "Services with the highest potential of resulting in an immediate emergency if a leak occurs (e.g. flammable gas, toxic chemicals)",
          "Cooling tower water return piping",
          "Utility water and instrument air piping located outdoors",
          "Atmospheric wastewater drainage lines inside bunded areas"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What is the Nelson Curve in API RP 941 used for?",
        "options": [
          "Calculating optimum pipe support spacing for slurry lines",
          "Estimating earthquake ground acceleration on cylindrical tanks",
          "Determining safe operating limits of carbon and low alloy steels in high-temperature hydrogen service",
          "Predicting centrifugal pump cavitation based on net positive suction head"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In electrical engineering, what does ATEX 'Ex d' flameproof protection ensure?",
        "options": [
          "The electrical circuits operate with energy levels too low to ignite gas (Ex i)",
          "The enclosure can withstand an internal explosion without igniting the surrounding flammable atmosphere",
          "All components are potted in solid resin blocks (Ex m)",
          "The enclosure is continuously purged with inert nitrogen gas (Ex p)"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "Under API 650 Appendix P, what does the calculation determine?",
        "options": [
          "Cathodic protection anode spacing for double bottom tanks",
          "Internal floating roof seal friction forces during emptying",
          "Allowable external piping nozzle loads and moments on tank shell penetrations",
          "Maximum allowable seismic sloshing wave height against the roof"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In ASME Section VIII Division 2, what is 'Stress Linearization'?",
        "options": [
          "Drawing straight lines between thickness measurement gauge points",
          "Decomposing a non-linear finite element stress profile into membrane, bending, and peak stress components",
          "Assuming all vessel stresses follow Hooke's law up to ultimate tensile strength",
          "Approximating curved vessel heads as flat circular plates"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      }
    ],
    "DIFFICULT": [
      {
        "question": "In API 579-1 / ASME FFS-1 Part 10 (Creep Damage), how is remaining life evaluated under cyclic thermal conditions?",
        "options": [
          "Applies time-fraction creep damage summation coupled with cycle-fraction fatigue damage per the bilinear interaction diagram",
          "Assumes creep damage is reversed whenever the vessel cools to ambient temperature",
          "Multiplies nominal operating temperature by the number of startup cycles",
          "Uses standard linear elastic fracture mechanics without temperature compensation"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In IEC 61508-2, how is the Safe Failure Fraction (SFF) calculated for complex logic solvers?",
        "options": [
          "SFF = total safe failures multiplied by the mean time to repair (MTTR)",
          "SFF = total dangerous failures / total operating hours across all installations",
          "SFF = 1.0 minus the probability of spurious trips",
          "SFF = (sum of safe failure rates + sum of detected dangerous failure rates) / total failure rate"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "Under IEC 62443-4-2, what technical security capability is required for an Embedded Device to achieve Component Security Level 4?",
        "options": [
          "Storing master encryption keys in cleartext configuration files for easy recovery",
          "Standard 8-character alphanumeric password login with no lockout",
          "Hardware Root of Trust, cryptographically verified secure boot, and physical anti-tamper detection mechanisms",
          "Disabling all network interfaces and operating in standalone mode"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In ASME B31.3 Appendix X, how is high-cycle metallic bellows expansion joint fatigue calculated?",
        "options": [
          "Treats the bellows as an unyielding rigid pipe spool of equivalent diameter",
          "Calculates static hoop stress from internal pressure multiplied by a factor of 2.0",
          "Uses Euler column buckling formulas assuming no angular rotation",
          "Evaluates convoluted shell meridional membrane and bending stress ranges against EJMA fatigue curves adjusted for temperature"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What is the primary thermodynamic constraint governing API 521 two-phase relief valve sizing?",
        "options": [
          "Standard ideal gas orifice flow equation using ambient molecular weight",
          "Hemispherical critical mass flux calculations using the Homogeneous Equilibrium Model (HEM) accounting for flashing fluid",
          "Multiplying liquid volumetric flow rate by the boiling point temperature",
          "Incompressible Bernoulli liquid equation ignoring vapor generation"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "Under NACE TM0177 / TM0284, what criteria determines acceptability for Hydrogen Induced Cracking (HIC)?",
        "options": [
          "Zero visible surface pitting when viewed under 10x magnification",
          "Charpy V-Notch impact energy greater than 100 Joules at 0 degrees Celsius",
          "Rockwell hardness test below 22 HRC without destructive sectioning",
          "Crack Length Ratio (CLR), Crack Thickness Ratio (CTR), and Crack Sensitivity Ratio (CSR) below specified threshold percentages"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In ASME Section VIII Division 2 Part 5 (Design by Analysis), how is 'Protection Against Plastic Collapse' demonstrated?",
        "options": [
          "Performing hydrostatic proof testing at 300% of maximum design pressure",
          "Elastic stress analysis with stress categorization (Pm, Pb, Q, F), limit-load analysis, or elastic-plastic analysis",
          "Applying a safety factor of 3.0 to tensile strength using nominal shell thickness",
          "Measuring vessel outer diameter expansion with dial indicators during operation"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In API 579-1 Level 3 fracture mechanics, what parameter defines crack initiation resistance under elastic-plastic conditions?",
        "options": [
          "J-Integral and Crack Tip Opening Displacement (CTOD) compared against material critical fracture toughness",
          "Nominal Charpy impact energy alone divided by specimen cross-sectional area",
          "Linear elastic stress intensity factor KIC assuming small-scale yielding at all temperatures",
          "Ultimate tensile strength multiplied by the crack length"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What mathematical proof distinguishes a Safety Instrumented System's '2oo3' voting architecture?",
        "options": [
          "Eliminates common-cause failures between identical redundant transmitters",
          "Achieves both high safety integrity (trips if any 2 agree) and high operational availability (immune to single spurious trip)",
          "Consumes 66% less electrical power than a 1oo1 architecture",
          "Requires all 3 channels to agree before any safety trip can execute"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "Under API 650 Annex E, how is the impulsive and convective (sloshing) seismic liquid pressure calculated?",
        "options": [
          "Neglecting seismic fluid inertia if the tank height-to-diameter ratio is under 1.5",
          "Multiplying total liquid weight by the peak ground acceleration coefficient uniformly",
          "Housner mechanical analog modeling separating high-frequency impulsive mass from low-frequency convective sloshing wave mass",
          "Treating the liquid as a single rigid solid block anchored to the tank bottom"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In IEC 62443-3-2 risk assessment, what defines the 'Target Security Level' (SL-T) for a designated zone?",
        "options": [
          "The security level required based on the unmitigated consequence of a cyber incident threatening safety or environmental loss",
          "The highest security level advertised by the firewall hardware vendor",
          "The default security settings pre-installed by the operating system vendor",
          "A fixed level assigned to all industrial companies based on annual revenue"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In ASME Section VIII Division 1 Appendix 2, what governs bolted flange connection design?",
        "options": [
          "Selecting bolts based on standard structural steel AISC beam tables",
          "Tightening bolts with an impact wrench until flange faces make full metal-to-metal contact",
          "Using bolt diameter equal to nominal pipe thickness multiplied by 1.5",
          "Taylor-Forge method calculating gasket seating condition (Wm2) and operating design condition (Wm1) bolt loads"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "Under OSHA PSM, what is the mandatory requirement for a Process Safety Management 'Compliance Audit'?",
        "options": [
          "Only required if the facility releases more than 10,000 pounds of VOCs per month",
          "Requires reviewing 100% of all operator emails sent since previous inspection",
          "Conducted at least every 3 years by at least one person knowledgeable in the process, generating an audit action plan",
          "Conducted monthly by external insurance underwriters without plant staff participation"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In API 579-1 Part 5 (Local Thin Areas), what is the 'RSF' and what is its standard acceptance criteria?",
        "options": [
          "Remaining Strength Factor, with standard acceptance criteria of RSF >= 0.90 for continuous operation",
          "Refinery Safety Factor, required to be >= 2.0 at all times",
          "Residual Stress Fraction, which must not exceed 0.50 after heat treatment",
          "Relief Sizing Factor, governing flare header backpressure limits"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In ASME B31.3 Section 304.5, what governs the pressure design of unlisted blind flanges and blank plates?",
        "options": [
          "Using nominal pipe wall thickness multiplied by pipe schedule number",
          "Allowing blind flanges to deflect up to 10% of their diameter under hydrostatic test",
          "Calculated flat head bending equations per ASME Section VIII Division 1 UG-34 with appropriate margin",
          "Assuming standard 1/2-inch plate thickness is sufficient up to 1000 psig"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In Safety Instrumented Functions (SIF), what is 'Proof Test Coverage' (PTC)?",
        "options": [
          "The total number of hours an instrument can operate before needing recalibration",
          "The fraction of dangerous undetected failures that are revealed and restored during periodic maintenance proof testing",
          "The probability that a certified technician passes the safety exam",
          "The percentage of plant instruments that have physical calibration stickers attached"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What is the critical metallurgical mechanism evaluated in API RP 934 for heavy-wall hydroprocessing reactors?",
        "options": [
          "Zinc embrittlement caused by galvanized scaffolding pipes touching hot nozzles",
          "Pitting corrosion caused by rainwater accumulation on stainless steel cladding",
          "Temper embrittlement of 2.25Cr-1Mo and vanadium-modified steel alloys during operational thermal cooldown",
          "Atmospheric stress corrosion cracking of unpainted structural steel baseplates"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "Under IEC 60079-11, what is the design principle of 'Intrinsically Safe' (Ex i) electrical circuits?",
        "options": [
          "Operates electrical motors at reduced speeds to prevent spark generation",
          "Encloses live 480V electrical connections in heavy explosion-proof cast iron housings",
          "Floods the interior of junction boxes with dielectric transformer oil",
          "Limits electrical and thermal energy under normal and fault conditions below the minimum ignition energy (MIE) of the gas"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In API 650 Annex F, what is the critical design check for small internal pressures up to 2.5 psig?",
        "options": [
          "Frangible roof-to-shell joint design ensuring the roof fails preferentially before catastrophic shell-to-bottom tearing",
          "Installing heavy external counterweights along the wind girder",
          "Limiting tank capacity to a maximum of 5,000 barrels",
          "Welding continuous anchor straps across the entire tank roof surface"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does ISO 15926 achieve semantic interoperability for capital process plant lifecycle data?",
        "options": [
          "Restricts all engineering software vendors to a single shared cloud server",
          "Defines a formal first-order logic ontology, generic 4-dimensional upper model, and Reference Data Library (RDL)",
          "Translates all plant tag names into standard English words using a static lookup table",
          "Exports all CAD models into uncompressed bitmap image sequences"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      }
    ]
  },
  "3": {
    "EASY": [
      {
        "question": "What is a 'Digital Twin' in modern industrial engineering?",
        "options": [
          "A backup diesel generator running in parallel",
          "A dynamic virtual representation of a physical asset, process, or system updated with real-time data",
          "A mirror image of a control room monitor display",
          "A duplicate paper copy of engineering drawings stored in an archive"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does the abbreviation IoT stand for in smart industrial facilities?",
        "options": [
          "Internet of Things",
          "Index of Turbines",
          "Integrated Operational Testing",
          "International Offshore Tankers"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is the primary role of a Distributed Control System (DCS) in a refinery?",
        "options": [
          "Generating monthly commercial marketing newsletters",
          "Automated real-time regulatory control of continuous plant processes",
          "Designing 3D civil foundation drawings",
          "Tracking employee vacation days and payroll"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does SCADA stand for in industrial telemetry?",
        "options": [
          "Subsea Compression and Drilling Actuation",
          "Safety Containment and Discharge Allocation",
          "System Calculation and Design Automation",
          "Supervisory Control and Data Acquisition"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What open protocol is widely used for querying and updating data over RESTful web APIs?",
        "options": [
          "POP3",
          "Telnet",
          "OData (Open Data Protocol)",
          "Gopher"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What technology captures physical plant geometry into a high-density 3D point cloud?",
        "options": [
          "3D Terrestrial Laser Scanning (LiDAR)",
          "Standard 2D flatbed paper scanner",
          "Barometer pressure altitude log",
          "Magnetic compass survey"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does an RFID tag provide for physical field equipment in a plant?",
        "options": [
          "Real-time satellite GPS tracking with zero battery",
          "Automated remote destruction of defective valves",
          "Wireless contactless identification and digital tracking of asset tags",
          "Direct high-voltage power transmission through air"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is the primary benefit of Cloud Computing (SaaS) for engineering collaboration?",
        "options": [
          "Multi-user access to project data from anywhere without on-premise server maintenance",
          "Limiting application access to a single desktop PC",
          "Preventing any software updates or feature upgrades",
          "Eliminating the need for internet connectivity"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does the abbreviation GIS stand for in spatial asset management?",
        "options": [
          "Global Infrastructure Standards",
          "Geographic Information System",
          "Gas Injection Station",
          "General Industry Specification"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is a 'Point Cloud' in 3D digital engineering?",
        "options": [
          "A collection of millions of data points with spatial X, Y, Z coordinates representing surfaces",
          "A group of software servers hosted on the internet",
          "A scatter plot of employee test scores",
          "A weather forecast showing rain clouds over a facility"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does the abbreviation API stand for in software integration?",
        "options": [
          "Automated Piping Installation",
          "American Petroleum Inspection",
          "Asset Performance Indicator",
          "Application Programming Interface"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is a 'Tag' in process plant documentation (e.g. PT-101, MOV-204)?",
        "options": [
          "A standardized alphanumeric code uniquely identifying an instrument or mechanical equipment item",
          "The username of the technician who installed the valve",
          "The price sticker on equipment when delivered from the vendor",
          "A paper warning label attached to an electrical breaker"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Which wireless communication protocol is commonly used for short-range handheld inspection data sync?",
        "options": [
          "Analog microwave relay",
          "Shortwave telegraphy",
          "AM radio broadcast",
          "Bluetooth / BLE (Bluetooth Low Energy)"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does OCR stand for in automated document ingestion?",
        "options": [
          "Offshore Crude Recovery",
          "Operating Condition Ratio",
          "Optical Character Recognition",
          "Oil Containment Requirement"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does the term 'Brownfield' mean in plant engineering?",
        "options": [
          "A virgin plot of land where no construction has ever occurred",
          "An existing facility being modified, expanded, or modernized",
          "A plant site with agricultural soil contamination only",
          "A facility painted brown according to corporate branding"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does the term 'Greenfield' refer to in capital projects?",
        "options": [
          "A project focused exclusively on planting trees around a refinery",
          "A plant upgrade utilizing recycled steel components",
          "An offshore platform painted green for camouflage",
          "A completely new project built from the ground up on previously undeveloped land"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is the primary role of a 'Historian' database in a refinery (e.g. OSIsoft PI)?",
        "options": [
          "Archiving scanned copies of paper contracts from 1950",
          "Storing biographies of former company chief executive officers",
          "High-speed logging and archiving of continuous time-series process sensor measurements",
          "Recording daily stock market commodity closing prices"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What standard data format is commonly used to transfer structured data between web applications?",
        "options": [
          "Encrypted machine code binaries",
          "Raw unformatted audio WAV files",
          "Legacy magnetic tape images",
          "JSON (JavaScript Object Notation)"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is 'Predictive Maintenance' (PdM)?",
        "options": [
          "Replacing all parts on a strict calendar schedule regardless of wear",
          "Waiting for equipment to break down completely before repairing it",
          "Monitoring real-time equipment condition to predict failures before they happen",
          "Guessing repair dates based on equipment manufacture year"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does BIM stand for in architectural and engineering design?",
        "options": [
          "Bulk Insulation Material",
          "Building Information Modeling",
          "Basin Injection Metric",
          "Basic Instrument Marshalling"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "question": "What protocol is the modern open standard for secure, vendor-neutral industrial automation interoperability?",
        "options": [
          "Proprietary Siemens S7 protocol only",
          "Unencrypted raw TCP sockets with no handshake",
          "Modbus ASCII over dial-up modems",
          "OPC UA (Open Platform Communications Unified Architecture)"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "How does an enterprise Message Broker (e.g. Kafka, RabbitMQ) enhance industrial data architectures?",
        "options": [
          "Physically prints log files whenever a process variable exceeds limits",
          "Converts all industrial sensor voltages from 24V to 120V",
          "Decouples data producers from consumers with asynchronous event queues and backpressure management",
          "Restricts network communication to a single device at a time"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is the key advantage of using OData over generic custom REST APIs for industrial asset models?",
        "options": [
          "Eliminates the requirement for HTTP or TCP headers",
          "Standardized URL filtering ($filter, $select, $expand) and self-describing metadata schemas ($metadata)",
          "Requires zero authentication credentials on public networks",
          "Faster data transmission by skipping data serialization"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In 3D digital engineering, what does the Industry Foundation Classes (IFC) format provide?",
        "options": [
          "A proprietary file format exclusive to one CAD software vendor",
          "A texture compression standard for mobile gaming apps",
          "A compressed audio format for machine acoustic recordings",
          "An open, vendor-neutral data model specification for BIM and infrastructure geometry data exchange"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is 'Edge Computing' in an industrial IoT topology?",
        "options": [
          "Using obsolete computers located at the boundary of a facility",
          "Performing data processing, filtering, and analytics near the physical sensor source before sending to cloud",
          "Storing all data exclusively on offshore drilling drillbits",
          "Mounting computer servers along the outer edge of a desk"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "How does Machine Learning (ML) vibration analysis detect early stage bearing degradation?",
        "options": [
          "Relies on operators listening with a screwdriver held to the housing",
          "Calculates motor electrical bill increases at the end of the month",
          "Measures total physical shaft deflection with a mechanical ruler",
          "Identifies subtle spectral peak anomalies and harmonic sidebands before heat or noise becomes perceptible"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is the primary role of a 'Common Data Environment' (CDE) in capital plant project execution?",
        "options": [
          "A monolithic hard drive stored in the client headquarters safe",
          "The single agreed source of truth for collecting, managing, and disseminating all project information",
          "A public file-sharing website with no password authentication",
          "A shared breakroom where contractors and operators eat lunch together"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In industrial automation, what is the key difference between Modbus RTU and Modbus TCP?",
        "options": [
          "Modbus RTU requires fiber optic laser transceivers",
          "Modbus RTU is 100 times faster than Modbus TCP",
          "Modbus RTU uses serial RS-485 framing with CRC check; Modbus TCP wraps the PDU inside TCP/IP packets",
          "Modbus TCP cannot transmit analog temperature readings"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is an 'Optical Fiber Distributed Acoustic Sensing' (DAS) system used for along pipelines?",
        "options": [
          "Converts standard fiber optic cable into a continuous acoustic sensor detecting leaks and third-party intrusion",
          "Generates electrical power by absorbing pipeline vibrational energy",
          "Transmits cable television channels to pipeline maintenance stations",
          "Provides high-speed wireless Wi-Fi for passing vehicles"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is 'Semantic Tag Mapping' when federating plant databases?",
        "options": [
          "Replacing numeric tag numbers with colorful emojis",
          "Sorting database rows alphabetically by equipment manufacturer",
          "Mapping local column names and tag attributes to standard ontologies to ensure shared meaning",
          "Translating software buttons into different foreign languages"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "How do Artificial Intelligence models assist in automated P&ID verification against 3D CAD models?",
        "options": [
          "Re-draws all P&ID diagrams with artistic watercolor styling",
          "Predicts global oil prices to decide whether to build the pipeline",
          "Automatically deletes any equipment not visible in satellite photos",
          "Extracts line connectivity and nozzle tags from P&IDs and cross-checks them against 3D topology graphs"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is MQTT and why is it favored in industrial remote telemetry (SCADA)?",
        "options": [
          "A lightweight publish/subscribe messaging protocol designed for high-latency, low-bandwidth satellite/cellular links",
          "A database query language intended for big data analytics clusters",
          "A high-bandwidth video streaming protocol used for security cameras",
          "An uncompressed raw audio protocol for control room intercoms"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In digital twin implementations, what is the role of 'Time-Series Data Compression' (e.g. Swinging Door trending)?",
        "options": [
          "Truncates data older than 24 hours to save memory",
          "Encrypts sensor readings using password protected zip archives",
          "Discards redundant steady-state sensor readings while accurately capturing significant process slope changes",
          "Rounds all temperature measurements to the nearest 100 degrees"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What capability does Augmented Reality (AR) provide for plant field maintenance technicians?",
        "options": [
          "Overlays real-time operating parameters, P&ID schematics, and work steps onto the physical asset in the field",
          "Replaces the technician's eyes with virtual reality video games",
          "Hides physical machinery behind virtual cartoon characters",
          "Simulates flying a drone through the refinery without walking"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is a 'Data Lakehouse' architecture in enterprise energy analytics?",
        "options": [
          "A physical floating barge storing hard drives offshore",
          "Combines the unstructured data storage flexibility of a data lake with the transactional reliability and schema of a data warehouse",
          "A legacy tape storage facility located near a reservoir",
          "A cooling water pond used for heat dissipation in a server farm"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In engineering documentation, what is a 'Class Library' or Reference Data Library (RDL)?",
        "options": [
          "A standardized dictionary of equipment types, engineering units, and validated property definitions",
          "A list of certified welding inspectors available for hire",
          "A collection of software programming textbooks",
          "A physical bookshelf in the EPC contractor engineering office"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does 'Zero Trust Architecture' mandate in modern industrial OT security?",
        "options": [
          "Blocking all outgoing network traffic from the corporate headquarters",
          "Disabling all security controls because internal employees are completely trusted",
          "Prohibiting any software installations from third-party vendors",
          "Never trust, always verify: every user and device inside or outside the network must be authenticated and authorized"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "How does automated clash detection in 3D plant modeling software reduce capital construction costs?",
        "options": [
          "Calculates the lowest price for concrete foundation raw materials",
          "Identifies physical interferences between piping, structural steel, and electrical trays before spool fabrication on site",
          "Resolves personality conflicts between construction project managers",
          "Optimizes welding torch flame temperatures automatically"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is the primary role of a 'Software Container' (e.g. Docker) in industrial edge analytics deployments?",
        "options": [
          "A backup battery unit providing emergency power to PLCs",
          "A waterproof metal shipping box designed to protect computer servers in rain",
          "Packages application code and all its dependencies together so it runs reliably across diverse field hardware",
          "A virtual vault for storing confidential password keys"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does 'Digital Thread Continuity' prevent during plant commissioning handover?",
        "options": [
          "Loss of engineering design intent, equipment data attributes, and test records during handover to operations",
          "Delay in paying subcontractor construction invoices",
          "Overfilling of crude oil storage tanks during first fill",
          "Accidental physical severing of instrument communication cables by bulldozers"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "question": "What distinguishes MQTT Sparkplug B from generic raw MQTT in industrial automation?",
        "options": [
          "Eliminates the requirement for an MQTT message broker",
          "Defines standardized topic namespaces, structured metric payload schemas, and birth/death node state management",
          "Increases MQTT packet size to 1 Gigabyte per message",
          "Replaces TCP/IP with analog FM radio frequencies"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In OPC UA security architecture, what mechanism provides mutual authentication between client and server?",
        "options": [
          "X.509 digital certificates and asymmetric public/private key cryptography exchanged during channel opening",
          "Requiring operators to press a physical button on both machines simultaneously",
          "Sharing an administrative username and password in plaintext headers",
          "Validating the physical MAC address of the Ethernet network card"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does GraphQL compare to OData in engineering digital twin federated queries?",
        "options": [
          "GraphQL cannot handle structured JSON response payloads",
          "GraphQL requires proprietary software licenses from social media companies",
          "GraphQL enables clients to request exact nested fields across multiple services in a single roundtrip with zero overfetching",
          "GraphQL is limited to querying single database tables without joins"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In industrial network protocols, what distinguishes DNP3 Secure Authentication (SA) v5?",
        "options": [
          "Challenge-response HMAC message authentication preventing spoofing and replay attacks on remote terminal units (RTUs)",
          "Encrypts all telemetry payloads with 4096-bit RSA on every byte",
          "Requires operators to answer security questions before opening a circuit breaker",
          "Eliminates all message timestamps from historical event logs"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In deep learning document extraction, how do Graph Neural Networks (GNNs) represent P&ID topology?",
        "options": [
          "Sorts all text labels alphabetically without relational linking",
          "Nodes represent equipment symbols and instruments; edges represent process pipelines and signal connections",
          "Converts the drawing into a 1D audio waveform for voice analysis",
          "Treats the entire diagram as an unorganized 2D grid of independent color pixels"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What is the function of the ISA-95 standard in enterprise manufacturing integration?",
        "options": [
          "Governs the chemical formulation of turbine lubricating oils",
          "Establishes standard dimensions for industrial shipping containers",
          "Specifies the fire resistance rating of offshore accommodation modules",
          "Defines the hierarchical levels (Level 0 field to Level 4 enterprise ERP) and standard interfaces between MES and business systems"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In time-series database design, how does columnar storage (e.g. ClickHouse, InfluxDB) outperform traditional row-based RDBMS?",
        "options": [
          "Eliminates the need for indexing by searching data randomly",
          "Compresses identical timestamp and sensor column values together, enabling massive vector scan throughput for analytics",
          "Stores every sensor reading in a separate physical text file on disk",
          "Requires no disk storage by keeping all data in temporary RAM only"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does Time-Sensitive Networking (TSN / IEEE 802.1Qbv) achieve deterministic Ethernet communication in plants?",
        "options": [
          "Increases Ethernet cable diameter to reduce electrical resistance",
          "Disables all non-critical network traffic permanently",
          "Implements time-aware traffic shapers that open and close transmission gates on synchronized nanosecond schedules",
          "Dedicates a physical copper cable to each individual sensor"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What is the function of a 'Semantic Web Ontology' (OWL / RDF) in complex digital engineering?",
        "options": [
          "Defines formal explicit specifications of domain concepts, relationships, and logic rules enabling automated reasoning",
          "Generates decorative 3D animations for marketing videos",
          "Compresses CAD files into smaller zip archives",
          "Acts as an online dictionary of engineering slang words"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In industrial edge AI deployments, what does model quantization (e.g. FP32 to INT8) achieve?",
        "options": [
          "Allows the model to operate without any electrical power",
          "Removes half of the neural network layers at random",
          "Translates Python code into raw machine assembly language",
          "Reduces model memory footprint and inference latency by 4x with negligible loss in predictive accuracy on edge hardware"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What challenge does Eventual Consistency pose in distributed plant digital twin replicas?",
        "options": [
          "Temporary divergence between local site twins and centralized cloud models during network WAN partition events",
          "Inability of engineers to log in unless all global servers are online",
          "Controllers executing contradictory valve commands simultaneously in the field",
          "Permanent loss of all historical sensor measurements after 30 days"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In multi-discipline engineering software, how is automated 'Spatial Indexing' implemented across 3D plant models?",
        "options": [
          "Placing all objects in a single hash table keyed by part number",
          "Iterating through every triangle in the entire model for each query",
          "R-trees and k-d trees that recursively partition 3D bounding boxes for rapid geometric collision and proximity queries",
          "Sorting all components by their purchase cost in descending order"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What does the CFIHOS standard mandate for equipment attribute inheritance in digital engineering?",
        "options": [
          "Attributes cannot be shared between mechanical and electrical disciplines",
          "Attribute names must not exceed 4 characters in length",
          "Every equipment item must have a completely unique set of attribute names",
          "Class-attribute inheritance where specific equipment subclasses inherit all parent properties plus specialized operational parameters"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does Modbus Exception Code 02 ('Illegal Data Address') typically originate in DCS integration?",
        "options": [
          "The slave device rejected the master's security password",
          "The master requested a holding register address that does not exist in the slave device memory mapping",
          "The communication cable was physically unplugged",
          "The CRC error check detected electromagnetic noise corruption"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In industrial IoT streaming, what is the 'Deadband' filter and how does it optimize network bandwidth?",
        "options": [
          "Disconnects field transmitters when battery voltage drops below 5%",
          "Eliminates all high-frequency process noise by averaging data over 24 hours",
          "Suppresses transmission of new sensor values until the measured variable changes by more than a specified threshold or percentage",
          "Blocks all network traffic during night shifts when operators are off duty"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What role does the Open Industrial Digital Twin Core (e.g. DTDL - Digital Twins Definition Language) play?",
        "options": [
          "Provides an open JSON-LD metamodel for defining telemetry, properties, commands, and relationships between digital twin nodes",
          "Replaces all CAD modeling software with automated AI code generators",
          "Restricts digital twin deployments to a single proprietary cloud vendor",
          "Mandates that all digital twins use the same 3D color scheme"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does an industrial API gateway prevent Denial of Service (DoS) attacks on fragile plant PLC web interfaces?",
        "options": [
          "Disconnects the facility from the electrical power grid",
          "Restarts the PLC whenever incoming traffic exceeds 10 packets per second",
          "Automatically shuts down all plant production during high traffic",
          "Enforces strict rate-limiting, IP whitelisting, and request payload schema validation at the perimeter"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In structural health monitoring, how is Operational Modal Analysis (OMA) used on offshore jacket platforms?",
        "options": [
          "Measures paint peeling rate caused by salt water spray",
          "Identifies structural natural frequencies and mode shapes from ambient wave excitation to detect subsea brace cracks",
          "Applies massive hydraulic shaker weights to shake the platform until beams crack",
          "Calculates structural stresses based solely on the weight of deck modules"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What is the difference between Synchronous and Asynchronous data exchange in engineering workflows?",
        "options": [
          "Synchronous requires manual operator clicks; Asynchronous runs automatically",
          "Synchronous is for numbers; Asynchronous is for text strings",
          "Synchronous blocks execution until the receiver responds; Asynchronous dispatches requests to message queues and continues processing",
          "Synchronous works only over fiber optics; Asynchronous works only over copper"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In plant laser scanning, what is 'Iterative Closest Point' (ICP) registration?",
        "options": [
          "A method for filtering out dust particles from laser beams",
          "A tool for measuring distance between two physical pipe supports",
          "A laser hardware calibration process done once at the factory",
          "An algorithm that iteratively minimizes distance between corresponding points to precisely align adjacent point cloud scans"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      }
    ],
    "DIFFICULT": [
      {
        "question": "In industrial cyber-physical systems, what fundamental vulnerability makes Fieldbus protocols susceptible to replay attacks?",
        "options": [
          "Lack of cryptographic packet integrity verification and lack of monotonic sequence numbers in legacy protocol frames",
          "Dependence on wireless Bluetooth relays across control cabinets",
          "Excessive encryption key lengths causing processor buffer overruns",
          "Use of non-standard baud rates that confuse modern operating systems"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does the Raft consensus algorithm maintain state machine consistency in distributed industrial control clusters?",
        "options": [
          "Requires 100% unanimous agreement from every node before any transaction executes",
          "Alternates master status between nodes every 60 seconds automatically",
          "Allows all nodes to write to shared memory concurrently without locking",
          "Elects a single leader per term, which orchestrates log replication to a majority quorum before committing state changes"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In OPC UA Part 14 (PubSub over TSN), what enables deterministic sub-millisecond motion and inter-controller synchronization?",
        "options": [
          "Compressing XML messages into encrypted zip files before transmission",
          "Routing all control messages through a centralized cloud broker in another continent",
          "IEEE 802.1AS precision time protocol combined with scheduled traffic queues and zero-copy binary encoding",
          "Operating standard HTTP/1.1 over public 5G cellular frequencies"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does semantic ontology alignment resolve impedance mismatch between ISO 15926 4D mereology and standard relational engineering tables?",
        "options": [
          "Converts all engineering units into imperial feet and inches exclusively",
          "Flattens all dimensional entities into a single 1000-column CSV spreadsheet",
          "Discards all temporal timestamps and models assets as static 3D shapes only",
          "Maps relational rows and foreign keys into OWL individuals, classes, and spatio-temporal part-of relations with ontological reasoning"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In automated AI engineering drawing parsing, how is the 'vanishing line' problem in complex interconnected piping loops addressed?",
        "options": [
          "Deleting all crossing lines that cannot be traced with high certainty",
          "Replacing crossing lines with straight diagonal approximations",
          "Multi-scale directional convolution kernels coupled with topological graph continuity heuristics that preserve pipeline line integrity",
          "Assuming all pipelines terminate at the nearest vessel boundary"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What is the CAP Theorem trade-off commonly selected for edge-deployed plant SCADA nodes during network WAN severance?",
        "options": [
          "Availability and Partition Tolerance (AP), continuing local monitoring while buffering changes for eventual reconciliation",
          "Consistency and Availability (CA), assuming network partitions are mathematically impossible in industrial plants",
          "Sacrificing all three properties and reverting to manual pen and paper logs",
          "Consistency and Partition Tolerance (CP), immediately halting all plant control when WAN connectivity is lost"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In industrial time-series data architectures, how does the Gorilla compression algorithm achieve 10x memory reduction for floating-point sensor data?",
        "options": [
          "Stores only the minimum and maximum values observed over a 24-hour shift",
          "Rounds all process values to single-byte integers between 0 and 255",
          "Combines XOR delta-of-delta compression for floating point values with delta-of-delta timestamp encoding",
          "Converts floating point numbers to ASCII text strings"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "Under ISA-95 Part 2, what object model links enterprise ERP production schedules to plant-floor batch recipe execution?",
        "options": [
          "Operations Definition, Operations Schedule, and Operations Performance models exchanging B2MML XML/JSON schemas",
          "A direct shared SQL database table accessed by both SAP and PLC firmware",
          "Manual phone calls between corporate headquarters and the control room foreman",
          "Daily printouts of spreadsheet tables delivered by courier"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does a Byzantine Fault Tolerant (BFT) consensus protocol operate in critical multi-operator energy trading microgrids?",
        "options": [
          "Trusts the largest utility company to dictate all transaction settlements unilaterally",
          "Maintains consensus on transaction state even if up to one-third of participating validator nodes are malicious or corrupted",
          "Requires human notarization of each electrical power transaction",
          "Halts all electricity generation if any single node experiences a minor network glitch"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In high-fidelity process digital twins, what mathematical technique reconciles noisy sensor measurements with mass/energy conservation laws?",
        "options": [
          "Averaging all sensor values together with equal weighting",
          "Manually tuning sensor calibration constants until numbers match expectations",
          "Non-linear Data Reconciliation and Gross Error Detection (DVR) using constrained optimization solvers",
          "Ignoring physical mass balance laws and trusting raw transmitter signals unconditionally"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In digital twin geometry pipelines, what is 'Mesh Decimation' and why is it critical for mobile AR rendering?",
        "options": [
          "Cuts CAD models into small square tiles that load one at a time",
          "Reduces polygon count using quadric error metrics while preserving overall silhouette and visual fidelity of CAD models",
          "Deletes all textures and displays models as unshaded white boxes",
          "Converts 3D geometry into flat 2D engineering drawings"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How do Zero-Knowledge Proofs (ZKPs) enable secure provenance verification of carbon emissions data across energy supply chains?",
        "options": [
          "Replaces physical emission sensors with self-signed legal affidavits",
          "Publishes all sensitive corporate financial records to an open public database",
          "Allows suppliers to mathematically prove compliance with emissions thresholds without revealing proprietary process formulas or output volumes",
          "Encrypts data so securely that neither the auditor nor the client can ever decrypt it"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What is the primary technical limitation of deploying standard Large Language Models (LLMs) directly to plant control loops?",
        "options": [
          "LLMs only understand English and cannot read numbers",
          "Stochastic non-deterministic outputs, latency jitter, and lack of hard real-time safety guarantees make them unsafe for direct actuation",
          "LLM software cannot connect to computer monitors",
          "LLMs consume too much physical control room floor space"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In distributed control architectures, what is 'Clock Skew' and how is it mitigated across wide-area SCADA substations?",
        "options": [
          "Mechanical gears in control room clocks running slow due to dust",
          "Operators setting their personal wristwatches to different minutes",
          "Time zone differences between corporate headquarters and the refinery",
          "Drift between local hardware oscillators, mitigated by IEEE 1588 PTP (Precision Time Protocol) and GPS-synchronized grandmaster clocks"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In industrial microservices architecture, how does the 'Saga Pattern' manage distributed multi-system engineering transactions?",
        "options": [
          "Executes a sequence of local transactions coordinated by an orchestrator, dispatching compensating transactions if a step fails",
          "Allows partial incomplete writes without error checking or compensation",
          "Rolls back all plant operations to original factory settings if any software error occurs",
          "Locks all global databases across the enterprise until the entire workflow completes successfully"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does Spatial Heterogeneity in point clouds affect automated 3D reconstruction algorithms in brownfield laser surveys?",
        "options": [
          "Laser beams penetrate solid steel pipes and map internal fluid flows directly",
          "Variable point density and occluded shadow regions create missing geometric surfaces requiring Poisson surface reconstruction and inpainting",
          "Color information in point clouds prevents geometric reconstruction from executing",
          "Point cloud density is always perfectly uniform across all physical surfaces"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In industrial IoT edge analytics, what is 'Sensor Drift' and what mathematical algorithm dynamically detects it?",
        "options": [
          "Transmitters physically sliding along pipe racks due to vibration",
          "Sudden catastrophic failure caused by lightning strikes",
          "Wind blowing sensor cables sideways across cable trays",
          "Gradual calibration loss over time, detected using Principal Component Analysis (PCA) residuals and Kalman filter state estimation"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What is the key advantage of WebAssembly (Wasm) for running engineering simulation engines in browser-based digital twins?",
        "options": [
          "Executes compiled C++/Rust simulation code at near-native binary speed securely inside the browser sandbox without plugins",
          "Converts 3D models into text descriptions for screen readers",
          "Allows web pages to run without an active internet connection",
          "Bypasses all browser security restrictions to access the client hard drive directly"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In cyber-physical OT defense, what is an 'Air Gap' and why is it no longer considered infallible protection?",
        "options": [
          "A pneumatic air line used to actuate emergency shutdown valves",
          "Physical network isolation, which can still be bridged via compromised USB maintenance laptops, transient vendor gear, and rogue wireless",
          "An intentional space between offshore platform decks to allow wind passage",
          "A gap between cooling fans in computer server racks"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What is the primary role of a Knowledge Graph in enterprise asset management?",
        "options": [
          "Plots equipment purchase prices on a 2D line graph over time",
          "A geographic map showing the physical locations of company office buildings",
          "A hierarchical organizational chart showing employee reporting lines",
          "Represents assets, maintenance logs, failure modes, and operating procedures as interconnected semantic entities and edges for AI discovery"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      }
    ]
  },
  "4": {
    "EASY": [
      {
        "question": "What does the 'Upstream' sector of the oil & gas industry focus on?",
        "options": [
          "Operating retail petrol service stations",
          "Exploration, drilling, and crude oil and natural gas production",
          "Manufacturing plastic consumer products",
          "Refining crude oil into gasoline and diesel"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does the 'Midstream' sector primarily manage in the energy value chain?",
        "options": [
          "Manufacturing electric vehicle batteries",
          "Selling petrochemicals directly to consumers",
          "Drilling exploratory wells in deep water",
          "Transportation, storage, and wholesale marketing of oil, gas, and NGLs via pipelines and tankers"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does the 'Downstream' sector of the petroleum industry encompass?",
        "options": [
          "Fabricating offshore drilling rig jackets",
          "Seismic geological surveying on the ocean floor",
          "Refining crude oil, petrochemical manufacturing, and product distribution/retail",
          "Laying subsea deepwater pipelines"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does the abbreviation LNG stand for in global energy trade?",
        "options": [
          "Liquefied Natural Gas",
          "Low Nitrogen Gasoline",
          "Liquid Nitrogen Gas",
          "Light Naphtha Gas"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is the primary difference between CAPEX and OPEX in capital project economics?",
        "options": [
          "CAPEX is paid to governments; OPEX is paid to contractors",
          "CAPEX is for maintenance; OPEX is for purchasing new equipment",
          "CAPEX is upfront capital expenditure on assets; OPEX is ongoing operational expenditure to run the facility",
          "CAPEX applies only to software; OPEX applies only to steel"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does the standard energy metric 'BOE' stand for?",
        "options": [
          "Barrel of Oil Equivalent",
          "Boiler Output Energy",
          "Basic Offshore Engineering",
          "Baseline Operational Efficiency"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is the primary goal of the global 'Energy Transition'?",
        "options": [
          "Switching all oil refineries to produce diesel only",
          "Replacing all steel pipes with copper pipes",
          "Stopping all industrial electricity consumption globally",
          "Shifting from fossil-fuel dominated energy systems to low-carbon, renewable, and sustainable energy sources"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does CCUS stand for in environmental energy technologies?",
        "options": [
          "Combined Cycle Underground Station",
          "Carbon Capture, Utilization, and Storage",
          "Crude Chemical Utility Systems",
          "Clean Combustion Units Standard"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does 'Net Zero' emissions mean for an industrial operator?",
        "options": [
          "Emitting zero sound or noise from plant equipment",
          "Reducing annual operational expenditures to zero dollars",
          "Operating a refinery with zero employees on site",
          "Balancing remaining greenhouse gas emissions with an equivalent amount of carbon removal or abatement"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "In greenhouse gas accounting, what are 'Scope 1' emissions?",
        "options": [
          "Emissions generated by employee personal vehicles during vacation",
          "Direct emissions from company-owned and controlled sources (e.g. boilers, furnaces, flaring)",
          "Indirect emissions across the upstream and downstream supply chain (Scope 3)",
          "Indirect emissions from purchased electricity and steam (Scope 2)"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "In greenhouse gas accounting, what are 'Scope 2' emissions?",
        "options": [
          "Indirect emissions from the generation of purchased electricity, steam, heating, and cooling",
          "Emissions from customer use of sold gasoline",
          "Direct emissions from plant smokestacks",
          "Emissions from corporate air travel"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is 'Routine Flaring' in upstream oil production?",
        "options": [
          "A planned emergency relief test of a flare tip",
          "Lighting flare stacks for night illumination of platforms",
          "Burning of associated natural gas produced during oil extraction when no gas market or pipeline exists",
          "Cleaning internal burner nozzles with high-pressure steam"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does 'E&P' stand for in the energy sector?",
        "options": [
          "Environmental Protection",
          "Engineering and Procurement",
          "Economics and Planning",
          "Exploration and Production"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is a 'Turnaround' (TAR) in a refinery or chemical processing plant?",
        "options": [
          "A planned, periodic shutdown of an operating unit for inspection, major maintenance, and revamping",
          "Rotating a control valve 180 degrees to clear an obstruction",
          "The time it takes for an oil tanker to dock and unload cargo",
          "The daily shift change between day and night operators"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is 'Blue Hydrogen'?",
        "options": [
          "Hydrogen produced via water electrolysis powered entirely by renewable electricity (Green)",
          "Hydrogen produced from natural gas via steam methane reforming coupled with carbon capture and storage (CCUS)",
          "Hydrogen extracted directly from natural deep underground geological deposits (Gold/White)",
          "Hydrogen manufactured from coal gasification with no carbon capture (Brown/Black)"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is 'Green Hydrogen'?",
        "options": [
          "Hydrogen produced from nuclear power (Pink)",
          "Natural gas blended with green odorant chemicals for leak detection",
          "Hydrogen produced through water electrolysis powered 100% by renewable energy (solar, wind, hydro)",
          "Hydrogen produced from burning coal in high-temperature ovens"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does ROI stand for in capital investment appraisal?",
        "options": [
          "Rate of Injection",
          "Return on Investment",
          "Risk of Ignition",
          "Refinery Operational Index"
        ],
        "correct": 1,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What is the primary function of a Floating Production Storage and Offloading (FPSO) vessel?",
        "options": [
          "Lays subsea pipelines across continental shelves",
          "Transports refined diesel fuel to retail marinas",
          "Drills exploration wells on the ocean floor like a drillship",
          "Produces, processes, and stores hydrocarbons offshore until they can be offloaded onto shuttle tankers"
        ],
        "correct": 3,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "What does 'Unplanned Downtime' mean in facility operations?",
        "options": [
          "Unexpected equipment failures or outages that halt production outside of scheduled maintenance windows",
          "Stopping plant operations for a scheduled safety drill",
          "Scheduled annual turnaround maintenance",
          "Closing the administration office on national holidays"
        ],
        "correct": 0,
        "points": 100,
        "difficulty": "EASY"
      },
      {
        "question": "Why is Abu Dhabi and ADIPEC globally significant in the energy sector?",
        "options": [
          "It is where crude oil was first discovered in the ancient world",
          "It produces 100% of the world's natural gas consumption",
          "Abu Dhabi hosts major global oil and gas reserves and ADIPEC is the world's largest annual energy exhibition",
          "It is the only city in the world with an oil refinery"
        ],
        "correct": 2,
        "points": 100,
        "difficulty": "EASY"
      }
    ],
    "MEDIUM": [
      {
        "question": "What is 'Asset Integrity Management' (AIM) and what is its primary business payoff?",
        "options": [
          "Ensuring assets safely fulfill their operational purpose while preventing catastrophic loss and optimizing lifecycle cost",
          "Purchasing insurance policies to cover 100% of potential losses",
          "Refurbishing office furniture to maintain corporate appearance",
          "Auditing employee financial expense reports for accuracy"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is the economic impact of unplanned shutdown events in a world-scale LNG liquefaction facility?",
        "options": [
          "Under $500 per day in utility electricity costs",
          "Negligible, because LNG can always be recovered from the atmosphere later",
          "Zero, because natural gas flows automatically without equipment",
          "Can exceed $1 million to $5 million per day in lost production, off-spec product, and deferred export cargos"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is a 'Crack Spread' in petroleum refining economics?",
        "options": [
          "The price differential between a barrel of crude oil and the wholesale value of the refined petroleum products derived from it",
          "A physical fracture in a high-pressure reactor shell",
          "The commission fee charged by commodity trading brokers",
          "The allowable gap between piping flanges during bolt tightening"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "How does digitalizing operator rounds and shift handovers reduce operational expenditure (OPEX)?",
        "options": [
          "Decreases the physical weight of control room consoles",
          "Eliminates transcription errors, identifies early stage equipment anomalies, and prevents communication breakdown incidents",
          "Allows plants to operate with zero maintenance staff on site",
          "Eliminates the requirement for local regulatory operating permits"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does Levelized Cost of Energy (LCOE) measure?",
        "options": [
          "The retail price of electricity charged to residential consumers per month",
          "The installation cost of high-voltage transmission power poles",
          "The net present value of the unit cost of electricity over the entire operational lifetime of a generating asset",
          "The physical weight of fuel required to run a generator for one hour"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In capital projects, what is the 'EPC' contracting model?",
        "options": [
          "Environmental Protection Committee responsible for planting trees",
          "Emergency Power Contingency plan for hurricane survival",
          "Equipment Production Certification issued by vendor factories",
          "Engineering, Procurement, and Construction, where a single contractor delivers the complete turnkey facility"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is 'Fugitive Emissions' in an industrial plant?",
        "options": [
          "Unintended leaks of gases or vapors from pressurized equipment components such as valve packing, flanges, and seals",
          "Water vapor rising from cooling tower cooling water",
          "Exhaust gas discharged through tall licensed smokestacks",
          "Natural gas consumed as fuel in industrial boiler burners"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is a 'Leak Detection and Repair' (LDAR) program?",
        "options": [
          "Testing fire hoses for water pressure leaks once per year",
          "Inspecting hydraulic brakes on company pickup trucks",
          "Checking municipal water pipes for underground residential leaks",
          "A structured regulatory procedure to identify and repair fugitive VOC and methane emissions using optical gas imaging"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In oil & gas economics, what does 'OPEX per Barrel' represent?",
        "options": [
          "The retail market sales price of one barrel of Brent crude",
          "The ongoing operational cost incurred to lift and produce one barrel of oil equivalent",
          "The cost of manufacturing an empty 55-gallon steel drum",
          "The shipping freight fee to transport oil across the ocean"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is the primary operational risk during a refinery Turnaround & Overhaul (T&O)?",
        "options": [
          "Schedule slippage and scope creep that delay plant restart and result in millions in deferred production revenue",
          "Running out of fresh coffee in the administrative breakroom",
          "Excessive sunny weather causing scaffold pipes to expand",
          "Having too many empty parking spaces in the contractor lot"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "How does predictive maintenance based on real-time asset telemetry reduce overall maintenance OPEX?",
        "options": [
          "Eliminates all spare parts inventory from the warehouse completely",
          "Forces equipment to run continuously until it catches fire",
          "Replaces arbitrary time-based overhauls with targeted interventions only when degradation signatures are detected",
          "Prohibits technicians from performing routine lubrication tasks"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is an 'Associated Gas' in upstream production?",
        "options": [
          "Nitrogen gas used to purge chemical reaction vessels",
          "Natural gas found in association with crude oil deposits, either dissolved in the oil or as a free gas cap",
          "Exhaust gas generated by diesel generator engines",
          "Gas purchased from third-party utility pipelines for heating"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is 'Enhanced Oil Recovery' (EOR)?",
        "options": [
          "Using larger horsepower surface pump jacks",
          "Adding chemical detergents to crude oil inside shipping tankers",
          "Tertiary recovery techniques (CO2 injection, steam flooding, chemical polymers) to extract residual oil from mature reservoirs",
          "Drilling more shallow wells close together in the same field"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "How does implementing an engineering Digital Twin reduce commissioning cycle time during facility startup?",
        "options": [
          "Allows construction crews to work without engineering drawings",
          "Enables virtual commissioning and control logic pre-testing before physical iron arrives on site, catching bugs early",
          "Reduces the volume of crude oil needed to test the processing plant",
          "Bypasses all physical instrument loop tests and safety verifications"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In LNG trade, what is 'Boil-Off Gas' (BOG)?",
        "options": [
          "Natural gas vapor generated by heat ingress into cryogenic LNG storage tanks and carrier cargo holds",
          "Steam produced by boiling water in cooling tower basins",
          "Liquefied gas spilled onto the ocean surface during loading",
          "High-temperature exhaust gas from gas turbine compressors"
        ],
        "correct": 0,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does 'ESG' stand for in corporate performance and investment reporting?",
        "options": [
          "Economic Sustainability and Growth",
          "Emergency Shutdown and Gas detection",
          "Engineering, Safety, and Global standard",
          "Environmental, Social, and Governance"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is 'Methane Intensity' as a sustainability metric in upstream production?",
        "options": [
          "The physical weight of one cubic foot of methane gas",
          "The percentage of methane present in refined gasoline fuel",
          "The volume of methane emissions released divided by the total volume of natural gas produced and marketed",
          "The temperature of burning methane in a laboratory burner"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What is the primary financial benefit of extending plant asset design life via Fitness-for-Service (FFS)?",
        "options": [
          "Increases the physical size of the refinery processing units",
          "Allows plant operators to retire earlier with full pension benefits",
          "Eliminates the requirement to pay local property taxes on the facility",
          "Defers hundreds of millions in major capital equipment replacement while maintaining full regulatory safety margins"
        ],
        "correct": 3,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "What does 'Total Cost of Ownership' (TCO) include beyond the initial purchase price?",
        "options": [
          "The cost of shipping the item by air freight instead of sea",
          "The cost of the vendor sales representative dinner meeting",
          "Installation, commissioning, energy consumption, routine maintenance, spare parts, and ultimate decommissioning costs",
          "The sales tax paid to the vendor at the time of purchase only"
        ],
        "correct": 2,
        "points": 200,
        "difficulty": "MEDIUM"
      },
      {
        "question": "In capital facilities handover, what is the cost consequence of 'Dirty Data' (missing tags, obsolete drawings)?",
        "options": [
          "Requires repainting all facility pipework with fresh colors",
          "Operators spend 20-30% of their maintenance engineering time searching for and verifying technical information",
          "Causes computer hard drives to wear out twice as fast",
          "Increases software license renewal fees by 500%"
        ],
        "correct": 1,
        "points": 200,
        "difficulty": "MEDIUM"
      }
    ],
    "HARD": [
      {
        "question": "In energy capital project finance, what is the 'Internal Rate of Return' (IRR)?",
        "options": [
          "The percentage of crude oil that is converted into refined products",
          "The discount rate at which the Net Present Value (NPV) of all project cash flows equals exactly zero",
          "The annual interest rate charged by commercial investment banks for debt",
          "The physical rate of return of condensate liquid from steam traps"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What is a 'Marginal Abatement Cost Curve' (MACC) used for in decarbonization strategy?",
        "options": [
          "Plots daily crude oil spot prices against refinery utilization rates",
          "Calculates the tax rate applied to carbon credits in voluntary markets",
          "Ranks greenhouse gas reduction technologies by cost per metric ton of CO2 equivalent abated against total abatement potential",
          "Illustrates the depreciation curve of catalytic cracking catalysts"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In deepwater offshore exploration, what represents the single largest cost driver during drilling operations?",
        "options": [
          "Purchasing protective steel-toed boots for drilling floor crews",
          "Painting the drillship hull with anti-fouling marine paint",
          "Satellite television subscription fees for the offshore accommodation rig",
          "Day-rate costs of deepwater drillships ($300k-$600k+/day) combined with non-productive time (NPT) during unexpected tool failure"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What is the economic principle behind 'Carbon Border Adjustment Mechanisms' (CBAM)?",
        "options": [
          "Provides free carbon credits to international shipping companies",
          "Subsidizes fossil fuel exports to developing nations",
          "Imposes a carbon tariff on carbon-intensive goods imported into a jurisdiction to prevent carbon leakage and level the playing field",
          "Eliminates all customs duties on imported refined petroleum products"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does a unified engineering Digital Twin directly accelerate Time-to-Market for green hydrogen mega-projects?",
        "options": [
          "Parallelizes front-end engineering design (FEED), procurement specs, and modular skid fabrication while eliminating integration clashes",
          "Permits green hydrogen plants to operate without water supply connections",
          "Allows hydrogen pipelines to use cheap standard plastic PVC piping",
          "Eliminates the requirement for electrolyzer stack testing prior to operation"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In energy trading, what does 'Spark Spread' versus 'Dark Spread' measure?",
        "options": [
          "Spark Spread measures electrical fires; Dark Spread measures night power cuts",
          "Spark Spread is the gross margin of gas-fired power generation; Dark Spread is the gross margin of coal-fired power generation",
          "Spark Spread is crude oil profit; Dark Spread is natural gas profit",
          "Spark Spread is for solar energy; Dark Spread is for geothermal energy"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What financial impact does a 1% improvement in overall refinery thermal efficiency yield for a 300,000 bpd plant?",
        "options": [
          "Tens of millions of dollars annually in reduced natural gas fuel consumption and proportional Scope 1 emissions reductions",
          "Under $10,000 per year in electricity savings",
          "Over $1 billion per day in immediate cash profit",
          "Zero financial benefit due to fixed utility electricity contracts"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In corporate ESG reporting, what are 'Scope 3' Category 11 emissions for an integrated oil & gas company?",
        "options": [
          "Purchased electricity used to illuminate petrol station forecourts (Scope 2)",
          "Emissions from company corporate jet travel for executive meetings",
          "Use of Sold Products: the emissions generated when consumers burn the gasoline, diesel, and natural gas sold by the company",
          "Emissions from burning natural gas in refinery boiler furnaces (Scope 1)"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What is the primary thermodynamic challenge that drives the high OPEX of Carbon Capture via Amine Absorption?",
        "options": [
          "The massive thermal reboiler duty required to strip CO2 from rich amine solvent at elevated temperatures (typically 120-140C)",
          "The electrical energy required to light the amine absorption tower",
          "The requirement to replace 100% of the amine solvent every 24 hours",
          "The cost of shipping captured liquid CO2 in wooden barrels"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In downstream refining, what is the purpose of a 'Catalytic Reforming' unit and what is its business value?",
        "options": [
          "Removes nitrogen gas from atmospheric air for tire inflation",
          "Converts low-octane heavy naphtha into high-octane aromatic blending components (reformate) and valuable byproduct hydrogen",
          "Cools hot kerosene before pumping into airport jet fuel storage tanks",
          "Cracks heavy vacuum gas oil into asphalt and tar for roofing"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What risk does 'Carbon Asset Stranding' present to long-dated fossil energy infrastructure investments?",
        "options": [
          "Refineries that run out of fresh water during drought conditions",
          "Drilling rigs that run aground on sandbars during ocean transport",
          "Pipelines that become physically blocked by solid wax precipitates",
          "Assets that suffer premature write-downs, devaluations, or conversion to liabilities due to regulatory climate policies or market shifts"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does automated asset tag reconciliation reduce capital project cost overruns during the EPC-to-O&M handover?",
        "options": [
          "Discards unreadable documentation to accelerate handover schedule by 6 months",
          "Eliminates the requirement for operational spare parts in the warehouse",
          "Validates that physical vendor serial numbers, 3D CAD tags, P&ID attributes, and SAP maintenance hierarchies align before final payment",
          "Allows the EPC contractor to bill the asset owner for uninstalled valves"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In capital allocation, what is 'Hurdle Rate'?",
        "options": [
          "The maximum physical height a worker can jump during an offshore survival test",
          "The interest rate paid on short-term payroll overdraft bank accounts",
          "The speed at which a drilling bit penetrates rock formations",
          "The minimum acceptable rate of return required by an energy company before committing capital to a new project"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What does 'Levelized Cost of Hydrogen' (LCOH) include for a blue hydrogen plant?",
        "options": [
          "Natural gas feedstock cost, CAPEX of steam methane reformer (SMR), CCUS infrastructure, transport, and underground storage",
          "Only the wholesale purchase price of water from the local city utility",
          "The retail price of hydrogen fuel cells sold in automotive showrooms",
          "The cost of painting hydrogen storage cylinders with blue stripes"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In oil & gas commercial contracts, what is a 'Take-or-Pay' clause?",
        "options": [
          "Contractors must take all scrap metal from the construction site or pay a fine",
          "The seller can choose whether or not to deliver product without legal liability",
          "Operators must take annual safety exams or forfeit their salary",
          "A buyer must either take agreed quantities of product or pay a predetermined penalty if they do not take delivery"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What is the business value of predictive maintenance in offshore subsea production trees?",
        "options": [
          "Offshore subsea wells do not require any maintenance for 100 years",
          "Subsea trees can be repaired by standard scuba divers with hand tools",
          "Subsea intervention vessels cost $200k-$400k/day; predictive intervention avoids emergency deepwater well-shutins",
          "Eliminates all legal liability for offshore oil spills"
        ],
        "correct": 2,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "How does implementing real-time fugitive emission monitoring with automated alarms protect enterprise EBITDA?",
        "options": [
          "Lowers the cost of printing corporate financial reports",
          "Prevents loss of valuable marketable product, avoids heavy environmental regulatory fines, and protects corporate ESG credit ratings",
          "Allows plants to operate without installing catalytic converters",
          "Decreases the volume of crude oil needed to run refinery furnaces"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What is 'Net Present Value' (NPV) and why is it the gold standard for mega-project approval?",
        "options": [
          "Sums all future cash inflows and outflows discounted to current value; a positive NPV indicates the project adds net economic value",
          "Reflects the total tax credits received from local governments in year one",
          "Measures the net current sales price of company common stock shares",
          "Calculates the total physical weight of all materials installed in the plant"
        ],
        "correct": 0,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "In industrial process operations, what is 'Energy Intensity'?",
        "options": [
          "The brightness of outdoor floodlights in a refinery at midnight",
          "The quantity of energy consumed per unit of economic output or physical product produced (e.g. GJ per ton of ammonia)",
          "The maximum temperature of a welding torch flame",
          "The speed at which crude oil flows through a pipeline"
        ],
        "correct": 1,
        "points": 300,
        "difficulty": "HARD"
      },
      {
        "question": "What is the primary commercial mechanism of an 'EPCm' (Engineering, Procurement, Construction Management) contract?",
        "options": [
          "The contractor guarantees fixed total cost and takes 100% financial risk (Lump Sum Turnkey)",
          "Construction is performed entirely by volunteers without pay",
          "The contractor owns the plant forever and sells product to the client",
          "The client contracts directly with construction trades while the EPCm contractor acts as managing agent on a professional fee basis"
        ],
        "correct": 3,
        "points": 300,
        "difficulty": "HARD"
      }
    ],
    "DIFFICULT": [
      {
        "question": "In LNG liquefaction project economics, what thermodynamic trade-off distinguishes the ConocoPhillips Optimized Cascade versus APCI C3MR process?",
        "options": [
          "Cascade produces compressed natural gas; C3MR produces liquefied petroleum gas (LPG)",
          "Cascade operates without any compression power; C3MR requires diesel locomotives",
          "Cascade is only used for offshore floating LNG; C3MR is only used for small peak-shavers",
          "Cascade uses pure refrigerants (propane, ethylene, methane) in brazed aluminum exchangers; C3MR uses mixed refrigerant cycles in spiral-wound exchangers"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does a 'Real Options Valuation' (ROV) methodology differ from static Discounted Cash Flow (DCF) for energy transition investments?",
        "options": [
          "Uses linear regression without discounting future cash flows for inflation",
          "Assumes all future commodity prices are known with 100% mathematical certainty",
          "Quantifies managerial flexibility to expand, defer, abandon, or switch technologies as carbon prices and commodity markets fluctuate",
          "Evaluates projects based entirely on corporate social media sentiment analysis"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In CCUS reservoir engineering, what is the critical geomechanical threshold that must not be exceeded during supercritical CO2 injection?",
        "options": [
          "The maximum weight of surface injection piping supports on soil",
          "The caprock fracture pressure and fault reactivation slip criterion (tau / sigma_n >= mu_f) to prevent loss of geological containment",
          "The solubility limit of carbon dioxide in sweet drinking water aquifers",
          "The boiling point of liquid nitrogen at atmospheric pressure"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What is the primary thermodynamic penalty of integrating Post-Combustion Carbon Capture (PCC) into a Natural Gas Combined Cycle (NGCC) plant?",
        "options": [
          "The gas turbine exhaust combusts spontaneously in the flue gas ducting",
          "The generator converts mechanical power into thermal heat instead of electricity",
          "The cooling tower basin freezes solid due to cryogenic cooling",
          "Low-pressure steam extraction from the steam turbine reduces net power output by 10-15% and increases levelized electricity cost by 30-50%"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In deepwater subsea completions, how does 'Wax Deposition Modeling' using compositional thermodynamic models protect operational cash flow?",
        "options": [
          "Eliminates the requirement for thermal insulation around subsea flowlines",
          "Predicts Cloud Point and wax precipitation kinetics to optimize chemical inhibitor dosing and avoid multimillion-dollar subsea line blockages",
          "Ensures subsea pipes look glossy when inspected by underwater cameras",
          "Calculates the candle manufacturing value of recovered pipeline wax"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "Under IFRS 13 / US GAAP fair value standards, how are long-dated oil & gas Asset Retirement Obligations (ARO) calculated?",
        "options": [
          "The original cash cost paid to drill the exploration well 40 years prior",
          "A flat fixed fee of $100,000 per offshore platform regardless of water depth",
          "The salvage scrap value of steel platform legs sold to local scrap yards",
          "Discounted present value of expected future decommissioning, platform removal, and well plugging costs using a credit-adjusted risk-free rate"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In large-scale energy infrastructure M&A, what is a 'Locked Box' completion mechanism versus 'Completion Accounts'?",
        "options": [
          "Locked Box sets purchase price based on historical balance sheet with no post-closing adjustments; Completion Accounts adjusts price at closing date",
          "Locked Box eliminates the requirement for legal contracts and due diligence",
          "Locked Box locks all purchase cash in a physical safe until regulatory permits are approved",
          "Locked Box applies only to nationalized state-owned oil companies"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does dynamic digital twin predictive optimization reduce energy consumption in large-scale refinery hydrocracking units?",
        "options": [
          "Replaces chemical catalysts with inert ceramic ball bearings",
          "Calculates optimal hydrogen-to-hydrocarbon ratio and bed quench rates in real time, minimizing compressor power and fuel gas consumption",
          "Shuts down the furnace whenever electricity spot prices exceed average rates",
          "Lowers reactor pressure to atmospheric conditions while maintaining 100% conversion"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In clean hydrogen economics, what is the 'Levelized Cost of Electricity' (LCOE) threshold required for green hydrogen to reach cost parity with blue hydrogen?",
        "options": [
          "Green hydrogen has already achieved cost parity with natural gas steam reforming everywhere",
          "Electrolyzers must operate exclusively on expensive peak-tariff grid power",
          "Electricity prices must exceed $200 per MWh to incentivize efficiency",
          "Renewable electricity must fall below $15-$25 per MWh with electrolyzer utilization factors exceeding 50-60%"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What is the primary economic driver of 'Integrated Asset Modeling' (IAM) across coupled subsurface reservoir, well, and surface network models?",
        "options": [
          "Identifies surface facility bottlenecks and optimizes choke settings across all wells simultaneously, unlocking 2-7% additional field recovery",
          "Reduces the number of petroleum engineers required in corporate headquarters",
          "Eliminates the requirement to drill appraisal wells in new offshore basins",
          "Replaces chemical corrosion inhibitors with digital software algorithms"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In offshore pipeline engineering, what is the 'Bottom Stability' design criterion per DNV-RP-F109?",
        "options": [
          "Guarantees the pipeline will float to the surface for easy maintenance inspection",
          "Maintains uniform internal pipe temperature throughout winter months",
          "Ensures submerged weight of the concrete-coated pipe resists hydrodynamic wave and current lift and drag forces on the seabed",
          "Prevents internal crude oil from settling into heavy sludge layers"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In global energy commodity trading, what is 'Backwardation' in futures forward curves?",
        "options": [
          "Spot or near-term delivery prices are higher than future delivery prices, indicating tight immediate physical supply",
          "Future prices are higher than immediate spot prices (Contango)",
          "Crude oil is trading at a negative dollar value per barrel",
          "The cost of pipeline transportation exceeds the value of the crude oil"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In energy capital project governance, what defines a 'Stage-Gate' (FEL / FEED) approval process?",
        "options": [
          "Legal court proceedings required before signing international export contracts",
          "Security checkpoints at the physical entrance to the construction site",
          "A software algorithm that throttles computer network traffic during peak hours",
          "Progressive formal evaluation gates (FEL 1 Concept, FEL 2 Feasibility, FEL 3 FEED, FID) before committing capital expenditure"
        ],
        "correct": 3,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "How does implementing automated asset lifecycle management (ALM) software reduce plant decommissioning liabilities?",
        "options": [
          "Maintains continuous hazardous material inventories (NORM, asbestos, mercury) and equipment removal weights throughout 30-year lifecycle",
          "Permits operators to abandon decommissioned platforms in deep water without cleanup",
          "Sells unmaintained rusty equipment to third parties as brand new",
          "Hides historical operational chemical spills from regulatory authorities"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What mathematical formulation defines 'Net Smelter Return' or Net Refinery Value per barrel of crude oil?",
        "options": [
          "The cost of transporting crude oil divided by the distance traveled",
          "The weight of refined asphalt divided by the total sulfur content",
          "Gross product worth of all refined cuts minus crude acquisition cost, transportation freight, processing operating cost, and losses",
          "Total gallons of gasoline produced multiplied by retail pump prices"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In geothermal energy development, what is the primary economic failure mode of Enhanced Geothermal Systems (EGS)?",
        "options": [
          "Premature thermal drawdown caused by short-circuiting flow through narrow hydraulic fractures rather than wide distributed rock matrix",
          "Geothermal reservoir rock melting into volcanic lava inside production casing",
          "Excessive electrical power generation overloading local distribution transformers",
          "The geothermal steam condensing into cold water before reaching surface turbines"
        ],
        "correct": 0,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In petroleum fiscal regimes, what distinguishes a Production Sharing Contract (PSC) from a Concessionary Royalty/Tax system?",
        "options": [
          "No taxes or royalties are ever paid regardless of oil production volume",
          "The government pays all upfront exploration and drilling costs with zero risk to the contractor",
          "The State retains title to mineral reserves; contractor receives cost oil to recover investment and profit oil shared per negotiated scale",
          "The oil company owns 100% of all mineral reserves in the ground indefinitely"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What is 'Sleeve Cracking' risk in heavy crude oil vacuum distillation towers, and how does predictive analytics mitigate it?",
        "options": [
          "Fracture of operator cotton shirt sleeves during high-temperature maintenance",
          "Thermal fatigue and coking on internal tray support rings, mitigated by monitoring feed temperature profiles and reflux distribution",
          "Cracking of external concrete foundation pedestals caused by seismic settling",
          "Mechanical shearing of vacuum pump impeller blades during startup"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "In CCUS value chains, what is the liability duration associated with long-term geological CO2 storage stewardship?",
        "options": [
          "The operator remains financially liable for 10,000 years with zero state transfer",
          "There is zero legal liability because underground rock formations have no legal owners",
          "Post-closure monitoring periods typically span 20 to 50+ years before legal liability can be formally transferred to the competent State authority",
          "Liability terminates exactly 24 hours after injection ceases"
        ],
        "correct": 2,
        "points": 400,
        "difficulty": "DIFFICULT"
      },
      {
        "question": "What is the single most decisive factor determining the business ROI of deploying enterprise AI across an energy conglomerate?",
        "options": [
          "Publishing press releases announcing partnership with artificial intelligence vendors",
          "High-fidelity integration with verified engineering and operational data foundations (eliminating garbage-in, garbage-out hallucinations)",
          "Replacing all certified engineering specialists with entry-level computer coders",
          "Purchasing the largest possible number of graphic processor cards (GPUs)"
        ],
        "correct": 1,
        "points": 400,
        "difficulty": "DIFFICULT"
      }
    ]
  }
};
