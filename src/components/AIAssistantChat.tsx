import { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

interface AIAssistantChatProps {
  activeComponents: { name: string; pillar: string }[];
  activeIntegrations: { source: string; target: string; protocol: string }[];
  onNavigateToCanvas?: () => void;
}

export interface QuizResult {
  score: number;
  badgeTitle: string;
  familiarity: string;
  industry: string;
  role: string;
  systems: string[];
}

export default function AIAssistantChat({ activeComponents, activeIntegrations, onNavigateToCanvas }: AIAssistantChatProps) {
  // Quiz Mode State: 'WELCOME' | 'QUESTION' | 'RESULT' | 'CHAT'
  const [quizMode, setQuizMode] = useState<'WELCOME' | 'QUESTION' | 'RESULT' | 'CHAT'>('WELCOME');
  const [quizStep, setQuizStep] = useState<number>(0);

  // Quiz Selections
  const [familiarity, setFamiliarity] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  
  // Timer state for 2-min limit
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes (120 seconds)
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Calculated Quiz Result
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "**Octave Pre-Sales Copilot initialized.** I provide architectural validation, product-to-legacy mappings, and cross-pillar topology assessments exclusively for the **Octave** ecosystem.\n\nSelect a technical query below or submit an integration scenario for instant evaluation."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0 && quizMode === 'QUESTION') {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizMode === 'QUESTION') {
      // Time expired: auto-calculate score
      handleFinishQuiz();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, quizMode]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setQuizMode('QUESTION');
    setQuizStep(0);
    setTimeLeft(120);
    setTimerActive(true);
  };

  const handleSkipQuiz = () => {
    setQuizMode('CHAT');
    setTimerActive(false);
  };

  const toggleSystemSelection = (sysName: string) => {
    if (selectedSystems.includes(sysName)) {
      setSelectedSystems(selectedSystems.filter(s => s !== sysName));
    } else {
      setSelectedSystems([...selectedSystems, sysName]);
    }
  };

  const handleFinishQuiz = () => {
    setTimerActive(false);
    
    // Calculate Score
    let score = 0;
    
    // Familiarity Score (max 40)
    if (familiarity.includes('Existing Octave')) score += 40;
    else if (familiarity.includes('Familiar with core')) score += 35;
    else if (familiarity.includes('Heard the name')) score += 20;
    else score += 10;

    // Role Score (max 25)
    if (role.includes('Enterprise') || role.includes('Solution Architect')) score += 25;
    else if (role.includes('Executive') || role.includes('Operations VP')) score += 25;
    else if (role.includes('OT') || role.includes('Automation') || role.includes('Data')) score += 20;
    else score += 15;

    // Systems Score (max 35)
    score += Math.min(35, selectedSystems.length * 8 + 10);

    // Finalize Score capped at 100
    const finalScore = Math.min(100, Math.max(15, score));

    let badgeTitle = 'Octave Discovery Explorer';
    if (finalScore >= 85) badgeTitle = 'Enterprise Master Architect';
    else if (finalScore >= 70) badgeTitle = 'Strategic Solution Fit';
    else if (finalScore >= 50) badgeTitle = 'Operational Modernization Candidate';

    const result: QuizResult = {
      score: finalScore,
      badgeTitle,
      familiarity: familiarity || 'First-Time Explorer',
      industry: industry || 'Industrial Engineering',
      role: role || 'Presales Leader',
      systems: selectedSystems.length > 0 ? selectedSystems : ['Standard In-House Tools']
    };

    setQuizResult(result);
    setQuizMode('RESULT');
  };

  const handleApplyQuizResultsToChat = () => {
    setQuizMode('CHAT');
    if (!quizResult) return;

    // Formulate tailored welcome message
    const welcomeMsg = `### 🎯 Presales Profile & Alignment Registered
**Score: ${quizResult.score}/100** • **Tier: ${quizResult.badgeTitle}**

* **Target Sector**: **${quizResult.industry}**
* **Presales Scope**: **${quizResult.role}**
* **Connected Stack**: **${quizResult.systems.join(', ')}**

**Bottom-Line Focus**: Prioritizing **Octave Databridge Pro** for ERP/SCADA message brokerage and **Octave InConcert** as the single source of truth for **${quizResult.industry}** asset lifecycles. Submit any technical inquiry below.`;

    setMessages([
      { sender: 'assistant', text: welcomeMsg }
    ]);
  };

  // Quick touchscreen questions
  const quickQuestions = [
    "How does Octave Databridge Pro integrate with my SAP/Oracle ERP?",
    "What legacy systems does Octave Forte replace?",
    "Explain the Information Management Platform direct connectors.",
    "Why is Octave Attune recommended for asset reliability?",
    "What is the role of Octave Tempo in operations management?"
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const nextMessages = [...messages, { sender: 'user', text: textToSend } as Message];
    setMessages(nextMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          components: activeComponents,
          integrations: activeIntegrations,
          quizResult: quizResult || undefined
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'assistant', text: data.response || "I was unable to compile a solution answer. Please try again." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'assistant', text: "Technical connection error. Please verify server connectivity or try a different question." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-chat-root" className="flex flex-col h-full bg-neutral-900/40 border border-white/10 rounded-xl overflow-hidden min-h-[520px]">
      
      {/* Header */}
      <div id="ai-chat-header" className="p-3.5 bg-[#0a0a0a]/90 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <Icons.Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-wider text-neutral-200 uppercase flex items-center gap-2">
              <span>Octave Pre-Sales Copilot</span>
              {quizResult && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Score: {quizResult.score}/100
                </span>
              )}
            </h4>
            <span className="text-[9px] text-neutral-500 font-mono tracking-widest block mt-0.5">[ EVENT ARCHITECT ASSISTANT ]</span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {onNavigateToCanvas && (
            <button
              onClick={onNavigateToCanvas}
              className="px-3 py-1 text-[11px] font-mono font-bold text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/40 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Switch to Architecture Builder Canvas"
            >
              <Icons.Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Architecture Builder</span>
            </button>
          )}

          {quizMode === 'CHAT' ? (
            <button
              onClick={() => setQuizMode('WELCOME')}
              className="px-2.5 py-1 text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Icons.HelpCircle className="w-3 h-3 text-amber-400" />
              <span>{quizResult ? 'View Quiz Score' : 'Take 2-Min Quiz'}</span>
            </button>
          ) : (
            <button
              onClick={handleSkipQuiz}
              className="px-2.5 py-1 text-[10px] font-mono font-medium text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Skip to Chat</span>
              <Icons.ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* QUIZ WELCOME SCREEN */}
      {quizMode === 'WELCOME' && (
        <div className="flex-1 p-6 bg-gradient-to-b from-[#0a0e1a] via-[#090d16] to-[#05070d] flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4 max-w-lg mx-auto text-center pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Icons.Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>2-Minute Assessment (Optional)</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Personalize Your Solution Experience
            </h3>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Answer 4 quick selection clicks about your company background, industry, job function, and current software tools. We’ll calculate your <strong className="text-sky-400">Octave Architectural Alignment Score</strong> and tailor our AI Copilot to your exact needs!
            </p>

            <div className="grid grid-cols-2 gap-2 text-left pt-2">
              <div className="p-3 bg-neutral-900/60 border border-white/10 rounded-xl flex items-start gap-2.5">
                <Icons.Building2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-neutral-200 block">1. Company Awareness</span>
                  <span className="text-[10px] text-neutral-400">Familiarity with Octave</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-900/60 border border-white/10 rounded-xl flex items-start gap-2.5">
                <Icons.Factory className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-neutral-200 block">2. Industry & Sector</span>
                  <span className="text-[10px] text-neutral-400">Energy, Oil & Gas, Mfg</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-900/60 border border-white/10 rounded-xl flex items-start gap-2.5">
                <Icons.UserCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-neutral-200 block">3. Role & Responsibility</span>
                  <span className="text-[10px] text-neutral-400">Architect, Exec, OT Eng</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-900/60 border border-white/10 rounded-xl flex items-start gap-2.5">
                <Icons.Cpu className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-neutral-200 block">4. Connected Systems</span>
                  <span className="text-[10px] text-neutral-400">SAP, AVEVA, SCADA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto w-full">
            <button
              onClick={handleStartQuiz}
              className="w-full sm:w-auto flex-1 px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Icons.Play className="w-4 h-4 fill-current" />
              <span>Start 2-Min Assessment</span>
            </button>

            <button
              onClick={handleSkipQuiz}
              className="w-full sm:w-auto px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs rounded-xl border border-white/10 transition-all cursor-pointer"
            >
              Skip & Start Chat Directly
            </button>
          </div>
        </div>
      )}

      {/* QUIZ QUESTION STEPS */}
      {quizMode === 'QUESTION' && (
        <div className="flex-1 p-5 bg-[#080c16] flex flex-col justify-between overflow-y-auto">
          {/* Progress & Timer Header */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-sky-400 font-bold uppercase tracking-wider">
                Step {quizStep + 1} of 4
              </span>
              <span className="text-amber-400 font-bold flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                <Icons.Timer className="w-3.5 h-3.5 animate-pulse" />
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-400 to-blue-500 h-full transition-all duration-300"
                style={{ width: `${((quizStep + 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: FAMILIARITY */}
          {quizStep === 0 && (
            <div className="space-y-4 my-auto">
              <div>
                <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Icons.Building2 className="w-5 h-5 text-sky-400" />
                  Have you heard of Octave Solutions before?
                </h4>
                <p className="text-xs text-neutral-400">Select the option that best describes your brand awareness:</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { label: 'First time hearing about Octave', subtitle: 'New to our software portfolio & booth', value: 'First time hearing about Octave' },
                  { label: 'Heard the name / General industry awareness', subtitle: 'Know our brand in industrial software', value: 'Heard the name / General industry awareness' },
                  { label: 'Familiar with core solutions (Forte, InConcert, Attune)', subtitle: 'Understand our design & operation tools', value: 'Familiar with core solutions' },
                  { label: 'Existing Octave / Intergraph / Hexagon customer', subtitle: 'Currently running active solutions in production', value: 'Existing Octave / Intergraph customer' }
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setFamiliarity(opt.value);
                      setQuizStep(1);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                      familiarity === opt.value
                        ? 'bg-sky-500/20 border-sky-400 text-white shadow-md'
                        : 'bg-neutral-900/60 border-white/10 text-neutral-300 hover:border-white/30 hover:bg-neutral-800/70'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-100 group-hover:text-sky-300">{opt.label}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{opt.subtitle}</div>
                    </div>
                    <Icons.ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: INDUSTRY */}
          {quizStep === 1 && (
            <div className="space-y-4 my-auto">
              <div>
                <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Icons.Factory className="w-5 h-5 text-emerald-400" />
                  Which industrial sector describes your organization?
                </h4>
                <p className="text-xs text-neutral-400">Select your primary operational domain:</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
                {[
                  { label: 'Pharmaceuticals & Life Sciences', icon: 'Pill' },
                  { label: 'Nuclear Power & Clean Energy', icon: 'Atom' },
                  { label: 'Energy & Electric Utilities', icon: 'Zap' },
                  { label: 'Oil, Gas & Petrochemicals', icon: 'Flame' },
                  { label: 'Mining, Metals & Minerals', icon: 'Pickaxe' },
                  { label: 'Heavy Manufacturing & EPC', icon: 'Factory' },
                  { label: 'Logistics & Infrastructure', icon: 'Truck' },
                  { label: 'Public Safety & Emergency Ops', icon: 'ShieldAlert' },
                  { label: 'Tech & Engineering Services', icon: 'Cpu' }
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIndustry(opt.label);
                      setQuizStep(2);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      industry === opt.label
                        ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                        : 'bg-neutral-900/60 border-white/10 text-neutral-300 hover:border-white/30 hover:bg-neutral-800/70'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                      <Icons.CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-neutral-200">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: ROLE */}
          {quizStep === 2 && (
            <div className="space-y-4 my-auto">
              <div>
                <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Icons.UserCheck className="w-5 h-5 text-purple-400" />
                  What is your primary job function or focus?
                </h4>
                <p className="text-xs text-neutral-400">Helps tailor technical depth in recommendations:</p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {[
                  { title: 'Enterprise / Solution Architect', desc: 'System topology, integration blueprints & protocols' },
                  { title: 'Executive / C-Suite / Operations VP', desc: 'ROI, digital transformation & strategic risk' },
                  { title: 'OT, SCADA & Automation Specialist', desc: 'Control systems, telemetry & plant monitoring' },
                  { title: 'Data & Information Management Lead', desc: 'Tag repositories, 3D/2D digital twin models' },
                  { title: 'Maintenance & Asset Reliability Manager', desc: 'EAM, work orders, preventive maintenance' },
                  { title: 'Procurement / Business Analyst', desc: 'Vendor comparison, licensing & compliance' }
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setRole(opt.title);
                      setQuizStep(3);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                      role === opt.title
                        ? 'bg-purple-500/20 border-purple-400 text-white shadow-md'
                        : 'bg-neutral-900/60 border-white/10 text-neutral-300 hover:border-white/30 hover:bg-neutral-800/70'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-100 group-hover:text-purple-300">{opt.title}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{opt.desc}</div>
                    </div>
                    <Icons.ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-purple-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: KNOWN / EXISTING SYSTEMS */}
          {quizStep === 3 && (
            <div className="space-y-4 my-auto">
              <div>
                <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Icons.Cpu className="w-5 h-5 text-amber-400" />
                  Which systems do you currently use? (Select all that apply)
                </h4>
                <p className="text-xs text-neutral-400">We'll show how Octave Databridge connects seamlessly:</p>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto pr-1">
                {[
                  'SAP / Oracle ERP',
                  'AVEVA / OSIsoft PI System',
                  'Schneider / Siemens SCADA',
                  'Emerson DeltaV / Honeywell DCS',
                  'Veeva / TrackWise GxP Systems',
                  'Smart 3D / SmartPlant Foundation',
                  'HxGN EAM / IBM Maximo',
                  'PAS Cyber Integrity / ETQ Reliance',
                  'CAESAR II / PIPESTRESS / PV Elite',
                  'Standard / In-House Tools'
                ].map((sys, idx) => {
                  const isSel = selectedSystems.includes(sys);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleSystemSelection(sys)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        isSel
                          ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400/50'
                          : 'bg-neutral-900/60 border-white/10 text-neutral-300 hover:border-white/30'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isSel ? 'bg-amber-400 border-amber-400 text-black' : 'border-white/20 bg-black/40'
                      }`}>
                        {isSel && <Icons.Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-[11px] font-bold truncate">{sys}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleFinishQuiz}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <span>Calculate My Score & Results</span>
                <Icons.Sparkles className="w-4 h-4 fill-current" />
              </button>
            </div>
          )}

          {/* Navigation Controls inside Question Mode */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <button
              disabled={quizStep === 0}
              onClick={() => setQuizStep(prev => prev - 1)}
              className="px-3 py-1.5 bg-neutral-800 disabled:opacity-30 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-all cursor-pointer flex items-center gap-1"
            >
              <Icons.ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleSkipQuiz}
              className="text-[10px] font-mono text-neutral-400 hover:text-white underline cursor-pointer"
            >
              Skip Quiz & Start Conversation
            </button>
          </div>
        </div>
      )}

      {/* QUIZ RESULT SCREEN */}
      {quizMode === 'RESULT' && quizResult && (
        <div className="flex-1 p-6 bg-gradient-to-b from-[#0b1222] via-[#080d1a] to-[#04060d] flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4 max-w-lg mx-auto text-center pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Icons.Award className="w-4 h-4 text-sky-400" />
              <span>Assessment Completed</span>
            </div>

            {/* Score Ring / Badge */}
            <div className="relative inline-block my-2">
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-sky-500/20 via-blue-600/10 to-transparent border-2 border-sky-400 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                <span className="text-3xl font-black text-white tracking-tight">{quizResult.score}</span>
                <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">/ 100 PTS</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-white">{quizResult.badgeTitle}</h3>
              <p className="text-xs text-neutral-300 mt-1 max-w-sm mx-auto">
                Your profile demonstrates high alignment with Octave’s unified asset lifecycle & digital twin portfolio.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-2 text-left pt-2 text-xs">
              <div className="p-2.5 bg-neutral-900/80 border border-white/10 rounded-xl">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Industry Sector</span>
                <span className="font-bold text-sky-300 block truncate">{quizResult.industry}</span>
              </div>
              <div className="p-2.5 bg-neutral-900/80 border border-white/10 rounded-xl">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">User Role</span>
                <span className="font-bold text-purple-300 block truncate">{quizResult.role}</span>
              </div>
              <div className="p-2.5 bg-neutral-900/80 border border-white/10 rounded-xl col-span-2">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Connected Stack</span>
                <span className="font-bold text-amber-300 block truncate">{quizResult.systems.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto w-full">
            <button
              onClick={handleApplyQuizResultsToChat}
              className="w-full sm:w-auto flex-1 px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <span>Launch Tailored AI Conversation</span>
              <Icons.MessageSquare className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* CHAT MODE */}
      {quizMode === 'CHAT' && (
        <>
          {/* Messages area */}
          <div id="ai-chat-history" className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]/25">
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  id={`chat-msg-${idx}`}
                  key={idx}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-4 py-3 text-xs font-normal leading-relaxed ${
                      isUser
                        ? 'bg-white text-black rounded-tr-none font-bold shadow-md'
                        : 'bg-neutral-900 border border-white/10 text-neutral-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {/* Markdown Renderer with GFM Table Support */}
                    <div className="text-xs leading-relaxed space-y-2">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h3: ({ children }) => (
                            <h3 className="text-sm font-bold text-sky-400 mt-2 mb-1 border-b border-white/10 pb-1">{children}</h3>
                          ),
                          h4: ({ children }) => (
                            <h4 className="text-xs font-bold text-neutral-100 mt-1.5 mb-1">{children}</h4>
                          ),
                          p: ({ children }) => (
                            <p className="mb-1.5 last:mb-0">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-sky-300">{children}</strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-4 space-y-1 my-1.5 text-neutral-200">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-4 space-y-1 my-1.5 text-neutral-200">{children}</ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">{children}</li>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-2.5 rounded-lg border border-white/15 bg-black/40">
                              <table className="w-full text-left text-[11px] border-collapse">{children}</table>
                            </div>
                          ),
                          thead: ({ children }) => (
                            <thead className="bg-neutral-800/80 border-b border-white/15 text-neutral-200">{children}</thead>
                          ),
                          tbody: ({ children }) => (
                            <tbody className="divide-y divide-white/10">{children}</tbody>
                          ),
                          tr: ({ children }) => (
                            <tr className="hover:bg-white/5 transition-colors">{children}</tr>
                          ),
                          th: ({ children }) => (
                            <th className="py-1.5 px-2.5 font-bold text-sky-300 uppercase tracking-wider text-[10px] whitespace-nowrap">{children}</th>
                          ),
                          td: ({ children }) => (
                            <td className="py-1.5 px-2.5 text-neutral-300 align-top leading-snug">{children}</td>
                          ),
                          code: ({ children }) => (
                            <code className="px-1 py-0.5 rounded bg-black/50 text-sky-300 font-mono text-[10px]">{children}</code>
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-900 border border-white/10 text-neutral-400 rounded-xl rounded-tl-none px-3.5 py-3 text-xs flex items-center gap-2">
                  <Icons.Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                  <span>Formulating solution architecture advice...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Quick Touch Suggestions */}
          <div id="ai-chat-suggestions" className="px-4 pb-2 border-t border-white/10 pt-2.5 bg-neutral-900/40">
            <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1.5">[ QUICK TOUCH SUGGESTIONS ]</span>
            <div className="flex flex-wrap gap-1.5 max-h-[90px] overflow-y-auto">
              {quickQuestions.map((q, idx) => (
                <button
                  id={`quick-q-${idx}`}
                  key={idx}
                  disabled={isLoading}
                  onClick={() => handleSendMessage(q)}
                  className="text-[10px] font-medium bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white hover:border-sky-500/30 px-2 py-1 rounded transition-all cursor-pointer truncate max-w-full"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Form input */}
          <form
            id="ai-chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 bg-neutral-900/60 border-t border-white/10 flex gap-2"
          >
            <input
              id="ai-chat-input"
              type="text"
              placeholder="Ask about Octave products or integrations..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-sky-500 disabled:opacity-50"
            />
            <button
              id="btn-send-chat"
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2 bg-sky-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-black rounded-lg font-bold hover:bg-sky-400 transition-all cursor-pointer"
            >
              <Icons.Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
