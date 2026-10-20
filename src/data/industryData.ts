export interface IndustryTask {
  id: string;
  name: string;
  icon: string;
  recommendedSolutionIds: string[];
  fitNote: string;
}

export interface IndustryResearch {
  marketContext: string;
  challenges: string[];
  standards: string[];
  digitalTwinFocus: string;
  roiDrivers: string[];
}

export interface IndustrySector {
  id: string;
  name: string;
  icon: string;
  description: string;
  research: IndustryResearch;
  tasks: IndustryTask[];
}

export const INDUSTRY_SECTORS: IndustrySector[] = [
  {
    id: 'smart-cities',
    name: 'Smart Cities & Urban Tech',
    icon: 'Building',
    description: 'Urban 3D digital twins, intelligent mobility, municipal asset management, public safety, and resilient infrastructure.',
    research: {
      marketContext: 'Global urban centers are shifting from siloed municipal departments to unified spatial digital twins and real-time IoT operating platforms to manage rapid population growth and climate resilience.',
      challenges: [
        'Fragmented municipal data across GIS, BIM, transportation, utilities, and emergency services',
        'Sub-optimal traffic flow, transit delays, and escalating urban carbon emissions',
        'Vulnerability of municipal smart grids and water SCADA systems to cyber attacks',
        'Inefficient permitting, urban masterplanning, and physical asset lifecycle tracking'
      ],
      standards: [
        'ISO 37120 / ISO 37122 (Sustainable Cities and Communities Indicators)',
        'NIST Smart Cities and Communities Framework (SCCF)',
        'Open Geospatial Consortium (OGC) 3D CityGML & CityJSON Standards',
        'NIST SP 800-82 / IEC 62443 (Smart Grid & Urban OT Cybersecurity)'
      ],
      digitalTwinFocus: 'Real-time 3D City Digital Twin integrating satellite/aerial imagery (Octave Alto / Imagine) with underground utility GIS (GeoMedia), municipal building permits (BricsCAD / InConcert), and unified emergency dispatch (OnCall).',
      roiDrivers: [
        'Up to 35% faster emergency response times across citywide multi-agency dispatches',
        '40% reduction in urban infrastructure permitting and planning review cycles',
        'Zero-trust cyber defense securing critical municipal water, power, and transit OT networks'
      ]
    },
    tasks: [
      {
        id: 'smart-city-twin',
        name: '3D City Digital Twin & Urban Spatial Masterplanning (Alto / Imagine / GeoMedia)',
        icon: 'Globe',
        recommendedSolutionIds: ['node-alto', 'node-imagine', 'node-geomedia'],
        fitNote: 'Constructs continuous 3D urban digital twins fusing LiDAR point clouds, satellite remote sensing (Octave Imagine), and web-scale 3D GIS visualization (Octave Alto).'
      },
      {
        id: 'municipal-info-mgmt',
        name: 'Municipal Infrastructure Document & As-Built Digital Twin (InConcert / BricsCAD)',
        icon: 'FolderGit',
        recommendedSolutionIds: ['node-inconcert', 'node-bricscad'],
        fitNote: 'Centralizes civil engineering drawings, BIM models, permit submittals, and contractor as-built records into Octave InConcert with BricsCAD DWG integration.'
      },
      {
        id: 'intelligent-mobility',
        name: 'Intelligent Mobility, Traffic & Transit Asset Operations (Alto / Tempo)',
        icon: 'Activity',
        recommendedSolutionIds: ['node-alto', 'node-tempo', 'node-reliance'],
        fitNote: 'Monitors real-time traffic signal corridors, fleet telematics, and transit maintenance logbooks (Octave Tempo) for citywide asset uptime.'
      },
      {
        id: 'urban-ot-cyber',
        name: 'Urban Critical Infrastructure OT Cybersecurity (CyberIntegrity)',
        icon: 'ShieldCheck',
        recommendedSolutionIds: ['node-cyberintegrity'],
        fitNote: 'Shields municipal water filtration, traffic control centers, and smart grid substations against zero-day vulnerabilities and industrial malware.'
      },
      {
        id: 'urban-public-safety',
        name: 'Unified 911 Emergency Call & Multi-Agency Dispatch (OnCall / Coda)',
        icon: 'Radio',
        recommendedSolutionIds: ['node-oncall', 'node-coda'],
        fitNote: 'Powers CAD 911 dispatch, real-time vehicle location (AVL), and multi-agency records management for city police, fire, and ambulance services.'
      }
    ]
  },
  {
    id: 'air-space',
    name: 'Aerospace, Air Space & Defense',
    icon: 'Plane',
    description: 'Airframes, commercial aircraft, defense avionics, airspace management, rocket propulsion, and spaceports.',
    research: {
      marketContext: 'Aerospace manufacturers and defense contractors require digital thread continuity from conceptual aero-structural modeling through high-precision manufacturing, flight certification, and depot MRO.',
      challenges: [
        'Extremely rigorous FAA, EASA, and DoD compliance verification timelines',
        'Complex structural aeroelasticity, thermal stresses in high-altitude/re-entry environments',
        'Disconnected design-to-manufacturing supply chains causing high rework costs and assembly delays',
        'Strict ITAR, CMMC, and national security zero-trust OT cybersecurity mandates'
      ],
      standards: [
        'AS9100D / EN 9100 (Aerospace Quality Management Systems)',
        'FAA 14 CFR Part 25 (Airworthiness Standards: Transport Category Airplanes)',
        'DO-178C / DO-254 (Avionics Software and Electronic Hardware Certification)',
        'DoD CMMC 2.0 / NIST SP 800-171 & ITAR (Defense Data Governance & OT Security)'
      ],
      digitalTwinFocus: 'End-to-end Airframe & Spacecraft Digital Thread linking structural finite-element calculations (Aspect Structure / GT STRUDL), hangar facilities piping (Aspect Pipe Stress / Forte), and configuration change control (InConcert).',
      roiDrivers: [
        'Up to 50% reduction in airframe structural iteration cycles via automated stress calculations',
        'Complete audit-ready traceability for AS9100 and FAA submittals across global aerospace suppliers',
        'ITAR-grade zero-trust defense protecting avionics test benches and defense manufacturing networks'
      ]
    },
    tasks: [
      {
        id: 'aero-structural-stress',
        name: 'Airframe, Rocket & Structural Finite Element Stress (Aspect Structure / GT STRUDL)',
        icon: 'Layers',
        recommendedSolutionIds: ['node-aspect', 'node-forte'],
        fitNote: 'Performs high-precision finite element structural analysis, aeroelastic frame loading, and rocket gantry stress calculations under Octave Aspect Structure (formerly GT STRUDL).'
      },
      {
        id: 'hangar-cleanroom-bim',
        name: 'Hangar, Cleanroom & Fuel Line 3D Spatial Layout (Forte / BricsCAD / Aspect)',
        icon: 'Box',
        recommendedSolutionIds: ['node-forte', 'node-bricscad', 'node-aspect'],
        fitNote: 'Models aerospace cleanrooms, propellant fueling piping, and hangar gantries with 3D clash detection and piping flexibility analysis.'
      },
      {
        id: 'flightline-depot-mro',
        name: 'Flight Line, Hangar & Depot Maintenance Logbooks (Tempo / Reliance / Attune)',
        icon: 'Activity',
        recommendedSolutionIds: ['node-tempo', 'node-reliance', 'node-attune'],
        fitNote: 'Standardizes technician pre-flight check-off lists, depot shift handovers (Octave Tempo), and aircraft engine reliability tracking.'
      },
      {
        id: 'aerospace-itar-cyber',
        name: 'Defense, Space & Avionics ITAR OT Cybersecurity (CyberIntegrity)',
        icon: 'ShieldCheck',
        recommendedSolutionIds: ['node-cyberintegrity'],
        fitNote: 'Delivers continuous asset discovery, vulnerability scoring, and CMMC/ITAR compliance for defense manufacturing and flight testing OT networks.'
      },
      {
        id: 'aerospace-config-mgmt',
        name: 'Air Base & Aircraft Configuration Control & Digital Thread (InConcert / Facets)',
        icon: 'FolderGit',
        recommendedSolutionIds: ['node-inconcert', 'node-facets'],
        fitNote: 'Maintains tamper-proof aircraft as-built BOMs, engineering change notices (ECN), and electrical avionics schematics.'
      },
      {
        id: 'airspace-situational-gis',
        name: 'Airspace Situational Awareness & Satellite Geospatial Visualization (Alto / Imagine)',
        icon: 'Globe',
        recommendedSolutionIds: ['node-alto', 'node-imagine'],
        fitNote: 'Visualizes high-density airspace corridors, satellite remote sensing imagery (Imagine), and real-time radar tracks in GPU-accelerated 3D (Alto Lightspeed).'
      }
    ]
  },
  {
    id: 'oil-gas',
    name: 'Oil, Gas & Offshore',
    icon: 'Flame',
    description: 'Upstream exploration, FPSOs, midstream pipelines, downstream refining, and LNG facilities.',
    research: {
      marketContext: 'Hydrocarbon operators are accelerating brownfield optimization, offshore deepwater safety, and LNG liquefaction capacity while cutting lifecycle emissions and OPEX.',
      challenges: [
        'Severe thermal stresses and acoustic vibration in extreme high-pressure piping systems',
        'Complex offshore FPSO topside weight, structural deflection, and marine wave dynamics',
        'Operator alarm flooding during process upsets causing delayed emergency interventions',
        'Strict regulatory scrutiny under API 579, ASME B31.3, and OSHA PSM frameworks'
      ],
      standards: [
        'ASME B31.3 / B31.4 / B31.8 (Process & Transportation Piping Codes)',
        'API 510 / 570 / 650 (Pressure Vessel, Piping & Storage Tank Inspection)',
        'ISA-18.2 / IEC 62682 (Management of Alarm Systems for the Process Industries)',
        'IEC 62443 (Industrial Automation and Control Systems Security)'
      ],
      digitalTwinFocus: 'Unified Hydrocarbon Asset Twin connecting 3D plant spatial models (Forte), piping stress analysis (Aspect / CAESAR II), and centralized tag data (InConcert SDx).',
      roiDrivers: [
        '40% reduction in unplanned offshore plant shutdowns via structured alarm rationalization',
        'Over 30% reduction in engineering change order cycle times during capital expansion projects',
        'Flawless turnaround execution using digital materials readiness (Loop) and construction work packages (OnSite)'
      ]
    },
    tasks: [
      {
        id: 'pipe-stress-analysis',
        name: 'Piping Stress, Vessel & Structural Analysis (CAESAR II / PV Elite / GT STRUDL)',
        icon: 'Layers',
        recommendedSolutionIds: ['node-aspect', 'node-forte'],
        fitNote: 'Essential for refinery piping flexibility, offshore FPSO topsides, and pressure vessels. Uses Octave Aspect — featuring Aspect Pipe Stress (formerly CAESAR II), Aspect Pressure Vessel (formerly PV Elite), and Aspect Structure (formerly GT STRUDL).'
      },
      {
        id: 'info-mgmt',
        name: 'Information Management & Digital Twin (InConcert / Forte / Facets)',
        icon: 'FolderGit',
        recommendedSolutionIds: ['node-inconcert', 'node-forte', 'node-facets'],
        fitNote: 'Centralizes oil & gas engineering tags, 3D CAD models, 2D P&IDs, and document revisions into Octave InConcert.'
      },
      {
        id: '3d-design',
        name: '3D Plant & Offshore Spatial Design (Forte / Aspect)',
        icon: 'Box',
        recommendedSolutionIds: ['node-forte', 'node-aspect'],
        fitNote: 'Delivers high-precision 3D plant spatial modeling, piping isometric generation, and clash detection.'
      },
      {
        id: '2d-schematics',
        name: '2D P&ID & Electrical Schematics (Facets / BricsCAD)',
        icon: 'Network',
        recommendedSolutionIds: ['node-facets', 'node-bricscad'],
        fitNote: 'Automates intelligent P&ID schematics, instrument loop diagrams, and electrical wiring.'
      },
      {
        id: 'field-construction',
        name: 'Field Execution & Work Packages (AWP) (OnSite / Loop / Sequence)',
        icon: 'HardHat',
        recommendedSolutionIds: ['node-onsite', 'node-loop', 'node-sequence'],
        fitNote: 'Manages construction work packages (AWP), material readiness, and site inspections for capital projects.'
      },
      {
        id: 'ops-maint',
        name: 'Plant Operations & Alarm Management (Tempo / Attune / Reliance)',
        icon: 'Activity',
        recommendedSolutionIds: ['node-tempo', 'node-attune', 'node-reliance'],
        fitNote: 'Optimizes control room alarm management, operator shift handovers (Octave Tempo), and asset reliability.'
      },
      {
        id: 'ot-cybersecurity',
        name: 'OT / ICS Network Cybersecurity (CyberIntegrity)',
        icon: 'ShieldCheck',
        recommendedSolutionIds: ['node-cyberintegrity'],
        fitNote: 'Protects industrial control systems (ICS) and OT networks with real-time vulnerability monitoring.'
      }
    ]
  },
  {
    id: 'chemicals',
    name: 'Chemicals & Petrochemicals',
    icon: 'FlaskConical',
    description: 'Petrochemicals, specialty chemical processing, ethylene crackers, fertilizers, and batch manufacturing.',
    research: {
      marketContext: 'Continuous and batch chemical producers are adopting automated digital operations to handle corrosive fluid chemistry, feedstock variability, and tight ESG targets.',
      challenges: [
        'Corrosive and toxic chemical process handling requiring exact metallurgy and vessel specs',
        'Complex chemical reaction heat balance requiring frequent piping stress recalculations',
        'Operator shift knowledge loss during complex chemical batch transitions and turnarounds',
        'Compliance with strict Process Safety Management (OSHA PSM / Seveso III)'
      ],
      standards: [
        'ASME Section VIII Div 1 & 2 (Boiler and Pressure Vessel Code)',
        'API 650 / 620 (Welded Tanks for Oil & Chemical Storage)',
        'ISA-88 (Batch Control Standards) & ISA-18.2 (Alarm Management)',
        'IEC 61511 (Functional Safety for the Process Industry Sector)'
      ],
      digitalTwinFocus: 'Integrated Process & Mechanical Twin combining intelligent P&IDs (Facets), pressure vessel engineering (Aspect / PV Elite), and operational shift logs (Tempo).',
      roiDrivers: [
        '45% reduction in plant turnaround downtime through digitized material staging',
        'Virtual elimination of engineering change clashes in complex chemical modular skids',
        'Continuous compliance with OSHA PSM and EPA Risk Management Programs'
      ]
    },
    tasks: [
      {
        id: 'petrochem-analysis',
        name: 'Petrochemical Pipe Stress, Vessels & Tank Analysis (CAESAR II / PV Elite / GT STRUDL)',
        icon: 'Layers',
        recommendedSolutionIds: ['node-aspect', 'node-forte'],
        fitNote: 'Evaluates thermal expansion pipe stress (formerly CAESAR II), pressure vessels (formerly PV Elite), storage tanks (formerly TANK), and pipe rack structural frames (formerly GT STRUDL) under Octave Aspect.'
      },
      {
        id: 'info-mgmt-chem',
        name: 'Process Asset Information Management (InConcert / Facets)',
        icon: 'FolderGit',
        recommendedSolutionIds: ['node-inconcert', 'node-facets'],
        fitNote: 'Centralizes chemical process P&IDs, equipment tag specifications, and compliance records.'
      },
      {
        id: '2d-schematics-chem',
        name: '2D P&ID & Process Instrumentation (Facets)',
        icon: 'Network',
        recommendedSolutionIds: ['node-facets'],
        fitNote: 'Drafts and maintains process flow diagrams and instrumentation loops for continuous chemical processing.'
      },
      {
        id: '3d-design-chem',
        name: '3D Piping & Process Equipment Design (Forte / Aspect)',
        icon: 'Box',
        recommendedSolutionIds: ['node-forte', 'node-aspect'],
        fitNote: '3D piping routing, equipment positioning, and clash detection for chemical process units.'
      },
      {
        id: 'ops-maint-chem',
        name: 'Shift Operations & Alarm Rationalization (Tempo / Reliance)',
        icon: 'Activity',
        recommendedSolutionIds: ['node-tempo', 'node-reliance'],
        fitNote: 'Operator logging, alarm rationalization, and shift handover management (Octave Tempo) for batch chemical units.'
      },
      {
        id: 'turnarounds-chem',
        name: 'Plant Turnarounds & Field Execution (OnSite / Loop)',
        icon: 'HardHat',
        recommendedSolutionIds: ['node-onsite', 'node-loop'],
        fitNote: 'Manages materials, contractor work packages, and inspections during scheduled plant turnarounds.'
      }
    ]
  },
  {
    id: 'pharmaceuticals',
    name: 'Pharmaceuticals & Life Sciences',
    icon: 'Pill',
    description: 'Biotech manufacturing, sterile processing, cleanroom piping, batch reactors, and GxP validation.',
    research: {
      marketContext: 'Pharma manufacturers require rigorous electronic record integrity, validated digital twins, and sanitary fluid process engineering to maintain FDA 21 CFR Part 11 and EU Annex 11 compliance.',
      challenges: [
        'Stringent validation overhead and audit trail compliance for cleanroom modifications',
        'Sanitary piping slope verification and dead-leg prevention to ensure CIP/SIP sterilization',
        'Operator batch handover mistakes resulting in rejected production lots',
        'Vulnerability of building automation systems (BAS) and sterile HVAC controllers'
      ],
      standards: [
        'FDA 21 CFR Part 11 & EU Annex 11 (Electronic Records & Electronic Signatures)',
        'ISPE GAMP 5 (Risk-Based Approach to Compliant GxP Computerized Systems)',
        'ASME BPE (Bioprocessing Equipment Standard)',
        'ISA-88 (Batch Process Control) & IEC 62443 (Pharma OT Cybersecurity)'
      ],
      digitalTwinFocus: 'Validated GxP Digital Twin ensuring audit-trail locked asset records (InConcert), sanitary piping stress (Aspect), and compliant electronic operator logbooks (Tempo).',
      roiDrivers: [
        '60% reduction in FDA audit preparation time with instant tamper-proof digital records',
        'Near-zero batch discard events through standardized electronic shift handovers',
        'Fast-track facility commissioning for novel mRNA and monoclonal antibody production suites'
      ]
    },
    tasks: [
      {
        id: 'pharma-piping-stress',
        name: 'Cleanroom & Hygienic Pipe Stress & Vessel Analysis (Aspect Pipe Stress / PV Elite)',
        icon: 'Layers',
        recommendedSolutionIds: ['node-aspect', 'node-forte'],
        fitNote: 'Validates sanitary piping stress, thermal expansion, and jacketed batch reactor vessel specs under Octave Aspect.'
      },
      {
        id: 'gxp-info-mgmt',
        name: 'GxP Information Management & Digital Twin (InConcert / Reliance / Facets)',
        icon: 'FolderGit',
        recommendedSolutionIds: ['node-inconcert', 'node-reliance', 'node-facets'],
        fitNote: 'Centralizes FDA 21 CFR Part 11 electronic records, cleanroom P&IDs, equipment validation protocols, and batch tag specs.'
      },
      {
        id: 'pharma-3d-design',
        name: '3D Cleanroom & Bio-Process Modular Design (Forte / Aspect)',
        icon: 'Box',
        recommendedSolutionIds: ['node-forte', 'node-aspect'],
        fitNote: '3D spatial layout of bio-reactors, HVAC air handling units, process skids, and sterile fluid routing.'
      },
      {
        id: 'batch-ops-quality',
        name: 'Batch Operations, Shift Logbooks & Quality Control (Tempo / Reliance)',
        icon: 'Activity',
        recommendedSolutionIds: ['node-tempo', 'node-reliance'],
        fitNote: 'Streamlines operator batch shift handovers (Octave Tempo), alarm rationalization for sterile suites, and CAPA quality tracking.'
      },
      {
        id: 'pharma-ot-cyber',
        name: 'Sterile Suite OT & Building System Security (CyberIntegrity)',
        icon: 'ShieldCheck',
        recommendedSolutionIds: ['node-cyberintegrity'],
        fitNote: 'Secures building management systems (BMS), SCADA batch controllers, and OT networks from cyber disruption.'
      }
    ]
  },
  {
    id: 'nuclear-power',
    name: 'Nuclear Power & Technology',
    icon: 'Atom',
    description: 'Nuclear power generation, Small Modular Reactors (SMRs), fuel handling, and regulatory defense.',
    research: {
      marketContext: 'Nuclear operators and next-gen SMR developers demand safety-class structural analysis, zero-defect configuration control, and strict NERC CIP cybersecurity.',
      challenges: [
        'Seismic and high-energy line break (HELB) dynamic piping stress requirements',
        'Tamper-proof nuclear asset configuration tracking across 60+ year plant lifecycles',
        'Zero tolerance for operator alarm fatigue during reactor transients',
        'Strict regulatory audits by NRC, IAEA, and national nuclear regulators'
      ],
      standards: [
        'ASME Section III (Rules for Construction of Nuclear Facility Components)',
        'NRC 10 CFR 50 Appendix B & NQA-1 (Quality Assurance Criteria for Nuclear Power Plants)',
        'IEEE 603 / IEEE 7-4.3.2 (Standard Criteria for Safety Systems for Nuclear Power Generating Stations)',
        'NERC CIP-002 through CIP-014 / NRC RG 5.71 (Nuclear Cyber Security)'
      ],
      digitalTwinFocus: 'Class 1E Safety Digital Twin uniting nuclear pipe stress (Aspect PIPESTRESS / CAESAR II), reactor island CAD (Forte), and NQA-1 audited data repository (InConcert).',
      roiDrivers: [
        '100% audit-ready regulatory submittals for NRC and IAEA licensing',
        'Accelerated commercialization and modular assembly for Small Modular Reactors (SMRs)',
        'Zero-trust cyber defense shielding reactor protection and safety-critical control loops'
      ]
    },
    tasks: [
      {
        id: 'nuclear-pipe-stress',
        name: 'Nuclear Class 1/2/3 Safety Piping & Seismic Stress (Aspect PIPESTRESS / CAESAR II)',
        icon: 'Layers',
        recommendedSolutionIds: ['node-aspect', 'node-forte'],
        fitNote: 'Analyzes nuclear safety class piping (formerly PIPESTRESS), primary containment stress, and GT STRUDL seismic frame response.'
      },
      {
        id: 'nuclear-info-mgmt',
        name: 'Nuclear Asset Information Management & Audit Thread (InConcert / Forte)',
        icon: 'FolderGit',
        recommendedSolutionIds: ['node-inconcert', 'node-forte'],
        fitNote: 'Maintains tamper-proof nuclear asset configuration control, NRC regulatory submittals, and 3D digital twin models.'
      },
      {
        id: 'nuclear-3d-island',
        name: '3D Nuclear Island & Containment Vessel Spatial Modeling (Forte / Aspect)',
        icon: 'Box',
        recommendedSolutionIds: ['node-forte', 'node-aspect'],
        fitNote: 'High-precision 3D spatial modeling for reactor pressure vessels, steam generators, and shielding structures.'
      },
      {
        id: 'nuclear-control-room',
        name: 'Control Room Alarm Rationalization & Radiation Safety Logs (Tempo / Reliance)',
        icon: 'Activity',
        recommendedSolutionIds: ['node-tempo', 'node-reliance'],
        fitNote: 'Manages control room alarm prioritization and rationalization (Octave Tempo), radiation safety shift handovers, and operator logs.'
      },
      {
        id: 'nuclear-nerc-cyber',
        name: 'Nuclear OT Cybersecurity & NERC CIP / NRC Compliance (CyberIntegrity)',
        icon: 'ShieldCheck',
        recommendedSolutionIds: ['node-cyberintegrity'],
        fitNote: 'High-security zero-trust OT monitoring, automated vulnerability checks, and strict regulatory compliance.'
      }
    ]
  },
  {
    id: 'power-utilities',
    name: 'Power & Grid Utilities',
    icon: 'Zap',
    description: 'Thermal, hydro, grid substations, high-voltage transmission, and distribution networks.',
    research: {
      marketContext: 'Grid operators and utilities are modernizing aging substations and integrating distributed renewable generation while meeting rigorous NERC CIP reliability mandates.',
      challenges: [
        'High-pressure steam line thermal expansion and boiler header fatigue',
        'Geographic dispersion of transmission lines requiring spatial asset intelligence',
        'Frequent substation alarm flooding during storm events and equipment faults',
        'Complex regulatory reporting and audit trails for grid reliability'
      ],
      standards: [
        'ASME B31.1 (Power Piping Code)',
        'IEEE C2 (National Electrical Safety Code)',
        'NERC Reliability Standards & CIP Cybersecurity Requirements',
        'IEC 61850 (Communication Networks and Systems for Power Utility Automation)'
      ],
      digitalTwinFocus: 'Integrated Grid & Substation Twin connecting high-voltage physical spatial design (Forte), electrical schematics (Facets), and GIS transmission routing (GeoMedia / Alto).',
      roiDrivers: [
        '30% reduction in grid restoration times with synchronized GIS asset mapping',
        '40% drop in nuisance control room alarms during severe weather events',
        'Complete protection against NERC CIP non-compliance fines through automated OT audits'
      ]
    },
    tasks: [
      {
        id: 'power-stress-analysis',
        name: 'High-Pressure Steam & Thermal Pipe Stress (CAESAR II / GT STRUDL)',
        icon: 'Layers',
        recommendedSolutionIds: ['node-aspect', 'node-forte'],
        fitNote: 'Analyzes high-pressure steam line stress (formerly CAESAR II), thermal piping expansion, and boiler structural frames (formerly GT STRUDL) using Octave Aspect.'
      },
      {
        id: 'info-mgmt-power',
        name: 'Power Plant Information Management (InConcert / Forte / Facets)',
        icon: 'FolderGit',
        recommendedSolutionIds: ['node-inconcert', 'node-forte', 'node-facets'],
        fitNote: 'Single source of truth for power station tag metadata, engineering drawings, and regulatory records.'
      },
      {
        id: '3d-design-power',
        name: '3D Power Station & Substation Modeling (Forte / Aspect)',
        icon: 'Box',
        recommendedSolutionIds: ['node-forte', 'node-aspect'],
        fitNote: '3D modeling for turbine halls, boiler structures, and substation layouts.'
      },
      {
        id: '2d-schematics-power',
        name: 'Electrical Schematics & One-Line Diagrams (Facets / BricsCAD)',
        icon: 'Network',
        recommendedSolutionIds: ['node-facets', 'node-bricscad'],
        fitNote: 'Automates electrical one-line diagrams, protection wiring, and substation schematic drafting.'
      },
      {
        id: 'ops-maint-power',
        name: 'Control Room Operations & Alarm Management (Tempo / Reliance)',
        icon: 'Activity',
        recommendedSolutionIds: ['node-tempo', 'node-reliance'],
        fitNote: 'Reduces operator alarm fatigue via rationalization (Octave Tempo), manages unit shift handovers, and tracks equipment health.'
      },
      {
        id: 'ot-cybersecurity-power',
        name: 'OT Cybersecurity & NERC CIP Compliance (CyberIntegrity)',
        icon: 'ShieldCheck',
        recommendedSolutionIds: ['node-cyberintegrity'],
        fitNote: 'Continuous OT network discovery, vulnerability audits, and NERC CIP regulatory compliance.'
      },
      {
        id: 'gis-grid-power',
        name: 'Geospatial Grid & Substation Intelligence (GeoMedia / Alto)',
        icon: 'Globe',
        recommendedSolutionIds: ['node-geomedia', 'node-alto'],
        fitNote: 'GIS mapping and spatial intelligence for power transmission and distribution grid infrastructure.'
      }
    ]
  },
  {
    id: 'clean-energy',
    name: 'Renewables, Hydrogen & Clean Tech',
    icon: 'SunMedium',
    description: 'Offshore wind arrays, green hydrogen electrolysis, Carbon Capture (CCUS), and solar utilities.',
    research: {
      marketContext: 'Clean energy projects require fast capital deployment, cryogenic piping stress validation for hydrogen, and offshore turbine structural foundation analysis under wave and aerodynamic loads.',
      challenges: [
        'Cryogenic temperatures and hydrogen embrittlement in high-pressure transport piping',
        'Offshore wind monopile and jacket structural fatigue under cyclic wave and wind loads',
        'Remote unattended asset monitoring and high-volume IoT SCADA telemetry',
        'Fast-track capital project timelines with distributed global EPC consortia'
      ],
      standards: [
        'DNV-ST-0126 / DNV-ST-0437 (Support Structures for Wind Turbines)',
        'ASME B31.12 (Hydrogen Piping and Pipelines)',
        'ISO 27914 (Carbon Dioxide Capture, Transportation and Geological Storage)',
        'IEC 61400 (Wind Energy Generation Systems)'
      ],
      digitalTwinFocus: 'Clean Tech Engineering & Asset Twin uniting offshore structural analysis (Aspect Structure / GT STRUDL), cryogenic hydrogen piping (Aspect Pipe Stress), and remote telemetry (Tempo).',
      roiDrivers: [
        '35% faster engineering design cycles for modular hydrogen and CCUS facilities',
        'Optimized offshore wind foundation steel tonnage using advanced GT STRUDL structural finite elements',
        'Centralized ESG operational tracking and carbon accounting validation'
      ]
    },
    tasks: [
      {
        id: 'wind-structural-stress',
        name: 'Offshore Wind Substation & Turbine Foundation Structural Stress (Aspect / Forte)',
        icon: 'Layers',
        recommendedSolutionIds: ['node-aspect', 'node-forte'],
        fitNote: 'Calculates monopile and jacket foundation structural stresses and offshore substation frames under Octave Aspect Structure (GT STRUDL).'
      },
      {
        id: 'hydrogen-piping-stress',
        name: 'Green Hydrogen & CCUS Cryogenic Piping Stress (Aspect Pipe Stress / InConcert)',
        icon: 'Flame',
        recommendedSolutionIds: ['node-aspect', 'node-inconcert'],
        fitNote: 'Analyzes high-pressure hydrogen piping flexibility (ASME B31.12) and cryogenic thermal contraction using Aspect Pipe Stress.'
      },
      {
        id: 'clean-energy-alarms',
        name: 'Renewable Grid & Remote Facility SCADA Alarm Rationalization (Tempo / CyberIntegrity)',
        icon: 'Activity',
        recommendedSolutionIds: ['node-tempo', 'node-cyberintegrity'],
        fitNote: 'Streamlines remote solar and wind array alarm management and operator logbooks while shielding edge OT inverters.'
      },
      {
        id: 'clean-tech-twin',
        name: 'Clean Energy Digital Twin & ESG Compliance Auditing (InConcert / Facets)',
        icon: 'FolderGit',
        recommendedSolutionIds: ['node-inconcert', 'node-facets'],
        fitNote: 'Centralizes as-built engineering drawings, solar P&IDs, and green bond compliance records in Octave InConcert.'
      }
    ]
  },
  {
    id: 'rail-transit',
    name: 'Rail, Mass Transit & Transport',
    icon: 'Train',
    description: 'High-speed rail, freight corridors, urban subways, light rail networks, and signaling infrastructure.',
    research: {
      marketContext: 'Modern rail networks are unifying linear geospatial route mapping with predictive rolling stock maintenance, automated signaling, and zero-trust trackside cybersecurity.',
      challenges: [
        'Linear infrastructure dispersion spanning thousands of kilometers of track, bridges, and catenary',
        'Aging rolling stock reliability leading to disruptive passenger and freight delays',
        'Cybersecurity vulnerabilities in trackside interlocking and CBTC signaling SCADA networks',
        'Strict safety certifications under EN 50128 and AREMA standards'
      ],
      standards: [
        'EN 50126 / EN 50128 / EN 50129 (Railway Applications: RAMS & Safety Software)',
        'AREMA (American Railway Engineering and Maintenance-of-Way Association Standards)',
        'TS 50701 / IEC 62443 (Railway Cybersecurity Standards)',
        'ISO 55001 (Asset Management for Transit Infrastructure)'
      ],
      digitalTwinFocus: 'Linear Rail Asset Digital Twin combining dynamic track GIS visualization (Octave Alto / GeoMedia), bridge structural integrity (Aspect), and depot maintenance handovers (Tempo).',
      roiDrivers: [
        '40% decrease in signal and track failure disruptions through predictive maintenance logs',
        'Real-time visualization of train movements and track maintenance work blocks in 3D GIS',
        'Robust cyber protection of Positive Train Control (PTC) and CBTC signalling networks'
      ]
    },
    tasks: [
      {
        id: 'rail-gis-route-twin',
        name: 'Rail Linear Asset GIS Modeling & Route Twin (Alto / GeoMedia)',
        icon: 'Globe',
        recommendedSolutionIds: ['node-alto', 'node-geomedia'],
        fitNote: 'Constructs continuous linear rail GIS routes, track condition overlays, and 3D station models using Alto Lightspeed and GeoMedia.'
      },
      {
        id: 'rolling-stock-mro',
        name: 'Rolling Stock & Track Maintenance Shift Logs & Alarms (Tempo / Reliance)',
        icon: 'Activity',
        recommendedSolutionIds: ['node-tempo', 'node-reliance'],
        fitNote: 'Coordinates locomotive depot maintenance shifts, wheel-truing logbooks (Octave Tempo), and brake reliability tracking.'
      },
      {
        id: 'rail-bridge-structure',
        name: 'Railway Bridge, Viaduct & Catenary Structural Integrity (Aspect / BricsCAD)',
        icon: 'Layers',
        recommendedSolutionIds: ['node-aspect', 'node-bricscad'],
        fitNote: 'Analyzes dynamic train load stress on railway bridges and overhead catenary structural frames under Aspect Structure (GT STRUDL).'
      },
      {
        id: 'rail-signaling-cyber',
        name: 'Transit SCADA, Interlocking & Signaling OT Cybersecurity (CyberIntegrity)',
        icon: 'ShieldCheck',
        recommendedSolutionIds: ['node-cyberintegrity'],
        fitNote: 'Safeguards CBTC signaling, wayside interlocking, and transit power substations against cyber tampering and unauthorized firmware changes.'
      }
    ]
  },
  {
    id: 'marine-shipbuilding',
    name: 'Shipbuilding & Marine',
    icon: 'Anchor',
    description: 'Naval architecture, commercial shipyards, offshore vessels, and marine repair.',
    research: {
      marketContext: 'Shipbuilders require seamless 3D hull spatial design, pipe spool fabrication logistics, and classification society approval threads.',
      challenges: [
        'Complex curved hull plate hydrodynamics and structural stress deflection',
        'Tight spatial constraints for engine room piping and electrical cable trays',
        'Steel inventory management and shipyard block assembly sequencing bottlenecks',
        'Classification society certification (DNV, ABS, Lloyd’s Register)'
      ],
      standards: [
        'IMO SOLAS (International Convention for the Safety of Life at Sea)',
        'IACS (International Association of Classification Societies Rules)',
        'ISO 19848 / ISO 19847 (Shipboard Data Servers and Data Sharing)',
        'IEC 62443 / IMO Resolution MSC.428(98) (Maritime Cyber Risk Management)'
      ],
      digitalTwinFocus: 'Complete Vessel Lifecycle Twin connecting 3D marine hull spatial design (Forte), piping stress (Aspect), and yard steel logistics (Loop).',
      roiDrivers: [
        '30% faster block assembly and spool fabrication in modern shipyards',
        'Virtual elimination of spatial piping collisions in dense machinery rooms',
        'Direct digital handoff to classification societies for rapid vessel delivery'
      ]
    },
    tasks: [
      {
        id: 'marine-structural-stress',
        name: 'Marine Structural Hull & Topside Pipe Stress (GT STRUDL / CAESAR II)',
        icon: 'Layers',
        recommendedSolutionIds: ['node-aspect', 'node-forte'],
        fitNote: 'Calculates marine vessel structural hull stress (formerly GT STRUDL) and topside offshore piping flexibility (formerly CAESAR II) under Octave Aspect.'
      },
      {
        id: '3d-marine',
        name: '3D Marine Design & Structural Hull Modeling (Forte)',
        icon: 'Box',
        recommendedSolutionIds: ['node-forte'],
        fitNote: 'Purpose-built 3D spatial modeling for naval vessels, commercial hulls, offshore rigs, and piping systems.'
      },
      {
        id: '2d-marine',
        name: 'Marine Piping & Electrical Schematics (Facets / BricsCAD)',
        icon: 'Network',
        recommendedSolutionIds: ['node-facets', 'node-bricscad'],
        fitNote: 'Drafts marine piping diagrams, electrical power distribution, and HVAC schematics.'
      },
      {
        id: 'info-mgmt-marine',
        name: 'Marine Lifecycle Information Management (InConcert)',
        icon: 'FolderGit',
        recommendedSolutionIds: ['node-inconcert'],
        fitNote: 'Central repository for vessel lifecycle drawings, classification society submissions, and tag data.'
      },
      {
        id: 'shipyard-materials',
        name: 'Shipyard Material Logistics & Hull Assembly (Loop / OnSite)',
        icon: 'HardHat',
        recommendedSolutionIds: ['node-loop', 'node-onsite'],
        fitNote: 'Tracks steel inventory, pipe spool fabrication, and shipyard assembly sequencing.'
      }
    ]
  },
  {
    id: 'mining-metals',
    name: 'Mining & Metals',
    icon: 'Pickaxe',
    description: 'Open-pit & underground mining, mineral processing plants, smelters, and material handling.',
    research: {
      marketContext: 'Mining enterprises are automating remote operations centers, managing mineral processing slurry piping wear, and securing autonomous haulage fleets.',
      challenges: [
        'Severe abrasive wear and dynamic hydraulic loads in slurry transport piping',
        'Massive structural steel framework stress on conveyor gantries and crusher towers',
        'Remote mine site construction logistics and harsh environment material tracking',
        'Cyber threats targeting autonomous haulage systems and remote control centers'
      ],
      standards: [
        'ASME B31.11 (Slurry Transportation Piping Systems)',
        'AISC 360 (Specification for Structural Steel Buildings)',
        'ISO 14001 & MSHA (Mine Safety and Health Administration Regulations)',
        'IEC 62443 (Mining Process Automation & OT Cyber Defense)'
      ],
      digitalTwinFocus: 'Heavy Mineral Processing Twin integrating conveyor structural modeling (Aspect Structure / GT STRUDL), 3D crusher plant CAD (Forte), and remote operations logs (Tempo).',
      roiDrivers: [
        '50% reduction in unplanned conveyor and mill stoppages via predictive shift handovers',
        'Optimized steel fabrication and remote site material delivery (Loop)',
        'Zero-trust protection of autonomous drill and haulage operational networks'
      ]
    },
    tasks: [
      {
        id: 'mining-structural-vessel',
        name: 'Conveyor Structural Steel & Pressure Equipment Analysis (GT STRUDL / PV Elite)',
        icon: 'Layers',
        recommendedSolutionIds: ['node-aspect', 'node-forte'],
        fitNote: 'Structural analysis for heavy conveyor gantries & smelter frameworks (formerly GT STRUDL) and autoclave pressure vessels (formerly PV Elite) using Octave Aspect.'
      },
      {
        id: 'info-mgmt-mining',
        name: 'Mining Information Management (InConcert / Forte)',
        icon: 'FolderGit',
        recommendedSolutionIds: ['node-inconcert', 'node-forte'],
        fitNote: 'Consolidates processing plant drawings, mine infrastructure tags, and equipment manuals.'
      },
      {
        id: '3d-design-mining',
        name: '3D Processing Plant & Conveyor Layouts (Forte / Aspect)',
        icon: 'Box',
        recommendedSolutionIds: ['node-forte', 'node-aspect'],
        fitNote: '3D spatial design of smelters, crushers, conveyor systems, and ore processing facilities.'
      },
      {
        id: 'ops-maint-mining',
        name: 'Heavy Asset Operations & Reliability (Tempo / Attune / Reliance)',
        icon: 'Activity',
        recommendedSolutionIds: ['node-tempo', 'node-attune', 'node-reliance'],
        fitNote: 'Monitors heavy machinery alarms (Octave Tempo), operator shift logs, and predictive maintenance schedules (Octave Attune).'
      },
      {
        id: 'site-execution-mining',
        name: 'Mine Site Expansion & Material Logistics (OnSite / Loop)',
        icon: 'HardHat',
        recommendedSolutionIds: ['node-onsite', 'node-loop'],
        fitNote: 'Field execution, material logistics, and contractor work packages for remote mine site builds.'
      },
      {
        id: 'ot-cybersecurity-mining',
        name: 'Mining Automation OT Security (CyberIntegrity)',
        icon: 'ShieldCheck',
        recommendedSolutionIds: ['node-cyberintegrity'],
        fitNote: 'Protects autonomous haulage, SCADA networks, and remote control centers from cyber threats.'
      }
    ]
  },
  {
    id: 'water-utilities',
    name: 'Water & Environmental Management',
    icon: 'Droplets',
    description: 'Drinking water filtration, wastewater treatment, desalination plants, and stormwater drainage networks.',
    research: {
      marketContext: 'Water utilities are upgrading aging treatment plants, managing water loss, and hardening SCADA networks against emerging cyber threats.',
      challenges: [
        'Corrosive wastewater chemicals and hydraulic surge pressures in treatment piping',
        'Complex underground water distribution network pipe age and leakage management',
        'Escalating cyber attacks targeting municipal water filtration SCADA systems',
        'Strict EPA and WHO drinking water quality compliance and reporting'
      ],
      standards: [
        'AWWA Standards (American Water Works Association)',
        'EPA Safe Drinking Water Act (SDWA) & Clean Water Act (CWA)',
        'EPA America’s Water Infrastructure Act (AWIA Section 2013 Cyber Assessment)',
        'IEC 62443 / NIST SP 800-82 (Water Utility OT Cybersecurity)'
      ],
      digitalTwinFocus: 'Water Treatment & Utility Network Twin unifying treatment plant 3D layout (Forte / Aspect), water main GIS (GeoMedia), and compliant operator shift handovers (Tempo).',
      roiDrivers: [
        'Complete AWIA compliance and defense against zero-day water SCADA tampering',
        '40% faster response to main breaks using spatial GIS network intelligence',
        'Elimination of water quality compliance gaps with electronic logbook auditing'
      ]
    },
    tasks: [
      {
        id: 'water-plant-design',
        name: 'Water Treatment Plant 3D Spatial Layout & Hydraulic Piping Stress (Forte / Aspect / BricsCAD)',
        icon: 'Box',
        recommendedSolutionIds: ['node-forte', 'node-aspect', 'node-bricscad'],
        fitNote: 'Models aeration basins, chemical dosing rooms, and hydraulic piping stress under Octave Forte and Aspect.'
      },
      {
        id: 'water-ops-logbook',
        name: 'Treatment Plant Shift Handover, Water Quality Logs & Alarms (Tempo / Reliance)',
        icon: 'Activity',
        recommendedSolutionIds: ['node-tempo', 'node-reliance'],
        fitNote: 'Standardizes water quality grab-sample logging, chemical inventory checks, and operator shift handovers (Octave Tempo).'
      },
      {
        id: 'water-network-gis',
        name: 'Municipal Water Utility Geospatial Asset Network (GeoMedia / Alto / InConcert)',
        icon: 'Globe',
        recommendedSolutionIds: ['node-geomedia', 'node-alto', 'node-inconcert'],
        fitNote: 'Maps water mains, valves, hydrants, and treatment facility as-built documentation.'
      },
      {
        id: 'water-scada-cyber',
        name: 'Water SCADA / OT Cybersecurity & EPA Compliance Shield (CyberIntegrity)',
        icon: 'ShieldCheck',
        recommendedSolutionIds: ['node-cyberintegrity'],
        fitNote: 'Shields municipal water SCADA controllers and PLCs against unauthorized setpoint changes and malware.'
      }
    ]
  },
  {
    id: 'aec-infra',
    name: 'AEC & Capital Infrastructure',
    icon: 'Building2',
    description: 'Civil engineering, transportation hubs, bridge engineering, and large commercial construction.',
    research: {
      marketContext: 'AEC general contractors and civil engineering consultancies are shifting to open BIM workflows and unified field construction sequencing to prevent cost overruns.',
      challenges: [
        'Disconnection between 2D engineering drawings and 3D field construction models',
        'Material delivery delays and lack of real-time supply chain visibility on site',
        'Structural frame seismic and wind load compliance for mega-structures',
        'Subcontractor coordination clashes leading to expensive change orders'
      ],
      standards: [
        'ISO 19650 (Organization and Digitization of Information About Buildings and Civil Engineering Works, Including BIM)',
        'AISC 360 / Eurocode 3 (Design of Steel Structures)',
        'ASCE 7 (Minimum Design Loads and Associated Criteria for Buildings)',
        'OSHA 1926 (Safety and Health Regulations for Construction)'
      ],
      digitalTwinFocus: 'Connected BIM & Construction Twin uniting BricsCAD BIM drafting, Advanced Work Packaging (OnSite), and supply chain readiness (Loop).',
      roiDrivers: [
        'Up to 25% reduction in overall construction schedule duration via AWP sequencing',
        '65% decrease in request for information (RFI) cycles through direct model collaboration',
        'Accurate steel and concrete quantity takeoff reducing procurement waste'
      ]
    },
    tasks: [
      {
        id: 'bim-cad',
        name: '2D / 3D BIM & Infrastructure CAD Drafting (BricsCAD / Aspect)',
        icon: 'Box',
        recommendedSolutionIds: ['node-bricscad', 'node-aspect'],
        fitNote: 'Versatile 2D/3D DWG drafting, BIM modeling, and civil engineering design for infrastructure projects.'
      },
      {
        id: 'info-mgmt-infra',
        name: 'Infrastructure Information Management (InConcert)',
        icon: 'FolderGit',
        recommendedSolutionIds: ['node-inconcert'],
        fitNote: 'Central repository for civil project drawings, submittals, vendor documentation, and as-built records.'
      },
      {
        id: 'gis-mapping-infra',
        name: 'Geospatial Mapping & Infrastructure Spatial Intelligence (GeoMedia / Alto / Imagine)',
        icon: 'Globe',
        recommendedSolutionIds: ['node-geomedia', 'node-alto', 'node-imagine'],
        fitNote: 'Geospatial mapping, satellite imagery analysis, and web portals for transportation and urban planning.'
      },
      {
        id: 'construction-infra',
        name: 'Construction Site Execution & Sequencing (OnSite / Sequence)',
        icon: 'HardHat',
        recommendedSolutionIds: ['node-sequence', 'node-onsite'],
        fitNote: 'Site construction work packages, material tracking, and project timeline sequencing.'
      }
    ]
  },
  {
    id: 'public-safety',
    name: 'Public Safety & Govt',
    icon: 'Siren',
    description: '911 emergency response, law enforcement, fire/EMS, and public safety command.',
    research: {
      marketContext: 'Emergency services and public safety agencies require sub-second call handling, integrated GIS location intelligence, and secure cloud records management.',
      challenges: [
        'Fragmented communication between police, fire, EMS, and municipal dispatchers',
        'Inaccurate caller location identification leading to delayed emergency response',
        'Complex chain-of-custody requirements for digital evidence and police records',
        'Cyber attacks on critical 911 dispatch networks and public safety databases'
      ],
      standards: [
        'NENA i3 Standards for Next Generation 9-1-1 (NG9-1-1)',
        'FBI CJIS (Criminal Justice Information Services Security Policy)',
        'NFPA 1221 (Standard for the Installation, Maintenance, and Use of Emergency Services Communications Systems)',
        'NIST Cybersecurity Framework for Emergency Response'
      ],
      digitalTwinFocus: 'Public Safety Situational Command Twin connecting 911 CAD call taking (OnCall), spatial GIS mapping (GeoMedia / Alto), and records management (Coda).',
      roiDrivers: [
        'Sub-second response coordination across multi-agency emergency operations centers',
        'Full CJIS audit compliance and tamper-proof evidence chain of custody',
        'Continuous NG9-1-1 operational uptime with resilient high-availability failover'
      ]
    },
    tasks: [
      {
        id: 'cad-dispatch',
        name: '911 Computer-Aided Dispatch (CAD) & Command (OnCall)',
        icon: 'Radio',
        recommendedSolutionIds: ['node-oncall'],
        fitNote: 'Real-time emergency call taking, unit dispatching, and mobile responder unit tracking.'
      },
      {
        id: 'records-mgmt',
        name: 'Public Safety Records Management (RMS) (Coda)',
        icon: 'FileText',
        recommendedSolutionIds: ['node-coda'],
        fitNote: 'Incident logging, arrest records, investigation files, and law enforcement reporting.'
      },
      {
        id: 'gis-imagery',
        name: 'Incident Mapping & Aerial/Satellite Visuals (GeoMedia / Alto / Imagine)',
        icon: 'Globe',
        recommendedSolutionIds: ['node-geomedia', 'node-alto', 'node-imagine'],
        fitNote: 'High-resolution aerial imagery analysis and spatial GIS mapping for emergency command centers.'
      },
      {
        id: 'gov-info-mgmt',
        name: 'Government Infrastructure Information Repository (InConcert)',
        icon: 'FolderGit',
        recommendedSolutionIds: ['node-inconcert'],
        fitNote: 'Central document and asset management for municipal infrastructure and public facilities.'
      }
    ]
  },
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    icon: 'UtensilsCrossed',
    description: 'Food processing, beverage manufacturing, breweries, dairy facilities, cold chain logistics, and FDA/HACCP-compliant plant engineering.',
    research: {
      marketContext: 'Food and beverage manufacturers are investing in hygienic plant digital twins, automated HACCP compliance, and sanitary piping validation to meet escalating FDA FSMA and GFSI regulatory demands while expanding global production capacity.',
      challenges: [
        'Strict sanitary piping slope verification, dead-leg elimination, and CIP/SIP sterilization validation',
        'Complex thermal processing (pasteurization, retorting, UHT) requiring pressure vessel and heat exchanger analysis',
        'Operator batch handover failures leading to contaminated product batches and costly recalls',
        'Cyber vulnerabilities in food processing SCADA, cold chain controllers, and automated packaging lines'
      ],
      standards: [
        'FDA FSMA (Food Safety Modernization Act) & 21 CFR Parts 110/117 (Current Good Manufacturing Practices)',
        'HACCP / Codex Alimentarius (Hazard Analysis and Critical Control Points)',
        '3-A Sanitary Standards & EHEDG (European Hygienic Engineering & Design Group)',
        'ISO 22000 / FSSC 22000 (Food Safety Management Systems) & IEC 62443 (Food OT Cybersecurity)'
      ],
      digitalTwinFocus: 'Hygienic Process Digital Twin combining sanitary piping stress (Aspect Pipe Stress), 3D food plant layout (Forte), FDA-compliant electronic batch records (Tempo / InConcert), and OT cybersecurity (CyberIntegrity).',
      roiDrivers: [
        '60% reduction in FDA audit preparation time with instantly accessible tamper-proof batch and maintenance records',
        'Near-zero product recalls through standardized HACCP electronic shift handovers and real-time alarm rationalization',
        'Accelerated capacity expansion commissioning for new beverage, dairy, and ready-meal production lines'
      ]
    },
    tasks: [
      {
        id: 'food-piping-vessel',
        name: 'Sanitary Piping Stress & Food-Grade Vessel Analysis (Aspect Pipe Stress / PV Elite)',
        icon: 'Layers',
        recommendedSolutionIds: ['node-aspect', 'node-forte'],
        fitNote: 'Validates hygienic piping flexibility, thermal expansion in CIP circuits, and jacketed process vessel specs under Octave Aspect — ensuring 3-A and EHEDG dead-leg compliance.'
      },
      {
        id: 'food-3d-plant',
        name: '3D Food Processing Plant & Cleanroom Layout (Forte / Aspect)',
        icon: 'Box',
        recommendedSolutionIds: ['node-forte', 'node-aspect'],
        fitNote: '3D spatial modeling of processing lines, dairy cleanrooms, cold storage, and packaging halls — with sanitary drain slope checking and spatial clash detection.'
      },
      {
        id: 'food-pid-schematics',
        name: 'Process P&ID & Utilities Instrumentation Schematics (Facets / BricsCAD)',
        icon: 'Network',
        recommendedSolutionIds: ['node-facets', 'node-bricscad'],
        fitNote: 'Draws intelligent hygienic P&IDs, CIP/SIP circuit diagrams, and utilities instrumentation for food and beverage process lines.'
      },
      {
        id: 'food-ops-haccp',
        name: 'HACCP Batch Operations, Shift Logbooks & Alarm Rationalization (Tempo / Reliance)',
        icon: 'Activity',
        recommendedSolutionIds: ['node-tempo', 'node-reliance'],
        fitNote: 'Standardizes operator HACCP shift handovers (Octave Tempo), critical control point (CCP) alarm rationalization, and batch quality event recording for FDA audit readiness.'
      },
      {
        id: 'food-info-mgmt',
        name: 'Food Plant Information Management & Digital Twin (InConcert / Facets)',
        icon: 'FolderGit',
        recommendedSolutionIds: ['node-inconcert', 'node-facets'],
        fitNote: 'Centralizes FDA FSMA-compliant engineering records, equipment validation protocols, supplier documentation, and hygienic tag specifications in Octave InConcert.'
      },
      {
        id: 'food-ot-cyber',
        name: 'Food Processing OT & SCADA Cybersecurity (CyberIntegrity)',
        icon: 'ShieldCheck',
        recommendedSolutionIds: ['node-cyberintegrity'],
        fitNote: 'Secures automated filling lines, cold chain SCADA controllers, and PLC networks against cyber threats and unauthorized recipe or setpoint tampering.'
      },
      {
        id: 'food-construction',
        name: 'Food Facility Capital Projects & Site Execution (OnSite / Loop)',
        icon: 'HardHat',
        recommendedSolutionIds: ['node-onsite', 'node-loop'],
        fitNote: 'Manages construction work packages, hygienic equipment delivery readiness, and contractor site execution for new food and beverage plant builds.'
      }
    ]
  }
];
