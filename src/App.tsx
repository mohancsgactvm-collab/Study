import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Plus,
  Compass,
  FileText,
  HelpCircle,
  Calendar,
  Award,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Loader,
  ChevronRight,
  TrendingUp,
  BookmarkCheck,
  Send,
  Zap,
  RotateCcw,
  BookMarked,
  Search,
  CheckCircle2,
  Trash2,
  ThumbsUp,
  Sliders,
  ExternalLink,
  Sun,
  Moon
} from "lucide-react";
import { prepopulatedSubject } from "./prepopulated";
import {
  SubjectSystem,
  SyllabusAnalysis,
  StudyNote,
  QuestionBank,
  StudyPlan,
  MockTestEvaluation,
  ChatMessage
} from "./types";
import TopicVisualizer from "./components/TopicVisualizer";
import { translations } from "./translations";

export default function App() {
  // Active subject state
  const [subjects, setSubjects] = useState<SubjectSystem[]>([]);
  const [activeSubjectId, setActiveSubjectId] = useState<string>("");

  // Input states for new subject
  const [course, setCourse] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [syllabusRaw, setSyllabusRaw] = useState("");
  const [examDate, setExamDate] = useState("");
  const [studyTime, setStudyTime] = useState("2 hours");

  // App UI states
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("study_master_dark_mode") === "true";
  });

  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "tamil">(() => {
    const saved = localStorage.getItem("study_master_language");
    if (saved === "english" || saved === "tamil") {
      return saved;
    }
    return "english";
  });

  useEffect(() => {
    localStorage.setItem("study_master_language", selectedLanguage);
  }, [selectedLanguage]);

  // Translate helper function using translations dictionary
  const t = (key: keyof typeof translations.en, replacements?: Record<string, string | number>): string => {
    const lang = selectedLanguage === "tamil" ? "ta" : "en";
    let dictValue = translations[lang][key] || translations["en"][key] || String(key);
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        dictValue = dictValue.split(`{${k}}`).join(String(v));
      });
    }
    return dictValue;
  };

  // Helper to extract English or Tamil parts from bilingual strings
  const formatBilingualText = (text: string, lang: "english" | "tamil"): string => {
    if (!text) return "";
    
    // Check if the string has a standard bilingual parenthesis structure, e.g., "English (Tamil)"
    // or "Something in English (ஏதாவது தமிழில்)"
    const parenMatch = text.match(/^([^(]+)\s*\(([^)]+)\)$/);
    if (parenMatch) {
      const englishPart = parenMatch[1].trim();
      const tamilPart = parenMatch[2].trim();
      if (lang === "english") return englishPart;
      if (lang === "tamil") return tamilPart;
      return text;
    }

    // Check if separated by "/" e.g., "English / Tamil"
    if (text.includes(" / ")) {
      const parts = text.split(" / ");
      if (parts.length >= 2) {
        if (lang === "english") return parts[0].trim();
        if (lang === "tamil") return parts[1].trim();
      }
    }

    // Default fallback
    return text;
  };

  // Helper to split a combined notes explanation into English and Tamil segments
  const splitExplanation = (explanation: string): { english: string; tamil: string } => {
    if (!explanation) return { english: "", tamil: "" };

    const englishMarker = "English Explanation:";
    const tamilMarker = "தமிழ் விளக்கம்:";

    const englishIndex = explanation.indexOf(englishMarker);
    const tamilIndex = explanation.indexOf(tamilMarker);

    if (englishIndex !== -1 && tamilIndex !== -1) {
      let englishText = "";
      let tamilText = "";

      if (englishIndex < tamilIndex) {
        englishText = explanation.substring(englishIndex + englishMarker.length, tamilIndex).trim();
        tamilText = explanation.substring(tamilIndex + tamilMarker.length).trim();
      } else {
        tamilText = explanation.substring(tamilIndex + tamilMarker.length, englishIndex).trim();
        englishText = explanation.substring(englishIndex + englishMarker.length).trim();
      }
      return { english: englishText, tamil: tamilText };
    }

    // Try alternate format with lower/upper cases or simple fallback
    return { english: "", tamil: explanation };
  };

  useEffect(() => {
    localStorage.setItem("study_master_dark_mode", String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const [activeTab, setActiveTab] = useState<"analysis" | "notes" | "questions" | "plan" | "exam">("analysis");
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [loadingStep, setLoadingStep] = useState<number | null>(null);
  const [loadingText, setLoadingText] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  // Notes tab sub-states
  const [selectedNoteTopic, setSelectedNoteTopic] = useState<string>("");

  // Questions tab sub-states
  const [questionsType, setQuestionsType] = useState<"2marks" | "5marks" | "10marks" | "mcq">("mcq");
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [showMcqExplanations, setShowMcqExplanations] = useState<Record<number, boolean>>({});

  // Exam tab sub-states
  const [examQuestion, setExamQuestion] = useState("");
  const [examMarks, setExamMarks] = useState(10);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<MockTestEvaluation | null>(null);

  // Chat/Tutor sub-states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load initial state
  useEffect(() => {
    const saved = localStorage.getItem("study_master_subjects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSubjects(parsed);
          setActiveSubjectId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error("Error loading saved state", e);
      }
    }
    // Default to prepopulated data if empty
    setSubjects([prepopulatedSubject]);
    setActiveSubjectId(prepopulatedSubject.id);
  }, []);

  // Save state on change
  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem("study_master_subjects", JSON.stringify(subjects));
    }
  }, [subjects]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, chatLoading]);

  // Get active subject
  const activeSubject = subjects.find((s) => s.id === activeSubjectId);

  // Handle setting active note topic
  useEffect(() => {
    if (activeSubject && activeSubject.notes && activeSubject.notes.length > 0) {
      if (!selectedNoteTopic || !activeSubject.notes.find(n => n.topicName === selectedNoteTopic)) {
        setSelectedNoteTopic(activeSubject.notes[0].topicName);
      }
    }
  }, [activeSubjectId, activeSubject]);

  // Trigger next step logic: pipeline creation
  const handleCreateSystem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !subjectName || !syllabusRaw) {
      alert("தயவுசெய்து அனைத்து முக்கிய விவரங்களையும் நிரப்பவும்.");
      return;
    }

    setApiError(null);
    setIsCreatingSubject(true);

    try {
      // Step 1: Syllabus Analysis
      setLoadingStep(1);
      setLoadingText("Syllabus பகுப்பாய்வு செய்யப்படுகிறது (Step 1 of 4)...");
      const analysisRes = await fetch("/api/step1-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, subject: subjectName, syllabus: syllabusRaw, examDate, studyTime, language: selectedLanguage }),
      });
      if (!analysisRes.ok) throw new Error("Step 1 Analysis failed");
      const analysisData = await analysisRes.json();

      // Gather topics list to generate notes and plans
      const allTopics: string[] = [];
      analysisData.analysis.units.forEach((unit: any) => {
        unit.topics.forEach((topic: any) => {
          allTopics.push(topic.name);
        });
      });

      // Step 2: Notes Creation
      setLoadingStep(2);
      setLoadingText("பாடக் குறிப்புகள் மற்றும் நினைவக உத்திகள் உருவாக்கப்படுகின்றன (Step 2 of 4)...");
      const notesRes = await fetch("/api/step2-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, subject: analysisData.subjectName, topics: allTopics, language: selectedLanguage }),
      });
      if (!notesRes.ok) throw new Error("Step 2 Notes generation failed");
      const notesData = await notesRes.json();

      // Step 3: Question Generator
      setLoadingStep(3);
      setLoadingText("முக்கிய வினாக்கள் மற்றும் விடைகள் உருவாக்கப்படுகின்றன (Step 3 of 4)...");
      const questionsRes = await fetch("/api/step3-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, subject: analysisData.subjectName, syllabusBrief: syllabusRaw, language: selectedLanguage }),
      });
      if (!questionsRes.ok) throw new Error("Step 3 Questions generation failed");
      const questionsData = await questionsRes.json();

      // Step 4: Study Plan Generator
      setLoadingStep(4);
      setLoadingText("நாட்காட்டி மற்றும் திருப்புதல் அட்டவணை உருவாக்கப்படுகிறது (Step 4 of 4)...");
      const planRes = await fetch("/api/step4-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, subject: analysisData.subjectName, topics: allTopics, examDate, studyTime, language: selectedLanguage }),
      });
      if (!planRes.ok) throw new Error("Step 4 Plan generation failed");
      const planData = await planRes.json();

      const newSubject: SubjectSystem = {
        id: `sub-${Date.now()}`,
        course,
        subjectName: analysisData.subjectName,
        syllabusRaw,
        examDate,
        studyTime,
        createdAt: new Date().toISOString(),
        analysis: analysisData.analysis,
        notes: notesData.notes,
        questions: questionsData.questions,
        studyPlan: planData.studyPlan,
        completedTopics: [],
        mockExamHistory: []
      };

      setSubjects(prev => [newSubject, ...prev]);
      setActiveSubjectId(newSubject.id);
      setIsCreatingSubject(false);
      setLoadingStep(null);
      setActiveTab("analysis");

      // Reset fields
      setCourse("");
      setSubjectName("");
      setSyllabusRaw("");
      setExamDate("");
      setStudyTime("2 hours");
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "ஏதோ தவறு நடந்துவிட்டது. மீண்டும் முயற்சிக்கவும்.");
      setLoadingStep(null);
    }
  };

  // Toggle complete state for a topic
  const toggleTopicCompleted = (topicName: string) => {
    if (!activeSubject) return;
    const isCompleted = activeSubject.completedTopics.includes(topicName);
    const updatedCompleted = isCompleted
      ? activeSubject.completedTopics.filter((t) => t !== topicName)
      : [...activeSubject.completedTopics, topicName];

    setSubjects(prev =>
      prev.map(sub =>
        sub.id === activeSubject.id
          ? { ...sub, completedTopics: updatedCompleted }
          : sub
      )
    );
  };

  // Delete a subject workspace
  const handleDeleteSubject = (id: string, name: string) => {
    const formattedName = formatBilingualText(name, selectedLanguage);
    const confirmMsg = t("confirm_delete", { name: formattedName });
    if (confirm(confirmMsg)) {
      const remaining = subjects.filter(s => s.id !== id);
      setSubjects(remaining);
      if (remaining.length > 0) {
        setActiveSubjectId(remaining[0].id);
      } else {
        setActiveSubjectId("");
      }
    }
  };

  // Setup/Reset a mock exam question
  const selectMockExamQuestion = () => {
    if (!activeSubject) return;
    const qTypes = ["twoMarks", "fiveMarks", "tenMarks"];
    const randomType = qTypes[Math.floor(Math.random() * qTypes.length)] as "twoMarks" | "fiveMarks" | "tenMarks";
    const qs = activeSubject.questions[randomType];
    if (qs && qs.length > 0) {
      const q = qs[Math.floor(Math.random() * qs.length)];
      setExamQuestion(q.question);
      setExamMarks(randomType === "twoMarks" ? 2 : randomType === "fiveMarks" ? 5 : 10);
      setStudentAnswer("");
      setEvaluationResult(null);
    } else {
      // Fallback
      setExamQuestion("Explain the core data structure elements in brief. (தரவு கட்டமைப்பின் முக்கிய கூறுகளை சுருக்கமாக விளக்குக.)");
      setExamMarks(10);
      setStudentAnswer("");
      setEvaluationResult(null);
    }
  };

  // Load a question when exam tab is chosen if not set
  useEffect(() => {
    if (activeTab === "exam" && !examQuestion && activeSubject) {
      selectMockExamQuestion();
    }
  }, [activeTab, activeSubject]);

  // Evaluate mock test
  const handleEvaluateAnswer = async () => {
    if (!studentAnswer.trim()) {
      alert("தயவுசெய்து உங்கள் பதிலை தட்டச்சு செய்யவும்.");
      return;
    }
    setIsEvaluating(true);
    setApiError(null);
    try {
      const response = await fetch("/api/step5-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: examQuestion,
          marks: examMarks,
          studentAnswer,
          subjectName: activeSubject?.subjectName,
          language: selectedLanguage
        })
      });
      if (!response.ok) throw new Error("평가에 실패했습니다.");
      const evaluation: MockTestEvaluation = await response.json();
      setEvaluationResult(evaluation);

      // Add to mock exam history
      if (activeSubject) {
        const historyItem = {
          id: `eval-${Date.now()}`,
          date: new Date().toLocaleDateString("ta-IN"),
          question: examQuestion,
          marks: examMarks,
          studentAnswer,
          evaluation
        };
        setSubjects(prev =>
          prev.map(sub =>
            sub.id === activeSubject.id
              ? { ...sub, mockExamHistory: [historyItem, ...(sub.mockExamHistory || [])] }
              : sub
          )
        );
      }
    } catch (err: any) {
      setApiError("மதிப்பீடு செய்வதில் தோல்வி ஏற்பட்டது: " + err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Send message to live tutor chat
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeSubject) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: "user",
      text: chatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: activeSubject.course,
          subject: activeSubject.subjectName,
          message: userMsg.text,
          history: chatHistory.map(h => ({ role: h.role, text: h.text })),
          language: selectedLanguage
        })
      });

      if (!response.ok) throw new Error("tutor chat error");
      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `chat-err-${Date.now()}`,
        role: "model",
        text: "மன்னிக்கவும், பதிலைப் பெற இயலவில்லை. மீண்டும் முயற்சிக்கவும்.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Calculate Preparation metrics
  const totalTopicsCount = activeSubject
    ? activeSubject.analysis.units.reduce((acc, u) => acc + u.topics.length, 0)
    : 0;
  const completedTopicsCount = activeSubject?.completedTopics?.length || 0;
  const prepProgressPercent = totalTopicsCount > 0
    ? Math.round((completedTopicsCount / totalTopicsCount) * 100)
    : 0;

  // Find next task / recommended topic to study
  const nextRecommendedTopic = activeSubject
    ? activeSubject.analysis.units
        .flatMap(u => u.topics)
        .find(t => !activeSubject.completedTopics.includes(t.name))?.name || "All topics completed! 🎉"
    : "";

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 font-sans flex flex-col antialiased transition-colors duration-300">
      {/* Top Banner / Navbar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#131c31] border-b border-slate-200 dark:border-[#1e2d4d] shadow-xs px-4 py-3 sm:px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                {t("app_title")} <span className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md font-medium border border-indigo-100 dark:border-indigo-900/40">{selectedLanguage === "english" ? "AI Study Companion" : "ஏஐ துணைவன்"}</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("app_subtitle")}</p>
            </div>
          </div>

          {/* Quick Select & Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {subjects.length > 0 && (
              <select
                id="subject-selector"
                value={activeSubjectId}
                onChange={(e) => {
                  setActiveSubjectId(e.target.value);
                  setEvaluationResult(null);
                  setExamQuestion("");
                }}
                className="bg-slate-50 dark:bg-[#1c2842] hover:bg-slate-100 dark:hover:bg-[#233355] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#293c61] rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {formatBilingualText(sub.subjectName, selectedLanguage).substring(0, 30)}...
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2642] rounded-lg transition-colors cursor-pointer"
              title={isDarkMode ? t("light_mode") : t("dark_mode")}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* Language Switcher Segmented Control */}
            <div className="flex bg-slate-100 dark:bg-[#1a2642] p-1 rounded-lg border border-slate-200/50 dark:border-[#293c61]">
              <button
                onClick={() => setSelectedLanguage("english")}
                className={`px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                  selectedLanguage === "english"
                    ? "bg-white dark:bg-[#131c31] text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                title="English"
              >
                English
              </button>
              <button
                onClick={() => setSelectedLanguage("tamil")}
                className={`px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                  selectedLanguage === "tamil"
                    ? "bg-white dark:bg-[#131c31] text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                title="தமிழ்"
              >
                தமிழ்
              </button>
            </div>

            <button
              id="new-workspace-btn"
              onClick={() => setIsCreatingSubject(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 text-sm flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t("new_subject_btn")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 relative">
        
        {/* Left Side: Sidebar Stats & Next Task & Subjects List */}
        {activeSubject && (
          <div className="w-full lg:w-80 flex flex-col gap-5 shrink-0">
            {/* Subject Identity Info */}
            <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-[#1e2d4d] p-5 shadow-xs transition-colors">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase block mb-1">
                {activeSubject.course}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {formatBilingualText(activeSubject.subjectName, selectedLanguage)}
              </h2>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#1e2d4d] flex flex-col gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">{selectedLanguage === "english" ? "Exam Date:" : "தேர்வு தேதி:"}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {activeSubject.examDate ? new Date(activeSubject.examDate).toLocaleDateString(selectedLanguage === "english" ? "en-US" : "ta-IN", { year: "numeric", month: "short", day: "numeric" }) : (selectedLanguage === "english" ? "Not Set" : "குறிப்பிடப்படவில்லை")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{selectedLanguage === "english" ? "Study Time:" : "படிக்கும் நேரம்:"}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{activeSubject.studyTime}</span>
                </div>
              </div>
            </div>

            {/* Preparation Level Progress (📊 Preparation Level in POML) */}
            <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-[#1e2d4d] p-5 shadow-xs transition-colors">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>{t("prep_level")}</span>
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{prepProgressPercent}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-4 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${prepProgressPercent}%` }}
                ></div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {t("topics_completed_desc", { completed: completedTopicsCount, total: totalTopicsCount })}
              </p>

              {/* Next Task recommendation (➡ Next Task in POML) */}
              <div className="bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-100/80 dark:border-indigo-900/40 rounded-xl p-3">
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  {t("next_task")}
                </span>
                <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 line-clamp-2">
                  {formatBilingualText(nextRecommendedTopic, selectedLanguage)}
                </p>
                {nextRecommendedTopic !== "All topics completed! 🎉" && (
                  <button
                    onClick={() => {
                      setActiveTab("notes");
                      setSelectedNoteTopic(nextRecommendedTopic);
                    }}
                    className="mt-2 text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    {t("start_studying")} <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Sub-steps navigation tabs (Step 1 to 5) */}
            <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-[#1e2d4d] p-2 shadow-xs flex flex-col gap-1 transition-colors">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "analysis"
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a2642]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4" />
                  <span>{t("step1")}</span>
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Step 1</span>
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "notes"
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a2642]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>{t("step2")}</span>
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Step 2</span>
              </button>

              <button
                onClick={() => setActiveTab("questions")}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "questions"
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a2642]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>{t("step3")}</span>
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Step 3</span>
              </button>

              <button
                onClick={() => setActiveTab("plan")}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "plan"
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a2642]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4" />
                  <span>{t("step4")}</span>
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Step 4</span>
              </button>

              <button
                onClick={() => setActiveTab("exam")}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "exam"
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a2642]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4" />
                  <span>{t("step5")}</span>
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Step 5</span>
              </button>
            </div>

            {/* Quick Helper Links / Workspace manager */}
            <div className="bg-slate-100 dark:bg-[#1a2642]/40 rounded-2xl p-4 border border-slate-200/60 dark:border-[#1e2d4d] text-xs flex justify-between items-center text-slate-500 dark:text-slate-400">
              <span>{t("all_saved_securely")}</span>
              <button
                onClick={() => handleDeleteSubject(activeSubject.id, activeSubject.subjectName)}
                className="text-red-500 hover:text-red-600 font-semibold flex items-center gap-0.5 cursor-pointer"
                title={t("delete_workspace_title")}
              >
                <Trash2 className="w-3.5 h-3.5" /> {t("remove_workspace")}
              </button>
            </div>
          </div>
        )}

        {/* Right Side: Primary Active Step Workspace view */}
        <div className="flex-1 flex flex-col gap-6">
          {apiError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 rounded-xl p-4 flex gap-3 text-sm items-start">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">{t("error_title")}</span>
                <p className="mt-1">{apiError}</p>
                <button
                  onClick={() => setApiError(null)}
                  className="mt-2 text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded font-medium hover:bg-rose-200 transition-colors cursor-pointer"
                >
                  {t("close_btn")}
                </button>
              </div>
            </div>
          )}

          {!activeSubject ? (
            /* Blank state workspace if no subject is loaded/created */
            <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200 dark:border-[#1e2d4d] p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-2xl mx-auto my-12 transition-colors">
              <div className="w-full max-w-md overflow-hidden rounded-2xl mb-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <img
                  src="/src/assets/images/study_master_banner_1783569095165.jpg"
                  alt="Study Master AI Banner"
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">{t("no_subject_selected")}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
                {t("no_subject_desc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setSubjects([prepopulatedSubject]);
                    setActiveSubjectId(prepopulatedSubject.id);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-3 rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  {t("load_sample_subject")}
                </button>
                <button
                  onClick={() => setIsCreatingSubject(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl text-sm shadow-md shadow-indigo-100 transition-colors cursor-pointer"
                >
                  {t("add_own_subject")}
                </button>
              </div>
            </div>
          ) : (
            /* Sub-tab Workspaces rendered conditionally */
            <>
              {/* STEP 1: Syllabus Analysis */}
              {activeTab === "analysis" && (
                <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-[#1e2d4d] p-5 sm:p-6 shadow-xs flex flex-col gap-6 transition-colors">
                  <div>
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Compass className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
                          <span>{t("step1_title")}: {formatBilingualText(activeSubject.subjectName, selectedLanguage)}</span>
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {t("step1_desc")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Units rendering */}
                  <div className="flex flex-col gap-6">
                    {activeSubject.analysis.units.map((unit, uIdx) => (
                      <div key={uIdx} className="border border-slate-100 dark:border-[#1e2d4d] rounded-xl overflow-hidden shadow-xs">
                        {/* Unit Header */}
                        <div className="bg-slate-50 dark:bg-[#1a2642]/60 px-4 py-3 border-b border-slate-100 dark:border-[#1e2d4d] flex justify-between items-center flex-wrap gap-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                            {formatBilingualText(unit.name, selectedLanguage)}
                          </h4>
                          <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/40">
                            {unit.topics.length} {t("step1_topics_count")}
                          </span>
                        </div>

                        {/* Topics Lists */}
                        <div className="divide-y divide-slate-100 dark:divide-[#1e2d4d]">
                          {unit.topics.map((topic, tIdx) => {
                            const isTopicDone = activeSubject.completedTopics.includes(topic.name);
                            return (
                              <div
                                key={tIdx}
                                className={`p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start transition-colors ${
                                  isTopicDone ? "bg-emerald-500/10" : "hover:bg-slate-50/40 dark:hover:bg-[#1a2642]/30"
                                }`}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                                      {formatBilingualText(topic.name, selectedLanguage)}
                                    </h5>
                                    
                                    {/* Difficulty and Importance tags */}
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
                                        topic.importance === "High"
                                          ? "bg-rose-50 text-rose-700 border border-rose-100"
                                          : topic.importance === "Medium"
                                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                                          : "bg-slate-50 dark:bg-[#1a2642] text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-[#22355e]"
                                      }`}
                                    >
                                      {topic.importance === "High"
                                        ? t("importance_high")
                                        : topic.importance === "Medium"
                                        ? t("importance_medium")
                                        : t("importance_low")}
                                    </span>

                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                        topic.difficulty === "Hard"
                                          ? "bg-red-50 text-red-600"
                                          : topic.difficulty === "Medium"
                                          ? "bg-blue-50 text-blue-600"
                                          : "bg-emerald-50 text-emerald-600"
                                      }`}
                                    >
                                      {topic.difficulty === "Hard"
                                        ? t("difficulty_hard")
                                        : topic.difficulty === "Medium"
                                        ? t("difficulty_medium")
                                        : t("difficulty_easy")}
                                    </span>

                                    <span className="text-[10px] bg-slate-100 dark:bg-[#1a2642] text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono font-bold">
                                      {topic.weightagePercent}% {t("weightage")}
                                    </span>
                                  </div>

                                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                                    {formatBilingualText(topic.description, selectedLanguage)}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-center sm:self-start mt-2 sm:mt-0">
                                  <button
                                    onClick={() => toggleTopicCompleted(topic.name)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                      isTopicDone
                                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                        : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
                                    }`}
                                  >
                                    <CheckCircle className={`w-3.5 h-3.5 ${isTopicDone ? "fill-emerald-500 text-white" : ""}`} />
                                    <span>
                                      {isTopicDone ? t("completed") : t("mark_done")}
                                    </span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveTab("notes");
                                      setSelectedNoteTopic(topic.name);
                                    }}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                                    title={t("step2")}
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Notes & Explanations */}
              {activeTab === "notes" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Notes Navigator list */}
                  <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-[#1e2d4d] p-4 shadow-xs h-fit flex flex-col gap-2 transition-colors">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider px-2 mb-2">
                      {t("topics_list_header")}
                    </h4>
                    <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-1">
                      {activeSubject.notes.map((note, idx) => {
                        const isDone = activeSubject.completedTopics.includes(note.topicName);
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedNoteTopic(note.topicName)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              selectedNoteTopic === note.topicName
                                ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-l-4 border-indigo-600 font-bold"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a2642]/40"
                            }`}
                          >
                            <span className="truncate flex items-center gap-1.5">
                              {isDone ? (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 shrink-0" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0"></span>
                              )}
                              <span className="truncate">{formatBilingualText(note.topicName, selectedLanguage)}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes Content Display */}
                  <div className="md:col-span-2 flex flex-col gap-5">
                    {(() => {
                      const note = activeSubject.notes.find((n) => n.topicName === selectedNoteTopic);
                      if (!note) {
                        return (
                          <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-[#1e2d4d] p-8 text-center text-slate-400 dark:text-slate-500 transition-colors">
                            {t("select_topic_to_read")}
                          </div>
                        );
                      }

                      const isDone = activeSubject.completedTopics.includes(note.topicName);
                      const { english, tamil } = splitExplanation(note.tamilExplanation);

                      return (
                        <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-[#1e2d4d] p-5 sm:p-6 shadow-xs flex flex-col gap-6 transition-colors">
                          {/* Note Title */}
                          <div className="flex justify-between items-start gap-4 flex-wrap border-b border-slate-100 dark:border-[#1e2d4d] pb-4">
                            <div>
                              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider block uppercase mb-1">
                                {t("step2_subtitle")}
                              </span>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                                {formatBilingualText(note.topicName, selectedLanguage)}
                              </h3>
                            </div>
                            <button
                              onClick={() => toggleTopicCompleted(note.topicName)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                                isDone
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                              }`}
                            >
                              <CheckCircle className={`w-4 h-4 ${isDone ? "fill-emerald-500 text-emerald-100" : ""}`} />
                              <span>
                                {isDone ? t("completed") : t("mark_as_read")}
                              </span>
                            </button>
                          </div>

                          {/* Explanation (📝 Notes) */}
                          <div className="flex flex-col gap-4">
                            {/* Render English if English selected or if Tamil explanation is empty */}
                            {(selectedLanguage === "english" || !tamil) && (english || !tamil) && (
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-2 flex items-center gap-1.5">
                                  <span className="w-1 h-4 bg-emerald-500 rounded-sm"></span>
                                  <span>{t("explanation_header")}:</span>
                                </h4>
                                <div className="bg-slate-50/55 dark:bg-[#1c2842]/40 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-[#22355e]/60 whitespace-pre-line">
                                  {english || tamil}
                                </div>
                              </div>
                            )}

                            {/* Render Tamil if Tamil selected */}
                            {selectedLanguage === "tamil" && tamil && (
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-2 flex items-center gap-1.5">
                                  <span className="w-1 h-4 bg-indigo-500 rounded-sm"></span>
                                  <span>{t("explanation_header")}:</span>
                                </h4>
                                <div className="bg-slate-50/55 dark:bg-[#1c2842]/40 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-[#22355e]/60 whitespace-pre-line">
                                  {tamil}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Bullet notes */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="bg-[#f0f9ff]/50 dark:bg-sky-950/20 border border-[#e0f2fe] dark:border-sky-900/30 rounded-xl p-4">
                              <h5 className="font-bold text-[#0369a1] dark:text-sky-400 text-xs uppercase tracking-wider mb-2">
                                📌 {t("revision_notes")}
                              </h5>
                              <ul className="space-y-2 text-xs text-[#0c4a6e] dark:text-sky-300 list-disc list-inside">
                                {note.shortNotes.map((pt, i) => (
                                  <li key={i}>{formatBilingualText(pt, selectedLanguage)}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-[#f0fdf4]/50 dark:bg-emerald-950/20 border border-[#dcfce7] dark:border-emerald-900/30 rounded-xl p-4">
                              <h5 className="font-bold text-[#15803d] dark:text-emerald-400 text-xs uppercase tracking-wider mb-2">
                                ⭐ {t("important_points")}
                              </h5>
                              <ul className="space-y-2 text-xs text-[#14532d] dark:text-emerald-300 list-disc list-inside">
                                {note.importantPoints.map((pt, i) => (
                                  <li key={i}>{formatBilingualText(pt, selectedLanguage)}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Memory tricks (🧠 Memory Tricks) */}
                          <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4">
                            <h4 className="font-bold text-amber-800 dark:text-amber-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Zap className="w-4 h-4 text-amber-600" />
                              <span>{t("memory_trick")}</span>
                            </h4>
                            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                              {formatBilingualText(note.memoryTricks, selectedLanguage)}
                            </p>
                          </div>

                          {/* Visualization Diagram */}
                          {note.visualDiagram && (
                            <TopicVisualizer
                              diagram={note.visualDiagram}
                              isDarkMode={isDarkMode}
                            />
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* STEP 3: Question Generator (❓ Questions in POML) */}
              {activeTab === "questions" && (
                <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-[#1e2d4d] p-5 sm:p-6 shadow-xs flex flex-col gap-6 transition-colors">
                  {/* Questions sub-navigation */}
                  <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-100 dark:border-[#1e2d4d] pb-4 gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <HelpCircle className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
                        <span>❓ {t("step3_title")}</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t("step3_desc")}
                      </p>
                    </div>

                    <div className="flex rounded-lg bg-slate-100 dark:bg-[#1a2642] p-1 self-stretch sm:self-auto overflow-x-auto">
                      <button
                        onClick={() => setQuestionsType("mcq")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          questionsType === "mcq" ? "bg-white dark:bg-[#131c31] text-indigo-700 dark:text-indigo-300 shadow-xs" : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {t("mcq_tab")}
                      </button>
                      <button
                        onClick={() => setQuestionsType("2marks")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          questionsType === "2marks" ? "bg-white dark:bg-[#131c31] text-indigo-700 dark:text-indigo-300 shadow-xs" : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {t("marks_tab", { count: 2 })}
                      </button>
                      <button
                        onClick={() => setQuestionsType("5marks")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          questionsType === "5marks" ? "bg-white dark:bg-[#131c31] text-indigo-700 dark:text-indigo-300 shadow-xs" : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {t("marks_tab", { count: 5 })}
                      </button>
                      <button
                        onClick={() => setQuestionsType("10marks")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          questionsType === "10marks" ? "bg-white dark:bg-[#131c31] text-indigo-700 dark:text-indigo-300 shadow-xs" : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {t("marks_tab", { count: 10 })}
                      </button>
                    </div>
                  </div>

                  {/* Render MCQs */}
                  {questionsType === "mcq" && (
                    <div className="flex flex-col gap-6">
                      {activeSubject.questions.mcqs.map((mcq, mIdx) => {
                        const chosenAnswer = mcqAnswers[mIdx];
                        const showExplanation = showMcqExplanations[mIdx];
                        const isCorrect = chosenAnswer === mcq.correctAnswerIndex;

                        return (
                          <div key={mIdx} className="border border-slate-100 dark:border-[#1e2d4d] rounded-2xl p-5 shadow-xs bg-slate-50/40 dark:bg-[#1c2842]/20">
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                              MCQ {mIdx + 1}
                            </span>
                            <h4 className="font-semibold text-slate-900 dark:text-white mt-2.5 text-sm sm:text-base leading-snug">
                              {formatBilingualText(mcq.question, selectedLanguage)}
                            </h4>

                            {/* Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                              {mcq.options.map((option, oIdx) => {
                                let btnStyle = "bg-white dark:bg-[#131c31] border-slate-200 dark:border-[#1e2d4d] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1a2642]";
                                if (chosenAnswer !== undefined) {
                                  if (oIdx === mcq.correctAnswerIndex) {
                                    btnStyle = "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold";
                                  } else if (chosenAnswer === oIdx) {
                                    btnStyle = "bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300";
                                  } else {
                                    btnStyle = "bg-white dark:bg-[#131c31] border-slate-100 dark:border-[#1e2d4d] text-slate-400 opacity-60";
                                  }
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    disabled={chosenAnswer !== undefined}
                                    onClick={() => {
                                      setMcqAnswers(prev => ({ ...prev, [mIdx]: oIdx }));
                                      setShowMcqExplanations(prev => ({ ...prev, [mIdx]: true }));
                                    }}
                                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${btnStyle} ${
                                      chosenAnswer === undefined ? "cursor-pointer" : ""
                                    }`}
                                  >
                                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    <span>{formatBilingualText(option, selectedLanguage)}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            {showExplanation && (
                              <div className={`mt-4 p-4 rounded-xl border text-xs ${
                                isCorrect
                                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300"
                                  : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900 text-rose-900 dark:text-rose-300"
                              }`}>
                                <p className="font-bold flex items-center gap-1.5 mb-1">
                                  {isCorrect ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                                  )}
                                  <span>
                                    {isCorrect ? t("mcq_correct") : t("mcq_incorrect")}{" "}
                                    Option {String.fromCharCode(65 + mcq.correctAnswerIndex)}
                                  </span>
                                </p>
                                <p className="leading-relaxed mt-2 pl-5 whitespace-pre-line">
                                  {formatBilingualText(mcq.explanation, selectedLanguage)}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Render 2, 5, 10 Marks */}
                  {questionsType !== "mcq" && (
                    <div className="flex flex-col gap-6">
                      {(() => {
                        const targetList =
                          questionsType === "2marks"
                            ? activeSubject.questions.twoMarks
                            : questionsType === "5marks"
                            ? activeSubject.questions.fiveMarks
                            : activeSubject.questions.tenMarks;

                        if (!targetList || targetList.length === 0) {
                          return (
                            <p className="text-center text-slate-400 dark:text-slate-500 py-6 text-xs">
                              {t("no_questions")}
                            </p>
                          );
                        }

                        return targetList.map((q, idx) => (
                          <div key={idx} className="border border-slate-100 dark:border-[#1e2d4d] rounded-2xl overflow-hidden shadow-xs transition-colors">
                            <div className="bg-slate-50/70 dark:bg-[#1a2642]/60 p-4 border-b border-slate-100 dark:border-[#1e2d4d] flex justify-between items-center flex-wrap gap-2">
                              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/40">
                                {t("question_label")} {idx + 1}
                              </span>
                              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                                {questionsType === "2marks" ? "2 Marks" : questionsType === "5marks" ? "5 Marks" : "10 Marks"}
                              </span>
                            </div>

                            <div className="p-4 sm:p-5 flex flex-col gap-4">
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                                {formatBilingualText(q.question, selectedLanguage)}
                              </h4>

                              <div className="bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/30 rounded-xl p-4 flex flex-col gap-4">
                                {/* Render Tamil Answer Outline if Tamil selected or if English answer is empty */}
                                {(selectedLanguage === "tamil" || !q.answerEnglish) && q.answerTamil && (
                                  <div>
                                    <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-1.5">
                                      🔑 {t("answer_key_label")}
                                    </span>
                                    <p className="text-xs text-indigo-955 dark:text-indigo-200 leading-relaxed whitespace-pre-line">
                                      {q.answerTamil}
                                    </p>
                                  </div>
                                )}

                                {/* Render English Answer Outline if English selected */}
                                {selectedLanguage === "english" && (q.answerEnglish || q.answerTamil) && (
                                  <div>
                                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1.5">
                                      🔑 {t("answer_key_label")}
                                    </span>
                                    <p className="text-xs text-emerald-955 dark:text-emerald-200 leading-relaxed whitespace-pre-line">
                                      {q.answerEnglish || q.answerTamil}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Study Plan & Timetable (📅 Study Plan in POML) */}
              {activeTab === "plan" && (
                <div className="flex flex-col gap-6">
                  {/* Timetable schedule list */}
                  <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-[#1e2d4d] p-5 sm:p-6 shadow-xs flex flex-col gap-6 transition-colors">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
                        <span>📅 {t("step4_title")}</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t("step4_desc")}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeSubject.studyPlan.dailySchedule.map((day, idx) => (
                        <div key={idx} className="border border-slate-100 dark:border-[#1e2d4d] rounded-2xl p-4 bg-slate-50/40 dark:bg-[#1c2842]/20 hover:bg-slate-50 dark:hover:bg-[#1c2842]/40 flex flex-col justify-between transition-colors shadow-xs">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/40">
                                {day.dateString}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                {day.studyDurationHours} {t("hours_label")}
                              </span>
                            </div>

                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-2">
                              {t("topics_to_cover")}
                            </h4>
                            <ul className="space-y-1.5 mb-4">
                              {day.topicsToCover.map((topic, tIdx) => {
                                const isDone = activeSubject.completedTopics.includes(topic);
                                return (
                                  <li key={tIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isDone ? "bg-emerald-500" : "bg-indigo-500"}`}></span>
                                    <span className={isDone ? "line-through text-slate-400" : ""}>{formatBilingualText(topic, selectedLanguage)}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                          <div className="bg-white dark:bg-[#131c31] border border-slate-100 dark:border-[#1e2d4d] rounded-lg p-2.5 text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">💡 {t("focus_tip_label")}</span>
                            {formatBilingualText(day.focusTips, selectedLanguage)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revision Schedule & Improvement Tips */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Revision schedule */}
                    <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-[#1e2d4d] p-5 shadow-xs flex flex-col gap-4 transition-colors">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <RotateCcw className="w-4 h-4 text-emerald-500" />
                        <span>{t("revision_schedule_header")}</span>
                      </h4>
                      <div className="flex flex-col gap-3.5">
                        {activeSubject.studyPlan.revisionSchedule.map((rev, idx) => (
                          <div key={idx} className="border border-emerald-100 dark:border-emerald-900/30 bg-[#f0fdf4]/30 dark:bg-emerald-950/10 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300">
                            <div className="flex justify-between items-center mb-1.5 flex-wrap gap-1">
                              <span className="font-bold text-emerald-700 dark:text-emerald-400">{rev.dateString}</span>
                              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold uppercase">Active Recall</span>
                            </div>
                            <p className="mb-2"><strong>{t("revise_label")}:</strong> {rev.topics.map(t => formatBilingualText(t, selectedLanguage)).join(", ")}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal bg-white dark:bg-[#131c31] p-2 rounded border border-emerald-50 dark:border-emerald-950/30">
                              <strong>{t("methodology_label")}</strong> {formatBilingualText(rev.method, selectedLanguage)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weak Area Tips */}
                    <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-[#1e2d4d] p-5 shadow-xs flex flex-col gap-4 transition-colors">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-amber-500" />
                        <span>{t("weak_areas_header")}</span>
                      </h4>
                      <ul className="space-y-3">
                        {activeSubject.studyPlan.weakAreaImprovementTips.map((tip, idx) => (
                          <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30 flex items-center justify-center font-bold shrink-0 text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed mt-0.5">{formatBilingualText(tip, selectedLanguage)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Exam Mode (Mock Test / Eval) */}
              {activeTab === "exam" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Mock test panel */}
                  <div className="lg:col-span-2 bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-[#1e2d4d] p-5 sm:p-6 shadow-xs flex flex-col gap-5 transition-colors">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Zap className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
                        <span>📝 {t("mock_test_arena")}</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t("mock_test_arena_desc")}
                      </p>
                    </div>

                    {/* Question Box */}
                    <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-900/40">
                          {t("question_label")}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                          {examMarks} {t("exam_marks")}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-snug">
                        {formatBilingualText(examQuestion, selectedLanguage)}
                      </h4>
                      <div className="flex justify-end">
                        <button
                          onClick={selectMockExamQuestion}
                          className="text-xs text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{t("switch_question_btn")}</span>
                        </button>
                      </div>
                    </div>

                    {/* Answer area */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="student-answer-area" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {t("your_answer_label")}
                      </label>
                      <textarea
                        id="student-answer-area"
                        value={studentAnswer}
                        onChange={(e) => setStudentAnswer(e.target.value)}
                        placeholder={t("answer_placeholder")}
                        className="w-full min-h-[160px] bg-white dark:bg-[#1a2642]/40 border border-slate-200 dark:border-[#22355e] rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-900 dark:text-white whitespace-pre-wrap"
                      />
                      <p className="text-[11px] text-slate-400 dark:text-slate-550">
                        {t("mixed_language_tip")}
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-[#1e2d4d] pt-4">
                      <button
                        onClick={handleEvaluateAnswer}
                        disabled={isEvaluating}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl px-5 py-3 text-sm flex items-center gap-2 shadow-md shadow-indigo-100 dark:shadow-none transition-colors cursor-pointer"
                      >
                        {isEvaluating ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>
                              {t("evaluating_progress")}
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>{t("evaluate_btn")}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Evaluation Result if submitted */}
                    {evaluationResult && (
                      <div className="border-t border-slate-200 dark:border-[#1e2d4d] pt-5 flex flex-col gap-5">
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-[#1a2642]/60 p-4 rounded-xl border border-slate-100 dark:border-[#1e2d4d]">
                          <div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                              {t("score_label")}
                            </span>
                            <span className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 mt-1 block">{evaluationResult.score} / 10</span>
                          </div>
                          <span className="text-sm font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40 px-3 py-1 rounded-lg">
                            {evaluationResult.score >= 8
                              ? t("score_excellent")
                              : evaluationResult.score >= 5
                              ? t("score_good")
                              : t("score_improvement")}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-4">
                            <h5 className="font-bold text-emerald-800 dark:text-emerald-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{t("strengths_label")}</span>
                            </h5>
                            <p className="text-xs text-emerald-955 dark:text-emerald-300 leading-relaxed whitespace-pre-line">
                              {formatBilingualText(evaluationResult.strengths, selectedLanguage)}
                            </p>
                          </div>

                          <div className="bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-xl p-4">
                            <h5 className="font-bold text-rose-800 dark:text-rose-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>{t("weaknesses_label")}</span>
                            </h5>
                            <p className="text-xs text-rose-955 dark:text-rose-300 leading-relaxed whitespace-pre-line">
                              {formatBilingualText(evaluationResult.weaknesses, selectedLanguage)}
                            </p>
                          </div>
                        </div>

                        <div className="border border-indigo-100 dark:border-indigo-900/30 rounded-xl overflow-hidden shadow-xs">
                          <div className="bg-indigo-50/60 dark:bg-[#1a2642]/60 p-3 border-b border-indigo-100 dark:border-indigo-900/30 font-bold text-indigo-800 dark:text-indigo-400 text-xs uppercase tracking-wider">
                            {t("perfect_answer_header")}
                          </div>
                          <div className="p-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-indigo-50/20 dark:bg-indigo-950/10">
                            {formatBilingualText(evaluationResult.perfectAnswer, selectedLanguage)}
                          </div>
                        </div>

                        <div className="bg-amber-50/60 dark:bg-amber-950/10 border border-amber-100 dark:border-[#1e2d4d] rounded-xl p-4">
                          <span className="text-xs font-bold text-amber-800 dark:text-amber-400 block mb-1">
                            💡 {t("tutor_feedback_label")}
                          </span>
                          <p className="text-xs text-amber-955 dark:text-amber-200 leading-relaxed">
                            {formatBilingualText(evaluationResult.tamilExplanation, selectedLanguage)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right column of exam mode: mock test history */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs h-fit flex flex-col gap-4">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <span>{t("exam_history_title")}</span>
                    </h4>

                    {(!activeSubject.mockExamHistory || activeSubject.mockExamHistory.length === 0) ? (
                      <p className="text-xs text-slate-400 py-6 text-center leading-normal">
                        {t("history_empty")}
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
                        {activeSubject.mockExamHistory.map((item, idx) => (
                          <div key={idx} className="border border-slate-100 dark:border-[#1e2d4d] rounded-xl p-3 text-xs bg-slate-50/55 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-mono text-[10px] text-slate-400">{item.date}</span>
                              <span className="font-extrabold text-indigo-700 dark:text-indigo-400 bg-white dark:bg-[#131c31] border border-slate-100 dark:border-[#1e2d4d] px-2 py-0.5 rounded">
                                {item.evaluation.score} / 10
                              </span>
                            </div>
                            <p className="font-bold text-slate-700 dark:text-slate-200 line-clamp-2 mb-1.5">{item.question}</p>
                            <button
                              onClick={() => {
                                setExamQuestion(item.question);
                                setExamMarks(item.marks);
                                setStudentAnswer(item.studentAnswer);
                                setEvaluationResult(item.evaluation);
                              }}
                              className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                            >
                              {t("view_detail_btn")}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Persistent Live AI Tutor Floating Chatbot (💬 Client Chat in POML) */}
      {activeSubject && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          {chatOpen ? (
            <div className="w-[330px] sm:w-[380px] h-[450px] bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-[#1e2d4d] shadow-xl overflow-hidden flex flex-col mb-3 animate-fade-in-up">
              {/* Chat Header */}
              <div className="bg-indigo-600 p-3.5 text-white flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">{t("bot_title")}</h4>
                    <span className="text-[10px] text-indigo-200">{t("bot_subtitle")}</span>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-white hover:text-indigo-100 text-lg cursor-pointer"
                  title={t("close_btn")}
                >
                  ✕
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 dark:bg-[#1c2842]/40">
                {chatHistory.length === 0 && (
                  <div className="text-center text-slate-400 dark:text-slate-550 py-12 px-4 flex flex-col items-center">
                    <MessageSquare className="w-8 h-8 text-slate-300 mb-2.5" />
                    <p className="text-xs leading-relaxed">
                      {t("bot_welcome")}
                    </p>
                  </div>
                )}

                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex flex-col ${chat.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      chat.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white dark:bg-[#131c31] border border-slate-200 dark:border-[#1e2d4d] text-slate-800 dark:text-slate-200 rounded-bl-none shadow-xs"
                    }`}>
                      {chat.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">{chat.timestamp}</span>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-center gap-2.5 text-slate-400 text-xs">
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    <span>{t("bot_typing")}</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-100 dark:border-[#1e2d4d] flex gap-2 bg-white dark:bg-[#131c31]">
                <input
                  id="chat-input-box"
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={t("bot_input_placeholder")}
                  className="flex-1 bg-white dark:bg-[#1a2642]/40 border border-slate-200 dark:border-[#22355e] text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : null}

          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full p-4 shadow-lg hover:shadow-indigo-200/50 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">{t("bot_launcher")}</span>
          </button>
        </div>
      )}

      {/* New Subject Dialog / Form */}
      {isCreatingSubject && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 flex flex-col gap-6 animate-scale-up">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                  <BookMarked className="text-indigo-600 w-5 h-5" />
                  <span>{t("create_title")}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">{t("create_subtitle")}</p>
              </div>
              <button
                onClick={() => {
                  if (loadingStep === null) setIsCreatingSubject(false);
                }}
                disabled={loadingStep !== null}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer disabled:opacity-40"
              >
                ✕
              </button>
            </div>

            {loadingStep !== null ? (
              /* Loading pipeline screen */
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-6">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                  <span className="absolute font-bold text-xs text-indigo-700">{loadingStep}/4</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t("ai_analyzing")}</h4>
                  <p className="text-xs text-indigo-700 font-semibold mt-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full inline-block">
                    {loadingText}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-3 max-w-xs leading-normal">
                    {t("ai_analyzing_desc")}
                  </p>
                </div>
              </div>
            ) : (
              /* Actual input fields */
              <form onSubmit={handleCreateSystem} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="course-input" className="text-xs font-bold text-slate-700">{t("form_course_label")}</label>
                  <input
                    id="course-input"
                    type="text"
                    required
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder={t("form_course_placeholder")}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject-input" className="text-xs font-bold text-slate-700">{t("form_subject_label")}</label>
                  <input
                    id="subject-input"
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder={t("form_subject_placeholder")}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="syllabus-input" className="text-xs font-bold text-slate-700">{t("form_syllabus_label")}</label>
                  <textarea
                    id="syllabus-input"
                    required
                    value={syllabusRaw}
                    onChange={(e) => setSyllabusRaw(e.target.value)}
                    placeholder={t("form_syllabus_placeholder")}
                    className="w-full min-h-[120px] border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="examdate-input" className="text-xs font-bold text-slate-700">{t("form_examdate_label")}</label>
                    <input
                      id="examdate-input"
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="studytime-input" className="text-xs font-bold text-slate-700">{t("form_studytime_label")}</label>
                    <input
                      id="studytime-input"
                      type="text"
                      value={studyTime}
                      onChange={(e) => setStudyTime(e.target.value)}
                      placeholder={t("form_studytime_placeholder")}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingSubject(false)}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t("modal_cancel")}
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-colors cursor-pointer"
                  >
                    {t("form_submit_btn")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
