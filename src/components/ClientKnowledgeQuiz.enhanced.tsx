// ENHANCED CLIENT KNOWLEDGE QUIZ
// Added: Topic selection, category tracking, certificate generation

import { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { QuizTopic } from '../types/certificate';
import { CertificateData } from '../types/certificate';
import { buildCertificateData, QuizData, VisitorData } from '../utils/certificateAdapter';
import { calculateAdjustedScore, getTierBadge, generateCertificateNote, TOPIC_CONFIGS } from '../utils/certificateConfig';

// QUIZ QUESTIONS WITH CATEGORY MAPPING
interface QuizQuestionEnhanced {
  id: string;
  type: 'SELECT' | 'TRUE_FALSE';
  category: string;
  categoryIcon: string;
  question: string;
  options?: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  screenSource: string;
  topicTags: QuizTopic[]; // Which topics this question relates to
}

// Map questions to topics
const QUIZ_QUESTIONS_ENHANCED: QuizQuestionEnhanced[] = [
  {
    id: 'q1-pillars',
    type: 'SELECT',
    category: 'Architecture & Portfolio',
    categoryIcon: 'Layers',
    question: 'What are the four core pillars of the unified Octave asset lifecycle portfolio?',
    options: [
      { id: 'A', text: 'Design, Build, Operate, Protect' },
      { id: 'B', text: 'Plan, Code, Test, Deploy' },
      { id: 'C', text: 'Ingest, Process, Store, Analyze' },
      { id: 'D', text: 'Discover, Implement, Monitor, Retire' }
    ],
    correctAnswer: 'A',
    explanation: 'Octave structures its entire industrial digital twin ecosystem across four unified pillars.',
    screenSource: 'Who is Octave & Portfolio Matrix',
    topicTags: ['ARCHITECTURE', 'INFORMATION_MGMT', 'DESIGN_TOOLS']
  },
  // ... other questions with topicTags added
];

interface ClientKnowledgeQuizEnhancedProps {
  onCertificateGenerated?: (certificateData: CertificateData) => void;
  onNavigateToCertificate?: (scoreData?: { score: number; total: number; badge: string; clientName: string }) => void;
  onNavigateToCanvas?: () => void;
}

export default function ClientKnowledgeQuizEnhanced({
  onCertificateGenerated,
  onNavigateToCertificate,
  onNavigateToCanvas
}: ClientKnowledgeQuizEnhancedProps = {}) {
  // ===== NEW: TOPIC SELECTION =====
  const [quizState, setQuizState] = useState<'TOPIC_SELECT' | 'INTRO' | 'ACTIVE' | 'SUMMARY'>('TOPIC_SELECT');
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);

  // Client Details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientJobTitle, setClientJobTitle] = useState('');

  // Timer Configuration
  const [selectedDuration, setSelectedDuration] = useState<number>(150);
  const [timeLeft, setTimeLeft] = useState<number>(150);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Question navigation and answer selections
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: string]: string }>({});
  const [expandedExplanationId, setExpandedExplanationId] = useState<string | null>(null);

  // ===== NEW: CERTIFICATE DATA =====
  const [generatedCertificate, setGeneratedCertificate] = useState<CertificateData | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer Effect (unchanged)
  useEffect(() => {
    if (timerActive && quizState === 'ACTIVE') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ===== NEW: TOPIC SELECTION HANDLER =====
  const handleTopicSelect = (topic: QuizTopic) => {
    setSelectedTopic(topic);
    setQuizState('INTRO');
  };

  // Start Quiz
  const handleStartQuiz = () => {
    if (!selectedTopic) return;
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

  // ===== ENHANCED: CALCULATE CATEGORY PERFORMANCE =====
  const calculateCategoryPerformance = () => {
    if (!selectedTopic) return [];

    const categories: { [key: string]: { correct: number; total: number } } = {};

    QUIZ_QUESTIONS_ENHANCED.forEach((q) => {
      // Filter questions for selected topic
      if (!q.topicTags.includes(selectedTopic)) return;

      if (!categories[q.category]) {
        categories[q.category] = { correct: 0, total: 0 };
      }

      categories[q.category].total += 1;

      if (userAnswers[q.id] === q.correctAnswer) {
        categories[q.category].correct += 1;
      }
    });

    return Object.entries(categories).map(([category, { correct, total }]) => ({
      category,
      icon: 'CheckCircle',
      score: correct,
      maxScore: total,
      percentage: Math.round((correct / total) * 100),
      status:
        correct / total >= 0.9
          ? 'EXCELLENT'
          : correct / total >= 0.8
            ? 'STRONG'
            : correct / total >= 0.7
              ? 'GOOD'
              : ('PASSING' as const)
    }));
  };

  // Complete Quiz & Generate Certificate
  const handleCompleteQuiz = async () => {
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (!selectedTopic || !clientName) {
      setQuizState('SUMMARY');
      return;
    }

    // Calculate performance
    const totalQuestions = QUIZ_QUESTIONS_ENHANCED.filter((q) =>
      q.topicTags.includes(selectedTopic)
    ).length;

    const correctCount = QUIZ_QUESTIONS_ENHANCED.filter((q) => {
      if (!q.topicTags.includes(selectedTopic)) return false;
      return userAnswers[q.id] === q.correctAnswer;
    }).length;

    const rawScore = Math.round((correctCount / totalQuestions) * 100);
    const categoryPerf = calculateCategoryPerformance();

    // Build certificate data
    const visitorData: VisitorData = {
      firstName: clientName.split(' ')[0] || 'Guest',
      lastName: clientName.split(' ')[1] || '',
      email: clientEmail,
      company: clientCompany,
      jobTitle: clientJobTitle,
      department: 'Presales / Enterprise Solutions'
    };

    const quizData: QuizData = {
      correctAnswers: correctCount,
      totalQuestions,
      timeSpentSeconds: timeElapsed,
      categoryScores: categoryPerf.map((cp) => ({
        category: cp.category,
        score: cp.score,
        maxScore: cp.maxScore
      })),
      topic: selectedTopic
    };

    const certificate = buildCertificateData(visitorData, quizData);
    setGeneratedCertificate(certificate);

    // Notify parent
    if (onCertificateGenerated) {
      onCertificateGenerated(certificate);
    }

    setQuizState('SUMMARY');
  };

  // Calculate Results
  const totalQuestions = QUIZ_QUESTIONS_ENHANCED.filter((q) =>
    selectedTopic ? q.topicTags.includes(selectedTopic) : true
  ).length;

  const correctCount = QUIZ_QUESTIONS_ENHANCED.filter((q) => {
    if (selectedTopic && !q.topicTags.includes(selectedTopic)) return false;
    return userAnswers[q.id] === q.correctAnswer;
  }).length;

  const rawScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const { adjustedScore } = selectedTopic
    ? calculateAdjustedScore(rawScore, selectedTopic)
    : { adjustedScore: rawScore };
  const badge = selectedTopic ? getTierBadge(rawScore, selectedTopic) : null;

  // ===== RENDER: TOPIC SELECTION SCREEN =====
  if (quizState === 'TOPIC_SELECT') {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-3">Select Your Certification Path</h1>
          <p className="text-neutral-400 text-lg">Choose a specialization to test your knowledge</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(TOPIC_CONFIGS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleTopicSelect(key as QuizTopic)}
              className="p-6 rounded-xl border-2 hover:border-current transition-all group cursor-pointer"
              style={{ borderColor: `${config.color}40`, backgroundColor: `${config.color}08` }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {config.difficulty === 'EASY' && '⭐'}
                {config.difficulty === 'MODERATE' && '⭐⭐'}
                {config.difficulty === 'HARD' && '⭐⭐⭐'}
                {config.difficulty === 'EXPERT' && '⭐⭐⭐⭐'}
              </div>
              <h3 className="font-bold text-white mb-2">{config.displayName}</h3>
              <p className="text-xs text-neutral-400 mb-3">{config.description}</p>
              <div className="text-[10px] font-mono text-neutral-500">
                {config.difficulty === 'EASY' && 'Accessible'}
                {config.difficulty === 'MODERATE' && 'Balanced'}
                {config.difficulty === 'HARD' && 'Advanced'}
                {config.difficulty === 'EXPERT' && 'Expert Level'}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ===== RENDER: INTRO SCREEN =====
  if (quizState === 'INTRO') {
    const topicConfig = selectedTopic ? TOPIC_CONFIGS[selectedTopic] : null;

    return (
      <div className="w-full max-w-2xl mx-auto p-6 animate-fade-in">
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-white/10 space-y-6">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">Octave Knowledge Challenge</h2>
            <p className="text-neutral-400">
              {topicConfig ? `${topicConfig.displayName} - ${topicConfig.difficulty} Level` : 'Quiz'}
            </p>
          </div>

          {/* Client Info Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-sky-400 mb-1">Full Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-white placeholder-neutral-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-sky-400 mb-1">Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="your.email@company.com"
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-white placeholder-neutral-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-sky-400 mb-1">Company</label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  placeholder="Company name"
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-white placeholder-neutral-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-sky-400 mb-1">Job Title</label>
                <input
                  type="text"
                  value={clientJobTitle}
                  onChange={(e) => setClientJobTitle(e.target.value)}
                  placeholder="Your role"
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-white placeholder-neutral-500"
                />
              </div>
            </div>
          </div>

          {/* Quiz Info */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-sm text-neutral-300">
              <Icons.Clock className="w-4 h-4 inline mr-2" />
              This quiz has <span className="font-bold">{totalQuestions} questions</span> and a{' '}
              <span className="font-bold">{selectedDuration}s</span> time limit.
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartQuiz}
            disabled={!clientName.trim()}
            className="w-full py-3 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Icons.PlayCircle className="w-5 h-5" />
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // ===== RENDER: ACTIVE QUIZ & SUMMARY (existing code with certificate data) =====
  // ... (keep existing quiz rendering logic, enhanced with certificate data)

  return null;
}
