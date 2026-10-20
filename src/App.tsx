import { useState, useEffect } from 'react';
import PortfolioMatrix from './components/PortfolioMatrix';
import ArchitectureBuilder from './components/ArchitectureBuilder';
import AIAssistantChat from './components/AIAssistantChat';
import LeadCaptureModal from './components/LeadCaptureModal';
import OfficeMap from './components/OfficeMap';
import IndustriesSimulator from './components/IndustriesSimulator';
import ThankYouVisiting from './components/ThankYouVisiting';
import SolutionFinder from './components/SolutionFinder';
import WhoIsOctave from './components/WhoIsOctave';
import ClientKnowledgeQuiz from './components/ClientKnowledgeQuiz';
import TallyQuizLeaderboard from './components/TallyQuizLeaderboard';
import LiveQuizHost from './components/LiveQuizHost';
import SystemDocumentation from './components/SystemDocumentation';
import NewsBanner from './components/NewsBanner';
import OctaveLogo from './components/OctaveLogo';
import AuthGate from './components/AuthGate';
import { CanvasNode, CanvasIntegration } from './types';
import * as Icons from 'lucide-react';

type SectionType =
  | 'WHO_IS_OCTAVE'
  | 'SOLUTION_FINDER'
  | 'PORTFOLIO_MATRIX'
  | 'INDUSTRIES'
  | 'BUILDER'
  | 'COPILOT'
  | 'OFFICES'
  | 'KNOWLEDGE_QUIZ'
  | 'THANK_YOU'
  | 'DOCUMENTATION'
  | 'TALLY_QUIZ'
  | 'LIVE_QUIZ';

export default function App() {
  // Authentication State (Username: ali / Password: leapksa)
  const [authUser, setAuthUser] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('octave_auth_user') || localStorage.getItem('octave_auth_user');
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('octave_auth_user');
      localStorage.removeItem('octave_auth_user');
    } catch {
      // ignore
    }
    setAuthUser(null);
  };

  const [activeSection, setActiveSection] = useState<SectionType>('WHO_IS_OCTAVE');
  const [isDayMode, setIsDayMode] = useState(false);

  // Mobile sidebar menu toggle state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active components and integrations state for AI Assistant
  const [activeComponents, setActiveComponents] = useState<{ name: string; pillar: string }[]>([
    { name: 'Octave InConcert', pillar: 'DESIGN' },
    { name: 'Octave Forte', pillar: 'DESIGN' },
    { name: 'Octave Facets', pillar: 'DESIGN' }
  ]);
  const [activeIntegrations, setActiveIntegrations] = useState<{ source: string; target: string; protocol: string }[]>([
    { source: 'Octave Forte', target: 'Octave InConcert', protocol: 'Native Direct Connector / REST' },
    { source: 'Octave Facets', target: 'Octave InConcert', protocol: 'Native Direct Connector / OData' }
  ]);

  // Lead modal state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [savedNodes, setSavedNodes] = useState<CanvasNode[]>([]);
  const [savedIntegrations, setSavedIntegrations] = useState<CanvasIntegration[]>([]);

  // Stored quiz result data passed to Certificate
  const [quizScoreData, setQuizScoreData] = useState<{ score: number; total: number; badge: string; clientName: string; companyName?: string; jobTitle?: string } | null>(null);

  // Trigger from canvas to capture lead
  const handleRequestFollowUp = (components: CanvasNode[], integrations: CanvasIntegration[]) => {
    setSavedNodes(components);
    setSavedIntegrations(integrations);
    setIsLeadModalOpen(true);
  };

  const handleCanvasChange = (components: CanvasNode[], integrations: CanvasIntegration[]) => {
    if (components && components.length > 0) {
      setActiveComponents(components.map(c => ({ name: c.name, pillar: c.pillar })));
    }
    if (integrations) {
      setActiveIntegrations(integrations.map(i => {
        const src = components.find(c => c.id === i.sourceId);
        const tgt = components.find(c => c.id === i.targetId);
        return {
          source: src?.name || 'Unknown',
          target: tgt?.name || 'Unknown',
          protocol: i.protocol
        };
      }));
    }
  };

  // Add solution to canvas directly from secondary components
  const [externalAddSignal, setExternalAddSignal] = useState<string | null>(null);
  const handleAddSolutionFromDirectory = (solutionId: string) => {
    setExternalAddSignal(solutionId);
    setActiveSection('BUILDER');
    // Clear signal immediately to prevent loops
    setTimeout(() => setExternalAddSignal(null), 100);
  };

  // Navigation Menu Definitions (consistent across sidebar & quick access)
  const menuItems = [
    {
      id: 'WHO_IS_OCTAVE' as SectionType,
      label: 'Who is Octave?',
      shortLabel: 'Who is Octave?',
      icon: 'Building2',
      badge: 'ABOUT',
      badgeColor: 'bg-sky-500/10 border border-sky-500/20 text-sky-400',
    },
    {
      id: 'PORTFOLIO_MATRIX' as SectionType,
      label: 'Octave Portfolio & Matrix',
      shortLabel: 'Portfolio Matrix',
      icon: 'LayoutGrid',
    },
    {
      id: 'INDUSTRIES' as SectionType,
      label: 'Octave Value',
      shortLabel: 'Octave Value',
      icon: 'TrendingUp',
      badge: 'VALUE',
      badgeColor: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
    },
    {
      id: 'SOLUTION_FINDER' as SectionType,
      label: 'Solutions Fit for Your Purpose',
      shortLabel: 'Fit for Purpose',
      icon: 'Sparkles',
      badge: 'FINDER',
      badgeColor: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
    },
    {
      id: 'COPILOT' as SectionType,
      label: 'AI Assistant',
      shortLabel: 'AI Assistant',
      icon: 'Bot',
      badge: 'AI COPILOT',
      badgeColor: 'bg-purple-500/10 border border-purple-500/20 text-purple-400',
    },
    {
      id: 'OFFICES' as SectionType,
      label: 'Global Offices Map',
      shortLabel: 'Global Offices',
      icon: 'Globe',
    },
    {
      id: 'BUILDER' as SectionType,
      label: 'Architecture Builder',
      shortLabel: 'Architecture Builder',
      icon: 'Layers',
      badge: 'BUILDER',
      badgeColor: 'bg-sky-500/10 border border-sky-500/20 text-sky-400',
    },
    {
      id: 'KNOWLEDGE_QUIZ' as SectionType,
      label: 'Client Knowledge Quiz',
      shortLabel: 'Knowledge Quiz',
      icon: 'HelpCircle',
      badge: '2-3 MINS',
      badgeColor: 'bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold',
    },
    {
      id: 'LIVE_QUIZ' as SectionType,
      label: 'Live Quiz & Leaderboard',
      shortLabel: 'Live Quiz',
      icon: 'Gamepad2',
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
    },
    {
      id: 'THANK_YOU' as SectionType,
      label: 'Thank You For Visiting Us',
      shortLabel: 'Thank You',
      icon: 'Award',
      badge: 'CERTIFICATE',
      badgeColor: 'bg-sky-500/10 border border-sky-500/20 text-sky-400',
    },
    {
      id: 'DOCUMENTATION' as SectionType,
      label: 'System Documentation',
      shortLabel: 'Documentation',
      icon: 'BookOpen',
      badge: 'DOCX EXPORT',
      badgeColor: 'bg-sky-500/10 border border-sky-500/30 text-sky-300 font-bold',
    },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'WHO_IS_OCTAVE':
        return <WhoIsOctave onNavigateToCanvas={() => setActiveSection('BUILDER')} />;
      case 'SOLUTION_FINDER':
        return (
          <SolutionFinder
            onAddToCanvas={handleAddSolutionFromDirectory}
            onNavigateToBuilder={() => setActiveSection('BUILDER')}
            onRequestDemo={() => setIsLeadModalOpen(true)}
          />
        );
      case 'PORTFOLIO_MATRIX':
        return <PortfolioMatrix onAddToCanvas={handleAddSolutionFromDirectory} />;
      case 'INDUSTRIES':
        return <IndustriesSimulator onAddToCanvas={handleAddSolutionFromDirectory} />;
      case 'BUILDER':
        return (
          <div id="builder-layout" className="flex flex-col gap-6 flex-1 w-full">
            <ArchitectureBuilder
              onNodeSelect={(solId) => {
                console.log("Selected node:", solId);
              }}
              onRequestFollowUp={(nodes, ints) => {
                handleRequestFollowUp(nodes, ints);
              }}
              externalAddSignal={externalAddSignal}
              onCanvasChange={handleCanvasChange}
            />
          </div>
        );
      case 'COPILOT':
        return (
          <div className="flex flex-col gap-6 flex-1 w-full max-w-5xl mx-auto h-full min-h-0">
            <AIAssistantChat
              activeComponents={activeComponents}
              activeIntegrations={activeIntegrations}
              onNavigateToCanvas={() => setActiveSection('BUILDER')}
            />
          </div>
        );
      case 'OFFICES':
        return <OfficeMap />;
      case 'KNOWLEDGE_QUIZ':
        return (
          <ClientKnowledgeQuiz
            onNavigateToCertificate={(data) => {
              if (data) {
                setQuizScoreData(data);
              }
              setActiveSection('THANK_YOU');
            }}
            onNavigateToCanvas={() => setActiveSection('BUILDER')}
          />
        );
      case 'THANK_YOU':
        return (
          <ThankYouVisiting
            initialVisitorName={quizScoreData?.clientName}
            initialCompanyName={quizScoreData?.companyName}
            initialJobTitle={quizScoreData?.jobTitle}
            initialQuizScore={quizScoreData}
            onNavigateToQuiz={() => setActiveSection('KNOWLEDGE_QUIZ')}
          />
        );
      case 'TALLY_QUIZ':
        return <TallyQuizLeaderboard isDayMode={isDayMode} />;
      case 'LIVE_QUIZ':
        return <LiveQuizHost isDayMode={isDayMode} />;
      case 'DOCUMENTATION':
        return (
          <SystemDocumentation
            onNavigateToSection={(target) => {
              if (target) {
                setActiveSection(target as SectionType);
              }
            }}
          />
        );
      default:
        return <PortfolioMatrix onAddToCanvas={handleAddSolutionFromDirectory} />;
    }
  };

  // Dynamic Lucide Icon Component
  const LucideIcon = ({ name, className }: { name: string; className?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return <Icons.HelpCircle className={className} />;
    return <IconComponent className={className} />;
  };

  // If user is not authenticated, show the login security screen
  if (!authUser) {
    return <AuthGate onLoginSuccess={(user) => setAuthUser(user)} />;
  }

  return (
    <div id="app-root" className={`h-screen max-h-screen w-full overflow-hidden text-neutral-100 flex flex-col font-sans selection:bg-sky-500 selection:text-black ${isDayMode ? 'day-mode bg-slate-100' : 'bg-[#0a0a0a]'}`}>
      
      {/* 1. Unified Page Layout with Left Navigation Sidebar */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row items-stretch overflow-hidden">
        
        {/* Mobile Hamburger Header (Visible on smaller viewports) */}
        <div className="md:hidden h-14 border-b border-white/10 bg-[#0c0c0c] px-4 flex items-center justify-between z-40 shrink-0">
          <OctaveLogo iconSize={28} />
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="p-1.5 rounded hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all cursor-pointer"
              title="Lock Terminal"
            >
              <Icons.Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              {isMobileMenuOpen ? <Icons.X className="w-5 h-5" /> : <Icons.Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Permanent Left Sidebar (Desktop Only) / Floating Draw (Mobile Option) */}
        <aside
          id="workspace-sidebar"
          className={`w-full md:w-72 border-r flex flex-col shrink-0 select-none z-30 transition-all duration-300 h-full overflow-hidden backdrop-blur-md ${
            isMobileMenuOpen ? 'block' : 'hidden md:flex'
          } ${isDayMode ? 'bg-slate-200 border-slate-300' : 'bg-[#0c0c0c]/90 border-white/10'}`}
        >
          {/* Sidebar Top Header Brand (Desktop Only) */}
          <div className={`hidden md:flex flex-col gap-1 px-5 py-4 border-b shrink-0 ${isDayMode ? 'border-slate-300' : 'border-white/10'}`}>
            <OctaveLogo iconSize={36} />
            <div className="flex items-center justify-between mt-1">
              <p className={`text-[9px] font-mono tracking-widest uppercase ${isDayMode ? 'text-slate-500' : 'text-neutral-500'}`}>[ Touchscreen Exhibition ]</p>
              <button
                onClick={() => setIsDayMode(!isDayMode)}
                title={isDayMode ? 'Switch to Night Mode' : 'Switch to Day Mode'}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-mono font-bold transition-all cursor-pointer border ${
                  isDayMode
                    ? 'bg-slate-300 hover:bg-slate-400 text-slate-700 border-slate-400'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-amber-400 border-neutral-700'
                }`}
              >
                {isDayMode ? <Icons.Moon className="w-3 h-3" /> : <Icons.Sun className="w-3 h-3" />}
                <span>{isDayMode ? 'NIGHT' : 'DAY'}</span>
              </button>
            </div>
          </div>

          {/* Sidebar Navigation Items */}
          <nav className="flex-1 min-h-0 p-3 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  id={`sidebar-item-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between gap-2 group cursor-pointer active:scale-[0.98] select-none ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                    <LucideIcon name={item.icon} className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${item.badgeColor || 'bg-neutral-800 text-neutral-400'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer context */}
          <div className={`p-3 border-t hidden md:flex flex-col gap-2 text-[10px] font-medium font-mono shrink-0 ${isDayMode ? 'border-slate-300 text-slate-500' : 'border-white/10 text-neutral-500'}`}>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 truncate">Octave - ADIPEC Hall 12 - Stand #12610</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[9px] font-bold border border-sky-500/20">
                <Icons.UserCheck className="w-2.5 h-2.5" />
                ali
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg text-[10px] font-mono flex items-center justify-center gap-1.5 border border-white/10 transition-all cursor-pointer"
            >
              <Icons.Lock className="w-3 h-3 text-amber-400" />
              <span>Lock Terminal</span>
            </button>
          </div>
        </aside>

        {/* 3. Main Workspace Area */}
        <main id="workspace-main" className={`flex-1 min-h-0 p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-6 overflow-y-auto ${isDayMode ? 'bg-slate-100' : 'bg-[#0a0a0a]'}`}>
          {/* Top Quick-Access Navigation Bar (Exact same order as sidebar) */}
          <div className={`shrink-0 flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl shadow-lg backdrop-blur-md overflow-x-auto border ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0c101a]/95 border-white/10'}`}>
            <div className="flex items-center gap-1.5 min-w-max">
              <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest px-2 hidden lg:inline-block">
                QUICK ACCESS:
              </span>

              {menuItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={`quick-${item.id}`}
                    id={`quick-nav-${item.id.toLowerCase()}`}
                    onClick={() => setActiveSection(item.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-sm active:scale-[0.97] select-none ${
                      isActive
                        ? 'bg-sky-500 text-black font-bold shadow-sky-500/25 ring-1 ring-sky-400'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <LucideIcon
                      name={item.icon}
                      className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-neutral-400'}`}
                    />
                    <span>{item.shortLabel || item.label}</span>
                    {item.badge && item.id === 'BUILDER' && (
                      <span className={`text-[8px] font-mono font-bold px-1 py-0.2 rounded ${isActive ? 'bg-black/30 text-white' : 'bg-sky-500/20 text-sky-300'}`}>
                        CANVAS
                      </span>
                    )}
                    {item.badge && item.id === 'KNOWLEDGE_QUIZ' && !isActive && (
                      <span className="text-[8px] font-mono font-bold px-1 py-0.2 rounded bg-amber-500/20 text-amber-300">
                        QUIZ
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              {/* Day / Night Toggle */}
              <button
                onClick={() => setIsDayMode(!isDayMode)}
                title={isDayMode ? 'Switch to Night Mode' : 'Switch to Day Mode'}
                className={`px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 border font-mono font-bold ${
                  isDayMode
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-300'
                    : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border-white/10'
                }`}
              >
                {isDayMode ? (
                  <><Icons.Moon className="w-3.5 h-3.5" /><span className="text-[10px]">Night</span></>
                ) : (
                  <><Icons.Sun className="w-3.5 h-3.5 text-amber-400" /><span className="text-[10px]">Day</span></>
                )}
              </button>

              <button
                onClick={handleLogout}
                title="Lock Exhibition Terminal"
                className={`px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isDayMode
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300'
                    : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border-white/10'
                }`}
              >
                <Icons.Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-mono font-bold">Lock (ali)</span>
              </button>
            </div>
          </div>

          {renderActiveSection()}
        </main>
      </div>

      {/* 4. Lead Capture Follow-up Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        activeComponents={savedNodes}
        activeIntegrations={savedIntegrations}
      />

      {/* 5. Lower-Third News Broadcast Banner with Clocks */}
      <div className="shrink-0 z-30">
        <NewsBanner />
      </div>
    </div>
  );
}
