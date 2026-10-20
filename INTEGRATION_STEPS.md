# Step-by-Step Integration Guide

## 🎯 Goal
Integrate enhanced certificate system with ClientKnowledgeQuiz to:
1. ✅ Select topic at quiz start
2. ✅ Track category performance
3. ✅ Apply difficulty-based scoring
4. ✅ Generate 42-field certificate
5. ✅ Display certificate with current design

---

## 📋 Implementation Steps

### **STEP 1: Update Quiz Questions with Topic Tags**

File: `src/components/ClientKnowledgeQuiz.tsx`

Add `topicTags` to each question in `QUIZ_QUESTIONS`:

```typescript
{
  id: 'q1-pillars',
  type: 'SELECT',
  category: 'Architecture & Portfolio',
  categoryIcon: 'Layers',
  question: 'What are the four core pillars...',
  options: [...],
  correctAnswer: 'A',
  explanation: '...',
  screenSource: '...',
  // ===== ADD THIS =====
  topicTags: ['ARCHITECTURE', 'INFORMATION_MGMT', 'DESIGN_TOOLS']
  // ===================
}
```

**Mapping Guide:**
```
INFORMATION_MGMT Questions:
- InConcert, Data Bridge, digital twin spine concepts
- Questions: q1, q7, and any data/integration focused

DESIGN_TOOLS Questions:
- Forte 3D, Facets 2D, Aspect, CAD/engineering
- Questions: q3, q8

CYBERSECURITY Questions:
- Cyber Integrity, OT security, compliance
- Questions: q5

OPERATIONS Questions:
- Alto, Tempo, AssetSense, APM
- Questions: q6

ARCHITECTURE Questions:
- All questions (covers everything)
- All 10 questions tagged with ARCHITECTURE
```

---

### **STEP 2: Add Topic Selection State**

File: `src/components/ClientKnowledgeQuiz.tsx`

In the component state (around line 156), add:

```typescript
// After: const [quizState, setQuizState] = useState<'INTRO' | 'ACTIVE' | 'SUMMARY'>('INTRO');

// ===== ADD THIS =====
const [quizState, setQuizState] = useState<'TOPIC_SELECT' | 'INTRO' | 'ACTIVE' | 'SUMMARY'>('TOPIC_SELECT');
const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);
// ====================
```

---

### **STEP 3: Add Client Email & Job Title**

File: `src/components/ClientKnowledgeQuiz.tsx`

In the component state, add:

```typescript
// After: const [clientName, setClientName] = useState('');
// After: const [clientCompany, setClientCompany] = useState('');

// ===== ADD THIS =====
const [clientEmail, setClientEmail] = useState('');
const [clientJobTitle, setClientJobTitle] = useState('');
// ====================
```

---

### **STEP 4: Add Certificate Generation State**

File: `src/components/ClientKnowledgeQuiz.tsx`

Add after other state:

```typescript
import { CertificateData } from '../types/certificate';
import { buildCertificateData, QuizData, VisitorData } from '../utils/certificateAdapter';
import { calculateAdjustedScore, getTierBadge, TOPIC_CONFIGS } from '../utils/certificateConfig';

// In component:
const [generatedCertificate, setGeneratedCertificate] = useState<CertificateData | null>(null);
```

---

### **STEP 5: Create Topic Selection Screen**

File: `src/components/ClientKnowledgeQuiz.tsx`

Add to the component (before the existing INTRO section):

```typescript
// ===== ADD THIS SECTION =====
if (quizState === 'TOPIC_SELECT') {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-3">
          Select Your Certification Path
        </h1>
        <p className="text-neutral-400 text-lg">
          Choose a specialization to test your knowledge
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(TOPIC_CONFIGS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedTopic(key as QuizTopic);
              setQuizState('INTRO');
            }}
            className="p-6 rounded-xl border-2 hover:border-current transition-all group cursor-pointer"
            style={{
              borderColor: `${config.color}40`,
              backgroundColor: `${config.color}08`
            }}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              {config.difficulty === 'EASY' && '⭐'}
              {config.difficulty === 'MODERATE' && '⭐⭐'}
              {config.difficulty === 'HARD' && '⭐⭐⭐'}
              {config.difficulty === 'EXPERT' && '⭐⭐⭐⭐'}
            </div>
            <h3 className="font-bold text-white mb-2">{config.displayName}</h3>
            <p className="text-xs text-neutral-400 mb-3">{config.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
// =============================
```

---

### **STEP 6: Update INTRO Screen with New Fields**

File: `src/components/ClientKnowledgeQuiz.tsx`

Update the INTRO screen to include email and job title inputs:

```typescript
{/* In the client details section, add: */}

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
```

---

### **STEP 7: Update handleCompleteQuiz to Generate Certificate**

File: `src/components/ClientKnowledgeQuiz.tsx`

Replace the existing `handleCompleteQuiz` function:

```typescript
const handleCompleteQuiz = async () => {
  setTimerActive(false);
  if (timerRef.current) clearInterval(timerRef.current);

  if (!selectedTopic || !clientName) {
    setQuizState('SUMMARY');
    return;
  }

  // Filter questions for selected topic
  const relevantQuestions = QUIZ_QUESTIONS.filter(q => 
    q.topicTags?.includes(selectedTopic)
  );
  
  const totalQuestions = relevantQuestions.length;
  
  const correctCount = relevantQuestions.filter(q => 
    userAnswers[q.id] === q.correctAnswer
  ).length;

  const rawScore = Math.round((correctCount / totalQuestions) * 100);

  // Calculate category performance
  const categories: { [key: string]: { correct: number; total: number } } = {};
  
  relevantQuestions.forEach((q) => {
    if (!categories[q.category]) {
      categories[q.category] = { correct: 0, total: 0 };
    }
    categories[q.category].total += 1;
    if (userAnswers[q.id] === q.correctAnswer) {
      categories[q.category].correct += 1;
    }
  });

  // Build certificate
  const visitorData: VisitorData = {
    firstName: clientName.split(' ')[0] || 'Guest',
    lastName: clientName.split(' ').slice(1).join(' ') || '',
    email: clientEmail,
    company: clientCompany,
    jobTitle: clientJobTitle,
    department: 'Presales / Enterprise Solutions'
  };

  const quizData: QuizData = {
    correctAnswers: correctCount,
    totalQuestions,
    timeSpentSeconds: timeElapsed,
    categoryScores: Object.entries(categories).map(([cat, { correct, total }]) => ({
      category: cat,
      score: correct,
      maxScore: total
    })),
    topic: selectedTopic
  };

  const certificate = buildCertificateData(visitorData, quizData);
  setGeneratedCertificate(certificate);

  // Notify parent component
  if (onCertificateGenerated) {
    onCertificateGenerated(certificate);
  }

  setQuizState('SUMMARY');
};
```

---

### **STEP 8: Update Component Props**

File: `src/components/ClientKnowledgeQuiz.tsx`

Update the props interface:

```typescript
interface ClientKnowledgeQuizProps {
  onCertificateGenerated?: (certificateData: CertificateData) => void; // ADD THIS
  onNavigateToCertificate?: (scoreData?: { score: number; total: number; badge: string; clientName: string }) => void;
  onNavigateToCanvas?: () => void;
}
```

And update the component destructuring:

```typescript
export default function ClientKnowledgeQuiz({
  onCertificateGenerated,  // ADD THIS
  onNavigateToCertificate,
  onNavigateToCanvas
}: ClientKnowledgeQuizProps) {
```

---

### **STEP 9: Update App.tsx to Handle Certificate**

File: `src/App.tsx`

Add certificate state and handler:

```typescript
import { CertificateData } from './types/certificate';
import EnhancedCertificate from './components/EnhancedCertificate';

// In App component:
const [certificateData, setCertificateData] = useState<CertificateData | null>(null);

// Add handler:
const handleCertificateGenerated = (cert: CertificateData) => {
  setCertificateData(cert);
  // Optionally navigate to certificate section
  // setActiveSection('THANK_YOU');
};

// Update ClientKnowledgeQuiz component call:
<ClientKnowledgeQuiz 
  onCertificateGenerated={handleCertificateGenerated}
  onNavigateToCertificate={...}
  onNavigateToCanvas={...}
/>

// Add display logic in summary section:
{certificateData && (
  <div className="mt-8">
    <EnhancedCertificate 
      certificateData={certificateData}
      onClose={() => setCertificateData(null)}
    />
  </div>
)}
```

---

## 🧪 Testing Checklist

- [ ] Topic selection screen appears
- [ ] Can select each topic (Operations, Design, Info Mgmt, etc.)
- [ ] Quiz questions filter by topic
- [ ] Email & job title fields appear in INTRO
- [ ] Quiz runs with timer
- [ ] Score calculation includes only topic-relevant questions
- [ ] Certificate is generated after quiz
- [ ] Scores are difficulty-adjusted correctly:
  - Same 75% score → Different tiers by topic
  - Cybersecurity 75% = lower tier than Operations 75%
- [ ] Certificate displays with 42 fields
- [ ] PDF export works with current design

---

## 🔍 Debugging Tips

**Topic not filtering questions:**
```typescript
// Check if questions have topicTags
console.log(QUIZ_QUESTIONS[0].topicTags);

// Should output: ['ARCHITECTURE', 'INFORMATION_MGMT', ...]
```

**Certificate not generating:**
```typescript
// Check if selectedTopic is set
console.log(selectedTopic);

// Check certificate data
console.log(generatedCertificate);
```

**Wrong difficulty multiplier:**
```typescript
import { calculateAdjustedScore } from './utils/certificateConfig';

const result = calculateAdjustedScore(75, 'CYBERSECURITY');
console.log(result); 
// Should show: { rawScore: 75, adjustedScore: 86, ... }
```

---

## ✅ After Integration

You will have:
- ✅ Topic selection at quiz start
- ✅ Difficulty-based scoring (Cybersecurity harder than Operations)
- ✅ Category performance tracking
- ✅ 42-field certificate generation
- ✅ Seamless integration with existing design

---

## 📝 Important Notes

1. **topicTags**: Each question can have multiple topics
2. **Difficulty Multiplier**: 
   - 0.95 = 5% easier (Operations)
   - 1.0 = standard (Design, InfoMgmt)
   - 1.15 = 15% harder (Cybersecurity)
   - 1.25 = 25% harder (Architecture)

3. **Certificate Storage**: Currently generates and displays, but doesn't save to database
   - Add database persistence later if needed

4. **Passing Scores**:
   - Operations: 55%
   - Design/InfoMgmt: 60%
   - Cybersecurity: 65%
   - Architecture: 70%

---

## 🚀 Next Phase (Optional)

- Add database persistence for certificates
- Create certificate lookup/verification page
- Add certificate sharing to LinkedIn
- Create certificate templates for printing
- Add certificate analytics dashboard
